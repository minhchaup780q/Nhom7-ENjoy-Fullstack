import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { VocabStatsResponse, TopicStat } from '../../exam/types';
import {
  AcademicCapIcon,
  Squares2X2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { VocabPracticeModal } from '../../stats/components/VocabPracticeModal';

// ──────────────────────────────────────────────
// Fake data cho cấu trúc ngữ pháp
// ──────────────────────────────────────────────
const FAKE_GRAMMAR_DATA = [
  { name: 'Have got', status: 'Mastered' as const },
  { name: 'To be', status: 'Mastered' as const },
  { name: 'There is / There are', status: 'Developing' as const },
  { name: 'Present simple', status: 'Weak' as const },
  { name: 'Can / Can\'t', status: 'Developing' as const },
];

// ──────────────────────────────────────────────
// Status Badge Component
// ──────────────────────────────────────────────
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Mastered') {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700 min-w-[70px]">
        Mastered
      </span>
    );
  }
  if (status === 'Developing') {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 min-w-[70px]">
        Developing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-100 text-red-600 min-w-[70px]">
      Weak
    </span>
  );
};

export const PracticePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [vocabStats, setVocabStats] = useState<VocabStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<string | null>(null);

  const fetchStats = () => {
    if (!user?.id) return;
    vocabStatsApi.getVocabStats(user.id)
      .then(setVocabStats)
      .catch(() => setVocabStats({ noExamHistory: true, topics: [] }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const totalWeak = vocabStats?.topics.reduce((s, t) => s + t.weakCount, 0) ?? 0;
  const totalCorrect = vocabStats?.topics.reduce((s, t) => s + t.correctCount, 0) ?? 0;
  const grammarWeak = FAKE_GRAMMAR_DATA.filter((g) => g.status !== 'Mastered').length;
  const grammarCorrect = FAKE_GRAMMAR_DATA.filter((g) => g.status === 'Mastered').length;

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* ── Header ── */}
      <div className="bg-white border-b-[3px] border-[#8c4513] shadow-sm px-6 py-5">
        <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">
          PRE-A1 STARTERS · TRUNG TÂM LUYỆN TẬP
        </p>
        <h1 className="text-2xl font-display font-extrabold text-text-main">
          Luyện tập &amp; Nâng cao năng lực
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {user?.fullName || user?.username}, hãy cùng ôn luyện các chủ đề từ vựng &amp; ngữ pháp để chinh phục điểm tuyệt đối nhé!
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col gap-10">
        {/* ══════════════════════════════════════════════════ */}
        {/* KHU VỰC: LUYỆN TẬP KNOWLEDGE MASTERY                */}
        {/* ══════════════════════════════════════════════════ */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3.5 pb-4 border-b-2 border-gray-200/80">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm shrink-0">
              <AcademicCapIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 tracking-tight">
                Luyện tập
              </h2>
              <p className="text-xs md:text-sm text-text-muted mt-0.5 font-medium">
                Củng cố và rèn luyện các chủ đề từ vựng &amp; cấu trúc ngữ pháp cần cải thiện
              </p>
            </div>
          </div>

          {/* Knowledge Mastery Section */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-text-main">Knowledge mastery</h3>
              <p className="text-xs text-text-muted mt-0.5">So sánh bài đầu vào và bài thi thử gần nhất.</p>
            </div>

            {/* Topic & Grammar Side-by-Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Topic Table */}
              <div className="bg-white rounded-3xl border-2 border-indigo-300 shadow-[0_8px_30px_rgb(99,102,241,0.1)] overflow-hidden relative hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] transition-shadow duration-300 flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Squares2X2Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm text-gray-800">Topic</span>
                      {!loading && !vocabStats?.noExamHistory && (
                        <span className="text-[11px] font-medium text-gray-400">
                          {vocabStats?.topics.length || 0} nội dung
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">Từ vựng theo chủ đề</span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-text-muted text-xs flex-1">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Đang tải...
                  </div>
                ) : vocabStats?.noExamHistory ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2 px-4 flex-1">
                    <AcademicCapIcon className="w-7 h-7 text-text-muted opacity-40" />
                    <p className="text-xs text-text-muted text-center">Hãy làm bài kiểm tra để theo dõi sự tiến bộ!</p>
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_75px_75px_85px_80px] gap-2 px-4 py-1.5 bg-gray-50/70 text-[11px] font-semibold text-gray-500 border-b border-gray-100 shrink-0">
                      <span>Tên</span>
                      <span className="text-center">Cần cải thiện</span>
                      <span className="text-center">Đã cải thiện</span>
                      <span className="text-center">Status</span>
                      <span className="text-center">Action</span>
                    </div>
                    {/* Table rows */}
                    <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto flex-1">
                      {vocabStats!.topics.map((topic: TopicStat) => (
                        <div
                          key={topic.topicName}
                          className="grid grid-cols-[1fr_75px_75px_85px_80px] gap-2 px-4 py-1.5 hover:bg-gray-50/60 transition-colors items-center"
                        >
                          <span className="font-medium text-xs text-gray-700 truncate" title={topic.topicName}>
                            {topic.topicName}
                          </span>
                          <span className="text-center text-xs font-medium text-gray-500">{topic.weakCount}</span>
                          <span className="text-center text-xs font-bold text-emerald-600">{topic.correctCount}</span>
                          <div className="flex justify-center">
                            <StatusBadge status={topic.status} />
                          </div>
                          <div className="flex justify-center">
                            {topic.status !== 'Mastered' ? (
                              <button
                                id={`practice-btn-${topic.topicName.replace(/\s+/g, '-').toLowerCase()}`}
                                onClick={() => setSelectedPracticeTopic(topic.topicName)}
                                className="px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                              >
                                Luyện tập
                              </button>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Summary row */}
                    {(totalWeak > 0 || totalCorrect > 0) && (
                      <div className="px-4 py-2 bg-surface flex flex-col gap-2 border-t border-gray-100 mt-auto shrink-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[11px] text-text-muted">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1" />
                            Cần cải thiện: <strong>{totalWeak}</strong> từ
                          </span>
                          <span className="text-[11px] text-text-muted">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
                            Đã cải thiện: <strong>{totalCorrect}</strong> từ
                          </span>
                        </div>

                        {totalWeak > 0 ? (
                          <button
                            id="practice-all-topics-btn"
                            onClick={() => setSelectedPracticeTopic('Tất cả các chủ đề')}
                            className="w-full py-1.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                          >
                            <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
                            Luyện tập tất cả
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-1.5 px-3 text-xs font-bold text-gray-400 bg-gray-100 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            Luyện tập tất cả
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grammar Table */}
              <div className="bg-white rounded-3xl border-2 border-violet-300 shadow-[0_8px_30px_rgb(139,92,246,0.1)] overflow-hidden relative hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] transition-shadow duration-300 flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                      <AcademicCapIcon className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm text-gray-800">Grammar</span>
                      <span className="text-[11px] font-medium text-gray-400">{FAKE_GRAMMAR_DATA.length} nội dung</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">Cấu trúc ngữ pháp</span>
                </div>

                <div className="flex flex-col flex-1 min-h-0">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_85px_80px] gap-2 px-4 py-1.5 bg-gray-50/70 text-[11px] font-semibold text-gray-500 border-b border-gray-100 shrink-0">
                    <span>Tên</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Action</span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto flex-1">
                    {FAKE_GRAMMAR_DATA.map((g) => (
                      <div
                        key={g.name}
                        className="grid grid-cols-[1fr_85px_80px] gap-2 px-4 py-1.5 items-center hover:bg-gray-50/60 transition-colors"
                      >
                        <span className="font-medium text-xs text-gray-700">{g.name}</span>
                        <div className="flex justify-center">
                          <StatusBadge status={g.status} />
                        </div>
                        <div className="flex justify-center">
                          {g.status !== 'Mastered' ? (
                            <button className="px-2.5 py-0.5 text-[11px] font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-full hover:bg-violet-100 transition-colors">
                              Luyện tập
                            </button>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary row & Action */}
                  <div className="px-4 py-2 bg-surface flex flex-col gap-2 border-t border-gray-100 mt-auto shrink-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] text-text-muted">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1" />
                        Cần cải thiện: <strong>{grammarWeak}</strong> cấu trúc
                      </span>
                      <span className="text-[11px] text-text-muted">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
                        Đã cải thiện: <strong>{grammarCorrect}</strong> cấu trúc
                      </span>
                    </div>

                    <button
                      id="practice-all-grammar-btn"
                      className="w-full py-1.5 px-3 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                    >
                      <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
                      Luyện tập tất cả
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 flex-wrap text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Mastered: từ 75 điểm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Developing: cần cố thêm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Weak: cần cải thiện gấp
              </span>
            </div>
          </div>
        </section>

        {/* ── Luyện tập cá nhân hoá bài thi (Vòng Đọc & Vòng Nghe AI) ── */}
        <div
          onClick={() => navigate('/practice/personalization?topic=ALL')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
        >
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                    AI Personalization
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-display font-extrabold text-white">
                  Luyện tập cá nhân hoá theo lỗi sai bài thi
                </h3>
                <p className="text-sm text-white/80 mt-0.5">
                  Vòng 1: Đọc đục lỗ Cambridge Part 4 · Vòng 2: Nghe hội thoại tương tác AI
                </p>

                {/* Danh sách chủ đề có từ cần cải thiện để click nhanh */}
                {vocabStats?.topics && vocabStats.topics.filter((t) => t.weakCount > 0).length > 0 && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-[11px] font-bold text-white/70">Chủ đề cần cải thiện:</span>
                    {vocabStats.topics
                      .filter((t) => t.weakCount > 0)
                      .map((t) => (
                        <button
                          key={t.topicName}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/practice/personalization?topic=${encodeURIComponent(t.topicName)}`);
                          }}
                          className="px-2.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-indigo-900 rounded-full text-[11px] font-bold transition-all cursor-pointer backdrop-blur"
                        >
                          {t.topicName} ({t.weakCount})
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="flex gap-1.5 text-2xl">
                <span>📖</span>
                <span>🎧</span>
              </div>
              <span className="text-[11px] font-extrabold text-white bg-white/20 px-3 py-1 rounded-xl uppercase tracking-wider shadow-sm group-hover:bg-white group-hover:text-indigo-900 transition-colors">
                Bắt đầu ngay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal Luyện tập từ vựng sai theo Topic (Phần luyện tập ở trên) ── */}
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
