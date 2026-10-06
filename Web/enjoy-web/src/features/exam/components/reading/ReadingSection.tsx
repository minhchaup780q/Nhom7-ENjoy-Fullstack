import React, { useState } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { ReadingPart1 } from './ReadingPart1';
import { ReadingPart2 } from './ReadingPart2';
import { ReadingPart3 } from './ReadingPart3';
import { ReadingPart4 } from './ReadingPart4';
import { ReadingPart5 } from './ReadingPart5';
import type { PartAnswer } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/solid';

interface Props {
  onSubmit: () => void;
  submitting: boolean;
}

const PARTS = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5'];

export const ReadingSection: React.FC<Props> = ({ onSubmit, submitting }) => {
  const { currentExam, userAnswers, setReadingAnswer } = useExamStore();
  const [currentPart, setCurrentPart] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  if (!currentExam) return null;
  const read = currentExam.readingPayload;

  const updateAnswers = (partKey: keyof typeof userAnswers.reading, answers: PartAnswer[]) => {
    setReadingAnswer(partKey, answers);
  };

  const handleNext = () => {
    if (currentPart < 4) setCurrentPart(currentPart + 1);
    else setShowSubmitConfirm(true);
  };

  const handlePrev = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-5xl mx-auto w-full px-4 pt-6 pb-6 flex-1">
        {/* Part Indicator */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-main">
            Phần {currentPart + 1} <span className="text-text-muted text-base font-medium">/ 5</span>
          </h2>
        </div>

        {/* Part Content */}
        <div>
        {currentPart === 0 && (
          <ReadingPart1
            data={read.part1}
            answers={userAnswers.reading.part1}
            onChange={(ans) => updateAnswers('part1', ans)}
          />
        )}
        {currentPart === 1 && (
          <ReadingPart2
            data={read.part2}
            answers={userAnswers.reading.part2}
            onChange={(ans) => updateAnswers('part2', ans)}
          />
        )}
        {currentPart === 2 && (
          <ReadingPart3
            data={read.part3}
            answers={userAnswers.reading.part3}
            onChange={(ans) => updateAnswers('part3', ans)}
          />
        )}
        {currentPart === 3 && (
          <ReadingPart4
            data={read.part4}
            answers={userAnswers.reading.part4}
            onChange={(ans) => updateAnswers('part4', ans)}
          />
        )}
        {currentPart === 4 && (
          <ReadingPart5
            data={read.part5}
            answers={userAnswers.reading.part5}
            onChange={(ans) => updateAnswers('part5', ans)}
          />
        )}
      </div>
      </div>

      {/* Nút điều hướng Trái - Phải */}
      <button
        onClick={handlePrev}
        disabled={currentPart === 0}
        className="fixed top-1/2 left-4 lg:left-[280px] -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-border-main text-text-muted hover:text-emerald-600 hover:border-emerald-600 shadow-lg transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeftIcon className="w-6 h-6 pr-0.5" />
      </button>

      <button
        onClick={() => {
          if (currentPart < 4) handleNext();
          else setShowSubmitConfirm(true);
        }}
        className="fixed top-1/2 right-4 lg:right-8 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 hover:bg-emerald-700 transition-all hover:scale-110"
        title={currentPart < 4 ? 'Part tiếp theo' : 'Nộp bài thi'}
      >
        {currentPart < 4 ? (
          <ChevronRightIcon className="w-6 h-6 pl-0.5" />
        ) : (
          <CheckIcon className="w-6 h-6" />
        )}
      </button>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col gap-5 animate-fade-in text-center">
            <div className="text-5xl">📝</div>
            <h2 className="text-xl font-display font-extrabold text-text-main">
              Nộp bài thi?
            </h2>
            <p className="text-sm text-text-muted">
              Bạn có chắc chắn muốn nộp bài thi? Sau khi nộp bạn sẽ không thể chỉnh sửa thêm.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-border text-text-muted font-semibold hover:bg-surface transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => { setShowSubmitConfirm(false); onSubmit(); }}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Đang nộp...' : 'Đồng ý nộp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
