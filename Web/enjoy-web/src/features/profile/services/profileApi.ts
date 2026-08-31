import { apiClient } from '../../../services/apiClient';

export interface UserProfile {
  id: number;
  accountId: number;
  email: string;
  username: string;
  avatarUrl?: string;
  role: 'ROLE_CHILDREN' | 'ROLE_PARENT' | 'ROLE_ADMIN' | string;
  parentId?: number;
  birthday?: string;
  dailyTimeLimit?: number;
  createAt?: string;
}

export interface UpdateProfilePayload {
  username?: string;
  birthday?: string;
  avatarUrl?: string;
}

export const profileApi = {
  getProfile: () => {
    return apiClient.get<UserProfile>('/api/user/profile');
  },

  updateProfile: (payload: UpdateProfilePayload) => {
    return apiClient.put<UserProfile>('/api/user/profile', payload);
  },
};
