import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import type { AdminSessionResponse } from '../api/adminCourseApi';
import { adminCourseApi } from '../api/adminCourseApi';
import { StatusBadge } from './StatusBadge';
import { SessionPlayer } from '../../learning/components/SessionPlayer';
import { SessionStatus } from '../../learning/types';
import type { Session } from '../../learning/types';

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AdminSessionResponse | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewPayload, setPreviewPayload] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !session) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchPreviewData = async () => {
      try {
        // Ưu tiên gọi API getSessionPreview (Backend tự ưu tiên draft_payload nếu có)
        const data = await adminCourseApi.getSessionPreview(session.id);
        if (isMounted) {
          let parsedData = data;
          if (typeof data === 'string') {
            try {
              parsedData = JSON.parse(data);
            } catch {
              parsedData = data;
            }
          }
          setPreviewPayload(parsedData);
        }
      } catch (err: any) {
        console.warn('API getSessionPreview failed, falling back to local session payload:', err);
        // Fallback: Lấy trực tiếp từ session response object
        if (isMounted) {
          const fallbackData = session.hasDraft && session.draftPayload
            ? session.draftPayload
            : session.payload;
          setPreviewPayload(fallbackData || {});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPreviewData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  // Chuyển đổi AdminSessionResponse thành Session của Learning Player
  const adaptedSession: Session = {
    id: session.id,
    partId: session.partId,
    part: { id: session.partId, topicId: 0, title: '', orderIndex: 1 },
    sessionType: session.sessionType as any,
    badgeId: session.badgeId,
    title: session.title,
    description: session.description || '',
    orderIndex: session.orderIndex,
    payload: previewPayload,
    status: SessionStatus.UNLOCK,
    createdAt: session.createdAt || '',
    updatedAt: session.updatedAt || '',
  };

  const isDraftPreview = session.hasDraft || !session.isPublished;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Banner nhỏ thông báo chế độ Preview */}
      <div className="px-4 py-2 bg-slate-800 flex items-center gap-3 text-white shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/60 transition shrink-0"
          title="Thoát xem trước"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <EyeIcon className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-sm font-bold truncate">
            Xem trước: {session.title}
          </span>
          <StatusBadge
            status={
              session.badge ||
              (session.isPublished
                ? session.hasDraft
                  ? 'HAS_DRAFT'
                  : 'PUBLISHED'
                : 'DRAFT')
            }
            size="sm"
          />
          {isDraftPreview && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              Bản nháp
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:block shrink-0">
          Admin Preview · Không ghi nhận tiến độ
        </span>
      </div>

      {/* Content Player Area — full screen */}
      <div className="flex-1 relative overflow-y-auto min-h-0 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-semibold text-slate-600">Đang chuẩn bị dữ liệu bài học...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ExclamationCircleIcon className="w-12 h-12 text-red-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Không thể tải dữ liệu xem trước</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="w-full min-h-full relative flex flex-col flex-1">
            <SessionPlayer
              session={adaptedSession}
              onClose={onClose}
              isPreview={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
