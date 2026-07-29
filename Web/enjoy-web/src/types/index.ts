export interface BaseEntity {
  createAt?: string;
  updateAt?: string;
  createBy?: number;
  updateBy?: number;
  isDelete?: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  CHILDREN = 'CHILDREN',
}

export interface User extends BaseEntity {
  id: number;
  email: string;
  passwordHash?: string;
  provider?: string;
  role: UserRole;
  parentId?: number;
  birthday?: string;
  dailyTimeLimit?: number;
  createdAt?: string;
}

export interface Badge extends BaseEntity {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ChildBadge extends BaseEntity {
  childId: number;
  badgeId: number;
  earnedAt: string;
}

export interface DailyLog extends BaseEntity {
  childId: number;
  studyDate: string;
  durationMinutes: number;
  lessonsCompleted: number;
}
