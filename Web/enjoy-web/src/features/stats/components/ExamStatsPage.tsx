import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { VocabStatsResponse, TopicStat } from '../../exam/types';
import { learningApi } from '../../learning/services/learningApi';
import type { TopicWithProgress } from '../../learning/types/placementTest';
import { useLearningStore } from '../../learning/store/useLearningStore';
import {
  AcademicCapIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
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
  ReferenceLine
} from 'recharts';
import { VocabPracticeModal } from './VocabPracticeModal';
import { TargetSelectionScreen } from '../../placement-test/components/TargetSelectionScreen';
import type { UserExamTarget } from '../../learning/services/learningApi';

// ──────────────────────────────────────────────
// Fake data dùng cho Target, Progress, Grammar, Skill
// ──────────────────────────────────────────────
const FAKE_GROWTH_DATA = [
  { date: '01/10', listeningScore: 11, readingScore: 14 },
  { date: '08/10', listeningScore: 15, readingScore: 19 }, // +4 (+20% -> Xanh), +5 (+20% -> Xanh)
  { date: '15/10', listeningScore: 16, readingScore: 20 }, // +1 (+5% -> Cam), +1 (+4% -> Cam)
  { date: '22/10', listeningScore: 12, readingScore: 15 }, // -4 (-20% -> Đỏ), -5 (-20% -> Đỏ)
  { date: '29/10', listeningScore: 17, readingScore: 21 }, // +5 (+25% -> Xanh), +6 (+24% -> Xanh)
];

