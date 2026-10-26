import React, { useState, useEffect } from 'react';
import { XMarkIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import type { AdminPartResponse, AdminPartRequest } from '../api/adminCourseApi';

interface PartFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: AdminPartResponse | null;
  topicId: number;
  onSave: (data: AdminPartRequest) => Promise<void>;
}

export const PartFormModal: React.FC<PartFormModalProps> = ({
  isOpen,
  onClose,
  part,
  topicId,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (part) {
      setTitle(part.title || '');
      setOrderIndex(part.orderIndex || 1);
    } else {
      setTitle('');
      setOrderIndex(1);
    }
    setError(null);
  }, [part, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Tên phần học không được để trống');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        topicId,
        title: title.trim(),
        orderIndex,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu phần học');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <SquaresPlusIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {part ? 'Chỉnh sửa Phần học (Part)' : 'Tạo mới Phần học (Part)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tên phần học *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Phần 1: Từ vựng & Ngữ pháp căn bản"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Thứ tự hiển thị (Order)
            </label>
            <input
              type="number"
              min={1}
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value) || 1)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : part ? 'Lưu thay đổi' : 'Tạo phần học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartFormModal;
