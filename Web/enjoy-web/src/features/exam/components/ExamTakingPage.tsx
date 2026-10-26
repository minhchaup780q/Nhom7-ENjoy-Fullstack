import React, { useEffect, useRef, useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { examApi } from '../services/examApi';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { TransitionModal } from './TransitionModal';
import { ListeningSection } from './listening/ListeningSection';
import { ReadingSection } from './reading/ReadingSection';
import { ClockIcon } from '@heroicons/react/24/outline';

export const ExamTakingPage: React.FC = () => {
  const {
    currentExam,
    phase,
    timeLeft,
    userAnswers,
    setPhase,
    setTimeLeft,
    setResult,
    decrementTimer,
  } = useExamStore();
  const { user } = useAuthStore();

  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Đồng hồ đếm ngược ---
  useEffect(() => {
    if (phase !== 'LISTENING' && phase !== 'READING') return;

    timerRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // --- Hết giờ tự động chuyển phase ---
  useEffect(() => {
    if (timeLeft === 0 && phase === 'LISTENING') {
      setPhase('TRANSITION');
    }
    if (timeLeft === 0 && phase === 'READING') {
      handleSubmit();
    }
  }, [timeLeft, phase]);

  const handleFinishListening = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('TRANSITION');
  };

  const handleConfirmTransition = () => {
    if (!currentExam) return;
    setTimeLeft(currentExam.readingDuration * 60);
    setPhase('READING');
  };

  const handleSubmit = async () => {
    if (submitting || !currentExam || !user?.id) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const result = await examApi.submitExam(currentExam.id, user.id, userAnswers);
      setResult(result);
      setPhase('RESULT');
    } catch (e) {
      console.error('Submit failed:', e);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isUrgent = timeLeft > 0 && timeLeft <= 60;

  return (
    <div className="flex flex-col h-screen bg-surface">
      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium">{currentExam?.title}</span>
          <span className="text-sm font-bold text-text-main">
            {phase === 'LISTENING' ? '📢 Phần Nghe (Listening)' : '📖 Phần Đọc & Viết (Reading & Writing)'}
          </span>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg transition-all
          ${isUrgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary/10 text-primary'}`}>
          <ClockIcon className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        {phase === 'LISTENING' && (
          <ListeningSection onFinish={handleFinishListening} />
        )}
        {phase === 'READING' && (
          <ReadingSection onSubmit={handleSubmit} submitting={submitting} />
        )}
      </div>

      {/* ── Transition Modal ── */}
      {phase === 'TRANSITION' && (
        <TransitionModal
          exam={currentExam!}
          onConfirm={handleConfirmTransition}
        />
      )}
    </div>
  );
};
