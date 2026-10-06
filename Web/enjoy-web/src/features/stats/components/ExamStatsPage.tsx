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
  StarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';

// ──────────────────────────────────────────────
// Fake data dùng cho Target, Progress, Grammar, Skill
// ──────────────────────────────────────────────
const FAKE_GRAMMAR_DATA = [
  { name: 'Have got', status: 'Mastered' as const },
  { name: 'To be', status: 'Mastered' as const },
  { name: 'There is / There are', status: 'Developing' as const },
  { name: 'Present simple', status: 'Weak' as const },
  { name: 'Can / Can\'t', status: 'Developing' as const },
];

const FAKE_SKILL_DATA = [
  { name: 'Listening', start: 40, current: 82, icon: SpeakerWaveIcon, color: 'text-blue-500', bg: 'bg-blue-100' },
  { name: 'Reading & writing', start: 45, current: 76, icon: BookOpenIcon, color: 'text-emerald-500', bg: 'bg-emerald-100' },
];

// ──────────────────────────────────────────────
// Status Badge Component
// ──────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Mastered') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckBadgeIcon className="w-3.5 h-3.5" /> Mastered
      </span>
    );
  }
  if (status === 'Developing') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-600 border border-orange-200">
        <SparklesIcon className="w-3.5 h-3.5" /> Developing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
      <ExclamationTriangleIcon className="w-3.5 h-3.5" /> Weak
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
      <div className="bg-white border-b border-border px-6 py-5">
        <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">PRE-A1 STARTERS · Báo cáo học tập</p>
        <h1 className="text-2xl font-display font-extrabold text-text-main">Mỗi ngày học, một bước tiến</h1>
        <p className="text-sm text-text-muted mt-1">
          {user?.fullName || user?.username}, cùng nhìn lại tiến bộ và chỉnh phục mục tiêu Pre-A1 nhé!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── Row 1: Target + Progress ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Target */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-sm text-text-main">Target</p>
              <span className="text-xs text-text-muted">Mục tiêu kỳ thi</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Listening', icon: SpeakerWaveIcon },
                { label: 'Reading + Writing', icon: BookOpenIcon },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-sm text-text-main">Progress</p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-4 h-4" /> Đang tiến bộ
              </span>
            </div>
            <p className="text-4xl font-display font-extrabold text-text-main mb-1">68%</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '68%' }} />
            </div>
            <p className="text-xs text-text-muted">8/12 bài học đã hoàn thành</p>
            <p className="text-xs text-primary mt-1 font-medium">Chỉ còn 4 bài học nữa để hoàn thành lộ trình!</p>
          </div>
        </div>

        {/* ── Row 2: Knowledge Mastery + Skill ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">

          {/* Knowledge Mastery */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-text-main">Knowledge mastery</h2>
              <p className="text-xs text-text-muted mt-0.5">So sánh bài đầu vào và bài thi thử gần nhất.</p>
            </div>

            {/* Topic Table */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm text-text-main">Topic</span>
                  {!loading && !vocabStats?.noExamHistory && (
                    <span className="text-xs text-text-muted">· {vocabStats?.topics.length || 0} chủ đề</span>
                  )}
                </div>
                <span className="text-xs text-text-muted">Từ vựng theo chủ đề</span>
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
                  <div className="grid grid-cols-[1fr_100px_100px_110px_80px] gap-2 px-5 py-2.5 bg-surface text-xs font-semibold text-text-muted border-b border-border">
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
                      className="grid grid-cols-[1fr_100px_100px_110px_80px] gap-2 px-5 py-3 border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors items-center"
                    >
                      <span className="font-medium text-sm text-text-main">{topic.topicName}</span>
                      <span className="text-center text-sm font-semibold text-red-500">{topic.weakCount}</span>
                      <span className="text-center text-sm font-semibold text-emerald-600">{topic.correctCount}</span>
                      <div className="flex justify-center">
                        <StatusBadge status={topic.status} />
                      </div>
                      <div className="flex justify-center">
                        {topic.status !== 'Mastered' ? (
                          <button
                            id={`practice-btn-${topic.topicName.replace(/\s+/g, '-').toLowerCase()}`}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                          >
                            Luyện tập
                          </button>
                        ) : (
                          <span className="text-xs text-text-muted">—</span>
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
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="w-4 h-4 text-violet-500" />
                  <span className="font-bold text-sm text-text-main">Grammar</span>
                  <span className="text-xs text-text-muted">· {FAKE_GRAMMAR_DATA.length} nội dung</span>
                </div>
                <span className="text-xs text-text-muted">Cấu trúc ngữ pháp</span>
              </div>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_110px_80px] gap-2 px-5 py-2.5 bg-surface text-xs font-semibold text-text-muted border-b border-border">
                <span>Tên</span>
                <span className="text-center">Status</span>
                <span className="text-center">Action</span>
              </div>
              {FAKE_GRAMMAR_DATA.map((g) => (
                <div
                  key={g.name}
                  className="grid grid-cols-[1fr_110px_80px] gap-2 px-5 py-3 border-b border-border/50 last:border-0 items-center hover:bg-surface/50 transition-colors"
                >
                  <span className="font-medium text-sm text-text-main">{g.name}</span>
                  <div className="flex justify-center">
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="flex justify-center">
                    {g.status !== 'Mastered' ? (
                      <button className="px-2.5 py-1 text-xs font-bold text-white bg-violet-500 rounded-full hover:bg-violet-600 transition-colors">
                        Luyện tập
                      </button>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </div>
                </div>
              ))}
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

          {/* Skill Panel */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-text-main">Skill</p>
                <p className="text-xs text-text-muted mt-0.5">Tiến bộ ở từng nhóm kiến thức.</p>
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-bold text-text-muted mb-3">Từ khởi đầu đến hiện tại</p>
              {/* Header row */}
              <div className="grid grid-cols-[1fr_40px_50px_50px] gap-2 text-xs font-semibold text-text-muted mb-2">
                <span>Knowledge</span>
                <span className="text-center">Start</span>
                <span className="text-center">Current</span>
                <span className="text-center">Growth</span>
              </div>
              {FAKE_SKILL_DATA.map((skill) => {
                const growth = skill.current - skill.start;
                return (
                  <div key={skill.name} className="grid grid-cols-[1fr_40px_50px_50px] gap-2 items-center py-2.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${skill.bg} flex items-center justify-center flex-shrink-0`}>
                        <skill.icon className={`w-4 h-4 ${skill.color}`} />
                      </div>
                      <span className="text-sm text-text-main font-medium">{skill.name}</span>
                    </div>
                    <span className="text-center text-sm text-text-muted">{skill.start}</span>
                    <span className="text-center text-sm font-bold text-text-main">{skill.current}</span>
                    <span className="text-center text-sm font-bold text-emerald-600">+{growth}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-emerald-700 font-medium flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 flex-shrink-0" />
              Have got tổng tiến bộ nhiều nhất: +44 điểm
            </div>

            {/* Fake mini chart bar */}
            <div className="border-t border-border pt-3">
              <p className="text-xs text-text-muted mb-2 font-semibold">Tổng quan tuần này</p>
              <div className="flex items-end gap-1.5 h-16">
                {[40, 55, 48, 70, 65, 82, 76].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary/20 rounded-t"
                      style={{ height: `${(v / 100) * 56}px` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(v / 100) * 56}px` }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
