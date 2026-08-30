import { apiClient } from '../../../services/apiClient';
import type {
  LoginCredentials,
  RegisterData,
  VerifyOtpData,
  ResendOtpData,
  ChangePasswordData,
  AuthResponse,
} from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials);
  },

  register: async (data: RegisterData): Promise<void> => {
    return apiClient.post<void>('/api/auth/register', data);
  },

  verifyOtp: async (data: VerifyOtpData): Promise<void> => {
    return apiClient.post<void>('/api/auth/verify-otp', data);
  },

  resendOtp: async (data: ResendOtpData): Promise<void> => {
    return apiClient.post<void>('/api/auth/resend-otp', data);
  },

  changePassword: async (data: ChangePasswordData): Promise<void> => {
    return apiClient.post<void>('/api/auth/change-password', data);
  },

  googleAuth: async (data: { email: string; name?: string; googleId?: string; birthday?: string }): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login-by-google', data);
  },
};
