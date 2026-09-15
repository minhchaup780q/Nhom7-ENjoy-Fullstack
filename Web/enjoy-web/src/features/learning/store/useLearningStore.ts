import { create } from 'zustand';
import { learningApi } from '../services/learningApi';
import type { Level, Topic, Part, Session, SessionItem } from '../types';
import { SessionStatus } from '../types';

interface LearningState {
  // Trạng thái dữ liệu
  levels: Level[];
  topics: Topic[];
  parts: Part[];
  sessions: Session[];
  sessionsByPart: Record<number, Session[]>;
  sessionItems: SessionItem[];
  userProgress: import('../types').UserProgress[];
  
  // Thực thể đang được kích hoạt (Đang học)
  activeLevel: Level | null;
  activeTopic: Topic | null;
  activePart: Part | null;
  activeSession: Session | null;
  
  // Trạng thái tiến độ học trong một Session
  currentStepIndex: number;
  
  // Trạng thái UI
  loading: boolean;
  error: string | null;

  // Các hàm hành động (Actions)
  fetchLevels: () => Promise<void>;
  fetchUserProgress: () => Promise<void>;
  selectLevel: (level: Level) => Promise<void>;
  selectTopic: (topic: Topic) => Promise<void>;
  selectPart: (part: Part) => Promise<void>;
  selectSession: (session: Session) => Promise<void>;
  completeSession: (sessionId: number, durationSeconds?: number) => Promise<void>;
  
  // Điều hướng các bước học (session player)
  nextStep: () => void;
  prevStep: () => void;
  resetSessionState: () => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  // Khởi tạo trạng thái mặc định
  levels: [],
  topics: [],
  parts: [],
  sessions: [],
  sessionsByPart: {},
  sessionItems: [],
  userProgress: [],
  
  activeLevel: null,
  activeTopic: null,
  activePart: null,
  activeSession: null,
  
  currentStepIndex: 0,
  loading: false,
  error: null,

  fetchUserProgress: async () => {
    try {
      const userProgress = await learningApi.getUserProgress();
      set({ userProgress });
    } catch (err) {
      console.error("Lỗi khi tải tiến độ người dùng:", err);
    }
  },

  // Lấy danh sách Level từ API
  fetchLevels: async () => {
    set({ loading: true, error: null });
    try {
      const res = await learningApi.getLevels();
      const levels = Array.isArray(res) ? res : (res as any)?.data || [];
      console.log("Danh sách Levels nhận được:", levels);
      set({ levels, loading: false });
    } catch (err: unknown) {
      console.error("Lỗi khi lấy danh sách Level:", err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy danh sách Level';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chọn Level -> Lấy danh sách Topics tương ứng và UserProgress
  selectLevel: async (level: Level) => {
    set({ activeLevel: level, topics: [], parts: [], sessions: [], loading: true, error: null });
    try {
      const [topicsRes, userProgressRes] = await Promise.all([
        learningApi.getTopicsByLevel(level.id),
        learningApi.getUserProgress().catch(() => [])
      ]);
      const topics = Array.isArray(topicsRes) ? topicsRes : (topicsRes as any)?.data || [];
      const userProgress = Array.isArray(userProgressRes) ? userProgressRes : (userProgressRes as any)?.data || [];
      console.log(`Danh sách Topics của level ${level.id}:`, topics);
      set({ topics, userProgress, loading: false });
    } catch (err: unknown) {
      console.error("Lỗi khi lấy danh sách Topic:", err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy danh sách Topic';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chọn Topic -> Lấy danh sách Parts và các Sessions tương ứng gom theo Part
  selectTopic: async (topic: Topic) => {
    set({ activeTopic: topic, parts: [], sessionsByPart: {}, activePart: null, activeSession: null, loading: true, error: null });
    try {
      const [partsRes, userProgressRes] = await Promise.all([
        learningApi.getPartsByTopic(topic.id),
        learningApi.getUserProgress().catch(() => [])
      ]);

      const parts = Array.isArray(partsRes) ? partsRes : (partsRes as any)?.data || [];
      const userProgress = Array.isArray(userProgressRes) ? userProgressRes : (userProgressRes as any)?.data || [];
      console.log(`Danh sách Parts của topic ${topic.id}:`, parts);
      
      // Fetch sessions for all parts in parallel
      const sessionsMap: Record<number, Session[]> = {};

      await Promise.all(
        parts.map(async (part) => {
          try {
            const sessRes = await learningApi.getSessionsByPart(part.id);
            const sessionsOfPart = Array.isArray(sessRes) ? sessRes : (sessRes as any)?.data || [];
            sessionsMap[part.id] = sessionsOfPart;
          } catch (err) {
            console.error(`Lỗi khi lấy sessions cho part ${part.id}:`, err);
            sessionsMap[part.id] = [];
          }
        })
      );

      console.log("SessionsMap tải về:", sessionsMap);
      set({ parts, sessionsByPart: sessionsMap, userProgress, loading: false });
    } catch (err: unknown) {
      console.error("Lỗi khi lấy chi tiết topic:", err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy thông tin chi tiết chủ đề';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chọn Part -> Lấy danh sách Sessions tương ứng
  selectPart: async (part: Part) => {
    set({ activePart: part, sessions: [], activeSession: null, loading: true, error: null });
    try {
      const sessions = await learningApi.getSessionsByPart(part.id);
      set({ sessions, loading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy danh sách Session';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chọn Session -> Lấy danh sách Session Items được ánh xạ (câu hỏi/nội dung học)
  selectSession: async (session: Session) => {
    set({ activeSession: session, sessionItems: [], currentStepIndex: 0, loading: true, error: null });
    try {
      const mappings = await learningApi.getSessionItemMappings(session.id);
      
      // Lọc và sắp xếp Session Items theo orderIndex của mapping
      const sortedItems = mappings
        .filter(m => m.sessionItem !== undefined && m.sessionItem !== null)
        .map(m => m.sessionItem!); // Ép kiểu an toàn do đã filter
        
      set({ sessionItems: sortedItems, loading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy danh sách bài học';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chuyển sang câu hỏi / nội dung tiếp theo
  nextStep: () => {
    const { currentStepIndex, sessionItems } = get();
    if (currentStepIndex < sessionItems.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  // Quay lại câu hỏi / nội dung trước đó
  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  // Hoàn thành bài học hiện tại (FINISH) và mở khóa bài tiếp theo (UNLOCK) cho User
  completeSession: async (sessionId: number, durationSeconds?: number) => {
    const { activeTopic, selectTopic } = get();
    
    try {
      // Gọi API completeUserSession để cập nhật tiến độ riêng cho User
      await learningApi.completeUserSession(sessionId, durationSeconds);

      // Tải lại toàn bộ dữ liệu Topic để cập nhật UI bản đồ học theo User
      if (activeTopic) {
        await selectTopic(activeTopic);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật tiến trình bài học cho User:", err);
    }
  },

  // Reset trạng thái bài học hiện tại về ban đầu
  resetSessionState: () => {
    set({
      currentStepIndex: 0,
      activeSession: null,
      sessionItems: []
    });
  }
}));