const FAKE_GRAMMAR_DATA = [
  { name: 'Have got', status: 'Mastered' as const },
  { name: 'To be', status: 'Mastered' as const },
  { name: 'There is / There are', status: 'Developing' as const },
  { name: 'Present simple', status: 'Weak' as const },
  { name: 'Can / Can\'t', status: 'Developing' as const },
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
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 min-w-[210px]">
      <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-500">{skillName}</span>
        <span className="text-xs font-medium text-gray-400">{currentPoint?.date}</span>
      </div>
      <div className="flex items-baseline gap-1.5 my-1.5">
        <span className="text-2xl font-display font-extrabold text-gray-800">{score}</span>
        <span className="text-xs font-semibold text-gray-400">/{maxScore} câu đúng</span>
        <span className="text-xs font-bold text-indigo-600 ml-auto bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          {Math.round((score / maxScore) * 100)}%
        </span>
      </div>
      {trendInfo ? (
        <div className={`mt-2 text-xs px-2.5 py-1.5 rounded-xl border font-medium ${trendInfo.badgeClass}`}>
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {trendInfo.label}
          </div>
          <div className="text-[11px] opacity-90 mt-0.5">{trendInfo.diffText}</div>
        </div>
      ) : (
        <div className="mt-2 text-xs px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-medium border border-blue-200">
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

export const calculateAchievementStats = (
  data: any[],
  targetListening: number = 16,
  targetReading: number = 19
): ExamAchievementStats => {
  const totalExams = data?.length || 0;
  if (totalExams === 0) {
    return { totalExams: 0, passedCount: 0, percentage: 0 };
  }
  const passedCount = data.filter(
    (e) => (e.listeningScore ?? 0) >= targetListening && (e.readingScore ?? 0) >= targetReading
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

export const calculateConsistencyStats = (
  data: any[],
  targetListening: number = 16,
  targetReading: number = 19
): ExamConsistencyStats => {
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

  // Đạt mục tiêu khi: Listening >= targetListening và Reading >= targetReading
  const targetPassedCount = recentExams.filter(
    (e) => (e.listeningScore ?? 0) >= targetListening && (e.readingScore ?? 0) >= targetReading
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
// Status Badge Component
// ──────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export const ExamStatsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [vocabStats, setVocabStats] = useState<VocabStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<string | null>(null);

  const [topicProgress, setTopicProgress] = useState<{
    totalTopics: number;
    completedTopics: number;
    percentage: number;
    remainingTopics: number;
    loading: boolean;
  }>({
    totalTopics: 0,
    completedTopics: 0,
    percentage: 0,
    remainingTopics: 0,
    loading: true,
  });

  const [userTarget, setUserTarget] = useState<UserExamTarget>({
    listeningShields: 4,
    readingShields: 4,
    listeningMinScore: 16,
    readingMinScore: 19,
  });
  const [isEditingTarget, setIsEditingTarget] = useState<boolean>(false);

  const fetchStats = () => {
    if (!user?.id) return;
    vocabStatsApi.getVocabStats(Number(user.id))
      .then(setVocabStats)
      .catch(() => setVocabStats({ noExamHistory: true, topics: [] }))
      .finally(() => setLoading(false));
  };

  const fetchUserTarget = async () => {
    const currentUserId = user?.id || (() => {
      try {
        const str = localStorage.getItem('enjoy_user');
        return str ? JSON.parse(str)?.id : null;
      } catch {
        return null;
      }
    })();
    if (currentUserId) {
      try {
        const t = await learningApi.getUserTarget(Number(currentUserId));
        if (t) setUserTarget(t);
      } catch (err) {
        console.warn('Lỗi tải mục tiêu học sinh:', err);
      }
    }
  };

  const fetchTopicProgress = async () => {
    const currentUserId = user?.id || (() => {
      try {
        const str = localStorage.getItem('enjoy_user');
        return str ? JSON.parse(str)?.id : null;
      } catch {
        return null;
      }
    })();

    if (!currentUserId) {
      setTopicProgress((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setTopicProgress((prev) => ({ ...prev, loading: true }));

      // 1. Xác định Level cần lấy thống kê (ưu tiên activeLevel trong store, fallback Starters hoặc level đầu tiên)
      let targetLevelId: number | null = null;
      const storeActiveLevel = useLearningStore.getState().activeLevel;
      if (storeActiveLevel?.id) {
        targetLevelId = storeActiveLevel.id;
      } else {
        const levelsRes = await learningApi.getLevels();
        const levels = Array.isArray(levelsRes) ? levelsRes : (levelsRes as any)?.data || [];
        if (levels.length > 0) {
          const starterLevel = levels.find((l: any) =>
            l.code?.toLowerCase().includes('starter') || l.name?.toLowerCase().includes('starter')
          ) || levels[0];
          targetLevelId = starterLevel.id;
        }
      }

      if (!targetLevelId) {
        setTopicProgress({
          totalTopics: 0,
          completedTopics: 0,
          percentage: 0,
          remainingTopics: 0,
          loading: false,
        });
        return;
      }

      // 2. Lấy topicsWithProgress từ learning-service
      const topicsRes = await learningApi.getTopicsWithProgress(targetLevelId, Number(currentUserId));
      const rawTopics: TopicWithProgress[] = Array.isArray(topicsRes) ? topicsRes : (topicsRes as any)?.data || [];

      // 3. Lọc các topic chưa bị ẩn (learningStatus !== 'HIDDEN')
      // Mỗi topic hợp lệ trong DB chứa vocab và/hoặc grammar, tính chung là 1 topic (1 progress unit)
      const activeTopics = rawTopics.filter((t) => t.learningStatus !== 'HIDDEN');
      const totalTopics = activeTopics.length;

      // 4. Topic hoàn thành khi đã hoàn thành 100% các session chưa skip
      const completedTopics = activeTopics.filter((t) => (t.progressPercent ?? 0) === 100).length;
      const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
      const remainingTopics = Math.max(0, totalTopics - completedTopics);

      setTopicProgress({
        totalTopics,
        completedTopics,
        percentage,
        remainingTopics,
        loading: false,
      });
    } catch (err) {
      console.error('Lỗi khi tải tiến độ chủ đề:', err);
      setTopicProgress((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTopicProgress();
    fetchUserTarget();

    const handleTargetUpdate = (e: any) => {
      if (e.detail) {
        setUserTarget(e.detail);
      }
    };
    window.addEventListener('enjoy_target_updated', handleTargetUpdate);
    return () => {
      window.removeEventListener('enjoy_target_updated', handleTargetUpdate);
    };
  }, [user?.id]);

  const totalWeak = vocabStats?.topics.reduce((s, t) => s + t.weakCount, 0) ?? 0;
  const totalCorrect = vocabStats?.topics.reduce((s, t) => s + t.correctCount, 0) ?? 0;
  const grammarWeak = FAKE_GRAMMAR_DATA.filter((g) => g.status !== 'Mastered').length;
  const grammarCorrect = FAKE_GRAMMAR_DATA.filter((g) => g.status === 'Mastered').length;

  const chartData = (vocabStats?.examHistories && vocabStats.examHistories.length > 0)
    ? vocabStats.examHistories
    : FAKE_GROWTH_DATA;

  const achievementStats = calculateAchievementStats(
    chartData,
    userTarget.listeningMinScore,
    userTarget.readingMinScore
  );
  const consistencyStats = calculateConsistencyStats(
    chartData,
    userTarget.listeningMinScore,
    userTarget.readingMinScore
  );

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* ── Header ── */}
      <div className="bg-white border-b-[3px] border-[#8c4513] shadow-sm px-6 py-5">
        <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">PRE-A1 STARTERS · Báo cáo học tập</p>
        <h1 className="text-2xl font-display font-extrabold text-text-main">Mỗi ngày học, một bước tiến</h1>
        <p className="text-sm text-text-muted mt-1">
          {((user as any)?.fullName || user?.username || 'Bé')}, cùng nhìn lại tiến bộ và chinh phục mục tiêu Pre-A1 nhé!
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col gap-10">

        {/* ══════════════════════════════════════════════════ */}
        {/* KHU VỰC 1: ĐO LƯỜNG                                */}
        {/* ══════════════════════════════════════════════════ */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3.5 pb-4 border-b-2 border-gray-200/80">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm shrink-0">
              <ChartBarIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 tracking-tight">
                Đo lường
              </h2>
              <p className="text-xs md:text-sm text-text-muted mt-0.5 font-medium">
                Mục tiêu điểm số, tỉ lệ hoàn thành và xu hướng tăng trưởng
              </p>
            </div>
          </div>

          {/* ── Row 1: Target + Progress ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Target */}
            <div className="bg-amber-50 rounded-3xl border-2 border-amber-300 shadow-[0_8px_30px_rgb(245,158,11,0.08)] p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-medium text-lg text-amber-900">Target</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">Mục tiêu kỳ thi</span>
                  <button
                    type="button"
                    id="btn-edit-target"
                    onClick={() => setIsEditingTarget(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Thay đổi mục tiêu khiên"
                  >
                    Thay đổi
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-amber-200/60">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                    <SpeakerWaveIcon className="w-5 h-5 text-amber-600" />
                    Listening
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <ShieldCheckIcon
                          key={i}
                          className={`w-6 h-6 ${i < userTarget.listeningShields ? 'text-amber-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg">
                      {userTarget.listeningShields} khiên (tối thiểu {userTarget.listeningMinScore} điểm)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                    <BookOpenIcon className="w-5 h-5 text-amber-600" />
                    Reading + Writing
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <ShieldCheckIcon
                          key={i}
                          className={`w-6 h-6 ${i < userTarget.readingShields ? 'text-amber-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg">
                      {userTarget.readingShields} khiên (tối thiểu {userTarget.readingMinScore} điểm)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-[#f0f9f6] rounded-3xl border-2 border-teal-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-lg text-teal-900">Progress</p>
                <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                  <SparklesIcon className="w-4 h-4" />{' '}
                  {topicProgress.loading
                    ? 'Đang tải...'
                    : topicProgress.percentage === 100
                      ? 'Đã hoàn thành'
                      : topicProgress.percentage > 0
                        ? 'Đang tiến bộ'
                        : 'Bắt đầu học'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-5xl font-display font-bold text-teal-800">
                  {topicProgress.percentage}%
                </p>
                <p className="text-sm font-medium text-teal-700/80">
                  {topicProgress.completedTopics}/{topicProgress.totalTopics} bài học đã hoàn thành
                </p>
              </div>

              <div className="w-full bg-teal-900/10 rounded-full h-3 mb-3">
                <div
                  className="bg-teal-700 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${topicProgress.percentage}%` }}
                />
              </div>

              <p className="text-xs text-teal-700 font-medium">
                {topicProgress.totalTopics === 0 && !topicProgress.loading
                  ? 'Chưa có bài học nào trong lộ trình'
                  : topicProgress.remainingTopics === 0 && topicProgress.totalTopics > 0
                    ? 'Chúc mừng! Bé đã hoàn thành toàn bộ lộ trình!'
                    : `Chỉ còn ${topicProgress.remainingTopics} bài học nữa để hoàn thành lộ trình!`}
              </p>
            </div>
          </div>

          {/* ── Row 1.5: Target Achievement & Score Consistency (2 div riêng biệt) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Div 1: Target Achievement */}
            <div className="bg-white rounded-3xl border-2 border-indigo-200/90 shadow-[0_8px_30px_rgb(99,102,241,0.06)] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckBadgeIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-800">Target Achievement</h3>
                </div>

                <div className="flex items-baseline gap-2.5 mt-3">
                  <span className="text-5xl font-display font-extrabold text-indigo-700">
                    {achievementStats.percentage}%
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    {achievementStats.passedCount}/{achievementStats.totalExams} bài đạt mục tiêu
                  </span>
                </div>
              </div>
            </div>

            {/* Div 2: Score Consistency */}
            <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-[0_8px_30px_rgb(245,158,11,0.06)] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <ChartBarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-800">Score Consistency</h3>
                    <p className="text-xs text-text-muted">Độ lệch chuẩn của 5 bài gần nhất</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2.5 mt-3 mb-4">
                  <span className="text-5xl font-display font-extrabold text-amber-700">
                    ±{consistencyStats.stdDev.toString().replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Dưới độ lệch chuẩn có kết luận */}
              <div>
                {consistencyStats.isReadyForRealExam ? (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                    <CheckBadgeIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Đã sẵn sàng để Thử sức thi thật</p>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        5 bài gần nhất đạt target và độ lệch chuẩn thấp (≤ 3 câu).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Chưa sẵn sàng, cần luyện tập thêm</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Cần đạt target 5 bài gần nhất và giữ độ lệch chuẩn ≤ 3 câu.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Row 2: Biểu đồ Tăng trưởng ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Listening Chart */}
            <div className="bg-white rounded-3xl border-2 border-blue-300 shadow-[0_8px_30px_rgb(59,130,246,0.1)] p-5 relative hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-text-main">Listening Growth</h2>
                <SpeakerWaveIcon className="w-5 h-5 text-blue-500 shrink-0" />
              </div>

              {/* Chú thích màu đoạn đơn giản */}
              <div className="flex items-center gap-4 text-xs text-text-muted mb-3 pb-2 border-b border-gray-100">
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-4 h-1 rounded-full bg-emerald-500 inline-block"></span>
                  Tiến bộ
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-4 h-1 rounded-full bg-amber-500 inline-block"></span>
                  Ổn định
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-4 h-1 rounded-full bg-red-500 inline-block"></span>
                  Giảm
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 15, bottom: 5, left: 10 }}>
                    <defs>
                      <linearGradient id="listening-growth-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {generateGradientStops(chartData, 'listeningScore', 20, '#3b82f6')}
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeWidth={1.5} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 20]}
                      ticks={[0, 5, 10, 15, 20]}
                      tickFormatter={(val) => `${val} câu`}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      width={60}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<GrowthTooltip maxScore={20} dataKeyName="listeningScore" data={chartData} skillName="Listening" />} />
                    <ReferenceLine
                      y={userTarget.listeningMinScore}
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      label={{
                        position: 'insideTopRight',
                        value: `Mục tiêu: ${userTarget.listeningMinScore} câu (${userTarget.listeningShields} khiên)`,
                        fill: '#f59e0b',
                        fontSize: 12,
                        fontWeight: 700
                      }}
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

            {/* Reading & Writing Chart */}
            <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-[0_8px_30px_rgb(16,185,129,0.1)] p-5 relative hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-text-main">Reading & Writing Growth</h2>
                <BookOpenIcon className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>

              {/* Chú thích màu đoạn đơn giản */}
              <div className="flex items-center gap-4 text-xs text-text-muted mb-3 pb-2 border-b border-gray-100">
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-4 h-1 rounded-full bg-emerald-500 inline-block"></span>
                  Tiến bộ
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-4 h-1 rounded-full bg-amber-500 inline-block"></span>
                  Ổn định
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-4 h-1 rounded-full bg-red-500 inline-block"></span>
                  Giảm
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 15, bottom: 5, left: 10 }}>
                    <defs>
                      <linearGradient id="reading-growth-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {generateGradientStops(chartData, 'readingScore', 25, '#10b981')}
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeWidth={1.5} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 25]}
                      ticks={[0, 5, 10, 15, 20, 25]}
                      tickFormatter={(val) => `${val} câu`}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      width={60}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<GrowthTooltip maxScore={25} dataKeyName="readingScore" data={chartData} skillName="Reading & Writing" />} />
                    <ReferenceLine
                      y={userTarget.readingMinScore}
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      label={{
                        position: 'insideTopRight',
                        value: `Mục tiêu: ${userTarget.readingMinScore} câu (${userTarget.readingShields} khiên)`,
                        fill: '#f59e0b',
                        fontSize: 12,
                        fontWeight: 700
                      }}
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
        </section>

        {/* ══════════════════════════════════════════════════ */}
        {/* KHU VỰC 2: LUYỆN TẬP                               */}
        {/* ══════════════════════════════════════════════════ */}
        <section className="flex flex-col gap-6 pt-4">
          <div className="flex items-center gap-3.5 pb-4 border-b-2 border-gray-200/80">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm shrink-0">
              <AcademicCapIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 tracking-tight">
                Luyện tập
              </h2>
              <p className="text-xs md:text-sm text-text-muted mt-0.5 font-medium">
                Củng cố và rèn luyện các chủ đề từ vựng & cấu trúc ngữ pháp cần cải thiện
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
                        <span className="text-[11px] font-medium text-gray-400">{vocabStats?.topics.length || 0} nội dung</span>
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
                                className="px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
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

              {/* Grammar Table (fake data) */}
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
        </section>

        {/* ── Luyện tập bổ trợ (Minigames) ── */}
        <div
          onClick={() => navigate('/practice/supplementary')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-6 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-1"
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
                <h3 className="text-lg font-display font-extrabold text-white">Luyện tập bổ trợ</h3>
                <p className="text-sm text-white/70 mt-0.5">
                  Trò chơi nghe &amp; chọn ảnh · Điền chữ cái · Ôn từ vựng mọi chủ đề
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="flex gap-1">
                <span className="text-xl">🎧</span>
                <span className="text-xl">🔡</span>
              </div>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Bắt đầu</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modal Luyện tập từ vựng sai theo Topic ── */}
      {selectedPracticeTopic && user?.id && (
        <VocabPracticeModal
          userId={Number(user.id)}
          topicName={selectedPracticeTopic}
          onClose={() => setSelectedPracticeTopic(null)}
          onTopicUpdated={fetchStats}
        />
      )}

      {/* ── Modal Thay đổi mục tiêu khiên ── */}
      {isEditingTarget && user?.id && (
        <TargetSelectionScreen
          userId={Number(user.id)}
          initialListeningShields={userTarget.listeningShields}
          initialReadingShields={userTarget.readingShields}
          isModal={true}
          onConfirm={(updated) => {
            setUserTarget(updated);
            setIsEditingTarget(false);
          }}
          onCancel={() => setIsEditingTarget(false)}
        />
      )}
    </div>
  );
};

export default ExamStatsPage;
