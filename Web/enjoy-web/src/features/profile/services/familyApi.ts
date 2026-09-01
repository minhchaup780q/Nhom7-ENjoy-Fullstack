import { apiClient } from '../../../services/apiClient';

export interface FamilyMember {
  id: number;
  parentId: number;
  parentName: string;
  parentEmail: string;
  parentAvatarUrl?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentAvatarUrl?: string;
  status: 'PENDING' | 'LINKED' | 'REJECTED';
  expiresAt?: string;
  createdAt?: string;
}

export interface FamilyOverview {
  linkedMembers: FamilyMember[];
  pendingInvites: FamilyMember[];
}

export const familyApi = {
  getOverview: (): Promise<FamilyOverview> => {
    return apiClient.get<FamilyOverview>('/api/user/family/overview');
  },

  sendInvite: (studentEmail: string): Promise<FamilyMember> => {
    return apiClient.post<FamilyMember>('/api/user/family/invite', {
      studentEmail,
    });
  },

  verifyInvite: (verificationCode: string): Promise<FamilyMember> => {
    return apiClient.post<FamilyMember>('/api/user/family/verify', {
      verificationCode,
    });
  },

  rejectInvite: (familyId: number): Promise<void> => {
    return apiClient.post<void>(`/api/user/family/reject/${familyId}`);
  },

  cancelOrRemoveLink: (familyId: number): Promise<void> => {
    return apiClient.delete<void>(`/api/user/family/${familyId}`);
  },
};
