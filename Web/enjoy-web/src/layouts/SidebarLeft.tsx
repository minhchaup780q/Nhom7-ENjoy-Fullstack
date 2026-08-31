import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpenIcon, 
  SparklesIcon, 
  PuzzlePieceIcon, 
  TrophyIcon, 
  FlagIcon, 
  ShoppingBagIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { SettingsFlyoutMenu } from './SettingsFlyoutMenu';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const SidebarLeft: React.FC = () => {
  const menuItems: MenuItem[] = [
    { id: 'learn', label: 'HỌC', icon: <BookOpenIcon className="w-6 h-6 stroke-[2.5]" />, path: '/learn' },
    { id: 'explore', label: 'KHÁM PHÁ', icon: <SparklesIcon className="w-6 h-6 stroke-[2.5]" />, path: '/explore' },
    { id: 'practice', label: 'LUYỆN TẬP', icon: <PuzzlePieceIcon className="w-6 h-6 stroke-[2.5]" />, path: '/practice' },
    { id: 'leaderboard', label: 'BẢNG XẾP HẠNG', icon: <TrophyIcon className="w-6 h-6 stroke-[2.5]" />, path: '/leaderboard' },
    { id: 'quests', label: 'NHIỆM VỤ', icon: <FlagIcon className="w-6 h-6 stroke-[2.5]" />, path: '/quests' },
    { id: 'shop', label: 'CỬA HÀNG', icon: <ShoppingBagIcon className="w-6 h-6 stroke-[2.5]" />, path: '/shop' },
    { id: 'profile', label: 'HỒ SƠ', icon: <UserIcon className="w-6 h-6 stroke-[2.5]" />, path: '/profile' },
  ];

  return (
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
        {menuItems.map((item) => (
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
        ))}

        {/* Nút cài đặt và toàn bộ popup, modal con của nó */}
        <SettingsFlyoutMenu />
      </nav>

      {/* Footer copyright */}
      <div className="p-4 border-t-2 border-border-main text-[11px] font-semibold text-text-muted text-left tracking-wide select-none">
        <p className="hover:text-primary transition-colors cursor-pointer">GIỚI THIỆU • CỬA HÀNG • ĐIỀU KHOẢN</p>
        <p className="mt-1">© 2026 ENJOY TEAM</p>
      </div>
    </aside>
  );
};
