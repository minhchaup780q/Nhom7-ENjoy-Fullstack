import React, { useState, useEffect, useCallback } from 'react';
import { 
  XMarkIcon, 
  HeartIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  SpeakerWaveIcon, 
  ArrowPathIcon, 
  TrophyIcon, 
  ClockIcon,
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { learningApi } from '../../learning/services/learningApi';
import { chatbotApi } from '../../learning/services/chatbotApi';

interface MistakePracticePlayerProps {
  mistakes: MistakeItem[];
  onClose: () => void;
  onFinished: (stats: { total: number; mastered: number; score: number }) => void;
}

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

const getAssetUrl = (path?: string | null) => {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
};

const ROUND_NAMES: Record<number, string> = {
  1: 'Vòng 1: Giới thiệu từ mới',
  2: 'Vòng 2: Luyện nghe (Listening)',
  3: 'Vòng 3: Luyện nói & Phát âm (Speaking)',
  4: 'Vòng 4: Đọc hiểu & Quiz',
  5: 'Vòng 5: Chính tả & Điền từ'
};

const BACKUP_IMAGES = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80',
];

const BACKUP_KEYWORDS = [
  'cow', 'pig', 'duck', 'horse', 'sheep', 'run', 'swim', 'eat', 'sleep', 'fly',
  'red', 'blue', 'green', 'yellow', 'black', 'apple', 'cat', 'dog', 'house'
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

  // States dành riêng cho Vòng 3 (SPEAKING / Luyện phát âm)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [speakingResult, setSpeakingResult] = useState<{ word: string; status: 'correct' | 'wrong' }[] | null>(null);

  // States dành cho AI Advice Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [currentAttemptAnswer, setCurrentAttemptAnswer] = useState<string | null>(null);

  const currentItem = mistakes[currentIndex];

  const handleOpenAiAdvice = async () => {
    if (!currentItem) return;
    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiAdvice('');
    try {
      const explanation = await chatbotApi.explainMistake(currentItem, currentAttemptAnswer || undefined);
      setAiAdvice(explanation);
      mistakeApi.updateAiExplanation(currentItem.id, explanation).catch(() => {});
    } catch (err) {
      setAiAdvice('Trợ lý AI đang bận một chút. Bé hãy xem lại từ vựng và đáp án đúng nhé!');
    } finally {
      setAiLoading(false);
    }
  };
  const progressPercent = mistakes.length > 0 ? (currentIndex / mistakes.length) * 100 : 0;

  // Phát âm thanh mẫu
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

  // Bắt đầu ghi âm giọng đọc của bé
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setRecordedBlob(audioBlob);
        setSpeakingResult(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedAudioUrl(null);
      setRecordedBlob(null);
      setSpeakingResult(null);
    } catch (err) {
      console.error("Không thể truy cập micro:", err);
      alert("Bé hãy cho phép Enjoy truy cập micro để luyện tập phát âm nhé!");
    }
  };

  // Dừng ghi âm
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Nghe lại đoạn âm thanh vừa thu
  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    const audio = new Audio(recordedAudioUrl);
    audio.play().catch(err => console.error("Không thể phát lại bản ghi âm:", err));
  };

  // Khởi tạo câu hỏi theo từng vòng
  useEffect(() => {
    if (!currentItem) return;

    setSelectedOption(null);
    setFillInputValue('');
    setIsChecked(false);
    setIsCorrect(false);
    setIsRecording(false);
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setSpeakingResult(null);
    setCurrentAttemptAnswer(null);

    if (currentItem.roundType === 2) {
      // VÒNG 2 (LISTENING): 4 hình ảnh
      const correctImage = currentItem.imageUrl || '';
      const otherImages = mistakes
        .map(item => item.imageUrl || '')
        .filter(img => img !== '' && img !== correctImage);

      const uniqueOtherImages = Array.from(new Set(otherImages));
      const selectedOthers: string[] = [];

      uniqueOtherImages.forEach(img => {
        if (selectedOthers.length < 3 && !selectedOthers.includes(img)) {
          selectedOthers.push(img);
        }
      });

      for (const backupImg of BACKUP_IMAGES) {
        if (selectedOthers.length >= 3) break;
        if (backupImg !== correctImage && !selectedOthers.includes(backupImg)) {
          selectedOthers.push(backupImg);
        }
      }

      const finalChoices = [correctImage || BACKUP_IMAGES[0], ...selectedOthers].sort(() => 0.5 - Math.random());
      setOptions(finalChoices);

      // Tự động phát âm thanh khi vào vòng nghe
      setTimeout(() => playAudio(1.0), 300);
    } else if (currentItem.roundType === 3) {
      // VÒNG 3 (SPEAKING): Luyện nói, không cần tạo 4 lựa chọn
      setOptions([]);
    } else {
      // CÁC VÒNG KHÁC: 4 lựa chọn chữ
      const correctKeyword = currentItem.keyword || currentItem.contentText || '';
      const otherKeywords = mistakes
        .filter(item => item.id !== currentItem.id && item.keyword && item.keyword !== correctKeyword)
        .map(item => item.keyword as string);

      const uniqueOthers = Array.from(new Set(otherKeywords));
      const selectedOthers: string[] = [];

      uniqueOthers.forEach(w => {
        if (selectedOthers.length < 3 && !selectedOthers.includes(w)) {
          selectedOthers.push(w);
        }
      });

      for (const backup of BACKUP_KEYWORDS) {
        if (selectedOthers.length >= 3) break;
        if (backup !== correctKeyword && !selectedOthers.includes(backup)) {
          selectedOthers.push(backup);
        }
      }

      const finalChoices = [correctKeyword, ...selectedOthers].sort(() => 0.5 - Math.random());
      setOptions(finalChoices);
    }
  }, [currentIndex, currentItem, mistakes, playAudio]);

  const handleCheckAnswer = async () => {
    if (!currentItem || isChecked) return;

    let userAns = '';
    let correct = false;

    if (currentItem.roundType === 3) {
      // VÒNG 3 (SPEAKING): Chấm điểm bằng AI Faster-Whisper
      if (recordedBlob && currentItem.contentText) {
        setIsAssessing(true);
        try {
          const res = await learningApi.assessPronunciation(recordedBlob, currentItem.contentText, currentItem.keyword);
          setSpeakingResult(res.details);
          correct = res.isAllCorrect;
          userAns = res.recognizedText || 'Phát âm chưa chuẩn';
        } catch (err) {
          console.error("Lỗi khi chấm điểm phát âm vòng luyện tập:", err);
          correct = false;
          userAns = 'Lỗi nhận diện giọng nói';
          setSpeakingResult(currentItem.contentText.split(' ').map(w => ({ word: w, status: 'wrong' })));
        } finally {
          setIsAssessing(false);
        }
      } else {
        correct = false;
        userAns = 'Chưa ghi âm';
      }
    } else if (currentItem.roundType === 2) {
      // Vòng Nghe: So sánh URL ảnh
      const correctImage = currentItem.imageUrl || options[0];
      correct = selectedOption === correctImage || (!!currentItem.imageUrl && selectedOption === currentItem.imageUrl);
      const chosenMistake = mistakes.find(m => m.imageUrl === selectedOption);
      userAns = chosenMistake ? (chosenMistake.keyword || chosenMistake.contentText) : (selectedOption || 'chưa chính xác');
    } else if (currentItem.roundType === 5) {
      // Vòng Điền từ
      userAns = fillInputValue.trim().toLowerCase();
      const target = (currentItem.keyword || currentItem.contentText || '').trim().toLowerCase();
      correct = userAns === target;
    } else {
      // Vòng Trắc nghiệm chữ
      userAns = (selectedOption || '').trim().toLowerCase();
      const target = (currentItem.keyword || currentItem.contentText || '').trim().toLowerCase();
      correct = userAns === target;
    }

    setIsCorrect(correct);
    setIsChecked(true);
    setCurrentAttemptAnswer(userAns);

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
            <TrophyIcon className="w-8 h-8" />
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
  const isSpeakingRound = currentItem.roundType === 3;
  const isFillBlankRound = currentItem.roundType === 5;

  const isCheckEnabled = isSpeakingRound
    ? (!!recordedAudioUrl && !isRecording && !isAssessing)
    : isFillBlankRound
      ? fillInputValue.trim().length > 0
      : !!selectedOption;

  return (
    <div className="fixed inset-0 z-50 bg-[#f7f9fa] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <div className="max-w-3xl mx-auto w-full px-4 py-3 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-xl text-text-muted hover:text-[#2b2b2b] transition-colors cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex-1 bg-[#e5e7eb] h-3.5 rounded-full overflow-hidden border border-border-main/50 p-0.5">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-xl text-red-500 font-display font-black text-xs">
          <HeartIcon className="w-4 h-4 animate-pulse" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Core Question Area */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-2 flex flex-col justify-center gap-4">
        {/* Round Badge */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-0.5 bg-primary-soft text-primary rounded-full text-xs font-display font-black uppercase">
            {ROUND_NAMES[currentItem.roundType] || `Vòng ${currentItem.roundType}`}
          </span>
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {currentItem.durationSeconds || 0}s
          </span>
        </div>

        {/* Question Header Card */}
        <div className="bg-white border-2 border-border-main rounded-2xl p-4 shadow-sm space-y-3 text-center">
          {isListeningRound ? (
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => playAudio(1.0)}
                className={`btn-3d w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                  isPlayingAudio ? 'btn-3d-pink animate-pulse' : 'btn-3d-blue hover:scale-105'
                }`}
                title="Nghe chuẩn"
              >
                <SpeakerWaveIcon className="w-7 h-7 text-white" />
              </button>

              <button
                onClick={() => playAudio(0.6)}
                className="btn-3d w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer bg-amber-100 border-b-4 border-amber-300 shadow-[0_2px_0_0_#d97706]"
                title="Nghe chậm"
              >
                <span className="text-xl select-none">🐢</span>
              </button>

              <div className="text-left">
                <h4 className="text-sm font-display font-extrabold text-[#2b2b2b] m-0">
                  HÃY NGHE KỸ VÀ CHỌN HÌNH ẢNH ĐÚNG!
                </h4>
                <p className="text-[10px] font-semibold text-text-muted mt-0.5">
                  Bấm nút loa để nghe giọng đọc mẫu.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {currentItem.imageUrl && (
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-border-main bg-bg-light flex items-center justify-center p-1">
                  <img
                    src={getAssetUrl(currentItem.imageUrl)}
                    alt="Illustration"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = BACKUP_IMAGES[0];
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                {speakingResult ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 py-1">
                    {speakingResult.map((res, idx) => (
                      <span
                        key={idx}
                        className={`text-2xl font-display font-extrabold px-3 py-1 rounded-xl border-2 transition-all ${
                          res.status === 'correct'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                            : 'bg-rose-50 text-rose-600 border-rose-400 animate-pulse'
                        }`}
                      >
                        {res.word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <h3 className="text-2xl font-display font-black text-[#2b2b2b]">
                    {currentItem.contentText}
                  </h3>
                )}
                <button
                  onClick={() => playAudio(1.0)}
                  className="p-2 bg-primary-soft hover:bg-primary/20 text-primary rounded-xl"
                  title="Nghe phát âm chuẩn"
                >
                  <SpeakerWaveIcon className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {currentItem.translation && (
                <p className="text-xs font-semibold text-text-muted">
                  {currentItem.translation}
                </p>
              )}
            </div>
          )}

          {/* Previous Mistake Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-[11px] text-red-600 font-semibold">
            <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Lần trước bé chọn sai: </span>
            {currentItem.wrongAnswerSubmitted && isImageUrl(currentItem.wrongAnswerSubmitted) ? (
              <div className="w-8 h-8 rounded-lg border-2 border-red-300 overflow-hidden inline-flex items-center justify-center bg-white p-0.5 align-middle ml-1">
                <img
                  src={getAssetUrl(currentItem.wrongAnswerSubmitted)}
                  alt="Wrong"
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = BACKUP_IMAGES[0];
                  }}
                />
              </div>
            ) : (
              <strong className="line-through">{currentItem.wrongAnswerSubmitted}</strong>
            )}
          </div>
        </div>

        {/* Interactive Workspace Area */}
        {isSpeakingRound ? (
          // VÒNG 3 (SPEAKING): GIAO DIỆN GHI ÂM LUYỆN NÓI
          <div className="w-full bg-white border-2 border-border-main rounded-2xl p-5 shadow-sm flex flex-col items-center gap-4 text-center">
            <span className="text-xs font-extrabold text-text-muted uppercase tracking-wider">
              BÉ HÃY NHẤN GHI ÂM VÀ ĐỌC TO CÂU TRÊN
            </span>

            <div className="flex items-center gap-3 justify-center w-full">
              {/* 1. Record Button */}
              {!isRecording && !recordedAudioUrl && (
                <button
                  onClick={startRecording}
                  disabled={isChecked || isAssessing}
                  className="btn-3d px-6 py-3 rounded-2xl flex items-center gap-2 cursor-pointer btn-3d-pink font-display font-extrabold text-xs"
                >
                  <MicrophoneIcon className="w-5 h-5 text-white" />
                  NHẤN ĐỂ GHI ÂM
                </button>
              )}

              {/* 2. Recording Status Pulsing Button */}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-[#ff4d4f] border-b-4 border-[#cf1322] text-white hover:bg-[#ff7875] rounded-2xl flex items-center gap-2 cursor-pointer font-display font-extrabold text-xs animate-pulse"
                >
                  <StopIcon className="w-5 h-5 fill-current text-white" />
                  ĐANG GHI ÂM (BẤM ĐỂ DỪNG)
                </button>
              )}

              {/* 3. Re-record & Play Recorded Voice buttons */}
              {!isRecording && recordedAudioUrl && (
                <div className="flex items-center gap-3 w-full justify-center">
                  <button
                    onClick={playRecordedAudio}
                    className="btn-3d px-5 py-3 rounded-2xl flex items-center gap-1.5 cursor-pointer btn-3d-green font-display font-extrabold text-xs flex-1"
                  >
                    <PlayIcon className="w-4 h-4 text-white" />
                    NGHE LẠI
                  </button>

                  <button
                    onClick={startRecording}
                    disabled={isChecked || isAssessing}
                    className="px-4 py-3 bg-white border-2 border-border-main text-text-main hover:bg-bg-light rounded-2xl flex items-center gap-1.5 cursor-pointer font-display font-extrabold text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    THU LẠI
                  </button>
                </div>
              )}
            </div>

            {/* Status Message */}
            {isRecording ? (
              <p className="text-[11px] text-[#ff4d4f] font-bold animate-bounce-soft">Enjoy đang nghe bé nói nè... 🎙️</p>
            ) : isAssessing ? (
              <p className="text-[11px] text-primary font-bold animate-pulse">AI Faster-Whisper đang chấm điểm phát âm...</p>
            ) : recordedAudioUrl ? (
              <p className="text-[11px] text-[#52c41a] font-bold">Đã lưu giọng bé! Hãy bấm KIỂM TRA để xem kết quả.</p>
            ) : (
              <p className="text-[11px] text-text-muted">Bấm micro để bắt đầu thu âm phát âm của bé.</p>
            )}
          </div>
        ) : isListeningRound ? (
          // VÒNG 2 (LISTENING): 4 THẺ ẢNH
          <div className="grid grid-cols-2 gap-3.5 w-full max-w-lg mx-auto">
            {options.map((imageUrl, idx) => {
              const isSelected = selectedOption === imageUrl;
              const optionLabel = String.fromCharCode(65 + idx);

              return (
                <button
                  key={imageUrl + '-' + idx}
                  onClick={() => !isChecked && setSelectedOption(imageUrl)}
                  className={`card-3d p-2 border-2 transition-all flex flex-col items-center gap-2 cursor-pointer relative ${
                    isSelected
                      ? 'border-primary bg-primary-soft ring-2 ring-primary/10 shadow-[0_4px_0_0_#d93d74] scale-[1.03]'
                      : 'border-border-main hover:bg-bg-light bg-white shadow-[0_4px_0_0_#e5e5e5]'
                  }`}
                  style={{
                    pointerEvents: isChecked ? 'none' : 'auto',
                  }}
                >
                  <span className="absolute top-2 left-2 z-10 w-5 h-5 rounded-md border flex items-center justify-center font-display text-[10px] font-extrabold bg-white border-border-main text-text-muted">
                    {optionLabel}
                  </span>
                  <div className="w-full aspect-video sm:h-32 rounded-xl overflow-hidden bg-bg-light relative flex items-center justify-center p-2">
                    <img
                      src={getAssetUrl(imageUrl)}
                      alt={`Lựa chọn ${optionLabel}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : isFillBlankRound ? (
          // VÒNG 5 (FILL IN BLANK): ĐIỀN TỪ
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
          // VÒNG TRẮC NGHIỆM CHỮ (QUIZ / VÒNG 4)
          <div className="grid grid-cols-2 gap-2.5">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const optionLabel = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  onClick={() => !isChecked && setSelectedOption(opt)}
                  disabled={isChecked}
                  className={`py-3.5 px-3 rounded-xl border-2 font-display font-bold text-sm transition-all flex items-center gap-2 ${
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

      {/* Bottom Footer */}
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
                {isCorrect ? <CheckCircleIcon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
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
              {isSpeakingRound 
                ? 'Ghi âm và phát âm to rõ để kiểm tra nhé!'
                : 'Chọn đáp án đúng nhất để hoàn thành nhé!'}
            </div>
          )}

          <div className="flex items-center gap-2">
            {isChecked && !isCorrect && (
              <button
                type="button"
                onClick={handleOpenAiAdvice}
                className="px-3 py-2 bg-[#f0f5ff] hover:bg-[#d6e4ff] text-[#2f54eb] rounded-xl border-2 border-[#adc6ff] font-display font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <CpuChipIcon className="w-4 h-4 text-[#2f54eb]" />
                HỎI AI
              </button>
            )}

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

      {/* AI Advice Modal inside Player */}
      {isAiModalOpen && currentItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-4 border-border-main rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-border-main pb-3">
              <div className="flex items-center gap-2 text-primary font-display font-black text-sm uppercase">
                <CpuChipIcon className="w-5 h-5 text-primary" />
                Hướng Dẫn Lỗi Sai Từ AI
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 hover:bg-bg-light rounded-lg text-text-muted cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-bg-light p-3.5 rounded-2xl border-2 border-border-main text-xs space-y-2">
                <div className="flex items-center gap-3">
                  {currentItem.imageUrl && (
                    <div className="w-16 h-16 rounded-xl border-2 border-border-main overflow-hidden shrink-0 bg-white p-1">
                      <img
                        src={getAssetUrl(currentItem.imageUrl)}
                        alt="Question"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = BACKUP_IMAGES[0];
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-[#2b2b2b]">
                      Câu / Từ chuẩn: <strong className="text-primary">{currentItem.contentText || currentItem.keyword}</strong>
                    </p>
                    {currentItem.translation && (
                      <p className="text-text-muted text-[11px]">({currentItem.translation})</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#cf1322] font-semibold pt-2 border-t border-border-main/50">
                  <span className="shrink-0">Bé đã đọc/chọn:</span>
                  {isImageUrl(currentAttemptAnswer || currentItem.wrongAnswerSubmitted) ? (
                    <div className="w-10 h-10 rounded-lg border-2 border-red-300 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                      <img
                        src={getAssetUrl(currentAttemptAnswer || currentItem.wrongAnswerSubmitted)}
                        alt="Wrong answer"
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = BACKUP_IMAGES[0];
                        }}
                      />
                    </div>
                  ) : (
                    <strong className="line-through">{currentAttemptAnswer || currentItem.wrongAnswerSubmitted || 'Chưa chính xác'}</strong>
                  )}
                </div>
              </div>

              <div className="bg-[#f0f5ff] border-2 border-[#adc6ff] rounded-2xl p-4 text-xs font-semibold text-[#1d39c4] leading-relaxed min-h-[100px] flex items-center">
                {aiLoading ? (
                  <div className="w-full flex flex-col items-center justify-center gap-3 py-4 text-primary">
                    <div className="flex items-center gap-2 font-display font-black text-xs uppercase tracking-wide">
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Trợ lý AI đang suy nghĩ & chuẩn bị lời khuyên...</span>
                    </div>
                    <div className="w-48 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-primary animate-pulse rounded-full" />
                    </div>
                    <p className="text-[11px] text-[#597ef7] font-medium">Bé chờ AI một chút nhé...</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 w-full">
                    <p className="font-bold text-primary flex items-center gap-1.5 uppercase text-[11px]">
                      <SparklesIcon className="w-4 h-4" />
                      Lời khuyên từ Trợ lý AI:
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium text-xs">
                      {aiAdvice || 'Bé hãy chú ý từ vựng và luyện tập lại thật kỹ nhé!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button3D variant="blue" fullWidth size="md" onClick={() => setIsAiModalOpen(false)}>
              ĐÃ HIỂU RỒI!
            </Button3D>
          </div>
        </div>
      )}
    </div>
  );
};
