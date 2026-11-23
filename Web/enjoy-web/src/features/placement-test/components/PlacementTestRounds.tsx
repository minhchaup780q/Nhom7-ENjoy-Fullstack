import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Round1Question,
  Round2Question,
  Round3Question,
  Round1Answer,
  Round2Answer,
  Round3Answer,
} from '../../learning/types/placementTest';

// ================================================================
// VÒNG 1: NGHE TỪ VỰNG RỒI CHỌN ẢNH (LISTEN_AND_CHOOSE_IMAGE)
// ================================================================

interface ListenAndChooseImageRoundProps {
  questions: Round1Question[];
  onComplete: (answers: Round1Answer[]) => void;
}

export const ListenAndChooseImageRound: React.FC<ListenAndChooseImageRoundProps> = ({
  questions,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Round1Answer[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = questions && questions[currentIdx];

  // Phát audio mỗi khi chuyển sang câu mới
  useEffect(() => {
    if (current?.audio_url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(current.audio_url);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);

      // Thử tự động phát âm thanh
      audio.play().catch(() => {
        // Trình duyệt chặn autoplay thì người dùng tự bấm loa
        setIsPlaying(false);
      });
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [currentIdx, current?.audio_url]);

  const handlePlayAudio = () => {
    if (!current?.audio_url) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      const audio = new Audio(current.audio_url);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audio.play().catch(() => {});
    }
  };

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
  };

  const handleNext = () => {
    if (!current || !selectedOptionId) return;

    const newAnswer: Round1Answer = {
      question_id: current.question_id,
      topic: current.topic,
      selected_option_id: selectedOptionId,
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelectedOptionId(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  if (!questions || questions.length === 0 || !current) {
    return (
      <div className="pt-round pt-vocab-round text-center p-8">
        <p className="text-text-muted mb-4">Không có câu hỏi nghe chọn ảnh cho phần thi này.</p>
        <button className="pt-continue-btn" onClick={() => onComplete([])}>
          Tiếp tục →
        </button>
      </div>
    );
  }

  return (
    <div className="pt-round">
      <div className="pt-round-header">
        <span className="pt-round-badge">Vòng 1</span>
        <h2 className="pt-round-title">Nghe từ vựng và chọn hình ảnh đúng</h2>
        <p className="pt-progress-text">
          Câu {currentIdx + 1} / {questions.length} • Chủ đề: <strong>{current.topic}</strong>
        </p>
      </div>

      {/* Loa phát âm */}
      <div className="pt-audio-container">
        <button
          type="button"
          id={`btn-play-audio-${currentIdx}`}
          className={`pt-audio-btn ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayAudio}
          title="Nhấn để nghe lại"
        >
          <span className="text-2xl">🔊</span>
          <span>{isPlaying ? 'Đang phát...' : 'Nghe lại phát âm'}</span>
        </button>
      </div>

      {/* 3 Lựa chọn hình ảnh */}
      <div className="pt-image-options-grid">
        {current.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              id={`option-${opt.id}`}
              className={`pt-image-option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectOption(opt.id)}
            >
              <div className="pt-option-img-wrapper">
                <img
                  src={opt.image_url}
                  alt={opt.label}
                  className="pt-option-img"
                  onError={(e) => {
                    // Fallback nếu ảnh không load được
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/200x200/png?text=' + encodeURIComponent(opt.label);
                  }}
                />
              </div>
              <span className="pt-option-label">{opt.label}</span>
            </div>
          );
        })}
      </div>

      {/* Nút tiếp tục */}
      <button
        id="btn-r1-continue"
        className="pt-continue-btn"
        disabled={!selectedOptionId}
        onClick={handleNext}
      >
        {currentIdx + 1 < questions.length ? 'Tiếp tục →' : 'Hoàn thành vòng 1 →'}
      </button>
    </div>
  );
};

// ================================================================
// VÒNG 2: NỐI TỪ VỚI NGHĨA (MATCH_PAIR)
// ================================================================

interface MatchPairRoundProps {
  questions: Round2Question[];
  onComplete: (answers: Round2Answer[]) => void;
}

