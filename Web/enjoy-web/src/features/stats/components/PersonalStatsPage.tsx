import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { learningApi, type UserStats, type DailyStudyTime, type RecentSession } from '../../learning/services/learningApi';
import { familyApi, type FamilyMember } from '../../profile/services/familyApi';
import { FamilyManagementModal } from '../../profile/components/FamilyManagementModal';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { 
  ArrowPathIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  BookOpenIcon,
  PencilSquareIcon,
  LanguageIcon,
  AcademicCapIcon,
  UserGroupIcon,
  HeartIcon,
  PlusIcon,
  CheckBadgeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const DEFAULT_WEEKLY_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

export interface SkillScores {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  vocabGrammar: number;
}

export interface SkillDefinition {
  key: keyof SkillScores;
  index: number;
  nameVi: string;
  nameEn: string;
  color: string;
  bgLight: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  { 
    key: 'listening', 
    index: 1, 
    nameVi: 'Nghe', 
    nameEn: 'Listening', 
    color: '#3b82f6', 
    bgLight: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: SpeakerWaveIcon,
  },
  { 
    key: 'speaking', 
    index: 2, 
    nameVi: 'Nói', 
    nameEn: 'Speaking', 
    color: '#ff5e97', 
    bgLight: 'bg-pink-50 text-[#ff5e97] border-pink-200',
    icon: MicrophoneIcon,
  },
  { 
    key: 'reading', 
    index: 3, 
    nameVi: 'Đọc', 
    nameEn: 'Reading', 
    color: '#10b981', 
    bgLight: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: BookOpenIcon,
  },
  { 
    key: 'writing', 
    index: 4, 
    nameVi: 'Viết', 
    nameEn: 'Writing', 
    color: '#8b5cf6', 
    bgLight: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: PencilSquareIcon,
  },
  { 
    key: 'vocabGrammar', 
    index: 5, 
    nameVi: 'Từ vựng & Ngữ pháp', 
    nameEn: 'Vocab & Grammar', 
    color: '#f59e0b', 
    bgLight: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: LanguageIcon,
  },
];

// Component Spider Chart 5 Góc (Pentagon Radar Chart đa sắc thái hài hòa)
interface SpiderChart5DProps {
  currentSkills: SkillScores;
  previousSkills?: SkillScores;
  currentLabel?: string;
  previousLabel?: string;
  showComparison?: boolean;
  size?: number;
  highlightedSkill?: string | null;
  onHoverSkill?: (skillKey: string | null) => void;
}

const SpiderChart5D: React.FC<SpiderChart5DProps> = ({
  currentSkills,
  previousSkills,
  currentLabel = 'Ngày hiện tại',
  previousLabel = 'Ngày trước đó',
  showComparison = false,
  size = 350,
  highlightedSkill,
  onHoverSkill,
}) => {
  const center = size / 2;
  const radius = (size / 2) - 56;

  // 5 đỉnh ngũ giác đều bắt đầu từ -90 độ (Đỉnh 1: Listening)
  const getPointCoordinates = (index: number, score: number, maxScore: number = 100) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
    const r = (Math.max(0, Math.min(score, maxScore)) / maxScore) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const getPolygonPoints = (skills: SkillScores) => {
    return SKILL_DEFINITIONS.map((def, idx) => {
      const pt = getPointCoordinates(idx, skills[def.key]);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(' ');
  };

  const currentPointsStr = getPolygonPoints(currentSkills);
  const previousPointsStr = previousSkills ? getPolygonPoints(previousSkills) : '';

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible max-w-full"
      >
        <defs>
          {/* Vùng màu tươi sáng cho Ngày Hiện Tại (Hồng Duolingo) */}
          <radialGradient id="currentDateGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5e97" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff5e97" stopOpacity="0.15" />
          </radialGradient>

          {/* Vùng màu xanh dương cho Ngày Trước Đó (Xanh Blue/Indigo) */}
          <radialGradient id="prevDateGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ff5e97" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Lưới ngũ giác đều các mức % với nền xen kẽ nhẹ */}
        {gridLevels.map((lvl) => {
          const pts = Array.from({ length: 5 }).map((_, idx) => {
            const pt = getPointCoordinates(idx, lvl);
            return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
          }).join(' ');

          return (
            <g key={lvl}>
              <polygon
                points={pts}
                fill={lvl === 100 ? '#f8fafc' : lvl === 60 ? '#f1f5f9' : 'none'}
                stroke="#cbd5e1"
                strokeWidth={lvl === 100 ? '1.6' : '1'}
                strokeDasharray={lvl === 100 ? 'none' : '3 3'}
              />
              <text
                x={center + 4}
                y={center - (lvl / 100) * radius + 3}
                fontSize="8.5"
                fontWeight="700"
                fill="#94a3b8"
              >
                {lvl}%
              </text>
            </g>
          );
        })}

        {/* 2. Các trục từ tâm tới 5 góc với màu tương ứng từng kỹ năng */}
        {SKILL_DEFINITIONS.map((def, idx) => {
          const pt = getPointCoordinates(idx, 100);
          const isHighlighted = highlightedSkill === def.key;

          return (
            <line
              key={def.key}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke={isHighlighted ? def.color : '#94a3b8'}
              strokeWidth={isHighlighted ? '2' : '1.2'}
              strokeDasharray={isHighlighted ? 'none' : '2 2'}
              className="transition-all duration-200"
            />
          );
        })}

        {/* 3. Lớp Biểu đồ Ngày Trước Đó (Màu xanh dương) */}
        {showComparison && previousSkills && (
          <g className="transition-all duration-300">
            <polygon
              points={previousPointsStr}
              fill="url(#prevDateGrad)"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {SKILL_DEFINITIONS.map((def, idx) => {
              const pt = getPointCoordinates(idx, previousSkills[def.key]);
              return (
                <circle
                  key={`prev-dot-${def.key}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              );
            })}
          </g>
        )}

        {/* 4. Lớp Biểu đồ Ngày Hiện Tại (Màu hồng chủ đạo) */}
        <g className="transition-all duration-300">
          <polygon
            points={currentPointsStr}
            fill="url(#currentDateGrad)"
            stroke="#ff5e97"
            strokeWidth="2.5"
            filter="url(#softGlow)"
          />

          {SKILL_DEFINITIONS.map((def, idx) => {
            const score = currentSkills[def.key];
            const pt = getPointCoordinates(idx, score);
            const isHighlighted = highlightedSkill === def.key;

            return (
              <circle
                key={`curr-dot-${def.key}`}
                cx={pt.x}
                cy={pt.y}
                r={isHighlighted ? '6.5' : '4.5'}
                fill="#ff5e97"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => onHoverSkill?.(def.key)}
                onMouseLeave={() => onHoverSkill?.(null)}
              />
            );
          })}
        </g>

        {/* 5. Nhãn 5 góc có màu sắc phân biệt từng kỹ năng */}
        {SKILL_DEFINITIONS.map((def, idx) => {
          const ptOuter = getPointCoordinates(idx, 118);
          const isHighlighted = highlightedSkill === def.key;
          const currScore = currentSkills[def.key];
          const prevScore = previousSkills ? previousSkills[def.key] : null;

          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          let xOffset = 0;
          let yOffset = 0;

          if (idx === 0) {
            textAnchor = 'middle';
            yOffset = -8;
          } else if (idx === 1) {
            textAnchor = 'start';
            xOffset = 10;
            yOffset = -2;
          } else if (idx === 2) {
            textAnchor = 'start';
            xOffset = 10;
            yOffset = 8;
          } else if (idx === 3) {
            textAnchor = 'end';
            xOffset = -10;
            yOffset = 8;
          } else if (idx === 4) {
            textAnchor = 'end';
            xOffset = -10;
            yOffset = -2;
          }

          return (
            <g
              key={`label-${def.key}`}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => onHoverSkill?.(def.key)}
              onMouseLeave={() => onHoverSkill?.(null)}
            >
              <text
                x={ptOuter.x + xOffset}
                y={ptOuter.y + yOffset}
                textAnchor={textAnchor}
              >
                <tspan
                  fill={isHighlighted ? def.color : '#1e293b'}
                  fontWeight="800"
                  fontSize="12"
                >
                  {def.index}. {def.nameVi}
                </tspan>
                <tspan
                  x={ptOuter.x + xOffset}
                  dy="13"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                >
                  ({def.nameEn})
                </tspan>
                <tspan
                  x={ptOuter.x + xOffset}
                  dy="13"
                  fill={isHighlighted ? def.color : '#0f172a'}
                  fontWeight="800"
                  fontSize="11"
                >
                  {currScore}% {showComparison && prevScore !== null ? `(${prevScore}%)` : ''}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>

      {/* Chú giải màu sắc trực quan */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs font-bold">
        <div className="flex items-center gap-2 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-[#ff5e97]">
          <span className="w-3 h-3 rounded-full bg-[#ff5e97] shadow-xs" />
          <span>{currentLabel}</span>
        </div>
        {showComparison && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-600">
            <span className="w-3 h-3 rounded-full bg-blue-500 border border-dashed border-blue-600 shadow-xs" />
            <span>{previousLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const PersonalStatsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Phụ huynh và con cái
  const [isParent, setIsParent] = useState<boolean>(user?.role === 'ROLE_PARENT');
  const [linkedChildren, setLinkedChildren] = useState<FamilyMember[]>([]);
  const [selectedChild, setSelectedChild] = useState<FamilyMember | null>(null);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState<boolean>(false);

  // Tab chuyển đổi: 'current' (Biểu đồ hiện tại) | 'compare' (So sánh 2 ngày)
  const [activeSkillTab, setActiveSkillTab] = useState<'current' | 'compare'>('current');

  // Bộ chọn ngày so sánh
  const [currentDate, setCurrentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [previousDate, setPreviousDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  
  // Highlight kỹ năng khi hover
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Dữ liệu kỹ năng (Mặc định 0 khi chưa tải hoặc chưa học)
  const [skillsCurrent, setSkillsCurrent] = useState<SkillScores>({
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
    vocabGrammar: 0,
  });

  const [skillsPrevious, setSkillsPrevious] = useState<SkillScores>({
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
    vocabGrammar: 0,
  });

  const [skillsLoading, setSkillsLoading] = useState<boolean>(false);

  useEffect(() => {
    initPageData();
  }, [user?.role]);

  const initPageData = async () => {
    const isParentRole = user?.role === 'ROLE_PARENT';
    setIsParent(isParentRole);

    if (isParentRole) {
      setLoading(true);
      try {
        const familyData = await familyApi.getOverview();
        const children = familyData.linkedMembers || [];
        setLinkedChildren(children);

        const childIdParam = searchParams.get('childId');
        let targetChild: FamilyMember | null = null;
        if (childIdParam) {
          targetChild = children.find(c => c.studentId === Number(childIdParam)) || null;
        }

        setSelectedChild(targetChild);

        if (targetChild) {
          await Promise.all([
            fetchStats(targetChild.studentId),
            fetchSkillStats(currentDate, previousDate, targetChild.studentId)
          ]);
        } else {
          await Promise.all([
            fetchStats(),
            fetchSkillStats(currentDate, previousDate)
          ]);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu gia đình:", err);
        setLoading(false);
      }
    } else {
      await Promise.all([
        fetchStats(),
        fetchSkillStats(currentDate, previousDate)
      ]);
    }
  };

  const handleSelectSelf = () => {
    setSelectedChild(null);
    setSearchParams({});
    fetchStats();
    fetchSkillStats(currentDate, previousDate);
  };

  const handleSelectChild = (child: FamilyMember) => {
    setSelectedChild(child);
    setSearchParams({ childId: String(child.studentId) });
    fetchStats(child.studentId);
    fetchSkillStats(currentDate, previousDate, child.studentId);
  };

  const fetchStats = async (targetUserId?: number) => {
    setLoading(true);
    try {
      const res = await learningApi.getUserStats(targetUserId);
      const data = (res as any)?.data !== undefined ? (res as any).data : res;
      setStats(data);
    } catch (err) {
      console.error("Lỗi khi tải thống kê học tập:", err);
      setStats({
        totalCompletedLessons: 0,
        weeklyStudyMinutes: 0,
        dailyStudyTime: DEFAULT_WEEKLY_DAYS.map(day => ({
          day,
          date: '',
          minutes: 0,
          targetMinutes: 20
        })),
        recentSessions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillStats = async (curr: string, prev: string, targetUserId?: number) => {
    setSkillsLoading(true);
    try {
      const activeUserId = targetUserId ?? (isParent ? selectedChild?.studentId : undefined);
      const res = await learningApi.getSkillStats(curr, prev, activeUserId);
      const data = (res as any)?.data !== undefined ? (res as any).data : res;
      if (data?.currentSkills) {
        setSkillsCurrent(data.currentSkills);
      }
      if (data?.previousSkills) {
        setSkillsPrevious(data.previousSkills);
      }
    } catch (err) {
      console.warn("Lỗi khi tải thống kê kỹ năng từ API:", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Nút chọn nhanh độ lùi ngày (7 ngày trước, 14 ngày trước, 30 ngày trước)
  const handleQuickOffsetDays = (days: number) => {
    const curr = new Date(currentDate);
    const prev = new Date(curr);
    prev.setDate(curr.getDate() - days);

    const prevStr = prev.toISOString().split('T')[0];
    setPreviousDate(prevStr);
    fetchSkillStats(currentDate, prevStr, isParent ? selectedChild?.studentId : undefined);
  };

  const handleApplyDates = () => {
    fetchSkillStats(currentDate, previousDate, isParent ? selectedChild?.studentId : undefined);
  };

  const totalWeeklyMinutes = stats?.weeklyStudyMinutes ?? 0;
  const dailyData: DailyStudyTime[] = stats?.dailyStudyTime?.length 
    ? stats.dailyStudyTime 
    : DEFAULT_WEEKLY_DAYS.map(day => ({ day, date: '', minutes: 0, targetMinutes: 20 }));

  const maxMinutesInChart = Math.max(...dailyData.map(d => d.minutes), 30);
  const recentSessions: RecentSession[] = stats?.recentSessions || [];

  const calcAverage = (skills: SkillScores) => {
    const scores = [skills.listening, skills.speaking, skills.reading, skills.writing, skills.vocabGrammar];
    const learnedScores = scores.filter(s => s > 0);
    if (learnedScores.length === 0) return 0;
    return Math.round(learnedScores.reduce((a, b) => a + b, 0) / learnedScores.length);
  };

  const currentAvg = calcAverage(skillsCurrent);
  const previousAvg = calcAverage(skillsPrevious);
  const avgDelta = currentAvg - previousAvg;

  const formatDateVN = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split('-').reverse().join('/');
  };

  if (loading && !stats) {
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <ArrowPathIcon className="w-8 h-8 text-[#ff5e97] animate-spin" />
        <p className="text-sm font-bold text-slate-600">Đang tải thống kê học tập...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-8 select-none">
      
      {/* 1. Header Trang & Bộ chọn Con dành cho Phụ huynh */}
      <div className="border-b border-slate-200 pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#ff5e97] uppercase tracking-wider flex items-center gap-1.5">
                {isParent ? (
                  <>
                    <HeartIcon className="w-4 h-4 text-primary stroke-[2.5]" />
                    Dành cho Phụ Huynh • Giám sát & Đồng hành
                  </>
                ) : (
                  'Phân tích & Tiến trình'
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isParent ? 'THEO DÕI NĂNG LỰC & TIẾN ĐỘ HỌC CỦA CON' : 'THỐNG KÊ HỌC TẬP CÁ NHÂN'}
            </h1>
            <p className="text-sm text-slate-600">
              {isParent
                ? 'Xem chi tiết đánh giá năng lực 5 kỹ năng, thời lượng học và các bài học gần đây của các con'
                : 'Theo dõi chi tiết thời lượng học tập và năng lực 5 kỹ năng của bạn'}
            </p>
          </div>

          {isParent && (
            <button
              type="button"
              onClick={() => setIsFamilyModalOpen(true)}
              className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white border-2 border-primary/30 hover:border-primary text-primary font-display font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-xs hover:bg-pink-50/50 transition cursor-pointer"
            >
              <UserGroupIcon className="w-4 h-4 stroke-[2.5]" />
              QUẢN LÝ GIA ĐÌNH
            </button>
          )}
        </div>

        {/* Thanh chọn hồ sơ con cái và bản thân */}
        {isParent && (
          <div className="bg-gradient-to-r from-pink-50/60 via-slate-50 to-pink-50/40 border-2 border-primary/20 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5 text-primary stroke-[2.5]" />
                <span className="text-xs font-display font-black text-slate-800 uppercase tracking-wide">
                  Chọn hồ sơ xem thống kê ({linkedChildren.length} bé đã liên kết):
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Tùy chọn 1: Bản thân phụ huynh */}
              <button
                type="button"
                onClick={handleSelectSelf}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedChild === null
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border-border-main hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedChild === null ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  <UserIcon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-display font-black leading-tight ${selectedChild === null ? 'text-white' : 'text-slate-800'}`}>
                    Bản thân (Tài khoản của tôi)
                  </p>
                  <p className={`text-[10px] font-medium leading-tight ${selectedChild === null ? 'text-white/80' : 'text-slate-400'}`}>
                    {user?.email || 'Phụ huynh'}
                  </p>
                </div>
                {selectedChild === null && (
                  <CheckBadgeIcon className="w-5 h-5 text-white shrink-0 ml-1" />
                )}
              </button>

              {/* Tùy chọn các con đã liên kết */}
              {linkedChildren.map((child) => {
                const isSelected = selectedChild?.studentId === child.studentId;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleSelectChild(child)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md scale-[1.02]'
                        : 'bg-white text-slate-700 border-border-main hover:border-primary/40 hover:bg-pink-50/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-primary-soft text-primary'
                    }`}>
                      <AcademicCapIcon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-display font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {child.studentName || 'Học sinh'}
                      </p>
                      <p className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {child.studentEmail}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckBadgeIcon className="w-5 h-5 text-white shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsFamilyModalOpen(true)}
                className="px-3.5 py-2.5 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary text-primary text-xs font-display font-bold flex items-center gap-1.5 bg-white/60 hover:bg-pink-50/50 transition cursor-pointer"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Thêm con
              </button>
            </div>

            {/* Thông báo trạng thái đang xem hồ sơ nào */}
            <div className="text-[11px] font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-primary/20 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-primary shrink-0" />
              {selectedChild ? (
                <span>
                  Đang hiển thị kết quả học tập & đánh giá 5 kỹ năng của bé: <strong className="text-primary">{selectedChild.studentName || selectedChild.studentEmail}</strong>
                </span>
              ) : (
                <span>
                  Đang hiển thị thống kê học tập cá nhân của: <strong className="text-slate-900">{user?.username || user?.email} (Tài khoản phụ huynh)</strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-white to-pink-50/40 border border-pink-100 rounded-3xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bài hoàn thành</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {stats?.totalCompletedLessons ?? 0}
          </p>
          <p className="text-xs text-slate-400">bài học đã vượt qua</p>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/40 border border-blue-100 rounded-3xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thời lượng tuần</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {totalWeeklyMinutes} <span className="text-sm font-normal text-slate-500">phút</span>
          </p>
          <p className="text-xs text-slate-400">trung bình {Math.round(totalWeeklyMinutes / 7)} phút / ngày</p>
        </div>
      </div>

      {/* 3. Biểu đồ thời gian học tập 7 ngày */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Thời gian học 7 ngày qua
            </h3>
            <p className="text-xs text-slate-500">Mục tiêu hàng ngày: 20 phút</p>
          </div>
          <span className="text-xs font-bold text-[#ff5e97] bg-pink-50 border border-pink-200 px-3 py-1 rounded-xl">
            Tổng: {totalWeeklyMinutes} phút
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-3 items-end h-40">
          {dailyData.map((item, idx) => {
            const heightPercent = maxMinutesInChart > 0 
              ? Math.max(item.minutes > 0 ? 8 : 2, Math.round((item.minutes / maxMinutesInChart) * 100))
              : 2;
            const isTargetReached = item.minutes >= item.targetMinutes;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[11px] font-bold text-slate-700">
                  {item.minutes}p
                </span>

                <div className="w-full max-w-[34px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-24">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      item.minutes === 0
                        ? 'bg-slate-200'
                        : isTargetReached 
                          ? 'bg-[#ff5e97]' 
                          : 'bg-blue-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PHẦN ĐÁNH GIÁ NĂNG LỰC 5 KỸ NĂNG (2 TAB: HIỆN TẠI & SO SÁNH 2 NGÀY)     */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        
        {/* Header & 2 Tabs Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
              Đánh giá năng lực 5 kỹ năng
              {skillsLoading && <ArrowPathIcon className="w-4 h-4 text-primary animate-spin" />}
            </h2>
            <p className="text-xs text-slate-500">
              {activeSkillTab === 'current'
                ? 'Biểu đồ năng lực hiện tại: Nghe, Nói, Đọc, Viết, Từ vựng & Ngữ pháp'
                : 'Đối sánh năng lực giữa 2 mốc ngày để theo dõi sự tiến bộ'}
            </p>
          </div>

          {/* 2 Tabs Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setActiveSkillTab('current')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSkillTab === 'current'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Biểu đồ hiện tại
            </button>
            <button
              onClick={() => setActiveSkillTab('compare')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSkillTab === 'compare'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              So sánh 2 ngày
            </button>
          </div>
        </div>

        {/* ==================== TAB 1: BIỂU ĐỒ HIỆN TẠI (1 BIỂU ĐỒ) ==================== */}
        {activeSkillTab === 'current' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Biểu đồ hiện tại trung tâm */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-pink-50/25 to-slate-50/80 border border-pink-100 flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-pink-100 pb-3 mb-2 text-xs">
                <span className="font-extrabold text-[#e03a74] uppercase">
                  Năng lực hiện tại (Ngày {formatDateVN(currentDate)})
                </span>
                <span className="text-[#ff5e97] bg-pink-100 px-3 py-1 rounded-xl font-bold">
                  Điểm TB: {currentAvg} / 100
                </span>
              </div>

              <SpiderChart5D
                currentSkills={skillsCurrent}
                currentLabel={`Hiện tại (${formatDateVN(currentDate)})`}
                showComparison={false}
                size={360}
                highlightedSkill={hoveredSkill}
                onHoverSkill={setHoveredSkill}
              />
            </div>

            {/* 5 Thẻ chi tiết kỹ năng hiện tại */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Chi tiết điểm số 5 kỹ năng hiện tại
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Rà chuột để làm nổi bật trên biểu đồ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SKILL_DEFINITIONS.map((def) => {
                  const Icon = def.icon;
                  const score = skillsCurrent[def.key];
                  const isHovered = hoveredSkill === def.key;

                  return (
                    <div
                      key={def.key}
                      onMouseEnter={() => setHoveredSkill(def.key)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isHovered
                          ? 'bg-white shadow-sm ring-2 ring-pink-200 scale-[1.01]'
                          : 'bg-slate-50/80 hover:bg-white hover:border-slate-300'
                      }`}
                      style={{ borderColor: isHovered ? def.color : undefined }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${def.color}15`, color: def.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                              {def.index}. {def.nameVi}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {def.nameEn}
                            </span>
                          </div>
                        </div>

                        <span className="text-sm font-black text-slate-800">
                          {score}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${score}%`, backgroundColor: def.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SO SÁNH 2 NGÀY (2 BIỂU ĐỒ SONG SONG) ==================== */}
        {activeSkillTab === 'compare' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form chọn 2 ngày so sánh */}
            <div className="bg-gradient-to-r from-pink-50/40 via-purple-50/20 to-blue-50/40 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  <CalendarDaysIcon className="w-4 h-4 text-[#ff5e97]" />
                  <span>Chọn 2 ngày để so sánh</span>
                </div>

                {/* Nút lùi ngày nhanh */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium">So sánh nhanh:</span>
                  <button
                    onClick={() => handleQuickOffsetDays(7)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#ff5e97] hover:text-[#ff5e97] font-bold transition-all cursor-pointer"
                  >
                    7 ngày trước
                  </button>
                  <button
                    onClick={() => handleQuickOffsetDays(14)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#ff5e97] hover:text-[#ff5e97] font-bold transition-all cursor-pointer"
                  >
                    14 ngày trước
                  </button>
                  <button
                    onClick={() => handleQuickOffsetDays(30)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#ff5e97] hover:text-[#ff5e97] font-bold transition-all cursor-pointer"
                  >
                    30 ngày trước
                  </button>
                </div>
              </div>

              {/* Ô nhập ngày */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                    <span>Ngày trước đó</span>
                  </label>
                  <input
                    type="date"
                    value={previousDate}
                    onChange={(e) => setPreviousDate(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ff5e97] flex items-center gap-1.5">
                    <span>Ngày hiện tại</span>
                  </label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff5e97] shadow-xs"
                  />
                </div>

                <div className="lg:col-span-1">
                  <button
                    type="button"
                    onClick={handleApplyDates}
                    className="w-full bg-gradient-to-r from-[#ff5e97] to-[#e03a74] hover:opacity-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowsRightLeftIcon className="w-4 h-4" />
                    <span>Cập nhật so sánh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Thẻ tóm tắt kết quả so sánh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase">Điểm TB Ngày trước đó</span>
                  <p className="text-2xl font-black text-blue-900">{previousAvg} <span className="text-sm font-semibold">/100</span></p>
                  <span className="text-[11px] font-bold text-blue-600">{formatDateVN(previousDate)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#ff5e97] uppercase">Điểm TB Ngày hiện tại</span>
                  <p className="text-2xl font-black text-[#e03a74]">{currentAvg} <span className="text-sm font-semibold">/100</span></p>
                  <span className="text-[11px] font-bold text-[#ff5e97]">{formatDateVN(currentDate)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase">Mức tăng trưởng</span>
                  <div className="flex items-center gap-1.5">
                    <p className={`text-2xl font-black ${avgDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {avgDelta >= 0 ? `+${avgDelta}%` : `${avgDelta}%`}
                    </p>
                    {avgDelta >= 0 ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {avgDelta >= 0 ? 'Năng lực tiến bộ' : 'Cần rèn luyện thêm'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2 Biểu đồ Spider Chart so sánh trực quan cạnh nhau */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Biểu đồ 1: Ngày trước đó (Màu xanh dương) */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-blue-50/30 to-slate-50 border border-blue-200 flex flex-col items-center">
                <div className="w-full flex items-center justify-between border-b border-blue-100 pb-3 mb-2 text-xs">
                  <span className="font-extrabold text-blue-900 uppercase">
                    1. Ngày trước đó
                  </span>
                  <span className="text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-lg font-bold">
                    {formatDateVN(previousDate)}
                  </span>
                </div>

                <SpiderChart5D
                  currentSkills={skillsPrevious}
                  currentLabel={`Ngày ${formatDateVN(previousDate)}`}
                  showComparison={false}
                  size={340}
                  highlightedSkill={hoveredSkill}
                  onHoverSkill={setHoveredSkill}
                />
              </div>

              {/* Biểu đồ 2: Ngày hiện tại (Màu hồng tươi) */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-pink-50/30 to-slate-50 border border-pink-200 flex flex-col items-center">
                <div className="w-full flex items-center justify-between border-b border-pink-100 pb-3 mb-2 text-xs">
                  <span className="font-extrabold text-[#e03a74] uppercase">
                    2. Ngày hiện tại
                  </span>
                  <span className="text-[#ff5e97] bg-pink-100 px-2.5 py-0.5 rounded-lg font-bold">
                    {formatDateVN(currentDate)}
                  </span>
                </div>

                <SpiderChart5D
                  currentSkills={skillsCurrent}
                  currentLabel={`Ngày ${formatDateVN(currentDate)}`}
                  showComparison={false}
                  size={340}
                  highlightedSkill={hoveredSkill}
                  onHoverSkill={setHoveredSkill}
                />
              </div>

            </div>

            {/* 5 Thẻ đối sánh chi tiết 5 kỹ năng */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Chi tiết 5 kỹ năng & Mức độ tiến bộ
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Rà chuột để làm nổi bật trên biểu đồ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SKILL_DEFINITIONS.map((def) => {
                  const Icon = def.icon;
                  const curr = skillsCurrent[def.key];
                  const prev = skillsPrevious[def.key];
                  const diff = curr - prev;
                  const isHovered = hoveredSkill === def.key;

                  return (
                    <div
                      key={def.key}
                      onMouseEnter={() => setHoveredSkill(def.key)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isHovered
                          ? 'bg-white shadow-sm ring-2 ring-pink-200 scale-[1.01]'
                          : 'bg-slate-50/80 hover:bg-white hover:border-slate-300'
                      }`}
                      style={{ borderColor: isHovered ? def.color : undefined }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${def.color}15`, color: def.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                              {def.index}. {def.nameVi}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {def.nameEn}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                          diff >= 0 ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                        }`}>
                          {diff >= 0 ? `+${diff}%` : `${diff}%`}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-blue-600">Trước: {prev}%</span>
                          <span className="text-[#ff5e97]">Hiện tại: {curr}%</span>
                        </div>

                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                          <div
                            className="bg-blue-400 h-full rounded-full absolute top-0 left-0 opacity-70"
                            style={{ width: `${prev}%` }}
                          />
                          <div
                            className="h-full rounded-full transition-all duration-500 relative"
                            style={{ width: `${curr}%`, backgroundColor: def.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. Lịch sử bài học gần đây */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Bài học gần đây ({recentSessions.length})
          </h3>
          <span className="text-xs text-slate-400">Các bài học đã hoàn thành</span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            Bé chưa có bài học nào được hoàn thành gần đây. Hãy vào phần <strong>HỌC</strong> để bắt đầu nhé!
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-300 transition-all"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {session.topic}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800">
                    {session.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Thời gian hoàn thành: {session.completedAt} ({session.durationMinutes} phút)
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-slate-800">
                    {session.score} / 100 điểm
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-pink-100 text-[#ff5e97] text-xs font-bold">
                    Hoàn thành
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Quản lý gia đình khi phụ huynh muốn thêm hoặc sửa đổi danh sách con */}
      <FamilyManagementModal
        isOpen={isFamilyModalOpen}
        onClose={() => {
          setIsFamilyModalOpen(false);
          initPageData();
        }}
        isParent={isParent}
        userEmail={user?.email}
      />

    </div>
  );
};


