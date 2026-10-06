import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { VocabStatsResponse, TopicStat } from '../../exam/types';
import {
  AcademicCapIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  ArrowPathIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';

// ──────────────────────────────────────────────
// Fake data dùng cho Target, Progress, Grammar, Skill
// ──────────────────────────────────────────────
const FAKE_GROWTH_DATA = [
  { date: '01/10', listeningScore: 12, readingScore: 15 },
  { date: '08/10', listeningScore: 14, readingScore: 18 },
  { date: '15/10', listeningScore: 18, readingScore: 22 },
  { date: '22/10', listeningScore: 20, readingScore: 24 },
  { date: '29/10', listeningScore: 19, readingScore: 25 },
];

const FAKE_GRAMMAR_DATA = [
  { name: 'Have got', status: 'Mastered' as const },
  { name: 'To be', status: 'Mastered' as const },
  { name: 'There is / There are', status: 'Developing' as const },
  { name: 'Present simple', status: 'Weak' as const },
  { name: 'Can / Can\'t', status: 'Developing' as const },
];

const renderShields = (shields: number, x: number, y: number) => {
  if (shields === 0) return null;
  return (
    <g transform={`translate(${x - (shields * 10) - 5},${y - 5})`}>
      {Array.from({ length: shields }).map((_, i) => (
        <svg key={i} x={i * 10} y={0} width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.735c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.97a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ))}
    </g>
  );
};

const ListeningTick = (props: any) => {
  const { x, y, payload } = props;
  let shields = 0;
  if (payload.value === 10) shields = 1;
  else if (payload.value === 11) shields = 2;
  else if (payload.value === 13) shields = 3;
  else if (payload.value === 16) shields = 4;
  else if (payload.value === 18) shields = 5;
  return renderShields(shields, x, y);
};

const ReadingTick = (props: any) => {
  const { x, y, payload } = props;
  let shields = 0;
  if (payload.value === 12) shields = 1;
  else if (payload.value === 13) shields = 2;
  else if (payload.value === 16) shields = 3;
  else if (payload.value === 19) shields = 4;
  else if (payload.value === 21) shields = 5;
  return renderShields(shields, x, y);
};

// ──────────────────────────────────────────────
// Status Badge Component
// ──────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Mastered') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
        <CheckIcon className="w-3.5 h-3.5 stroke-[3]" /> Mastered
      </span>
    );
  }
  if (status === 'Developing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700">
        <ArrowPathIcon className="w-3.5 h-3.5 stroke-[3]" /> Developing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-red-100 text-red-600">
      <ArrowPathIcon className="w-3.5 h-3.5 stroke-[3]" /> Weak
    </span>
  );
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export const ExamStatsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [vocabStats, setVocabStats] = useState<VocabStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    vocabStatsApi.getVocabStats(user.id)
      .then(setVocabStats)
      .catch(() => setVocabStats({ noExamHistory: true, topics: [] }))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalWeak = vocabStats?.topics.reduce((s, t) => s + t.weakCount, 0) ?? 0;
  const totalCorrect = vocabStats?.topics.reduce((s, t) => s + t.correctCount, 0) ?? 0;

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* ── Header ── */}
      <div className="bg-white border-b-[3px] border-[#8c4513] shadow-sm px-6 py-5">
        <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">PRE-A1 STARTERS · Báo cáo học tập</p>
        <h1 className="text-2xl font-display font-extrabold text-text-main">Mỗi ngày học, một bước tiến</h1>
        <p className="text-sm text-text-muted mt-1">
          {user?.fullName || user?.username}, cùng nhìn lại tiến bộ và chỉnh phục mục tiêu Pre-A1 nhé!
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Row 1: Target + Progress ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Target */}
          <div className="bg-amber-50 rounded-3xl border-2 border-amber-300 shadow-[0_8px_30px_rgb(245,158,11,0.08)] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-medium text-lg text-amber-900">Target</p>
              <span className="text-xs font-medium text-gray-400">Mục tiêu kỳ thi</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-amber-200/60">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                  <SpeakerWaveIcon className="w-5 h-5 text-amber-600" />
                  Listening
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ShieldCheckIcon key={i} className={`w-6 h-6 ${i < 4 ? 'text-amber-500' : 'text-gray-400'}`} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                  <BookOpenIcon className="w-5 h-5 text-amber-600" />
                  Reading + Writing
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ShieldCheckIcon key={i} className={`w-6 h-6 ${i < 4 ? 'text-amber-500' : 'text-gray-400'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-[#f0f9f6] rounded-3xl border-2 border-teal-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-lg text-teal-900">Progress</p>
              <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                <SparklesIcon className="w-4 h-4" /> Đang tiến bộ
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <p className="text-5xl font-display font-bold text-teal-800">68%</p>
              <p className="text-sm font-medium text-teal-700/80">8/12 bài học đã hoàn thành</p>
            </div>

            <div className="w-full bg-teal-900/10 rounded-full h-3 mb-3">
              <div className="bg-teal-700 h-3 rounded-full" style={{ width: '68%' }} />
            </div>

            <p className="text-xs text-teal-700 font-medium">Chỉ còn 4 bài học nữa để hoàn thành lộ trình!</p>
          </div>
        </div>

        {/* ── Row 2 & 3: Biểu đồ & Knowledge Mastery ── */}
        <div className="flex flex-col gap-6">

          {/* Row 2: Biểu đồ Tăng trưởng */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Listening Chart */}
            <div className="bg-white rounded-3xl border-2 border-blue-300 shadow-[0_8px_30px_rgb(59,130,246,0.1)] p-5 relative hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-text-main">Listening Growth</h2>
                  <p className="text-xs text-text-muted mt-0.5">Tiến độ điểm (mục tiêu 4 khiên)</p>
                </div>
                <SpeakerWaveIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vocabStats?.examHistories || []} margin={{ top: 5, right: 10, bottom: 5, left: 55 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeWidth={1.5} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 20]}
                      ticks={[10, 11, 13, 16, 18]}
                      interval={0}
                      tick={<ListeningTick />}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                      formatter={(value: number) => [`${value} câu đúng`, 'Điểm số']}
                    />
                    <ReferenceLine y={16} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" label={{ position: 'insideTopRight', value: 'Mục tiêu', fill: '#f59e0b', fontSize: 12, fontWeight: 700 }} />
                    <Line type="monotone" name="Listening" dataKey="listeningScore" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reading & Writing Chart */}
            <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-[0_8px_30px_rgb(16,185,129,0.1)] p-5 relative hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-text-main">Reading & Writing Growth</h2>
                  <p className="text-xs text-text-muted mt-0.5">Tiến độ điểm (mục tiêu 4 khiên)</p>
                </div>
                <BookOpenIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vocabStats?.examHistories || []} margin={{ top: 5, right: 10, bottom: 5, left: 55 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeWidth={1.5} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 25]}
                      ticks={[12, 13, 16, 19, 21]}
                      interval={0}
                      tick={<ReadingTick />}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                      formatter={(value: number) => [`${value} câu đúng`, 'Điểm số']}
                    />
                    <ReferenceLine y={19} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" label={{ position: 'insideTopRight', value: 'Mục tiêu', fill: '#f59e0b', fontSize: 12, fontWeight: 700 }} />
                    <Line type="monotone" name="Reading & Writing" dataKey="readingScore" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Knowledge Mastery Section */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-text-main">Knowledge mastery</h2>
              <p className="text-xs text-text-muted mt-0.5">So sánh bài đầu vào và bài thi thử gần nhất.</p>
            </div>

            {/* Topic & Grammar Side-by-Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

              {/* Topic Table */}
              <div className="bg-white rounded-3xl border-2 border-indigo-300 shadow-[0_8px_30px_rgb(99,102,241,0.1)] overflow-x-auto relative hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] transition-shadow duration-300">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Squares2X2Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-lg text-gray-800">Topic</span>
                      {!loading && !vocabStats?.noExamHistory && (
                        <span className="text-sm font-medium text-gray-400">{vocabStats?.topics.length || 0} nội dung</span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">Từ vựng theo chủ đề</span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-10 gap-2 text-text-muted text-sm">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Đang tải...
                  </div>
                ) : vocabStats?.noExamHistory ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 px-6">
                    <AcademicCapIcon className="w-10 h-10 text-text-muted opacity-40" />
                    <p className="text-sm text-text-muted text-center">Hãy làm bài kiểm tra để theo dõi sự tiến bộ!</p>
                  </div>
                ) : (
                  <>
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_80px_80px_130px_100px] gap-3 px-5 py-4 bg-gray-50/50 text-sm font-medium text-gray-500 border-b border-gray-100">
                      <span>Tên</span>
                      <span className="text-center">Cần cải thiện</span>
                      <span className="text-center">Đã cải thiện</span>
                      <span className="text-center">Status</span>
                      <span className="text-center">Action</span>
                    </div>
                    {/* Table rows */}
                    {vocabStats!.topics.map((topic: TopicStat) => (
                      <div
                        key={topic.topicName}
                        className="grid grid-cols-[1fr_80px_80px_130px_100px] gap-3 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors items-center"
                      >
                        <span className="font-medium text-base text-gray-700">{topic.topicName}</span>
                        <span className="text-center text-base font-medium text-gray-500">{topic.weakCount}</span>
                        <span className="text-center text-base font-bold text-emerald-600">{topic.correctCount}</span>
                        <div className="flex justify-center">
                          <StatusBadge status={topic.status} />
                        </div>
                        <div className="flex justify-center">
                          {topic.status !== 'Mastered' ? (
                            <button
                              id={`practice-btn-${topic.topicName.replace(/\s+/g, '-').toLowerCase()}`}
                              className="px-4 py-1.5 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                            >
                              Luyện tập
                            </button>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Summary row */}
                    {(totalWeak > 0 || totalCorrect > 0) && (
                      <div className="px-5 py-3 bg-surface flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-text-muted">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1" />
                          Cần cải thiện: <strong>{totalWeak}</strong> từ
                        </span>
                        <span className="text-xs text-text-muted">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
                          Đã cải thiện: <strong>{totalCorrect}</strong> từ
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Grammar Table (fake data) */}
              <div className="bg-white rounded-3xl border-2 border-violet-300 shadow-[0_8px_30px_rgb(139,92,246,0.1)] overflow-hidden relative hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] transition-shadow duration-300">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-lg text-gray-800">Grammar</span>
                      <span className="text-sm font-medium text-gray-400">{FAKE_GRAMMAR_DATA.length} nội dung</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">Cấu trúc ngữ pháp</span>
                </div>
                {/* Table header */}
                <div className="grid grid-cols-[1fr_130px_100px] gap-2 px-6 py-4 bg-gray-50/50 text-sm font-medium text-gray-500 border-b border-gray-100">
                  <span>Tên</span>
                  <span className="text-center">Status</span>
                  <span className="text-center">Action</span>
                </div>
                {FAKE_GRAMMAR_DATA.map((g) => (
                  <div
                    key={g.name}
                    className="grid grid-cols-[1fr_130px_100px] gap-2 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-medium text-base text-gray-700">{g.name}</span>
                    <div className="flex justify-center">
                      <StatusBadge status={g.status} />
                    </div>
                    <div className="flex justify-center">
                      {g.status !== 'Mastered' ? (
                        <button className="px-4 py-1.5 text-sm font-bold text-violet-600 bg-violet-50 border border-violet-200 rounded-full hover:bg-violet-100 transition-colors">
                          Luyện tập
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div> {/* Kết thúc Grid 2 cột */}

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
        </div>

      </div>
    </div>
  );
};
