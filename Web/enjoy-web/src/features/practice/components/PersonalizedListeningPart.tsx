import React, { useState, useEffect } from 'react';
import type { ListeningExerciseData } from '../services/personalizedPracticeService';
import {
  SpeakerWaveIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';

interface Props {
  data: ListeningExerciseData;
  currentPage: number;
  totalPages: number;
  onPageComplete: () => void;
}

export const PersonalizedListeningPart: React.FC<Props> = ({
  data,
  currentPage,
  totalPages,
  onPageComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);

  // Text-To-Speech trình duyệt đọc từng lượt đối thoại để không bị gián đoạn và highlight trực tiếp
  const speakLineAt = (lineIdx: number) => {
    if (!window.speechSynthesis) return;

    if (lineIdx >= data.dialogue.length) {
      setIsPlaying(false);
      setCurrentSpeakingIndex(null);
      return;
    }

    setCurrentSpeakingIndex(lineIdx);
    const line = data.dialogue[lineIdx];
    // Đọc tên nhân vật + câu thoại để bé nghe rõ ai đang nói
    const utterance = new SpeechSynthesisUtterance(`${line.speaker} says: ${line.text}`);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;

    utterance.onend = () => {
      // Tạm dừng 350ms giữa 2 lượt đối đáp cho tự nhiên
      setTimeout(() => {
        speakLineAt(lineIdx + 1);
      }, 350);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayAudio = () => {
    if (!window.speechSynthesis) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc phát âm tự động.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);
    speakLineAt(0);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSelectOption = (questionId: number, option: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCheckAnswers = () => {
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const isAllAnswered = data.questions.length > 0 && data.questions.every((q) => !!userAnswers[q.id]);

  const scoreCount = data.questions.filter(
    (q) => (userAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
  ).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black uppercase tracking-wider">
              Vòng 2: Nghe hội thoại
            </span>
            <span className="text-xs font-bold text-gray-500">
              Trang {currentPage + 1} / {totalPages}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-display font-extrabold text-gray-800 mt-1 uppercase tracking-tight">
            LISTEN TO THE CONVERSATION AND CHOOSE THE BEST ANSWERS.
          </h2>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            Lắng nghe đoạn đối thoại giữa hai bạn nhỏ, sau đó chọn đáp án đúng cho từng câu hỏi phía dưới.
          </p>
        </div>

        {/* Nút hoàn thành */}
        {isSubmitted && (
          <button
            onClick={onPageComplete}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{currentPage + 1 < totalPages ? 'Sang trang tiếp' : 'Hoàn thành bài luyện tập'}</span>
            <ArrowRightIcon className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* ── Bảng Audio Player & Đoạn hội thoại ── */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAudio}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                  : 'bg-violet-600 hover:bg-violet-700 text-white active:scale-95'
              }`}
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-5 h-5" />
                  <span>Đang phát âm thanh...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  <span>Bấm để nghe hội thoại</span>
                </>
              )}
            </button>

            <span className="text-xs font-bold text-violet-700 bg-white px-3 py-1.5 rounded-xl border border-violet-200">
              Giọng đọc Starters (0.85x)
            </span>
          </div>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-violet-200 text-xs font-extrabold text-violet-700 transition-colors cursor-pointer"
          >
            {showTranscript ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            <span>{showTranscript ? 'Ẩn lời thoại' : 'Hiện lời thoại'}</span>
          </button>
        </div>

        {/* Bong bóng chat hội thoại đối đáp qua lại */}
        {showTranscript && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-violet-100 flex flex-col gap-3.5 max-h-[440px] overflow-y-auto shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-[11px] font-bold text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                👦 Tom (Xanh tím)
              </span>
              <span className="flex items-center gap-1.5">
                👧 Lucy (Xanh ngọc)
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </span>
            </div>

            {data.dialogue.map((line, idx) => {
              const isTom = line.speaker.toLowerCase().includes('tom') || idx % 2 === 0;
              const isSpeakingNow = currentSpeakingIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 transition-all duration-300 ${isTom ? 'justify-start' : 'justify-end'}`}
                >
                  {isTom && (
                    <div
                      className={`w-9 h-9 rounded-2xl font-bold flex items-center justify-center text-xs shrink-0 shadow-sm transition-all ${
                        isSpeakingNow ? 'bg-amber-500 text-white scale-110 shadow-md' : 'bg-violet-600 text-white'
                      }`}
                    >
                      👦
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm md:text-base font-medium transition-all ${
                      isSpeakingNow
                        ? 'bg-amber-100 text-amber-950 ring-2 ring-amber-400 shadow-md scale-[1.01]'
                        : isTom
                        ? 'bg-violet-50 text-violet-950 rounded-tl-sm border border-violet-100'
                        : 'bg-emerald-50 text-emerald-950 rounded-tr-sm border border-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-[11px] font-extrabold tracking-wide uppercase opacity-75">
                        {line.speaker}
                      </span>
                      {isSpeakingNow && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full animate-pulse">
                          <SpeakerWaveIcon className="w-3 h-3" /> Đang nói
                        </span>
                      )}
                    </div>
                    <span className="leading-relaxed">{line.text}</span>
                  </div>

                  {!isTom && (
                    <div
                      className={`w-9 h-9 rounded-2xl font-bold flex items-center justify-center text-xs shrink-0 shadow-sm transition-all ${
                        isSpeakingNow ? 'bg-amber-500 text-white scale-110 shadow-md' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      👧
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Danh sách câu hỏi trắc nghiệm ABCD ── */}
      <div className="flex flex-col gap-6">
        <h3 className="font-display font-extrabold text-base md:text-lg text-gray-800 flex items-center gap-2">
          <span>Câu hỏi trắc nghiệm</span>
          <span className="text-xs font-semibold text-text-muted">({data.questions.length} câu)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.questions.map((q, qIdx) => {
            const currentSelected = userAnswers[q.id];
            const isCorrect = isSubmitted && currentSelected?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border-2 border-gray-200 p-5 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display font-extrabold text-sm md:text-base text-gray-800">
                    {qIdx + 1}. {q.question}
                  </span>
                  {isSubmitted && (
                    <span>
                      {isCorrect ? (
                        <CheckCircleIcon className="w-6 h-6 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircleIcon className="w-6 h-6 text-red-500 shrink-0" />
                      )}
                    </span>
                  )}
                </div>

                {/* 4 lựa chọn A, B, C, D */}
                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const optPrefix = String.fromCharCode(65 + optIdx); // A, B, C, D
                    const isOptionSelected = currentSelected === opt;
                    const isOptionAnswer = q.correctAnswer.trim().toLowerCase() === opt.trim().toLowerCase();

                    let btnStyle = 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 text-gray-700';

                    if (isSubmitted) {
                      if (isOptionAnswer) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isOptionSelected && !isCorrect) {
                        btnStyle = 'border-red-400 bg-red-50 text-red-800 line-through';
                      } else {
                        btnStyle = 'border-gray-100 bg-gray-50 text-gray-400 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      btnStyle = 'border-violet-500 bg-violet-100 text-violet-900 font-bold shadow-sm';
                    }

                    return (
                      <button
                        key={opt}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer text-left ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white/80 border border-current font-black text-xs flex items-center justify-center shrink-0">
                          {optPrefix}
                        </span>
                        <span className="text-sm font-semibold flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Giải thích khi submit */}
                {isSubmitted && q.explanation && (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-text-muted mt-1 border border-gray-100">
                    <span className="font-bold text-gray-700 mr-1">Giải thích:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nút nộp bài kiểm tra */}
        <div className="pt-4 flex items-center justify-between gap-4 flex-wrap">
          {!isSubmitted ? (
            <button
              disabled={!isAllAnswered}
              onClick={handleCheckAnswers}
              className={`px-6 py-3 rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isAllAnswered
                  ? 'bg-violet-600 hover:bg-violet-700 text-white active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Kiểm tra câu trả lời
            </button>
          ) : (
            <div className="flex items-center justify-between w-full gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <span className="px-3.5 py-1.5 rounded-xl bg-violet-100 text-violet-900 border border-violet-200">
                  Điểm số: {scoreCount} / {data.questions.length} câu đúng
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  <ArrowPathIcon className="w-4 h-4 text-gray-500" />
                  Làm lại
                </button>
                <button
                  onClick={onPageComplete}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>{currentPage + 1 < totalPages ? 'Tiếp tục' : 'Hoàn thành bài luyện tập'}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
