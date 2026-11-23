import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ChartPieIcon,
  BookOpenIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { LogoutConfirmModal } from '../features/auth/components/LogoutConfirmModal';

interface MenuChild {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuChild[];
}

export const SidebarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'OVERVIEW', icon: <ChartPieIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/dashboard' },
    {
      id: 'course',
      label: 'QL KHÓA HỌC',
      icon: <AcademicCapIcon className="w-6 h-6 stroke-[2.5]" />,
      children: [
        { id: 'lessons', label: 'QL Bài học', icon: <BookOpenIcon className="w-5 h-5 stroke-[2.5]" />, path: '/admin/lessons' },
        { id: 'exams', label: 'QL Bài thi', icon: <ClipboardDocumentCheckIcon className="w-5 h-5 stroke-[2.5]" />, path: '/admin/exams' },
      ],
    },
    { id: 'users', label: 'QL NGƯỜI DÙNG', icon: <UsersIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/users' },
    { id: 'system', label: 'QL HỆ THỐNG', icon: <Cog6ToothIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/system' },
    { id: 'profile', label: 'HỒ SƠ', icon: <UserIcon className="w-6 h-6 stroke-[2.5]" />, path: '/admin/profile' },
  ];

  // Nhóm nào chứa route đang active thì tự mở
  const isChildActive = (item: MenuItem) =>
    !!item.children?.some((c) => location.pathname.startsWith(c.path));

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const init = new Set<string>();
    menuItems.forEach((m) => {
      if (m.children && m.children.some((c) => location.pathname.startsWith(c.path))) init.add(m.id);
    });
    return init;
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const parentBaseClass =
    'w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-display font-extrabold text-sm tracking-wider select-none transition-all duration-100 border-2';

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
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openGroups.has(item.id);
            const childActive = isChildActive(item);
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  className={`${parentBaseClass} justify-between ${
                    childActive && !isOpen
                      ? 'bg-primary-soft text-primary border-primary/20'
                      : 'text-[#5c5c5c] border-transparent hover:bg-bg-light'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 stroke-[2.5] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-border-main space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-bold text-[13px] tracking-wide select-none transition-all duration-100 border-2 ${
                            isActive
                              ? 'bg-primary-soft text-primary border-primary/20'
                              : 'text-[#5c5c5c] border-transparent hover:bg-bg-light'
                          }`
                        }
                      >
                        {child.icon}
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path!}
              className={({ isActive }) =>
                `${parentBaseClass} ${
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

        {/* Nút Đăng xuất */}
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-display font-extrabold text-sm tracking-wider select-none transition-all duration-100 border-2 text-[#5c5c5c] border-transparent hover:bg-red-50 hover:text-red-500 cursor-pointer"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 stroke-[2.5]" />
          ĐĂNG XUẤT
        </button>
      </nav>

      {/* Footer copyright */}
      <div className="p-4 border-t-2 border-border-main text-[11px] font-semibold text-text-muted text-left tracking-wide select-none">
        <p className="mt-1">© 2026 ENJOY ADMIN</p>
      </div>

      {/* Modal xác nhận Đăng xuất */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
};
