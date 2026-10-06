// ============================================================
// Types cho tính năng Bài Kiểm Tra Đầu Vào (Placement Test)
// ============================================================

// ------ GENERATE TEST RESPONSE ------

export interface PlacementVocabQuestion {
  vocabularyId: number;
  topicId: number;
  topicTitle: string;
  word: string;
  translation: string;
}

export interface PlacementGrammarQuestion {
  topicId: number;
  topicTitle: string;
  sentence: string;
  grammarName: string;
}

export interface PlacementSpeakingQuestion {
  topicId: number;
  topicTitle: string;
  sentence: string;
  vocabularyId: number | null;
}

export interface PlacementTestData {
  vocabRound: PlacementVocabQuestion[];
  grammarRound: PlacementGrammarQuestion[];
  speakingRound: PlacementSpeakingQuestion[];
}

// ------ SUBMIT REQUEST ------

export interface VocabAnswer {
  vocabularyId: number;
  topicId: number;
  word: string;
  selectedTranslation: string;
  correctTranslation: string;
}

export interface GrammarAnswer {
  topicId: number;
  correctSentence: string;
  userSentence: string;
  grammarName: string;
}

export interface SpeakingAnswer {
  topicId: number;
  sentence: string;
  recognizedText: string;
  score: number | null;
}

export interface PlacementTestSubmitRequest {
  vocabAnswers: VocabAnswer[];
  grammarAnswers: GrammarAnswer[];
  speakingAnswers: SpeakingAnswer[];
}

// ------ SUBMIT RESULT RESPONSE ------

export interface TopicVocabMistake {
  topicId: number;
  topicTitle: string;
  wrongWords: string[];
}

export interface GrammarMistake {
  topicId: number;
  wrongSentence: string;
  correctSentence: string;
  grammarName: string;
}

export interface SpeakingMistake {
  topicId: number;
  sentence: string;
  recognizedText: string;
  score: number | null;
}

export interface PlacementVocabResult {
  correct: number;
  total: number;
  mistakes: TopicVocabMistake[];
}

export interface PlacementGrammarResult {
  correct: number;
  total: number;
  mistakes: GrammarMistake[];
}

export interface PlacementSpeakingResult {
  correct: number;
  total: number;
  wrongRate: number;
  overallComment: string;
  mistakes: SpeakingMistake[];
}

export interface PlacementTestResult {
  historyId: number;
  vocabResult: PlacementVocabResult;
  grammarResult: PlacementGrammarResult;
  speakingResult: PlacementSpeakingResult;
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
}
