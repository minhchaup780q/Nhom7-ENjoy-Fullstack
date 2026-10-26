import { apiClient } from '../../../services/apiClient';
import type { ExamSummary, ExamDetail, ExamResult, UserAnswers } from '../types';

const EXAM_BASE = '/api/exams';

export const examApi = {
  /** Lấy danh sách tất cả đề thi */
  getAllExams: (userId?: number): Promise<ExamSummary[]> =>
    apiClient.get<ExamSummary[]>(EXAM_BASE, { params: { userId } }),

  /** Lấy chi tiết một đề thi theo ID */
  getExamById: (examId: number): Promise<ExamDetail> =>
    apiClient.get<ExamDetail>(`${EXAM_BASE}/${examId}`),

  /** Nộp bài thi */
  submitExam: (examId: number, userId: number, answers: UserAnswers): Promise<ExamResult> =>
    apiClient.post<ExamResult>(
      `${EXAM_BASE}/${examId}/submit`,
      answers,
      { params: { userId } }
    ),
};
