import React, { useState, useEffect } from 'react';
import type { ReorderSentenceItem } from '../../types';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';

interface ReorderSentenceExerciseProps {
  payload: any;
  onComplete: () => void;
  onMistake: () => void;
  onProgress?: (current: number, total: number) => void;
}

interface WordOption {
  id: string; // unique id
  text: string;
}

export const ReorderSentenceExercise: React.FC<ReorderSentenceExerciseProps> = ({
  payload,
  onComplete,
  onMistake,
  onProgress
}) => {
  const items = (payload.items as ReorderSentenceItem[]) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Các từ ban đầu (đã xáo trộn) ở Source Area
  const [sourceWords, setSourceWords] = useState<WordOption[]>([]);
  // Các từ đã được chọn lên Target Area
  const [targetWords, setTargetWords] = useState<WordOption[]>([]);
  
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');
  const currentItem = items[currentIndex];

  const playAudio = (url: string) => {
    if (!url && currentItem?.sentence) {
      fallbackToSpeechSynthesis(currentItem.sentence);
      return;
    }
    const safeUrl = url.replace(/ /g, '%20');
    const audio = new Audio(safeUrl);
    audio.play().catch(e => {
      console.warn('Primary audio failed, falling back to Web Speech API...', e);
      if (currentItem && currentItem.sentence) {
        fallbackToSpeechSynthesis(currentItem.sentence);
      }
    });
  };

  const fallbackToSpeechSynthesis = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (currentItem) {
      const words = currentItem.sentence.split(/\s+/).filter(w => w.trim().length > 0);
      
      const shuffled = [...words]
        .map((text, idx) => ({ id: `${idx}-${text}`, text, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ id, text }) => ({ id, text }));
        
      setSourceWords(shuffled);
      setTargetWords([]);
      setFooterStatus('idle');

      if (currentItem.audio_url) {
        timeoutId = setTimeout(() => playAudio(currentItem.audio_url), 300);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex, currentItem]);

  useEffect(() => {
    if (onProgress && currentItem) {
      onProgress(currentIndex, items.length);
    }
  }, [currentIndex, items.length, onProgress, currentItem]);

  if (!currentItem) return null;

  const totalWords = sourceWords.length + targetWords.length;

  const handleSelectWord = (word: WordOption) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    
    setSourceWords(prev => prev.filter(w => w.id !== word.id));
    setTargetWords(prev => {
      const newTarget = [...prev, word];
      if (newTarget.length === totalWords) {
        setFooterStatus('selected');
      } else {
        setFooterStatus('idle');
      }
      return newTarget;
    });
  };

  const handleDeselectWord = (word: WordOption) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    
    setTargetWords(prev => prev.filter(w => w.id !== word.id));
    setSourceWords(prev => [...prev, word]);
    setFooterStatus('idle');
  };

  const handleCheck = () => {
    if (targetWords.length === 0) return;
    
    const userSentence = targetWords.map(w => w.text).join(' ');
    // Bỏ qua dấu câu và viết hoa viết thường khi so sánh
    const normalize = (s: string) => s.replace(/[^\w\s]/g, '').toLowerCase().trim();
    const isCorrect = normalize(userSentence) === normalize(currentItem.sentence);

    if (isCorrect) {
      setFooterStatus('correct');
    } else {
      setFooterStatus('incorrect');
      onMistake();
    }
  };

  const handleRetry = () => {
    setSourceWords(prev => [...prev, ...targetWords].sort((a, b) => a.id.localeCompare(b.id)));
    setTargetWords([]);
    setFooterStatus('idle');
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (onProgress) onProgress(items.length, items.length);
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-4 md:gap-6 pt-4 md:pt-6 px-4">
        
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Reorder the words to make a sentence.
        </h2>

        {currentItem.image_url && (
          <div className="flex justify-center items-center">
            <img 
              src={currentItem.image_url} 
              alt="Reorder sentence" 
              className="max-h-[28vh] md:max-h-[32vh] max-w-[90vw] md:max-w-xl w-auto h-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none" 
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-2 mb-4">
          <button 
            onClick={() => { if (currentItem.audio_url) playAudio(currentItem.audio_url); }}
            className="text-primary hover:scale-110 active:scale-95 transition-transform"
          >
            <SpeakerWaveIcon className="w-8 h-8 drop-shadow-md" />
          </button>
        </div>

        {/* Khung chứa các từ đã chọn (Target Area) */}
        <div className="w-full min-h-[60px] flex flex-wrap justify-center items-center gap-2 p-3 border-b-2 border-dashed border-gray-300">
          {targetWords.map((word) => {
            const isError = footerStatus === 'incorrect';
            const isSuccess = footerStatus === 'correct';
            
            return (
              <button
                key={word.id}
                onClick={() => handleDeselectWord(word)}
                className={`px-4 py-2 text-lg md:text-xl font-bold font-display rounded-xl border-2 shadow-[0_3px_0_0] active:translate-y-1 active:shadow-none transition-all
                  ${isError ? 'bg-[#ff4b4b] text-white border-[#d93d3d] shadow-[#d93d3d] animate-[shake_0.4s_ease-in-out]' : 
                    isSuccess ? 'bg-[#58cc02] text-white border-[#46a302] shadow-[#46a302]' : 
                    'bg-white text-text-main border-gray-200 shadow-gray-200 hover:bg-gray-50'}`}
                disabled={footerStatus === 'correct' || footerStatus === 'incorrect'}
              >
                {word.text}
              </button>
            )
          })}
        </div>

        {/* Khung chứa các từ nguồn (Source Area) */}
        <div className="w-full flex flex-wrap justify-center gap-3 mt-6">
          {sourceWords.map((word) => (
            <button
              key={word.id}
              onClick={() => handleSelectWord(word)}
              className="px-4 py-2 text-lg md:text-xl font-bold font-display bg-white text-text-main rounded-xl border-2 border-gray-200 shadow-[0_3px_0_rgba(229,231,235,1)] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all"
            >
              {word.text}
            </button>
          ))}
          {/* Giữ chỗ cho các từ đã được chọn để Source area không bị co lại */}
          {targetWords.map((word) => (
             <div 
               key={`placeholder-${word.id}`} 
               className="px-4 py-2 text-lg md:text-xl font-bold font-display bg-gray-100 text-transparent rounded-xl border-2 border-dashed border-gray-200 shadow-none pointer-events-none select-none opacity-50"
             >
               {word.text}
             </div>
          ))}
        </div>

      </div>

      {/* Footer kiểm tra đáp án */}
      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={handleCheck}
          onNext={handleNext}
          onRetry={footerStatus === 'incorrect' ? handleRetry : undefined}
          hideNextButton={footerStatus === 'incorrect'}
          disabled={targetWords.length !== totalWords}
          correctAnswer={currentItem.sentence}
          nextLabel={currentIndex === items.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
        />
      </div>
    </div>
  );
};
