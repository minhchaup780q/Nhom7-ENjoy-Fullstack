import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import {
  adminExamApi,
  type AdminExamDetailResponse,
  type AdminExamRequest,
  type ListeningPartKey,
  type ReadingPartKey,
} from '../api/adminExamApi';
import { StatusBadge } from './StatusBadge';
import { ExamFormModal } from './ExamFormModal';
import { ExamPreviewModal } from './ExamPreviewModal';
import type { PartFormProps } from './exam-forms/PartFormShell';
import {
  ListeningPart1Form,
  ListeningPart2Form,
  ListeningPart3Form,
  ListeningPart4Form,
} from './exam-forms/ListeningPartForms';
import {
  ReadingPart1Form,
  ReadingPart2Form,
  ReadingPart3Form,
  ReadingPart4Form,
  ReadingPart5Form,
} from './exam-forms/ReadingPartForms';

interface NotificationState {
  type: 'success' | 'error' | 'warning';
  message: string;
}

type Section = 'listening' | 'reading';

interface PartDef {
  id: string;
  section: Section;
  partKey: string;
  label: string;
  Form: React.FC<PartFormProps>;
}

const PARTS: PartDef[] = [
  { id: 'L1', section: 'listening', partKey: 'part1', label: 'Part 1 — Kéo tên vào ảnh', Form: ListeningPart1Form },
  { id: 'L2', section: 'listening', partKey: 'part2', label: 'Part 2 — Nghe và điền', Form: ListeningPart2Form },
  { id: 'L3', section: 'listening', partKey: 'part3', label: 'Part 3 — Trắc nghiệm A/B/C', Form: ListeningPart3Form },
  { id: 'L4', section: 'listening', partKey: 'part4', label: 'Part 4 — Tô màu theo vị trí', Form: ListeningPart4Form },
  { id: 'R1', section: 'reading', partKey: 'part1', label: 'Part 1 — Đúng / Sai', Form: ReadingPart1Form },
  { id: 'R2', section: 'reading', partKey: 'part2', label: 'Part 2 — Yes / No', Form: ReadingPart2Form },
  { id: 'R3', section: 'reading', partKey: 'part3', label: 'Part 3 — Sắp xếp chữ cái', Form: ReadingPart3Form },
  { id: 'R4', section: 'reading', partKey: 'part4', label: 'Part 4 — Điền từ vào đoạn văn', Form: ReadingPart4Form },
  { id: 'R5', section: 'reading', partKey: 'part5', label: 'Part 5 — Câu hỏi ngắn theo ảnh', Form: ReadingPart5Form },
];

/** Một phần được coi là đã soạn khi có dữ liệu thật (mảng/object không rỗng). */
export const isPartFilled = (partData: any): boolean => {
  if (partData === null || partData === undefined) return false;
  if (Array.isArray(partData)) return partData.length > 0;
  if (typeof partData === 'object') return Object.keys(partData).length > 0;
  return false;
};

