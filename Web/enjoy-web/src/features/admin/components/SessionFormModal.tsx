import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import type {
  AdminSessionResponse,
  AdminSessionRequest,
  SessionType,
} from '../api/adminCourseApi';
import { StatusBadge } from './StatusBadge';
import { JsonPayloadEditor } from './session-forms/JsonPayloadEditor';
import { FlashcardPayloadForm } from './session-forms/FlashcardPayloadForm';
import { GrammarPayloadForm } from './session-forms/GrammarPayloadForm';
import { SentencePayloadForm } from './session-forms/SentencePayloadForm';
import { ConversationPayloadForm } from './session-forms/ConversationPayloadForm';
import { DragDropPayloadForm } from './session-forms/DragDropPayloadForm';

export interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: AdminSessionResponse | null;
  partId?: number;
  onSave: (data: AdminSessionRequest, publishNow: boolean) => Promise<void>;
}

const SESSION_TYPE_OPTIONS: { value: SessionType; label: string; desc: string }[] = [
  { value: 'FLASHCARD', label: 'Flashcard (Thẻ từ vựng)', desc: 'Lật thẻ học từ mới kèm audio và ảnh' },
  { value: 'MATCH_WORD', label: 'Match Word (Nối từ)', desc: 'Nối từ tiếng Anh với nghĩa tiếng Việt' },
  { value: 'SPEAKING', label: 'Speaking (Phát âm từ vựng)', desc: 'Luyện nói từ vựng qua AI chấm điểm' },
  { value: 'RE_ORDER', label: 'Re-order (Sắp xếp từ)', desc: 'Sắp xếp chữ cái cấu thành từ vựng' },
  { value: 'DRAG_DROP', label: 'Drag & Drop (Kéo thả ảnh)', desc: 'Kéo từ vào đúng vị trí trên sơ đồ' },
  { value: 'GRAMMAR', label: 'Grammar (Bài giảng Ngữ pháp)', desc: 'Lý thuyết theo khối và câu hỏi củng cố' },
  { value: 'FILL_IN_BLANK', label: 'Fill in Blank (Điền vào chỗ trống)', desc: 'Điền từ khuyết vào câu hoàn chỉnh' },
  { value: 'RE_ORDER_SENTENCE', label: 'Re-order Sentence (Ghép câu)', desc: 'Sắp xếp các từ xáo trộn thành câu đúng' },
  { value: 'SPEAKING_SENTENCE', label: 'Speaking Sentence (Luyện nói câu)', desc: 'Luyện đọc cả câu tiếng Anh trôi chảy' },
  { value: 'CONVERSATION', label: 'Conversation (Hội thoại)', desc: 'Luyện đối thoại tương tác chọn phản hồi' },
];

