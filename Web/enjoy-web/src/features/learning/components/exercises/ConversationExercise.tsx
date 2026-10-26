import React, { useState, useEffect } from 'react';
import type { Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import pigImg from '../../../../assets/pig_conversation.png';
import duckImg from '../../../../assets/duck_conversation.webp';

interface ChatMessage {
  type: 'question' | 'answer' | 'distractor';
  text: string;
  audio_url: string;
  is_correct?: boolean;
}

interface ConversationItem {
  order: number;
  question: ChatMessage;
  answer: ChatMessage;
  distractor: ChatMessage;
}

interface ConversationExerciseProps {
  payload: any;
  vocabularies?: Vocabulary[];
  onComplete: () => void;
  onMistake?: (data: MistakeCreatePayload) => void;
  onProgress?: (current: number, total: number) => void;
}

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const ConversationExercise: React.FC<ConversationExerciseProps> = ({
  payload,
  vocabularies,
  onComplete,
  onMistake,
  onProgress
}) => {
  const items = (payload.items as ConversationItem[]) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ChatMessage | null>(null);
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');
  const [options, setOptions] = useState<ChatMessage[]>([]);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (currentItem) {
      // Shuffle answer and distractor
      const newOptions = shuffleArray([currentItem.answer, currentItem.distractor]);
      setOptions(newOptions);
      setSelectedOption(null);
      setFooterStatus('idle');

      // Auto-play the question audio
      const timer = setTimeout(() => {
        playAudio(currentItem.question.audio_url, currentItem.question.text);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentItem]);

  useEffect(() => {
    if (onProgress && currentItem) {
      onProgress(currentIndex, items.length);
    }
  }, [currentIndex, items.length, onProgress, currentItem]);

  const playAudio = (url: string, fallbackText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!url) {
      fallbackToSpeechSynthesis(fallbackText);
      return;
    }
    const safeUrl = url.replace(/ /g, '%20');
    const audio = new Audio(safeUrl);
    audio.play().catch(err => {
      console.warn('Audio play failed:', err);
      fallbackToSpeechSynthesis(fallbackText);
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

  const handleSelectOption = (option: ChatMessage) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    
    setSelectedOption(option);
    setFooterStatus('selected');
    
    // Play option audio when selected
    playAudio(option.audio_url, option.text);
  };

  const handleCheck = () => {
    if (!selectedOption) return;

    if (selectedOption.is_correct) {
      setFooterStatus('correct');
      // Thêm một chút delay rồi phát âm thanh báo đúng hoặc phát lại câu vừa chọn
    } else {
      setFooterStatus('incorrect');
      if (onMistake) {
        const vocabId = vocabularies?.[currentIndex]?.id || vocabularies?.[0]?.id || 1;
        onMistake({
          questionId: vocabId,
          roundType: 10,
          wrongAnswerSubmitted: selectedOption.text || 'Sai câu trả lời hội thoại',
          phonemeErrorType: JSON.stringify({
            question: currentItem.question,
            answer: currentItem.answer,
            distractor: currentItem.distractor,
          }),
        });
      }
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
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

  if (!currentItem) return null;

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start pt-2 md:pt-4 px-4 md:px-8">
        
        {/* Tiêu đề */}
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide mb-8 md:mb-12">
          Complete this conversation.
        </h2>

        {/* Chat UI */}
        <div className="w-full max-w-2xl flex flex-col gap-6 mb-8 px-2">
          
          {/* Bong bóng bên trái (Câu hỏi) */}
          <div className="flex justify-start w-full items-end gap-3">
            <img 
              src={pigImg} 
              alt="Pig" 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-pink-300 shadow-md shrink-0 bg-white animate-bounce-soft" 
            />
            <div className="flex items-center gap-2 max-w-[80%] md:max-w-[70%]">
              <div className="bg-pink-100 border-2 border-pink-200 rounded-2xl rounded-bl-none p-3 md:p-4 shadow-sm flex items-center gap-3">
                <button 
                  onClick={(e) => {
                    playAudio(currentItem.question.audio_url, currentItem.question.text, e);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary text-white hover:bg-primary-hover shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                </button>
                <p className="text-lg md:text-xl font-display font-bold text-text-main">
                  {currentItem.question.text}
                </p>
              </div>
            </div>
          </div>

          {/* Bong bóng bên phải (Câu trả lời) */}
          <div className="flex justify-end w-full items-end gap-3">
            <div className="flex items-center gap-2 max-w-[80%] md:max-w-[70%]">
              <div className="border-2 rounded-2xl rounded-br-none px-8 py-3 md:py-4 shadow-sm min-h-[3.5rem] min-w-[13rem] md:min-w-[16rem] flex items-center justify-center transition-colors bg-yellow-100 border-yellow-300">
                <p className="text-xl md:text-2xl font-display font-black text-[#8d6e63] text-center tracking-[0.25em] select-none">
                  _________
                </p>
              </div>
            </div>
            {/* Avatar bên phải */}
            <img 
              src={duckImg} 
              alt="Duck" 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-yellow-300 shadow-md shrink-0 bg-white animate-bounce-soft" 
            />
          </div>

        </div>

        {/* Các đáp án (Options) */}
        <div className="w-full flex flex-col gap-4 justify-center items-center mt-6">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectOption(opt)}
              className={`w-full max-w-md flex items-center gap-3 p-4 rounded-2xl border-[3px] cursor-pointer transition-all animate-fade-in
                ${selectedOption === opt 
                  ? 'border-yellow-400 bg-yellow-100 shadow-md transform -translate-y-1' 
                  : 'border-border-main bg-white hover:bg-gray-50 hover:border-gray-300'}
                ${(footerStatus === 'correct' || footerStatus === 'incorrect') ? 'pointer-events-none' : ''}
              `}
            >
                <button 
                  onClick={(e) => {
                    playAudio(opt.audio_url, opt.text, e);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary text-white hover:bg-primary-hover shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                </button>
                <span className={`text-lg font-bold font-display ${selectedOption === opt ? 'text-yellow-800' : 'text-text-main'}`}>
                  {opt.text}
                </span>
            </div>
          ))}
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={handleCheck}
          onNext={handleNext}
          onRetry={footerStatus === 'incorrect' ? handleRetry : undefined}
          hideNextButton={footerStatus === 'incorrect'}
          correctAnswer={currentItem.answer.text}
          nextLabel={currentIndex === items.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
        />
      </div>
    </div>
  );
};
