import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { VocabStatsResponse } from '../../exam/types';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// ──────────────────────────────────────────────
// Fake data dùng cho Target, Progress, Skill
// ──────────────────────────────────────────────
const FAKE_GROWTH_DATA = [
  { date: '01/10', listeningScore: 11, readingScore: 14 },
  { date: '08/10', listeningScore: 15, readingScore: 19 }, // +4 (+20% -> Xanh), +5 (+20% -> Xanh)
  { date: '15/10', listeningScore: 16, readingScore: 20 }, // +1 (+5% -> Cam), +1 (+4% -> Cam)
  { date: '22/10', listeningScore: 12, readingScore: 15 }, // -4 (-20% -> Đỏ), -5 (-20% -> Đỏ)
  { date: '29/10', listeningScore: 17, readingScore: 21 }, // +5 (+25% -> Xanh), +6 (+24% -> Xanh)
];

// ──────────────────────────────────────────────
// Trend Calculation & Chart Helpers
// Quy định:
// 1. Ngoại lệ người mới học: Điểm đầu < 25%, chưa từng ≥ 25%, đang tăng → 🟢 Tiến bộ; không tăng → 🔴 Điểm thấp
// 2. Ngoại lệ giảm sút: Đã từng ≥ 25%, hiện tại < 25%, giữ nguyên thấp/giảm → 🔴 Điểm thấp kéo dài
// 3. Quy tắc chuẩn:
//    ≥ +15%: Tiến bộ (Xanh: #10b981)
//    Trên -15% đến dưới +15%: Ổn định (Cam: #f59e0b)
//    ≤ -15%: Có dấu hiệu giảm (Đỏ: #ef4444)
// ──────────────────────────────────────────────
export interface ScoreTrend {
  status: 'Tiến bộ' | 'Ổn định' | 'Có dấu hiệu giảm' | 'Điểm thấp kéo dài' | 'Điểm thấp';
  color: string;
  diff: number;
  diffPercent: number;
}

export const getScoreTrendAtIndex = (
  history: any[],
  index: number,
  scoreKey: string,
  maxScore: number
): ScoreTrend => {
  const currScore = history[index]?.[scoreKey] ?? 0;
  const prevScore = history[index - 1]?.[scoreKey] ?? 0;
  const diff = currScore - prevScore;
  const diffPercent = Math.round((diff / maxScore) * 100);

  const threshold25 = maxScore * 0.25;

  const pastScores = history.slice(0, index).map((d) => d[scoreKey] ?? 0);
  const initialScore = pastScores[0] ?? 0;
  const hasEverReached25Before = pastScores.some((s) => s >= threshold25);

  const allScoresUpToCurrent = history.slice(0, index + 1).map((d) => d[scoreKey] ?? 0);
  const neverReached25 = allScoresUpToCurrent.every((s) => s < threshold25);

  const isCurrBelow25 = currScore < threshold25;

  // ── NGOẠI LỆ 1: Người mới học, đang tiến bộ ──
  // - Điểm ban đầu dưới 25%.
  // - Chưa từng đạt ≥ 25%.
  // - Điểm các bài gần đây đang tăng → 🟢 Tiến bộ.
  if (initialScore < threshold25 && neverReached25) {
    if (currScore > prevScore) {
      return {
        status: 'Tiến bộ',
        color: '#10b981',
        diff,
        diffPercent,
      };
    }
    // Không tăng (ví dụ 0 → 0 → 0) → 🔴 Điểm thấp
    return {
      status: 'Điểm thấp',
      color: '#ef4444',
      diff,
      diffPercent,
    };
  }

  // ── NGOẠI LỆ 2: Người học bị giảm sút ──
  // - Đã từng đạt ≥ 25%.
  // - Hiện tại giảm xuống dưới 25%.
  // - Dù các bài sau vẫn giữ nguyên điểm thấp → 🔴 Điểm thấp kéo dài.
  if (hasEverReached25Before && isCurrBelow25) {
    // Nếu điểm tăng vượt bậc ≥ 15% thì mới tính là Tiến bộ, còn lại giữ nguyên điểm thấp hoặc giảm thì là 🔴 Điểm thấp kéo dài
    if (diffPercent >= 15) {
      return {
        status: 'Tiến bộ',
        color: '#10b981',
        diff,
        diffPercent,
      };
    }
    return {
      status: 'Điểm thấp kéo dài',
      color: '#ef4444',
      diff,
      diffPercent,
    };
  }

  // ── QUY TẮC TIÊU CHUẨN (dải điểm bình thường) ──
  // ≥ +15%: Tiến bộ
  // Trên -15% đến dưới +15%: Ổn định
  // ≤ -15%: Có dấu hiệu giảm
  if (diffPercent >= 15) {
    return { status: 'Tiến bộ', color: '#10b981', diff, diffPercent };
  }
  if (diffPercent <= -15) {
    return { status: 'Có dấu hiệu giảm', color: '#ef4444', diff, diffPercent };
  }
  return { status: 'Ổn định', color: '#f59e0b', diff, diffPercent };
};


