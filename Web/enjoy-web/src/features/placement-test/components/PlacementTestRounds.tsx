import React, { useState, useCallback } from 'react';
import type {
  PlacementVocabQuestion,
  PlacementGrammarQuestion,
  PlacementSpeakingQuestion,
  VocabAnswer,
  GrammarAnswer,
  SpeakingAnswer,
} from '../../learning/types/placementTest';

// ================================================================
// VÒNG 1: Nối từ vựng
// ================================================================

interface VocabRoundProps {
  questions: PlacementVocabQuestion[];
  onComplete: (answers: VocabAnswer[]) => void;
}

export const VocabRound: React.FC<VocabRoundProps> = ({ questions, onComplete }) => {
  const BATCH_SIZE = 6; // Tối đa 6 cặp mỗi đợt (3 cặp / màn hình)
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null); // index trong batch
  const [selectedRight, setSelectedRight] = useState<number | null>(null); // index trong rightItems
  const [matched, setMatched] = useState<{ leftIdx: number; rightIdx: number }[]>([]);
  const [answers, setAnswers] = useState<VocabAnswer[]>([]);

  // Chia batch: mỗi lần tối đa BATCH_SIZE từ
  const getBatch = useCallback((idx: number) => {
    const start = idx * BATCH_SIZE;
    return questions.slice(start, start + BATCH_SIZE);
  }, [questions]);

  const batch = getBatch(batchIndex);
  const totalBatches = Math.ceil(questions.length / BATCH_SIZE);

  // Tạo danh sách bên phải đã bị shuffle
  const [rightItems] = useState<{ translation: string; originalIdx: number }[]>(() => {
    return [...batch.map((q, i) => ({ translation: q.translation, originalIdx: i }))]
      .sort(() => Math.random() - 0.5);
  });

  const handleLeftClick = (idx: number) => {
    if (matched.some(m => m.leftIdx === idx)) return; // Đã match rồi
    setSelectedLeft(idx === selectedLeft ? null : idx);
  };

  const handleRightClick = (idx: number) => {
    if (matched.some(m => m.rightIdx === idx)) return;
    setSelectedRight(idx === selectedRight ? null : idx);
  };

  // Khi cả 2 phía đều được chọn, kiểm tra match
  React.useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const newMatch = { leftIdx: selectedLeft, rightIdx: selectedRight };
      setMatched(prev => [...prev, newMatch]);

      // Ghi câu trả lời
      const q = batch[selectedLeft];
      const selectedTranslation = rightItems[selectedRight].translation;
      setAnswers(prev => [...prev, {
        vocabularyId: q.vocabularyId,
        topicId: q.topicId,
        word: q.word,
        selectedTranslation,
        correctTranslation: q.translation,
      }]);

      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [selectedLeft, selectedRight]);

  const allMatched = matched.length === batch.length;

  const handleNext = () => {
    if (batchIndex + 1 < totalBatches) {
      setBatchIndex(prev => prev + 1);
      setMatched([]);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      onComplete(answers);
    }
  };

  const isLeftMatched = (idx: number) => matched.some(m => m.leftIdx === idx);
  const isRightMatched = (idx: number) => matched.some(m => m.rightIdx === idx);

  return (
    <div className="pt-round pt-vocab-round">
      <div className="pt-round-header">
        <span className="pt-round-badge">Vòng 1</span>
        <h2 className="pt-round-title">Nối từ với nghĩa tương ứng</h2>
        {totalBatches > 1 && (
          <p className="pt-batch-info">Đợt {batchIndex + 1} / {totalBatches}</p>
        )}
      </div>

      <div className="pt-match-grid">
        {/* Left: English words */}
        <div className="pt-match-col pt-match-left">
          {batch.map((q, idx) => (
            <button
              key={q.vocabularyId}
              id={`vocab-left-${idx}`}
              className={`pt-match-item ${selectedLeft === idx ? 'selected' : ''} ${isLeftMatched(idx) ? 'matched' : ''}`}
              onClick={() => handleLeftClick(idx)}
            >
              {q.word}
            </button>
          ))}
        </div>

        {/* Right: Vietnamese translations (shuffled) */}
        <div className="pt-match-col pt-match-right">
          {rightItems.map((item, idx) => (
            <button
              key={idx}
              id={`vocab-right-${idx}`}
              className={`pt-match-item ${selectedRight === idx ? 'selected' : ''} ${isRightMatched(idx) ? 'matched' : ''}`}
              onClick={() => handleRightClick(idx)}
            >
              {item.translation}
            </button>
          ))}
        </div>
      </div>

      {allMatched && (
        <button id="btn-vocab-continue" className="pt-continue-btn" onClick={handleNext}>
          Tiếp tục →
        </button>
      )}
    </div>
  );
};

// ================================================================
// VÒNG 2: Sắp xếp câu (Re-order sentence)
// ================================================================

interface GrammarRoundProps {
  questions: PlacementGrammarQuestion[];
  onComplete: (answers: GrammarAnswer[]) => void;
}