export const SessionFormModal: React.FC<SessionFormModalProps> = ({
  isOpen,
  onClose,
  session,
  partId,
  onSave,
}) => {
  const isEdit = !!session;
  const isLive = session?.isPublished ?? false;
  const hasDraft = session?.hasDraft ?? false;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('FLASHCARD');
  const [orderIndex, setOrderIndex] = useState(1);
  const [payload, setPayload] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'JSON'>('VISUAL');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<'draft' | 'publish' | null>(null);

  // Nạp dữ liệu khi mở modal hoặc thay đổi session
  useEffect(() => {
    if (!isOpen) return;

    if (session) {
      setTitle(session.title || '');
      setDescription(session.description || '');
      setSessionType(session.sessionType || 'FLASHCARD');
      setOrderIndex(session.orderIndex || 1);

      // Parse payload nếu là string (do @JsonRawValue serialization)
      const parseRaw = (raw: any): any => {
        if (raw == null) return null;
        if (typeof raw === 'string') {
          try { return JSON.parse(raw); } catch { return raw; }
        }
        return raw;
      };

      // Nếu đang có bản nháp, ưu tiên nạp draftPayload
      if (session.hasDraft && session.draftPayload) {
        setPayload(parseRaw(session.draftPayload) || {});
      } else if (session.payload) {
        setPayload(parseRaw(session.payload) || {});
      } else {
        setPayload({});
      }
    } else {
      // Reset form khi tạo mới
      setTitle('');
      setDescription('');
      setSessionType('FLASHCARD');
      setOrderIndex(1);
      setPayload({});
    }
    setErrors({});
    setIsSubmitting(false);
    setSubmitAction(null);
    setActiveTab('VISUAL');
  }, [isOpen, session]);

  if (!isOpen) return null;

  // Validate form trước khi submit
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề bài học không được để trống';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Tiêu đề bài học phải từ 3 ký tự trở lên';
    }

    if (!sessionType) {
      newErrors.sessionType = 'Vui lòng chọn loại bài học';
    }

    // Validation đặc thù từng loại
    if (sessionType === 'FILL_IN_BLANK' && payload?.items?.length) {
      const hasInvalidItem = payload.items.some(
        (it: any) => !it.sentence?.trim() || !it.answer?.trim()
      );
      if (hasInvalidItem) {
        newErrors.payload = 'Mỗi câu hỏi điền từ phải có câu đề bài và đáp án đúng';
      }
    }

    if (sessionType === 'GRAMMAR' && payload?.blocks?.length) {
      const questionBlocks = payload.blocks.filter((b: any) => b.type === 'QUESTION');
      for (const qb of questionBlocks) {
        if (!qb.text?.trim()) {
          newErrors.payload = 'Đề câu hỏi trắc nghiệm không được để trống';
          break;
        }
        const hasCorrect = qb.options?.some((opt: any) => opt.is_correct && opt.text?.trim());
        if (!hasCorrect) {
          newErrors.payload = 'Mỗi câu hỏi trắc nghiệm phải có ít nhất một đáp án đúng có nội dung';
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publishNow: boolean) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitAction(publishNow ? 'publish' : 'draft');

    try {
      const serializedPayload =
        typeof payload === 'string' ? payload : JSON.stringify(payload ?? {});

      const requestData: AdminSessionRequest = {
        partId: session?.partId || partId,
        title: title.trim(),
        description: description.trim() || undefined,
        sessionType,
        orderIndex,
        payload: serializedPayload,
      };

      await onSave(requestData, publishNow);
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi lưu bài học:', err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Không thể lưu bài học. Vui lòng kiểm tra lại!',
      }));
    } finally {
      setIsSubmitting(false);
      setSubmitAction(null);
    }
  };

  const renderVisualForm = () => {
    switch (sessionType) {
      case 'FLASHCARD':
      case 'MATCH_WORD':
      case 'SPEAKING':
      case 'RE_ORDER':
        return (
          <FlashcardPayloadForm
            payload={payload}
            onChange={setPayload}
            partId={session?.partId || partId}
            isEdit={isEdit}
          />
        );

      case 'GRAMMAR':
        return <GrammarPayloadForm payload={payload} onChange={setPayload} />;

      case 'FILL_IN_BLANK':
      case 'RE_ORDER_SENTENCE':
      case 'SPEAKING_SENTENCE':
        return (
          <SentencePayloadForm
            sessionType={sessionType}
            payload={payload}
            onChange={setPayload}
          />
        );

      case 'CONVERSATION':
        return <ConversationPayloadForm payload={payload} onChange={setPayload} />;

      case 'DRAG_DROP':
        return <DragDropPayloadForm payload={payload} onChange={setPayload} />;

      default:
        return (
          <JsonPayloadEditor
            value={payload}
            onChange={setPayload}
            error={errors.payload}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  {isEdit ? 'Chỉnh sửa Bài học (Session)' : 'Tạo mới Bài học (Session)'}
                </h3>
                {session && (
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
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập thông tin chung và cấu hình nội dung bài tập tương tác
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>



        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Phần 1: Metadata chung */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tiêu đề bài học *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="VD: Từ vựng gia đình 1 (Family Vocabulary)"
                className={`w-full text-xs px-3 py-2 border rounded-xl outline-none transition font-medium ${
                  errors.title
                    ? 'border-red-400 ring-2 ring-red-400/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Thứ tự bài học (Order)
              </label>
              <input
                type="number"
                min={1}
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value) || 1)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mô tả ngắn (tùy chọn)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Bài tập nhận biết các thành viên trong gia đình cơ bản"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Loại bài tập (Session Type) *
                </label>
                {isEdit && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    Cố định khi chỉnh sửa
                  </span>
                )}
              </div>

              {isEdit ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                      <LockClosedIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {SESSION_TYPE_OPTIONS.find((opt) => opt.value === sessionType)?.label || sessionType}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {SESSION_TYPE_OPTIONS.find((opt) => opt.value === sessionType)?.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {SESSION_TYPE_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => setSessionType(opt.value)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                        sessionType === opt.value
                          ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Phần 2: Soạn thảo Payload */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Nội dung chi tiết bài học
                </span>
                {session?.hasDraft && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                    Bản nháp v{session.version}
                  </span>
                )}
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('VISUAL')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    activeTab === 'VISUAL'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <DocumentTextIcon className="w-3.5 h-3.5" />
                  Giao diện trực quan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('JSON')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    activeTab === 'JSON'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <CodeBracketIcon className="w-3.5 h-3.5" />
                  Mã JSON thô
                </button>
              </div>
            </div>

            {errors.payload && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
                {errors.payload}
              </div>
            )}

            {/* Nội dung tab tương ứng */}
            {activeTab === 'VISUAL' ? (
              renderVisualForm()
            ) : (
              <JsonPayloadEditor
                value={payload}
                onChange={setPayload}
                error={errors.payload}
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-2.5">
            {/* Nút 1: Lưu bản nháp (Draft) */}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting && submitAction === 'draft' ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <CheckCircleIcon className="w-4 h-4 text-slate-500" />
              )}
              <span>
                {isLive ? 'Lưu vào Bản Nháp' : isEdit ? 'Lưu bản nháp' : 'Tạo bản nháp'}
              </span>
            </button>

            {/* Nút 2: Phát hành ngay (Publish) */}
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting && submitAction === 'publish' ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
              ) : (
                <CloudArrowUpIcon className="w-4 h-4 text-white" />
              )}
              <span>
                {isLive
                  ? hasDraft
                    ? 'Phát hành bản sửa Live'
                    : 'Lưu & Phát hành ngay'
                  : 'Lưu & Phát hành ngay'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionFormModal;