const generateGradientStops = (
  data: any[],
  scoreKey: string,
  maxScore: number,
  fallbackColor: string
) => {
  if (!data || data.length < 2) {
    return [
      <stop key="fallback-0" offset="0%" stopColor={fallbackColor} />,
      <stop key="fallback-1" offset="100%" stopColor={fallbackColor} />,
    ];
  }

  const n = data.length;
  const stops: React.ReactElement[] = [];

  for (let i = 0; i < n - 1; i++) {
    const trend = getScoreTrendAtIndex(data, i + 1, scoreKey, maxScore);

    const startPct = ((i / (n - 1)) * 100).toFixed(2);
    const endPct = (((i + 1) / (n - 1)) * 100).toFixed(2);

    stops.push(
      <stop
        key={`seg-${scoreKey}-${i}-start`}
        offset={`${startPct}%`}
        stopColor={trend.color}
      />,
      <stop
        key={`seg-${scoreKey}-${i}-end`}
        offset={`${endPct}%`}
        stopColor={trend.color}
      />
    );
  }

  return stops;
};

const renderCustomDot = (
  dotProps: any,
  data: any[],
  scoreKey: string,
  maxScore: number
) => {
  const { cx, cy, index } = dotProps;
  if (cx == null || cy == null || typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) {
    return null;
  }

  let dotColor = '#3b82f6';
  if (index > 0 && data && data[index] && data[index - 1]) {
    const trend = getScoreTrendAtIndex(data, index, scoreKey, maxScore);
    dotColor = trend.color;
  }

  return (
    <g key={`dot-${scoreKey}-${index}`}>
      <circle cx={cx} cy={cy} r={6.5} fill={dotColor} fillOpacity={0.25} />
      <circle cx={cx} cy={cy} r={4.5} fill={dotColor} stroke="#ffffff" strokeWidth={2} />
    </g>
  );
};

const renderActiveDot = (
  dotProps: any,
  data: any[],
  scoreKey: string,
  maxScore: number
) => {
  const { cx, cy, index } = dotProps;
  if (cx == null || cy == null || typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) {
    return null;
  }

  let dotColor = '#3b82f6';
  if (index > 0 && data && data[index] && data[index - 1]) {
    const trend = getScoreTrendAtIndex(data, index, scoreKey, maxScore);
    dotColor = trend.color;
  }

  return (
    <g key={`activedot-${scoreKey}-${index}`}>
      <circle cx={cx} cy={cy} r={9} fill={dotColor} fillOpacity={0.3} />
      <circle cx={cx} cy={cy} r={5.5} fill={dotColor} stroke="#ffffff" strokeWidth={2.5} />
    </g>
  );
};

interface GrowthTooltipProps {
  active?: boolean;
  payload?: any[];
  maxScore: number;
  dataKeyName: string;
  data: any[];
  skillName: string;
}

