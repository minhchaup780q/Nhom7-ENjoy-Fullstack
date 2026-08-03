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
  selectLevel: (level: Level) => Promise<void>;
  selectTopic: (topic: Topic) => Promise<void>;
  selectPart: (part: Part) => Promise<void>;
  selectSession: (session: Session) => Promise<void>;
  completeSession: (sessionId: number) => Promise<void>;
  
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
  
  activeLevel: null,
  activeTopic: null,
  activePart: null,
  activeSession: null,
  
  currentStepIndex: 0,
  loading: false,
  error: null,

  // Lấy danh sách Level từ API
  fetchLevels: async () => {
    set({ loading: true, error: null });
    try {
      const levels = await learningApi.getLevels();
      set({ levels, loading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy danh sách Level';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chọn Level -> Lấy danh sách Topics tương ứng
  selectLevel: async (level: Level) => {
    set({ activeLevel: level, topics: [], parts: [], sessions: [], activeTopic: null, activePart: null, activeSession: null, loading: true, error: null });
    try {
      const topics = await learningApi.getTopicsByLevel(level.id);
      set({ topics, loading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể lấy danh sách Topic';
      set({ error: errorMessage, loading: false });
    }
  },

  // Chọn Topic -> Lấy danh sách Parts và các Sessions tương ứng gom theo Part
  selectTopic: async (topic: Topic) => {
    set({ activeTopic: topic, parts: [], sessionsByPart: {}, activePart: null, activeSession: null, loading: true, error: null });
    try {
      const parts = await learningApi.getPartsByTopic(topic.id);
      
      // Fetch sessions for all parts in parallel
      const sessionsMap: Record<number, Session[]> = {};
      await Promise.all(
        parts.map(async (part) => {
          try {
            const sessionsOfPart = await learningApi.getSessionsByPart(part.id);
            sessionsMap[part.id] = sessionsOfPart;
          } catch (err) {
            console.error(`Lỗi khi lấy sessions cho part ${part.id}:`, err);
            sessionsMap[part.id] = [];
          }
        })
      );

      set({ parts, sessionsByPart: sessionsMap, loading: false });
    } catch (err: unknown) {
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

  // Hoàn thành bài học hiện tại (FINISH) và mở khóa bài tiếp theo (UNLOCK)
  completeSession: async (sessionId: number) => {
    const { activeTopic, selectTopic, parts, sessionsByPart } = get();
    
    // Thu thập toàn bộ sessions của topic hiện tại để xử lý tiến trình
    const allSessions: Session[] = parts.flatMap(part => sessionsByPart[part.id] || []);
    const isMock = allSessions.length === 0 || !activeTopic;
    
    if (isMock) {
      console.log("Đang chạy chế độ mock/offline progress");
      return;
    }

    try {
      // 1. Cập nhật Session hiện tại thành FINISH
      const currentSession = allSessions.find(s => s.id === sessionId);
      if (currentSession) {
        await learningApi.updateSession(sessionId, {
          title: currentSession.title,
          description: currentSession.description,
          orderIndex: currentSession.orderIndex,
          sessionType: currentSession.sessionType,
          status: SessionStatus.FINISH
        });
      }

      // 2. Tìm Session tiếp theo trong danh sách toàn bộ của Topic để UNLOCK
      const currentIndex = allSessions.findIndex(s => s.id === sessionId);
      if (currentIndex !== -1 && currentIndex < allSessions.length - 1) {
        const nextSession = allSessions[currentIndex + 1];
        if (nextSession.status === SessionStatus.LOCK) {
          await learningApi.updateSession(nextSession.id, {
            title: nextSession.title,
            description: nextSession.description,
            orderIndex: nextSession.orderIndex,
            sessionType: nextSession.sessionType,
            status: SessionStatus.UNLOCK
          });
        }
      }

      // 3. Tải lại toàn bộ dữ liệu Topic để cập nhật UI bản đồ học
      await selectTopic(activeTopic);
    } catch (err) {
      console.error("Lỗi khi cập nhật tiến trình bài học:", err);
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
