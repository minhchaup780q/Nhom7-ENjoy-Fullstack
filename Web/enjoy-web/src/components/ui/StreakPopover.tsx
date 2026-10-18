import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface StreakPopoverProps {
  streak?: number;
  isOpen: boolean;
  onClose: () => void;
  // Mảng 7 ngày trong tuần [T2, T3, T4, T5, T6, T7, CN] với trạng thái hoàn thành
  weeklyStatus?: boolean[]; // Độ dài 7, boolean cho mỗi ngày
  activeDayIndex?: number;  // 0: T2, ..., 6: CN (Chủ Nhật)
}

export const StreakPopover: React.FC<StreakPopoverProps> = ({
  streak = 1,
  isOpen,
  onClose,
  weeklyStatus = [false, false, false, false, false, false, true],
  activeDayIndex = 6, // Mặc định Chủ Nhật
}) => {
  if (!isOpen) return null;

  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <>
      {/* Backdrop for closing when clicking outside */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose} 
      />

      {/* Popover Card */}
      <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-[#ff9600] text-white rounded-3xl p-5 shadow-2xl z-50 animate-fade-in-up border-2 border-[#e68500]">
        {/* Tooltip arrow pointer pointing to top streak icon */}
        <div className="absolute -top-2.5 right-24 w-0 h-0 border-x-8 border-x-transparent border-b-[10px] border-b-[#ff9600]" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="space-y-1.5 flex-1 text-left">
            <h3 className="text-2xl font-display font-black tracking-tight text-white drop-shadow-sm">
              {streak} ngày streak
            </h3>
            <p className="text-xs font-bold text-white/95 leading-relaxed">
              Bạn đã học và nối dài streak sớm hơn so với 37,58% tổng số người học của hôm qua!
            </p>
          </div>

          {/* Duolingo Fire Flame Graphic */}
          <div className="shrink-0 w-20 h-20 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Outer white glowing flame outline */}
              <path
                d="M50 5 C62 25 88 45 88 68 C88 86 71 95 50 95 C29 95 12 86 12 68 C12 45 38 25 50 5 Z"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main Flame body */}
              <path
                d="M50 8 C60 27 85 46 85 68 C85 84 69 92 50 92 C31 92 15 84 15 68 C15 46 40 27 50 8 Z"
                fill="#ff7700"
              />
              {/* Inner golden glow flame */}
              <path
                d="M50 42 C57 52 70 62 70 73 C70 82 61 86 50 86 C39 86 30 82 30 73 C30 62 43 52 50 42 Z"
                fill="#ffdd00"
              />
              {/* Bright yellow center highlight */}
              <path
                d="M50 55 C54 62 60 68 60 75 C60 80 55 83 50 83 C45 83 40 80 40 75 C40 68 46 62 50 55 Z"
                fill="#fff385"
              />
            </svg>
          </div>
        </div>

        {/* Weekly Streak Tracker Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-inner">
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, idx) => {
              const isCompleted = weeklyStatus[idx];
              const isToday = idx === activeDayIndex;

              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`text-[11px] font-display font-extrabold ${
                      isToday ? 'text-[#ff9600]' : 'text-[#8b8b8b]'
                    }`}
                  >
                    {day}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#ff9600] text-white shadow-sm ring-2 ring-[#ff9600]/30'
                        : isToday
                        ? 'bg-[#f1f3f5] border-2 border-[#ff9600]/40'
                        : 'bg-[#e5e7eb]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c4c4c4]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
