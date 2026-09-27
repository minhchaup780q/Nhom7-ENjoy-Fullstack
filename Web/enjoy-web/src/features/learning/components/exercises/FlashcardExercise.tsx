import React, { useState, useEffect } from 'react';
import type { Vocabulary } from '../../types';

interface FlashcardExerciseProps {
  vocabularies: Vocabulary[];
  onComplete: () => void;
  onProgress?: (current: number, total: number) => void;
}

export const FlashcardExercise: React.FC<FlashcardExerciseProps> = ({ vocabularies, onComplete, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentVocab = vocabularies[currentIndex];

  // Tự động phát âm khi hiện mặt trước của mỗi từ
  useEffect(() => {
    setFlipped(false);
    if (!currentVocab) return;

    const timer = setTimeout(() => {
      if (currentVocab.audioUrl) {
        new Audio(currentVocab.audioUrl).play().catch(() => {});
      } else if (currentVocab.word && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentVocab.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    }, 400);
    
    if (onProgress) {
      onProgress(currentIndex, vocabularies.length);
    }
    
    return () => clearTimeout(timer);
  }, [currentIndex, currentVocab, vocabularies.length, onProgress]);

  const playAudio = () => {
    if (!currentVocab) return;
    if (currentVocab.audioUrl) {
      new Audio(currentVocab.audioUrl).play().catch(() => {});
    } else if (currentVocab.word && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentVocab.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(); // Đã học xong từ cuối cùng
    }
  };

  if (!currentVocab) return <div>Không có từ vựng</div>;

  return (
    <div className="flashcard-exercise">
      <p className="exercise-instruction">
        Làm quen từ mới ({currentIndex + 1} / {vocabularies.length})<br/>
        Nhấn vào thẻ để xem nghĩa
      </p>

      <div
        className={`flashcard-wrapper ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
      >
        {/* Mặt trước: ảnh + từ tiếng Anh */}
        <div className="flashcard-face flashcard-front">
          {currentVocab.imageUrl && (
            <img src={currentVocab.imageUrl} alt={currentVocab.word} className="flashcard-image" />
          )}
          <span className="flashcard-word">{currentVocab.word}</span>
          <button
            className="flashcard-audio-btn"
            onClick={e => { e.stopPropagation(); playAudio(); }}
            aria-label="Phát âm"
          >
            🔊
          </button>
        </div>

        {/* Mặt sau: bản dịch */}
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-translation">{currentVocab.translation || '—'}</span>
        </div>
      </div>

      <button className="btn-next-exercise" onClick={handleNext}>
        {currentIndex < vocabularies.length - 1 ? 'Từ tiếp theo →' : 'Hoàn thành Vòng 1 →'}
      </button>
    </div>
  );
};
