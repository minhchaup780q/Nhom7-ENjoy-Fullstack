import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors and reject with custom ApiError for backward compatibility
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string } | null;
      const message = data?.message || `Yêu cầu API thất bại với mã lỗi ${status}`;
      return Promise.reject(new ApiError(message, status));
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
