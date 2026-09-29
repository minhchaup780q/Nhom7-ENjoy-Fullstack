import React, { useState, useEffect } from 'react';
import type { Vocabulary } from '../../types';
import { ExerciseFooter } from '../ui/ExerciseFooter';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';

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

    const fallbackToSpeech = () => {
      if (currentVocab.word && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentVocab.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    };

    if (currentVocab.audioUrl) {
      const safeUrl = currentVocab.audioUrl.replace(/ /g, '%20');
      new Audio(safeUrl).play().catch(() => fallbackToSpeech());
    } else {
      fallbackToSpeech();
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
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-6 md:gap-8 pt-4 px-4">
        
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Learn new words
        </h2>

        {/* Div chứa Flashcard (Mặt trước: Ảnh, Mặt sau: Dịch nghĩa) */}
        <div
          className="relative cursor-pointer group flex justify-center items-center w-full max-w-xl mx-auto"
          style={{ perspective: '1000px', height: '32vh', minHeight: '220px' }}
          onClick={() => setFlipped(f => !f)}
        >
          <div 
            className="w-full h-full transition-transform duration-500 relative flex justify-center items-center"
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
          >
            {/* Mặt trước: Hình ảnh */}
            <div 
              className="absolute inset-0 flex justify-center items-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {currentVocab.imageUrl ? (
                <img 
                  src={currentVocab.imageUrl} 
                  alt={currentVocab.word} 
                  className="h-full w-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none"
                />
              ) : (
                <div className="h-full w-full max-w-sm bg-gray-100 rounded-2xl md:rounded-3xl shadow-xl border-4 border-white flex items-center justify-center">
                  <span className="text-gray-400 font-medium">Không có ảnh</span>
                </div>
              )}
            </div>

            {/* Mặt sau: Bản dịch */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
               <div className="h-full w-full max-w-sm bg-primary rounded-2xl md:rounded-3xl shadow-xl flex items-center justify-center p-6 border-4 border-white">
                 <span className="text-3xl md:text-4xl font-display font-bold text-white text-center">
                   {currentVocab.translation || '—'}
                 </span>
               </div>
            </div>
          </div>
        </div>

        {/* Cụm Loa + Từ tiếng Anh */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            className="text-primary hover:scale-110 active:scale-95 transition-transform"
            onClick={e => { e.stopPropagation(); playAudio(); }}
            aria-label="Phát âm"
          >
            <SpeakerWaveIcon className="w-8 h-8 drop-shadow-md" />
          </button>
          <span className="text-3xl md:text-4xl font-display font-bold text-text-main text-center">
            {currentVocab.word}
          </span>
        </div>

      </div>

      {/* Footer chung */}
      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status="learning"
          onCheck={() => {}}
          onNext={handleNext}
          nextLabel={currentIndex < vocabularies.length - 1 ? 'Từ tiếp theo' : 'Hoàn thành'}
        />
      </div>
    </div>
  );
};

