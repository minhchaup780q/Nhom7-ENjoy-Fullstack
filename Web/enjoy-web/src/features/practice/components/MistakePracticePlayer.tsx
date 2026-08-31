import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Volume2, 
  RotateCcw, 
  Play, 
  Trophy, 
  Sparkles, 
  Award, 
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';

interface MistakePracticePlayerProps {
  mistakes: MistakeItem[];
  onClose: () => void;
  onFinished: (stats: { total: number; mastered: number; score: number }) => void;
}

const getAssetUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ROUND_NAMES: Record<number, string> = {
  1: 'Nhận diện từ vựng',
  2: 'Luyện nghe (Listening)',
  3: 'Luyện nói & Phát âm',
  4: 'Đọc hiểu & Trắc nghiệm',
  5: 'Chính tả & Điền từ'
};

export const MistakePracticePlayer: React.FC<MistakePracticePlayerProps> = ({
  mistakes,
  onClose,
  onFinished,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillInputValue, setFillInputValue] = useState<string>('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = mistakes[currentIndex];
  const progressPercent = mistakes.length > 0 ? (currentIndex / mistakes.length) * 100 : 0;

  // Phát âm thanh
  const playAudio = useCallback((speed: number = 1.0) => {
    if (!currentItem || !currentItem.audioUrl) {
      // Fallback Web Speech Synthesis nếu không có audioUrl
      if (currentItem && currentItem.contentText && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.contentText);
        utterance.lang = 'en-US';
        utterance.rate = speed;
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    const audio = new Audio(getAssetUrl(currentItem.audioUrl));
    audio.playbackRate = speed;
    setIsPlayingAudio(true);
    audio.play()
      .then(() => setIsPlayingAudio(true))
      .catch(() => setIsPlayingAudio(false));
    audio.onended = () => setIsPlayingAudio(false);
  }, [currentItem]);

  // Tạo các lựa chọn trắc nghiệm cho câu hiện tại
  useEffect(() => {
    if (!currentItem) return;

    setSelectedOption(null);
    setFillInputValue('');
    setIsChecked(false);
    setIsCorrect(false);

    // Tự động phát âm thanh nếu là vòng nghe
    if (currentItem.roundType === 2) {
      setTimeout(() => playAudio(), 400);
    }

    // Tạo options
    const correctAnswer = currentItem.keyword || currentItem.contentText || '';
    const wrongSubmitted = currentItem.wrongAnswerSubmitted;

    // Lấy thêm distractors từ các mistake khác trong danh sách
    const otherAnswers = mistakes
      .filter(m => m.id !== currentItem.id)
      .map(m => m.keyword || m.contentText)
      .filter(Boolean);

    const pool = Array.from(new Set([correctAnswer, wrongSubmitted, ...otherAnswers])).slice(0, 4);
    // Shuffle
    setOptions(pool.sort(() => 0.5 - Math.random()));
  }, [currentIndex, currentItem, mistakes, playAudio]);

  const getTargetAnswer = () => {
    if (!currentItem) return '';
    return (currentItem.keyword || currentItem.contentText || '').trim().toLowerCase();
  };

  const handleCheckAnswer = async () => {
    if (!currentItem || isChecked) return;

    let userAns = '';
    let correct = false;

    if (currentItem.roundType === 5) {
      // Điền từ / Viết
      userAns = fillInputValue.trim().toLowerCase();
      correct = userAns === getTargetAnswer();
    } else {
      // Trắc nghiệm
      userAns = (selectedOption || '').trim().toLowerCase();
      correct = userAns === getTargetAnswer();
    }

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setMasteredCount(prev => prev + 1);
      setTotalScore(prev => prev + 20);
      // Cập nhật trạng thái thành MASTERED trên server
      mistakeApi.updateMistakeStatus(currentItem.id, 'MASTERED').catch(err => {
        console.warn("Lỗi cập nhật trạng thái lỗi sai:", err);
      });
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      // Cập nhật lại đáp án sai mới nhất
      mistakeApi.logMistake({
        questionId: currentItem.questionId,
        roundType: currentItem.roundType,
        wrongAnswerSubmitted: userAns || 'Chưa đúng',
      }).catch(err => console.warn(err));
    }
  };

  const handleContinue = () => {
    if (hearts <= 0 || currentIndex >= mistakes.length - 1) {
      setIsFinished(true);
      onFinished({
        total: mistakes.length,
        mastered: masteredCount + (isCorrect ? 1 : 0),
        score: totalScore + (isCorrect ? 20 : 0)
      });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentItem || isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white border-4 border-border-main rounded-3xl p-8 max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 shadow-2xl">
          <div className="w-20 h-20 bg-primary-soft rounded-3xl mx-auto flex items-center justify-center text-primary shadow-inner">
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-display font-black text-[#2b2b2b] uppercase">
              Hoàn Thành Phiên Ôn Tập!
            </h2>
            <p className="text-xs font-semibold text-text-muted">
              Bé đã luyện tập lại các câu hỏi đã từng làm sai!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f6ffed] border-2 border-[#b7eb8f] rounded-2xl p-4">
              <p className="text-xs font-bold text-[#389e0d] uppercase">Đã Thành Thạo</p>
              <p className="text-3xl font-display font-black text-[#389e0d] mt-1">
                {masteredCount} / {mistakes.length}
              </p>
            </div>
            <div className="bg-primary-soft border-2 border-primary/30 rounded-2xl p-4">
              <p className="text-xs font-bold text-primary uppercase">Điểm Nhận Được</p>
              <p className="text-3xl font-display font-black text-primary mt-1">
                +{totalScore} EXP
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Mascot 
              expression={masteredCount >= mistakes.length / 2 ? "happy" : "thinking"} 
              speechBubbleText={
                masteredCount === mistakes.length 
                  ? "Xuất sắc! Bé đã khắc phục 100% tất cả lỗi sai rồi!"
                  : `Bé đã làm đúng lại ${masteredCount} câu! Tiếp tục luyện tập nhé!`
              }
              size={85}
            />
          </div>

          <Button3D variant="green" fullWidth size="lg" onClick={onClose}>
            QUAY VỀ TRUNG TÂM LUYỆN TẬP
          </Button3D>
        </div>
      </div>
    );
  }

  const isCheckEnabled = currentItem.roundType === 5 ? fillInputValue.trim().length > 0 : !!selectedOption;

  return (
    <div className="fixed inset-0 z-50 bg-bg-main flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full p-4 md:p-6 flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-bg-light rounded-xl text-text-muted hover:text-[#2b2b2b] transition-colors"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-[#e5e5e5] h-4 rounded-full overflow-hidden border-2 border-border-main p-0.5">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-2 border-red-200 rounded-2xl text-red-500 font-display font-black text-sm">
          <Heart className="w-5 h-5 fill-current animate-pulse" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col justify-center gap-6">
        {/* Skill Badge & Previous Error Note */}
        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 bg-primary-soft text-primary rounded-full text-xs font-display font-extrabold uppercase">
            {ROUND_NAMES[currentItem.roundType] || `Vòng ${currentItem.roundType}`}
          </span>
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Lần trước mất: {currentItem.durationSeconds || 0}s
          </span>
        </div>

        {/* Question Prompt Card */}
        <div className="bg-white border-4 border-border-main rounded-3xl p-6 shadow-sm space-y-4 text-center relative">
          <div className="flex items-center justify-center gap-3">
            <h3 className="text-2xl md:text-3xl font-display font-black text-[#2b2b2b]">
              {currentItem.roundType === 2 ? 'Nghe và chọn đáp án đúng' : currentItem.contentText}
            </h3>
            <button
              onClick={() => playAudio(1.0)}
              className="p-2.5 bg-primary-soft hover:bg-primary/20 text-primary rounded-2xl transition-all"
              title="Nghe phát âm"
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {currentItem.translation && (
            <p className="text-sm font-semibold text-text-muted">
              {currentItem.translation}
            </p>
          )}

          {currentItem.imageUrl && currentItem.roundType !== 2 && (
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-border-main bg-bg-light flex items-center justify-center">
              <img 
                src={getAssetUrl(currentItem.imageUrl)} 
                alt="Illustration" 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Note of previous mistake */}
          <div className="bg-[#fff1f0] border-2 border-[#ffa39e] rounded-2xl p-2.5 text-xs text-[#cf1322] font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Lần trước bé chọn sai là: <strong className="line-through">{currentItem.wrongAnswerSubmitted}</strong></span>
          </div>
        </div>

        {/* Options / Input Form */}
        {currentItem.roundType === 5 ? (
          // Điền từ
          <div className="space-y-3">
            <input
              type="text"
              value={fillInputValue}
              onChange={(e) => setFillInputValue(e.target.value)}
              disabled={isChecked}
              placeholder="Nhập từ chính xác vào đây..."
              className="w-full p-4 rounded-2xl border-4 border-border-main font-display font-bold text-center text-lg focus:border-primary outline-none"
              onKeyDown={(e) => e.key === 'Enter' && isCheckEnabled && handleCheckAnswer()}
            />
          </div>
        ) : (
          // Trắc nghiệm
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={idx}
                  onClick={() => !isChecked && setSelectedOption(opt)}
                  disabled={isChecked}
                  className={`p-4 rounded-2xl border-4 font-display font-extrabold text-sm md:text-base transition-all ${
                    isSelected 
                      ? 'bg-primary-soft border-primary text-primary shadow-md scale-[1.02]' 
                      : 'bg-white border-border-main text-[#5c5c5c] hover:bg-bg-light'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className={`border-t-4 border-border-main p-4 md:p-6 transition-all ${
        isChecked 
          ? isCorrect 
            ? 'bg-[#f6ffed] border-[#b7eb8f]' 
            : 'bg-[#fff1f0] border-[#ffa39e]'
          : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {isChecked ? (
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isCorrect ? 'bg-[#52c41a] text-white' : 'bg-[#f5222d] text-white'
              }`}>
                {isCorrect ? <CheckCircle className="w-7 h-7" /> : <X className="w-7 h-7" />}
              </div>
              <div>
                <p className={`font-display font-black text-base md:text-lg ${
                  isCorrect ? 'text-[#389e0d]' : 'text-[#cf1322]'
                }`}>
                  {isCorrect ? 'TUYỆT VỜI! BÉ ĐÃ LÀM ĐÚNG LẠI!' : 'CHƯA CHÍNH XÁC!'}
                </p>
                {!isCorrect && (
                  <p className="text-xs font-bold text-[#5c5c5c]">
                    Đáp án đúng: <strong className="text-[#389e0d]">{currentItem.keyword || currentItem.contentText}</strong>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:block text-xs font-semibold text-text-muted">
              Hãy chọn đáp án chính xác để khắc phục lỗi sai nhé!
            </div>
          )}

          <div>
            {!isChecked ? (
              <Button3D
                variant="green"
                size="lg"
                disabled={!isCheckEnabled}
                onClick={handleCheckAnswer}
              >
                KIỂM TRA
              </Button3D>
            ) : (
              <Button3D
                variant={isCorrect ? 'green' : 'pink'}
                size="lg"
                onClick={handleContinue}
              >
                {currentIndex >= mistakes.length - 1 ? 'XEM KẾT QUẢ' : 'TIẾP TỤC'}
              </Button3D>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
