import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../services/examApi';
import { vocabStatsApi } from '../services/vocabStatsApi';
import { useExamStore } from '../store/useExamStore';
import { ExamTakingPage } from './ExamTakingPage';
import { ExamResultPage } from './ExamResultPage';
import type { ExamSummary, VocabStatsResponse } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { phase, currentExam, setExam, setPhase, reset } = useExamStore();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [vocabStats, setVocabStats] = useState<VocabStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingExamId, setLoadingExamId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [selectedLockedExam, setSelectedLockedExam] = useState<ExamSummary | null>(null);

  const { user } = useAuthStore();

  // Số lượng từ lỗi sai chưa luyện tập xong
  const pendingWeakCount = vocabStats?.topics?.reduce((acc, t) => acc + (t.weakCount || 0), 0) ?? 0;

  const isExamLocked = (_exam?: ExamSummary) => {
    // Khi còn từ sai chưa luyện tập xong -> khóa TẤT CẢ các bài thi để tránh loãng biểu đồ
    return pendingWeakCount > 0;
  };

  // Lấy danh sách đề thi và thống kê lỗi sai
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    Promise.all([
      examApi.getAllExams(user.id),
      vocabStatsApi.getVocabStats(user.id).catch(() => null),
    ])
      .then(([examsRes, statsRes]) => {
        setExams(examsRes);
        if (statsRes) setVocabStats(statsRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Đồng bộ URL và state
  useEffect(() => {
    if (examId && exams.length > 0) {
      if (!currentExam && phase === 'LIST') {
        const id = parseInt(examId, 10);
        if (!isNaN(id)) {
          const target = exams.find((e) => e.id === id);
          if (target && isExamLocked(target)) {
            setSelectedLockedExam(target);
            setLockedModalOpen(true);
            navigate('/exams', { replace: true });
            return;
          }
          handleSelectExam(id);
        }
      }
    } else if (!examId) {
      if (currentExam || phase !== 'LIST') {
        reset();
      }
    }
  }, [examId, currentExam, phase, reset, exams, pendingWeakCount]);

  // Routing nội bộ theo phase
  if (phase === 'LISTENING' || phase === 'TRANSITION' || phase === 'READING') {
    return <ExamTakingPage />;
  }
  if (phase === 'RESULT') {
    return <ExamResultPage />;
  }
  if (phase === 'INTRO' && currentExam) {
    return <ExamIntroPage />;
  }

  const handleSelectExam = async (examId: number) => {
    const target = exams.find((e) => e.id === examId);
    if (target && isExamLocked(target)) {
      setSelectedLockedExam(target);
      setLockedModalOpen(true);
      return;
    }

    setLoadingExamId(examId);
    try {
      const detail = await examApi.getExamById(examId);
      setExam(detail);
      setPhase('INTRO');
      navigate(`/exams/${examId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingExamId(null);
    }
  };

  const getExamTypeBadge = (type: string) => {
    switch (type) {
      case 'COLLINS':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-[#ccfbf1] text-[#0f766e]">
            Collins
          </span>
        );
      case 'CAMBRIDGE':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-[#e0f2fe] text-[#0369a1]">
            Cambridge
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-slate-100 text-slate-700">
            {type}
          </span>
        );
    }
  };

  const filteredExams = exams.filter(
    (exam) => filterType === 'ALL' || exam.examType === filterType
  );

  return (
    <div className="flex-1 px-4 sm:px-8 py-8 max-w-6xl w-full mx-auto select-none">
      {/* Page Title & Header (Matching IMAGE_23) */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444] shrink-0 shadow-sm border border-[#fecaca]/60">
          <span className="material-symbols-outlined text-[28px] text-[#f43f5e]">
            school
          </span>
        </div>
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-[#0f172a] tracking-tight">
            Khu vực Đề Thi
          </h1>
          <p className="text-[14px] text-[#64748b] leading-relaxed max-w-3xl">
            Luyện thi chứng chỉ tiếng Anh Cambridge và Collins. Mỗi bài thi gồm 2 phần: Nghe và Đọc &amp; Viết.
          </p>
        </div>
      </div>

      {/* Filter Tabs (Matching IMAGE_23) */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'CAMBRIDGE', label: 'Cambridge' },
          { id: 'COLLINS', label: 'Collins' },
          { id: 'CUSTOM', label: 'Custom' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-1.5 rounded-full text-[13px] transition-all cursor-pointer ${
              filterType === tab.id
                ? 'font-semibold bg-[#0284c7] text-white shadow-sm hover:bg-[#0284c7]/90'
                : 'font-medium bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banner thông báo bài thi đang tạm khóa nếu còn từ yếu từ bài thi trước */}
      {pendingWeakCount > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">lock_clock</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] uppercase tracking-wider">
                  Yêu cầu mở khóa
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Còn {pendingWeakCount} từ vựng lỗi sai cần hoàn thành
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tất cả bài thi đang tạm khóa. Vui lòng hoàn thành bài <strong>Luyện tập cá nhân hoá</strong> để mở khóa bài thi và tránh làm loãng biểu đồ!
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/practice/personalization?topic=ALL')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Luyện tập ngay</span>
          </button>
        </div>
      )}

      {/* Danh sách đề thi */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs">
          <span className="material-symbols-outlined text-[32px] animate-spin text-[#0284c7]">
            progress_activity
          </span>
          <span>Đang tải danh sách đề thi...</span>
        </div>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <span className="material-symbols-outlined text-slate-300 text-[48px]">
            menu_book
          </span>
          <p className="text-slate-500 font-semibold text-sm">
            Chưa có đề thi nào trong danh sách.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {filteredExams.map((exam) => {
            const locked = isExamLocked(exam);
            return (
              <div
                key={exam.id}
                onClick={() => handleSelectExam(exam.id)}
                className={`rounded-2xl border p-6 shadow-xs transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                  locked
                    ? 'bg-slate-50/70 border-dashed border-slate-300 hover:border-amber-400'
                    : exam.isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20 hover:shadow-md'
                    : 'bg-white border-[#e2e8f0] hover:shadow-md hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    {getExamTypeBadge(exam.examType)}
                    {locked ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Khóa
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#f1f5f9] text-[#64748b]">
                        {exam.level || 'Pre-A1'}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="mt-1">
                    <h2 className={`text-[17px] font-display font-bold leading-snug transition-colors ${
                      locked ? 'text-slate-600' : 'text-[#0f172a] group-hover:text-[#0284c7]'
                    }`}>
                      {exam.title}
                    </h2>
                    <p className="text-[13px] text-[#64748b] mt-1 leading-relaxed line-clamp-2">
                      {exam.description || `Bộ đề thi chuẩn Cambridge/Collins xuất bản`}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Badges */}
                <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[12px] text-[#475569] font-medium">
                      <span className="material-symbols-outlined text-[15px] text-sky-600">headphones</span> Nghe: {exam.totalListeningQuestions} câu
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[12px] text-[#475569] font-medium">
                      <span className="material-symbols-outlined text-[15px] text-sky-600">menu_book</span> Đọc: {exam.totalReadingQuestions} câu
                    </span>
                  </div>

                  {loadingExamId === exam.id ? (
                    <span className="material-symbols-outlined text-[20px] text-[#0284c7] animate-spin">
                      progress_activity
                    </span>
                  ) : locked ? (
                    <span className="material-symbols-outlined text-[20px] text-amber-500 group-hover:scale-110 transition-transform">
                      lock
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px] text-slate-300 group-hover:text-[#0284c7] group-hover:translate-x-0.5 transition-all">
                      arrow_forward
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredExams.length === 0 && (
            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="material-symbols-outlined text-slate-300 text-[40px]">
                filter_alt_off
              </span>
              <p className="text-slate-500 font-medium text-sm">
                Không tìm thấy đề thi nào thuộc danh mục này.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal thông báo bài thi bị khóa */}
      {lockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[32px]">lock_clock</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">
                Bài thi tạm thời bị khóa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Bạn còn <strong>{pendingWeakCount} từ vựng</strong> lỗi sai cần hoàn thiện từ bài thi trước. Để tránh làm loãng biểu đồ tăng trưởng, bạn cần hoàn thành bài luyện tập cá nhân hoá để mở khóa bài thi!
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl w-full text-left text-xs text-slate-500">
              <span className="font-bold text-slate-700">Đề thi:</span> {selectedLockedExam?.title || 'Đề thi tiếp theo'}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
              <button
                onClick={() => {
                  setLockedModalOpen(false);
                  navigate('/practice/personalization?topic=ALL');
                }}
                className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Luyện tập cá nhân hoá ngay</span>
              </button>
              <button
                onClick={() => setLockedModalOpen(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Intro Screen ───────────────────────────────────────────────
const ExamIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentExam, setPhase, setTimeLeft } = useExamStore();
  if (!currentExam) return null;

  const handleStart = () => {
    setTimeLeft(currentExam.listeningDuration * 60);
    setPhase('LISTENING');
  };

  const handleBack = () => {
    navigate('/exams');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 max-w-lg mx-auto text-center gap-6 select-none">
      <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-200 flex items-center justify-center shadow-md shadow-sky-500/10">
        <span className="material-symbols-outlined text-[40px] text-sky-600">
          school
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0f172a] mb-2 tracking-tight">
          {currentExam.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed px-2">
          {currentExam.description}
        </p>
      </div>

      <div className="w-full bg-slate-50 rounded-3xl p-5 text-sm grid grid-cols-2 gap-4 border border-slate-200/80 shadow-xs">
        <div className="text-center p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-[24px]">headphones</span>
          </div>
          <p className="font-bold text-slate-800 text-sm mb-0.5">Phần Nghe</p>
          <p className="text-slate-500 text-xs font-medium">
            {currentExam.totalListeningQuestions} câu · {currentExam.listeningDuration} phút
          </p>
        </div>
        <div className="text-center p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-[24px]">menu_book</span>
          </div>
          <p className="font-bold text-slate-800 text-sm mb-0.5">Phần Đọc &amp; Viết</p>
          <p className="text-slate-500 text-xs font-medium">
            {currentExam.totalReadingQuestions} câu · {currentExam.readingDuration} phút
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 text-left flex gap-3 shadow-xs">
        <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">
          warning
        </span>
        <p className="font-medium leading-relaxed">
          Sau khi hoàn thành phần Nghe, bạn <strong className="text-amber-950 font-bold">không thể quay lại</strong> để chỉnh sửa. Hãy kiểm tra kỹ trước khi chuyển sang phần Đọc &amp; Viết.
        </p>
      </div>

      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={handleBack}
          className="flex-1 py-3 rounded-xl font-bold text-xs uppercase border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        >
          Quay lại
        </button>
        <button
          onClick={handleStart}
          className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Bắt đầu thi</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
