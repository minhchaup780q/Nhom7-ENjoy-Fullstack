import React, { useRef, useState } from 'react';
import {
  ArrowUpTrayIcon,
  ArrowPathIcon,
  PhotoIcon,
  MusicalNoteIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { adminExamApi } from '../../api/adminExamApi';

interface MediaUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  kind: 'image' | 'audio';
  label: string;
  /** Hiển thị dấu * và viền đỏ khi còn trống */
  required?: boolean;
  compact?: boolean;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  value,
  onChange,
  kind,
  label,
  required = false,
  compact = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = kind === 'image'
        ? await adminExamApi.uploadImage(file)
        : await adminExamApi.uploadAudio(file);
      onChange(url);
    } catch (err: any) {
      console.error('Lỗi khi tải file lên:', err);
      setError(err?.message || 'Tải lên thất bại');
    } finally {
      setUploading(false);
      // Cho phép chọn lại đúng file vừa chọn nếu cần
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const Icon = kind === 'image' ? PhotoIcon : MusicalNoteIcon;
  const isMissing = required && !value;

  return (
    <div className={compact ? '' : 'space-y-1.5'}>
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={kind === 'image' ? 'image/jpeg,image/png,image/webp' : 'audio/mpeg,audio/wav,audio/mp4,audio/x-m4a'}
        onChange={handlePick}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50">
          {kind === 'image' ? (
            <img src={value} alt="" className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0" />
          ) : (
            <audio src={value} controls className="h-9 flex-1 min-w-0" />
          )}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
            >
              {uploading ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : 'Thay đổi'}
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
              title="Xóa"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed text-xs font-bold transition disabled:opacity-60 ${
            isMissing
              ? 'border-red-200 bg-red-50/40 text-red-500 hover:border-red-300'
              : 'border-slate-200 bg-slate-50/60 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {uploading ? (
            <>
              <ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang tải lên...
            </>
          ) : (
            <>
              <Icon className="w-4 h-4" />
              <ArrowUpTrayIcon className="w-3.5 h-3.5" />
              Chọn {kind === 'image' ? 'ảnh' : 'audio'} từ máy
            </>
          )}
        </button>
      )}

      {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}
    </div>
  );
};
