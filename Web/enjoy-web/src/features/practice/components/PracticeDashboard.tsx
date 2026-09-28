import React, { useState, useEffect, useCallback } from 'react';
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

const ROUND_INFO: Record<number, { name: string }> = {
  1: { name: 'Vòng 1: Học từ vựng' },
  2: { name: 'Vòng 2: Nối từ vựng' },
  3: { name: 'Vòng 3: Luyện nói' },
  4: { name: 'Vòng 4: Sắp xếp chữ cái' },
  5: { name: 'Vòng 5: Kéo thả toạ độ' },
  6: { name: 'Vòng 6: Ngữ pháp trắc nghiệm' },
  7: { name: 'Vòng 7: Điền từ vào chỗ trống' },
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
      console.error('Lỗi khi tải lộ trình ôn tập:', err);
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
        mistakeApi.updateAiExplanation(item.id, explanation).catch(() => {});
      } catch (err) {
        console.error('Lỗi khi gọi AI phân tích:', err);
        setAiExplanation('Trợ lý AI đang bận một chút. Bé hãy xem lại từ vựng và đáp án đúng nhé!');
      } finally {
        setAiLoading(false);
      }
    }
  };

  // Tải dữ liệu theo trang hiện tại
  const fetchMistakesData = useCallback(
    async (
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

        if (statsRes) {
          setStats(statsRes);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách câu hỏi cần ôn:', err);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, statusFilter, roundFilter]
  );

  useEffect(() => {
    fetchMistakesData(0, statusFilter, roundFilter);
  }, [statusFilter, roundFilter, fetchMistakesData]);

  useEffect(() => {
    if (mainViewTab === 'roadmap') {
      fetchRoadmapData();
    }
  }, [mainViewTab, fetchRoadmapData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      fetchMistakesData(newPage, statusFilter, roundFilter);
    }
  };

  const handleStatusChange = (newStatus: MistakeStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(0);
  };

  const handleRoundChange = (newRound: number | 'ALL') => {
    setRoundFilter(newRound);
    setCurrentPage(0);
  };

  const startPracticeAllNeedsReview = async () => {
    try {
      const res = await mistakeApi.getUserMistakesPaged({
        status: 'NEEDS_REVIEW',
        roundType: roundFilter === 'ALL' ? undefined : roundFilter,
        page: 0,
        size: 50,
      });
      const list = res.content || [];
      if (list.length > 0) {
        setPracticeQueue(list);
      } else {
        alert('Hiện tại không có câu hỏi nào cần ôn tập hôm nay!');
      }
    } catch (err) {
      console.error('Lỗi khi bắt đầu ôn tập hàng loạt:', err);
    }
  };

  const startPracticeSingleItem = (item: MistakeItem) => {
    setPracticeQueue([item]);
  };

  const playSpeech = (text?: string) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const needsReviewTotal = stats?.needsReviewCount ?? totalElements;
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

      {/* Header Banner - Clean Minimal Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-7 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-display font-black text-slate-700 uppercase tracking-wider border border-slate-200">
            LỘ TRÌNH ÔN TẬP CÁ NHÂN HÓA
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-slate-800 tracking-tight">
            Trung Tâm Luyện Tập & Khắc Phục Lỗi Sai
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
            Hệ thống tự động ghi nhận những câu hỏi bé từng làm sai để giúp bé ôn tập đúng trọng tâm và nâng cao điểm số.
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <Mascot
            expression={needsReviewTotal === 0 ? 'happy' : 'thinking'}
            speechBubbleText={
              needsReviewTotal === 0
                ? 'Tuyệt đỉnh! Bé đã hoàn thành tất cả các câu cần ôn hôm nay!'
                : `Bé có ${needsReviewTotal} câu cần ôn hôm nay nè!`
            }
            size={85}
          />
        </div>
      </div>

      {/* Top View Selector: Segmented Pill Controls */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl inline-flex self-start border border-slate-200 gap-1.5 flex-wrap">
        <button
          onClick={() => setMainViewTab('list')}
          className={`px-5 py-2.5 rounded-xl font-display text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
            mainViewTab === 'list'
              ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
              : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60'
          }`}
        >
          <span>DANH SÁCH BÀI TẬP</span>
          {needsReviewTotal > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-100 text-pink-700 border border-pink-200">
              {needsReviewTotal}
            </span>
          )}
        </button>

        <button
          onClick={() => setMainViewTab('roadmap')}
          className={`px-5 py-2.5 rounded-xl font-display text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
            mainViewTab === 'roadmap'
              ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
              : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60'
          }`}
        >
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
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cần Ôn Hôm Nay</p>
              <p className="text-2xl md:text-3xl font-display font-black text-slate-800 mt-1">
                {needsReviewTotal}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã Thành Thạo</p>
              <p className="text-2xl md:text-3xl font-display font-black text-slate-800 mt-1">
                {masteredTotal}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Khắc Phục</p>
              <p className="text-2xl md:text-3xl font-display font-black text-pink-600 mt-1">
                {grandTotal > 0 ? `${Math.round((masteredTotal / grandTotal) * 100)}%` : '100%'}
              </p>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange('NEEDS_REVIEW')}
                className={`px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-2 cursor-pointer border ${
                  statusFilter === 'NEEDS_REVIEW'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>CẦN ÔN HÔM NAY</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                    statusFilter === 'NEEDS_REVIEW'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {needsReviewTotal}
                </span>
              </button>

              <button
                onClick={() => handleStatusChange('MASTERED')}
                className={`px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-2 cursor-pointer border ${
                  statusFilter === 'MASTERED'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>ĐÃ THÀNH THẠO</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                    statusFilter === 'MASTERED' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {masteredTotal}
                </span>
              </button>
            </div>

            {/* Right side: Round Filter & Practice All Button */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Kỹ năng:</span>
                <select
                  value={roundFilter}
                  onChange={(e) =>
                    handleRoundChange(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                  }
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="ALL">Tất cả kỹ năng</option>
                  <option value="1">Vòng 1: Học từ vựng</option>
                  <option value="2">Vòng 2: Nối từ vựng</option>
                  <option value="3">Vòng 3: Luyện nói</option>
                  <option value="4">Vòng 4: Sắp xếp chữ cái</option>
                  <option value="5">Vòng 5: Kéo thả toạ độ</option>
                  <option value="6">Vòng 6: Ngữ pháp trắc nghiệm</option>
                  <option value="7">Vòng 7: Điền từ vào chỗ trống</option>
                </select>
              </div>

              {statusFilter === 'NEEDS_REVIEW' && (
                <Button3D
                  variant="pink"
                  size="sm"
                  disabled={needsReviewTotal === 0}
                  onClick={startPracticeAllNeedsReview}
                  className="text-[11px]"
                >
                  ÔN TẬP TẤT CẢ ({needsReviewTotal})
                </Button3D>
              )}
            </div>
          </div>

          {/* Mistake Cards List */}
          {loading ? (
            <div className="p-16 text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
              Đang tải dữ liệu luyện tập...
            </div>
          ) : mistakes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
              <h3 className="text-base font-display font-black text-slate-800 uppercase">
                Không có câu hỏi nào cần ôn tập hôm nay
              </h3>
              <p className="text-xs font-medium text-slate-500 max-w-md mx-auto">
                {statusFilter === 'NEEDS_REVIEW'
                  ? 'Bé đã hoàn thành xuất sắc các câu cần ôn hôm nay! Các bài tập đang theo dõi sẽ được nhắc lại vào ngày mai (bé có thể xem ở tab Lộ trình ôn tập).'
                  : 'Bé chưa có câu hỏi nào đạt trạng thái Đã thành thạo trong danh mục này.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {mistakes.map((item) => {
                  const roundInfo = ROUND_INFO[item.roundType] || {
                    name: `Vòng ${item.roundType}`,
                  };

                  const isMastered = item.status === 'MASTERED' || (item.correctStreakDays ?? 0) >= 3;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between gap-3.5 hover:border-slate-400 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Top: Skill & Status */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-display font-black bg-slate-100 text-slate-700 border border-slate-200">
                            {roundInfo.name}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-display font-black border ${
                              isMastered
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : (item.correctStreakDays ?? 0) > 0
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-pink-50 text-pink-700 border-pink-200'
                            }`}
                          >
                            {isMastered
                              ? 'ĐÃ THÀNH THẠO'
                              : (item.correctStreakDays ?? 0) > 0
                                ? `ĐANG ÔN (${item.correctStreakDays}/3 LẦN)`
                                : 'CẦN ÔN TẬP'}
                          </span>
                        </div>

                        {/* Middle: Image & Details */}
                        <div className="flex items-center justify-between gap-3 pt-0.5">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.imageUrl && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 p-0.5 flex items-center justify-center">
                                <img
                                  src={getAssetUrl(item.imageUrl)}
                                  alt="thumbnail"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                                  }}
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="text-base font-display font-black text-slate-800 truncate">
                                {item.contentText || item.keyword}
                              </h4>
                              {item.translation && (
                                <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                                  ({item.translation})
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => playSpeech(item.contentText || item.keyword)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors shrink-0 cursor-pointer"
                          >
                            Nghe
                          </button>
                        </div>

                        {/* Error info box */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-semibold text-[11px]">
                            <span className="text-slate-500 font-medium">Lần trước sai:</span>
                            {item.wrongAnswerSubmitted && isImageUrl(item.wrongAnswerSubmitted) ? (
                              <div className="w-7 h-7 rounded-lg border border-pink-200 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                                <img
                                  src={getAssetUrl(item.wrongAnswerSubmitted)}
                                  alt="Wrong"
                                  className="w-full h-full object-cover rounded-md"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                                  }}
                                />
                              </div>
                            ) : (
                              <strong className="line-through text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                                {item.wrongAnswerSubmitted || 'chưa đúng'}
                              </strong>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button3D
                          variant="pink"
                          size="sm"
                          fullWidth
                          onClick={() => startPracticeSingleItem(item)}
                          className="text-[11px]"
                        >
                          Luyện tập câu này
                        </Button3D>

                        <button
                          onClick={() => handleOpenAiModal(item)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Hỏi AI
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ==================== PHÂN TRANG (PAGINATION BAR) ==================== */}
              {totalPages > 1 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500">
                    Trang <strong className="text-slate-800">{currentPage + 1}</strong> /{' '}
                    <strong className="text-slate-800">{totalPages}</strong> ({totalElements} câu hỏi)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0 || loading}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-display font-black text-xs text-slate-700 transition-all cursor-pointer"
                    >
                      Trước
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i).map((pageIdx) => {
                        if (
                          totalPages > 6 &&
                          pageIdx !== 0 &&
                          pageIdx !== totalPages - 1 &&
                          Math.abs(pageIdx - currentPage) > 1
                        ) {
                          if (pageIdx === 1 || pageIdx === totalPages - 2) {
                            return (
                              <span key={pageIdx} className="px-1 text-xs text-slate-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        const isCurrent = pageIdx === currentPage;
                        return (
                          <button
                            key={pageIdx}
                            onClick={() => handlePageChange(pageIdx)}
                            disabled={loading}
                            className={`w-7 h-7 rounded-lg font-display font-black text-xs transition-all cursor-pointer border ${
                              isCurrent
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
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
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-display font-black text-xs text-slate-700 transition-all cursor-pointer"
                    >
                      Sau
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
      {mainViewTab === 'roadmap' &&
        (() => {
          const dueTodayItems = roadmapMistakes.filter((m) => {
            const isMastered = m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
            return !isMastered && (!m.correctStreakDays || m.correctStreakDays === 0);
          });

          const waiting1DayItems = roadmapMistakes.filter((m) => {
            const isMastered = m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
            return !isMastered && m.correctStreakDays === 1;
          });

          const waiting2DaysItems = roadmapMistakes.filter((m) => {
            const isMastered = m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
            return !isMastered && m.correctStreakDays === 2;
          });

          const masteredItems = roadmapMistakes.filter((m) => {
            return m.status === 'MASTERED' || (m.correctStreakDays ?? 0) >= 3;
          });

          return (
            <div className="space-y-6 animate-fadeIn">
              {/* Roadmap Explanation Guide Card - Ngắn gọn, súc tích */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="text-slate-800 font-bold text-xs uppercase tracking-wide">
                    Lộ trình ôn tập lặp lại
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Hoàn thành <strong>3 lần luyện tập đúng ở 3 ngày khác nhau</strong> để khắc phục hoàn toàn
                    lỗi sai.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold font-mono">
                    {roadmapMistakes.length} câu theo dõi
                  </span>
                </div>
              </div>

              {roadmapLoading ? (
                <div className="p-16 text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                  Đang tải lộ trình ôn tập...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                  {/* 1. HÔM NAY CẦN ÔN */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-xs font-display font-black text-slate-800 uppercase">
                          1. Cần ôn hôm nay
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Chưa ôn lần nào (0% đ)</p>
                      </div>
                      <span className="px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-xs font-bold font-mono">
                        {dueTodayItems.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {dueTodayItems.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">Không có câu nào ở mốc này</p>
                      ) : (
                        dueTodayItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-600">
                                {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">
                                0/3 lần
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.imageUrl && (
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                                  <img
                                    src={getAssetUrl(item.imageUrl)}
                                    alt="thumb"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {item.contentText || item.keyword}
                                </p>
                                {item.translation && (
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {item.translation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 2. NHẮC SAU 1 NGÀY */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-xs font-display font-black text-slate-800 uppercase">
                          2. Nhắc sau 1 ngày
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Đã xong lần 1 (+33% đ)</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold font-mono">
                        {waiting1DayItems.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {waiting1DayItems.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">Chưa có câu nào ở mốc này</p>
                      ) : (
                        waiting1DayItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-600">
                                {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                1/3 lần
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.imageUrl && (
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                                  <img
                                    src={getAssetUrl(item.imageUrl)}
                                    alt="thumb"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {item.contentText || item.keyword}
                                </p>
                                {item.translation && (
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {item.translation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 3. NHẮC SAU 2 NGÀY */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-xs font-display font-black text-slate-800 uppercase">
                          3. Nhắc sau 2 ngày
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Đã xong lần 2 (+67% đ)</p>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold font-mono">
                        {waiting2DaysItems.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {waiting2DaysItems.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">Chưa có câu nào ở mốc này</p>
                      ) : (
                        waiting2DaysItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-600">
                                {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                2/3 lần
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.imageUrl && (
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                                  <img
                                    src={getAssetUrl(item.imageUrl)}
                                    alt="thumb"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {item.contentText || item.keyword}
                                </p>
                                {item.translation && (
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {item.translation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 4. ĐÃ THÀNH THẠO (100%) */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-xs font-display font-black text-slate-800 uppercase">
                          4. Đã thành thạo
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Phục hồi 100% điểm</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
                        {masteredItems.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {masteredItems.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">Chưa có câu nào đạt thành thạo</p>
                      ) : (
                        masteredItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-600">
                                {ROUND_INFO[item.roundType]?.name || `Vòng ${item.roundType}`}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                3/3 Đúng
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.imageUrl && (
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                                  <img
                                    src={getAssetUrl(item.imageUrl)}
                                    alt="thumb"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {item.contentText || item.keyword}
                                </p>
                                {item.translation && (
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {item.translation}
                                  </p>
                                )}
                              </div>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-display font-black text-slate-800 uppercase">
                AI Phân Tích Lỗi Sai
              </h3>
              <button
                onClick={() => setAiModalItem(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer text-xs font-bold"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-3">
                  {aiModalItem.imageUrl && (
                    <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-white p-1">
                      <img
                        src={getAssetUrl(aiModalItem.imageUrl)}
                        alt="Question"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-slate-800">
                      Từ / Câu chuẩn:{' '}
                      <strong className="text-pink-600">
                        {aiModalItem.contentText || aiModalItem.keyword}
                      </strong>
                    </p>
                    {aiModalItem.translation && (
                      <p className="text-slate-500 text-[11px]">Nghĩa: {aiModalItem.translation}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-pink-600 font-semibold pt-2 border-t border-slate-200">
                  <span className="shrink-0 text-slate-500 font-medium">Lần trước bé chọn/đọc:</span>
                  {isImageUrl(aiModalItem.wrongAnswerSubmitted) ? (
                    <div className="w-8 h-8 rounded-lg border border-pink-200 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                      <img
                        src={getAssetUrl(aiModalItem.wrongAnswerSubmitted)}
                        alt="Đã chọn sai"
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                        }}
                      />
                    </div>
                  ) : (
                    <strong className="line-through bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {aiModalItem.wrongAnswerSubmitted || 'Chưa đúng'}
                    </strong>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed min-h-[90px] flex items-center">
                {aiLoading ? (
                  <div className="w-full flex flex-col items-center justify-center gap-2 py-3 text-slate-600">
                    <p className="text-xs font-bold text-slate-700">
                      Trợ lý AI đang phân tích bài học cho bé...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 w-full">
                    <p className="font-bold text-slate-800 uppercase text-[11px]">
                      Lời khuyên từ Trợ lý AI:
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                      {aiExplanation || 'Bé hãy chú ý từ vựng và luyện tập lại thật kỹ nhé!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button3D variant="pink" fullWidth size="md" onClick={() => setAiModalItem(null)}>
              ĐÃ HIỂU RỒI!
            </Button3D>
          </div>
        </div>
      )}
    </div>
  );
};
