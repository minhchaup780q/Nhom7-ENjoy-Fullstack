import React from 'react';
import { useExamStore } from '../store/useExamStore';
import { ShieldCheckIcon, ArrowPathIcon, BookmarkIcon } from '@heroicons/react/24/solid';
import { SpeakerWaveIcon, BookOpenIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Shield: React.FC<{ filled: boolean }> = ({ filled }) => (
  <ShieldCheckIcon className={`w-8 h-8 ${filled ? 'text-primary' : 'text-gray-200'}`} />
);

const ShieldRow: React.FC<{ count: number; max?: number }> = ({ count, max = 5 }) => (
  <div className="flex gap-1.5">
    {Array.from({ length: max }).map((_, i) => (
      <Shield key={i} filled={i < count} />
    ))}
  </div>
);

export const ExamResultPage: React.FC = () => {
  const { result, currentExam, reset } = useExamStore();
  if (!result) return null;

  const pct = Math.round((result.totalCorrect / result.totalQuestions) * 100);

  const getEmoji = () => {
    if (pct >= 90) return '🏆';
    if (pct >= 70) return '🎉';
    if (pct >= 50) return '👍';
    return '💪';
  };

  const getMessage = () => {
    if (pct >= 90) return 'Xuất sắc! Bạn đã làm rất tốt!';
    if (pct >= 70) return 'Tốt lắm! Kết quả ấn tượng!';
    if (pct >= 50) return 'Cố gắng tốt! Tiếp tục luyện tập nhé!';
    return 'Đừng nản lòng! Luyện tập thêm là bạn sẽ tiến bộ!';
  };

  const PartRow: React.FC<{ label: string; correct: number; total: number }> = ({ label, correct, total }) => (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={`font-bold ${correct === total ? 'text-[#58cc02]' : 'text-text-main'}`}>
        {correct}/{total}
      </span>
    </div>
  );

  const wrongVocabByTopic = result.wrongVocabByTopic;
  const hasWrongVocab = wrongVocabByTopic && Object.keys(wrongVocabByTopic).length > 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 max-w-2xl mx-auto w-full gap-6">
      {/* Hero */}
      <div className="text-center">
        <div className="text-6xl mb-3">{getEmoji()}</div>
        <h1 className="text-2xl font-display font-extrabold text-text-main mb-1">Kết Quả Bài Thi</h1>
        <p className="text-sm text-text-muted">{currentExam?.title}</p>
      </div>

      {/* Total Score */}
      <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-6 text-center w-full">
        <p className="text-sm font-bold text-primary mb-1">Tổng điểm</p>
        <p className="text-5xl font-display font-extrabold text-primary">
          {result.totalCorrect}<span className="text-2xl text-primary/60">/{result.totalQuestions}</span>
        </p>
        <p className="text-sm text-primary/70 mt-1">{pct}% · {getMessage()}</p>
      </div>

      {/* Shields */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Listening */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SpeakerWaveIcon className="w-5 h-5 text-primary" />
            <p className="font-bold text-sm text-text-main">Phần Nghe</p>
          </div>
          <p className="text-2xl font-display font-extrabold text-text-main mb-2">
            {result.listeningCorrect}<span className="text-base text-text-muted">/{result.listeningTotal}</span>
          </p>
          <ShieldRow count={result.listeningShields} />
          <p className="text-xs text-text-muted mt-1.5">{result.listeningShields}/5 khiên</p>
        </div>

        {/* Reading */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpenIcon className="w-5 h-5 text-emerald-600" />
            <p className="font-bold text-sm text-text-main">Đọc &amp; Viết</p>
          </div>
          <p className="text-2xl font-display font-extrabold text-text-main mb-2">
            {result.readingCorrect}<span className="text-base text-text-muted">/{result.readingTotal}</span>
          </p>
          <ShieldRow count={result.readingShields} />
          <p className="text-xs text-text-muted mt-1.5">{result.readingShields}/5 khiên</p>
        </div>
      </div>

      {/* Chi tiết từng Part */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Listening parts */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <p className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
            <SpeakerWaveIcon className="w-4 h-4 text-primary" /> Chi tiết Nghe
          </p>
          <PartRow label="Part 1" correct={result.listeningPartScores.part1Correct} total={result.listeningPartScores.part1Total} />
          <PartRow label="Part 2" correct={result.listeningPartScores.part2Correct} total={result.listeningPartScores.part2Total} />
          <PartRow label="Part 3" correct={result.listeningPartScores.part3Correct} total={result.listeningPartScores.part3Total} />
          <PartRow label="Part 4" correct={result.listeningPartScores.part4Correct} total={result.listeningPartScores.part4Total} />
        </div>

        {/* Reading parts */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <p className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4 text-emerald-600" /> Chi tiết Đọc
          </p>
          <PartRow label="Part 1" correct={result.readingPartScores.part1Correct} total={result.readingPartScores.part1Total} />
          <PartRow label="Part 2" correct={result.readingPartScores.part2Correct} total={result.readingPartScores.part2Total} />
          <PartRow label="Part 3" correct={result.readingPartScores.part3Correct} total={result.readingPartScores.part3Total} />
          <PartRow label="Part 4" correct={result.readingPartScores.part4Correct} total={result.readingPartScores.part4Total} />
          <PartRow label="Part 5" correct={result.readingPartScores.part5Correct || 0} total={result.readingPartScores.part5Total || 0} />
        </div>
      </div>

      {/* Lỗi sai từ vựng */}
      {hasWrongVocab && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationCircleIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="font-bold text-sm text-amber-800">Từ vựng cần ôn lại</p>
          </div>
          <div className="flex flex-col gap-3">
            {Object.entries(wrongVocabByTopic!).map(([topic, words]) => (
              <div key={topic} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">{topic}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {words.map((word, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-amber-200 text-amber-800 text-xs font-semibold rounded-full shadow-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 mt-3 pl-1">
            💡 Xem chi tiết tiến trình ôn tập tại trang <strong>Thống kê</strong>.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 w-full mt-2">
        <button
          onClick={() => {
            reset();
            window.history.replaceState(null, '', '/exams');
          }}
          className="flex-1 py-4 rounded-2xl border-2 border-border text-text-main font-bold hover:bg-surface transition-colors flex items-center justify-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Xem đề thi khác
        </button>
      </div>
    </div>
  );
};
