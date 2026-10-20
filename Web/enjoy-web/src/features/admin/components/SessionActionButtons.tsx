import React from 'react';
import {
  PencilSquareIcon,
  EyeIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { AdminSessionResponse } from '../api/adminCourseApi';

export interface SessionActionButtonsProps {
  session: AdminSessionResponse;
  onEdit: (session: AdminSessionResponse) => void;
  onPreview: (session: AdminSessionResponse) => void;
  onPublish: (session: AdminSessionResponse) => void;
  onDiscardDraft?: (session: AdminSessionResponse) => void;
  onDelete: (session: AdminSessionResponse) => void;
  isLoading?: boolean;
  compact?: boolean;
  className?: string;
}

export const SessionActionButtons: React.FC<SessionActionButtonsProps> = ({
  session,
  onEdit,
  onPreview,
  onPublish,
  onDiscardDraft,
  onDelete,
  isLoading = false,
  compact = false,
  className = '',
}) => {
  const badge = session.badge || (session.isPublished ? (session.hasDraft ? 'HAS_DRAFT' : 'PUBLISHED') : 'DRAFT');

  // Nút Sửa: nhãn và tooltip tương ứng theo trạng thái
  const editLabel =
    badge === 'HAS_DRAFT'
      ? 'Tiếp tục sửa nháp'
      : badge === 'PUBLISHED'
      ? 'Sửa (Tạo nháp)'
      : 'Sửa nội dung';

  const previewLabel =
    badge === 'HAS_DRAFT' ? 'Xem trước nháp' : 'Xem trước';

  const publishLabel =
    badge === 'HAS_DRAFT' ? 'Phát hành bản sửa' : 'Phát hành';

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {/* 1. NÚT XEM THỬ / PREVIEW */}
      <button
        type="button"
        onClick={() => onPreview(session)}
        disabled={isLoading}
        title={previewLabel}
        className={
          compact
            ? 'p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition disabled:opacity-50'
            : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 transition disabled:opacity-50 shadow-xs'
        }
      >
        <EyeIcon className="w-4 h-4 shrink-0 text-slate-500" />
        {!compact && <span>{previewLabel}</span>}
      </button>

      {/* 2. NÚT SỬA NỘI DUNG */}
      <button
        type="button"
        onClick={() => onEdit(session)}
        disabled={isLoading}
        title={editLabel}
        className={
          compact
            ? 'p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition disabled:opacity-50'
            : badge === 'HAS_DRAFT'
            ? 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-300 bg-sky-50 text-xs font-semibold text-sky-800 hover:bg-sky-100 active:scale-95 transition disabled:opacity-50 shadow-xs'
            : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition disabled:opacity-50 shadow-xs'
        }
      >
        <PencilSquareIcon className="w-4 h-4 shrink-0" />
        {!compact && <span>{editLabel}</span>}
      </button>

      {/* 3. NÚT PHÁT HÀNH (Chỉ hiển thị khi DRAFT hoặc HAS_DRAFT) */}
      {(badge === 'DRAFT' || badge === 'HAS_DRAFT') && (
        <button
          type="button"
          onClick={() => onPublish(session)}
          disabled={isLoading}
          title={publishLabel}
          className={
            compact
              ? 'p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 transition disabled:opacity-50'
              : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 transition disabled:opacity-50 shadow-xs'
          }
        >
          {isLoading ? (
            <ArrowPathIcon className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <CloudArrowUpIcon className="w-4 h-4 shrink-0" />
          )}
          {!compact && <span>{publishLabel}</span>}
        </button>
      )}

      {/* 4. NÚT HỦY BẢN NHÁP (Chỉ khi HAS_DRAFT) */}
      {badge === 'HAS_DRAFT' && onDiscardDraft && (
        <button
          type="button"
          onClick={() => onDiscardDraft(session)}
          disabled={isLoading}
          title="Hủy bỏ bản nháp và quay lại bản Live đang phát hành"
          className={
            compact
              ? 'p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 active:scale-95 transition disabled:opacity-50'
              : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-xs font-semibold text-amber-700 hover:bg-amber-100 active:scale-95 transition disabled:opacity-50 shadow-xs'
          }
        >
          <ArrowUturnLeftIcon className="w-4 h-4 shrink-0" />
          {!compact && <span>Hủy nháp</span>}
        </button>
      )}

      {/* 5. NÚT XÓA BÀI HỌC */}
      <button
        type="button"
        onClick={() => onDelete(session)}
        disabled={isLoading}
        title={
          session.isPublished
            ? 'Xóa bài học đang phát hành (Hệ thống sẽ chuyển quyền mở khóa cho học sinh)'
            : 'Xóa bài học'
        }
        className={
          compact
            ? 'p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition disabled:opacity-50'
            : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-transparent text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 active:scale-95 transition disabled:opacity-50'
        }
      >
        <TrashIcon className="w-4 h-4 shrink-0" />
        {!compact && <span>Xóa</span>}
      </button>
    </div>
  );
};

export default SessionActionButtons;
