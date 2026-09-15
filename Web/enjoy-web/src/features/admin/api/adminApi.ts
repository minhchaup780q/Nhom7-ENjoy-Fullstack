import { apiClient } from '../../../services/apiClient';

export interface UserCountResponse {
  totalUsers: number;
}

export const adminApi = {
  getUserCount: async (): Promise<UserCountResponse> => {
    return apiClient.get<UserCountResponse>('/api/admin/users/count');
  },
  getRolesCount: async (): Promise<Record<string, number>> => {
    return apiClient.get<Record<string, number>>('/api/admin/users/roles/count');
  },
  getActivityStats: async (): Promise<Record<string, number>> => {
    return apiClient.get<Record<string, number>>('/api/admin/users/activity/stats');
  },
};
