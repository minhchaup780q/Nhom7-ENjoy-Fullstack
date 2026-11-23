import React from 'react';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';
import type { DeleteResult } from '../api/adminCourseApi';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemType: 'Topic' | 'Part' | 'Session';
  deleteResult?: DeleteResult | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  title,
  itemType,
  deleteResult,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  const affectedCount = deleteResult?.affectedStudentCount ?? 0;
  const isHighRisk = affectedCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Xác nhận xóa {itemType}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[260px]">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Bạn có chắc chắn muốn xóa <strong>{title}</strong>? Thao tác này sẽ đánh dấu xóa mềm (soft delete) mục này khỏi hệ thống.
          </p>

          {isHighRisk && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Cảnh báo ảnh hưởng học sinh ({affectedCount} người)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90">
                Mục này đang phát hành trực tuyến và có học sinh đang mở khóa bài học.
              </p>
              <div className="flex items-start gap-1.5 pt-1 text-[11px] font-semibold text-emerald-800">
                <ArrowRightCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Hệ thống sẽ tự động kích hoạt cơ chế <strong>Auto-Bridge Unlock</strong> để chuyển tiếp quyền mở khóa cho học sinh sang bài kế tiếp hợp lệ.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition active:scale-95 disabled:opacity-50 shadow-xs"
          >
            {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
