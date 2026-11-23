import { apiClient } from '../../../services/apiClient';

export type ExamType = 'CAMBRIDGE' | 'COLLINS' | 'CUSTOM';
export type ExamBadge = 'DRAFT' | 'PUBLISHED';

export type ListeningPartKey = 'part1' | 'part2' | 'part3' | 'part4';
export type ReadingPartKey = 'part1' | 'part2' | 'part3' | 'part4' | 'part5';

export interface AdminExamResponse {
  id: number;
  examType: ExamType;
  title: string;
  description?: string;
  level?: string;
  listeningDuration?: number;
  readingDuration?: number;
  totalListeningQuestions?: number;
  totalReadingQuestions?: number;
  isPublished: boolean;
  badge: ExamBadge;
  attemptCount: number;
  createdAt?: string;
}

/** Chi tiết đề thi kèm payload đang soạn (dùng cho màn hình soạn thảo & xem trước). */
export interface AdminExamDetailResponse extends AdminExamResponse {
  listeningPayload: Record<string, any>;
  readingPayload: Record<string, any>;
}

export interface AdminExamRequest {
  examType: ExamType;
  title: string;
  description?: string;
  level?: string;
  listeningDuration?: number;
  readingDuration?: number;
}

export interface PublishValidationResult {
  valid: boolean;
  message: string;
  errors: string[];
}

const EXAM_BASE = '/api/admin/exams';
const UPLOAD_BASE = '/api/admin/uploads';

export const adminExamApi = {
  /** Danh sách tất cả đề thi cho trang quản trị (kèm số lượt làm). */
  getAllExams: (): Promise<AdminExamResponse[]> =>
    apiClient.get<AdminExamResponse[]>(EXAM_BASE),

  /** Chi tiết 1 đề thi kèm payload đang soạn. */
  getExamDetail: (id: number): Promise<AdminExamDetailResponse> =>
    apiClient.get<AdminExamDetailResponse>(`${EXAM_BASE}/${id}`),

  /** Tạo vỏ đề thi (chỉ thông tin cơ bản, trạng thái nháp). */
  createExam: (data: AdminExamRequest): Promise<AdminExamResponse> =>
    apiClient.post<AdminExamResponse>(EXAM_BASE, data),

  /** Cập nhật thông tin cơ bản. */
  updateExamMetadata: (id: number, data: AdminExamRequest): Promise<AdminExamResponse> =>
    apiClient.put<AdminExamResponse>(`${EXAM_BASE}/${id}/metadata`, data),

  /** Lưu 1 phần bài Nghe. */
  saveListeningPart: (
    id: number,
    partKey: ListeningPartKey,
    partData: any,
  ): Promise<AdminExamDetailResponse> =>
    apiClient.put<AdminExamDetailResponse>(`${EXAM_BASE}/${id}/listening/${partKey}`, partData),

  /** Lưu 1 phần bài Đọc. */
  saveReadingPart: (
    id: number,
    partKey: ReadingPartKey,
    partData: any,
  ): Promise<AdminExamDetailResponse> =>
    apiClient.put<AdminExamDetailResponse>(`${EXAM_BASE}/${id}/reading/${partKey}`, partData),

  /** Xuất bản (chỉ thành công khi đã soạn đủ 9 phần). */
  publishExam: (id: number): Promise<PublishValidationResult> =>
    apiClient.post<PublishValidationResult>(`${EXAM_BASE}/${id}/publish`),

  /** Tải ảnh lên S3, trả về URL để lưu vào payload. */
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.postForm<{ url: string }>(`${UPLOAD_BASE}/image`, form);
    return res.url;
  },

  /** Tải audio lên S3, trả về URL để lưu vào payload. */
  uploadAudio: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.postForm<{ url: string }>(`${UPLOAD_BASE}/audio`, form);
    return res.url;
  },
};
