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
  roundType: number; // 1: Flashcard, 2: Match, 3: Speaking, 4: Reorder, 5: DragDrop, 6: Grammar, 7: FillInBlank
  wrongAnswerSubmitted: string;
  phonemeErrorType?: string | null;
  recognizedAudioTranscript?: string | null;
  durationSeconds?: number;
  aiExplanationCache?: string | null;
  status: MistakeStatus;
  correctStreakDays?: number; // 0, 1, 2, 3
  masteryScore?: number; // 0.0 -> 0.33 -> 0.67 -> 1.0
  lastPracticedAt?: string | null;
  nextReviewAt?: string | null;
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
  phonemeErrorType?: string;
  recognizedAudioTranscript?: string;
  durationSeconds?: number;
}

export interface MistakeStats {
  totalMistakes: number;
  needsReviewCount: number;
  reviewedCount: number;
  masteredCount: number;
  dueTodayCount?: number;
  waiting1DayCount?: number;
  waiting2DaysCount?: number;
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
    status?: MistakeStatus | 'ALL';
    roundType?: number;
    page?: number;
    size?: number;
  }) => {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 30,
    };
    if (params?.status && params.status !== 'ALL') {
      queryParams.status = params.status;
    }
    if (params?.roundType !== undefined) {
      queryParams.roundType = params.roundType;
    }
    return apiClient.get<PageResponse<MistakeItem>>('/api/mistakes', {
      params: queryParams,
    });
  },

  // Lấy danh sách câu hỏi cần ôn tập cho Player
  getPracticeQueue: (roundType?: number, limit = 20) => {
    const queryParams: Record<string, string | number> = {
      limit,
    };
    if (roundType !== undefined) {
      queryParams.roundType = roundType;
    }
    return apiClient.get<MistakeItem[]>('/api/mistakes/practice-queue', {
      params: queryParams,
    });
  },

  // Nộp kết quả luyện tập theo bước ngắt quãng (Spaced Repetition)
  submitPracticeStep: (id: number, isCorrect: boolean) => {
    return apiClient.post<MistakeItem>(`/api/mistakes/${id}/practice-step`, { isCorrect });
  },

  // Lấy toàn bộ danh sách câu hỏi để hiển thị Lộ trình nhắc nhở (1-2-3 Ngày)
  getRoadmapMistakes: () => {
    return apiClient.get<MistakeItem[]>('/api/mistakes/roadmap');
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

  // Lấy thử thách ngữ cảnh AI đã lưu từ Database
  getAiChallenge: async (skillKey: string, topicId: string) => {
    try {
      const res = await apiClient.get<{
        id?: number;
        skillKey: string;
        topicId: string;
        topicName?: string;
        title: string;
        story: string;
        storyVi?: string;
        question: string;
        options: string[];
        correctAnswer: string;
        hint?: string;
      }>('/api/mistakes/ai-challenge', {
        params: { skillKey, topicId },
      });
      return res || null;
    } catch {
      return null;
    }
  },

  // Lưu thử thách ngữ cảnh AI mới vào Database
  saveAiChallenge: async (payload: {
    skillKey: string;
    topicId: string;
    topicName?: string;
    title: string;
    story: string;
    storyVi?: string;
    question: string;
    options: string[];
    correctAnswer: string;
    hint?: string;
  }) => {
    try {
      const res = await apiClient.post<{
        id?: number;
        skillKey: string;
        topicId: string;
      }>('/api/mistakes/ai-challenge', payload);
      return res;
    } catch (err) {
      console.warn('Lỗi khi lưu AI Challenge vào DB:', err);
      return null;
    }
  },
};

