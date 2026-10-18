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

  // Render rank badge (1, 2, 3 have medals, 4-12 green, 13+ red)
  const renderRankBadge = () => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#ffc800] text-white flex items-center justify-center font-display font-black text-sm shadow-sm ring-2 ring-[#ffd84d]">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#c0c0c0] text-white flex items-center justify-center font-display font-black text-sm shadow-sm ring-2 ring-[#e0e0e0]">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#cd7f32] text-white flex items-center justify-center font-display font-black text-sm shadow-sm ring-2 ring-[#df9b5a]">
          3
        </div>
      );
    }

    if (rank <= 12) {
      return (
        <span className="w-8 text-center font-display font-black text-base text-[#58cc02]">
          {rank}
        </span>
      );
    }

    return (
      <span className="w-8 text-center font-display font-black text-base text-[#ea2b2b]">
        {rank}
      </span>
    );
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username || 'EnjoyUser')}`;

  return (
    <div
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all select-none ${
        isCurrentUser
          ? 'bg-[#d7ffb8] border-2 border-[#a3e635] shadow-sm font-black'
          : 'hover:bg-[#f7f9fa] border-2 border-transparent'
      }`}
    >
      {/* Left side: Rank badge + Avatar + Username */}
      <div className="flex items-center gap-3.5">
        {renderRankBadge()}

        {/* User Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm flex items-center justify-center">
            <img
              src={avatarUrl || defaultAvatar}
              alt={username}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Small online / status dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#58cc02] border-2 border-white rounded-full" />
        </div>

        {/* Username */}
        <span
          className={`font-display text-sm tracking-wide ${
            isCurrentUser ? 'text-[#14532d] font-black' : 'text-[#3c3c3c] font-extrabold'
          }`}
        >
          {username}
        </span>
      </div>

      {/* Right side: Weekly XP */}
      <div className="text-right">
        <span
          className={`font-display text-sm ${
            isCurrentUser ? 'text-[#14532d] font-black' : 'text-[#777] font-bold'
          }`}
        >
          {weeklyXp} KN
        </span>
      </div>
    </div>
  );
};
