import type { BaseEntity } from '../../../types';

export enum SessionType {
  INTRODUCTION = 'INTRODUCTION',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  WORD_RECOGNITION = 'WORD_RECOGNITION',
  GAMIFIED_REVIEW = 'GAMIFIED_REVIEW',
}

export enum SessionStatus {
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
  FINISH = 'FINISH',
}

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

export interface Session extends BaseEntity {
  id: number;
  partId: number;
  part?: Part;
  sessionType: SessionType;
  badgeId?: number;
  title: string;
  keyword: string;
  description: string;
  status: SessionStatus;
  createdBy?: number;
  orderIndex: number;
  itemMappings?: SessionItemMapping[];
}

export interface SessionItem extends BaseEntity {
  id: number;
  contentText: string;
  translation?: string;
  imageUrl?: string;
  audioUrl?: string;
  itemType: string; // e.g. 'VOCABULARY', 'SENTENCE', 'QUESTION'
  sessionMappings?: SessionItemMapping[];
}

export interface SessionItemMapping extends BaseEntity {
  sessionId: number;
  sessionItemId: number;
  session?: Session;
  sessionItem?: SessionItem;
  orderIndex: number;
}

export interface ChildItemStatus extends BaseEntity {
  childId: number;
  sessionItemId: number;
  status: string; // e.g. 'MEMORIZED', 'STUDYING', 'NOT_STARTED'
  countWrong: number;
  lastUpdated: string;
}
