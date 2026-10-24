import redis from '../config/redis.js';

const ZSET_KEY_PREFIX = 'leaderboard:zset:tournament:';
const HASH_KEY_PREFIX = 'leaderboard:hash:user_info:';

/**
 * Lấy danh sách Top 10 từ Redis ZSET (bằng lệnh ZREVRANGE)
 * kèm metadata từ Redis Hash
 */
export async function getTop10FromRedis(tournamentId = 1) {
  try {
    const zsetKey = `${ZSET_KEY_PREFIX}${tournamentId}`;
    const hashKey = `${HASH_KEY_PREFIX}${tournamentId}`;

    // Lấy 10 phần tử điểm cao nhất cùng score từ Redis ZSET
    // Trả về mảng xen kẽ: [member1, score1, member2, score2, ...]
    const rawTuples = await redis.zrevrange(zsetKey, 0, 9, 'WITHSCORES');

    if (!rawTuples || rawTuples.length === 0) {
      return [];
    }

    const members = [];
    const scores = [];

    for (let i = 0; i < rawTuples.length; i += 2) {
      members.push(rawTuples[i]);
      scores.push(Number(rawTuples[i + 1]) || 0);
    }

    // Đọc metadata (username, avatarUrl) từ Redis Hash cho tất cả các member
    const metaJsons = await Promise.all(
      members.map((member) => redis.hget(hashKey, member))
    );

    const top10 = members.map((member, index) => {
      let username = `Người dùng #${member}`;
      let avatarUrl = null;

      if (metaJsons[index]) {
        try {
          const meta = JSON.parse(metaJsons[index]);
          if (meta.username) username = meta.username;
          if (meta.avatarUrl) avatarUrl = meta.avatarUrl;
        } catch {
          // Bỏ qua lỗi parse JSON metadata
        }
      }

      const rank = index + 1;
      return {
        rank,
        userId: Number(member),
        username,
        avatarUrl,
        weeklyXp: scores[index],
        isCurrentUser: false,
        isPromoting: rank <= 12,
      };
    });

    return top10;
  } catch (error) {
    console.error('[LeaderboardHandler] Lỗi khi lấy Top 10 từ Redis:', error.message);
    return [];
  }
}

/**
 * Khởi tạo socket listeners và luồng Scheduled 1 giây cho Leaderboard
 */
export function initLeaderboardHandler(io) {
  const tournamentId = process.env.LEADERBOARD_TOURNAMENT_ID || 1;
  const intervalMs = parseInt(process.env.LEADERBOARD_INTERVAL_MS || '1000', 10);

  // Đăng ký sự kiện khi Client kết nối Socket
  io.on('connection', async (socket) => {
    // 1. Gửi ngay danh sách Top 10 hiện tại cho Client vừa kết nối
    try {
      const top10 = await getTop10FromRedis(tournamentId);
      if (top10 && top10.length > 0) {
        socket.emit('leaderboard_update', top10);
        socket.emit('leaderboard:top10', top10);
      }
    } catch (err) {
      console.warn(`[Socket ${socket.id}] Lỗi gửi top10 ban đầu:`, err.message);
    }

    // 2. Lắng nghe yêu cầu chủ động lấy Top 10 từ Client
    socket.on('request_leaderboard', async () => {
      const top10 = await getTop10FromRedis(tournamentId);
      socket.emit('leaderboard_update', top10);
    });
  });

  // 3. Luồng định kỳ cứ mỗi 1 giây lấy Top 10 từ Redis ZSET và broadcast xuống toàn bộ Client
  let isBroadcasting = false;
  setInterval(async () => {
    // Tối ưu hiệu năng: Nếu không có client nào đang kết nối thì bỏ qua
    const connectedCount = io.engine?.clientsCount || 0;
    if (connectedCount === 0 || isBroadcasting) {
      return;
    }

    isBroadcasting = true;
    try {
      const top10 = await getTop10FromRedis(tournamentId);
      if (top10 && top10.length > 0) {
        io.emit('leaderboard_update', top10);
        io.emit('leaderboard:top10', top10);
      }
    } catch (error) {
      console.error('[Leaderboard Broadcaster 1s] Lỗi khi broadcast:', error.message);
    } finally {
      isBroadcasting = false;
    }
  }, intervalMs);

  console.log(`[LeaderboardHandler] Đã khởi chạy luồng broadcast Top 10 định kỳ ${intervalMs}ms từ Redis ZSET`);
}
