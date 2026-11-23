import React, { useState, useEffect } from 'react';
import { XMarkIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import type { AdminExamResponse, AdminExamRequest, ExamType } from '../api/adminExamApi';

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: AdminExamResponse | null;
  onSave: (data: AdminExamRequest) => Promise<void>;
}

const EXAM_TYPES: Array<{ value: ExamType; label: string }> = [
  { value: 'CAMBRIDGE', label: 'Cambridge' },
  { value: 'COLLINS', label: 'Collins' },
  { value: 'CUSTOM', label: 'Custom' },
];

export const ExamFormModal: React.FC<ExamFormModalProps> = ({ isOpen, onClose, exam, onSave }) => {
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<ExamType>('CAMBRIDGE');
  const [level, setLevel] = useState('Pre-A1');
  const [description, setDescription] = useState('');
  const [listeningDuration, setListeningDuration] = useState(20);
  const [readingDuration, setReadingDuration] = useState(20);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exam) {
      setTitle(exam.title || '');
      setExamType(exam.examType || 'CAMBRIDGE');
      setLevel(exam.level || 'Pre-A1');
      setDescription(exam.description || '');
      setListeningDuration(exam.listeningDuration ?? 20);
      setReadingDuration(exam.readingDuration ?? 20);
    } else {
      setTitle('');
      setExamType('CAMBRIDGE');
      setLevel('Pre-A1');
      setDescription('');
      setListeningDuration(20);
      setReadingDuration(20);
    }
    setError(null);
  }, [exam, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Tên bài thi không được để trống');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        examType,
        title: title.trim(),
        description: description.trim() || undefined,
        level: level.trim() || undefined,
        listeningDuration,
        readingDuration,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu bài thi');
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
              <ClipboardDocumentCheckIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {exam ? 'Chỉnh sửa thông tin Bài thi' : 'Tạo mới Bài thi'}
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

          {!exam && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 font-medium">
              Sau khi tạo, bạn sẽ được chuyển sang màn hình soạn nội dung để điền lần lượt 4 phần Nghe và 5 phần Đọc.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tên bài thi *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cambridge Starters - Test 1"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Loại bài thi
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium bg-white"
              >
                {EXAM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Level
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="VD: Pre-A1"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mô tả
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về bài thi..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Thời lượng Nghe (phút)
              </label>
              <input
                type="number"
                min={1}
                value={listeningDuration}
                onChange={(e) => setListeningDuration(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Thời lượng Đọc (phút)
              </label>
              <input
                type="number"
                min={1}
                value={readingDuration}
                onChange={(e) => setReadingDuration(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
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
              {loading ? 'Đang lưu...' : exam ? 'Lưu thay đổi' : 'Tạo & soạn nội dung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormModal;
