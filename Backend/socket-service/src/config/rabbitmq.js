import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const CHAT_EXCHANGE = 'chat.exchange';
const CHAT_QUEUE = 'chat.community.queue';
const CHAT_ROUTING_KEY = 'chat.community.routingKey';

let connection = null;
let channel = null;
let isConnecting = false;

/**
 * Khởi tạo kết nối tới RabbitMQ và thiết lập Exchange/Queue
 */
export async function initRabbitMQ() {
  if (channel || isConnecting) return channel;
  isConnecting = true;

  try {
    console.log(`[RabbitMQ] Đang kết nối tới ${RABBITMQ_URL}...`);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Khai báo Direct Exchange và Queue có tính năng bền vững (durable)
    await channel.assertExchange(CHAT_EXCHANGE, 'direct', { durable: true });
    await channel.assertQueue(CHAT_QUEUE, { durable: true });
    await channel.bindQueue(CHAT_QUEUE, CHAT_EXCHANGE, CHAT_ROUTING_KEY);

    console.log(`[RabbitMQ] Kết nối thành công! Đã sẵn sàng gửi tin nhắn vào queue: ${CHAT_QUEUE}`);

    connection.on('error', (err) => {
      console.error('[RabbitMQ] Lỗi kết nối:', err.message);
      reconnect();
    });

    connection.on('close', () => {
      console.warn('[RabbitMQ] Kết nối đã đóng. Đang thử kết nối lại...');
      reconnect();
    });

    isConnecting = false;
    return channel;
  } catch (error) {
    console.error('[RabbitMQ] Không thể kết nối:', error.message);
    isConnecting = false;
    reconnect();
    return null;
  }
}

function reconnect() {
  channel = null;
  connection = null;
  setTimeout(() => {
    initRabbitMQ();
  }, 5000);
}

/**
 * Đẩy tin nhắn Chat Cộng Đồng vào RabbitMQ
 */
export function publishChatMessage(message) {
  if (!channel) {
    console.warn('[RabbitMQ] Kênh chưa sẵn sàng, đang thử kết nối lại để gửi tin...');
    initRabbitMQ().then((ch) => {
      if (ch) {
        ch.publish(CHAT_EXCHANGE, CHAT_ROUTING_KEY, Buffer.from(JSON.stringify(message)), {
          persistent: true,
        });
      }
    });
    return false;
  }

  try {
    const success = channel.publish(
      CHAT_EXCHANGE,
      CHAT_ROUTING_KEY,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    return success;
  } catch (error) {
    console.error('[RabbitMQ] Lỗi khi publish tin nhắn:', error.message);
    return false;
  }
}

export default {
  initRabbitMQ,
  publishChatMessage,
};
