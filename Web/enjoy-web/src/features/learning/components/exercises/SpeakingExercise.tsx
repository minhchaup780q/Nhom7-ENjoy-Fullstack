import React, { useState, useEffect, useRef } from 'react';
import type { Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { learningApi } from '../../services/learningApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';
import { SpeakerWaveIcon, MicrophoneIcon } from '@heroicons/react/24/solid';

interface SpeakingExerciseProps {
  vocabularies: Vocabulary[];
  onComplete: (allPassed: boolean) => void;
  onMistake?: (data: MistakeCreatePayload) => void;
  onProgress?: (current: number, total: number) => void;
}

type RecordState = 'idle' | 'recording' | 'assessing';

export const SpeakingExercise: React.FC<SpeakingExerciseProps> = ({ vocabularies, onComplete, onMistake, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');
  const [result, setResult] = useState<{ isAllCorrect: boolean; accuracyScore: number; recognizedText: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentVocab = vocabularies[currentIndex];

  // Tự động phát âm khi hiện từ mới
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (currentVocab) {
      setFooterStatus('idle');
      setResult(null);
      setErrorMsg('');
      setRecordState('idle');

      timeoutId = setTimeout(() => {
        if (currentVocab.audioUrl) {
          const safeUrl = currentVocab.audioUrl.replace(/ /g, '%20');
          new Audio(safeUrl).play().catch(() => {
            fallbackToSpeech(currentVocab.word);
          });
        } else if (currentVocab.word) {
          fallbackToSpeech(currentVocab.word);
        }
      }, 300);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex, currentVocab]);

  useEffect(() => {
    if (onProgress && currentVocab) {
      onProgress(currentIndex, vocabularies.length);
    }
  }, [currentIndex, vocabularies.length, onProgress, currentVocab]);

  const fallbackToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; 
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const playAudio = () => {
    if (!currentVocab) return;
    
    if (currentVocab.audioUrl) {
      const safeUrl = currentVocab.audioUrl.replace(/ /g, '%20');
      new Audio(safeUrl).play().catch(() => fallbackToSpeech(currentVocab.word));
    } else {
      fallbackToSpeech(currentVocab.word);
    }
  };

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
      const res = await learningApi.assessPronunciation(blob, currentVocab?.word ?? '');
      setResult(res as any);
      setRecordState('idle');
      
      if (res.isAllCorrect) {
        setFooterStatus('correct');
      } else {
        setFooterStatus('incorrect');
        if (onMistake && currentVocab) {
          const targetWord = (currentVocab.word || '').toLowerCase().trim();
          const recognized = (res.recognizedText || '').toLowerCase().trim();
          
          let phonemeType = 'GENERAL_MISPRONUNCIATION';
          if (targetWord && recognized) {
            if (
              (targetWord.endsWith('s') && !recognized.endsWith('s')) ||
              (targetWord.endsWith('ed') && !recognized.endsWith('ed')) ||
              (targetWord.endsWith('t') && !recognized.endsWith('t')) ||
              (targetWord.endsWith('d') && !recognized.endsWith('d'))
            ) {
              phonemeType = 'ENDING_SOUND';
            } else if (
              targetWord.includes('th') ||
              targetWord.includes('sh') ||
              targetWord.includes('ch') ||
              targetWord.includes('str') ||
              targetWord.includes('pl')
            ) {
              phonemeType = 'CONSONANT_CLUSTER';
            } else if (
              targetWord.length === recognized.length &&
              targetWord.slice(0, 1) === recognized.slice(0, 1)
            ) {
              phonemeType = 'VOWEL_CONFUSION';
            } else {
              phonemeType = 'STRESS_INTONATION';
            }
          }

          onMistake({
            questionId: currentVocab.id,
            roundType: 3,
            wrongAnswerSubmitted: res.recognizedText || 'Phát âm chưa chuẩn',
            recognizedAudioTranscript: res.recognizedText || '',
            phonemeErrorType: phonemeType,
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

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (onProgress) onProgress(vocabularies.length, vocabularies.length);
      onComplete(true);
    }
  };

  const retry = () => {
    setResult(null);
    setRecordState('idle');
    setErrorMsg('');
    setFooterStatus('idle');
  };

  if (!currentVocab) return <div>Không có từ vựng</div>;

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-24">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-4 md:gap-6 pt-4 md:pt-6 px-4">
        
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Listen, look and repeat
        </h2>

        {currentVocab.imageUrl && (
          <div className="flex justify-center items-center mt-2">
            <img 
              src={currentVocab.imageUrl} 
              alt={currentVocab.word} 
              className="max-h-[28vh] md:max-h-[32vh] max-w-[90vw] md:max-w-xl w-auto h-auto object-contain rounded-2xl md:rounded-3xl shadow-xl border-4 border-white bg-white select-none" 
              draggable="false"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-3 -mt-2 md:-mt-4 relative z-10">
          <button 
            onClick={playAudio}
            className="text-primary hover:scale-110 active:scale-95 transition-transform"
          >
            <SpeakerWaveIcon className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
          </button>
          <div className="text-xl md:text-3xl font-display font-extrabold text-text-main tracking-wide">
            {currentVocab.word}
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
                  <>Bé nói sai thành: <span className="text-red-500">{result.recognizedText}</span></>
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
          onCheck={() => {}}
          onNext={handleNext}
          onRetry={footerStatus === 'incorrect' ? retry : undefined}
          hideNextButton={footerStatus === 'incorrect'}
          nextLabel={currentIndex === vocabularies.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
        />
      </div>
    </div>
  );
};
