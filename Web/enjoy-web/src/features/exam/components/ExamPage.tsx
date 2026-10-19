import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../services/examApi';
import { useExamStore } from '../store/useExamStore';
import { ExamTakingPage } from './ExamTakingPage';
import { ExamResultPage } from './ExamResultPage';
import type { ExamSummary } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { phase, currentExam, setExam, setPhase, reset } = useExamStore();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExamId, setLoadingExamId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const { user } = useAuthStore();

  // Lấy danh sách đề thi
  useEffect(() => {
    examApi
      .getAllExams(user?.id)
      .then(setExams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Đồng bộ URL và state
  useEffect(() => {
    if (examId) {
      if (!currentExam && phase === 'LIST') {
        const id = parseInt(examId, 10);
        if (!isNaN(id)) handleSelectExam(id);
      }
    } else {
      if (currentExam || phase !== 'LIST') {
        reset();
      }
    }
  }, [examId, currentExam, phase, reset]);

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
      <div className="flex items-center gap-2 mb-8 flex-wrap">
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
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => handleSelectExam(exam.id)}
              className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-md hover:border-[#cbd5e1] transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                exam.isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-[#e2e8f0]'
              }`}
            >
              <div className="flex flex-col gap-3">
                {/* Top Badges */}
                <div className="flex items-center justify-between">
                  {getExamTypeBadge(exam.examType)}
                  <span className="px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#f1f5f9] text-[#64748b]">
                    {exam.level || 'Pre-A1'}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-1">
                  <h2 className="text-[17px] font-display font-bold text-[#0f172a] group-hover:text-[#0284c7] transition-colors leading-snug">
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
                ) : (
                  <span className="material-symbols-outlined text-[20px] text-slate-300 group-hover:text-[#0284c7] group-hover:translate-x-0.5 transition-all">
                    arrow_forward
                  </span>
                )}
              </div>
            </div>
          ))}

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
