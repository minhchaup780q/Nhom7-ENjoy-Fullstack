import { apiClient } from '../../../services/apiClient';

export type SessionType =
  | 'FLASHCARD'
  | 'MATCH_WORD'
  | 'SPEAKING'
  | 'RE_ORDER'
  | 'DRAG_DROP'
  | 'GRAMMAR'
  | 'FILL_IN_BLANK'
  | 'RE_ORDER_SENTENCE'
  | 'SPEAKING_SENTENCE'
  | 'CONVERSATION';

export type TopicBadge = 'DRAFT' | 'PUBLISHED';
export type PartBadge = 'DRAFT' | 'PUBLISHED';
export type SessionBadge = 'DRAFT' | 'PUBLISHED' | 'HAS_DRAFT';

export interface AdminTopicRequest {
  levelId?: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  orderIndex?: number;
}

export interface AdminPartRequest {
  topicId?: number;
  title: string;
  orderIndex?: number;
}

export interface AdminSessionRequest {
  partId?: number;
  title: string;
  description?: string;
  sessionType: SessionType;
  badgeId?: number;
  orderIndex?: number;
  payload?: any;
}

export interface AdminTopicResponse {
  id: number;
  levelId: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  orderIndex: number;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: number;
  partCount: number;
  sessionCount: number;
  badge: TopicBadge;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPartResponse {
  id: number;
  topicId: number;
  title: string;
  orderIndex: number;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: number;
  sessionCount: number;
  badge: PartBadge;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSessionResponse {
  id: number;
  partId: number;
  title: string;
  description?: string;
  orderIndex: number;
  sessionType: SessionType;
  badgeId?: number;
  isPublished: boolean;
  hasDraft: boolean;
  version: number;
  publishedAt?: string;
  publishedBy?: number;
  badge: SessionBadge;
  payload?: any;
  draftPayload?: any;
  studentProgressCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublishValidationResult {
  valid: boolean;
  message: string;
  errors: string[];
}

export interface DeleteResult {
  deleted: boolean;
  requiresConfirmation: boolean;
  confirmationToken?: string;
  affectedStudentCount: number;
  bridgedUnlockCount: number;
  message: string;
}

export interface LevelItem {
  id: number;
  name: string;
  code: string;
  orderIndex?: number;
}

export const adminCourseApi = {
  // === LEVELS ===
  getLevels: async (): Promise<LevelItem[]> => {
    return apiClient.get<LevelItem[]>('/api/levels');
  },

  // === TOPICS ===
  getTopicsByLevel: async (levelId: number): Promise<AdminTopicResponse[]> => {
    return apiClient.get<AdminTopicResponse[]>('/api/admin/topics', {
      params: { levelId },
    });
  },

  getTopicById: async (id: number): Promise<AdminTopicResponse> => {
    return apiClient.get<AdminTopicResponse>(`/api/admin/topics/${id}`);
  },

  createTopic: async (data: AdminTopicRequest): Promise<AdminTopicResponse> => {
    return apiClient.post<AdminTopicResponse>('/api/admin/topics', data);
  },

  updateTopicMetadata: async (id: number, data: AdminTopicRequest): Promise<AdminTopicResponse> => {
    return apiClient.put<AdminTopicResponse>(`/api/admin/topics/${id}/metadata`, data);
  },

  publishTopic: async (id: number): Promise<PublishValidationResult> => {
    return apiClient.post<PublishValidationResult>(`/api/admin/topics/${id}/publish`);
  },

  deleteTopic: async (id: number, confirmationToken?: string): Promise<DeleteResult> => {
    return apiClient.delete<DeleteResult>(`/api/admin/topics/${id}`, {
      headers: confirmationToken ? { 'X-Confirmation-Token': confirmationToken } : undefined,
      params: confirmationToken ? { confirmationToken } : undefined,
    });
  },

  // === PARTS ===
  getPartsByTopic: async (topicId: number): Promise<AdminPartResponse[]> => {
    return apiClient.get<AdminPartResponse[]>('/api/admin/parts', {
      params: { topicId },
    });
  },

  getPartById: async (id: number): Promise<AdminPartResponse> => {
    return apiClient.get<AdminPartResponse>(`/api/admin/parts/${id}`);
  },

  createPart: async (topicId: number, data: AdminPartRequest): Promise<AdminPartResponse> => {
    return apiClient.post<AdminPartResponse>('/api/admin/parts', data, {
      params: { topicId },
    });
  },

  updatePartMetadata: async (id: number, data: AdminPartRequest): Promise<AdminPartResponse> => {
    return apiClient.put<AdminPartResponse>(`/api/admin/parts/${id}/metadata`, data);
  },

  publishPart: async (id: number): Promise<PublishValidationResult> => {
    return apiClient.post<PublishValidationResult>(`/api/admin/parts/${id}/publish`);
  },

  deletePart: async (id: number, confirmationToken?: string): Promise<DeleteResult> => {
    return apiClient.delete<DeleteResult>(`/api/admin/parts/${id}`, {
      headers: confirmationToken ? { 'X-Confirmation-Token': confirmationToken } : undefined,
      params: confirmationToken ? { confirmationToken } : undefined,
    });
  },

  // === SESSIONS ===
  getSessionsByPart: async (partId: number): Promise<AdminSessionResponse[]> => {
    return apiClient.get<AdminSessionResponse[]>('/api/admin/sessions', {
      params: { partId },
    });
  },

  getSessionById: async (id: number): Promise<AdminSessionResponse> => {
    return apiClient.get<AdminSessionResponse>(`/api/admin/sessions/${id}`);
  },

  createSession: async (partId: number, data: AdminSessionRequest): Promise<AdminSessionResponse> => {
    return apiClient.post<AdminSessionResponse>('/api/admin/sessions', data, {
      params: { partId },
    });
  },

  updateSessionMetadata: async (id: number, data: AdminSessionRequest): Promise<AdminSessionResponse> => {
    return apiClient.put<AdminSessionResponse>(`/api/admin/sessions/${id}/metadata`, data);
  },

  saveSessionDraft: async (id: number, data: AdminSessionRequest): Promise<AdminSessionResponse> => {
    return apiClient.put<AdminSessionResponse>(`/api/admin/sessions/${id}/draft`, data);
  },

  publishSession: async (id: number): Promise<PublishValidationResult> => {
    return apiClient.post<PublishValidationResult>(`/api/admin/sessions/${id}/publish`);
  },

  discardSessionDraft: async (id: number): Promise<AdminSessionResponse> => {
    return apiClient.post<AdminSessionResponse>(`/api/admin/sessions/${id}/discard-draft`);
  },

  getSessionPreview: async (id: number): Promise<any> => {
    return apiClient.get<any>(`/api/admin/sessions/${id}/preview`);
  },

  deleteSession: async (id: number, confirmationToken?: string): Promise<DeleteResult> => {
    return apiClient.delete<DeleteResult>(`/api/admin/sessions/${id}`, {
      headers: confirmationToken ? { 'X-Confirmation-Token': confirmationToken } : undefined,
      params: confirmationToken ? { confirmationToken } : undefined,
    });
  },
};

export default adminCourseApi;