export const GrammarRound: React.FC<GrammarRoundProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<GrammarAnswer[]>([]);

  const current = questions[currentIdx];

  // Shuffle các từ của câu hiện tại
  const [wordBanks, setWordBanks] = useState<string[][]>(() =>
    questions.map(q => {
      const words = q.sentence.split(' ');
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      // Đảm bảo không trùng thứ tự gốc khi chỉ có 1 lần shuffle
      if (words.length > 1 && shuffled.join(' ') === words.join(' ')) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = temp;
      }
      return shuffled;
    })
  );

  const [userOrder, setUserOrder] = useState<string[][]>(() => questions.map(() => []));

  const handleWordClick = (word: string, fromBank: boolean) => {
    const newBanks = [...wordBanks];
    const newOrder = [...userOrder];

    if (fromBank) {
      // Từ word bank -> thêm vào câu
      newBanks[currentIdx] = newBanks[currentIdx].filter(w => w !== word);
      newOrder[currentIdx] = [...newOrder[currentIdx], word];
    } else {
      // Từ câu -> trả về word bank
      newOrder[currentIdx] = newOrder[currentIdx].filter(w => w !== word);
      newBanks[currentIdx] = [...newBanks[currentIdx], word];
    }

    setWordBanks(newBanks);
    setUserOrder(newOrder);
  };

  const handleSubmitSentence = () => {
    const userSentence = userOrder[currentIdx].join(' ');
    const newAnswers: GrammarAnswer[] = [...answers, {
      topicId: current.topicId,
      correctSentence: current.sentence,
      userSentence,
      grammarName: current.grammarName,
    }];
    setAnswers(newAnswers);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="pt-round pt-grammar-round">
      <div className="pt-round-header">
        <span className="pt-round-badge">Vòng 2</span>
        <h2 className="pt-round-title">Sắp xếp các từ thành câu đúng</h2>
        <p className="pt-progress-text">{currentIdx + 1} / {questions.length}</p>
      </div>

      {/* Câu user đang ghép */}
      <div className="pt-sentence-area">
        <div className="pt-sentence-slots">
          {userOrder[currentIdx].length === 0 ? (
            <span className="pt-sentence-placeholder">Chạm vào từ bên dưới để ghép câu...</span>
          ) : (
            userOrder[currentIdx].map((word, i) => (
              <button
                key={i}
                className="pt-word-chip pt-word-in-sentence"
                onClick={() => handleWordClick(word, false)}
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Word bank */}
      <div className="pt-word-bank">
        {wordBanks[currentIdx].map((word, i) => (
          <button
            key={i}
            className="pt-word-chip pt-word-in-bank"
            onClick={() => handleWordClick(word, true)}
          >
            {word}
          </button>
        ))}
      </div>

      <button
        id={`btn-grammar-submit-${currentIdx}`}
        className="pt-continue-btn"
        disabled={userOrder[currentIdx].length === 0}
        onClick={handleSubmitSentence}
      >
        {currentIdx + 1 < questions.length ? 'Tiếp tục →' : 'Hoàn thành vòng 2 →'}
      </button>
    </div>
  );
};

// ================================================================
// VÒNG 3: Speaking
// ================================================================

interface SpeakingRoundProps {
  questions: PlacementSpeakingQuestion[];
  assessPronunciation: (blob: Blob, sentence: string) => Promise<{
    isAllCorrect: boolean;
    accuracyScore: number;
    recognizedText: string;
  }>;
  onComplete: (answers: SpeakingAnswer[]) => void;
}

export const SpeakingRound: React.FC<SpeakingRoundProps> = ({
  questions,
  assessPronunciation,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<SpeakingAnswer[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  const current = questions[currentIdx];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (e) => audioChunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setIsAssessing(true);
        try {
          const result = await assessPronunciation(audioBlob, current.sentence);
          const newAnswer: SpeakingAnswer = {
            topicId: current.topicId,
            sentence: current.sentence,
            recognizedText: result.recognizedText,
            score: result.accuracyScore,
          };
          const newAnswers = [...answers, newAnswer];
          setAnswers(newAnswers);

          if (currentIdx + 1 < questions.length) {
            setCurrentIdx(prev => prev + 1);
          } else {
            onComplete(newAnswers);
          }
        } catch {
          // Nếu lỗi speech service => đánh dấu là sai với score 0
          const failAnswer: SpeakingAnswer = {
            topicId: current.topicId,
            sentence: current.sentence,
            recognizedText: '',
            score: 0,
          };
          const newAnswers = [...answers, failAnswer];
          setAnswers(newAnswers);
          if (currentIdx + 1 < questions.length) {
            setCurrentIdx(prev => prev + 1);
          } else {
            onComplete(newAnswers);
          }
        } finally {
          setIsAssessing(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Cannot access microphone:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    setMediaRecorder(null);
  };

  const handleSkip = () => {
    const skipAnswer: SpeakingAnswer = {
      topicId: current.topicId,
      sentence: current.sentence,
      recognizedText: '',
      score: 0,
    };
    const newAnswers = [...answers, skipAnswer];
    setAnswers(newAnswers);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="pt-round pt-speaking-round">
      <div className="pt-round-header">
        <span className="pt-round-badge">Vòng 3</span>
        <h2 className="pt-round-title">Đọc câu sau bằng tiếng Anh</h2>
        <p className="pt-progress-text">{currentIdx + 1} / {questions.length}</p>
      </div>

      <div className="pt-speaking-sentence">
        <p className="pt-speaking-text">"{current.sentence}"</p>
        <p className="pt-speaking-topic">Chủ đề: {current.topicTitle}</p>
      </div>

      <div className="pt-speaking-controls">
        {isAssessing ? (
          <div className="pt-assessing-indicator">
            <span className="pt-spinner" />
            <p>Đang chấm điểm...</p>
          </div>
        ) : isRecording ? (
          <button
            id={`btn-stop-recording-${currentIdx}`}
            className="pt-record-btn pt-record-stop"
            onClick={stopRecording}
          >
            ⏹ Dừng lại
          </button>
        ) : (
          <button
            id={`btn-start-recording-${currentIdx}`}
            className="pt-record-btn pt-record-start"
            onClick={startRecording}
          >
            🎤 Bắt đầu nói
          </button>
        )}
      </div>

      {!isRecording && !isAssessing && (
        <button className="pt-skip-btn" onClick={handleSkip}>
          Bỏ qua câu này
        </button>
      )}
    </div>
  );
};
