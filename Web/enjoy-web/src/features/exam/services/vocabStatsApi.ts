import { apiClient } from '../../../services/apiClient';
import type { VocabStatsResponse } from '../types';

const VOCAB_STATS_BASE = '/api/vocab-stats';

export const vocabStatsApi = {
  /** Lấy thống kê từ vựng của user theo từng topic */
  getVocabStats: (userId: number): Promise<VocabStatsResponse> =>
    apiClient.get<VocabStatsResponse>(`${VOCAB_STATS_BASE}`, { params: { userId } }),
};
