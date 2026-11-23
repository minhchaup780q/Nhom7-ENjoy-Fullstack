import React, { useState } from 'react';
import { ShieldCheckIcon, SpeakerWaveIcon, BookOpenIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  learningApi,
  getMinListeningScore,
  getMinReadingScore,
  type UserExamTarget
} from '../../learning/services/learningApi';

interface TargetSelectionScreenProps {
  userId: number;
  initialListeningShields?: number;
  initialReadingShields?: number;
  onConfirm: (target: UserExamTarget) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const TargetSelectionScreen: React.FC<TargetSelectionScreenProps> = ({
  userId,
  initialListeningShields = 4,
  initialReadingShields = 4,
  onConfirm,
  onCancel,
  isModal = false,
}) => {
  const [listeningShields, setListeningShields] = useState<number>(initialListeningShields || 4);
  const [readingShields, setReadingShields] = useState<number>(initialReadingShields || 4);
  const [hoverListening, setHoverListening] = useState<number | null>(null);
  const [hoverReading, setHoverReading] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const activeListening = hoverListening !== null ? hoverListening : listeningShields;
  const activeReading = hoverReading !== null ? hoverReading : readingShields;

  const currentListeningMinScore = getMinListeningScore(listeningShields);
  const currentReadingMinScore = getMinReadingScore(readingShields);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const saved = await learningApi.saveUserTarget(userId, listeningShields, readingShields);
      onConfirm(saved);
    } catch (err) {
      console.error('Lỗi khi lưu mục tiêu:', err);
      onConfirm({
        userId,
        listeningShields,
        readingShields,
        listeningMinScore: currentListeningMinScore,
        readingMinScore: currentReadingMinScore,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="w-full max-w-[860px] mx-auto flex flex-col gap-6 sm:gap-7 select-none animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2 relative">
        {isModal && onCancel && (
          <button
            onClick={onCancel}
            className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            title="Đóng"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold uppercase tracking-wider shadow-xs">
          <SparklesIcon className="w-4 h-4 text-amber-600" />
          Mục tiêu kỳ thi Cambridge Starters
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-main tracking-tight">
          Bé muốn chinh phục bao nhiêu khiên?
        </h1>
      </div>

      {/* Hai cột chọn khiên (Listening & Reading) vừa vặn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* ── CARD 1: LISTENING ── */}
        <div className="bg-amber-50/80 border-2 sm:border-3 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-[0_8px_24px_rgb(245,158,11,0.08)] flex flex-col justify-between transition-all hover:shadow-[0_12px_32px_rgb(245,158,11,0.14)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-amber-200/70">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-200/90 text-amber-800 flex items-center justify-center shadow-xs shrink-0">
                <SpeakerWaveIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-amber-950">
                  Điểm Nghe (Listening)
                </h2>
              </div>
            </div>

            {/* Dãy 5 khiên kích thước vừa vặn */}
            <div className="flex flex-col items-center py-2 w-full">
              <div
                className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-full px-1"
                onMouseLeave={() => setHoverListening(null)}
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  const shieldNum = i + 1;
                  const isLit = shieldNum <= activeListening;
                  return (
                    <button
                      key={shieldNum}
                      type="button"
                      id={`shield-listening-${shieldNum}`}
                      onClick={() => setListeningShields(shieldNum)}
                      onMouseEnter={() => setHoverListening(shieldNum)}
                      className="group relative focus:outline-none p-1 sm:p-1.5 transition-transform hover:scale-110 active:scale-95 cursor-pointer flex flex-col items-center shrink-0"
                      title={`${shieldNum} khiên`}
                    >
                      <ShieldCheckIcon
                        className={`w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 transition-all duration-200 ${
                          isLit
                            ? 'text-amber-500 drop-shadow-[0_4px_10px_rgba(245,158,11,0.45)]'
                            : 'text-gray-300 hover:text-amber-300'
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-extrabold text-gray-500 block text-center mt-1 group-hover:text-amber-600">
                        {shieldNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badge kết quả tối thiểu */}
          <div className="mt-4 pt-3 border-t border-amber-200/70 flex items-center justify-between bg-white/85 rounded-xl px-4 py-2.5 border border-amber-200 shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-amber-950">Điểm cần đạt tối thiểu:</span>
            <span className="text-sm sm:text-base font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-xl shadow-xs">
              {currentListeningMinScore} / 20 câu
            </span>
          </div>
        </div>

        {/* ── CARD 2: READING & WRITING ── */}
        <div className="bg-amber-50/80 border-2 sm:border-3 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-[0_8px_24px_rgb(245,158,11,0.08)] flex flex-col justify-between transition-all hover:shadow-[0_12px_32px_rgb(245,158,11,0.14)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-amber-200/70">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-200/90 text-amber-800 flex items-center justify-center shadow-xs shrink-0">
                <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-amber-950">
                  Đọc &amp; Viết (Reading)
                </h2>
              </div>
            </div>

            {/* Dãy 5 khiên kích thước vừa vặn */}
            <div className="flex flex-col items-center py-2 w-full">
              <div
                className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-full px-1"
                onMouseLeave={() => setHoverReading(null)}
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  const shieldNum = i + 1;
                  const isLit = shieldNum <= activeReading;
                  return (
                    <button
                      key={shieldNum}
                      type="button"
                      id={`shield-reading-${shieldNum}`}
                      onClick={() => setReadingShields(shieldNum)}
                      onMouseEnter={() => setHoverReading(shieldNum)}
                      className="group relative focus:outline-none p-1 sm:p-1.5 transition-transform hover:scale-110 active:scale-95 cursor-pointer flex flex-col items-center shrink-0"
                      title={`${shieldNum} khiên`}
                    >
                      <ShieldCheckIcon
                        className={`w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 transition-all duration-200 ${
                          isLit
                            ? 'text-amber-500 drop-shadow-[0_4px_10px_rgba(245,158,11,0.45)]'
                            : 'text-gray-300 hover:text-amber-300'
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-extrabold text-gray-500 block text-center mt-1 group-hover:text-amber-600">
                        {shieldNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badge kết quả tối thiểu */}
          <div className="mt-4 pt-3 border-t border-amber-200/70 flex items-center justify-between bg-white/85 rounded-xl px-4 py-2.5 border border-amber-200 shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-amber-950">Điểm cần đạt tối thiểu:</span>
            <span className="text-sm sm:text-base font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-xl shadow-xs">
              {currentReadingMinScore} / 25 câu
            </span>
          </div>
        </div>

      </div>

      {/* ── NÚT XÁC NHẬN ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {isModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3.5 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-display font-extrabold text-sm sm:text-base rounded-2xl transition-all cursor-pointer"
          >
            Đóng
          </button>
        )}
        <button
          type="button"
          id="btn-confirm-target"
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-[0_6px_0_0_#b45309] hover:shadow-[0_8px_0_0_#b45309] active:translate-y-[2px] active:shadow-[0_2px_0_0_#b45309] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang lưu mục tiêu...
            </>
          ) : (
            <>
              🚀 Xác nhận &amp; Vào lộ trình học
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-[2rem] border-3 border-amber-300 shadow-2xl p-5 sm:p-7 max-w-[860px] w-full my-6 max-h-[92vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6 flex items-center justify-center">
      {content}
    </div>
  );
};
