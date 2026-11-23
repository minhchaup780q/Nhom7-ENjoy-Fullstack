import React, { useState } from 'react';
import {
  XMarkIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import type { AdminExamDetailResponse } from '../api/adminExamApi';
import type { PartAnswer } from '../../exam/types';
import {
  scoreListeningPart,
  scoreReadingPart,
  type PartScoreResult,
} from '../utils/examPreviewScoring';

import { ListeningPart1 } from '../../exam/components/listening/ListeningPart1';
import { ListeningPart2 } from '../../exam/components/listening/ListeningPart2';
import { ListeningPart3 } from '../../exam/components/listening/ListeningPart3';
import { ListeningPart4 } from '../../exam/components/listening/ListeningPart4';
import { ReadingPart1 } from '../../exam/components/reading/ReadingPart1';
import { ReadingPart2 } from '../../exam/components/reading/ReadingPart2';
import { ReadingPart3 } from '../../exam/components/reading/ReadingPart3';
import { ReadingPart4 } from '../../exam/components/reading/ReadingPart4';
import { ReadingPart5 } from '../../exam/components/reading/ReadingPart5';

interface ExamPreviewModalProps {
  exam: AdminExamDetailResponse;
  onClose: () => void;
}

type Section = 'listening' | 'reading';

interface PreviewPartDef {
  id: string;
  section: Section;
  partKey: string;
  label: string;
}

const PREVIEW_PARTS: PreviewPartDef[] = [
  { id: 'L1', section: 'listening', partKey: 'part1', label: 'Nghe — Part 1' },
  { id: 'L2', section: 'listening', partKey: 'part2', label: 'Nghe — Part 2' },
  { id: 'L3', section: 'listening', partKey: 'part3', label: 'Nghe — Part 3' },
  { id: 'L4', section: 'listening', partKey: 'part4', label: 'Nghe — Part 4' },
  { id: 'R1', section: 'reading', partKey: 'part1', label: 'Đọc — Part 1' },
  { id: 'R2', section: 'reading', partKey: 'part2', label: 'Đọc — Part 2' },
  { id: 'R3', section: 'reading', partKey: 'part3', label: 'Đọc — Part 3' },
  { id: 'R4', section: 'reading', partKey: 'part4', label: 'Đọc — Part 4' },
  { id: 'R5', section: 'reading', partKey: 'part5', label: 'Đọc — Part 5' },
];

const hasData = (d: any) =>
  d !== null && d !== undefined && (Array.isArray(d) ? d.length > 0 : Object.keys(d).length > 0);

export const ExamPreviewModal: React.FC<ExamPreviewModalProps> = ({ exam, onClose }) => {
  const [activeId, setActiveId] = useState('L1');
  // Đáp án admin làm thử, lưu riêng theo từng phần (không gửi lên server)
  const [answersByPart, setAnswersByPart] = useState<Record<string, PartAnswer[]>>({});
  const [resultByPart, setResultByPart] = useState<Record<string, PartScoreResult>>({});

  const active = PREVIEW_PARTS.find((p) => p.id === activeId) || PREVIEW_PARTS[0];
  const payload = active.section === 'listening' ? exam.listeningPayload : exam.readingPayload;
  const data = (payload || {})[active.partKey];
  const answers = answersByPart[active.id] || [];
  const result = resultByPart[active.id];

  const setAnswers = (next: PartAnswer[]) =>
    setAnswersByPart((prev) => ({ ...prev, [active.id]: next }));

  const handleCheck = () => {
    const scored = active.section === 'listening'
      ? scoreListeningPart(active.partKey, data, answers)
      : scoreReadingPart(active.partKey, data, answers);
    setResultByPart((prev) => ({ ...prev, [active.id]: scored }));
  };

  const handleReset = () => {
    setAnswersByPart((prev) => ({ ...prev, [active.id]: [] }));
    setResultByPart((prev) => {
      const next = { ...prev };
      delete next[active.id];
      return next;
    });
  };

  const renderPart = () => {
    if (!hasData(data)) {
      return (
        <div className="p-12 text-center space-y-3">
          <ClipboardDocumentCheckIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Phần này chưa có dữ liệu</h4>
          <p className="text-xs text-slate-500">
            Hãy quay lại màn hình soạn thảo và điền nội dung cho {active.label}.
          </p>
        </div>
      );
    }

    // key theo phần để state nội bộ của component thi được khởi tạo lại khi chuyển phần
    const key = `${active.id}-${answers.length === 0 ? 'fresh' : 'filled'}`;
    const common = { answers, onChange: setAnswers };

    if (active.section === 'listening') {
      switch (active.partKey) {
        case 'part1': return <ListeningPart1 key={key} data={data} {...common} />;
        case 'part2': return <ListeningPart2 key={key} data={data} {...common} />;
        case 'part3': return <ListeningPart3 key={key} data={data} {...common} />;
        case 'part4': return <ListeningPart4 key={key} data={data} {...common} />;
      }
    } else {
      switch (active.partKey) {
        case 'part1': return <ReadingPart1 key={key} data={data} {...common} />;
        case 'part2': return <ReadingPart2 key={key} data={data} {...common} />;
        case 'part3': return <ReadingPart3 key={key} data={data} {...common} />;
        case 'part4': return <ReadingPart4 key={key} data={data} {...common} />;
        case 'part5': return <ReadingPart5 key={key} data={data} {...common} />;
      }
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <PlayCircleIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-800 truncate">
                Xem trước & làm thử: {exam.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chế độ thử nghiệm — không tính điểm, không lưu lịch sử làm bài.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition shrink-0"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh chọn phần */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {PREVIEW_PARTS.map((p) => {
            const partPayload = p.section === 'listening' ? exam.listeningPayload : exam.readingPayload;
            const filled = hasData((partPayload || {})[p.partKey]);
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                  p.id === activeId
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {p.section === 'listening' ? (
                  <SpeakerWaveIcon className="w-3.5 h-3.5" />
                ) : (
                  <BookOpenIcon className="w-3.5 h-3.5" />
                )}
                {p.label}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    filled ? 'bg-emerald-400' : p.id === activeId ? 'bg-white/40' : 'bg-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Nội dung phần thi */}
        <div className="flex-1 overflow-y-auto p-5">{renderPart()}</div>

        {/* Kết quả chấm tại chỗ */}
        {result && (
          <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 max-h-[32vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-bold text-slate-800">Kết quả thử</h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  result.correct === result.total
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                Đúng {result.correct}/{result.total}
              </span>
              {result.correct < result.total && (
                <span className="text-[11px] font-semibold text-slate-500">
                  Kiểm tra lại đáp án bạn đã nhập khi soạn đề nếu kết quả không như mong đợi.
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {result.rows.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs ${
                    row.isCorrect
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {row.isCorrect ? (
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span className="font-bold text-slate-700 shrink-0 w-32 truncate">{row.label}</span>
                  <span className="text-slate-500">
                    Đáp án đúng: <span className="font-bold text-slate-800">{row.correctAnswer || '—'}</span>
                  </span>
                  <span className="text-slate-500">
                    Bạn chọn: <span className="font-bold text-slate-800">{row.userAnswer || '(chưa trả lời)'}</span>
                  </span>
                </div>
              ))}
              {result.rows.length === 0 && (
                <p className="text-xs text-slate-500 font-medium">Phần này chưa có câu hỏi tính điểm.</p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] font-semibold text-slate-400">
            Bạn có thể nhảy tự do giữa các phần để kiểm tra nội dung đã soạn.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
            >
              <ArrowPathIcon className="w-4 h-4" /> Làm lại phần này
            </button>
            <button
              onClick={handleCheck}
              disabled={!hasData(data)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" /> Kiểm tra phần này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
