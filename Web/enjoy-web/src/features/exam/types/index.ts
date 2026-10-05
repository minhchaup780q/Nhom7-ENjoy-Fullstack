// ================================================================
// EXAM TYPES - Cấu trúc dữ liệu cho tính năng Đề Thi
// ================================================================

// --- Danh sách đề thi ---
export interface ExamSummary {
  id: number;
  examType: 'CAMBRIDGE' | 'COLLINS' | 'CUSTOM';
  title: string;
  description: string;
  level: string;
  listeningDuration: number;  // phút
  readingDuration: number;    // phút
  totalListeningQuestions: number;
  totalReadingQuestions: number;
}

// --- Chi tiết đề thi ---
export interface ExamDetail extends ExamSummary {
  listeningPayload: ListeningPayload;
  readingPayload: ReadingPayload;
}

// ================================================================
// LISTENING PAYLOAD
// ================================================================
export interface ListeningPayload {
  part1: ListeningPart1Data;
  part2: ListeningPart2Data;
  part3: ListeningPart3Data;
  part4: ListeningPart4Data;
}

// Part 1: Kéo thả tên vào tọa độ trên ảnh
export interface ListeningPart1Data {
  audio_url: string;
  img_url: string;
  coordinates: Array<{
    word: string;
    x: number;
    y: number;
    width: number;
    height: number;
    is_example: boolean;
  }>;
}

// Part 2: Nghe và điền từ/số
export interface ListeningPart2Data {
  audio_url: string;
  img_url: string;
  questions: Array<{
    is_example: boolean;
    question: string;
    answer_format: string;
    keyword: string;  // đáp án đúng
  }>;
}

// Part 3: Trắc nghiệm hình ảnh A/B/C
export interface ListeningPart3Data {
  audio_url: string;
  questions: Array<{
    is_example: boolean;
    question: string;
    img_url: string;
    answer: 'A' | 'B' | 'C';  // đáp án đúng (A/B/C trong 3 ảnh)
  }>;
}

// Part 4: Kéo thả màu sắc vào ảnh
export interface ListeningPart4Data {
  audio_url: string;
  img_url: string;
  coordinates: Array<{
    word: string;  // màu sắc đúng
    x: number;
    y: number;
    width: number;
    height: number;
    is_example: boolean;
  }>;
}

// ================================================================
// READING PAYLOAD
// ================================================================
export interface ReadingPayload {
  part1: ReadingPart1Item[];
  part2: ReadingPart2Item[];
  part3: ReadingPart3Item[];
  part4: ReadingPart4Data;
  part5: ReadingPart5Group[];
}

// Part 1: Look and Read - Right/Wrong
export interface ReadingPart1Item {
  is_example: boolean;
  question: string;
  img_url: string;
  status: 'right' | 'wrong';  // đáp án đúng
}

// Part 2: Look and Read - Yes/No
export interface ReadingPart2Item {
  is_example: boolean;
  question: string;
  img_url: string;
  status: 'yes' | 'no';  // đáp án đúng
}

// Part 3: Sắp xếp chữ cái thành từ
export interface ReadingPart3Item {
  is_example: boolean;
  img_url: string;
  word: string;  // từ đúng
}

// Part 4: Điền từ vào đoạn văn
export interface ReadingPart4Data {
  text: string;  // đoạn văn với (1), (2)... là vị trí cần điền
  options: Array<{ word: string; img_url: string }>;
  answers: Array<{ position: number; word: string }>;  // đáp án đúng
}

// Part 5: Trả lời câu hỏi ngắn theo cụm ảnh
export interface ReadingPart5Group {
  img_url: string;
  questions: Array<{
    is_example: boolean;
    question: string;
    answer: string;  // đáp án đúng
  }>;
}

// ================================================================
// USER ANSWERS - Cấu trúc lưu đáp án của user
// ================================================================
export interface PartAnswer {
  index?: number;         // Part 1,2,3 của Listening và Part 1,2,3 của Reading
  position?: number;      // Reading Part4 (vị trí lỗ hổng 1-5)
  groupIndex?: number;    // Reading Part5
  questionIndex?: number; // Reading Part5
  answer: string;
}

export interface UserAnswers {
  listening: {
    part1: PartAnswer[];  // index = thứ tự câu (chỉ câu is_example=false)
    part2: PartAnswer[];
    part3: PartAnswer[];
    part4: PartAnswer[];
  };
  reading: {
    part1: PartAnswer[];
    part2: PartAnswer[];
    part3: PartAnswer[];
    part4: PartAnswer[];  // dùng position
    part5: PartAnswer[];  // dùng groupIndex + questionIndex
  };
}

// ================================================================
// EXAM RESULT
// ================================================================
export interface PartScoreDetail {
  part1Correct: number;
  part1Total: number;
  part2Correct: number;
  part2Total: number;
  part3Correct: number;
  part3Total: number;
  part4Correct: number;
  part4Total: number;
  part5Correct?: number;
  part5Total?: number;
}

export interface ExamResult {
  totalCorrect: number;
  totalQuestions: number;
  listeningCorrect: number;
  listeningTotal: number;
  listeningShields: number;
  listeningPartScores: PartScoreDetail;
  readingCorrect: number;
  readingTotal: number;
  readingShields: number;
  readingPartScores: PartScoreDetail;
  historyId: number;
}

// ================================================================
// EXAM PHASE - Flow trạng thái bài thi
// ================================================================
export type ExamPhase = 'LIST' | 'INTRO' | 'LISTENING' | 'TRANSITION' | 'READING' | 'RESULT';
