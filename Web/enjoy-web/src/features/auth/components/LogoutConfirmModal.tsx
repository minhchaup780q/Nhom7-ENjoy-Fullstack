import React from 'react';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl border-2 border-slate-200 shadow-2xl p-6 relative font-sans">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header / Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-4 rounded-3xl bg-red-50 text-red-500 mb-4 border border-red-100">
            <ArrowRightOnRectangleIcon className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-700 font-display">
            Đăng Xuất
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-500 border-b-4 border-red-700 text-white font-extrabold uppercase tracking-wider text-xs hover:bg-red-600 active:translate-y-0.5 active:border-b-0 transition cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
