# ENjoy Socket Service (Real-time Socket.IO Microservice)

Microservice Node.js chuyên biệt đảm nhiệm tất cả các tác vụ **thời gian thực (Real-time)** qua **Socket.IO** cho toàn bộ hệ thống ENjoy:
1. **Leaderboard Real-time**: Lấy Top 10 từ Redis ZSET (`ZREVRANGE`) và broadcast tự động mỗi 1 giây xuống tất cả client kết nối.
2. **Chat Real-time**: Tham gia phòng chat, gửi/nhận tin nhắn tức thì, hiển thị trạng thái đang soạn tin (typing indicator) và lưu trữ lịch sử tin nhắn.

---

## 1. Yêu cầu môi trường
- Node.js >= 18
- Redis Server (ZSET được cập nhật bởi `learning-service` Java Spring Boot)

## 2. Cài đặt & Chạy
```bash
cd Backend/socket-service
npm install

# Chạy môi trường phát triển (tự động reload khi sửa code)
npm run dev

# Chạy môi trường production
npm start
```

## 3. Cấu hình (.env)
```env
PORT=9092
NODE_ENV=development
CLIENT_ORIGIN=*

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Leaderboard Settings
LEADERBOARD_TOURNAMENT_ID=1
LEADERBOARD_INTERVAL_MS=1000
```

## 4. Các sự kiện Socket.IO (Event API)

### 🏆 Leaderboard
| Hướng | Tên Event | Mô tả | Payload |
|---|---|---|---|
| Server -> Client | `leaderboard_update` | Danh sách Top 10 xếp hạng cập nhật mỗi giây | `Array<LeaderboardUserDto>` |
| Server -> Client | `leaderboard:top10` | Alias của Top 10 | `Array<LeaderboardUserDto>` |
| Client -> Server | `request_leaderboard` | Yêu cầu server trả về Top 10 ngay lập tức | Không có |

### 💬 Chat Real-time
| Hướng | Tên Event | Mô tả | Payload |
|---|---|---|---|
| Client -> Server | `chat:join_room` | Tham gia phòng chat | `{ roomId, userId, username }` |
| Client -> Server | `chat:leave_room` | Rời phòng chat | `{ roomId, userId, username }` |
| Client -> Server | `chat:send_message` | Gửi tin nhắn trong phòng | `{ roomId, senderId, senderName, avatarUrl, content, messageType }` |
| Server -> Client | `chat:receive_message`| Nhận tin nhắn mới trong phòng | `{ id, roomId, senderId, senderName, avatarUrl, content, createdAt }` |
| Client -> Server | `chat:typing` | Báo đang nhập tin nhắn | `{ roomId, userId, username }` |
| Client -> Server | `chat:stop_typing` | Báo dừng nhập | `{ roomId, userId }` |
| Client -> Server | `chat:get_history` | Lấy lịch sử tin nhắn phòng | `{ roomId, limit }` |

## 5. REST API Health Check
- `GET http://localhost:9092/health`: Kiểm tra trạng thái service và kết nối Redis.
- `GET http://localhost:9092/api/leaderboard/top10`: Lấy Top 10 xếp hạng tức thời dạng JSON.
