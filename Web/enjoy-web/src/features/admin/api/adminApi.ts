import { apiClient } from '../../../services/apiClient';

export interface UserCountResponse {
  totalUsers: number;
}

export const adminApi = {
  getUserCount: async (): Promise<UserCountResponse> => {
    return apiClient.get<UserCountResponse>('/api/admin/users/count');
  },
};
