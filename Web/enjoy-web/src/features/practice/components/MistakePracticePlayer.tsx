import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Volume2, 
  RotateCcw, 
  Trophy, 
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

const getAssetUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  return `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

const ROUND_NAMES: Record<number, string> = {
  1: 'Vòng 1: Nhận diện từ vựng',
  2: 'Vòng 2: Luyện nghe (Listening)',
  3: 'Vòng 3: Luyện nói & Phát âm',
  4: 'Vòng 4: Đọc hiểu & Quiz',
  5: 'Vòng 5: Chính tả & Điền từ'
};

const BACKUP_DISTRACTORS = [
  'apple', 'banana', 'cat', 'dog', 'elephant', 'fish', 'giraffe', 'house',
  'ice cream', 'jacket', 'kite', 'lion', 'monkey', 'nest', 'orange', 'panda',
  'queen', 'rabbit', 'sun', 'tiger', 'umbrella', 'van', 'water', 'yellow', 'zebra',
  'run', 'jump', 'eat', 'sleep', 'read', 'sing', 'dance', 'play', 'swim', 'fly'
];

const BACKUP_IMAGES = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&auto=format&fit=crop&q=80'
];

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
    if (!currentItem) return;

    if (currentItem.audioUrl) {
      const audio = new Audio(getAssetUrl(currentItem.audioUrl));
      audio.playbackRate = speed;
      setIsPlayingAudio(true);
      audio.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
      audio.onended = () => setIsPlayingAudio(false);
      return;
    }

    if (currentItem.contentText && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.contentText);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentItem]);

  // Luôn tạo đúng 4 lựa chọn (Hình ảnh cho Vòng 2, Chữ cho các Vòng khác)
  useEffect(() => {
    if (!currentItem) return;

    setSelectedOption(null);
    setFillInputValue('');
    setIsChecked(false);
    setIsCorrect(false);

    // Tự động phát âm thanh nếu là Vòng nghe (Round 2)
    if (currentItem.roundType === 2) {
      const timer = setTimeout(() => playAudio(1.0), 300);
      return () => clearTimeout(timer);
    }

    if (currentItem.roundType === 2) {
      // VÒNG NGHE: Luôn tạo 4 hình ảnh
      const correctImage = currentItem.imageUrl || BACKUP_IMAGES[0];
      const otherImages = mistakes
        .map(m => m.imageUrl || '')
        .filter(img => img !== '' && img !== correctImage);

      const uniqueOthers = Array.from(new Set(otherImages));
      while (uniqueOthers.length < 3) {
        const backupImg = BACKUP_IMAGES[Math.floor(Math.random() * BACKUP_IMAGES.length)];
        if (!uniqueOthers.includes(backupImg) && backupImg !== correctImage) {
          uniqueOthers.push(backupImg);
        }
      }

      const final4Images = [correctImage, ...uniqueOthers.slice(0, 3)].sort(() => 0.5 - Math.random());
      setOptions(final4Images);
    } else {
      // CÁC VÒNG KHÁC: Luôn tạo 4 lựa chọn chữ
      const correctAnswer = currentItem.keyword || currentItem.contentText || '';
      const wrongSubmitted = currentItem.wrongAnswerSubmitted;

      const otherWords = mistakes
        .filter(m => m.id !== currentItem.id)
        .map(m => m.keyword || m.contentText)
        .filter((w): w is string => Boolean(w && !w.startsWith('http') && w.toLowerCase() !== correctAnswer.toLowerCase()));

      const poolSet = new Set<string>();
      poolSet.add(correctAnswer);
      if (wrongSubmitted && !wrongSubmitted.startsWith('http') && wrongSubmitted.toLowerCase() !== correctAnswer.toLowerCase()) {
        poolSet.add(wrongSubmitted);
      }
      otherWords.forEach(w => poolSet.add(w));

      const backupPool = [...BACKUP_DISTRACTORS].sort(() => 0.5 - Math.random());
      for (const word of backupPool) {
        if (poolSet.size >= 4) break;
        if (word.toLowerCase() !== correctAnswer.toLowerCase()) {
          poolSet.add(word);
        }
      }

      const final4Options = Array.from(poolSet).slice(0, 4).sort(() => 0.5 - Math.random());
      setOptions(final4Options);
    }
  }, [currentIndex, currentItem, mistakes, playAudio]);

  const handleCheckAnswer = async () => {
    if (!currentItem || isChecked) return;

    let userAns = '';
    let correct = false;

    if (currentItem.roundType === 2) {
      userAns = selectedOption || '';
      const targetImage = currentItem.imageUrl || options[0];
      correct = selectedOption === targetImage || selectedOption === currentItem.imageUrl;
    } else if (currentItem.roundType === 5) {
      userAns = fillInputValue.trim().toLowerCase();
      const target = (currentItem.keyword || currentItem.contentText || '').trim().toLowerCase();
      correct = userAns === target;
    } else {
      userAns = (selectedOption || '').trim().toLowerCase();
      const target = (currentItem.keyword || currentItem.contentText || '').trim().toLowerCase();
      correct = userAns === target;
    }

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setMasteredCount(prev => prev + 1);
      setTotalScore(prev => prev + 20);
      mistakeApi.updateMistakeStatus(currentItem.id, 'MASTERED').catch(err => console.warn(err));
    } else {
      setHearts(prev => Math.max(0, prev - 1));
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
        <div className="bg-white border-4 border-border-main rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-2xl mx-auto flex items-center justify-center text-primary shadow-inner">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-display font-black text-[#2b2b2b] uppercase">
              Hoàn Thành Phiên Ôn Tập!
            </h2>
            <p className="text-xs font-semibold text-text-muted">
              Bé đã luyện tập lại các câu hỏi đã làm sai.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f6ffed] border-2 border-[#b7eb8f] rounded-2xl p-3">
              <p className="text-[11px] font-bold text-[#389e0d] uppercase">Đã Thành Thạo</p>
              <p className="text-2xl font-display font-black text-[#389e0d] mt-0.5">
                {masteredCount} / {mistakes.length}
              </p>
            </div>
            <div className="bg-primary-soft border-2 border-primary/30 rounded-2xl p-3">
              <p className="text-[11px] font-bold text-primary uppercase">Điểm Thưởng</p>
              <p className="text-2xl font-display font-black text-primary mt-0.5">
                +{totalScore} EXP
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Mascot 
              expression={masteredCount >= mistakes.length / 2 ? "happy" : "thinking"} 
              speechBubbleText={
                masteredCount === mistakes.length 
                  ? "Xuất sắc! Bé đã làm đúng 100% tất cả lỗi sai!"
                  : `Bé đã làm đúng ${masteredCount} câu! Tiếp tục cố gắng nhé!`
              }
              size={75}
            />
          </div>

          <Button3D variant="green" fullWidth size="md" onClick={onClose}>
            QUAY VỀ TRUNG TÂM LUYỆN TẬP
          </Button3D>
        </div>
      </div>
    );
  }

  const isListeningRound = currentItem.roundType === 2;
  const isCheckEnabled = currentItem.roundType === 5 ? fillInputValue.trim().length > 0 : !!selectedOption;

  return (
    <div className="fixed inset-0 z-50 bg-[#f7f9fa] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full px-4 py-3 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-xl text-text-muted hover:text-[#2b2b2b]"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex-1 bg-[#e5e7eb] h-3.5 rounded-full overflow-hidden border border-border-main/50 p-0.5">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-xl text-red-500 font-display font-black text-xs">
          <Heart className="w-4 h-4 fill-current animate-pulse" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-2 flex flex-col justify-center gap-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-0.5 bg-primary-soft text-primary rounded-full text-xs font-display font-black uppercase">
            {ROUND_NAMES[currentItem.roundType] || `Vòng ${currentItem.roundType}`}
          </span>
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {currentItem.durationSeconds || 0}s
          </span>
        </div>

        {/* Question Flashcard */}
        <div className="bg-white border-2 border-border-main rounded-2xl p-4 shadow-sm space-y-3 text-center">
          {isListeningRound ? (
            <div className="flex items-center justify-center gap-3 py-1">
              <button
                onClick={() => playAudio(1.0)}
                className={`btn-3d w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                  isPlayingAudio ? 'btn-3d-pink animate-pulse' : 'btn-3d-blue'
                }`}
                title="Nghe chuẩn"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => playAudio(0.6)}
                className="btn-3d w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer bg-amber-100 border-b-4 border-amber-300"
                title="Nghe chậm"
              >
                <span className="text-lg select-none">🐢</span>
              </button>
              <div className="text-left">
                <h4 className="text-sm font-display font-extrabold text-[#2b2b2b] m-0">
                  HÃY NGHE VÀ CHỌN ẢNH ĐÚNG!
                </h4>
                <p className="text-[10px] font-semibold text-text-muted">
                  Bấm nút loa để nghe phát âm
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {currentItem.imageUrl && (
                <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden border border-border-main bg-bg-light flex items-center justify-center">
                  <img
                    src={getAssetUrl(currentItem.imageUrl)}
                    alt="Illustration"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = BACKUP_IMAGES[0];
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl font-display font-black text-[#2b2b2b]">
                  {currentItem.contentText}
                </h3>
                <button
                  onClick={() => playAudio(1.0)}
                  className="p-2 bg-primary-soft hover:bg-primary/20 text-primary rounded-xl"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {currentItem.translation && (
                <p className="text-xs font-semibold text-text-muted">
                  {currentItem.translation}
                </p>
              )}
            </div>
          )}

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 border border-red-200 rounded-full text-[11px] text-red-600 font-semibold">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Lần trước chọn sai: </span>
            {currentItem.wrongAnswerSubmitted.startsWith('http') ? (
              <img src={getAssetUrl(currentItem.wrongAnswerSubmitted)} alt="Wrong" className="w-4 h-4 rounded object-cover inline-block" />
            ) : (
              <strong className="line-through">{currentItem.wrongAnswerSubmitted}</strong>
            )}
          </div>
        </div>

        {/* 4 Choices */}
        {isListeningRound ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            {options.map((imgSrc, idx) => {
              const isSelected = selectedOption === imgSrc;
              const optionLabel = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  onClick={() => !isChecked && setSelectedOption(imgSrc)}
                  disabled={isChecked}
                  className={`p-1.5 rounded-2xl border-4 transition-all flex flex-col items-center gap-1 relative cursor-pointer ${
                    isSelected 
                      ? 'border-primary bg-primary-soft ring-2 ring-primary/10 scale-[1.02]' 
                      : 'border-border-main bg-white hover:border-primary/50'
                  }`}
                >
                  <span className="absolute top-2 left-2 z-10 w-5 h-5 rounded-md border flex items-center justify-center font-display text-[10px] font-extrabold bg-white border-border-main text-text-muted">
                    {optionLabel}
                  </span>
                  <div className="w-full aspect-video sm:h-28 rounded-xl overflow-hidden bg-bg-light relative">
                    <img
                      src={getAssetUrl(imgSrc)}
                      alt={`Lựa chọn ${optionLabel}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = BACKUP_IMAGES[idx % BACKUP_IMAGES.length];
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : currentItem.roundType === 5 ? (
          <div className="space-y-2">
            <input
              type="text"
              value={fillInputValue}
              onChange={(e) => setFillInputValue(e.target.value)}
              disabled={isChecked}
              placeholder="Gõ từ chính xác vào đây..."
              className="w-full p-3 rounded-2xl border-2 border-border-main font-display font-bold text-center text-base focus:border-primary outline-none bg-white"
              onKeyDown={(e) => e.key === 'Enter' && isCheckEnabled && handleCheckAnswer()}
              autoFocus
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const optionLabel = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  onClick={() => !isChecked && setSelectedOption(opt)}
                  disabled={isChecked}
                  className={`py-3 px-3 rounded-xl border-2 font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-primary text-white border-primary shadow-sm scale-[1.01]' 
                      : 'bg-white border-border-main text-[#4b5563] hover:bg-bg-light'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md text-[10px] font-extrabold flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-bg-light text-text-muted border'
                  }`}>
                    {optionLabel}
                  </span>
                  <span className="flex-1 text-center truncate">{opt}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t-2 border-border-main px-4 py-3 transition-all ${
        isChecked 
          ? isCorrect 
            ? 'bg-[#f6ffed] border-[#b7eb8f]' 
            : 'bg-[#fff1f0] border-[#ffa39e]'
          : 'bg-white'
      }`}>
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {isChecked ? (
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isCorrect ? 'bg-[#52c41a] text-white' : 'bg-[#f5222d] text-white'
              }`}>
                {isCorrect ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <p className={`font-display font-black text-sm ${
                  isCorrect ? 'text-[#389e0d]' : 'text-[#cf1322]'
                }`}>
                  {isCorrect ? 'ĐÃ LÀM ĐÚNG LẠI!' : 'CHƯA CHÍNH XÁC!'}
                </p>
                {!isCorrect && (
                  <p className="text-[10px] font-semibold text-[#5c5c5c]">
                    Đáp án: <strong className="text-[#389e0d]">{currentItem.keyword || currentItem.contentText}</strong>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs font-semibold text-text-muted">
              Chọn đáp án đúng nhất để hoàn thành nhé!
            </div>
          )}

          <div>
            {!isChecked ? (
              <Button3D
                variant="green"
                size="md"
                disabled={!isCheckEnabled}
                onClick={handleCheckAnswer}
              >
                KIỂM TRA
              </Button3D>
            ) : (
              <Button3D
                variant={isCorrect ? 'green' : 'pink'}
                size="md"
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
