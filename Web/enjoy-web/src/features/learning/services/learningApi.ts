import axios from 'axios';
import { apiClient } from '../../../services/apiClient';
import type { Level, Topic, Part, Session, SessionItemMapping } from '../types';

export const learningApi = {
  // Lấy danh sách toàn bộ Levels active
  getLevels: () => {
    return apiClient.get<Level[]>('/api/levels');
  },

  // Lấy chi tiết Level theo ID
  getLevelById: (id: number) => {
    return apiClient.get<Level>(`/api/levels/${id}`);
  },

  // Lấy danh sách Topics của một Level cụ thể
  getTopicsByLevel: (levelId: number) => {
    return apiClient.get<Topic[]>(`/api/topics/by-level/${levelId}`);
  },

  // Lấy chi tiết Topic theo ID
  getTopicById: (id: number) => {
    return apiClient.get<Topic>(`/api/topics/${id}`);
  },

  // Lấy danh sách Parts của một Topic cụ thể
  getPartsByTopic: (topicId: number) => {
    return apiClient.get<Part[]>(`/api/parts/by-topic/${topicId}`);
  },

  // Lấy chi tiết Part theo ID
  getPartById: (id: number) => {
    return apiClient.get<Part>(`/api/parts/${id}`);
  },

  // Lấy danh sách Sessions của một Part cụ thể
  getSessionsByPart: (partId: number) => {
    return apiClient.get<Session[]>(`/api/sessions/by-part/${partId}`);
  },

  // Lấy chi tiết Session theo ID
  getSessionById: (id: number) => {
    return apiClient.get<Session>(`/api/sessions/${id}`);
  },

  // Lấy danh sách ánh xạ câu hỏi/nội dung học của một Session cụ thể (kèm theo orderIndex)
  getSessionItemMappings: (sessionId: number) => {
    return apiClient.get<SessionItemMapping[]>(`/api/sessions/${sessionId}/items`);
  },

  // Thêm nội dung học vào Session (dành cho Admin quản lý)
  addSessionItemToSession: (sessionId: number, itemId: number, orderIndex?: number) => {
    return apiClient.post<SessionItemMapping>(
      `/api/sessions/${sessionId}/items/${itemId}`,
      null,
      { params: orderIndex !== undefined ? { orderIndex } : {} }
    );
  },

  // Xóa nội dung học khỏi Session (dành cho Admin quản lý)
  removeSessionItemFromSession: (sessionId: number, itemId: number) => {
    return apiClient.delete<void>(`/api/sessions/${sessionId}/items/${itemId}`);
  },

  // Cập nhật Session (ví dụ: đổi trạng thái LOCK, UNLOCK, FINISH)
  updateSession: (id: number, session: Partial<Session>) => {
    return apiClient.put<Session>(`/api/sessions/${id}`, session);
  },

  // Chấm điểm phát âm bằng Python Faster-Whisper Service
  assessPronunciation: async (audioBlob: Blob, targetSentence: string): Promise<{
    isAllCorrect: boolean;
    accuracyScore: number;
    recognizedText: string;
    details: { word: string; status: 'correct' | 'wrong' }[];
  }> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('target_sentence', targetSentence);

    const response = await axios.post('http://localhost:8000/api/v1/speech/assess', formData);
    return response.data;
  },
};

