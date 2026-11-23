import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import {
  adminExamApi,
  type AdminExamResponse,
  type AdminExamDetailResponse,
  type AdminExamRequest,
  type ExamType,
} from '../api/adminExamApi';
import { StatusBadge } from './StatusBadge';
import { ExamFormModal } from './ExamFormModal';
import { ExamPreviewModal } from './ExamPreviewModal';

interface NotificationState {
  type: 'success' | 'error' | 'warning';
  message: string;
}

type ExamTypeFilter = 'ALL' | ExamType;

const DEFAULT_LEVEL = 'Pre-A1';

export const AdminExams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<AdminExamResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewExam, setPreviewExam] = useState<AdminExamDetailResponse | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ExamTypeFilter>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>(DEFAULT_LEVEL);

  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotify = (type: NotificationState['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminExamApi.getAllExams();
      setExams(data);
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách bài thi:', err);
      showNotify('error', 'Không thể tải danh sách bài thi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  // === Thống kê ===
  const publishedCount = exams.filter((e) => e.badge === 'PUBLISHED').length;
  const draftCount = exams.filter((e) => e.badge === 'DRAFT').length;

  // === Danh sách level có trong dữ liệu (luôn đảm bảo có mức mặc định) ===
  const availableLevels = (() => {
    const levels = new Set<string>([DEFAULT_LEVEL]);
    exams.forEach((e) => {
      if (e.level) levels.add(e.level);
    });
    return Array.from(levels);
  })();

  // === Lọc + tìm kiếm ===
  const filteredExams = (() => {
    let result = exams;
    if (levelFilter !== 'ALL') {
      result = result.filter((e) => e.level === levelFilter);
    }
    if (typeFilter !== 'ALL') {
      result = result.filter((e) => e.examType === typeFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }
    return result;
  })();

  const handleCreateExam = async (data: AdminExamRequest) => {
    const created = await adminExamApi.createExam(data);
    // Tạo xong chuyển thẳng sang màn hình soạn nội dung 9 phần
    navigate(`/admin/exams/${created.id}`);
  };

  const handleOpenPreview = async (examId: number) => {
    setLoadingPreviewId(examId);
    try {
      setPreviewExam(await adminExamApi.getExamDetail(examId));
    } catch (err: any) {
      console.error('Lỗi khi tải bài thi để xem trước:', err);
      showNotify('error', 'Không thể tải nội dung bài thi để xem trước');
    } finally {
      setLoadingPreviewId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 max-w-7xl mx-auto w-full pb-16">
      {/* 1. Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Quản lý Bài thi
          </h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Quản trị các đề thi (Cambridge, Collins, Custom) và theo dõi lượt làm bài của người học
          </p>
        </div>

        <button
          onClick={loadExams}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition shadow-xs disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold shadow-md animate-in slide-in-from-top duration-200 ${
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
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 p-1">
            ×
          </button>
        </div>
      )}

      {/* 2. WIDGET THỐNG KÊ */}
      {!loading && exams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bài thi đã phát hành</span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-500">
                <CloudArrowUpIcon className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-800 my-2">{publishedCount}</h3>
            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-400">
              Đề thi đang hiển thị cho người học
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bài thi chưa phát hành</span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500">
                <ExclamationCircleIcon className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-800 my-2">{draftCount}</h3>
            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-400">
              Đề thi đang ở trạng thái nháp
            </div>
          </div>
        </div>
      )}

      {/* 3. DANH SÁCH BÀI THI — Tiêu đề + Bộ lọc */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Danh sách Bài thi</h3>
          </div>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Thêm mới bài thi</span>
          </button>
        </div>

        {/* Thanh lọc: Search + Loại bài thi */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bài thi..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition appearance-none cursor-pointer pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            <option value="ALL">Tất cả level</option>
            {availableLevels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ExamTypeFilter)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition appearance-none cursor-pointer pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            <option value="ALL">Tất cả loại</option>
            <option value="CAMBRIDGE">Cambridge</option>
            <option value="COLLINS">Collins</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>
      </div>

      {/* 4. NỘI DUNG DANH SÁCH */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Đang nạp các bài thi...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <DocumentTextIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">
            {exams.length === 0 ? 'Chưa có bài thi nào' : 'Không tìm thấy bài thi phù hợp'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {exams.length === 0
              ? 'Hãy bấm "Thêm mới bài thi" để tạo đề thi đầu tiên.'
              : 'Thử đổi từ khóa tìm kiếm hoặc bộ lọc loại bài thi.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
            >
              {/* Trái: thông tin bài thi */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h6 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{exam.title}</h6>
                  <StatusBadge status={exam.badge} size="sm" />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {(exam.listeningDuration ?? 0) + (exam.readingDuration ?? 0)} phút
                  </span>
                  <span>
                    {(exam.totalListeningQuestions ?? 0) + (exam.totalReadingQuestions ?? 0)} câu hỏi
                  </span>
                </div>
              </div>

              {/* Phải: lượt làm bài + hành động */}
              <div className="shrink-0 flex items-center gap-2">
                {exam.badge === 'PUBLISHED' ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <UsersIcon className="w-4 h-4 text-indigo-500" />
                    <div className="leading-tight">
                      <div className="text-sm font-extrabold text-indigo-700">{exam.attemptCount}</div>
                      <div className="text-[10px] font-semibold text-indigo-400">lượt làm</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 italic px-2">
                    Chưa phát hành
                  </span>
                )}

                <button
                  onClick={() => handleOpenPreview(exam.id)}
                  disabled={loadingPreviewId === exam.id}
                  title="Xem trước & làm thử bài thi"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 active:scale-95 transition disabled:opacity-50"
                >
                  {loadingPreviewId === exam.id ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <PlayCircleIcon className="w-3.5 h-3.5" />
                  )}
                  Xem trước
                </button>

                {/* Đề đã phát hành thì khóa chỉnh sửa — chỉ cho xem trước */}
                {exam.badge !== 'PUBLISHED' && (
                  <button
                    onClick={() => navigate(`/admin/exams/${exam.id}`)}
                    title="Soạn nội dung bài thi"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold active:scale-95 transition"
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5" />
                    Soạn nội dung
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ExamFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateExam}
      />

      {previewExam && (
        <ExamPreviewModal exam={previewExam} onClose={() => setPreviewExam(null)} />
      )}
    </div>
  );
};
