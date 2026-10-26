import { apiClient } from '../../../services/apiClient';

export interface UserCountResponse {
  totalUsers: number;
}

export interface OverviewResponse {
  totalUsers: number;
  previousMonthTotalUsers: number;
  /** % tăng so với cuối tháng trước; null nếu tháng trước chưa có user */
  userGrowthPercent: number | null;
  dau: number;
  mau: number;
  /** (DAU / MAU) * 100 */
  stickinessRatio: number;
}

export const adminApi = {
  getUserCount: async (): Promise<UserCountResponse> => {
    return apiClient.get<UserCountResponse>('/api/admin/users/count');
  },
  getOverview: async (): Promise<OverviewResponse> => {
    return apiClient.get<OverviewResponse>('/api/admin/users/overview');
  },
  getRolesCount: async (): Promise<Record<string, number>> => {
    return apiClient.get<Record<string, number>>('/api/admin/users/roles/count');
  },
  getActivityStats: async (): Promise<Record<string, number>> => {
    return apiClient.get<Record<string, number>>('/api/admin/users/activity/stats');
  },
};