const GrowthTooltip: React.FC<GrowthTooltipProps> = ({
  active,
  payload,
  maxScore,
  dataKeyName,
  data,
  skillName,
}) => {
  if (!active || !payload || !payload.length) return null;

  const currentPoint = payload[0].payload;
  const currentIndex = data.indexOf(currentPoint);
  const score = currentPoint ? currentPoint[dataKeyName] : payload[0].value;

  let trendInfo: { label: string; badgeClass: string; diffText: string } | null = null;

  if (currentIndex > 0 && data[currentIndex - 1]) {
    const trend = getScoreTrendAtIndex(data, currentIndex, dataKeyName, maxScore);
    const sign = trend.diff > 0 ? `+${trend.diff}` : `${trend.diff}`;
    const signPct = trend.diffPercent > 0 ? `+${trend.diffPercent}%` : `${trend.diffPercent}%`;

    let badgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
    if (trend.status === 'Tiến bộ') {
      badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    } else if (trend.status === 'Có dấu hiệu giảm' || trend.status === 'Điểm thấp kéo dài' || trend.status === 'Điểm thấp') {
      badgeClass = 'bg-red-50 text-red-800 border-red-300';
    }

    let diffText = `${sign} câu (${signPct}) so với bài trước`;
    if (trend.status === 'Điểm thấp kéo dài') {
      diffText = `Dưới 25% kéo dài (${sign} câu so với bài trước)`;
    } else if (trend.status === 'Điểm thấp') {
      diffText = `Duy trì ở mức điểm thấp (${sign} câu so với bài trước)`;
    } else if (trend.status === 'Tiến bộ' && trend.diffPercent < 15) {
      diffText = `${sign} câu (${signPct}) · Mới học đang tiến bộ`;
    }

    trendInfo = {
      label: trend.status,
      badgeClass,
      diffText,
    };
  }

  return (
    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 min-w-[220px]">
      <div className="flex items-center justify-between mb-1 pb-1.5 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{skillName}</span>
        <span className="text-xs font-medium text-slate-400">{currentPoint?.date}</span>
      </div>
      <div className="flex items-baseline gap-1.5 my-2">
        <span className="text-2xl font-display font-extrabold text-slate-800">{score}</span>
        <span className="text-xs font-semibold text-slate-400">/{maxScore} câu đúng</span>
        <span className="text-xs font-bold text-sky-600 ml-auto bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
          {Math.round((score / maxScore) * 100)}%
        </span>
      </div>
      {trendInfo ? (
        <div className={`mt-2 text-xs px-3 py-2 rounded-xl border font-medium ${trendInfo.badgeClass}`}>
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {trendInfo.label}
          </div>
          <div className="text-[11px] opacity-90 mt-0.5">{trendInfo.diffText}</div>
        </div>
      ) : (
        <div className="mt-2 text-xs px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-medium border border-sky-200">
          Mốc bài thi ban đầu
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// Score Consistency & Target Achievement Helper
// Công thức độ lệch chuẩn: sigma = sqrt( sum( (x_i - mean)^2 ) / n )
// ──────────────────────────────────────────────
export interface ExamAchievementStats {
  totalExams: number;
  passedCount: number;
  percentage: number;
}

export const calculateAchievementStats = (data: any[]): ExamAchievementStats => {
  const totalExams = data?.length || 0;
  if (totalExams === 0) {
    return { totalExams: 0, passedCount: 0, percentage: 0 };
  }
  const passedCount = data.filter(
    (e) => (e.listeningScore ?? 0) >= 16 && (e.readingScore ?? 0) >= 19
  ).length;
  const percentage = Math.round((passedCount / totalExams) * 100);
  return { totalExams, passedCount, percentage };
};

export interface ExamConsistencyStats {
  totalRecent: number;
  targetPassedCount: number;
  targetPercentage: number;
  stdDev: number;
  stdDevListening: number;
  stdDevReading: number;
  isReadyForRealExam: boolean;
}

export const calculateConsistencyStats = (data: any[]): ExamConsistencyStats => {
  if (!data || data.length === 0) {
    return {
      totalRecent: 0,
      targetPassedCount: 0,
      targetPercentage: 0,
      stdDev: 0,
      stdDevListening: 0,
      stdDevReading: 0,
      isReadyForRealExam: false,
    };
  }

  // Lấy tối đa 5 bài gần nhất
  const recentExams = data.slice(-5);
  const n = recentExams.length;

  // Đạt mục tiêu khi: Listening >= 16 câu và Reading >= 19 câu (mục tiêu 4 khiên)
  const targetPassedCount = recentExams.filter(
    (e) => (e.listeningScore ?? 0) >= 16 && (e.readingScore ?? 0) >= 19
  ).length;

  const targetPercentage = Math.round((targetPassedCount / n) * 100);

  // Tính độ lệch chuẩn Listening
  const listeningScores = recentExams.map((e) => Number(e.listeningScore ?? 0));
  const meanL = listeningScores.reduce((sum, val) => sum + val, 0) / n;
  const varianceL = listeningScores.reduce((sum, val) => sum + Math.pow(val - meanL, 2), 0) / n;
  const stdDevL = Math.sqrt(varianceL);

  // Tính độ lệch chuẩn Reading
  const readingScores = recentExams.map((e) => Number(e.readingScore ?? 0));
  const meanR = readingScores.reduce((sum, val) => sum + val, 0) / n;
  const varianceR = readingScores.reduce((sum, val) => sum + Math.pow(val - meanR, 2), 0) / n;
  const stdDevR = Math.sqrt(varianceR);

  // Độ lệch chuẩn trung bình
  const stdDevAvg = (stdDevL + stdDevR) / 2;

  const roundedStdDev = Number(stdDevAvg.toFixed(1));
  const roundedStdDevL = Number(stdDevL.toFixed(1));
  const roundedStdDevR = Number(stdDevR.toFixed(1));

  // Kết luận:
  // Nếu 5 bài gần nhất đạt target (5/5 bài) + độ lệch chuẩn thấp (<= 3 câu) -> Đã sẵn sàng để Thử sức thi thật
  // Các trường hợp khác -> Chưa sẵn sàng, cần luyện tập thêm
  const isTargetMet = n >= 5 && targetPassedCount === 5;
  const isConsistencyLow = roundedStdDev <= 3;
  const isReadyForRealExam = isTargetMet && isConsistencyLow;

  return {
    totalRecent: n,
    targetPassedCount,
    targetPercentage,
    stdDev: roundedStdDev,
    stdDevListening: roundedStdDevL,
    stdDevReading: roundedStdDevR,
    isReadyForRealExam,
  };
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export const ExamStatsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [vocabStats, setVocabStats] = useState<VocabStatsResponse | null>(null);

  const fetchStats = () => {
    if (!user?.id) return;
    vocabStatsApi.getVocabStats(user.id)
      .then(setVocabStats)
      .catch(() => setVocabStats({ noExamHistory: true, topics: [] }));
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const chartData = (vocabStats?.examHistories && vocabStats.examHistories.length > 0)
    ? vocabStats.examHistories
    : FAKE_GROWTH_DATA;

  const achievementStats = calculateAchievementStats(chartData);
  const consistencyStats = calculateConsistencyStats(chartData);

  return (
    <div className="min-h-screen bg-surface pb-16">
      <main className="w-full flex-1 max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col w-full gap-8">
          
          {/* ── Hero Banner ── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50/60 to-purple-50 p-8 border border-indigo-100/80 shadow-sm">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-indigo-200/60 text-indigo-600 font-bold text-xs uppercase tracking-wider shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  PRE-A1 STARTERS · BÁO CÁO HỌC TẬP
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                  Mỗi ngày học, một bước tiến
                </h1>
                <p className="text-sm md:text-base text-slate-600 font-medium">
                  {user?.fullName || user?.username || 'Bạn ơi'}, cùng nhìn lại tiến bộ và chinh phục mục tiêu Pre-A1 nhé! ✨
                </p>
              </div>

              {/* Cúp vàng Cambridge Pre-A1 */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-4 rounded-2xl shrink-0 shadow-md shadow-amber-500/20 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white border border-white/30">
                  <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">Mục tiêu hiện tại</span>
                  <span className="text-lg font-black tracking-tight text-white font-display">Cambridge Pre-A1</span>
                </div>
              </div>
            </div>

            {/* Decor blurs */}
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none"></div>
            <div className="absolute right-40 -bottom-10 w-48 h-48 rounded-full bg-sky-200/40 blur-2xl pointer-events-none"></div>
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* KHU VỰC 1: ĐO LƯỜNG                                */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="flex items-center gap-3.5 px-1">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-900 font-display leading-tight">Đo lường</h2>
              <p className="text-xs text-slate-500 font-medium">Mục tiêu điểm số, tỉ lệ hoàn thành và xu hướng tăng trưởng</p>
            </div>
          </div>

          {/* ── Hàng KPI 1: Target (Vàng ấm) & Progress (Emerald) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Thẻ 1: Target */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-50/90 via-yellow-50/40 to-white p-7 border border-amber-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-amber-100/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 font-display">Target</span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200/60">
                    Mục tiêu kỳ thi
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  {/* Listening Item */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/95 border border-amber-100 shadow-xs hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">volume_up</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">Listening</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/60">
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-slate-300">shield</span>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold whitespace-nowrap shadow-xs">
                        4 khiên (tối thiểu 16 điểm)
                      </span>
                    </div>
                  </div>

                  {/* Reading + Writing Item */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/95 border border-amber-100 shadow-xs hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">menu_book</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">Reading + Writing</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/60">
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="material-symbols-outlined text-[22px] text-slate-300">shield</span>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold whitespace-nowrap shadow-xs">
                        4 khiên (tối thiểu 19 điểm)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thẻ 2: Progress */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white p-7 border border-emerald-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">donut_large</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 font-display">Progress</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span>Đang tiến bộ</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-3 my-4">
                  <span className="text-4xl font-extrabold text-emerald-600 tracking-tight font-display">68%</span>
                  <span className="text-sm text-slate-600 font-semibold">8/12 bài học đã hoàn thành</span>
                </div>
                {/* Rounded Progress Bar */}
                <div className="relative w-full h-4 bg-emerald-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 shadow-sm" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div className="mt-6 pt-4 flex items-center gap-2.5 text-emerald-900 bg-white/95 px-4 py-3 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="material-symbols-outlined text-emerald-600 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>sports_score</span>
                <span className="text-xs md:text-sm font-bold text-slate-800">Chỉ còn 4 bài học nữa để hoàn thành lộ trình!</span>
              </div>
            </div>
          </div>

          {/* ── Hàng KPI 2: Target Achievement & Score Consistency ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Thẻ Target Achievement */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 via-sky-50/40 to-white p-7 border border-indigo-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-indigo-100/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 font-display">Target Achievement</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100/80 text-indigo-700">Chuẩn kỳ thi</span>
                </div>
                <div className="my-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-indigo-600 font-display">{achievementStats.percentage}%</span>
                    <span className="text-sm text-slate-600 font-medium">
                      {achievementStats.passedCount}/{achievementStats.totalExams} bài đạt mục tiêu
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/95 border border-indigo-100 flex items-center justify-between shadow-xs">
                <span className="text-xs text-slate-600 font-medium">Lần thi thử sắp tới sẽ cập nhật tỷ lệ này</span>
                <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs">
                  Chi tiết
                </button>
              </div>
            </div>

            {/* Thẻ Score Consistency */}
            <div className="rounded-3xl bg-gradient-to-br from-purple-50/70 via-fuchsia-50/30 to-white p-7 border border-purple-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-purple-100/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">trending_up</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-slate-900 block leading-tight font-display">Score Consistency</span>
                      <span className="text-xs text-slate-500">Độ lệch chuẩn của 5 bài gần nhất</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                    {consistencyStats.isReadyForRealExam ? 'Ổn định' : 'Cần rèn luyện'}
                  </span>
                </div>
                <div className="my-3">
                  <span className="text-4xl font-extrabold text-purple-700 tracking-tight font-display">
                    ±{consistencyStats.stdDev.toString().replace('.', ',')}
                  </span>
                </div>
              </div>
              {/* Kết luận Box */}
              {consistencyStats.isReadyForRealExam ? (
                <div className="rounded-2xl bg-gradient-to-r from-emerald-100/95 to-teal-50 p-4 flex items-start gap-3 mt-3 border border-emerald-300 shadow-xs">
                  <span className="material-symbols-outlined text-emerald-600 text-[24px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm text-emerald-950 font-bold leading-snug">Đã sẵn sàng để Thử sức thi thật</span>
                    <span className="text-xs text-emerald-900 mt-0.5 font-medium">
                      5 bài gần nhất đạt target và độ lệch chuẩn thấp (≤ 3 câu).
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-gradient-to-r from-amber-100/95 to-amber-50 p-4 flex items-start gap-3 mt-3 border border-amber-300 shadow-xs">
                  <span className="material-symbols-outlined text-amber-600 text-[24px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm text-amber-950 font-bold leading-snug">Chưa sẵn sàng, cần luyện tập thêm</span>
                    <span className="text-xs text-amber-900 mt-0.5 font-medium">
                      Cần đạt target 5 bài gần nhất và giữ độ lệch chuẩn ≤ 3 câu.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Hàng Biểu đồ tăng trưởng (Listening & Reading/Writing) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Listening Chart */}
            <div className="rounded-3xl bg-white p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">headphones</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 font-display">Listening Growth</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    Mục tiêu: 16/20
                  </span>
                </div>

                {/* Legend Bar */}
                <div className="flex items-center gap-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-slate-600">Tiến bộ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-medium text-slate-600">Ổn định</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-medium text-slate-600">Giảm</span>
                  </div>
                </div>

                <div className="h-64 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 15, right: 15, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="listening-growth-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          {generateGradientStops(chartData, 'listeningScore', 20, '#10b981')}
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeWidth={1} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis
                        domain={[0, 20]}
                        ticks={[0, 5, 10, 15, 20]}
                        tickFormatter={(val) => `${val} câu`}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        width={55}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<GrowthTooltip maxScore={20} dataKeyName="listeningScore" data={chartData} skillName="Listening" />} />
                      <ReferenceLine
                        y={16}
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        label={{ position: 'insideTopRight', value: 'Mục tiêu: 16 câu (4 khiên)', fill: '#d97706', fontSize: 11, fontWeight: 700 }}
                      />
                      <Line
                        type="monotone"
                        name="Listening"
                        dataKey="listeningScore"
                        stroke="url(#listening-growth-gradient)"
                        strokeWidth={3.5}
                        dot={(props: any) => renderCustomDot(props, chartData, 'listeningScore', 20)}
                        activeDot={(props: any) => renderActiveDot(props, chartData, 'listeningScore', 20)}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Reading & Writing Chart */}
            <div className="rounded-3xl bg-white p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 font-display">Reading &amp; Writing Growth</span>
                  </div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
                    Mục tiêu: 19/25
                  </span>
                </div>

                {/* Legend Bar */}
                <div className="flex items-center gap-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-slate-600">Tiến bộ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-medium text-slate-600">Ổn định</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-medium text-slate-600">Giảm</span>
                  </div>
                </div>

                <div className="h-64 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 15, right: 15, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="reading-growth-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          {generateGradientStops(chartData, 'readingScore', 25, '#0284c7')}
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeWidth={1} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis
                        domain={[0, 25]}
                        ticks={[0, 5, 10, 15, 20, 25]}
                        tickFormatter={(val) => `${val} câu`}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        width={55}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<GrowthTooltip maxScore={25} dataKeyName="readingScore" data={chartData} skillName="Reading & Writing" />} />
                      <ReferenceLine
                        y={19}
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        label={{ position: 'insideTopRight', value: 'Mục tiêu: 19 câu (4 khiên)', fill: '#d97706', fontSize: 11, fontWeight: 700 }}
                      />
                      <Line
                        type="monotone"
                        name="Reading & Writing"
                        dataKey="readingScore"
                        stroke="url(#reading-growth-gradient)"
                        strokeWidth={3.5}
                        dot={(props: any) => renderCustomDot(props, chartData, 'readingScore', 25)}
                        activeDot={(props: any) => renderActiveDot(props, chartData, 'readingScore', 25)}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamStatsPage;
