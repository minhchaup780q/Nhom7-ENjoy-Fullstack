import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import redis from './config/redis.js';
import { initRabbitMQ } from './config/rabbitmq.js';
import { initLeaderboardHandler, getTop10FromRedis } from './handlers/leaderboardHandler.js';
import { initChatHandler } from './handlers/chatHandler.js';

dotenv.config();

const DEFAULT_PORT = parseInt(process.env.PORT || '5001', 10);
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
initRabbitMQ();
initLeaderboardHandler(io);
initChatHandler(io);

// Khởi chạy HTTP & WebSocket Server với cơ chế tự động chuyển cổng nếu bị chiếm dụng
function startServer(port) {
  httpServer.removeAllListeners('error');

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      console.warn(`⚠️ [Cảnh báo] Cổng ${port} đang bận hoặc bị giới hạn quyền truy cập (${err.code}). Đang thử cổng ${port + 1}...`);
      setTimeout(() => startServer(port + 1), 300);
    } else {
      console.error('❌ [Lỗi khởi động Server]:', err);
    }
  });

  httpServer.listen(port, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(`🚀 [Socket.IO Server] Đang chạy tại http://localhost:${port}`);
    console.log(`📡 [CORS Origin]: ${CLIENT_ORIGIN}`);
    console.log(`🏆 [Leaderboard Realtime]: Broadcast tự động mỗi ${process.env.LEADERBOARD_INTERVAL_MS || 1000}ms`);
    console.log(`💬 [Chat Realtime Module]: Sẵn sàng hoạt động`);
    console.log('====================================================');
  });
}

startServer(DEFAULT_PORT);

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
