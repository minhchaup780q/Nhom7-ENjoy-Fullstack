import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Cờ và hàng đợi để xử lý bài toán nhiều request bị 401 cùng lúc: chỉ tạo newAccessTOken một lần
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Khởi tạo instace axios (cung cấp 2 bộ chặn request và response)
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request Interceptor: bộ chặn xử lý request trước khi gửi xuống server
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('enjoy_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
)

// Response Interceptor: bộ chặn xử lý khi nhận dữ liệu từ server
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Kiểm tra nếu bị lỗi 401 và chưa từng retry trong chính cái request này
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        // Nếu đang trong quá trình refresh token, cho request này vào hàng đợi chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('enjoy_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gọi API refresh token
        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, null, {
          headers: {
            refreshToken: refreshToken,
          },
        });

        // Backend trả về LoginResponse với { accessToken, refreshToken }
        const newAccessToken = response.data.accessToken || response.data.result?.accessToken;

        if (!newAccessToken) {
          throw new Error('Failed to retrieve new access token');
        }

        // Cập nhật state trong Zustand store và localStorage
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Giải phóng hàng đợi chờ
        processQueue(null, newAccessToken);

        // Gửi lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Khi refresh token không hợp lệ hoặc đã hết hạn
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);




interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export const apiClient = {
  get: async <T>(path: string, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.get<T>(path, options);
    return response.data;
  },

  post: async <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.post<T>(path, body, options);
    return response.data;
  },

  put: async <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.put<T>(path, body, options);
    return response.data;
  },

  delete: async <T>(path: string, options?: RequestOptions): Promise<T> => {
    const response = await axiosInstance.delete<T>(path, options);
    return response.data;
  },
};
