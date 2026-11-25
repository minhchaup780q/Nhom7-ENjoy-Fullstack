import React, { useState, useEffect, useRef } from 'react';
import type { SessionPayload, Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';

import { PauseIcon, PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

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
  const rawAudioUrl = raw?.audio_url ?? raw?.audioUrl;
  const audioUrl = typeof rawAudioUrl === 'string' ? rawAudioUrl.trim() : '';
  const hasAudioUrl = (() => {
    try {
      const url = new URL(audioUrl);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  })();
  const isVideoUrl = hasAudioUrl && /\.(mp4|webm|mov|m4v)(?:[?#]|$)/i.test(audioUrl);
  
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fallbackToSpeechSynthesis = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechUtteranceRef.current = utterance;
    utterance.onstart = () => {
      if (speechUtteranceRef.current === utterance) setIsPlaying(true);
    };
    utterance.onend = () => {
      if (speechUtteranceRef.current === utterance) {
        speechUtteranceRef.current = null;
        setIsPlaying(false);
      }
    };
    utterance.onerror = () => {
      if (speechUtteranceRef.current === utterance) {
        speechUtteranceRef.current = null;
        setIsPlaying(false);
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  const fallbackText = raw?.sentence || coords.map(c => c.word).join(' ');

  const playAudio = () => {
    if (isVideoUrl || !hasAudioUrl) return;

    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      speechUtteranceRef.current = null;
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;
    if (!audioUrl || !audio) {
      if (fallbackText) {
        fallbackToSpeechSynthesis(fallbackText);
      }
      return;
    }

    if (!audio.paused) {
      audio.pause();
      window.speechSynthesis?.cancel();
      speechUtteranceRef.current = null;
      return;
    }

    if (audio.ended) audio.currentTime = 0;
    audio.play().catch(error => {
      if (error.name !== 'AbortError' && audio.isConnected) {
        console.warn('Primary audio failed, falling back to Web Speech API...', error);
        if (fallbackText) fallbackToSpeechSynthesis(fallbackText);
      }
    });
  };

  useEffect(() => {
    if (isVideoUrl || !hasAudioUrl) return;

    let active = true;
    const audio = audioRef.current;
    const updateDuration = () => {
      const mediaDuration = audio?.duration ?? 0;
      setDuration(Number.isFinite(mediaDuration) ? mediaDuration : 0);
    };
    const updateCurrentTime = () => setCurrentTime(audio?.currentTime ?? 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio?.duration ?? 0);
    };

    audio?.addEventListener('loadedmetadata', updateDuration);
    audio?.addEventListener('durationchange', updateDuration);
    audio?.addEventListener('timeupdate', updateCurrentTime);
    audio?.addEventListener('play', handlePlay);
    audio?.addEventListener('pause', handlePause);
    audio?.addEventListener('ended', handleEnded);
    updateDuration();
    updateCurrentTime();

    const timeoutId = window.setTimeout(() => {
      if (hasAudioUrl && audio) {
        audio.play().catch(error => {
          if (active && error.name !== 'AbortError') {
            console.warn('Primary audio failed, falling back to Web Speech API...', error);
            if (fallbackText) fallbackToSpeechSynthesis(fallbackText);
          }
        });
      } else if (fallbackText) {
        fallbackToSpeechSynthesis(fallbackText);
      }
    }, 300);
    
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      audio?.removeEventListener('loadedmetadata', updateDuration);
      audio?.removeEventListener('durationchange', updateDuration);
      audio?.removeEventListener('timeupdate', updateCurrentTime);
      audio?.removeEventListener('play', handlePlay);
      audio?.removeEventListener('pause', handlePause);
      audio?.removeEventListener('ended', handleEnded);
      audio?.pause();
      if (audio) audio.currentTime = 0;
      window.speechSynthesis?.cancel();
      speechUtteranceRef.current = null;
    };
  }, [audioUrl, hasAudioUrl, isVideoUrl, fallbackText]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
    };
  }, [audioUrl, isVideoUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const audioProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

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

        <div className="flex w-full justify-center">
          {isVideoUrl ? (
            <video
              ref={videoRef}
              src={audioUrl.replace(/ /g, '%20')}
              controls
              playsInline
              className="w-full max-w-sm rounded-xl bg-black shadow-md"
              aria-label="Video hướng dẫn"
            />
          ) : hasAudioUrl ? (
            <div className="w-full rounded-2xl border-2 border-border-main bg-white p-3 shadow-sm">
              {audioUrl && <audio ref={audioRef} src={audioUrl.replace(/ /g, '%20')} preload="metadata" />}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={playAudio}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95"
                  aria-label={isPlaying ? 'Tạm dừng âm thanh' : 'Phát âm thanh'}
                  title={isPlaying ? 'Tạm dừng âm thanh' : 'Phát lại âm thanh'}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5 ml-0.5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 flex items-center gap-1.5 truncate text-xs font-medium text-text-muted">
                    <SpeakerWaveIcon className="h-3.5 w-3.5" />
                    Âm thanh bài học
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200"
                      role="progressbar"
                      aria-label="Tiến trình âm thanh"
                      aria-valuemin={0}
                      aria-valuemax={duration || 1}
                      aria-valuenow={currentTime}
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-150"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                    <span className="min-w-[82px] flex-shrink-0 text-right font-mono text-xs text-text-muted">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 items-center md:items-start justify-center">
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

              let boxClass = "absolute border-2 border-dashed flex items-center justify-center transition-all bg-white/25 rounded-lg overflow-hidden ";
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
                textClass += "text-primary-dark";
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
