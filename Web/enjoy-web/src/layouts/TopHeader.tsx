import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { StreakPopover } from '../components/ui/StreakPopover';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { profileApi } from '../features/profile/services/profileApi';
import type { StreakInfo } from '../features/leaderboard/types';

interface TopHeaderProps {
  courseLevel?: string;
  gems?: number;
  hearts?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  courseLevel = 'Cấp độ 2 (US 2)',
  gems = 1250,
  hearts = 5,
}) => {
  const { user } = useAuthStore();
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [showStreakPopover, setShowStreakPopover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1. Lấy thông tin streak thực tế từ Backend
    const fetchStreak = async () => {
      try {
        const res = await apiClient.get<StreakInfo>('/api/leaderboard/streak');
        if (res) {
          setStreakInfo(res);
        }
      } catch (e) {
        console.warn('Chưa thể lấy thông tin streak:', e);
      }
    };

    // 2. Lấy avatar thực tế của profile
    const fetchProfile = async () => {
      try {
        const prof = await profileApi.getProfile();
        if (prof?.avatarUrl) {
          setAvatarUrl(prof.avatarUrl);
        }
      } catch (e) {
        console.warn('Chưa thể lấy thông tin profile cho header:', e);
      }
    };

    fetchStreak();
    fetchProfile();
  }, []);

  const displayStreak = streakInfo?.currentStreak ?? 0;
  const initialLetter = (user?.username || user?.email || 'A')[0].toUpperCase();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Bên trái: Selector khóa học / Cờ US */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
        >
          <span className="text-base leading-none">🇺🇸</span>
          <span>{courseLevel}</span>
          <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
        </button>
      </div>

      {/* Bên phải: Streak, Gems, Hearts, Notification & Avatar Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak Flame Pill with Interactive Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStreakPopover(!showStreakPopover)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-display font-extrabold text-xs transition-all cursor-pointer shadow-xs border ${
              showStreakPopover
                ? 'bg-amber-100/90 border-amber-300 text-amber-800 ring-2 ring-amber-300/40'
                : 'bg-amber-50/80 border-amber-200/90 text-amber-700 hover:bg-amber-100/80'
            }`}
            title="Chuỗi ngày streak của bạn"
          >
            <span className="text-base leading-none">🔥</span>
            <span>{displayStreak} ngày</span>
          </button>

          <StreakPopover
            streak={displayStreak}
            weeklyStatus={streakInfo?.weeklyStatus}
            activeDayIndex={streakInfo?.activeDayIndex}
            motivationText={streakInfo?.motivationText}
            isOpen={showStreakPopover}
            onClose={() => setShowStreakPopover(false)}
          />
        </div>

        {/* Gems / Đá quý */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-600 font-display font-extrabold text-xs shadow-xs"
          title="Đá quý"
        >
          <span className="text-base leading-none">💎</span>
          <span>{gems.toLocaleString()}</span>
        </div>

        {/* Hearts / Trái tim */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50/80 border border-rose-200/80 text-rose-600 font-display font-extrabold text-xs shadow-xs"
          title="Năng lượng trái tim"
        >
          <HeartIcon className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
          <span>{hearts}/5</span>
        </div>

        {/* Thông báo */}
        <button
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
          title="Thông báo"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Avatar */}
        <NavLink
          to="/profile"
          className="w-9 h-9 rounded-full bg-sky-600 text-white font-display font-extrabold text-sm flex items-center justify-center overflow-hidden border-2 border-white shadow-xs hover:ring-2 hover:ring-sky-400 transition-all cursor-pointer"
          title="Hồ sơ cá nhân"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{initialLetter}</span>
          )}
        </NavLink>
      </div>
    </header>
  );
};
