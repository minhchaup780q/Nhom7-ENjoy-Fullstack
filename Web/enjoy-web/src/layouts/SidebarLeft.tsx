import React from 'react';
import { NavLink } from 'react-router-dom';
import { SettingsFlyoutMenu } from './SettingsFlyoutMenu';

interface MenuItem {
  id: string;
  label: string;
  iconName: string;
  path: string;
}

export const SidebarLeft: React.FC = () => {
  const menuItems: MenuItem[] = [
    { id: 'learn', label: 'Học', iconName: 'school', path: '/learn' },
    { id: 'explore', label: 'Khám phá', iconName: 'explore', path: '/explore' },
    { id: 'pronunciation', label: 'Phát âm', iconName: 'record_voice_over', path: '/pronunciation' },
    { id: 'leaderboard', label: 'Bảng xếp hạng', iconName: 'military_tech', path: '/leaderboard' },
    { id: 'practice', label: 'Luyện tập', iconName: 'fitness_center', path: '/practice' },
    { id: 'exam', label: 'Đề thi', iconName: 'assignment', path: '/exams' },
    { id: 'stats', label: 'Thống kê', iconName: 'trending_up', path: '/stats' },
    { id: 'profile', label: 'Hồ sơ', iconName: 'person', path: '/profile' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/90 min-h-svh p-4 flex flex-col fixed left-0 top-0 bg-white z-20 select-none">
      {/* Brand logo */}
      <div className="px-3 py-5 mb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
          <span className="material-symbols-outlined text-[24px]">school</span>
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 leading-none tracking-tight">
            ENjoy
          </h1>
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-600">
            TIẾNG ANH
          </span>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-display font-bold text-sm tracking-tight transition-all duration-150 ${
                isActive
                  ? 'bg-sky-50 text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'text-sky-600' : 'text-slate-400'
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.iconName}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Nút cài đặt và flyout popup */}
        <SettingsFlyoutMenu />
      </nav>

      {/* Footer copyright */}
      <div className="p-3 border-t border-slate-200/80 text-[11px] font-medium text-slate-400 text-left tracking-tight">
        <p className="hover:text-sky-600 transition-colors cursor-pointer">
          Giới thiệu • Điều khoản
        </p>
        <p className="mt-0.5 text-slate-300">© 2026 ENJOY TEAM</p>
      </div>
    </aside>
  );
};
