import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Compass, Trophy, Target, ShoppingBag, User, Sparkles, Settings } from 'lucide-react';
import { SettingsModal } from '../features/auth/components/SettingsModal';
import { useAuthStore } from '../features/auth/store/useAuthStore';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const SidebarLeft: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const menuItems: MenuItem[] = [
    { id: 'learn', label: 'HỌC', icon: <BookOpen className="w-6 h-6 stroke-[2.5]" />, path: '/learn' },
    { id: 'explore', label: 'KHÁM PHÁ', icon: <Sparkles className="w-6 h-6 stroke-[2.5]" />, path: '/explore' },
    { id: 'practice', label: 'LUYỆN TẬP', icon: <Compass className="w-6 h-6 stroke-[2.5]" />, path: '/practice' },
    { id: 'leaderboard', label: 'BẢNG XẾP HẠNG', icon: <Trophy className="w-6 h-6 stroke-[2.5]" />, path: '/leaderboard' },
    { id: 'quests', label: 'NHIỆM VỤ', icon: <Target className="w-6 h-6 stroke-[2.5]" />, path: '/quests' },
    { id: 'shop', label: 'CỬA HÀNG', icon: <ShoppingBag className="w-6 h-6 stroke-[2.5]" />, path: '/shop' },
    { id: 'profile', label: 'HỒ SƠ', icon: <User className="w-6 h-6 stroke-[2.5]" />, path: '/profile' },
  ];

  return (
    <>
      <aside className="w-64 border-r-2 border-border-main min-h-svh p-4 flex flex-col fixed left-0 top-0 bg-white z-20">
        {/* Brand logo */}
        <div className="px-4 py-6 mb-4">
          <h1 className="text-3xl font-extrabold tracking-wide text-primary m-0 font-display flex items-center gap-2 select-none">
            ENjoy
            <span className="w-2.5 h-2.5 rounded-full bg-primary-dark inline-block animate-pulse" />
          </h1>
        </div>

        {/* Menu items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-display font-extrabold text-sm tracking-wider select-none transition-all duration-100 border-2 ${
                    isActive
                      ? 'bg-primary-soft text-primary border-primary/20'
                      : 'text-[#5c5c5c] border-transparent hover:bg-bg-light'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            );
          })}

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-display font-extrabold text-sm tracking-wider select-none transition-all duration-100 border-2 border-transparent text-[#5c5c5c] hover:bg-bg-light hover:text-slate-700"
          >
            <Settings className="w-6 h-6 stroke-[2.5]" />
            CÀI ĐẶT
          </button>
        </nav>

        {/* Footer copyright */}
        <div className="p-4 border-t-2 border-border-main text-[11px] font-semibold text-text-muted text-left tracking-wide select-none">
          <p className="hover:text-primary transition-colors cursor-pointer">GIỚI THIỆU • CỬA HÀNG • ĐIỀU KHOẢN</p>
          <p className="mt-1">© 2026 ENJOY TEAM</p>
        </div>
      </aside>

      {/* Settings Modal Pop-up */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hasPassword={user?.hasPassword ?? false}
      />
    </>
  );
};
