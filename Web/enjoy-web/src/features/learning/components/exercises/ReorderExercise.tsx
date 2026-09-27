import React, { useState, useEffect, useRef } from 'react';
import type { Vocabulary } from '../../types';

interface ReorderExerciseProps {
  vocabularies: Vocabulary[];
  onComplete: (allPassed: boolean) => void;
  onMistake: () => void;
  onProgress?: (current: number, total: number) => void;
}

export const ReorderExercise: React.FC<ReorderExerciseProps> = ({ vocabularies, onComplete, onMistake, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVocab = vocabularies[currentIndex];
  const word = currentVocab?.word ?? '';

  // Xáo trộn chữ cái của từ hiện tại
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  // Mảng câu trả lời của trẻ (index của ô)
  const [answer, setAnswer] = useState<string[]>([]);

  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Focus vào ô đầu tiên khi mount
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Khi đổi sang từ mới
  useEffect(() => {
    if (!word) return;
    setShuffledLetters(word.split('').sort(() => Math.random() - 0.5));
    setAnswer(Array(word.length).fill(''));
    setChecked(false);
    setIsCorrect(false);
    inputRefs.current = [];
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    
    if (onProgress) {
      onProgress(currentIndex, vocabularies.length);
    }
  }, [currentIndex, word, vocabularies.length, onProgress]);

  const handleInputChange = (boxIndex: number, value: string) => {
    if (checked) return;
    const char = value.slice(-1).toLowerCase(); // lấy ký tự cuối
    const newAnswer = [...answer];
    newAnswer[boxIndex] = char;
    setAnswer(newAnswer);

    // Tự động chuyển ô tiếp theo
    if (char && boxIndex < word.length - 1) {
      inputRefs.current[boxIndex + 1]?.focus();
    }
  };

  const handleKeyDown = (boxIndex: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !answer[boxIndex] && boxIndex > 0) {
      const newAnswer = [...answer];
      newAnswer[boxIndex - 1] = '';
      setAnswer(newAnswer);
      inputRefs.current[boxIndex - 1]?.focus();
    }
    
    if (e.key === 'Enter') {
      if (!checked && answer.length === word.length && !answer.some(a => !a)) {
        handleCheck();
      } else if (checked && !isCorrect) {
        handleRetry();
      } else if (checked && isCorrect) {
        handleNext();
      }
    }
  };

  const handleCheck = () => {
    const typed = answer.join('').toLowerCase();
    const correct = word.toLowerCase();
    const isRight = typed === correct;
    setIsCorrect(isRight);
    setChecked(true);
    if (!isRight) {
      onMistake();
    }
  };

  const handleRetry = () => {
    setAnswer(Array(word.length).fill(''));
    setChecked(false);
    setIsCorrect(false);
    inputRefs.current[0]?.focus();
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(true);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  // Hiển thị chữ cái mẫu xáo trộn — letter chip bị mờ khi ký tự đó đã gõ đủ
  const letterCount = (arr: string[]) => {
    const map: Record<string, number> = {};
    arr.forEach(c => { if (c) map[c] = (map[c] || 0) + 1; });
    return map;
  };

  const usedCount = letterCount(answer.filter(Boolean));

  const isChipUsed = (letter: string, chipIndex: number) => {
    // Đếm xem trước vị trí chipIndex này đã có bao nhiêu chip cùng chữ bị dùng
    let countBefore = 0;
    for (let i = 0; i < chipIndex; i++) {
      if (shuffledLetters[i].toLowerCase() === letter.toLowerCase()) countBefore++;
    }
    const needed = usedCount[letter.toLowerCase()] || 0;
    return countBefore < needed;
  };

  if (!currentVocab) return <div>Không có từ vựng</div>;

  return (
    <div className="reorder-exercise">
      <p className="exercise-instruction">Ghép từ ({currentIndex + 1} / {vocabularies.length})</p>

      {currentVocab.imageUrl && (
        <img src={currentVocab.imageUrl} alt={word} className="reorder-image" />
      )}

      <p className="exercise-instruction">Gõ các chữ cái để ghép thành từ đúng</p>

      {/* Chữ cái mẫu xáo trộn */}
      <div className="reorder-chips">
        {shuffledLetters.map((letter, i) => (
          <span
            key={i}
            className={`reorder-chip ${isChipUsed(letter, i) ? 'chip-used' : ''}`}
          >
            {letter.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Các ô nhập */}
      <div className="reorder-boxes">
        {Array.from({ length: word.length }).map((_, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            className={[
              'reorder-box',
              checked && !isCorrect ? 'reorder-box--wrong' : '',
              checked && isCorrect  ? 'reorder-box--correct' : '',
            ].join(' ')}
            type="text"
            maxLength={2}
            value={answer[i] || ''}
            onChange={e => handleInputChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={checked}
          />
        ))}
      </div>

      {/* Kết quả sau khi kiểm tra */}
      {checked && (
        <div className={`reorder-result ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect
            ? <p>✅ Chính xác! Từ đúng là <strong>{word}</strong></p>
            : <p>❌ Chưa đúng. Hãy thử lại nhé!</p>
          }
        </div>
      )}

      <div className="reorder-actions">
        {!checked && (
          <button
            id="reorder-check-btn"
            className="btn-check"
            onClick={handleCheck}
            disabled={answer.length !== word.length || answer.some(a => !a)}
          >
            Kiểm tra ✔
          </button>
        )}
        {checked && !isCorrect && (
          <button className="btn-retry" onClick={handleRetry}>🔄 Gõ lại</button>
        )}
        {checked && isCorrect && (
          <button className="btn-next-exercise" onClick={handleNext}>
            Tiếp tục →
          </button>
        )}
        {checked && !isCorrect && (
          <button className="btn-skip" onClick={handleSkip}>
            Bỏ qua →
          </button>
        )}
      </div>
    </div>
  );
};
