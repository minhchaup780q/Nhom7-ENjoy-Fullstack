import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ChartPieIcon, 
  BookOpenIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../features/auth/store/useAuthStore';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const SidebarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <ChartPieIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/dashboard' },
    { id: 'lessons', label: 'QL BÀI HỌC', icon: <BookOpenIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/lessons' },
    { id: 'users', label: 'QL NGƯỜI DÙNG', icon: <UsersIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/users' },
    { id: 'system', label: 'QL HỆ THỐNG', icon: <Cog6ToothIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/system' },
    { id: 'profile', label: 'HỒ SƠ', icon: <UserIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 border-r-2 border-border-main min-h-svh p-4 flex flex-col fixed left-0 top-0 bg-white z-20">
      {/* Brand logo */}
      <div className="px-4 py-6 mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide text-primary m-0 font-display flex items-center gap-2 select-none">
          Admin
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

        {/* Nút Đăng xuất */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-display font-extrabold text-sm tracking-wider select-none transition-all duration-100 border-2 text-[#5c5c5c] border-transparent hover:bg-red-50 hover:text-red-500"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 stroke-[2.5]" />
          ĐĂNG XUẤT
        </button>
      </nav>

      {/* Footer copyright */}
      <div className="p-4 border-t-2 border-border-main text-[11px] font-semibold text-text-muted text-left tracking-wide select-none">
        <p className="mt-1">© 2026 ENJOY ADMIN</p>
      </div>
    </aside>
  );
};
