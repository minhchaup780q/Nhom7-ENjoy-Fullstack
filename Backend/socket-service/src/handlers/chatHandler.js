import redis from '../config/redis.js';

const CHAT_ROOM_PREFIX = 'chat:room:';

/**
 * Module xử lý Real-time Chat qua Socket.IO:
 * - Hỗ trợ phòng chat nhóm / chat 1-1 / chat lớp học
 * - Gửi & nhận tin nhắn tức thời
 * - Hiển thị trạng thái đang nhập (typing indicator)
 * - Tương thích lưu trữ lịch sử tin nhắn vào Redis
 */
export function initChatHandler(io) {
  io.on('connection', (socket) => {
    // 1. Tham gia phòng chat
    socket.on('chat:join_room', async ({ roomId, userId, username }) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`[Chat] User ${username || userId || socket.id} đã tham gia phòng: ${roomId}`);

      socket.to(roomId).emit('chat:user_joined', {
        userId,
        username,
        message: `${username || 'Một người dùng'} đã tham gia cuộc trò chuyện`,
        timestamp: new Date().toISOString(),
      });
    });

    // 2. Rời phòng chat
    socket.on('chat:leave_room', ({ roomId, userId, username }) => {
      if (!roomId) return;
      socket.leave(roomId);
      console.log(`[Chat] User ${username || userId || socket.id} đã rời phòng: ${roomId}`);

      socket.to(roomId).emit('chat:user_left', {
        userId,
        username,
        timestamp: new Date().toISOString(),
      });
    });

    // 3. Gửi tin nhắn trong phòng
    socket.on('chat:send_message', async ({ roomId, senderId, senderName, avatarUrl, content, messageType = 'TEXT' }) => {
      if (!roomId || !content) return;

      const messagePayload = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        roomId,
        senderId,
        senderName: senderName || 'Người dùng',
        avatarUrl,
        content,
        messageType,
        createdAt: new Date().toISOString(),
      };

      // Lưu 100 tin nhắn gần nhất vào Redis List cho phòng này (nếu cần lịch sử)
      try {
        const historyKey = `${CHAT_ROOM_PREFIX}${roomId}:messages`;
        await redis.rpush(historyKey, JSON.stringify(messagePayload));
        await redis.ltrim(historyKey, -100, -1); // Giữ tối đa 100 tin gần nhất
      } catch (err) {
        console.warn(`[Chat] Không thể lưu lịch sử tin nhắn vào Redis:`, err.message);
      }

      // Phát tin nhắn tới tất cả thành viên trong phòng (bao gồm cả người gửi nếu cần xác nhận)
      io.to(roomId).emit('chat:receive_message', messagePayload);
    });

    // 4. Lấy lịch sử tin nhắn phòng chat
    socket.on('chat:get_history', async ({ roomId, limit = 50 }, callback) => {
      if (!roomId) return;
      try {
        const historyKey = `${CHAT_ROOM_PREFIX}${roomId}:messages`;
        const rawList = await redis.lrange(historyKey, -limit, -1);
        const messages = rawList.map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }).filter(Boolean);

        if (typeof callback === 'function') {
          callback({ success: true, messages });
        } else {
          socket.emit('chat:history_response', { roomId, messages });
        }
      } catch (err) {
        console.error(`[Chat] Lỗi lấy lịch sử tin nhắn:`, err.message);
      }
    });

    // 5. Trạng thái đang nhập văn bản (Typing Indicator)
    socket.on('chat:typing', ({ roomId, userId, username }) => {
      if (!roomId) return;
      socket.to(roomId).emit('chat:user_typing', { roomId, userId, username });
    });

    socket.on('chat:stop_typing', ({ roomId, userId }) => {
      if (!roomId) return;
      socket.to(roomId).emit('chat:user_stop_typing', { roomId, userId });
    });
  });

  console.log('[ChatHandler] Đã sẵn sàng module Socket.IO Chat Real-time');
}
