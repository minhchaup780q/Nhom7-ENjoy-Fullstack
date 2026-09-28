import React, { useState, useEffect } from 'react';
import type { SessionPayload, FillInBlankItem } from '../../types';
import { Button3D } from '../../../../components/ui/Button3D';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { ExerciseFooter } from '../ui/ExerciseFooter';
import type { FooterStatus } from '../ui/ExerciseFooter';

interface Props {
  payload: SessionPayload;
  onComplete: () => void;
  onMistake: () => void;
  onProgress?: (current: number, total: number) => void;
}

function playAudio(url: string): void {
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

export const FillInBlankExercise: React.FC<Props> = ({
  payload,
  onComplete,
  onMistake,
  onProgress
}) => {
  const items: FillInBlankItem[] = payload.items || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');
  const [options, setOptions] = useState<string[]>([]);
  
  const currentItem = items[currentIndex];

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (currentItem) {
      // shuffle answer + distractors
      const rawOptions = [currentItem.answer, ...(currentItem.distractors || [])];
      const shuffled = [...rawOptions].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
      setSelectedOption(null);
      setFooterStatus('idle');

      // Play audio automatically
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

  const handleSelectOption = (option: string) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    if (selectedOption === option) {
      setSelectedOption(null);
      setFooterStatus('idle');
    } else {
      setSelectedOption(option);
      setFooterStatus('selected');
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    
    if (selectedOption === currentItem.answer) {
      setFooterStatus('correct');
      // Có thể thêm âm thanh ting ở đây
    } else {
      setFooterStatus('incorrect');
      onMistake();
    }
  };

  const handleNext = () => {
    if (footerStatus === 'incorrect') {
      setSelectedOption(null);
      setFooterStatus('idle');
    } else if (footerStatus === 'correct') {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        if (onProgress) onProgress(items.length, items.length);
        onComplete();
      }
    }
  };

  // split sentence by [...]
  const parts = currentItem.sentence.split(/\[(.*?)\]/);
  
  const renderSentence = () => {
    return (
      <div className="text-2xl md:text-3xl font-bold font-display text-text-main flex flex-wrap justify-center items-center gap-x-2 gap-y-4 leading-relaxed drop-shadow-sm">
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // Đây là phần ô trống
            const isFilled = footerStatus === 'correct' && selectedOption === currentItem.answer;
            return (
              <span key={index} className={`inline-block border-b-4 pb-1 px-4 text-center min-w-[80px] transition-all duration-300 ${isFilled ? 'text-success border-success scale-110' : 'border-[#e5e5e5] text-transparent'}`}>
                {isFilled ? part : '_____'}
              </span>
            );
          }
          return <span key={index} className="text-text-main">{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-4 md:gap-6 pt-2 px-4">
        
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Listen and choose the right word.
        </h2>

        {currentItem.image_url && (
          <div className="flex justify-center items-center">
            <img 
              src={currentItem.image_url} 
              alt="Fill in blank" 
              className="max-h-[28vh] md:max-h-[32vh] max-w-[90vw] md:max-w-xl w-auto h-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none" 
            />
          </div>
        )}

        {/* Câu hỏi có chỗ trống (hiển thị kèm loa) */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button 
            onClick={() => { if (currentItem.audio_url) playAudio(currentItem.audio_url); }}
            className="text-primary hover:scale-110 active:scale-95 transition-transform"
          >
            <SpeakerWaveIcon className="w-8 h-8 drop-shadow-md" />
          </button>
          {renderSentence()}
        </div>

        {/* Các nút chọn đáp án (cùng một hàng) */}
        <div className="w-full flex flex-row flex-wrap justify-center gap-4 mt-4">
          {options.map((opt, idx) => {
            let variant: 'gray' | 'green' | 'red' | 'blue' = 'gray';
            let btnClass = '!text-text-main hover:!border-primary/50';
            
            if (selectedOption === opt) {
              if (footerStatus === 'correct') {
                variant = 'green';
                btnClass = '!text-white';
              } else if (footerStatus === 'incorrect') {
                variant = 'red';
                btnClass = '!text-white animate-[shake_0.4s_ease-in-out]';
              } else {
                // Đã chọn tạm thời nhưng chưa kiểm tra -> Nền xám đậm, chữ trắng
                variant = 'gray';
                btnClass = '!bg-gray-700 hover:!bg-gray-800 !text-white !border-gray-700 !shadow-[0_4px_0_#1f2937] active:!shadow-none scale-105';
              }
            }

            return (
              <Button3D
                key={idx}
                variant={variant}
                size="md"
                className={`text-base md:text-lg font-bold font-display tracking-wide px-6 md:px-10 transition-all ${btnClass}`}
                onClick={() => handleSelectOption(opt)}
                disabled={footerStatus === 'correct' || footerStatus === 'incorrect'}
              >
                {opt}
              </Button3D>
            );
          })}
        </div>
      </div>

      {/* Footer kiểm tra đáp án */}
      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={handleCheck}
          onNext={handleNext}
          disabled={!selectedOption}
          correctAnswer={currentItem.answer}
        />
      </div>
    </div>
  );
};
