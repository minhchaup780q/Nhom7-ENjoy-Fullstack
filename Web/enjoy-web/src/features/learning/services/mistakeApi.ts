import { apiClient } from '../../../services/apiClient';

export type MistakeStatus = 'NEEDS_REVIEW' | 'REVIEWED' | 'MASTERED';

export interface MistakeItem {
  id: number;
  userId: number;
  questionId: number;
  contentText: string;
  translation: string;
  imageUrl?: string;
  audioUrl?: string;
  keyword?: string;
  roundType: number; // 1: Từ vựng/Nhận diện, 2: Nghe, 3: Đọc hiểu, 4: Phát âm, 5: Chính tả/Viết
  wrongAnswerSubmitted: string;
  durationSeconds?: number;
  aiExplanationCache?: string | null;
  status: MistakeStatus;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface MistakeCreatePayload {
  questionId: number;
  roundType: number;
  wrongAnswerSubmitted: string;
  durationSeconds?: number;
}

export interface MistakeStats {
  totalMistakes: number;
  needsReviewCount: number;
  reviewedCount: number;
  masteredCount: number;
}

export const mistakeApi = {
  // Ghi nhận 1 lỗi sai
  logMistake: (payload: MistakeCreatePayload) => {
    return apiClient.post<MistakeItem>('/api/mistakes', payload);
  },

  // Ghi nhận nhiều lỗi sai cùng lúc
  logBatchMistakes: (payloads: MistakeCreatePayload[]) => {
    return apiClient.post<MistakeItem[]>('/api/mistakes/batch', payloads);
  },

  // Lấy danh sách lỗi sai phân trang của User (load theo trang)
  getUserMistakesPaged: (params?: {
    status?: MistakeStatus;
    roundType?: number;
    page?: number;
    size?: number;
  }) => {
    return apiClient.get<PageResponse<MistakeItem>>('/api/mistakes', {
      params: {
        status: params?.status || 'NEEDS_REVIEW',
        roundType: params?.roundType,
        page: params?.page ?? 0,
        size: params?.size ?? 6,
      },
    });
  },

  // Lấy danh sách câu hỏi cần ôn tập cho Player
  getPracticeQueue: (roundType?: number, limit = 20) => {
    return apiClient.get<MistakeItem[]>('/api/mistakes/practice-queue', {
      params: {
        roundType,
        limit,
      },
    });
  },

  // Cập nhật trạng thái lỗi sai (NEEDS_REVIEW -> REVIEWED -> MASTERED)
  updateMistakeStatus: (id: number, status: MistakeStatus) => {
    return apiClient.put<MistakeItem>(`/api/mistakes/${id}/status`, { status });
  },

  // Cache giải thích từ AI
  updateAiExplanation: (id: number, explanation: string) => {
    return apiClient.put<MistakeItem>(`/api/mistakes/${id}/ai-explanation`, { explanation });
  },

  // Lấy thống kê lỗi sai của User
  getMistakeStats: () => {
    return apiClient.get<MistakeStats>('/api/mistakes/stats');
  },

  // Xóa lỗi sai khỏi danh sách
  deleteMistake: (id: number) => {
    return apiClient.delete<void>(`/api/mistakes/${id}`);
  },
};

