export interface ChatMessage {
  id: number | string;
  userId: number;
  username: string;
  avatarUrl?: string | null;
  content: string;
  messageType?: string;
  createdAt: string;
}

export interface ChatPageResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  oldestId: number | null;
  totalReturned: number;
}
