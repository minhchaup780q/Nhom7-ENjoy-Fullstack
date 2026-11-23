import React from 'react';
import { ExclamationTriangleIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { ExamDetail } from '../types';

interface Props {
  exam: ExamDetail;
  onConfirm: () => void;
}

export const TransitionModal: React.FC<Props> = ({ exam, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-6 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        {/* Nội dung cảnh báo */}
        <div className="text-center">
          <h2 className="text-xl font-display font-extrabold text-text-main mb-3">
            THÔNG BÁO
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Bạn <strong className="text-text-main">không thể quay lại</strong> và chỉnh sửa bài làm phần Nghe.
            Bạn có chắc chắn đã kiểm tra lại và hoàn thiện bài thi chưa?
          </p>
        </div>

        {/* Thông tin phần tiếp theo */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
            Phần thi tiếp theo
          </p>
          <p className="text-lg font-display font-extrabold text-text-main mb-3">
            READING &amp; WRITING
          </p>
          <div className="flex gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <BookOpenIcon className="w-4 h-4" />
              {exam.totalReadingQuestions} câu · tối đa {exam.totalReadingQuestions} điểm
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {exam.readingDuration} phút
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-primary text-white font-bold text-base rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
        >
          LÀM TIẾP →
        </button>
      </div>
    </div>
  );
};
