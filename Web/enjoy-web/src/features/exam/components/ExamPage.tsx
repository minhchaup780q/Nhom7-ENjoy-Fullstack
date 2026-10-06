import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AcademicCapIcon, ClockIcon, SpeakerWaveIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { examApi } from '../services/examApi';
import { useExamStore } from '../store/useExamStore';
import { ExamTakingPage } from './ExamTakingPage';
import { ExamResultPage } from './ExamResultPage';
import type { ExamSummary } from '../types';

export const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { phase, currentExam, setExam, setPhase, reset } = useExamStore();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExamId, setLoadingExamId] = useState<number | null>(null);

  // Lấy danh sách
  useEffect(() => {
    examApi.getAllExams()
      .then(setExams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Nếu url có id, tự động fetch chi tiết đề
  useEffect(() => {
    if (examId && !currentExam && phase === 'LIST') {
      const id = parseInt(examId, 10);
      if (!isNaN(id)) handleSelectExam(id);
    }
  }, [examId, currentExam, phase]);

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
      case 'CAMBRIDGE': return 'bg-blue-100 text-blue-700';
      case 'COLLINS': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => handleSelectExam(exam.id)}
              disabled={loadingExamId === exam.id}
              className="group bg-white border border-border rounded-2xl p-5 text-left hover:shadow-lg hover:border-primary/40 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-wait"
            >
              {/* Badge loại đề thi */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${examTypeColor(exam.examType)}`}>
                  {examTypeLabel(exam.examType)}
                </span>
                <span className="text-xs text-text-muted font-medium bg-surface rounded-full px-2.5 py-1">
                  {exam.level}
                </span>
              </div>

              {/* Tên đề thi */}
              <h2 className="text-base font-display font-bold text-text-main mb-1.5 group-hover:text-primary transition-colors">
                {exam.title}
              </h2>
              <p className="text-xs text-text-muted line-clamp-2 mb-4">
                {exam.description}
              </p>

              {/* Thông số */}
              <div className="flex gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <SpeakerWaveIcon className="w-4 h-4" />
                  Nghe: {exam.totalListeningQuestions} câu · {exam.listeningDuration} phút
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4" />
                  Đọc: {exam.totalReadingQuestions} câu · {exam.readingDuration} phút
                </span>
              </div>

              {/* Loading indicator */}
              {loadingExamId === exam.id && (
                <div className="mt-3 flex items-center gap-2 text-primary text-xs font-semibold">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Đang tải đề thi...
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Intro Screen ───────────────────────────────────────────────
const ExamIntroPage: React.FC = () => {
  const { currentExam, setPhase, setTimeLeft, reset } = useExamStore();
  if (!currentExam) return null;

  const handleStart = () => {
    setTimeLeft(currentExam.listeningDuration * 60);
    setPhase('LISTENING');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
        <AcademicCapIcon className="w-10 h-10 text-primary" />
      </div>

      <div>
        <h1 className="text-2xl font-display font-extrabold text-text-main mb-2">
          {currentExam.title}
        </h1>
        <p className="text-sm text-text-muted">{currentExam.description}</p>
      </div>

      <div className="w-full bg-surface rounded-2xl p-4 text-sm grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white rounded-xl border border-border">
          <SpeakerWaveIcon className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="font-bold text-text-main">Phần Nghe</p>
          <p className="text-text-muted">{currentExam.totalListeningQuestions} câu · {currentExam.listeningDuration} phút</p>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border border-border">
          <BookOpenIcon className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
          <p className="font-bold text-text-main">Phần Đọc &amp; Viết</p>
          <p className="text-text-muted">{currentExam.totalReadingQuestions} câu · {currentExam.readingDuration} phút</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left flex gap-2">
        <span className="text-lg mt-0.5">⚠️</span>
        <p>Sau khi hoàn thành phần Nghe, bạn <strong>không thể quay lại</strong> để chỉnh sửa. Hãy kiểm tra kỹ trước khi chuyển sang phần Đọc &amp; Viết.</p>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => {
            reset();
            window.history.replaceState(null, '', '/exams');
          }}
          className="flex-1 py-3 rounded-xl font-semibold border border-border text-text-muted hover:bg-surface transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={handleStart}
          className="flex-1 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/30"
        >
          Bắt đầu thi
        </button>
      </div>
    </div>
  );
};
