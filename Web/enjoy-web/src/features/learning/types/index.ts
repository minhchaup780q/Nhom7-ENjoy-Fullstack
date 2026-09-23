import type { BaseEntity } from '../../../types';

// ============================================================
// Enums
// ============================================================
export enum SessionType {
  FLASHCARD     = 'FLASHCARD',
  MATCH_WORD    = 'MATCH_WORD',
  SPEAKING      = 'SPEAKING',
  RE_ORDER      = 'RE_ORDER',
  DRAG_DROP     = 'DRAG_DROP',
  GRAMMAR       = 'GRAMMAR',
  CONVERSATION  = 'CONVERSATION',
}

export enum SessionStatus {
  LOCK   = 'LOCK',
  UNLOCK = 'UNLOCK',
  FINISH = 'FINISH',
}

// ============================================================
// Entities
// ============================================================
export interface Level extends BaseEntity {
  id: number;
  name: string;
  code: string;
  orderIndex: number;
  topics?: Topic[];
}

export interface Topic extends BaseEntity {
  id: number;
  levelId: number;
  level?: Level;
  title: string;
  description: string;
  thumbnailUrl: string;
  orderIndex: number;
  parts?: Part[];
}

export interface Part extends BaseEntity {
  id: number;
  topicId: number;
  topic?: Topic;
  title: string;
  orderIndex: number;
  sessions?: Session[];
}

export interface DragDropCoordinate {
  word: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Một đáp án của câu hỏi QUESTION trong vòng Grammar */
export interface GrammarOption {
  id: string;
  text: string;
  is_correct: boolean;
}

/** Một thành phần (block) trong chuỗi bài giảng Grammar */
export interface GrammarBlock {
  order: number;
  type: 'TEXT_SPEECH' | 'IMAGE' | 'EXPLANATION' | 'QUESTION';
  text?: string;
  audio_url?: string;
  image_url?: string;
  options?: GrammarOption[];
}

/** payload shape từ DB (JSON column) — mỗi exerciseType dùng một subset */
export interface SessionPayload {
  word?:        string;  // từ tiếng Anh chính
  translation?: string;  // dịch nghĩa
  image?:       string;  // URL ảnh (các vòng cũ)
  audio?:       string;  // URL audio (các vòng cũ)
  
  // Dùng cho DRAG_DROP
  image_url?:   string;
  audio_url?:   string;
  coordinates?: DragDropCoordinate[];

  // Dùng cho GRAMMAR
  title?:  string;
  blocks?: GrammarBlock[];
}

export interface Session extends BaseEntity {
  id: number;
  partId: number;
  part?: Part;
  sessionType: SessionType;
  badgeId?: number;
  title: string;
  description: string;
  status?: SessionStatus;
  orderIndex: number;
  payload?: SessionPayload | null;
}

/** Từ vựng trả về từ GET /api/parts/{partId}/vocabularies */
export interface Vocabulary {
  id: number;
  word: string;
  translation: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface UserProgress extends BaseEntity {
  id: number;
  userId: number;
  session: Session;
  status: SessionStatus;
  completedAt?: string;
}
