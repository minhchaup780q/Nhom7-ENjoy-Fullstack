import React, { useState, useEffect, useRef } from 'react';
import type { Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';

interface ReorderExerciseProps {
  vocabularies: Vocabulary[];
  onComplete: (allPassed: boolean) => void;
  onMistake?: (data: MistakeCreatePayload) => void;
  onProgress?: (current: number, total: number) => void;
}

export const ReorderExercise: React.FC<ReorderExerciseProps> = ({ vocabularies, onComplete, onMistake, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVocab = vocabularies[currentIndex];
  const word = currentVocab?.word ?? '';

  // Xáo trộn chữ cái của từ hiện tại
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onProgressRef = useRef(onProgress);
  const onMistakeRef = useRef(onMistake);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onMistakeRef.current = onMistake;
  }, [onProgress, onMistake]);

  useEffect(() => {
    if (!word) return;
    
    // Đảm bảo chữ cái bị xáo trộn không giống hệt từ gốc (nếu từ dài hơn 1 chữ)
    let shuffled = word.split('').sort(() => Math.random() - 0.5);
    while (word.length > 1 && shuffled.join('') === word) {
      shuffled = word.split('').sort(() => Math.random() - 0.5);
    }
    setShuffledLetters(shuffled);
    
    setAnswer(Array(word.length).fill(''));
    setFooterStatus('idle');
    inputRefs.current = [];
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    
    if (onProgressRef.current) {
      onProgressRef.current(currentIndex, vocabularies.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, word, vocabularies.length]);

  const handleInputChange = (boxIndex: number, value: string) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    const char = value.slice(-1).toLowerCase(); // lấy ký tự cuối
    const newAnswer = [...answer];
    newAnswer[boxIndex] = char;
    setAnswer(newAnswer);

    // Cập nhật trạng thái footer
    const isFull = newAnswer.length === word.length && !newAnswer.some(a => !a);
    setFooterStatus(isFull ? 'selected' : 'idle');

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
      
      const isFull = newAnswer.length === word.length && !newAnswer.some(a => !a);
      setFooterStatus(isFull ? 'selected' : 'idle');
      
      inputRefs.current[boxIndex - 1]?.focus();
    }
    
    if (e.key === 'Enter') {
      if (footerStatus === 'selected') {
        handleCheck();
      } else if (footerStatus === 'incorrect' || footerStatus === 'correct') {
        handleNext();
      }
    }
  };

  const handleCheck = () => {
    const typed = answer.join('').toLowerCase();
    const correct = word.toLowerCase();
    const isRight = typed === correct;
    
    if (isRight) {
      setFooterStatus('correct');
      // Tự động phát âm khi đúng
      if (currentVocab.audioUrl) {
        new Audio(currentVocab.audioUrl.replace(/ /g, '%20')).play().catch(() => {});
      }
    } else {
      setFooterStatus('incorrect');
      if (onMistakeRef.current && currentVocab) {
        onMistakeRef.current({
          questionId: currentVocab.id,
          roundType: 4,
          wrongAnswerSubmitted: typed || 'Chưa hoàn thành',
        });
      }
    }
  };

  const handleRetry = () => {
    setAnswer(Array(word.length).fill(''));
    setFooterStatus('idle');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (onProgressRef.current) onProgressRef.current(vocabularies.length, vocabularies.length);
      onComplete(true);
    }
  };

  if (!currentVocab) return <div>Không có từ vựng</div>;

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-4 md:gap-6 pt-4 md:pt-6 px-4">
        
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Reorder the letters to make the correct word.
        </h2>

        {currentVocab.imageUrl && (
          <div className="flex justify-center items-center mt-2">
            <img 
              src={currentVocab.imageUrl} 
              alt={word} 
              className="max-h-[28vh] md:max-h-[32vh] max-w-[90vw] md:max-w-xl w-auto h-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none" 
              draggable="false"
            />
          </div>
        )}

        {/* Chữ bị xáo trộn không nằm trong div chip, chỉ là text viết thường */}
        <div className="text-2xl md:text-4xl font-display font-extrabold text-primary tracking-[0.2em] mt-2 mb-4">
          {shuffledLetters.join('').toLowerCase()}
        </div>

        {/* Các ô nhập */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-2xl px-2">
          {Array.from({ length: word.length }).map((_, i) => {
            const isCorrect = footerStatus === 'correct';
            const isWrong = footerStatus === 'incorrect';
            
            let boxClass = "w-12 h-14 md:w-16 md:h-18 text-2xl md:text-3xl font-display font-bold text-center rounded-xl border-b-4 focus:outline-none transition-all";
            
            if (isCorrect) {
              boxClass += " bg-green-50 border-[#58cc02] text-[#58cc02] ring-2 ring-[#58cc02]/40";
            } else if (isWrong) {
              boxClass += " bg-red-50 border-red-500 text-red-600 ring-2 ring-red-400 animate-shake";
            } else {
              boxClass += " bg-gray-50 border-gray-300 text-text-main focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";
            }

            return (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                className={boxClass}
                type="text"
                maxLength={2}
                value={answer[i] || ''}
                onChange={e => handleInputChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={footerStatus !== 'idle'}
              />
            );
          })}
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={handleCheck}
          onNext={handleNext}
          onRetry={footerStatus === 'incorrect' ? handleRetry : undefined}
          disabled={answer.length !== word.length || answer.some(a => !a)}
          correctAnswer={word.toLowerCase()}
          nextLabel={footerStatus === 'incorrect' ? 'BỎ QUA' : undefined}
        />
      </div>
    </div>
  );
};
