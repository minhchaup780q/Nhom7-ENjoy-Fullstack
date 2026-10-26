import React, { useState, useRef, useEffect } from 'react';
import {
  PencilSquareIcon,
  EyeIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const previewLabel = badge === 'HAS_DRAFT' ? 'Xem trước nháp' : 'Xem trước';

  const editLabel =
    badge === 'HAS_DRAFT'
      ? 'Tiếp tục sửa nháp'
      : badge === 'PUBLISHED'
      ? 'Sửa (Tạo nháp)'
      : 'Sửa nội dung';

  const publishLabel =
    badge === 'HAS_DRAFT' ? 'Phát hành bản sửa' : 'Phát hành';

  const btnBase = compact
    ? 'p-1.5 rounded-lg active:scale-95 transition disabled:opacity-50'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition disabled:opacity-50 shadow-xs';

  // Khi HAS_DRAFT: gom Sửa nháp / Phát hành / Hủy nháp vào dropdown
  if (badge === 'HAS_DRAFT') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {/* 1. Xem trước nháp */}
        <button
          type="button"
          onClick={() => onPreview(session)}
          disabled={isLoading}
          title={previewLabel}
          className={
            compact
              ? `${btnBase} text-slate-600 hover:text-indigo-600 hover:bg-indigo-50`
              : `${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600`
          }
        >
          <EyeIcon className="w-4 h-4 shrink-0 text-slate-500" />
          {!compact && <span>{previewLabel}</span>}
        </button>

        {/* 2. Dropdown "Hành động khác" */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            disabled={isLoading}
            title="Hành động khác"
            aria-expanded={menuOpen}
            className={
              compact
                ? `${btnBase} text-slate-600 hover:text-slate-800 hover:bg-slate-100`
                : `${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`
            }
          >
            <EllipsisVerticalIcon className="w-4 h-4 shrink-0" />
            {!compact && <span>Hành động</span>}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 z-30 w-52 bg-white rounded-xl border border-slate-200 shadow-lg py-1 animate-in fade-in zoom-in-95 duration-150">
              {/* Sửa nháp */}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onEdit(session); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 transition"
              >
                <PencilSquareIcon className="w-4 h-4 shrink-0" />
                {editLabel}
              </button>
              {/* Phát hành */}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onPublish(session); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition"
              >
                <CloudArrowUpIcon className="w-4 h-4 shrink-0" />
                {publishLabel}
              </button>
              {/* Hủy nháp */}
              {onDiscardDraft && (
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onDiscardDraft(session); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4 shrink-0" />
                  Hủy nháp (quay về bản Live)
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. Xóa */}
        <button
          type="button"
          onClick={() => onDelete(session)}
          disabled={isLoading}
          title="Xóa bài học"
          className={
            compact
              ? `${btnBase} text-slate-400 hover:text-red-600 hover:bg-red-50`
              : `${btnBase} border border-transparent text-slate-500 hover:text-red-600 hover:bg-red-50`
          }
        >
          <TrashIcon className="w-4 h-4 shrink-0" />
          {!compact && <span>Xóa</span>}
        </button>
      </div>
    );
  }

  // Trạng thái DRAFT / PUBLISHED: giữ nguyên layout gốc
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {/* Xem trước */}
      <button
        type="button"
        onClick={() => onPreview(session)}
        disabled={isLoading}
        title={previewLabel}
        className={
          compact
            ? `${btnBase} text-slate-600 hover:text-indigo-600 hover:bg-indigo-50`
            : `${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600`
        }
      >
        <EyeIcon className="w-4 h-4 shrink-0 text-slate-500" />
        {!compact && <span>{previewLabel}</span>}
      </button>

      {/* Sửa */}
      <button
        type="button"
        onClick={() => onEdit(session)}
        disabled={isLoading}
        title={editLabel}
        className={
          compact
            ? `${btnBase} text-slate-600 hover:text-blue-600 hover:bg-blue-50`
            : `${btnBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600`
        }
      >
        <PencilSquareIcon className="w-4 h-4 shrink-0" />
        {!compact && <span>{editLabel}</span>}
      </button>

      {/* Phát hành (chỉ DRAFT) */}
      {badge === 'DRAFT' && (
        <button
          type="button"
          onClick={() => onPublish(session)}
          disabled={isLoading}
          title={publishLabel}
          className={
            compact
              ? `${btnBase} text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50`
              : `${btnBase} bg-emerald-600 text-white hover:bg-emerald-700`
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

      {/* Xóa */}
      <button
        type="button"
        onClick={() => onDelete(session)}
        disabled={isLoading}
        title={session.isPublished ? 'Xóa bài học đang phát hành' : 'Xóa bài học'}
        className={
          compact
            ? `${btnBase} text-slate-400 hover:text-red-600 hover:bg-red-50`
            : `${btnBase} border border-transparent text-slate-500 hover:text-red-600 hover:bg-red-50`
        }
      >
        <TrashIcon className="w-4 h-4 shrink-0" />
        {!compact && <span>Xóa</span>}
      </button>
    </div>
  );
};

export default SessionActionButtons;
