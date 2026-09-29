import React, { useState, useEffect, useRef } from 'react';
import type { Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';
import { learningApi } from '../../services/learningApi';
import { SpeakerWaveIcon, MicrophoneIcon } from '@heroicons/react/24/solid';

interface SpeakingSentenceItem {
  order: number;
  sentence: string;
  image_url: string;
  audio_url: string;
}

interface SpeakingSentenceExerciseProps {
  payload: any;
  vocabularies?: Vocabulary[];
  onComplete: () => void;
  onMistake?: (data: MistakeCreatePayload) => void;
  onProgress?: (current: number, total: number) => void;
}

type RecordState = 'idle' | 'recording' | 'assessing';

export const SpeakingSentenceExercise: React.FC<SpeakingSentenceExerciseProps> = ({
  payload,
  vocabularies,
  onComplete,
  onMistake,
  onProgress
}) => {
  const items = (payload.items as SpeakingSentenceItem[]) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');
  const [result, setResult] = useState<{ 
    isAllCorrect: boolean; 
    recognizedText?: string;
    details?: { word: string; status: 'correct' | 'wrong' }[] 
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
      setFooterStatus('idle');
      setResult(null);
      setErrorMsg('');
      setRecordState('idle');

      if (currentItem.audio_url) {
        timeoutId = setTimeout(() => playAudio(currentItem.audio_url), 300);
      } else {
        timeoutId = setTimeout(() => fallbackToSpeechSynthesis(currentItem.sentence), 300);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = handleRecordingStop;
      mr.start();
      mediaRecorderRef.current = mr;
      setRecordState('recording');
      setResult(null);
      setErrorMsg('');
      setFooterStatus('idle');
    } catch {
      setErrorMsg('Không thể truy cập microphone. Vui lòng cấp quyền mic.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const handleRecordingStop = async () => {
    setRecordState('assessing');
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    try {
      const res = await learningApi.assessPronunciation(blob, currentItem.sentence);
      setResult(res as any);
      setRecordState('idle');
      
      if (res.isAllCorrect) {
        setFooterStatus('correct');
      } else {
        setFooterStatus('incorrect');
        if (onMistake) {
          const vocabId = vocabularies?.[currentIndex]?.id || vocabularies?.[0]?.id || 1;
          const recognized = res.recognizedText || 'Lỗi phát âm câu';
          onMistake({
            questionId: vocabId,
            roundType: 9,
            wrongAnswerSubmitted: recognized,
            recognizedAudioTranscript: recognized,
            phonemeErrorType: currentItem.sentence,
          });
        }
      }
    } catch {
      setErrorMsg('Kiểm tra phát âm thất bại. Vui lòng thử lại.');
      setRecordState('idle');
      setFooterStatus('idle');
    }
  };

  const handleToggleRecord = () => {
    if (recordState === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleRetry = () => {
    setResult(null);
    setRecordState('idle');
    setErrorMsg('');
    setFooterStatus('idle');
  };

  const handleCheck = () => {
    // Không dùng nút Check ở đây vì thu âm xong tự động chấm,
    // nhưng cần truyền handleCheck rỗng vào ExerciseFooter
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (onProgress) onProgress(items.length, items.length);
      onComplete();
    }
  };

  const renderTargetSentence = () => {
    if (!result || !result.details) {
      return <span>{currentItem.sentence}</span>;
    }
    
    // Nếu có kết quả chấm điểm từng từ
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {result.details.map((item, idx) => (
          <span 
            key={idx} 
            className={`font-bold transition-colors ${item.status === 'correct' ? 'text-green-500' : 'text-red-500'}`}
          >
            {item.word}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-4 md:gap-6 pt-4 md:pt-6 px-4">
        
        {currentItem.image_url && (
          <div className="flex justify-center items-center mt-2">
            <img 
              src={currentItem.image_url} 
              alt="Speaking sentence" 
              className="max-h-[28vh] md:max-h-[32vh] max-w-[90vw] md:max-w-xl w-auto h-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none" 
              draggable="false"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-3 -mt-2 md:-mt-4 relative z-10">
          <button 
            onClick={() => { if (currentItem.audio_url) playAudio(currentItem.audio_url); else fallbackToSpeechSynthesis(currentItem.sentence); }}
            className="text-primary hover:scale-110 active:scale-95 transition-transform"
          >
            <SpeakerWaveIcon className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
          </button>
          <div className="text-lg md:text-2xl font-display font-extrabold text-text-main tracking-wide">
            {renderTargetSentence()}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 w-full">
          <button
            onClick={handleToggleRecord}
            disabled={recordState === 'assessing'}
            className={`px-12 py-4 rounded-2xl flex items-center justify-center gap-3 font-display font-bold text-lg md:text-xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] active:translate-y-[6px] transition-all
              ${recordState === 'recording' 
                ? 'bg-red-500 text-white shadow-[0_2px_0_0_#b91c1c] translate-y-[4px] animate-pulse border-2 border-red-600' 
                : 'bg-[#58cc02] text-white border-[3px] border-[#3f9102] hover:bg-[#3f9102]'}
              ${recordState === 'assessing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <MicrophoneIcon className="w-6 h-6 md:w-8 md:h-8" />
            {recordState === 'recording' ? 'ĐANG THU ÂM...' : 'BẤM ĐỂ NÓI'}
          </button>
          {recordState === 'assessing' && <span className="text-primary font-bold text-sm animate-pulse">Đang chấm điểm...</span>}
          {errorMsg && <span className="text-red-500 text-sm font-semibold">{errorMsg}</span>}

          {footerStatus === 'incorrect' && result && (
            <div className="w-full max-w-xl bg-red-50 border-2 border-red-200 rounded-2xl p-4 mt-2 text-center shadow-sm">
              <span className="text-red-600 font-bold text-sm md:text-base uppercase mb-2 block">
                Nhận xét
              </span>
              <div className="text-lg md:text-xl font-display font-bold text-text-main">
                {result.recognizedText ? (
                  <>
                    Bé nói sai thành:{' '}
                    {result.recognizedText.split(' ').map((word, idx) => {
                      const cleanWord = word.replace(/[^\w\s]/g, '').toLowerCase();
                      const targetWords = currentItem.sentence.toLowerCase().replace(/[^\w\s]/g, '').split(' ');
                      const isWrong = !targetWords.includes(cleanWord);
                      return (
                        <span key={idx} className={isWrong ? 'text-red-500' : 'text-text-main'}>
                          {word}{' '}
                        </span>
                      );
                    })}
                  </>
                ) : (
                  <span className="text-red-500">Bé hãy nói từ nghe được nhé!</span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={handleCheck}
          onNext={handleNext}
          onRetry={footerStatus === 'incorrect' ? handleRetry : undefined}
          hideNextButton={footerStatus === 'incorrect'}
          nextLabel={currentIndex === items.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
        />
      </div>
    </div>
  );
};