export const MatchPairRound: React.FC<MatchPairRoundProps> = ({ questions, onComplete }) => {
  const BATCH_SIZE = 6;
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<{ leftIdx: number; rightIdx: number }[]>([]);
  const [answers, setAnswers] = useState<Round2Answer[]>([]);

  // Guard check nếu danh sách câu hỏi rỗng
  if (!questions || questions.length === 0) {
    return (
      <div className="pt-round pt-vocab-round">
        <div className="pt-round-header">
          <span className="pt-round-badge">Vòng 2</span>
          <h2 className="pt-round-title">Nối từ với nghĩa tương ứng</h2>
        </div>
        <p className="text-center text-text-muted py-8">Không có câu hỏi từ vựng cho phần thi này.</p>
        <button id="btn-vocab-continue" className="pt-continue-btn" onClick={() => onComplete([])}>
          Tiếp tục →
        </button>
      </div>
    );
  }

  const getBatch = useCallback((idx: number) => {
    const start = idx * BATCH_SIZE;
    return questions.slice(start, start + BATCH_SIZE);
  }, [questions]);

  const batch = getBatch(batchIndex);
  const totalBatches = Math.max(1, Math.ceil(questions.length / BATCH_SIZE));

  const [rightItems, setRightItems] = useState<{ meaning: string; originalIdx: number }[]>(() => {
    return [...batch.map((q, i) => ({ meaning: q.meaning, originalIdx: i }))]
      .sort(() => Math.random() - 0.5);
  });

  useEffect(() => {
    setRightItems(
      [...batch.map((q, i) => ({ meaning: q.meaning, originalIdx: i }))]
        .sort(() => Math.random() - 0.5)
    );
    setMatched([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [batchIndex, questions]);

  const handleLeftClick = (idx: number) => {
    if (matched.some(m => m.leftIdx === idx)) return;
    setSelectedLeft(idx === selectedLeft ? null : idx);
  };

  const handleRightClick = (idx: number) => {
    if (matched.some(m => m.rightIdx === idx)) return;
    setSelectedRight(idx === selectedRight ? null : idx);
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const newMatch = { leftIdx: selectedLeft, rightIdx: selectedRight };
      setMatched(prev => [...prev, newMatch]);

      const q = batch[selectedLeft];
      const selectedMeaning = rightItems[selectedRight].meaning;
      setAnswers(prev => [
        ...prev,
        {
          question_id: q.question_id,
          topic: q.topic,
          word: q.word,
          selected_meaning: selectedMeaning,
        },
      ]);

      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [selectedLeft, selectedRight, batch, rightItems]);

  const allMatched = matched.length === batch.length;

  const handleNext = () => {
    if (batchIndex + 1 < totalBatches) {
      setBatchIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const isLeftMatched = (idx: number) => matched.some(m => m.leftIdx === idx);
  const isRightMatched = (idx: number) => matched.some(m => m.rightIdx === idx);

  return (
    <div className="pt-round pt-vocab-round">
      <div className="pt-round-header">
        <span className="pt-round-badge">Vòng 2</span>
        <h2 className="pt-round-title">Nối từ tiếng Anh với nghĩa tương ứng</h2>
        {totalBatches > 1 && (
          <p className="pt-batch-info">Đợt {batchIndex + 1} / {totalBatches}</p>
        )}
      </div>

      <div className="pt-match-grid">
        {/* Left: English words */}
        <div className="pt-match-col pt-match-left">
          {batch.map((q, idx) => (
            <button
              key={q.question_id || idx}
              id={`vocab-left-${idx}`}
              className={`pt-match-item ${selectedLeft === idx ? 'selected' : ''} ${isLeftMatched(idx) ? 'matched' : ''}`}
              onClick={() => handleLeftClick(idx)}
            >
              {q.word}
            </button>
          ))}
        </div>

        {/* Right: Vietnamese meanings */}
        <div className="pt-match-col pt-match-right">
          {rightItems.map((item, idx) => (
            <button
              key={idx}
              id={`vocab-right-${idx}`}
              className={`pt-match-item ${selectedRight === idx ? 'selected' : ''} ${isRightMatched(idx) ? 'matched' : ''}`}
              onClick={() => handleRightClick(idx)}
            >
              {item.meaning}
            </button>
          ))}
        </div>
      </div>

      {allMatched && (
        <button id="btn-vocab-continue" className="pt-continue-btn" onClick={handleNext}>
          {batchIndex + 1 < totalBatches ? 'Đợt tiếp theo →' : 'Hoàn thành vòng 2 →'}
        </button>
      )}
    </div>
  );
};

// ================================================================
// VÒNG 3: SẮP XẾP CÂU (SENTENCE_BUILDER)
// ================================================================

interface SentenceBuilderRoundProps {
  questions: Round3Question[];
  onComplete: (answers: Round3Answer[]) => void;
}

export const SentenceBuilderRound: React.FC<SentenceBuilderRoundProps> = ({
  questions,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Round3Answer[]>([]);

  // Tách câu thành các từ xáo trộn cho từng câu hỏi
  const [wordBanks, setWordBanks] = useState<string[][]>(() =>
    (questions || []).map(q => {
      const words = (q.sentence || '').split(' ').filter(Boolean);
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      if (words.length > 1 && shuffled.join(' ') === words.join(' ')) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = temp;
      }
      return shuffled;
    })
  );

  const [userOrder, setUserOrder] = useState<string[][]>(() => (questions || []).map(() => []));

  if (!questions || questions.length === 0 || !questions[currentIdx]) {
    return (
      <div className="pt-round pt-grammar-round">
        <div className="pt-round-header">
          <span className="pt-round-badge">Vòng 3</span>
          <h2 className="pt-round-title">Sắp xếp các từ thành câu đúng</h2>
        </div>
        <p className="text-center text-text-muted py-8">Không có câu hỏi cho phần thi này.</p>
        <button className="pt-continue-btn" onClick={() => onComplete(answers)}>
          Hoàn thành bài kiểm tra →
        </button>
      </div>
    );
  }

  const current = questions[currentIdx];

  const handleWordClick = (word: string, fromBank: boolean) => {
    const newBanks = [...wordBanks];
    const newOrder = [...userOrder];

    if (fromBank) {
      newBanks[currentIdx] = newBanks[currentIdx].filter(w => w !== word);
      newOrder[currentIdx] = [...newOrder[currentIdx], word];
    } else {
      newOrder[currentIdx] = newOrder[currentIdx].filter(w => w !== word);
      newBanks[currentIdx] = [...newBanks[currentIdx], word];
    }

    setWordBanks(newBanks);
    setUserOrder(newOrder);
  };

  const handleSubmitSentence = () => {
    const userSentence = userOrder[currentIdx].join(' ');
    const newAnswers: Round3Answer[] = [
      ...answers,
      {
        question_id: current.question_id,
        topic: current.topic,
        user_sentence: userSentence,
      },
    ];
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
        <span className="pt-round-badge">Vòng 3</span>
        <h2 className="pt-round-title">Sắp xếp các từ thành câu hoàn chỉnh</h2>
        <p className="pt-progress-text">
          Câu {currentIdx + 1} / {questions.length} • {current.topic}
        </p>
      </div>

      {/* Hiển thị nghĩa tiếng Việt để user dịch sang tiếng Anh */}
      {current.meaning && (
        <div className="text-center mb-5 p-3 rounded-xl bg-primary-soft/50 border border-primary/20">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">
            Dịch câu sau sang tiếng Anh:
          </span>
          <span className="text-lg font-extrabold text-primary">
            "{current.meaning}"
          </span>
        </div>
      )}

      {/* Khung câu user đang ghép */}
      <div className="pt-sentence-area">
        <div className="pt-sentence-slots">
          {userOrder[currentIdx].length === 0 ? (
            <span className="pt-sentence-placeholder">Chạm vào từ bên dưới để ghép câu...</span>
          ) : (
            userOrder[currentIdx].map((word, i) => (
              <button
                key={i}
                type="button"
                className="pt-word-chip pt-word-in-sentence"
                onClick={() => handleWordClick(word, false)}
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Ngân hàng từ */}
      <div className="pt-word-bank">
        {wordBanks[currentIdx].map((word, i) => (
          <button
            key={i}
            type="button"
            className="pt-word-chip pt-word-in-bank"
            onClick={() => handleWordClick(word, true)}
          >
            {word}
          </button>
        ))}
      </div>

      <button
        id={`btn-sentence-submit-${currentIdx}`}
        type="button"
        className="pt-continue-btn"
        disabled={userOrder[currentIdx].length === 0}
        onClick={handleSubmitSentence}
      >
        {currentIdx + 1 < questions.length ? 'Tiếp tục →' : 'Hoàn thành & Nộp bài kiểm tra 🚀'}
      </button>
    </div>
  );
};
