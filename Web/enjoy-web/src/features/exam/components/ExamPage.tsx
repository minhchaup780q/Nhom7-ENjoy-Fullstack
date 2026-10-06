import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AcademicCapIcon, ClockIcon, SpeakerWaveIcon, BookOpenIcon } from '@heroicons/react/24/outline';
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

  // Lấy danh sách
  useEffect(() => {
    examApi.getAllExams(user?.id)
      .then(setExams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Đồng bộ URL và state
  useEffect(() => {
    if (examId) {
      // Nếu url có id, tự động fetch chi tiết đề
      if (!currentExam && phase === 'LIST') {
        const id = parseInt(examId, 10);
        if (!isNaN(id)) handleSelectExam(id);
      }
    } else {
      // Nếu không có id (đang ở danh sách), reset lại state nếu cần
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

  const examTypeLabel = (type: string) => {
    switch (type) {
      case 'CAMBRIDGE': return 'Cambridge';
      case 'COLLINS': return 'Collins';
      default: return type;
    }
  };

  const examTypeColor = (type: string) => {
    switch (type) {
      case 'CAMBRIDGE': return 'bg-blue-100 text-blue-700 border-2 border-blue-200';
      case 'COLLINS': return 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-2 border-gray-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-text-main mb-2 flex items-center gap-3">
          <AcademicCapIcon className="w-8 h-8 text-primary" />
          Khu vực Đề Thi
        </h1>
        <p className="text-text-muted text-sm">
          Luyện thi chứng chỉ tiếng Anh Cambridge và Collins. Mỗi bài thi gồm 2 phần: Nghe và Đọc &amp; Viết.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'CAMBRIDGE', label: 'Cambridge' },
          { id: 'COLLINS', label: 'Collins' },
          { id: 'CUSTOM', label: 'Custom' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              filterType === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white border-2 border-border text-text-muted hover:border-primary/50 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đề thi */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : exams.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <AcademicCapIcon className="w-16 h-16 text-text-muted/40" />
          <p className="text-text-muted font-semibold">Chưa có đề thi nào được thêm vào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams
            .filter((exam) => filterType === 'ALL' || exam.examType === filterType)
            .map((exam) => (
            <button
              key={exam.id}
              onClick={() => handleSelectExam(exam.id)}
              disabled={loadingExamId === exam.id}
              className={`group border-2 rounded-3xl p-6 text-left shadow-[0_8px_30px_rgb(99,102,241,0.06)] hover:shadow-[0_8px_30px_rgb(244,114,182,0.15)] hover:border-pink-200 hover:bg-pink-50 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait relative overflow-hidden ${
                exam.isCompleted 
                  ? 'bg-emerald-50 border-emerald-500' 
                  : 'bg-white border-indigo-50'
              }`}
            >
              {/* Badge loại đề thi */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${examTypeColor(exam.examType)}`}>
                  {examTypeLabel(exam.examType)}
                </span>
                <span className="text-xs text-text-muted font-medium bg-surface rounded-full px-3 py-1.5">
                  {exam.level}
                </span>
              </div>

              {/* Tên đề thi */}
              <h2 className="text-lg font-display font-bold text-text-main mb-2 transition-colors">
                {exam.title}
              </h2>
              <p className="text-sm text-text-muted line-clamp-2 mb-5">
                {exam.description}
              </p>

              {/* Thông số */}
              <div className="flex gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border-2 border-blue-200 px-2.5 py-1.5 rounded-xl">
                  <SpeakerWaveIcon className="w-4 h-4" />
                  Nghe: {exam.totalListeningQuestions} câu
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-2 border-emerald-200 px-2.5 py-1.5 rounded-xl">
                  <BookOpenIcon className="w-4 h-4" />
                  Đọc: {exam.totalReadingQuestions} câu
                </span>
              </div>

              {/* Loading indicator */}
              {loadingExamId === exam.id && (
                <div className="mt-4 flex items-center gap-2 text-primary text-xs font-semibold">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Đang tải đề thi...
                </div>
              )}
            </button>
          ))}
          
          {exams.filter((exam) => filterType === 'ALL' || exam.examType === filterType).length === 0 && (
            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-10 gap-3 text-center">
              <AcademicCapIcon className="w-12 h-12 text-text-muted/30" />
              <p className="text-text-muted font-medium">Không tìm thấy đề thi nào thuộc danh mục này.</p>
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
  const { currentExam, setPhase, setTimeLeft, reset } = useExamStore();
  if (!currentExam) return null;

  const handleStart = () => {
    setTimeLeft(currentExam.listeningDuration * 60);
    setPhase('LISTENING');
  };

  const handleBack = () => {
    navigate('/exams');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center gap-6">
      <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center shadow-[0_8px_30px_rgb(59,130,246,0.15)]">
        <AcademicCapIcon className="w-12 h-12 text-blue-500" />
      </div>

      <div>
        <h1 className="text-3xl font-display font-extrabold text-text-main mb-3">
          {currentExam.title}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed px-4">{currentExam.description}</p>
      </div>

      <div className="w-full bg-[#f8fafc] rounded-3xl p-5 text-sm grid grid-cols-2 gap-4 border-2 border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center p-4 bg-white rounded-2xl border-2 border-blue-50 shadow-sm">
          <SpeakerWaveIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="font-bold text-gray-800 text-base mb-1">Phần Nghe</p>
          <p className="text-gray-500 font-medium">{currentExam.totalListeningQuestions} câu · {currentExam.listeningDuration} phút</p>
        </div>
        <div className="text-center p-4 bg-white rounded-2xl border-2 border-emerald-50 shadow-sm">
          <BookOpenIcon className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-gray-800 text-base mb-1">Phần Đọc &amp; Viết</p>
          <p className="text-gray-500 font-medium">{currentExam.totalReadingQuestions} câu · {currentExam.readingDuration} phút</p>
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 text-sm text-amber-800 text-left flex gap-3 shadow-sm">
        <span className="text-xl mt-0.5">⚠️</span>
        <p className="font-medium">Sau khi hoàn thành phần Nghe, bạn <strong className="text-amber-900">không thể quay lại</strong> để chỉnh sửa. Hãy kiểm tra kỹ trước khi chuyển sang phần Đọc &amp; Viết.</p>
      </div>

      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={handleBack}
          className="flex-1 py-3.5 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
        >
          Quay lại
        </button>
        <button
          onClick={handleStart}
          className="flex-1 py-3.5 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 shadow-[0_4px_14px_0_rgb(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 transition-all active:scale-[0.98]"
        >
          Bắt đầu thi
        </button>
      </div>
    </div>
  );
};
