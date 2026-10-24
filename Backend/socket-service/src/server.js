import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import redis from './config/redis.js';
import { initLeaderboardHandler, getTop10FromRedis } from './handlers/leaderboardHandler.js';
import { initChatHandler } from './handlers/chatHandler.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '9092', 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
const httpServer = createServer(app);

// Cấu hình Middleware
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// Khởi tạo Socket.IO Server
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Endpoint kiểm tra trạng thái sức khỏe của Service
app.get('/health', async (req, res) => {
  let redisStatus = 'DISCONNECTED';
  try {
    const pong = await redis.ping();
    if (pong === 'PONG') redisStatus = 'CONNECTED';
  } catch (err) {
    redisStatus = `ERROR: ${err.message}`;
  }

  res.json({
    service: 'enjoy-socket-service',
    status: 'UP',
    port: PORT,
    connectedClients: io.engine.clientsCount,
    redis: redisStatus,
    timestamp: new Date().toISOString(),
  });
});

// REST API hỗ trợ lấy Top 10 trực tiếp từ Redis
app.get('/api/leaderboard/top10', async (req, res) => {
  const tournamentId = req.query.tournamentId || process.env.LEADERBOARD_TOURNAMENT_ID || 1;
  const top10 = await getTop10FromRedis(tournamentId);
  res.json({
    status: 'SUCCESS',
    tournamentId: Number(tournamentId),
    data: top10,
  });
});

// Quản lý sự kiện kết nối chung của Socket.IO
io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;
  console.log(`[Socket.IO] Client kết nối: id=${socket.id}, ip=${clientIp}, tổng số client=${io.engine.clientsCount}`);

  socket.on('disconnect', (reason) => {
    console.log(`[Socket.IO] Client ngắt kết nối: id=${socket.id}, lý do=${reason}, còn lại=${io.engine.clientsCount}`);
  });
});

// Đăng ký các module xử lý Real-time
initLeaderboardHandler(io);
initChatHandler(io);

// Khởi chạy HTTP & WebSocket Server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`🚀 [Socket.IO Server] Đang chạy tại http://0.0.0.0:${PORT}`);
  console.log(`📡 [CORS Origin]: ${CLIENT_ORIGIN}`);
  console.log(`🏆 [Leaderboard Realtime]: Bật tự động broadcast mỗi ${process.env.LEADERBOARD_INTERVAL_MS || 1000}ms`);
  console.log(`💬 [Chat Realtime Module]: Sẵn sàng hoạt động`);
  console.log('====================================================');
});

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n[Socket.IO Server] Nhận tín hiệu ${signal}. Đang đóng server an toàn...`);
  httpServer.close(() => {
    console.log('[Socket.IO Server] Đã đóng HTTP Server');
    redis.quit().then(() => {
      console.log('[Redis] Đã ngắt kết nối Redis');
      process.exit(0);
    });
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
