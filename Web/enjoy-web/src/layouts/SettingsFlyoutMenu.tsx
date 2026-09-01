import React, { useState, useRef, useEffect } from 'react';
import { Cog6ToothIcon, KeyIcon, ArrowRightOnRectangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ChangePasswordModal } from '../features/auth/components/ChangePasswordModal';
import { LogoutConfirmModal } from '../features/auth/components/LogoutConfirmModal';
import { FamilyManagementModal } from '../features/profile/components/FamilyManagementModal';
import { profileApi } from '../features/profile/services/profileApi';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const SettingsFlyoutMenu: React.FC = () => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const isParent = user?.role === 'ROLE_PARENT';

  // Đóng popup menu cài đặt khi click ra ngoài & Fetch profile mới nhất khi mở menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsFlyoutOpen(false);
      }
    };

    if (isFlyoutOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Fetch latest profile
      profileApi.getProfile().then((p) => {
        if (p && user && accessToken && (p.role !== user.role || p.username !== user.username)) {
          setAuth({ ...user, role: p.role, username: p.username }, accessToken);
        }
      }).catch(() => {});
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFlyoutOpen, user, accessToken, setAuth]);

  // Hàm xử lý xác nhận đăng xuất
  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Nút CÀI ĐẶT trên thanh sidebar */}
        <button
          type="button"
          onClick={() => setIsFlyoutOpen((prev) => !prev)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-display font-extrabold text-sm tracking-wider select-none transition-all duration-100 border-2 ${isFlyoutOpen
            ? 'bg-bg-light text-slate-800 border-border-main'
            : 'border-transparent text-[#5c5c5c] hover:bg-bg-light hover:text-slate-700'
            }`}
        >
          <Cog6ToothIcon className="w-6 h-6 stroke-[2.5]" />
          CÀI ĐẶT
        </button>

        {/* Popup Flyout Menu kế bên nút Cài đặt */}
        {isFlyoutOpen && (
          <div className="absolute left-[calc(100%+12px)] bottom-0 w-60 bg-white rounded-2xl border-2 border-border-main shadow-xl p-2 z-30 animate-fade-in space-y-1">
            {/* Tùy chọn 1: Quản lý gia đình / Liên kết gia đình */}
            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                setIsFamilyModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-display font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-primary-soft text-primary">
                <UserGroupIcon className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>{isParent ? 'Quản lý gia đình' : 'Liên kết gia đình'}</span>
            </button>

            {/* Tùy chọn 2: Đổi mật khẩu */}
            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                setIsPasswordModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-display font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                <KeyIcon className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>Đổi mật khẩu</span>
            </button>

            {/* Đường kẻ phân cách */}
            <div className="h-[1px] bg-border-main my-1" />

            {/* Tùy chọn 3: Đăng xuất */}
            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-display font-bold text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-red-50 text-red-500">
                <ArrowRightOnRectangleIcon className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      {/* Family Management Modal Pop-up */}
      <FamilyManagementModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        isParent={isParent}
        userEmail={user?.email}
      />

      {/* Change Password Modal Pop-up (Đổi mật khẩu ở giữa màn hình) */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        hasPassword={user?.hasPassword ?? false}
      />

      {/* Logout Confirm Modal Pop-up (Xác nhận đăng xuất ở giữa màn hình) */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
