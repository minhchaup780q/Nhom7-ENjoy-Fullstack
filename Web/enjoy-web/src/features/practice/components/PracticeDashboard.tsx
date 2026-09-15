import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SpeakerWaveIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon,
  FunnelIcon,
  BookOpenIcon,
  CpuChipIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem, type MistakeStats, type MistakeStatus } from '../../learning/services/mistakeApi';
import { chatbotApi } from '../../learning/services/chatbotApi';
import { MistakePracticePlayer } from './MistakePracticePlayer';

const isImageUrl = (val?: string | null): boolean => {
  if (!val) return false;
  const s = val.trim().toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/') ||
    s.startsWith('data:image') ||
    s.includes('.webp') ||
    s.includes('.png') ||
    s.includes('.jpg') ||
    s.includes('.jpeg') ||
    s.includes('.svg') ||
    s.includes('s3.') ||
    s.includes('amazonaws.com') ||
    s.includes('unsplash.com')
  );
};

const getAssetUrl = (url?: string | null) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
};

const ROUND_INFO: Record<number, { name: string; color: string; badgeBg: string }> = {
  1: { name: 'Vòng 1 • Từ vựng', color: 'text-indigo-600', badgeBg: 'bg-indigo-50 border-indigo-200/60' },
  2: { name: 'Vòng 2 • Luyện nghe', color: 'text-purple-600', badgeBg: 'bg-purple-50 border-purple-200/60' },
  3: { name: 'Vòng 3 • Luyện nói', color: 'text-rose-600', badgeBg: 'bg-rose-50 border-rose-200/60' },
  4: { name: 'Vòng 4 • Đọc hiểu', color: 'text-emerald-600', badgeBg: 'bg-emerald-50 border-emerald-200/60' },
  5: { name: 'Vòng 5 • Điền từ & Viết', color: 'text-sky-600', badgeBg: 'bg-sky-50 border-sky-200/60' }
};

const PAGE_SIZE = 6;

