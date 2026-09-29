import React, { useState, useEffect, useRef } from 'react';
import type { SessionPayload, Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';

import { SpeakerWaveIcon } from '@heroicons/react/24/solid';

interface DragDropExerciseProps {
  payload: SessionPayload;
  vocabularies?: Vocabulary[];
  onComplete: () => void;
  onMistake?: (data: MistakeCreatePayload) => void;
  onProgress?: (current: number, total: number) => void;
}

export const DragDropExercise: React.FC<DragDropExerciseProps> = ({
  payload,
  vocabularies,
  onComplete,
  onMistake,
  onProgress
}) => {
  const onProgressRef = useRef(onProgress);
  const onMistakeRef = useRef(onMistake);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onMistakeRef.current = onMistake;
  }, [onProgress, onMistake]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = payload as any;
  const imageUrl: string = raw?.image_url ?? raw?.imageUrl ?? '';
  const audioUrl: string = raw?.audio_url ?? raw?.audioUrl ?? '';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawCoords: any[] = [];
  if (Array.isArray(raw?.coordinates)) {
    rawCoords = raw.coordinates;
  }

  const coords = rawCoords as { word: string; x: number; y: number; width: number; height: number }[];
  
  const [draggableWords] = useState(() => 
    coords.map(c => c.word).sort(() => Math.random() - 0.5)
  );

  const [placedWords, setPlacedWords] = useState<Record<number, string>>({});
  const [wrongBoxes, setWrongBoxes] = useState<number[]>([]);
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');

  const fallbackToSpeechSynthesis = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const playAudio = () => {
    if (audioUrl) {
      const safeUrl = audioUrl.replace(/ /g, '%20');
      const audio = new Audio(safeUrl);
      audio.play().catch(e => {
        console.warn('Primary audio failed, falling back to Web Speech API...', e);
        const fallbackText = raw?.sentence || coords.map(c => c.word).join(' ');
        if (fallbackText) fallbackToSpeechSynthesis(fallbackText);
      });
    } else {
      const fallbackText = raw?.sentence || coords.map(c => c.word).join(' ');
      if (fallbackText) fallbackToSpeechSynthesis(fallbackText);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      playAudio();
    }, 300);
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, raw?.sentence]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string, sourceIndex?: number) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    e.dataTransfer.setData('text/plain', word);
    if (sourceIndex !== undefined) {
      e.dataTransfer.setData('source-index', sourceIndex.toString());
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return; 

    const word = e.dataTransfer.getData('text/plain');
    const sourceIndexStr = e.dataTransfer.getData('source-index');
    if (!word) return;

    setPlacedWords(prev => {
      const newPlaced = { ...prev };
      if (sourceIndexStr) {
        const sourceIndex = parseInt(sourceIndexStr, 10);
        if (sourceIndex !== targetIndex) {
          delete newPlaced[sourceIndex];
        }
      }
      newPlaced[targetIndex] = word;
      
      if (onProgressRef.current) {
        onProgressRef.current(Object.keys(newPlaced).length, coords.length);
      }
      
      const isFull = Object.keys(newPlaced).length === coords.length;
      setFooterStatus(isFull ? 'selected' : 'idle');

      return newPlaced;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveWord = (index: number) => {
    if (footerStatus === 'correct' || footerStatus === 'incorrect') return;
    setPlacedWords(prev => {
      const newPlaced = { ...prev };
      delete newPlaced[index];
      
      if (onProgressRef.current) {
        onProgressRef.current(Object.keys(newPlaced).length, coords.length);
      }
      
      const isFull = Object.keys(newPlaced).length === coords.length;
      setFooterStatus(isFull ? 'selected' : 'idle');

      return newPlaced;
    });
  };

  const handleCheck = () => {
    let hasMistake = false;
    const mistakes: number[] = [];

    coords.forEach((c, index) => {
      const placed = placedWords[index];
      if (placed?.toLowerCase() !== c.word.toLowerCase()) {
        hasMistake = true;
        mistakes.push(index);

        if (onMistakeRef.current) {
          const matchedVocab = vocabularies?.find(v => v.word.toLowerCase() === c.word.toLowerCase())
            || vocabularies?.[index]
            || vocabularies?.[0];

          if (matchedVocab) {
            onMistakeRef.current({
              questionId: matchedVocab.id,
              roundType: 5,
              wrongAnswerSubmitted: placed || '(trống)',
            });
          }
        }
      }
    });

    if (hasMistake) {
      setWrongBoxes(mistakes);
      setFooterStatus('incorrect');
    } else {
      setWrongBoxes([]);
      setFooterStatus('correct');
    }
  };

  const handleRetry = () => {
    setWrongBoxes([]);
    setPlacedWords({});
    setFooterStatus('idle');
  };

  const handleNext = () => {
    if (onProgressRef.current) onProgressRef.current(coords.length, coords.length);
    onComplete();
  };

  const placedWordsArray = Object.values(placedWords);

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-5xl flex-grow flex flex-col items-center justify-start gap-4 md:gap-6 pt-4 md:pt-6 px-4">
        
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Drag the correct words onto the picture
        </h2>
        
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 items-center md:items-start justify-center mt-2">
          {/* Left Side: Image with drop zones */}
          <div className="relative inline-block mx-auto flex-shrink-0">
            <img 
              src={imageUrl} 
              alt="Drag Drop Context" 
              className="max-h-[50vh] md:max-h-[60vh] max-w-[90vw] md:max-w-2xl w-auto h-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none"
              draggable="false"
            />
            
            {coords.map((coord, index) => {
              const isWrong = wrongBoxes.includes(index);
              const currentWord = placedWords[index];

              let boxClass = "absolute border-2 border-dashed flex items-center justify-center transition-all bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden ";
              let textClass = "w-full h-full flex items-center justify-center font-display font-bold text-[10px] sm:text-xs md:text-sm lg:text-base cursor-grab active:cursor-grabbing select-none text-center leading-tight p-0.5 md:p-1 break-words ";
              
              if (footerStatus === 'incorrect' || footerStatus === 'correct') {
                if (isWrong) {
                  boxClass += "border-red-500 ring-2 ring-red-400 animate-shake";
                  textClass += "text-red-600";
                } else if (currentWord) {
                  boxClass += "border-[#58cc02] ring-2 ring-[#58cc02]/40";
                  textClass += "text-[#58cc02]";
                } else {
                  boxClass += "border-gray-500";
                }
              } else {
                if (currentWord) {
                  boxClass += "border-primary ring-2 ring-primary/40";
                } else {
                  boxClass += "border-gray-500 hover:border-primary";
                }
                textClass += "text-primary";
              }

              return (
                <div
                  key={index}
                  className={boxClass}
                  style={{
                    left: `${coord.x * 100}%`,
                    top: `${coord.y * 100}%`,
                    width: `${coord.width * 100}%`,
                    height: `${coord.height * 100}%`
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => currentWord && handleRemoveWord(index)}
                >
                  {currentWord ? (
                    <div 
                      className={textClass}
                      draggable={footerStatus !== 'correct' && footerStatus !== 'incorrect'}
                      onDragStart={(e) => handleDragStart(e, currentWord, index)}
                    >
                      {currentWord}
                    </div>
                  ) : (
                    <div className="text-gray-500 font-bold text-lg md:text-xl pointer-events-none">+</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side: Draggable words (Hidden container background, 2 columns layout) */}
          <div className="flex-shrink-0 flex flex-col items-center justify-start min-w-[200px]">
            {/* Speaker Button */}
            <button 
              onClick={playAudio}
              className="mb-2 text-primary hover:scale-110 active:scale-95 transition-transform"
              title="Nghe lại đoạn ghi âm"
            >
              <SpeakerWaveIcon className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
            </button>

            {/* The words are rendered in a 2-column grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 p-2">
              {draggableWords.map((word, idx) => {
                const isPlaced = placedWordsArray.includes(word);

                if (isPlaced) {
                  return <div key={idx} className="w-[100px] h-12 md:h-14"></div>; // Placeholder to keep grid layout stable
                }

                return (
                  <div
                    key={idx}
                    className="w-[100px] h-12 md:h-14 bg-white border-2 border-b-4 border-gray-200 rounded-xl flex items-center justify-center text-text-main font-bold font-display text-sm cursor-grab active:cursor-grabbing hover:border-primary hover:text-primary transition-all shadow-sm select-none"
                    draggable={footerStatus !== 'correct' && footerStatus !== 'incorrect'}
                    onDragStart={(e) => handleDragStart(e, word)}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={handleCheck}
          onNext={handleNext}
          onRetry={footerStatus === 'incorrect' ? handleRetry : undefined}
          disabled={Object.keys(placedWords).length !== coords.length}
          hideNextButton={footerStatus === 'incorrect'}
          nextLabel="Hoàn thành"
        />
      </div>
    </div>
  );
};
