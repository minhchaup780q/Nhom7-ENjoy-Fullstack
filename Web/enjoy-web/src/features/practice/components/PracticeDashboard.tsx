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
  ChevronRightIcon
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
  1: { name: 'Vòng 1: Từ vựng / Nhận diện', color: 'text-blue-500', badgeBg: 'bg-blue-50 border-blue-200' },
  2: { name: 'Vòng 2: Luyện nghe', color: 'text-purple-500', badgeBg: 'bg-purple-50 border-purple-200' },
  3: { name: 'Vòng 3: Phát âm', color: 'text-amber-500', badgeBg: 'bg-amber-50 border-amber-200' },
  4: { name: 'Vòng 4: Đọc hiểu & Quiz', color: 'text-emerald-500', badgeBg: 'bg-emerald-50 border-emerald-200' },
  5: { name: 'Vòng 5: Điền từ & Viết', color: 'text-pink-500', badgeBg: 'bg-pink-50 border-pink-200' }
};

const PAGE_SIZE = 6;

export const PracticeDashboard: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [stats, setStats] = useState<MistakeStats | null>(null);
  const [loading, setLoading] = useState(true);

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
        mistakeApi.updateAiExplanation(item.id, explanation).catch(() => {});
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
          }}
          onFinished={() => {
            fetchMistakesData(currentPage, statusFilter, roundFilter);
          }}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-[#ff85a2] rounded-3xl p-6 md:p-8 text-white border-4 border-border-main shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-display font-black uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" />
            CÁ NHÂN HÓA LỘ TRÌNH ÔN TẬP
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black uppercase tracking-wide">
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
                ? "Tuyệt đỉnh! Bé không có lỗi sai nào cần ôn tập cả!"
                : `Bé có ${needsReviewTotal} câu cần ôn tập nè! Cùng Enjoy luyện tập nhé!`
            }
            size={90}
          />
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#fff7e6] border-4 border-[#ffd591] rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-bold text-[#d46b08] uppercase">Cần Ôn Tập</p>
          <p className="text-2xl md:text-3xl font-display font-black text-[#d46b08] mt-1">
            {needsReviewTotal}
          </p>
        </div>

        <div className="bg-[#f6ffed] border-4 border-[#b7eb8f] rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-bold text-[#389e0d] uppercase">Đã Thành Thạo</p>
          <p className="text-2xl md:text-3xl font-display font-black text-[#389e0d] mt-1">
            {masteredTotal}
          </p>
        </div>

        <div className="bg-primary-soft border-4 border-primary/30 rounded-2xl p-4 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-xs font-bold text-primary uppercase">Tỷ Lệ Khắc Phục</p>
          <p className="text-2xl md:text-3xl font-display font-black text-primary mt-1">
            {grandTotal > 0 ? `${Math.round((masteredTotal / grandTotal) * 100)}%` : '100%'}
          </p>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="bg-white border-4 border-border-main rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-display font-black text-[#2b2b2b] uppercase">
              Danh sách câu hỏi cần rèn luyện
            </h3>
            <p className="text-xs font-semibold text-text-muted">
              Đang hiển thị {totalElements} câu hỏi ({statusFilter === 'NEEDS_REVIEW' ? 'Cần ôn tập' : 'Đã thành thạo'})
            </p>
          </div>
        </div>

        <Button3D
          variant="green"
          size="md"
          disabled={needsReviewTotal === 0}
          onClick={startPracticeAllNeedsReview}
          className="flex items-center gap-2"
        >
          <PlayIcon className="w-4 h-4 fill-current" />
          ÔN TẬP TẤT CẢ ({needsReviewTotal})
        </Button3D>
      </div>

      {/* Filter Tabs: CHỈ 2 NÚT (CẦN ÔN TẬP & ĐÃ THÀNH THẠO) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStatusChange('NEEDS_REVIEW')}
            className={`px-5 py-2.5 rounded-2xl border-2 font-display text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'NEEDS_REVIEW'
                ? 'bg-[#d46b08] text-white border-[#d46b08] shadow-[0_3px_0_0_#ad4e00]'
                : 'bg-white border-border-main text-[#5c5c5c] hover:bg-bg-light'
            }`}
          >
            <span>CẦN ÔN TẬP</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              statusFilter === 'NEEDS_REVIEW' ? 'bg-white/20 text-white' : 'bg-amber-100 text-[#d46b08]'
            }`}>
              {needsReviewTotal}
            </span>
          </button>

          <button
            onClick={() => handleStatusChange('MASTERED')}
            className={`px-5 py-2.5 rounded-2xl border-2 font-display text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === 'MASTERED'
                ? 'bg-[#389e0d] text-white border-[#389e0d] shadow-[0_3px_0_0_#237804]'
                : 'bg-white border-border-main text-[#5c5c5c] hover:bg-bg-light'
            }`}
          >
            <span>ĐÃ THÀNH THẠO</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              statusFilter === 'MASTERED' ? 'bg-white/20 text-white' : 'bg-green-100 text-[#389e0d]'
            }`}>
              {masteredTotal}
            </span>
          </button>
        </div>

        {/* Round Filter Dropdown */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-text-muted" />
          <select
            value={roundFilter}
            onChange={(e) => handleRoundChange(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="p-2 bg-white border-2 border-border-main rounded-xl text-xs font-display font-bold text-[#5c5c5c] outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả kỹ năng / Vòng</option>
            <option value="1">Vòng 1: Từ vựng / Nhận diện</option>
            <option value="2">Vòng 2: Luyện nghe</option>
            <option value="3">Vòng 3: Luyện nói</option>
            <option value="4">Vòng 4: Đọc hiểu & Quiz</option>
            <option value="5">Vòng 5: Điền từ & Viết</option>
          </select>
        </div>
      </div>

      {/* Mistake Cards List */}
      {loading ? (
        <div className="p-16 text-center text-sm font-bold text-text-muted flex items-center justify-center gap-2">
          <ArrowPathIcon className="w-5 h-5 animate-spin text-primary" />
          ĐANG TẢI DỮ LIỆU LUYỆN TẬP...
        </div>
      ) : mistakes.length === 0 ? (
        <div className="bg-white border-4 border-border-main rounded-3xl p-12 text-center space-y-3">
          <CheckCircleIcon className="w-12 h-12 text-[#52c41a] mx-auto" />
          <h3 className="text-lg font-display font-black text-[#2b2b2b] uppercase">
            Không có câu hỏi nào trong danh mục này!
          </h3>
          <p className="text-xs font-semibold text-text-muted">
            {statusFilter === 'NEEDS_REVIEW' 
              ? 'Bé không có lỗi sai nào cần ôn tập cả! Hãy tiếp tục luyện tập bài mới nhé!' 
              : 'Bé chưa có câu hỏi nào đạt trạng thái Đã thành thạo trong danh mục này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {mistakes.map(item => {
              const roundInfo = ROUND_INFO[item.roundType] || {
                name: `Vòng ${item.roundType}`,
                color: 'text-primary',
                badgeBg: 'bg-primary-soft border-primary/20'
              };

              return (
                <div
                  key={item.id}
                  className="bg-white border-4 border-border-main rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-primary/50 transition-all"
                >
                  <div className="space-y-3">
                    {/* Card Top: Skill & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-display font-black border ${roundInfo.badgeBg} ${roundInfo.color}`}>
                        {roundInfo.name}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-display font-black ${
                        item.status === 'MASTERED'
                          ? 'bg-[#f6ffed] text-[#389e0d] border border-[#b7eb8f]'
                          : 'bg-[#fff7e6] text-[#d46b08] border border-[#ffd591]'
                      }`}>
                        {item.status === 'MASTERED' ? '✓ ĐÃ THÀNH THẠO' : '⚡ CẦN ÔN TẬP'}
                      </span>
                    </div>

                    {/* Word / Sentence Details */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2.5">
                        {item.imageUrl && (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-border-main bg-bg-light shrink-0">
                            <img
                              src={getAssetUrl(item.imageUrl)}
                              alt="thumbnail"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-display font-black text-[#2b2b2b]">
                            {item.contentText}
                          </h4>
                          {item.translation && (
                            <p className="text-xs font-semibold text-text-muted mt-0.5">
                              {item.translation}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => playSpeech(item.contentText)}
                        className="p-2 bg-primary-soft hover:bg-primary/20 text-primary rounded-xl transition-colors shrink-0 cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <SpeakerWaveIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Previous Error & Duration */}
                    <div className="bg-[#f8f9fa] border-2 border-border-main rounded-2xl p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[#cf1322] font-semibold">
                        <span className="flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                          Đã chọn sai:
                        </span>
                        {item.wrongAnswerSubmitted && isImageUrl(item.wrongAnswerSubmitted) ? (
                          <div className="w-8 h-8 rounded-lg border-2 border-red-300 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
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
                          <strong className="line-through">{item.wrongAnswerSubmitted}</strong>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-text-muted text-[11px] font-medium pt-1 border-t border-border-main/50">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          Thời gian làm câu này:
                        </span>
                        <span className="font-mono font-bold text-[#2b2b2b]">{item.durationSeconds || 0} giây</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => startPracticeSingleItem(item)}
                      className="flex-1 py-2.5 bg-primary-soft hover:bg-primary/20 text-primary font-display font-black rounded-xl text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowPathIcon className="w-3.5 h-3.5" />
                      Luyện tập câu này
                    </button>

                    <button
                      onClick={() => handleOpenAiModal(item)}
                      className="p-2.5 bg-[#f0f5ff] hover:bg-[#d6e4ff] text-[#2f54eb] rounded-xl border-2 border-[#adc6ff] transition-colors cursor-pointer"
                      title="AI Phân tích lỗi sai"
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
            <div className="bg-white border-2 border-border-main rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="text-xs font-semibold text-text-muted">
                Trang <strong className="text-[#2b2b2b]">{currentPage + 1}</strong> / <strong className="text-[#2b2b2b]">{totalPages}</strong> (Tổng cộng {totalElements} câu hỏi)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                  className="px-3.5 py-2 rounded-xl border-2 border-border-main bg-white hover:bg-bg-light disabled:opacity-40 disabled:pointer-events-none font-display font-black text-xs text-[#5c5c5c] flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
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
                        return <span key={pageIdx} className="px-1 text-xs text-text-muted">...</span>;
                      }
                      return null;
                    }

                    const isCurrent = pageIdx === currentPage;
                    return (
                      <button
                        key={pageIdx}
                        onClick={() => handlePageChange(pageIdx)}
                        disabled={loading}
                        className={`w-8 h-8 rounded-xl font-display font-black text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-primary text-white border-2 border-primary shadow-sm scale-105'
                            : 'bg-white border-2 border-border-main text-[#5c5c5c] hover:bg-bg-light'
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
                  className="px-3.5 py-2 rounded-xl border-2 border-border-main bg-white hover:bg-bg-light disabled:opacity-40 disabled:pointer-events-none font-display font-black text-xs text-[#5c5c5c] flex items-center gap-1 transition-all cursor-pointer"
                >
                  Sau
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
