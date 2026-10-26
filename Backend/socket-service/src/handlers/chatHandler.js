import redis from '../config/redis.js';
import { publishChatMessage } from '../config/rabbitmq.js';

const RECENT_MESSAGES_KEY = 'chat:community:recent_messages';
const MAX_RECENT_CACHE = 50;

// Bộ nhớ đệm lưu thời điểm gửi tin nhắn gần nhất để chống Spam (Rate limit 1 giây/tin)
const userLastMessageTime = new Map();

/**
 * Xử lý toàn bộ logic Chat Cộng Đồng (Community Floating Chat):
 * - Không cần join/leave phòng: Mọi kết nối đều tự động tham gia cộng đồng.
 * - Thuần text, kiểm duyệt độ dài và chống spam.
 * - Broadcast siêu tốc (<10ms) qua Socket.IO.
 * - Lưu đệm 50 tin trong Redis để tải khởi tạo cực nhanh.
 * - Đẩy vào RabbitMQ để lưu trữ bền vững vào MariaDB ở dưới nền.
 */
export function initChatHandler(io) {
  // Hàm cập nhật và phát sóng số lượng người đang online
  const broadcastOnlineCount = () => {
    const onlineCount = io.engine?.clientsCount || 1;
    io.emit('community:online_count', { onlineCount });
  };

  io.on('connection', async (socket) => {
    // 1. Gửi số lượng người đang online khi có client mới kết nối
    broadcastOnlineCount();

    // 2. Gửi ngay 30 tin nhắn gần nhất từ Redis Cache cho client vừa mở web
    try {
      const rawMessages = await redis.lrange(RECENT_MESSAGES_KEY, -30, -1);
      if (rawMessages && rawMessages.length > 0) {
        const messages = rawMessages.map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }).filter(Boolean);

        socket.emit('community:init_history', messages);
      }
    } catch (err) {
      console.warn(`[Chat] Lỗi lấy lịch sử tin nhắn ban đầu từ Redis:`, err.message);
    }

    // 3. Client chủ động yêu cầu lấy lịch sử tin nhắn
    socket.on('community:get_history', async (data, callback) => {
      try {
        const limit = typeof data?.limit === 'number' ? Math.min(data.limit, 50) : 30;
        const rawMessages = await redis.lrange(RECENT_MESSAGES_KEY, -limit, -1);
        const messages = rawMessages.map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }).filter(Boolean);

        if (typeof callback === 'function') {
          callback({ success: true, messages });
        } else {
          socket.emit('community:init_history', messages);
        }
      } catch (err) {
        console.error('[Chat] Lỗi get_history:', err.message);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // 4. Nhận tin nhắn mới từ người dùng
    socket.on('community:send_message', async (payload, callback) => {
      try {
        const { userId, username, avatarUrl, content } = payload || {};

        if (!userId) {
          const errRes = { success: false, message: 'Vui lòng đăng nhập để tham gia trò chuyện cộng đồng!' };
          if (typeof callback === 'function') callback(errRes);
          return socket.emit('community:error', errRes);
        }

        if (!content || !content.trim()) {
          const errRes = { success: false, message: 'Nội dung tin nhắn không được để trống!' };
          if (typeof callback === 'function') callback(errRes);
          return socket.emit('community:error', errRes);
        }

        const trimmedContent = content.trim();
        if (trimmedContent.length > 500) {
          const errRes = { success: false, message: 'Tin nhắn không được vượt quá 500 ký tự!' };
          if (typeof callback === 'function') callback(errRes);
          return socket.emit('community:error', errRes);
        }

        // Chống spam: Mỗi người dùng phải cách nhau ít nhất 1000ms (1 giây)
        const now = Date.now();
        const lastSent = userLastMessageTime.get(userId) || 0;
        if (now - lastSent < 1000) {
          const waitTime = Math.ceil((1000 - (now - lastSent)) / 1000);
          const errRes = { success: false, message: `Bạn đang gửi tin nhắn quá nhanh, vui lòng đợi ${waitTime}s!` };
          if (typeof callback === 'function') callback(errRes);
          return socket.emit('community:error', errRes);
        }
        userLastMessageTime.set(userId, now);

        // Đóng gói tin nhắn chuẩn
        const messagePayload = {
          id: now, // Unique timestamp ID
          userId: Number(userId),
          username: username || `Người dùng #${userId}`,
          avatarUrl: avatarUrl || null,
          content: trimmedContent,
          messageType: 'TEXT',
          createdAt: new Date().toISOString(),
        };

        // BƯỚC 1: Broadcast ngay lập tức tới TẤT CẢ các Client đang mở web (Real-time <10ms)
        io.emit('community:new_message', messagePayload);

        // BƯỚC 2: Lưu vào Redis Cache (giữ tối đa 50 tin mới nhất)
        try {
          await redis.rpush(RECENT_MESSAGES_KEY, JSON.stringify(messagePayload));
          await redis.ltrim(RECENT_MESSAGES_KEY, -MAX_RECENT_CACHE, -1);
        } catch (redisErr) {
          console.warn('[Chat] Lỗi lưu cache Redis:', redisErr.message);
        }

        // BƯỚC 3: Đẩy vào RabbitMQ để lưu bền vững vào MariaDB dưới nền
        publishChatMessage(messagePayload);

        if (typeof callback === 'function') {
          callback({ success: true, message: messagePayload });
        }
      } catch (err) {
        console.error('[Chat] Lỗi gửi tin nhắn:', err.message);
        if (typeof callback === 'function') {
          callback({ success: false, message: 'Đã có lỗi xảy ra khi gửi tin nhắn!' });
        }
      }
    });

    // 5. Hiển thị trạng thái đang soạn tin (Typing Indicator)
    socket.on('community:typing', ({ userId, username }) => {
      socket.broadcast.emit('community:user_typing', { userId, username });
    });

    socket.on('community:stop_typing', ({ userId }) => {
      socket.broadcast.emit('community:user_stop_typing', { userId });
    });

    // 6. Xử lý khi ngắt kết nối
    socket.on('disconnect', () => {
      broadcastOnlineCount();
    });
  });

  console.log('[ChatHandler] Đã sẵn sàng module Chat Cộng Đồng (Global Community Chat)');
}