export const PracticeDashboard: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [stats, setStats] = useState<MistakeStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Main View Tab: 'list' (Danh sách câu hỏi) | 'roadmap' (Lộ trình nhắc nhở 1-2-3 ngày)
  const [mainViewTab, setMainViewTab] = useState<'list' | 'roadmap'>('list');
  const [roadmapMistakes, setRoadmapMistakes] = useState<MistakeItem[]>([]);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Pagination states (0-indexed)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters - Mặc định tự sort theo 'NEEDS_REVIEW' (Cần ôn tập)
  const [statusFilter, setStatusFilter] = useState<MistakeStatus>('NEEDS_REVIEW');
  const [roundFilter, setRoundFilter] = useState<number | 'ALL'>('ALL');

  // Active Practice Session
  const [practiceQueue, setPracticeQueue] = useState<MistakeItem[] | null>(null);

  // Selected Mistake for AI Explanation Modal
  const [aiModalItem, setAiModalItem] = useState<MistakeItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');

  const fetchRoadmapData = useCallback(async () => {
    setRoadmapLoading(true);
    try {
      const res = await mistakeApi.getRoadmapMistakes();
      const data = (res as any)?.data !== undefined ? (res as any).data : res;
      setRoadmapMistakes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải lộ trình ôn tập:", err);
    } finally {
      setRoadmapLoading(false);
    }
  }, []);

  const handleOpenAiModal = async (item: MistakeItem) => {
    setAiModalItem(item);
    if (item.aiExplanationCache && item.aiExplanationCache.trim().length > 0) {
      setAiExplanation(item.aiExplanationCache);
      setAiLoading(false);
    } else {
      setAiLoading(true);
      setAiExplanation('');
      try {
        const explanation = await chatbotApi.explainMistake(item);
        setAiExplanation(explanation);
        // Cập nhật cache lên database để lần sau mở lại ngay lập tức
        mistakeApi.updateAiExplanation(item.id, explanation).catch(() => { });
      } catch (err) {
        console.error("Lỗi khi gọi AI phân tích:", err);
        setAiExplanation('Trợ lý AI đang bận một chút. Bé hãy xem lại từ vựng và đáp án đúng nhé!');
      } finally {
        setAiLoading(false);
      }
    }
  };

  // Tải dữ liệu theo trang hiện tại (Load trang nào hiển thị trang đó)
  const fetchMistakesData = useCallback(async (
    pageToFetch: number = currentPage,
    statusToFetch: MistakeStatus = statusFilter,
    roundToFetch: number | 'ALL' = roundFilter
  ) => {
    setLoading(true);
    try {
      const [pageRes, statsRes] = await Promise.all([
        mistakeApi.getUserMistakesPaged({
          status: statusToFetch,
          roundType: roundToFetch === 'ALL' ? undefined : roundToFetch,
          page: pageToFetch,
          size: PAGE_SIZE,
        }),
        mistakeApi.getMistakeStats(),
      ]);

      if (pageRes) {
        setMistakes(pageRes.content || []);
        setCurrentPage(pageRes.pageNumber || 0);
        setTotalPages(Math.max(1, pageRes.totalPages || 1));
        setTotalElements(pageRes.totalElements || 0);
      }
      setStats(statsRes || null);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lỗi sai:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, roundFilter]);

  // Initial load và khi đổi filter
  useEffect(() => {
    fetchMistakesData(0, statusFilter, roundFilter);
  }, [statusFilter, roundFilter]);

  useEffect(() => {
    if (mainViewTab === 'roadmap') {
      fetchRoadmapData();
    }
  }, [mainViewTab, fetchRoadmapData]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages || newPage === currentPage) return;
    fetchMistakesData(newPage, statusFilter, roundFilter);
  };

  const handleStatusChange = (newStatus: MistakeStatus) => {
    if (newStatus === statusFilter) return;
    setStatusFilter(newStatus);
    setCurrentPage(0);
  };

  const handleRoundChange = (newRound: number | 'ALL') => {
    setRoundFilter(newRound);
    setCurrentPage(0);
  };

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startPracticeAllNeedsReview = async () => {
    try {
      const queue = await mistakeApi.getPracticeQueue(
        roundFilter === 'ALL' ? undefined : roundFilter,
        20
      );
      if (queue && queue.length > 0) {
        setPracticeQueue(queue);
      } else if (mistakes.length > 0) {
        setPracticeQueue(mistakes);
      }
    } catch (err) {
      if (mistakes.length > 0) {
        setPracticeQueue(mistakes);
      }
    }
  };

  const startPracticeSingleItem = (item: MistakeItem) => {
    setPracticeQueue([item]);
  };

  const needsReviewTotal = stats?.needsReviewCount ?? 0;
  const masteredTotal = stats?.masteredCount ?? 0;
  const grandTotal = stats?.totalMistakes ?? (needsReviewTotal + masteredTotal);

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col max-w-6xl mx-auto w-full select-none gap-6">
      {/* If Practice Player is active */}
      {practiceQueue && (
        <MistakePracticePlayer
          mistakes={practiceQueue}
          onClose={() => {
            setPracticeQueue(null);
            fetchMistakesData(currentPage, statusFilter, roundFilter);
            fetchRoadmapData();
          }}
          onFinished={() => {
            fetchMistakesData(currentPage, statusFilter, roundFilter);
            fetchRoadmapData();
          }}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-primary to-[#ff85a2] rounded-3xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-rose-300/40">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-display font-black uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" />
            LỘ TRÌNH ÔN TẬP CÁ NHÂN HÓA
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-wide">
            Trung Tâm Luyện Tập & Khắc Phục Lỗi Sai
          </h1>
          <p className="text-xs md:text-sm text-white/90 font-semibold max-w-xl leading-relaxed">
            Hệ thống tự động ghi nhận những câu hỏi bé từng làm sai để giúp bé ôn tập đúng trọng tâm và nâng cao điểm số!
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <Mascot
            expression={needsReviewTotal === 0 ? "happy" : "thinking"}
            speechBubbleText={
              needsReviewTotal === 0
                ? "Tuyệt đỉnh! Bé đã hoàn thành tất cả các câu cần ôn hôm nay!"
                : `Bé có ${needsReviewTotal} câu cần ôn hôm nay nè! Cùng Enjoy luyện tập nhé!`
            }
            size={85}
          />
        </div>
      </div>

      {/* Top View Selector: Segmented Pill Controls */}
      <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex self-start border border-slate-200/60 gap-1.5 flex-wrap">
        <button
          onClick={() => setMainViewTab('list')}
          className={`px-5 py-2.5 rounded-xl font-display text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${mainViewTab === 'list'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
        >
          <ListBulletIcon className="w-4 h-4 text-primary" />
          <span>DANH SÁCH BÀI TẬP</span>
          {needsReviewTotal > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-600">
              {needsReviewTotal}
            </span>
          )}
        </button>

        <button
          onClick={() => setMainViewTab('roadmap')}
          className={`px-5 py-2.5 rounded-xl font-display text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${mainViewTab === 'roadmap'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
        >
          <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
          <span>LỘ TRÌNH ÔN TẬP (1 - 2 - 3 NGÀY)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DANH SÁCH BÀI TẬP (GRID + FILTERS + PAGINATION)                   */}
      {/* ========================================================================= */}
      {mainViewTab === 'list' && (
        <div className="space-y-5">
          {/* Overview Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cần Ôn Hôm Nay</p>
                <p className="text-2xl md:text-3xl font-display font-black text-amber-600 mt-1">
                  {needsReviewTotal}
                </p>
              </div>

            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã Thành Thạo</p>
                <p className="text-2xl md:text-3xl font-display font-black text-emerald-600 mt-1">
                  {masteredTotal}
                </p>
              </div>

            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex items-center justify-between col-span-2 md:col-span-1">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Khắc Phục</p>
                <p className="text-2xl md:text-3xl font-display font-black text-primary mt-1">
                  {grandTotal > 0 ? `${Math.round((masteredTotal / grandTotal) * 100)}%` : '100%'}
                </p>
              </div>

            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange('NEEDS_REVIEW')}
                className={`px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-2 cursor-pointer ${statusFilter === 'NEEDS_REVIEW'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
              >
                <span>CẦN ÔN HÔM NAY</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${statusFilter === 'NEEDS_REVIEW' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                  {needsReviewTotal}
                </span>
              </button>

              <button
                onClick={() => handleStatusChange('MASTERED')}
                className={`px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-2 cursor-pointer ${statusFilter === 'MASTERED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
              >
                <span>ĐÃ THÀNH THẠO</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${statusFilter === 'MASTERED' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                  {masteredTotal}
                </span>
              </button>
            </div>

            {/* Right side: Round Filter & Practice All Button */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={roundFilter}
                  onChange={(e) => handleRoundChange(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
                >
                  <option value="ALL">Tất cả kỹ năng</option>
                  <option value="1">Vòng 1: Từ vựng</option>
                  <option value="2">Vòng 2: Nghe</option>
                  <option value="3">Vòng 3: Nói</option>
                  <option value="4">Vòng 4: Đọc hiểu</option>
                  <option value="5">Vòng 5: Viết</option>
                </select>
              </div>

              {statusFilter === 'NEEDS_REVIEW' && (
                <button
                  disabled={needsReviewTotal === 0}
                  onClick={startPracticeAllNeedsReview}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white font-display font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlayIcon className="w-3.5 h-3.5 fill-current" />
                  <span>ÔN TẬP TẤT CẢ ({needsReviewTotal})</span>
                </button>
              )}
            </div>
          </div>

          {/* Mistake Cards List */}
          {loading ? (
            <div className="p-16 text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
              <ArrowPathIcon className="w-5 h-5 animate-spin text-primary" />
              ĐANG TẢI DỮ LIỆU LUYỆN TẬP...
            </div>
          ) : mistakes.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-display font-black text-slate-800 uppercase">
                Không có câu hỏi nào cần ôn tập hôm nay!
              </h3>
              <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto">
                {statusFilter === 'NEEDS_REVIEW'
                  ? 'Bé đã hoàn thành xuất sắc các câu cần ôn hôm nay! Các bài tập đang theo dõi sẽ được nhắc lại vào ngày mai (bé có thể xem ở tab Lộ trình ôn tập).'
                  : 'Bé chưa có câu hỏi nào đạt trạng thái Đã thành thạo trong danh mục này.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {mistakes.map(item => {
                  const roundInfo = ROUND_INFO[item.roundType] || {
                    name: `Vòng ${item.roundType}`,
                    color: 'text-slate-600',
                    badgeBg: 'bg-slate-100 border-slate-200'
                  };

                  const isMastered = item.status === 'MASTERED' || (item.correctStreakDays ?? 0) >= 3;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between gap-3.5 hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      <div className="space-y-3">
                        {/* Top: Skill & Status */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-display font-black border ${roundInfo.badgeBg} ${roundInfo.color}`}>
                            {roundInfo.name}
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-display font-black ${isMastered
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : (item.correctStreakDays ?? 0) > 0
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                            {isMastered
                              ? '✓ ĐÃ THÀNH THẠO'
                              : (item.correctStreakDays ?? 0) > 0
                                ? `ĐANG ÔN (${item.correctStreakDays}/3 LẦN)`
                                : 'CẦN ÔN TẬP'}
                          </span>
                        </div>

                        {/* Middle: Image & Details */}
                        <div className="flex items-center justify-between gap-3 pt-0.5">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.imageUrl && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 p-0.5 flex items-center justify-center">
                                <img
                                  src={getAssetUrl(item.imageUrl)}
                                  alt="thumbnail"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                                  }}
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="text-sm font-display font-black text-slate-800 truncate">
                                {item.contentText}
                              </h4>
                              {item.translation && (
                                <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                                  {item.translation}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => playSpeech(item.contentText)}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-primary rounded-xl transition-colors shrink-0 cursor-pointer"
                            title="Nghe phát âm"
                          >
                            <SpeakerWaveIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Error info box */}
                        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-rose-600 font-semibold text-[11px]">
                            <span className="flex items-center gap-1 text-slate-500">
                              <ExclamationTriangleIcon className="w-3.5 h-3.5 text-rose-500" />
                              Lần trước sai:
                            </span>
                            {item.wrongAnswerSubmitted && isImageUrl(item.wrongAnswerSubmitted) ? (
                              <div className="w-7 h-7 rounded-lg border border-rose-200 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                                <img
                                  src={getAssetUrl(item.wrongAnswerSubmitted)}
                                  alt="Wrong"
                                  className="w-full h-full object-cover rounded-md"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                                  }}
                                />
                              </div>
                            ) : (
                              <strong className="line-through text-rose-600">{item.wrongAnswerSubmitted}</strong>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-slate-400 text-[10px] font-medium pt-1 border-t border-slate-200/40">
                            <span>Thời gian làm câu này:</span>
                            <span className="font-mono font-bold text-slate-600">{item.durationSeconds || 0}s</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => startPracticeSingleItem(item)}
                          className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white font-display font-black rounded-xl text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          Luyện tập câu này
                        </button>

                        <button
                          onClick={() => handleOpenAiModal(item)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                          title="AI Hướng dẫn & Phân tích lỗi sai"
                        >
                          <CpuChipIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ==================== PHÂN TRANG (PAGINATION BAR) ==================== */}
              {totalPages > 1 && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">
                    Trang <strong className="text-slate-800">{currentPage + 1}</strong> / <strong className="text-slate-800">{totalPages}</strong> (Tổng cộng {totalElements} câu hỏi)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0 || loading}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-display font-black text-xs text-slate-600 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <ChevronLeftIcon className="w-3.5 h-3.5" />
                      Trước
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i).map(pageIdx => {
                        if (
                          totalPages > 6 &&
                          pageIdx !== 0 &&
                          pageIdx !== totalPages - 1 &&
                          Math.abs(pageIdx - currentPage) > 1
                        ) {
                          if (pageIdx === 1 || pageIdx === totalPages - 2) {
                            return <span key={pageIdx} className="px-1 text-xs text-slate-400">...</span>;
                          }
                          return null;
                        }

                        const isCurrent = pageIdx === currentPage;
                        return (
                          <button
                            key={pageIdx}
                            onClick={() => handlePageChange(pageIdx)}
                            disabled={loading}
                            className={`w-7 h-7 rounded-lg font-display font-black text-xs transition-all cursor-pointer ${isCurrent
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                          >
                            {pageIdx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1 || loading}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-display font-black text-xs text-slate-600 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      Sau
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: LỘ TRÌNH ÔN TẬP (1 - 2 - 3 NGÀY) SPACED REPETITION (CHỈ ĐỂ XEM)    */}
      {/* ========================================================================= */}
      {mainViewTab === 'roadmap' && (() => {
        const dueTodayItems = roadmapMistakes.filter(m => {
          const isMastered = m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
          return !isMastered && (!m.correctStreakDays || m.correctStreakDays === 0);
        });

        const waiting1DayItems = roadmapMistakes.filter(m => {
          const isMastered = m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
          return !isMastered && m.correctStreakDays === 1;
        });

        const waiting2DaysItems = roadmapMistakes.filter(m => {
          const isMastered = m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
          return !isMastered && m.correctStreakDays === 2;
        });

        const masteredItems = roadmapMistakes.filter(m => {
          return m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
        });

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Roadmap Explanation Guide Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-600 font-display font-black text-sm uppercase">
                  Theo Dõi Lộ Trình Lặp Lại
                </div>
                <p className="text-xs font-semibold text-slate-600 max-w-3xl leading-relaxed">
                  Tab này dùng để <strong>theo dõi tiến độ nhắc nhở</strong> qua các ngày. Mỗi câu hỏi làm sai cần hoàn thành <strong>3 lần luyện tập đúng ở 3 ngày khác nhau</strong> (mỗi lần cách nhau 1 ngày).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-xl text-xs font-bold font-mono shadow-xs">
                  Tổng theo dõi: {roadmapMistakes.length} câu
                </span>
              </div>
            </div>

            {roadmapLoading ? (
              <div className="p-16 text-center text-sm font-bold text-text-muted flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-5 h-5 animate-spin text-primary" />
                ĐANG TẢI LỘ TRÌNH ÔN TẬP...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">

                {/* 1. HÔM NAY CẦN ÔN */}
                <div className="bg-white border-4 border-amber-300 rounded-3xl p-4 shadow-sm flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-amber-100 pb-2">
                    <div>
                      <h4 className="text-xs font-display font-black text-amber-700 uppercase">
                        1. Cần ôn hôm nay
                      </h4>
                      <p className="text-[10px] text-amber-600 font-semibold">Chưa ôn lần nào (0% đ)</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold font-mono">
                      {dueTodayItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {dueTodayItems.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Không có câu nào ở mốc này</p>
                    ) : (
                      dueTodayItems.map(item => (
                        <div key={item.id} className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-700">
                              {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                              0/3 Lần đúng
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.imageUrl && (
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-200 bg-white shrink-0">
                                <img src={getAssetUrl(item.imageUrl)} alt="thumb" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.contentText}</p>
                              {item.translation && (
                                <p className="text-[10px] text-slate-500 truncate">{item.translation}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-[10px] text-amber-700 font-semibold bg-white/80 p-1.5 rounded-lg border border-amber-200 flex items-center gap-1">
                            <span>Vào tab "Danh sách bài tập" để ôn lượt 1</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. NHẮC SAU 1 NGÀY */}
                <div className="bg-white border-4 border-blue-200 rounded-3xl p-4 shadow-sm flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-blue-100 pb-2">
                    <div>
                      <h4 className="text-xs font-display font-black text-blue-700 uppercase">
                        2. Nhắc sau 1 ngày
                      </h4>
                      <p className="text-[10px] text-blue-600 font-semibold">Đã xong lần 1 (+33% đ)</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold font-mono">
                      {waiting1DayItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {waiting1DayItems.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Chưa có câu nào ở mốc này</p>
                    ) : (
                      waiting1DayItems.map(item => (
                        <div key={item.id} className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-600">
                              {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                              1/3 Lần đúng
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.imageUrl && (
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-blue-200 bg-white shrink-0">
                                <img src={getAssetUrl(item.imageUrl)} alt="thumb" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.contentText}</p>
                              {item.translation && (
                                <p className="text-[10px] text-slate-500 truncate">{item.translation}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-[10px] text-blue-700 font-semibold bg-white/80 p-1.5 rounded-lg border border-blue-200 flex items-center gap-1">
                            <span>Đã xong lượt 1! Hẹn gặp lại ngày mai</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. NHẮC SAU 2 NGÀY */}
                <div className="bg-white border-4 border-purple-200 rounded-3xl p-4 shadow-sm flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-purple-100 pb-2">
                    <div>
                      <h4 className="text-xs font-display font-black text-purple-700 uppercase">
                        3. Nhắc sau 2 ngày
                      </h4>
                      <p className="text-[10px] text-purple-600 font-semibold">Đã xong lần 2 (+67% đ)</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold font-mono">
                      {waiting2DaysItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {waiting2DaysItems.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Chưa có câu nào ở mốc này</p>
                    ) : (
                      waiting2DaysItems.map(item => (
                        <div key={item.id} className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-purple-600">
                              {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">
                              2/3 Lần đúng
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.imageUrl && (
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-purple-200 bg-white shrink-0">
                                <img src={getAssetUrl(item.imageUrl)} alt="thumb" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.contentText}</p>
                              {item.translation && (
                                <p className="text-[10px] text-slate-500 truncate">{item.translation}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-[10px] text-purple-700 font-semibold bg-white/80 p-1.5 rounded-lg border border-purple-200 flex items-center gap-1">
                            <span>Đã xong lượt 2! Còn 1 lần ngày mai</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. ĐÃ THÀNH THẠO (100%) */}
                <div className="bg-white border-4 border-emerald-300 rounded-3xl p-4 shadow-sm flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-2">
                    <div>
                      <h4 className="text-xs font-display font-black text-emerald-700 uppercase">
                        4. Đã thành thạo
                      </h4>
                      <p className="text-[10px] text-emerald-600 font-semibold">Phục hồi 100% điểm</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono">
                      {masteredItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {masteredItems.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Chưa có câu nào đạt thành thạo</p>
                    ) : (
                      masteredItems.map(item => (
                        <div key={item.id} className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-600">
                              {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              3/3 Đúng
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.imageUrl && (
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-200 bg-white shrink-0">
                                <img src={getAssetUrl(item.imageUrl)} alt="thumb" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.contentText}</p>
                              {item.translation && (
                                <p className="text-[10px] text-slate-500 truncate">{item.translation}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-[10px] text-emerald-800 font-bold bg-emerald-100 p-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Đã phục hồi 100% điểm kỹ năng!</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        );
      })()}

      {/* AI Explanation Modal */}
      {aiModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-4 border-border-main rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-border-main pb-3">
              <div className="flex items-center gap-2 text-primary font-display font-black text-base uppercase">
                <CpuChipIcon className="w-5 h-5 text-primary" />
                AI Phân Tích & Hướng Dẫn Lỗi Sai
              </div>
              <button
                onClick={() => setAiModalItem(null)}
                className="p-1 hover:bg-bg-light rounded-lg text-text-muted cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-bg-light p-3.5 rounded-2xl border-2 border-border-main text-xs space-y-2">
                <div className="flex items-center gap-3">
                  {aiModalItem.imageUrl && (
                    <div className="w-16 h-16 rounded-xl border-2 border-border-main overflow-hidden shrink-0 bg-white p-1">
                      <img
                        src={getAssetUrl(aiModalItem.imageUrl)}
                        alt="Question"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-[#2b2b2b]">
                      Từ vựng / Câu hỏi: <strong className="text-primary">{aiModalItem.contentText}</strong>
                    </p>
                    {aiModalItem.translation && (
                      <p className="text-text-muted text-[11px]">
                        Nghĩa tiếng Việt: <strong>{aiModalItem.translation}</strong>
                      </p>
                    )}
                    <p className="text-[#389e0d] text-[11px]">
                      Đáp án chuẩn: <strong>{aiModalItem.keyword || aiModalItem.contentText}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#cf1322] font-semibold pt-2 border-t border-border-main/50">
                  <span className="shrink-0">Lần trước bé chọn/đọc:</span>
                  {isImageUrl(aiModalItem.wrongAnswerSubmitted) ? (
                    <div className="w-10 h-10 rounded-lg border-2 border-red-300 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                      <img
                        src={getAssetUrl(aiModalItem.wrongAnswerSubmitted)}
                        alt="Đã chọn sai"
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                        }}
                      />
                    </div>
                  ) : (
                    <strong className="line-through">{aiModalItem.wrongAnswerSubmitted || 'Chưa đúng'}</strong>
                  )}
                </div>
              </div>

              <div className="bg-[#f0f5ff] border-2 border-[#adc6ff] rounded-2xl p-4 text-xs font-semibold text-[#1d39c4] leading-relaxed min-h-[100px] flex items-center">
                {aiLoading ? (
                  <div className="w-full flex flex-col items-center justify-center gap-3 py-4 text-primary">
                    <div className="flex items-center gap-2 font-display font-black text-xs uppercase tracking-wide">
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Trợ lý AI đang suy nghĩ & phân tích...</span>
                    </div>
                    <div className="w-48 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-primary animate-pulse rounded-full" />
                    </div>
                    <p className="text-[11px] text-[#597ef7] font-medium">Đang tìm mẹo học và hướng dẫn khắc phục lỗi sai cho bé...</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 w-full">
                    <p className="font-bold text-primary flex items-center gap-1.5 uppercase text-[11px]">
                      <SparklesIcon className="w-4 h-4" />
                      Lời khuyên từ Trợ lý AI:
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium text-xs">
                      {aiExplanation || 'Bé hãy chú ý từ vựng và lắng nghe âm thanh mẫu để phát âm chuẩn hơn nhé!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button3D variant="blue" fullWidth size="md" onClick={() => setAiModalItem(null)}>
              ĐÃ HIỂU RỒI!
            </Button3D>
          </div>
        </div>
      )}
    </div>
  );
};
