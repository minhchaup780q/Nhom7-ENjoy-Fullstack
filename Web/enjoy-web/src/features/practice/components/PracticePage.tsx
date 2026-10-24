import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { VocabStatsResponse, TopicStat } from '../../exam/types';
import { VocabPracticeModal } from '../../stats/components/VocabPracticeModal';

// ──────────────────────────────────────────────
// Cấu trúc ngữ pháp mẫu
// ──────────────────────────────────────────────
const GRAMMAR_DATA = [
  { name: 'Have got', status: 'Mastered' as const },
  { name: 'To be', status: 'Mastered' as const },
  { name: 'There is / There are', status: 'Developing' as const },
  { name: 'Present simple', status: 'Weak' as const },
  { name: 'Can / Can\'t', status: 'Developing' as const },
];

export const PracticePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [vocabStats, setVocabStats] = useState<VocabStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<string | null>(null);

  const fetchStats = () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    vocabStatsApi
      .getVocabStats(user.id)
      .then(setVocabStats)
      .catch(() => setVocabStats({ noExamHistory: true, topics: [] }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const totalWeak = vocabStats?.topics.reduce((s, t) => s + t.weakCount, 0) ?? 0;
  const totalCorrect = vocabStats?.topics.reduce((s, t) => s + t.correctCount, 0) ?? 0;
  const grammarWeak = GRAMMAR_DATA.filter((g) => g.status !== 'Mastered').length;
  const grammarCorrect = GRAMMAR_DATA.filter((g) => g.status === 'Mastered').length;

  return (
    <div className="w-full flex-1 max-w-[1360px] mx-auto p-4 sm:p-8 flex flex-col gap-7 select-none">
      {/* 1. KNOWLEDGE MASTERY BANNER & LEGEND */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-sky-600 text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Knowledge mastery
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            So sánh bài kiểm tra đầu vào và bài thi thử gần nhất của bạn.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span>
              <strong className="font-semibold text-slate-800">Mastered:</strong> từ 75 điểm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
            <span>
              <strong className="font-semibold text-slate-800">Developing:</strong> cần cố thêm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
            <span>
              <strong className="font-semibold text-slate-800">Weak:</strong> cần cải thiện gấp
            </span>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN INTERACTIVE TABLE / CARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* COLUMN 1: TOPIC (TỪ VỰNG THEO CHỦ ĐỀ) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Card Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-[20px]">menu_book</span>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Topic ({vocabStats?.topics.length || 0} nội dung)
              </h3>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              Từ vựng theo chủ đề
            </span>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 text-xs">
              <span className="material-symbols-outlined text-[28px] animate-spin text-sky-600">
                progress_activity
              </span>
              <span>Đang tải dữ liệu tiến trình từ vựng...</span>
            </div>
          ) : vocabStats?.noExamHistory ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">assignment</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Chưa có dữ liệu bài thi
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Hãy làm bài kiểm tra hoặc bài thi thử để theo dõi độ thành thạo từ vựng theo chủ đề!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-5">Tên</th>
                    <th className="py-3 px-3 text-center">Cần cải thiện</th>
                    <th className="py-3 px-3 text-center">Đã cải thiện</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {vocabStats?.topics.map((topic: TopicStat) => (
                    <tr
                      key={topic.topicName}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {topic.topicName}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-rose-600">
                        {topic.weakCount > 0 ? topic.weakCount : '0'}
                      </td>
                      <td
                        className={`py-3.5 px-3 text-center font-medium ${
                          topic.correctCount > 0
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {topic.correctCount}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {topic.status === 'Mastered' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Mastered
                          </span>
                        ) : topic.status === 'Developing' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Developing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                            Weak
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {topic.status !== 'Mastered' ? (
                          <button
                            id={`practice-btn-${topic.topicName.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => setSelectedPracticeTopic(topic.topicName)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs active:scale-95 cursor-pointer"
                          >
                            Luyện tập
                          </button>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Cần cải thiện: {totalWeak} từ
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                Đã cải thiện: {totalCorrect} từ
              </span>
            </div>

            {totalWeak > 0 ? (
              <button
                id="practice-all-topics-btn"
                onClick={() => setSelectedPracticeTopic('Tất cả các chủ đề')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Luyện tập tất cả</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Luyện tập tất cả</span>
              </button>
            )}
          </div>
        </div>

        {/* COLUMN 2: GRAMMAR (CẤU TRÚC NGỮ PHÁP) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Card Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-[20px]">account_tree</span>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Grammar ({GRAMMAR_DATA.length} nội dung)
              </h3>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              Cấu trúc ngữ pháp
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-5">Tên</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {GRAMMAR_DATA.map((g) => (
                  <tr
                    key={g.name}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-800">
                      {g.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {g.status === 'Mastered' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Mastered
                        </span>
                      ) : g.status === 'Developing' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Developing
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                          Weak
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {g.status !== 'Mastered' ? (
                        <button
                          onClick={() => setSelectedPracticeTopic(`Ngữ pháp: ${g.name}`)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs active:scale-95 cursor-pointer"
                        >
                          Luyện tập
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Cần cải thiện: {grammarWeak} cấu trúc
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Đã thành thạo: {grammarCorrect} cấu trúc
              </span>
            </div>

            <button
              onClick={() => setSelectedPracticeTopic('Tất cả các cấu trúc ngữ pháp')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Luyện tập tất cả</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BANNER - AI PERSONALIZATION (VÒNG ĐỌC & VÒNG NGHE AI) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-800 via-sky-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg border border-sky-600/30">
        {/* Glow accents */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-72 h-72 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 font-bold text-[10px] tracking-wider uppercase">
                AI PERSONALIZATION
              </span>
              <span className="text-xs text-sky-200/90 font-medium">
                Lộ trình thích ứng thông minh
              </span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              Luyện tập cá nhân hoá theo lỗi sai bài thi
            </h3>
            <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed">
              Vòng 1: Đọc đục lỗ Cambridge Part 4 • Vòng 2: Nghe hội thoại tương tác AI
            </p>

            {/* List of tags to improve */}
            {vocabStats?.topics && vocabStats.topics.filter((t) => t.weakCount > 0).length > 0 && (
              <div className="mt-2 text-[11px] leading-relaxed text-slate-200 bg-slate-950/40 border border-white/10 rounded-xl p-3">
                <span className="font-semibold text-white mr-1.5">Chủ đề cần cải thiện:</span>
                <span className="space-x-1.5">
                  {vocabStats.topics
                    .filter((t) => t.weakCount > 0)
                    .map((t) => (
                      <button
                        key={t.topicName}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/practice/personalization?topic=${encodeURIComponent(t.topicName)}`
                          );
                        }}
                        className="hover:underline hover:text-white font-medium cursor-pointer"
                      >
                        {t.topicName} ({t.weakCount}),
                      </button>
                    ))}
                </span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-stretch lg:items-end">
            <button
              onClick={() => navigate('/practice/personalization?topic=ALL')}
              className="px-6 py-3.5 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-display font-extrabold text-sm tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <div className="flex items-center -space-x-1">
                <span className="material-symbols-outlined text-[20px] text-sky-600">
                  menu_book
                </span>
                <span className="material-symbols-outlined text-[20px] text-sky-700">
                  headphones
                </span>
              </div>
              <span>BẮT ĐẦU NGAY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Luyện tập từ vựng */}
      {selectedPracticeTopic && user?.id && (
        <VocabPracticeModal
          userId={user.id}
          topicName={selectedPracticeTopic}
          onClose={() => setSelectedPracticeTopic(null)}
          onTopicUpdated={fetchStats}
        />
      )}
    </div>
  );
};

export default PracticePage;
