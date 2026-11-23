import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { StreakPopover } from '../components/ui/StreakPopover';
import { ChangePasswordModal } from '../features/auth/components/ChangePasswordModal';
import { LogoutConfirmModal } from '../features/auth/components/LogoutConfirmModal';
import { FamilyManagementModal } from '../features/profile/components/FamilyManagementModal';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { profileApi, type UserProfile } from '../features/profile/services/profileApi';
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
  const { user, logout, accessToken, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [showStreakPopover, setShowStreakPopover] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // User Dropdown Menu states
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

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

    // 2. Lấy profile thực tế của người dùng
    const fetchProfile = async () => {
      try {
        const prof = await profileApi.getProfile();
        if (prof) {
          setProfile(prof);
          if (user && accessToken && (prof.role !== user.role || prof.username !== user.username)) {
            setAuth({ ...user, role: prof.role, username: prof.username }, accessToken);
          }
        }
      } catch (e) {
        console.warn('Chưa thể lấy thông tin profile cho header:', e);
      }
    };

    fetchStreak();
    fetchProfile();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const displayStreak = streakInfo?.currentStreak ?? 0;
  const avatarUrl = profile?.avatarUrl;
  const displayName = profile?.username || user?.username || 'Học viên ENjoy';
  const displayEmail = profile?.email || user?.email || '';
  const initialLetter = displayName[0].toUpperCase();

  const isParent = profile?.role === 'ROLE_PARENT' || user?.role === 'ROLE_PARENT';
  const roleLabel = isParent
    ? 'Phụ huynh'
    : profile?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_ADMIN'
    ? 'Quản trị viên'
    : 'Học sinh';

  return (
    <>
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

        {/* Bên phải: Streak, Gems, Hearts, Notification & User Avatar with Dropdown */}
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

          {/* User Profile Avatar with Dropdown Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-9 h-9 rounded-full bg-sky-600 text-white font-display font-extrabold text-sm flex items-center justify-center overflow-hidden border-2 transition-all cursor-pointer shadow-xs ${
                isUserMenuOpen
                  ? 'border-sky-500 ring-2 ring-sky-400'
                  : 'border-white hover:ring-2 hover:ring-sky-300'
              }`}
              title="Tài khoản & Cài đặt"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initialLetter}</span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 space-y-1 text-left select-none">
                {/* User Info Header */}
                <div className="p-3 bg-gradient-to-br from-slate-50 to-sky-50/60 rounded-2xl border border-slate-100 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-sky-600 text-white font-extrabold text-base flex items-center justify-center overflow-hidden border-2 border-white shadow-xs shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{initialLetter}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-extrabold text-sm text-slate-900 truncate">
                          {displayName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">
                        {displayEmail}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isParent
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-sky-100 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {roleLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 1: Trang cá nhân */}
                <NavLink
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display font-bold text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <span>Hồ sơ cá nhân</span>
                </NavLink>

                {/* Option 2: Quản lý gia đình / Liên kết gia đình */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsFamilyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display font-bold text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  </div>
                  <span>{isParent ? 'Quản lý gia đình' : 'Liên kết gia đình'}</span>
                </button>

                {/* Option 3: Đổi mật khẩu */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display font-bold text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </div>
                  <span>Đổi mật khẩu</span>
                </button>

                {/* Divider */}
                <div className="h-px bg-slate-100 my-1.5" />

                {/* Option 4: Đăng xuất */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display font-bold text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                  </div>
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Quản lý gia đình */}
      <FamilyManagementModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        isParent={isParent}
        userEmail={user?.email}
      />

      {/* Modal Đổi mật khẩu */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        hasPassword={user?.hasPassword ?? false}
      />

      {/* Modal Xác nhận đăng xuất */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
