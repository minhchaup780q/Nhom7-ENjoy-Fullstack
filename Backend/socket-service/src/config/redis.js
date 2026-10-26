import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000);
    console.warn(`[Redis] Mất kết nối, đang thử kết nối lại sau ${delay}ms (Lần ${times})...`);
    return delay;
  },
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log(`[Redis] Kết nối thành công tới Redis tại ${redisConfig.host}:${redisConfig.port}`);
});

redis.on('error', (err) => {
  console.error('[Redis] Lỗi kết nối Redis:', err.message);
});

export default redis;
