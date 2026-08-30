import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { ApiError } from '../../../services/apiClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasPassword?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, hasPassword = true }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset form và messages mỗi khi modal được mở
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!');
      return;
    }

    if (hasPassword && !currentPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu hiện tại!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      return;
    }

    setLoading(true);

    try {
      await authApi.changePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
        confirmPassword,
      });

      setErrorMsg(null);
      setSuccessMsg('Cập nhật mật khẩu thành công!');
      useAuthStore.getState().setHasPassword(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (err) {
      setSuccessMsg(null);
      if (err instanceof ApiError) {
        setErrorMsg(err.message || 'Cập nhật mật khẩu thất bại!');
      } else {
        setErrorMsg('Lỗi kết nối máy chủ!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border-2 border-slate-200 shadow-2xl p-6 relative font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-sky-100 text-sky-600">
            {hasPassword ? <Lock className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-700 font-display">
              {hasPassword ? 'Đổi Mật Khẩu' : 'Tạo Mật Khẩu Local'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {hasPassword
                ? 'Nhập mật khẩu hiện tại và mật khẩu mới của bạn'
                : 'Tạo mật khẩu để đăng nhập bằng Email trực tiếp'}
            </p>
          </div>
        </div>

        {/* Feedback Messages: Chỉ hiển thị duy nhất 1 loại thông báo */}
        {errorMsg ? (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center animate-shake">
            {errorMsg}
          </div>
        ) : successMsg ? (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold text-center">
            {successMsg}
          </div>
        ) : null}

        {/* Change Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password Field (Only if user already has a password) */}
          {hasPassword && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                Mật khẩu hiện tại *
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition"
              />
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              Mật khẩu mới *
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              Xác nhận mật khẩu mới *
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs hover:bg-slate-100 transition"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-[#58cc02] border-b-4 border-[#3f9102] text-white font-extrabold uppercase tracking-wider text-xs hover:brightness-105 active:translate-y-0.5 active:border-b-0 transition disabled:opacity-50"
            >
              {loading ? 'ĐANG LƯU...' : 'LƯU MẬT KHẨU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
