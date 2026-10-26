import React, { useState, useEffect } from 'react';
import { XMarkIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import type { AdminTopicResponse, AdminTopicRequest } from '../api/adminCourseApi';

interface TopicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: AdminTopicResponse | null;
  levelId: number;
  onSave: (data: AdminTopicRequest) => Promise<void>;
}

export const TopicFormModal: React.FC<TopicFormModalProps> = ({
  isOpen,
  onClose,
  topic,
  levelId,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title || '');
      setDescription(topic.description || '');
      setThumbnailUrl(topic.thumbnailUrl || '');
      setOrderIndex(topic.orderIndex || 1);
    } else {
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setOrderIndex(1);
    }
    setError(null);
  }, [topic, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Tiêu đề chủ đề không được để trống');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        levelId,
        title: title.trim(),
        description: description.trim() || undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        orderIndex: topic ? topic.orderIndex : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu chủ đề');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FolderPlusIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {topic ? 'Chỉnh sửa Chủ đề (Topic)' : 'Tạo mới Chủ đề (Topic)'}
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
              Tiêu đề chủ đề *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chủ đề Động vật (Animals)"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mô tả chủ đề
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả nội dung tổng quát của chủ đề..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              URL ảnh đại diện (Thumbnail)
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
              {loading ? 'Đang lưu...' : topic ? 'Lưu thay đổi' : 'Tạo chủ đề'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicFormModal;
