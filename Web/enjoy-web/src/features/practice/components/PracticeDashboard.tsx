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
  XMarkIcon
} from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem, type MistakeStats, type MistakeStatus } from '../../learning/services/mistakeApi';
import { MistakePracticePlayer } from './MistakePracticePlayer';

const getAssetUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ROUND_INFO: Record<number, { name: string; color: string; badgeBg: string }> = {
  1: { name: 'Vòng 1: Từ vựng / Nhận diện', color: 'text-blue-500', badgeBg: 'bg-blue-50 border-blue-200' },
  2: { name: 'Vòng 2: Luyện nghe', color: 'text-purple-500', badgeBg: 'bg-purple-50 border-purple-200' },
  3: { name: 'Vòng 3: Phát âm', color: 'text-amber-500', badgeBg: 'bg-amber-50 border-amber-200' },
  4: { name: 'Vòng 4: Đọc hiểu & Quiz', color: 'text-emerald-500', badgeBg: 'bg-emerald-50 border-emerald-200' },
  5: { name: 'Vòng 5: Điền từ & Viết', color: 'text-pink-500', badgeBg: 'bg-pink-50 border-pink-200' }
};

export const PracticeDashboard: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [stats, setStats] = useState<MistakeStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | MistakeStatus>('ALL');
  const [roundFilter, setRoundFilter] = useState<number | 'ALL'>('ALL');

  // Active Practice Session
  const [practiceQueue, setPracticeQueue] = useState<MistakeItem[] | null>(null);

  // Selected Mistake for AI Explanation Modal
  const [aiModalItem, setAiModalItem] = useState<MistakeItem | null>(null);

  const fetchMistakesData = useCallback(async () => {
    setLoading(true);
    try {
      const [mistakesRes, statsRes] = await Promise.all([
        mistakeApi.getUserMistakes(),
        mistakeApi.getMistakeStats(),
      ]);
      setMistakes(mistakesRes || []);
      setStats(statsRes || null);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lỗi sai:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMistakesData();
  }, [fetchMistakesData]);

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Lọc danh sách theo statusFilter và roundFilter
  const filteredMistakes = mistakes.filter(item => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (roundFilter !== 'ALL' && item.roundType !== roundFilter) return false;
    return true;
  });

  const needsReviewList = mistakes.filter(m => m.status === 'NEEDS_REVIEW');

  const startPracticeAllNeedsReview = () => {
    if (needsReviewList.length === 0) return;
    setPracticeQueue(needsReviewList);
  };

  const startPracticeSingleItem = (item: MistakeItem) => {
    setPracticeQueue([item]);
  };

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col max-w-6xl mx-auto w-full select-none gap-6">
      {/* If Practice Player is active */}
      {practiceQueue && (
        <MistakePracticePlayer
          mistakes={practiceQueue}
          onClose={() => {
            setPracticeQueue(null);
            fetchMistakesData();
          }}
          onFinished={() => {
            fetchMistakesData();
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
            expression={needsReviewList.length === 0 ? "happy" : "thinking"}
            speechBubbleText={
              needsReviewList.length === 0
                ? "Tuyệt đỉnh! Bé không có lỗi sai nào cần ôn tập cả!"
                : `Bé có ${needsReviewList.length} câu cần ôn tập nè! Cùng Enjoy luyện tập nhé!`
            }
            size={90}
          />
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-4 border-border-main rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-bold text-text-muted uppercase">Tổng Số Lỗi Đã Gặp</p>
          <p className="text-2xl md:text-3xl font-display font-black text-[#2b2b2b] mt-1">
            {stats?.totalMistakes || mistakes.length}
          </p>
        </div>

        <div className="bg-[#fff7e6] border-4 border-[#ffd591] rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-bold text-[#d46b08] uppercase">Cần Ôn Tập</p>
          <p className="text-2xl md:text-3xl font-display font-black text-[#d46b08] mt-1">
            {stats?.needsReviewCount || needsReviewList.length}
          </p>
        </div>

        <div className="bg-[#f6ffed] border-4 border-[#b7eb8f] rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-bold text-[#389e0d] uppercase">Đã Thành Thạo</p>
          <p className="text-2xl md:text-3xl font-display font-black text-[#389e0d] mt-1">
            {stats?.masteredCount || mistakes.filter(m => m.status === 'MASTERED').length}
          </p>
        </div>

        <div className="bg-primary-soft border-4 border-primary/30 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-bold text-primary uppercase">Tỷ Lệ Khắc Phục</p>
          <p className="text-2xl md:text-3xl font-display font-black text-primary mt-1">
            {mistakes.length > 0
              ? `${Math.round((mistakes.filter(m => m.status === 'MASTERED').length / mistakes.length) * 100)}%`
              : '100%'}
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
              Đang hiển thị {filteredMistakes.length} câu hỏi
            </p>
          </div>
        </div>

        <Button3D
          variant="green"
          size="md"
          disabled={needsReviewList.length === 0}
          onClick={startPracticeAllNeedsReview}
          className="flex items-center gap-2"
        >
          <PlayIcon className="w-4 h-4 fill-current" />
          ÔN TẬP TẤT CẢ ({needsReviewList.length})
        </Button3D>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['ALL', 'NEEDS_REVIEW', 'MASTERED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl border-2 font-display text-xs font-black transition-all ${
                statusFilter === tab
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white border-border-main text-[#5c5c5c] hover:bg-bg-light'
              }`}
            >
              {tab === 'ALL' && 'TẤT CẢ'}
              {tab === 'NEEDS_REVIEW' && 'CẦN ÔN TẬP'}
              {tab === 'MASTERED' && 'ĐÃ THÀNH THẠO'}
            </button>
          ))}
        </div>

        {/* Round Filter Dropdown */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-text-muted" />
          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
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
        <div className="p-12 text-center text-sm font-bold text-text-muted flex items-center justify-center gap-2">
          <ArrowPathIcon className="w-5 h-5 animate-spin text-primary" />
          ĐANG TẢI DỮ LIỆU LUYỆN TẬP...
        </div>
      ) : filteredMistakes.length === 0 ? (
        <div className="bg-white border-4 border-border-main rounded-3xl p-12 text-center space-y-3">
          <CheckCircleIcon className="w-12 h-12 text-[#52c41a] mx-auto" />
          <h3 className="text-lg font-display font-black text-[#2b2b2b] uppercase">
            Không có câu hỏi nào trong danh mục này!
          </h3>
          <p className="text-xs font-semibold text-text-muted">
            Bé học rất tốt! Hãy tiếp tục duy trì phong độ nhé!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMistakes.map(item => {
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
                      {item.wrongAnswerSubmitted && item.wrongAnswerSubmitted.startsWith('http') ? (
                        <div className="w-6 h-6 rounded border border-red-300 overflow-hidden shrink-0">
                          <img src={getAssetUrl(item.wrongAnswerSubmitted)} alt="Wrong" className="w-full h-full object-cover" />
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
                    onClick={() => setAiModalItem(item)}
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
      )}

      {/* AI Explanation Modal */}
      {aiModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-border-main rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-border-main pb-3">
              <div className="flex items-center gap-2 text-primary font-display font-black text-base uppercase">
                <CpuChipIcon className="w-5 h-5" />
                AI Phân Tích Lỗi Sai
              </div>
              <button
                onClick={() => setAiModalItem(null)}
                className="p-1 hover:bg-bg-light rounded-lg text-text-muted cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-bg-light p-3.5 rounded-2xl border-2 border-border-main text-xs space-y-1">
                <p className="font-bold text-[#2b2b2b]">Câu hỏi: <strong>{aiModalItem.contentText}</strong></p>
                <p className="text-[#cf1322]">Đáp án sai đã chọn: <strong className="line-through">{aiModalItem.wrongAnswerSubmitted}</strong></p>
                <p className="text-[#389e0d]">Đáp án đúng: <strong>{aiModalItem.keyword || aiModalItem.contentText}</strong></p>
              </div>

              <div className="bg-[#f0f5ff] border-2 border-[#adc6ff] rounded-2xl p-4 text-xs font-semibold text-[#1d39c4] leading-relaxed">
                {aiModalItem.aiExplanationCache ? (
                  <p>{aiModalItem.aiExplanationCache}</p>
                ) : (
                  <div className="space-y-2">
                    <p>
                      💡 <strong>Gợi ý từ Enjoy AI:</strong>
                    </p>
                    <p>
                      Khi làm câu hỏi dạng này, bé cần chú ý từ khóa chính <strong>"{aiModalItem.keyword || aiModalItem.contentText}"</strong> thay vì chọn <em>"{aiModalItem.wrongAnswerSubmitted}"</em> nhé!
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
