import React, { useState, useEffect, useRef } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { SessionType } from '../types';
import type { Session, Vocabulary } from '../types';
import { FlashcardExercise } from './exercises/FlashcardExercise';
import { MatchWordExercise } from './exercises/MatchWordExercise';
import { SpeakingExercise } from './exercises/SpeakingExercise';
import { ReorderExercise } from './exercises/ReorderExercise';
import { DragDropExercise } from './exercises/DragDropExercise';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/solid';

interface SessionPlayerProps {
  session: Session;
  onClose: () => void;
}

export const SessionPlayer: React.FC<SessionPlayerProps> = ({ session, onClose }) => {
  const {
    activePart,
    selectSession,
    completeSession,
    fetchPartVocabularies,
    resetSessionState,
  } = useLearningStore();

  const [hearts, setHearts] = useState(5);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100%
  const [partVocabs, setPartVocabs] = useState<Vocabulary[]>([]);
  const [loadingVocabs, setLoadingVocabs] = useState(false);

  const sessionStartTime = useRef(Date.now());

  // Đăng ký session vào store (đồng bộ vì payload đã nằm trong session)
  useEffect(() => {
    selectSession(session);
    sessionStartTime.current = Date.now();
  }, [session.id]);

  // Fetch từ vựng của Part nếu cần
  const needsVocabs = [
    SessionType.FLASHCARD,
    SessionType.MATCH_WORD,
    SessionType.SPEAKING,
    SessionType.RE_ORDER,
  ].includes(session.sessionType);

  useEffect(() => {
    if (!needsVocabs) return;
    const partId = session.part?.id ?? (activePart?.id ?? 0);
    if (!partId) return;
    setLoadingVocabs(true);
    fetchPartVocabularies(partId).then(vocabs => {
      setPartVocabs(vocabs);
      setLoadingVocabs(false);
    });
  }, [session.id, needsVocabs]);

  const handleMistake = () => {
    setHearts(h => {
      const next = Math.max(0, h - 1);
      if (next === 0) handleSessionFailed();
      return next;
    });
  };

  const handleSessionComplete = async () => {
    const durationSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
    setSessionFinished(true);
    await completeSession(session.id, durationSeconds);
  };

  const handleSessionFailed = () => {
    setSessionFinished(true);
    // không gọi completeSession vì học chưa xong
  };

  const handleClose = () => {
    resetSessionState();
    onClose();
  };

  // ──────────────────────────────────────────────
  // Màn hình hoàn thành
  // ──────────────────────────────────────────────
  if (sessionFinished) {
    const failed = hearts === 0;
    return (
      <div className="session-finished">
        <div className="session-finished-card">
          <div className="session-finished-emoji">{failed ? '😢' : '🎉'}</div>
          <h2 className="session-finished-title">
            {failed ? 'Hết lượt! Cố lên lần sau nhé!' : 'Hoàn thành bài học!'}
          </h2>
          {!failed && (
            <p className="session-finished-subtitle">Bạn đã hoàn thành «{session.title}» thành công!</p>
          )}
          <button id="session-finished-close-btn" className="btn-primary" onClick={handleClose}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  let payload = session.payload ?? {};
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      console.error('Failed to parse payload', e);
      payload = {};
    }
  }
  // Header chung
  // ──────────────────────────────────────────────
  const Header = () => (
    <div className="session-player-header">
      <button
        id="session-player-exit-btn"
        className="session-exit-btn"
        onClick={() => setShowExitModal(true)}
        aria-label="Thoát bài học"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      <div className="session-progress-bar">
        <div className="session-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="session-hearts">
        {Array.from({ length: 5 }).map((_, i) => (
          <HeartIcon
            key={i}
            className={`w-5 h-5 ${i < hearts ? 'text-red-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );

  // ──────────────────────────────────────────────
  // Chọn Exercise Component theo sessionType
  // ──────────────────────────────────────────────
  const renderExercise = () => {
    if (loadingVocabs) {
      return <div className="session-loading"><div className="spinner" />Đang tải bài học...</div>;
    }

    const handleProgress = (current: number, total: number) => {
      setProgress((current / total) * 100);
    };

    switch (session.sessionType) {
      case SessionType.FLASHCARD:
        if (!partVocabs.length) return <div className="session-loading">Không có từ vựng để học.</div>;
        return (
          <FlashcardExercise
            vocabularies={partVocabs}
            onComplete={handleSessionComplete}
            onProgress={handleProgress}
          />
        );

      case SessionType.MATCH_WORD:
        if (!partVocabs.length) {
          return <div className="session-loading">Không có từ vựng để học.</div>;
        }
        return (
          <MatchWordExercise
            partId={session.part?.id ?? activePart?.id ?? 0}
            vocabularies={partVocabs}
            onComplete={handleSessionComplete}
            onProgress={handleProgress}
          />
        );

      case SessionType.SPEAKING:
        if (!partVocabs.length) return <div className="session-loading">Không có từ vựng để học.</div>;
        return (
          <SpeakingExercise
            vocabularies={partVocabs}
            onComplete={handleSessionComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case SessionType.RE_ORDER:
        if (!partVocabs.length) return <div className="session-loading">Không có từ vựng để học.</div>;
        return (
          <ReorderExercise
            vocabularies={partVocabs}
            onComplete={handleSessionComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case SessionType.DRAG_DROP:
        if (!payload || Object.keys(payload).length === 0) return <div className="session-placeholder"><p>Dữ liệu bài tập trống.</p></div>;
        return (
          <DragDropExercise
            payload={payload}
            onComplete={handleSessionComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case SessionType.GRAMMAR:
      case SessionType.CONVERSATION:
        return (
          <div className="session-placeholder">
            <p>🚧 Vòng <strong>{session.sessionType}</strong> đang được xây dựng...</p>
            <button className="btn-next-exercise" onClick={handleSessionComplete}>
              Bỏ qua →
            </button>
          </div>
        );

      default:
        return (
          <div className="session-placeholder">
            <p>⚠️ Loại bài học không xác định.</p>
            <button className="btn-next-exercise" onClick={handleClose}>Quay lại</button>
          </div>
        );
    }
  };

  // ──────────────────────────────────────────────
  // Exit Modal
  // ──────────────────────────────────────────────
  const ExitModal = () => (
    <div className="exit-modal-overlay" onClick={() => setShowExitModal(false)}>
      <div className="exit-modal" onClick={e => e.stopPropagation()}>
        <h3>Thoát bài học?</h3>
        <p>Tiến độ hiện tại của bạn sẽ không được lưu.</p>
        <div className="exit-modal-actions">
          <button id="exit-modal-stay-btn" className="btn-secondary" onClick={() => setShowExitModal(false)}>
            Tiếp tục học
          </button>
          <button id="exit-modal-leave-btn" className="btn-danger" onClick={handleClose}>
            Thoát
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="session-player">
      <Header />

      <div className="session-player-title">
        <h2>{session.title}</h2>
      </div>

      <div className="session-exercise-area">
        {renderExercise()}
      </div>

      {showExitModal && <ExitModal />}
    </div>
  );
};
