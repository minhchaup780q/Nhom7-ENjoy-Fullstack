import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socketInstance: Socket | null = null;

export const getChatSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO Client] Đã kết nối tới Socket Service tại:', SOCKET_SERVER_URL);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket.IO Client] Lỗi kết nối Socket Service:', err.message);
    });
  }

  return socketInstance;
};
