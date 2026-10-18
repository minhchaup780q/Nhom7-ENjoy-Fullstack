import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { RANK_TIERS_CONFIG, type RankTierType } from '../types';

interface RankShieldBarProps {
  currentTier: RankTierType;
}

export const RankShieldBar: React.FC<RankShieldBarProps> = ({ currentTier }) => {
  const currentIdx = RANK_TIERS_CONFIG.findIndex((r) => r.tier === currentTier);
  const activeIndex = currentIdx >= 0 ? currentIdx : 1; // Mặc định Silver (index 1) nếu chưa có

  // Hiển thị 5 rank quanh rank hiện tại để vừa vặn khung hình như Duolingo
  const startIdx = Math.max(0, activeIndex - 1);
  const visibleRanks = RANK_TIERS_CONFIG.slice(startIdx, startIdx + 5);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 select-none">
      {visibleRanks.map((rank) => {
        const isCurrent = rank.tier === currentTier;
        const isPast = rank.level < (RANK_TIERS_CONFIG[activeIndex]?.level ?? 1);
        const isLocked = rank.level > (RANK_TIERS_CONFIG[activeIndex]?.level ?? 1);

        if (isCurrent) {
          return (
            <div
              key={rank.tier}
              className="px-4 py-2 bg-[#dbeafe]/80 border-2 border-[#bfdbfe] rounded-2xl shadow-sm flex items-center justify-center relative scale-110"
              title={`Giải đấu ${rank.nameVi} (Hiện tại)`}
            >
              {/* Active Current Shield */}
              <div className="w-12 h-12 relative flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-[#93c5fd] stroke-[#3b82f6] stroke-[1.5] drop-shadow-sm">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                </svg>
                {/* Center Feather / Wing icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white absolute drop-shadow">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" y1="8" x2="2" y2="22" stroke="white" strokeWidth="2" />
                  <line x1="17.5" y1="15" x2="9" y2="15" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </div>
          );
        }

        if (isPast) {
          return (
            <div
              key={rank.tier}
              className="w-11 h-11 flex items-center justify-center rounded-2xl transition-transform hover:scale-105 cursor-pointer opacity-80"
              title={`Giải đấu ${rank.nameVi} (Đã vượt qua)`}
            >
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#cd7f32] stroke-[#8c501e] stroke-[1.5]">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
            </div>
          );
        }

        // Locked Future Ranks
        return (
          <div
            key={rank.tier}
            className="w-11 h-11 bg-[#f1f3f5] rounded-2xl border border-dashed border-[#d1d5db] flex items-center justify-center relative opacity-50"
            title={`Giải đấu ${rank.nameVi} (Đang khóa)`}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#d1d5db]">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
            </svg>
            <LockClosedIcon className="w-3.5 h-3.5 text-[#9ca3af] absolute" />
          </div>
        );
      })}
    </div>
  );
};
