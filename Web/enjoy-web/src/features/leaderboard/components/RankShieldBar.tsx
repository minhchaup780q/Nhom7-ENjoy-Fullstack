import React from 'react';
import { RANK_TIERS_CONFIG, type RankTierType } from '../types';

interface RankShieldBarProps {
  currentTier: RankTierType;
}

export const RankShieldBar: React.FC<RankShieldBarProps> = ({ currentTier }) => {
  const currentIdx = RANK_TIERS_CONFIG.findIndex((r) => r.tier === currentTier);
  const activeIndex = currentIdx >= 0 ? currentIdx : 1; // Mặc định Silver nếu chưa có

  // Hiển thị 5 rank: Đồng, Bạc, Vàng, Bạch kim, Kim cương
  const mainTiers = RANK_TIERS_CONFIG.slice(0, 5);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-6 w-full max-w-xl mx-auto mb-6 pb-6 border-b border-slate-100 relative">
      {mainTiers.map((rank, idx) => {
        const isCurrent = rank.tier === currentTier;
        const isPast = rank.level < (RANK_TIERS_CONFIG[activeIndex]?.level ?? 1);
        const isLocked = rank.level > (RANK_TIERS_CONFIG[activeIndex]?.level ?? 1);

        return (
          <React.Fragment key={rank.tier}>
            {/* Shield Item */}
            {isCurrent ? (
              <div className="flex flex-col items-center gap-1.5 relative scale-110">
                <div className="absolute inset-0 bg-sky-400/30 blur-md rounded-full animate-glow pointer-events-none" />
                <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-sky-50 to-white border-2 border-sky-400/80 shadow-lg shadow-sky-500/20 flex items-center justify-center text-sky-600 relative z-10">
                  <span
                    className="material-symbols-outlined text-[34px] sm:text-[38px] drop-shadow-sm text-sky-600"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <span className="text-[11px] sm:text-xs font-black tracking-wide text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300 shadow-xs relative z-10 mt-0.5 uppercase">
                  {rank.nameVi}
                </span>
              </div>
            ) : isPast ? (
              <div className="flex flex-col items-center gap-1.5 opacity-75 hover:opacity-100 transition-all cursor-pointer group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100/60 flex items-center justify-center text-amber-700 shadow-inner group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[28px] sm:text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-500">
                  {rank.nameVi}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-60 transition-opacity">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 relative border border-slate-200">
                  <span
                    className="material-symbols-outlined text-[28px] sm:text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                  <span className="material-symbols-outlined text-[14px] sm:text-[15px] absolute inset-0 m-auto text-slate-700 font-bold">
                    lock
                  </span>
                </div>
                <span className="text-[11px] sm:text-[12px] font-medium text-slate-400">
                  {rank.nameVi}
                </span>
              </div>
            )}

            {/* Connecting progress bar */}
            {idx < mainTiers.length - 1 && (
              <div
                className={`h-1 flex-1 rounded-full max-w-[28px] sm:max-w-[40px] -mt-5 ${
                  isPast || isCurrent
                    ? 'bg-gradient-to-r from-amber-200 to-sky-300'
                    : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
