import { apiClient } from '../../../services/apiClient';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials);
  },

  register: async (data: RegisterData): Promise<unknown> => {
    return apiClient.post('/api/user/register', data);
  },
};
