import React, { useState, useEffect, useRef } from 'react';
import type { Vocabulary } from '../../types';
import { learningApi } from '../../services/learningApi';

interface SpeakingExerciseProps {
  vocabularies: Vocabulary[];
  onComplete: (allPassed: boolean) => void;
  onMistake: () => void;
  onProgress?: (current: number, total: number) => void;
}

type RecordState = 'idle' | 'recording' | 'assessing' | 'done';

export const SpeakingExercise: React.FC<SpeakingExerciseProps> = ({ vocabularies, onComplete, onMistake, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [result, setResult] = useState<{ isAllCorrect: boolean; accuracyScore: number; recognizedText: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentVocab = vocabularies[currentIndex];

  // Tự động phát âm khi hiện từ mới
  useEffect(() => {
    if (!currentVocab) return;
    const timer = setTimeout(() => {
      if (currentVocab.audioUrl) {
        new Audio(currentVocab.audioUrl).play().catch(() => {});
      } else if (currentVocab.word && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(currentVocab.word);
        u.lang = 'en-US'; u.rate = 0.85;
        window.speechSynthesis.speak(u);
      }
    }, 300);
    
    if (onProgress) {
      onProgress(currentIndex, vocabularies.length);
    }
    
    return () => clearTimeout(timer);
  }, [currentIndex, currentVocab, vocabularies.length, onProgress]);

  const playAudio = () => {
    if (!currentVocab) return;
    if (currentVocab.audioUrl) {
      new Audio(currentVocab.audioUrl).play().catch(() => {});
    } else if (currentVocab.word && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(currentVocab.word);
      u.lang = 'en-US'; u.rate = 0.85;
      window.speechSynthesis.speak(u);
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
    } catch {
      setErrorMsg('Không thể truy cập microphone. Vui lòng cấp quyền mic.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
  };

  const handleRecordingStop = async () => {
    setRecordState('assessing');
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    try {
      const res = await learningApi.assessPronunciation(blob, currentVocab?.word ?? '');
      setResult(res);
      setRecordState('done');
      if (!res.isAllCorrect) {
        onMistake();
      }
    } catch {
      setErrorMsg('Kiểm tra phát âm thất bại. Vui lòng thử lại.');
      setRecordState('idle');
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setResult(null);
      setRecordState('idle');
      setErrorMsg('');
    } else {
      onComplete(true);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const retry = () => {
    setResult(null);
    setRecordState('idle');
    setErrorMsg('');
  };

  if (!currentVocab) return <div>Không có từ vựng</div>;

  return (
    <div className="speaking-exercise">
      <p className="exercise-instruction">Phát âm từ vựng ({currentIndex + 1} / {vocabularies.length})</p>

      {/* Ảnh và từ tiếng Anh */}
      {currentVocab.imageUrl && (
        <img src={currentVocab.imageUrl} alt={currentVocab.word} className="speaking-image" />
      )}
      <div className="speaking-word-row">
        <span className="speaking-word">{currentVocab.word}</span>
        <button className="speaking-audio-btn" onClick={playAudio} aria-label="Phát âm">🔊</button>
      </div>

      <p className="exercise-instruction">Hãy nhấn mic để đọc từ trên</p>

      {/* Nút micro */}
      {(recordState === 'idle' || recordState === 'done') && !result && (
        <button
          id="speaking-mic-btn"
          className="speaking-mic-btn"
          onClick={startRecording}
          aria-label="Bắt đầu ghi âm"
        >
          🎤 Bắt đầu nói
        </button>
      )}

      {recordState === 'recording' && (
        <button
          id="speaking-stop-btn"
          className="speaking-mic-btn recording"
          onClick={stopRecording}
          aria-label="Dừng ghi âm"
        >
          ⏹ Dừng lại
        </button>
      )}

      {recordState === 'assessing' && (
        <p className="speaking-status">Đang phân tích phát âm...</p>
      )}

      {/* Kết quả */}
      {result && recordState === 'done' && (
        <div className={`speaking-result ${result.isAllCorrect ? 'correct' : 'incorrect'}`}>
          <p>{result.isAllCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}</p>
          <p>Điểm độ chính xác: <strong>{Math.round(result.accuracyScore <= 1 ? result.accuracyScore * 100 : result.accuracyScore)}%</strong></p>
          <p>Nhận dạng được: <em>"{result.recognizedText}"</em></p>
          <div className="speaking-result-actions">
            {!result.isAllCorrect && <button className="btn-retry" onClick={retry}>🔄 Thử lại</button>}
            <button className="btn-next-exercise" onClick={result.isAllCorrect ? handleNext : handleSkip}>
              {result.isAllCorrect ? 'Tiếp tục →' : 'Bỏ qua →'}
            </button>
          </div>
        </div>
      )}

      {errorMsg && <p className="speaking-error">{errorMsg}</p>}
    </div>
  );
};
