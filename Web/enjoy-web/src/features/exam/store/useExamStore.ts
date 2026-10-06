import { create } from 'zustand';
import type {
  ExamDetail,
  ExamPhase,
  ExamResult,
  PartAnswer,
  UserAnswers,
} from '../types';

interface ExamStore {
  // --- Dữ liệu đề thi ---
  currentExam: ExamDetail | null;

  // --- Flow ---
  phase: ExamPhase;

  // --- Timer ---
  timeLeft: number; // giây

  // --- Đáp án của user ---
  userAnswers: UserAnswers;

  // --- Kết quả sau nộp bài ---
  result: ExamResult | null;

  // --- Actions ---
  setExam: (exam: ExamDetail) => void;
  setPhase: (phase: ExamPhase) => void;
  setTimeLeft: (seconds: number) => void;
  decrementTimer: () => void;

  setListeningAnswer: (part: keyof UserAnswers['listening'], answers: PartAnswer[]) => void;
  setReadingAnswer: (part: keyof UserAnswers['reading'], answers: PartAnswer[]) => void;

  setResult: (result: ExamResult) => void;
  reset: () => void;
}

const initialAnswers: UserAnswers = {
  listening: { part1: [], part2: [], part3: [], part4: [] },
  reading: { part1: [], part2: [], part3: [], part4: [], part5: [] },
};

export const useExamStore = create<ExamStore>((set) => ({
  currentExam: null,
  phase: 'LIST',
  timeLeft: 0,
  userAnswers: initialAnswers,
  result: null,

  setExam: (exam) => set({ currentExam: exam }),

  setPhase: (phase) => set({ phase }),

  setTimeLeft: (seconds) => set({ timeLeft: seconds }),

  decrementTimer: () =>
    set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),

  setListeningAnswer: (part, answers) =>
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        listening: { ...state.userAnswers.listening, [part]: answers },
      },
    })),

  setReadingAnswer: (part, answers) =>
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        reading: { ...state.userAnswers.reading, [part]: answers },
      },
    })),

  setResult: (result) => set({ result }),

  reset: () =>
    set({
      currentExam: null,
      phase: 'LIST',
      timeLeft: 0,
      userAnswers: initialAnswers,
      result: null,
    }),
}));
