// ============================================================
// Types cho tính năng Bài Kiểm Tra Đầu Vào (Placement Test)
// Tải trực tiếp từ file JSON trên AWS S3
// ============================================================

// ------ CẤU TRÚC ĐỀ THI TỪ S3 ------

export interface Round1Option {
  id: string;
  label: string;
  image_url: string;
}

export interface Round1Question {
  question_id: string;
  topic: string;
  audio_url: string;
  options: Round1Option[];
  correct_answer?: string;
}

export interface Round2Question {
  question_id: string;
  topic: string;
  word: string;
  meaning: string;
}

export interface Round3Question {
  question_id: string;
  topic: string;
  sentence: string;
  meaning: string;
}

export interface PlacementTestRound1 {
  round_number: 1;
  round_name: string;
  type: 'LISTEN_AND_CHOOSE_IMAGE';
  questions: Round1Question[];
}

export interface PlacementTestRound2 {
  round_number: 2;
  round_name: string;
  type: 'MATCH_PAIR';
  questions: Round2Question[];
}

export interface PlacementTestRound3 {
  round_number: 3;
  round_name: string;
  type: 'SENTENCE_BUILDER';
  questions: Round3Question[];
}

export type PlacementTestRound =
  | PlacementTestRound1
  | PlacementTestRound2
  | PlacementTestRound3;

export interface PlacementTestData {
  test_id: string;
  title: string;
  rounds: PlacementTestRound[];
}

// ------ DTO GỬI LÊN KHI NỘP BÀI (SUBMIT) ------

export interface Round1Answer {
  question_id: string;
  topic: string;
  selected_option_id: string;
}

export interface Round2Answer {
  question_id: string;
  topic: string;
  word: string;
  selected_meaning: string;
}

export interface Round3Answer {
  question_id: string;
  topic: string;
  user_sentence: string;
}

export interface PlacementTestSubmitRequest {
  testId?: string;
  round1Answers: Round1Answer[];
  round2Answers: Round2Answer[];
  round3Answers: Round3Answer[];
}

// ------ KẾT QUẢ TRẢ VỀ SAU KHI NỘP BÀI ------

export interface Round1Mistake {
  questionId: string;
  topic: string;
  selectedOptionId: string;
  correctOptionId: string;
}

export interface Round1Result {
  correct: number;
  total: number;
  mistakes: Round1Mistake[];
}

export interface Round2Mistake {
  questionId: string;
  topic: string;
  word: string;
  selectedMeaning: string;
  correctMeaning: string;
}

export interface Round2Result {
  correct: number;
  total: number;
  mistakes: Round2Mistake[];
}

export interface Round3Mistake {
  questionId: string;
  topic: string;
  userSentence: string;
  correctSentence: string;
}

export interface Round3Result {
  correct: number;
  total: number;
  mistakes: Round3Mistake[];
}

export interface PlacementTestResult {
  historyId: number;
  totalQuestions: number;
  totalCorrect: number;
  skippedTopics: string[];
  round1Result?: Round1Result;
  round2Result?: Round2Result;
  round3Result?: Round3Result;
  // Fallback tương thích ngược
  vocabResult?: {
    correct: number;
    total: number;
    mistakes: any[];
  };
  grammarResult?: {
    correct: number;
    total: number;
    mistakes: any[];
  };
  speakingResult?: {
    correct: number;
    total: number;
    wrongRate: number;
    overallComment: string;
    mistakes: any[];
  };
}

// ------ TOPIC WITH PROGRESS ------

export type LearningStatus = 'FULL' | 'GRAMMAR_ONLY' | 'VOCAB_ONLY' | 'HIDDEN';

export interface TopicWithProgress {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  orderIndex: number;
  grammarName: string | null;
  learningStatus: LearningStatus;
  displayTitle: string;
  totalSessions?: number;
  totalActiveSessions?: number;
  completedSessions?: number;
  progressPercent?: number;
}