export const AdminExamDetail: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const id = Number(examId);

  const [exam, setExam] = useState<AdminExamDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingPart, setSavingPart] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activePartId, setActivePartId] = useState<string>('L1');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotify = (type: NotificationState['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const loadExam = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setExam(await adminExamApi.getExamDetail(id));
    } catch (err: any) {
      console.error('Lỗi khi tải chi tiết bài thi:', err);
      showNotify('error', 'Không thể tải chi tiết bài thi');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  const payloadOf = (section: Section) =>
    (section === 'listening' ? exam?.listeningPayload : exam?.readingPayload) || {};

  const partData = (part: PartDef) => payloadOf(part.section)[part.partKey];

  const missingParts = PARTS.filter((p) => !isPartFilled(partData(p)));
  const activePart = PARTS.find((p) => p.id === activePartId) || PARTS[0];

  const handleSavePart = async (data: any) => {
    if (!exam) return;
    setSavingPart(true);
    try {
      const updated = activePart.section === 'listening'
        ? await adminExamApi.saveListeningPart(exam.id, activePart.partKey as ListeningPartKey, data)
        : await adminExamApi.saveReadingPart(exam.id, activePart.partKey as ReadingPartKey, data);
      setExam(updated);
      showNotify('success', `Đã lưu ${activePart.section === 'listening' ? 'Nghe' : 'Đọc'} — ${activePart.label}`);
    } catch (err: any) {
      console.error('Lỗi khi lưu phần thi:', err);
      showNotify('error', err?.message || 'Không thể lưu phần này');
    } finally {
      setSavingPart(false);
    }
  };

  const handleSaveMetadata = async (data: AdminExamRequest) => {
    if (!exam) return;
    await adminExamApi.updateExamMetadata(exam.id, data);
    await loadExam();
    showNotify('success', 'Đã cập nhật thông tin bài thi');
  };

  const handlePublish = async () => {
    if (!exam) return;
    setPublishing(true);
    try {
      const result = await adminExamApi.publishExam(exam.id);
      if (result.valid) {
        showNotify('success', result.message);
        await loadExam();
      } else {
        showNotify('warning', `${result.message} (${result.errors.join(', ')})`);
      }
    } catch (err: any) {
      showNotify('error', err?.message || 'Lỗi khi xuất bản bài thi');
    } finally {
      setPublishing(false);
    }
  };

  if (loading && !exam) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full p-12 text-center">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        <p className="text-xs font-semibold text-slate-500 mt-3">Đang tải bài thi...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full p-12 text-center space-y-3">
        <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-700">Không tìm thấy bài thi</h4>
        <button
          onClick={() => navigate('/admin/exams')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const ActiveForm = activePart.Form;
  // Đề đã phát hành thì khóa chỉnh sửa, chỉ cho xem trước / làm thử.
  const readOnly = !!exam.isPublished;

  return (
    <div className="flex-1 flex flex-col space-y-5 max-w-7xl mx-auto w-full pb-16">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="min-w-0">
          <button
            onClick={() => navigate('/admin/exams')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Danh sách bài thi
          </button>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight truncate">
            {exam.title}
          </h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={exam.badge} size="sm" />
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {exam.examType}
            </span>
            {exam.level && (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {exam.level}
              </span>
            )}
            <span className="text-[11px] font-semibold text-slate-400">
              {exam.totalListeningQuestions ?? 0} câu Nghe · {exam.totalReadingQuestions ?? 0} câu Đọc
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition shadow-xs"
          >
            <PlayCircleIcon className="w-4 h-4" /> Xem trước
          </button>
          {!readOnly && (
            <>
              <button
                onClick={() => setEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition shadow-xs"
              >
                <PencilSquareIcon className="w-4 h-4" /> Sửa thông tin
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing || missingParts.length > 0}
                title={
                  missingParts.length > 0
                    ? `Còn ${missingParts.length} phần chưa soạn nội dung`
                    : undefined
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CloudArrowUpIcon className="w-4 h-4" />}
                Xuất bản
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold shadow-md ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 p-1">×</button>
        </div>
      )}

      {readOnly ? (
        /* Đề đã phát hành: khóa chỉnh sửa, hướng người dùng sang Xem trước */
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
          <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Bài thi đã được xuất bản</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Đề thi đang hiển thị cho người học nên không thể chỉnh sửa nội dung. Bạn vẫn có thể
            bấm <span className="font-bold text-slate-700">Xem trước</span> để làm thử và kiểm tra lại đáp án.
          </p>
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs active:scale-95 transition"
          >
            <PlayCircleIcon className="w-4 h-4" /> Xem trước & làm thử
          </button>
        </div>
      ) : (
      <>
      {/* Tiến độ soạn đề */}
      <div
        className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
          missingParts.length === 0
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        {missingParts.length === 0 ? (
          <>
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            Đã soạn đủ 9/9 phần — có thể xuất bản bài thi.
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className="w-5 h-5 text-slate-400 shrink-0" />
            Đã soạn {9 - missingParts.length}/9 phần. Cần hoàn thành đủ 9 phần mới xuất bản được.
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">
        {/* Điều hướng 9 phần */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-4 lg:sticky lg:top-4">
          {(['listening', 'reading'] as Section[]).map((section) => (
            <div key={section}>
              <div className="flex items-center gap-1.5 px-2 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {section === 'listening' ? (
                  <SpeakerWaveIcon className="w-3.5 h-3.5 text-indigo-500" />
                ) : (
                  <BookOpenIcon className="w-3.5 h-3.5 text-indigo-500" />
                )}
                {section === 'listening' ? 'Nghe (Listening)' : 'Đọc (Reading)'}
              </div>
              <div className="space-y-1">
                {PARTS.filter((p) => p.section === section).map((p) => {
                  const filled = isPartFilled(partData(p));
                  const active = p.id === activePartId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePartId(p.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition ${
                        active
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          filled ? 'bg-emerald-400' : active ? 'bg-white/40' : 'bg-slate-300'
                        }`}
                        title={filled ? 'Đã soạn' : 'Chưa soạn'}
                      />
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Form phần đang chọn — key để state khởi tạo lại khi đổi phần */}
        <ActiveForm
          key={`${exam.id}-${activePart.id}`}
          initial={partData(activePart)}
          onSave={handleSavePart}
          saving={savingPart}
        />
      </div>
      </>
      )}

      <ExamFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        exam={exam}
        onSave={handleSaveMetadata}
      />

      {previewOpen && (
        <ExamPreviewModal exam={exam} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
};
