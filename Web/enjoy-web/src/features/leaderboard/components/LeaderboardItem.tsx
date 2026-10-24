import React from 'react';
import type { LeaderboardUser } from '../types';

interface LeaderboardItemProps {
  user: LeaderboardUser;
  isCurrentUser?: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  user,
  isCurrentUser = false,
}) => {
  const { rank, username, avatarUrl, weeklyXp } = user;
  const isPromoting = rank <= 12;
  const isRank12 = rank === 12;

  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username || `User_${user.userId}`)}`;

  // Tạo phụ đề hiển thị tự nhiên dựa trên vị trí và trạng thái
  const getSubtext = () => {
    if (isRank12) return 'Ngưỡng thăng hạng';
    if (weeklyXp > 0) return 'Tích cực thi đấu';
    if (isPromoting) return rank === 4 ? 'Sẵn sàng nhập cuộc' : rank === 5 ? 'Học tập tích cực' : 'Sẵn sàng thi đấu';
    return 'Giữ hạng giải đấu';
  };

  return (
    <div
      className={`p-3.5 sm:px-8 flex items-center justify-between transition-colors group select-none ${
        isCurrentUser
          ? 'bg-sky-50/80 border-l-4 border-sky-600 font-bold'
          : isRank12
          ? 'bg-emerald-50/25 hover:bg-emerald-50/40'
          : 'hover:bg-slate-50/90'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Rank Number Column */}
        <div className="w-8 shrink-0 flex items-center justify-center">
          {isRank12 ? (
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center ring-2 ring-emerald-300">
              {rank}
            </div>
          ) : isCurrentUser ? (
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {rank}
            </div>
          ) : isPromoting ? (
            <span className="font-display font-black text-sm text-slate-700">
              {rank}
            </span>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center">
              {rank}
            </div>
          )}
        </div>

        {/* User Circular Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 rounded-full border flex items-center justify-center overflow-hidden shadow-2xs ${
              isCurrentUser
                ? 'border-sky-300 bg-sky-100/70 p-0.5'
                : isRank12
                ? 'border-emerald-300 bg-emerald-50 p-0.5'
                : isPromoting
                ? 'border-slate-200 bg-sky-50/60 p-0.5'
                : 'border-slate-200 bg-slate-100 p-0.5'
            }`}
          >
            <img
              src={avatarUrl && avatarUrl.trim() !== '' ? avatarUrl : defaultAvatar}
              alt={username}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          {weeklyXp > 0 && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm sm:text-base truncate ${
                isCurrentUser ? 'font-extrabold text-sky-950' : 'font-bold text-slate-900'
              }`}
            >
              {username} {isCurrentUser && '(Bạn)'}
            </span>
            {isRank12 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shrink-0">
                Top 12 chót
              </span>
            ) : isPromoting ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">
                Thăng hạng
              </span>
            ) : null}
          </div>
          <span className="text-xs text-slate-400 font-medium mt-0.5">
            {getSubtext()}
          </span>
        </div>
      </div>

      {/* Right side: Weekly XP */}
      <div className="text-right shrink-0 flex items-baseline gap-1">
        <span
          className={`font-display font-black text-base sm:text-lg ${
            isCurrentUser ? 'text-sky-700' : 'text-slate-900'
          }`}
        >
          {weeklyXp}
        </span>
        <span className="text-[11px] font-bold text-slate-400 uppercase">KN</span>
      </div>
    </div>
  );
};
