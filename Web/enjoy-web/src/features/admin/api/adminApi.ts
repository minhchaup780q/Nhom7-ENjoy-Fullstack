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

export type CohortRange = 7 | 14 | 30;

export interface CohortRow {
  cohortDate: string;
  newUsers: number;
  /** Tỉ lệ còn active sau 1/7/14 ngày; null nếu mốc đó chưa tới */
  day1Rate: number | null;
  day7Rate: number | null;
  day14Rate: number | null;
  /** 100 − day14Rate; null nếu Day 14 chưa tới */
  churn14Rate: number | null;
}

export const adminApi = {
  getUserCount: async (): Promise<UserCountResponse> => {
    return apiClient.get<UserCountResponse>('/api/admin/users/count');
  },
  getOverview: async (): Promise<OverviewResponse> => {
    return apiClient.get<OverviewResponse>('/api/admin/users/overview');
  },
  getCohortRetention: async (days: CohortRange): Promise<CohortRow[]> => {
    return apiClient.get<CohortRow[]>(`/api/admin/users/cohort-retention?days=${days}`);
  },
  getRolesCount: async (): Promise<Record<string, number>> => {
    return apiClient.get<Record<string, number>>('/api/admin/users/roles/count');
  },
  getActivityStats: async (): Promise<Record<string, number>> => {
    return apiClient.get<Record<string, number>>('/api/admin/users/activity/stats');
  },
};
