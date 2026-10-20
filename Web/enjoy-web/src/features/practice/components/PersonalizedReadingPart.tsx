import React, { useState } from 'react';
import type { ReadingExerciseData } from '../services/personalizedPracticeService';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';

interface Props {
  data: ReadingExerciseData;
  currentPage: number;
  totalPages: number;
  onPageComplete: () => void;
}

export const PersonalizedReadingPart: React.FC<Props> = ({
  data,
  currentPage,
  totalPages,
  onPageComplete,
}) => {
  // Đáp án user đã điền cho từng position: { [position]: selectedWord }
  const [filledAnswers, setFilledAnswers] = useState<Record<number, string>>({});
  // Từ đang được chọn từ Word Bank
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  // Trạng thái đã kiểm tra kết quả chưa
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrectAll, setIsCorrectAll] = useState<boolean>(false);

  const words = data.words;
  const blanks = data.blanks;

  // Xử lý khi click vào 1 từ trong Word Bank
  const handleSelectWord = (word: string) => {
    if (isSubmitted) return;
    if (selectedWord === word) {
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
    }
  };

  // Xử lý khi click vào ô trống trong đoạn văn
  const handleSlotClick = (position: number) => {
    if (isSubmitted) return;
    if (selectedWord) {
      // Điền từ đang chọn vào ô này
      setFilledAnswers((prev) => ({ ...prev, [position]: selectedWord }));
      setSelectedWord(null);
    } else if (filledAnswers[position]) {
      // Click vào ô đã có từ -> gỡ từ ra
      setFilledAnswers((prev) => {
        const next = { ...prev };
        delete next[position];
        return next;
      });
    }
  };

  // Kiểm tra đáp án
  const handleCheckAnswers = () => {
    let allCorrect = true;
    for (const blank of blanks) {
      const userAns = (filledAnswers[blank.position] || '').trim().toLowerCase();
      const expected = blank.answer.trim().toLowerCase();
      if (userAns !== expected) {
        allCorrect = false;
        break;
      }
    }
    setIsCorrectAll(allCorrect);
    setIsSubmitted(true);
  };

  // Làm lại trang này
  const handleRetry = () => {
    setFilledAnswers({});
    setSelectedWord(null);
    setIsSubmitted(false);
    setIsCorrectAll(false);
  };

  // Kiểm tra xem tất cả các ô trống đã được điền chưa
  const isAllFilled = blanks.length > 0 && blanks.every((b) => !!filledAnswers[b.position]);

  // Render câu chuyện có chèn các slot đục lỗ chuẩn Cambridge Part 4
  const renderStoryWithSlots = () => {
    // Tách bằng token chuẩn __SLOT_1__, __SLOT_2__...
    const parts = data.blankStory.split(/(__SLOT_\d+__)/g);

    return parts.map((part, index) => {
      const match = part.match(/__SLOT_(\d+)__/);
      if (match) {
        const position = parseInt(match[1], 10);
        const blankInfo = blanks.find((b) => b.position === position);

        // NẾU KHÔNG CÓ TRONG DANH SÁCH BLANKS THÌ KHÔNG RENDER
        if (!blankInfo) {
          return null;
        }

        const currentAns = filledAnswers[position];

        let slotStyle = 'border-dashed border-2 border-primary/60 bg-blue-50/50 text-primary';
        if (isSubmitted && blankInfo) {
          const isCorrect = (currentAns || '').trim().toLowerCase() === blankInfo.answer.trim().toLowerCase();
          slotStyle = isCorrect
            ? 'border-solid border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
            : 'border-solid border-2 border-red-500 bg-red-50 text-red-800 font-bold';
        } else if (currentAns) {
          slotStyle = 'border-solid border-2 border-indigo-400 bg-indigo-50 text-indigo-900 font-bold shadow-sm';
        }

        return (
          <span
            key={index}
            onClick={() => handleSlotClick(position)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 my-1 mx-1.5 rounded-xl text-sm md:text-base font-extrabold cursor-pointer transition-all duration-150 select-none ${slotStyle} ${
              !currentAns && selectedWord ? 'animate-pulse ring-2 ring-primary ring-offset-1' : ''
            }`}
            title={currentAns ? 'Click để gỡ từ này' : 'Click để điền từ đang chọn'}
          >
            <span className="text-xs text-primary-dark font-black">({position})</span>
            {currentAns ? (
              <span>{currentAns}</span>
            ) : (
              <span className="text-gray-400 font-normal px-2">______</span>
            )}
            {isSubmitted && blankInfo && (
              <span>
                {(currentAns || '').trim().toLowerCase() === blankInfo.answer.trim().toLowerCase() ? (
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600 inline ml-1" />
                ) : (
                  <span className="text-xs text-red-600 inline ml-1 font-bold">
                    <XCircleIcon className="w-4 h-4 text-red-500 inline mr-0.5" />
                    ({blankInfo.answer})
                  </span>
                )}
              </span>
            )}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* ── Tiêu đề & Chỉ dẫn chuẩn Starters Part 4 ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Vòng 1: Đọc đục lỗ
            </span>
            <span className="text-xs font-bold text-gray-500">
              Trang {currentPage + 1} / {totalPages}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-display font-extrabold text-gray-800 mt-1 uppercase tracking-tight">
            READ THIS. CHOOSE A WORD FROM THE BOX. WRITE THE CORRECT WORD NEXT TO NUMBERS.
          </h2>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            Đọc đoạn văn dưới đây. Chọn từ thích hợp trong khung <strong>Word Bank</strong> và điền vào chỗ trống tương ứng.
          </p>
        </div>

        {/* Nút sang trang / hoàn thành vòng nếu đã làm đúng */}
        {isSubmitted && (
          <button
            onClick={onPageComplete}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{currentPage + 1 < totalPages ? 'Sang trang tiếp' : 'Hoàn thành Vòng Đọc'}</span>
            <ArrowRightIcon className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* ── Khu vực chính 2 cột: Word Bank bên trái, Đoạn văn bên phải ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: Word Bank (Chiếm 4-5 phần) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-gray-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-700 tracking-wider">Word Bank:</span>
            <span className="text-xs text-text-muted">Click chọn từ rồi click vào ô trống</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {words.map((w) => {
              const isSelected = selectedWord === w.word;
              const isUsed = Object.values(filledAnswers).includes(w.word);

              return (
                <div
                  key={w.word}
                  onClick={() => handleSelectWord(w.word)}
                  className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none group ${
                    isSelected
                      ? 'border-primary bg-primary-soft shadow-lg -translate-y-1 ring-2 ring-primary'
                      : isUsed
                      ? 'border-gray-200 bg-gray-50 opacity-60 hover:opacity-100'
                      : 'border-gray-200 hover:border-primary/50 bg-white hover:shadow-md'
                  }`}
                >
                  {/* Ảnh từ vựng từ CSDL (nếu không có thì không hiện ảnh) */}
                  {w.imageUrl ? (
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2 border border-gray-100 flex items-center justify-center">
                      <img
                        src={w.imageUrl}
                        alt={w.word}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          console.error(`[PersonalizedReading] Lỗi tải ảnh từ CSDL của từ "${w.word}":`, w.imageUrl);
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-xl bg-gray-50 border border-dashed border-gray-200 mb-2 flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                      <span className="text-2xl mb-1">📖</span>
                      <span className="text-[10px] text-gray-400">Không có ảnh</span>
                    </div>
                  )}

                  {/* Chữ in đậm tiếng Anh chuẩn Cambridge Part 4 */}
                  <span className="font-display font-extrabold text-sm md:text-base text-gray-800 capitalize">
                    {w.word}
                  </span>

                  {/* Huy hiệu đang chọn */}
                  {isSelected && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded-full shadow">
                      Đang chọn
                    </span>
                  )}
                  {isUsed && !isSelected && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded-full shadow">
                      ✓ Đã điền
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: Khung Đoạn văn đục lỗ (Chiếm 7-8 phần) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border-2 border-indigo-200/80 p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-extrabold text-base md:text-lg text-indigo-950">
                {data.title || `Chủ đề: ${data.topic}`}
              </h3>
            </div>

            {/* Nội dung đoạn văn */}
            <div className="text-base md:text-lg text-gray-800 leading-loose font-medium">
              {renderStoryWithSlots()}
            </div>

            {/* Bảng điều khiển kiểm tra kết quả */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              {!isSubmitted ? (
                <button
                  disabled={!isAllFilled}
                  onClick={handleCheckAnswers}
                  className={`px-6 py-3 rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    isAllFilled
                      ? 'bg-primary text-white hover:bg-primary-dark active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <div className="flex items-center gap-3 w-full justify-between flex-wrap">
                  <div className="flex items-center gap-2">
                    {isCorrectAll ? (
                      <span className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                        Chính xác hoàn toàn! Bé làm tốt lắm!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm font-extrabold text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                        Còn vị trí chưa đúng, bé hãy quan sát lại đáp án nhé!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold rounded-2xl text-xs transition-colors cursor-pointer"
                    >
                      <ArrowPathIcon className="w-4 h-4 text-gray-500" />
                      Làm lại
                    </button>
                    <button
                      onClick={onPageComplete}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{currentPage + 1 < totalPages ? 'Tiếp tục' : 'Sang Vòng Nghe'}</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
