import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { SessionItemType, SpeakerRole } from '../types';
import type { Session, SessionItem } from '../types';
import { Mascot } from '../../../components/ui/Mascot';
import { Button3D } from '../../../components/ui/Button3D';
import { BASE_URL } from '../../../services/apiClient';
import { learningApi } from '../services/learningApi';
import { mistakeApi } from '../services/mistakeApi';
import {
  XMarkIcon,
  HeartIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

interface SessionPlayerProps {
  session: Session;
  onClose: () => void;
}

// Bổ sung kiểu mở rộng cho SessionItem trong lúc chạy tương tác
interface InteractiveItem extends SessionItem {
  options?: string[];
  correctAnswer?: string;
}

// Kiểu dữ liệu cho mỗi chữ khi cắt câu (VÒNG GAME - Sentence Builder)
interface WordChip {
  id: string;
  text: string;
}

const AVATAR_A = "https://img.magnific.com/free-vector/cute-duck-walking-cartoon-vector-icon-illustration-animal-nature-icon-isolated-flat-vector_138676-11908.jpg?semt=ais_hybrid&w=740&q=80";
const AVATAR_B = "https://img.magnific.com/vector-mien-phi/cau-be-bieu-tuong-tuoi-tho-hanh-phuc-co-lap_24640-134167.jpg?semt=ais_hybrid&w=740&q=80";

export const SessionPlayer: React.FC<SessionPlayerProps> = ({ session, onClose }) => {
  const {
    activePart,
    parts,
    sessionItems,
    currentStepIndex,
    selectSession,
    nextStep,
    prevStep,
    resetSessionState,
    completeSession,
    loading,
  } = useLearningStore();

  const currentPartTitle = activePart?.title || parts.find(p => p.id === session.partId)?.title || session.title || 'Hội thoại';

  const [playingLineIndex, setPlayingLineIndex] = useState<number | null>(null);
  const [isAutoPlayingAll, setIsAutoPlayingAll] = useState(false);
  const hasAutoPlayedConvRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Trạng thái cho Vòng 1 (INTRODUCTION): Giai đoạn 1 (Làm quen từ khóa) -> Giai đoạn 2 (Hội thoại)
  const [introPhase, setIntroPhase] = useState<'PREVIEW' | 'CONVERSATION'>('PREVIEW');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [maxConversationIndex, setMaxConversationIndex] = useState<number>(-1);

  // Trạng thái cho Vòng 4 (WORD_RECOGNITION - QUIZ)
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [showTranslationHint, setShowTranslationHint] = useState(false);

  // Trạng thái cho Xếp từ thành câu (Sentence Builder) Vòng 5 (GAMIFIED_REVIEW)
  const [availableWords, setAvailableWords] = useState<WordChip[]>([]);
  const [placedWords, setPlacedWords] = useState<WordChip[]>([]);
  const [draggedItem, setDraggedItem] = useState<{ from: 'available' | 'placed'; chip: WordChip } | null>(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, []);

  const [hearts, setHearts] = useState(5);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [listeningOptions, setListeningOptions] = useState<string[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [speakingResult, setSpeakingResult] = useState<{ word: string; status: 'correct' | 'wrong' }[] | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [sessionStartTime] = useState<number>(() => Date.now());

  const [playItems, setPlayItems] = useState<InteractiveItem[]>([]);

  // Lọc và chuẩn bị danh sách câu hỏi cho vòng chơi:
  // - Vòng 1 (INTRODUCTION): Giữ nguyên toàn bộ items (TARGET + SUPPORT) theo thứ tự hội thoại
  // - Các vòng 2, 3, 4, 5: Chỉ lọc lấy các câu TARGET
  // - Vòng 5 (GAMIFIED_REVIEW): Xáo trộn ngẫu nhiên thứ tự các câu
  useEffect(() => {
    if (!sessionItems) return;
    let items: InteractiveItem[] = [];
    if (session.sessionType === 'INTRODUCTION') {
      items = [...sessionItems] as InteractiveItem[];
    } else {
      items = (sessionItems.filter(item => item.itemType === SessionItemType.TARGET)) as InteractiveItem[];
    }

    if (session.sessionType === 'GAMIFIED_REVIEW') {
      items = [...items].sort(() => 0.5 - Math.random());
    }
    setPlayItems(items);
  }, [sessionItems, session.sessionType]);

  // Reset phase (phase chỉ tính ở INTRODUCTION, gồm 2 phase là PREVIEW và CONVERSATION) khi đổi session
  useEffect(() => {
    setIntroPhase('PREVIEW');
    setPreviewIndex(0);
    setMaxConversationIndex(-1);
    hasAutoPlayedConvRef.current = false;
  }, [session.id]);

  // Danh sách từ vựng preview cho Vòng 1 (các câu TARGET có keyword)
  const previewKeywords = useMemo(() => {
    if (!sessionItems) return [];
    return sessionItems.filter(item => item.itemType === SessionItemType.TARGET && item.keyword);
  }, [sessionItems]);

  const currentItems = playItems;
  const currentItem = currentItems[currentStepIndex];

  // Tính thanh tiến trình (INTRODUCTION: 50% Preview + 50% Conversation chia theo từng câu thoại)
  const progressPercent = useMemo(() => {
    if (session.sessionType === 'INTRODUCTION') {
      if (introPhase === 'PREVIEW') {
        if (previewKeywords.length === 0) return 50;
        return Math.min(50, Math.round(((previewIndex + 1) / previewKeywords.length) * 50));
      } else {
        // Giai đoạn CONVERSATION: khởi điểm từ 50%, tăng dần theo từng câu thoại được xem/nghe
        if (playItems.length === 0) return 100;
        const reachedStep = maxConversationIndex >= 0 ? maxConversationIndex + 1 : 0;
        const convProgress = Math.round((reachedStep / playItems.length) * 50);
        return Math.min(100, Math.max(50, 50 + convProgress));
      }
    }
    return currentItems.length > 0 ? Math.min(100, Math.round((currentStepIndex / currentItems.length) * 100)) : 0;
  }, [session.sessionType, introPhase, previewKeywords.length, previewIndex, playItems.length, maxConversationIndex, currentStepIndex, currentItems.length]);

  // Xác định Layout hiển thị
  const getActiveLayout = (): 'INTRODUCTION' | 'LISTENING' | 'SPEAKING' | 'QUIZ' | 'FILL_IN_BLANK' | 'UNKNOWN' => {
    if (!session || !currentItem) return 'UNKNOWN';
    if (session.sessionType === 'INTRODUCTION') return 'INTRODUCTION';
    if (session.sessionType === 'LISTENING') return 'LISTENING';
    if (session.sessionType === 'SPEAKING') return 'SPEAKING';
    if (session.sessionType === 'WORD_RECOGNITION') return 'QUIZ';
    if (session.sessionType === 'GAMIFIED_REVIEW') return 'FILL_IN_BLANK';
    return 'UNKNOWN';
  };

  const activeLayout = getActiveLayout();

  const getAssetUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Kích hoạt nạp Session Items từ Zustand store
  useEffect(() => {
    selectSession(session);
  }, [session, selectSession]);

  // Phát âm một từ vựng bằng Web Speech API
  const speakWord = (word?: string) => {
    if (!word || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Phát âm thanh của từ vựng (ưu tiên file audio riêng của keyword nếu có)
  const playKeywordAudio = (item?: InteractiveItem) => {
    if (!item) return;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const audioUrl = item.keywordAudioUrl;
    if (audioUrl) {
      const fullUrl = getAssetUrl(audioUrl);
      const audio = new Audio(fullUrl);
      audio.playbackRate = 1.0;
      setCurrentAudio(audio);
      setIsPlayingAudio(true);

      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => speakWord(item.keyword);
      audio.play().catch(() => speakWord(item.keyword));
    } else {
      speakWord(item.keyword);
    }
  };

  const speakLineWithTTS = (text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      if (onEnd) onEnd();
    };
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Phát một câu thoại trong cuộc trò chuyện (hỗ trợ tự động chạy lần lượt từ trên xuống)
  const playConversationLine = (index: number, autoAdvance: boolean = false) => {
    if (index < 0 || index >= playItems.length) {
      setPlayingLineIndex(null);
      setIsAutoPlayingAll(false);
      setIsPlayingAudio(false);
      return;
    }

    setPlayingLineIndex(index);
    setMaxConversationIndex(prev => Math.max(prev, index));
    if (autoAdvance) {
      setIsAutoPlayingAll(true);
    }

    const lineItem = playItems[index];
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    let isDone = false;
    const onLineEnd = () => {
      if (isDone) return;
      isDone = true;
      setIsPlayingAudio(false);
      if (autoAdvance && index < playItems.length - 1) {
        setTimeout(() => {
          playConversationLine(index + 1, true);
        }, 600);
      } else {
        setPlayingLineIndex(null);
        setIsAutoPlayingAll(false);
      }
    };

    let hasFallbackRun = false;
    const triggerTTSFallback = () => {
      if (hasFallbackRun) return;
      hasFallbackRun = true;
      speakLineWithTTS(lineItem.contentText || '', onLineEnd);
    };

    const audioUrl = lineItem.audioUrl;
    if (audioUrl) {
      const fullUrl = getAssetUrl(audioUrl);
      const audio = new Audio(fullUrl);
      audio.playbackRate = 1.0;
      setCurrentAudio(audio);
      setIsPlayingAudio(true);

      audio.onended = onLineEnd;
      audio.onerror = triggerTTSFallback;

      audio.play().catch(triggerTTSFallback);
    } else {
      triggerTTSFallback();
    }
  };

  // Tự động phát âm từ vựng khi đang ở giai đoạn PREVIEW của Vòng 1
  useEffect(() => {
    if (session.sessionType === 'INTRODUCTION' && introPhase === 'PREVIEW') {
      const currentKeywordItem = previewKeywords[previewIndex];
      if (currentKeywordItem) {
        const timeout = setTimeout(() => {
          playKeywordAudio(currentKeywordItem);
        }, 400);
        return () => clearTimeout(timeout);
      }
    }
  }, [previewIndex, introPhase, previewKeywords, session.sessionType]);

  // Nếu bài học INTRODUCTION không có từ khóa preview nào, tự động vào thẳng CONVERSATION
  useEffect(() => {
    if (session.sessionType === 'INTRODUCTION' && sessionItems && sessionItems.length > 0) {
      const hasPreview = sessionItems.some(item => item.itemType === SessionItemType.TARGET && item.keyword);
      if (!hasPreview) {
        setIntroPhase('CONVERSATION');
      }
    }
  }, [session.sessionType, sessionItems]);

  // Tự động phát toàn bộ cuộc trò chuyện lần đầu tiên khi bắt đầu giai đoạn CONVERSATION
  useEffect(() => {
    if (session.sessionType === 'INTRODUCTION' && introPhase === 'CONVERSATION' && playItems.length > 0) {
      if (!hasAutoPlayedConvRef.current) {
        hasAutoPlayedConvRef.current = true;
        const timer = setTimeout(() => {
          playConversationLine(0, true);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [introPhase, session.sessionType, playItems.length]);

  // Cuộn mượt đến câu thoại đang được phát
  useEffect(() => {
    if (playingLineIndex !== null) {
      const el = document.getElementById(`chat-line-${playingLineIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [playingLineIndex]);

  // Xác định vai nhân vật đang nói trong lượt hiện tại
  const isSpeaker1Active = currentItem?.speakerRole === SpeakerRole.SPEAKER_1 || currentItem?.speakerRole === 'SPEAKER_1' || !currentItem?.speakerRole;
  const isSpeaker2Active = currentItem?.speakerRole === SpeakerRole.SPEAKER_2 || currentItem?.speakerRole === 'SPEAKER_2';

  // Helper highlight từ khóa trong hội thoại
  const renderHighlightedSentence = (sentence?: string, keyword?: string) => {
    if (!sentence) return null;
    if (!keyword) return <span>{sentence}</span>;
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = sentence.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span key={i} className="text-[#d93d74] font-black bg-[#fff0f6] px-1.5 rounded-md">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Helper ẩn từ khóa thành chỗ trống (______ hoặc từ đã chọn) cho Vòng 4 (QUIZ)
  const renderMaskedSentence = (sentence?: string, keyword?: string) => {
    if (!sentence) return null;
    if (!keyword) return <span className="font-display font-extrabold">{sentence}</span>;

    const trimmedKeyword = keyword.trim();
    const escaped = trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\b${escaped}\\b)`, 'i');
    let parts = sentence.split(regex);

    if (parts.length <= 1) {
      const simpleRegex = new RegExp(`(${escaped})`, 'i');
      parts = sentence.split(simpleRegex);
    }

    return (
      <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
        {parts.map((part, idx) => {
          if (part.toLowerCase() === trimmedKeyword.toLowerCase()) {
            const displayText = isChecked
              ? isCorrect
                ? part
                : (selectedOption || '______')
              : (selectedOption || '______');

            return (
              <span
                key={idx}
                className={`inline-block px-3 py-1 rounded-xl border-2 font-display font-extrabold text-base transition-all duration-200 ${isChecked
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 text-green-700 shadow-sm'
                      : 'bg-red-100 border-red-500 text-red-700 shadow-sm'
                    : selectedOption
                      ? 'bg-primary-soft border-primary text-primary shadow-[0_2px_0_0_#d93d74]'
                      : 'bg-slate-100 border-dashed border-primary/60 text-primary min-w-[70px] text-center'
                  }`}
              >
                {displayText}
              </span>
            );
          }
          return (
            <span key={idx} className="font-display font-extrabold text-text-main">
              {part}
            </span>
          );
        })}
      </span>
    );
  };

  // Tạo danh sách 4 lựa chọn cho Vòng 4 (WORD_RECOGNITION - QUIZ)
  useEffect(() => {
    if (!currentItem || session.sessionType !== 'WORD_RECOGNITION') return;

    const correctKeyword = (currentItem.keyword || '').trim();

    // Lấy các keyword của các câu TARGET khác trong bài học
    const otherKeywords = currentItems
      .filter(item => item.keyword && item.keyword.trim().toLowerCase() !== correctKeyword.toLowerCase())
      .map(item => item.keyword!.trim());

    const uniqueOthers = Array.from(new Set(otherKeywords));
    const backupKeywords = ['cow', 'pig', 'duck', 'horse', 'sheep', 'cat', 'dog', 'zoo', 'elephant', 'hippo', 'monkey', 'giraffe', 'bird', 'fish'];

    const shuffledOthers = [...uniqueOthers].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);

    while (selectedOthers.length < 3) {
      const backup = backupKeywords[Math.floor(Math.random() * backupKeywords.length)];
      if (backup.toLowerCase() !== correctKeyword.toLowerCase() && !selectedOthers.includes(backup)) {
        selectedOthers.push(backup);
      }
    }

    const finalChoices = [correctKeyword, ...selectedOthers].sort(() => 0.5 - Math.random());
    setQuizOptions(finalChoices);
    setSelectedOption(null);
    setIsChecked(false);
    setShowTranslationHint(false);
  }, [currentItem, currentItems, session.sessionType]);

  // Tạo danh sách các từ xáo trộn cho Vòng 5 (GAMIFIED_REVIEW - FILL_IN_BLANK / SENTENCE_BUILDER)
  useEffect(() => {
    if (!currentItem || session.sessionType !== 'GAMIFIED_REVIEW') {
      setAvailableWords([]);
      setPlacedWords([]);
      return;
    }

    // Làm sạch câu: bỏ dấu câu cuối (? ! .)
    const cleanText = (currentItem.contentText || '')
      .replace(/[.?!,]+$/g, '')
      .trim();

    // Tách các từ theo khoảng trắng (data mới rất sạch, không có ký tự [])
    const rawWords = cleanText.split(/\s+/).filter(Boolean);

    const chips: WordChip[] = rawWords.map((word, idx) => ({
      id: `${word}-${idx}-${Math.random().toString(36).substr(2, 6)}`,
      text: word
    }));

    // Xáo trộn ngẫu nhiên (nếu câu > 1 từ, đảo sao cho không trùng y hệt câu gốc)
    let shuffled = [...chips].sort(() => 0.5 - Math.random());
    if (chips.length > 1 && shuffled.every((c, i) => c.text === chips[i].text)) {
      shuffled = [...chips].reverse();
    }

    setAvailableWords(shuffled);
    setPlacedWords([]);
    setDraggedItem(null);
    setDropIndicatorIndex(null);
    setIsChecked(false);
    setIsCorrect(false);
  }, [currentStepIndex, currentItem?.id, currentItem?.contentText, session.sessionType]);

  // Tạo danh sách 4 lựa chọn hình ảnh ngẫu nhiên cho Vòng 2 (LISTENING)
  useEffect(() => {
    if (!currentItem || session.sessionType !== 'LISTENING') return;

    const correctImage = currentItem.imageUrl || '';
    const otherImages = currentItems
      .map(item => item.imageUrl || '')
      .filter(img => img !== '' && img !== correctImage);

    const uniqueOtherImages = Array.from(new Set(otherImages));
    const shuffledOthers = [...uniqueOtherImages].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);

    const backupImages = [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80',
    ];

    while (selectedOthers.length < 3) {
      const backupImg = backupImages[Math.floor(Math.random() * backupImages.length)];
      if (!selectedOthers.includes(backupImg) && backupImg !== correctImage) {
        selectedOthers.push(backupImg);
      }
    }

    const finalChoices = [correctImage, ...selectedOthers].sort(() => 0.5 - Math.random());
    setListeningOptions(finalChoices);

    setSelectedOption(null);
    setIsChecked(false);
  }, [currentItem, currentItems, session.sessionType]);



  // Hàm phát âm thanh với cơ chế dự phòng Web Speech API nếu nguồn audio lỗi (403, 404, NotSupportedError)
  const playAudioWithFallback = (speed: number = 1.0, isAutoPlay: boolean = false) => {
    if (!currentItem) return;

    // Dừng âm thanh và giọng đọc cũ
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);

    let hasFallbackRun = false;
    const speakWithTTS = () => {
      if (hasFallbackRun) return;
      hasFallbackRun = true;

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      const textToSpeak = currentItem.contentText?.replace(/[\[\]]/g, '') || currentItem.keyword || '';
      if (!textToSpeak || !('speechSynthesis' in window)) {
        setIsPlayingAudio(false);
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = speed;
        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Lỗi SpeechSynthesis:", e);
        setIsPlayingAudio(false);
      }
    };

    const audioUrl = currentItem.audioUrl;
    if (audioUrl) {
      const fullAudioUrl = getAssetUrl(audioUrl);
      const audio = new Audio(fullAudioUrl);
      audio.playbackRate = speed;
      setCurrentAudio(audio);

      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.onerror = () => {
        // Nguồn âm thanh online không tải được (NotSupportedError / 403 / 404 / CORS) -> Dùng Web Speech API
        speakWithTTS();
      };

      audio.play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(err => {
          if (!isAutoPlay) {
            console.warn("Không thể phát trực tiếp audioUrl, chuyển sang SpeechSynthesis dự phòng:", err);
          }
          speakWithTTS();
        });
    } else {
      speakWithTTS();
    }
  };

  // Phát âm thanh tự động khi câu hỏi hoặc từ vựng thay đổi
  useEffect(() => {
    if (!currentItem) return;

    // Stop any previous audio & speech
    if (currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Auto-play âm thanh sau khi chuyển từ (ở chế độ LISTENING)
    const playTimeout = setTimeout(() => {
      if (session.sessionType === 'LISTENING') {
        playAudioWithFallback(1.0, true);
      }
    }, 500);

    // Reset thời gian bắt đầu câu hỏi khi chuyển step
    setQuestionStartTime(Date.now());

    // Cleanup khi chuyển câu hỏi
    return () => {
      clearTimeout(playTimeout);
      if (currentAudio) {
        currentAudio.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, currentItem?.id, session.sessionType, introPhase]);

  const playSound = (speed: number = 1.0) => {
    playAudioWithFallback(speed, false);
  };

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
        setSelectedOption('recorded');

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          localStorage.setItem('recordedAudio', base64Data);
          localStorage.setItem('speakCorrectAnswer', currentItem?.contentText || '');
          console.log("Đã lưu audio và đáp án vào localStorage:", currentItem?.contentText);
        };
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedAudioUrl(null);
      setSelectedOption(null);
    } catch (err) {
      console.error("Không thể truy cập micro:", err);
      alert("Bé hãy cho phép Enjoy truy cập micro để luyện tập phát âm nhé!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    const audio = new Audio(recordedAudioUrl);
    audio.play().catch(err => console.error("Không thể phát lại bản ghi âm:", err));
  };

  const handleSelectOption = (option: string) => {
    if (isChecked) return;
    setSelectedOption(option);
  };

  // ==================== CƠ CHẾ KÉO THẢ & CHỌN TỪ (SENTENCE BUILDER) ====================
  // 1. Bắt đầu kéo một từ (từ kho dưới hoặc từ khay trên)
  const handleDragStart = (e: React.DragEvent, from: 'available' | 'placed', chip: WordChip) => {
    if (isChecked) return;
    isDraggingRef.current = true;
    setDraggedItem({ from, chip });
    e.dataTransfer.setData('text/plain', chip.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropIndicatorIndex(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  // 2. Rê chuột qua một từ cụ thể trên khay (tính toán nửa trái/nửa phải để chèn trước hoặc sau)
  const handleDragOverChip = (e: React.DragEvent, idx: number) => {
    if (isChecked) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const isRightHalf = e.clientX > rect.left + rect.width / 2;
    setDropIndicatorIndex(isRightHalf ? idx + 1 : idx);
  };

  // 3. Thả từ trực tiếp lên một từ trên khay (thả vào vị trí bất kỳ)
  const handleDropOnChip = (e: React.DragEvent, idx: number) => {
    if (isChecked || !draggedItem) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const isRightHalf = e.clientX > rect.left + rect.width / 2;
    finalizeDrop(isRightHalf ? idx + 1 : idx);
  };

  // 4. Rê chuột qua vùng trống trên khay (chèn vào cuối)
  const handleDragOverTrayContainer = (e: React.DragEvent) => {
    if (isChecked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndicatorIndex(placedWords.length);
  };

  // 5. Thả từ vào vùng trống trên khay
  const handleDropOnTrayContainer = (e: React.DragEvent) => {
    if (isChecked || !draggedItem) return;
    e.preventDefault();
    finalizeDrop(placedWords.length);
  };

  // Hàm xử lý hoàn tất việc thả từ vào vị trí chỉ định (chống double chữ triệt để)
  const finalizeDrop = (targetIndex: number) => {
    if (!draggedItem) return;
    const { from, chip } = draggedItem;

    if (from === 'available') {
      // 1. Lấy từ kho dưới lên vị trí targetIndex trên khay
      setAvailableWords(prev => prev.filter(c => c.id !== chip.id));
      setPlacedWords(prev => {
        if (prev.some(c => c.id === chip.id)) return prev; // Chống double chữ
        const next = [...prev];
        const boundedIndex = Math.max(0, Math.min(next.length, targetIndex));
        next.splice(boundedIndex, 0, chip);
        return next;
      });
    } else if (from === 'placed') {
      // 2. Đổi chỗ từ đang có trên khay đến vị trí targetIndex
      setPlacedWords(prev => {
        const currentIndex = prev.findIndex(c => c.id === chip.id);
        if (currentIndex === -1) return prev;
        const next = [...prev];
        const [removed] = next.splice(currentIndex, 1);
        const insertAt = currentIndex < targetIndex ? targetIndex - 1 : targetIndex;
        const boundedIndex = Math.max(0, Math.min(next.length, insertAt));
        next.splice(boundedIndex, 0, removed);
        return next;
      });
    }

    setDraggedItem(null);
    setDropIndicatorIndex(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  // 6. Thả từ trên khay trả về kho dưới
  const handleDropOnAvailablePool = (e: React.DragEvent) => {
    if (isChecked || !draggedItem) return;
    e.preventDefault();
    if (draggedItem.from === 'placed') {
      const chip = draggedItem.chip;
      setPlacedWords(prev => prev.filter(c => c.id !== chip.id));
      setAvailableWords(prev => {
        if (prev.some(c => c.id === chip.id)) return prev;
        return [...prev, chip];
      });
    }
    setDraggedItem(null);
    setDropIndicatorIndex(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  // 7. Nhấp từ ở kho dưới -> chuyển lên cuối khay trên
  const handleWordClickAvailable = (chip: WordChip) => {
    if (isChecked || isDraggingRef.current) return;
    setAvailableWords(prev => prev.filter(c => c.id !== chip.id));
    setPlacedWords(prev => {
      if (prev.some(c => c.id === chip.id)) return prev; // Chống double chữ
      return [...prev, chip];
    });
  };

  // 8. Nhấp từ trên khay -> chuyển trả lại kho dưới
  const handleWordClickPlaced = (chipId: string) => {
    if (isChecked || isDraggingRef.current) return;
    const chip = placedWords.find(c => c.id === chipId);
    if (!chip) return;
    setPlacedWords(prev => prev.filter(c => c.id !== chipId));
    setAvailableWords(prev => {
      if (prev.some(c => c.id === chipId)) return prev;
      return [...prev, chip];
    });
  };

  const isCheckButtonEnabled = (() => {
    if (!currentItem) return false;
    if (activeLayout === 'INTRODUCTION') {
      return true;
    }
    if (activeLayout === 'FILL_IN_BLANK') {
      // Đã ghép tất cả các từ vào khay (kho dưới rỗng)
      return placedWords.length > 0 && availableWords.length === 0;
    }
    if (activeLayout === 'SPEAKING') {
      return !!recordedAudioUrl;
    }
    return !!selectedOption;
  })();

  const getCorrectAnswerText = () => {
    if (!currentItem) return '';
    if (activeLayout === 'FILL_IN_BLANK') {
      return currentItem.contentText.replace(/[.?!,]+$/g, '').trim();
    }
    if (activeLayout === 'QUIZ') {
      return currentItem.keyword || '';
    }
    return currentItem.correctAnswer || currentItem.translation || '';
  };

  const getRoundTypeNumber = (): number => {
    if (session.sessionType === 'INTRODUCTION') return 1;
    if (session.sessionType === 'LISTENING') return 2;
    if (session.sessionType === 'SPEAKING') return 3;
    if (session.sessionType === 'WORD_RECOGNITION') return 4;
    if (session.sessionType === 'GAMIFIED_REVIEW') return 5;
    return 1;
  };

  const recordMistakeIfWrong = (wrongAnswer: string) => {
    if (!currentItem) return;
    const durationSeconds = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    mistakeApi.logMistake({
      questionId: currentItem.id,
      roundType: getRoundTypeNumber(),
      wrongAnswerSubmitted: wrongAnswer || 'Chưa trả lời đúng',
      durationSeconds,
    }).catch(err => {
      console.warn("Không thể lưu lỗi sai vào learning-service:", err);
    });
  };

  const handleCheckAnswer = async () => {
    if (!currentItem) return;

    // 1. INTRODUCTION: Bấm là qua luôn
    if (activeLayout === 'INTRODUCTION') {
      setIsCorrect(true);
      setIsChecked(true);
      return;
    }

    // 2. LISTENING: So sánh ảnh
    if (activeLayout === 'LISTENING') {
      const correctImage = currentItem.imageUrl || '';
      const correct = selectedOption === correctImage;
      setIsCorrect(correct);
      setIsChecked(true);
      if (!correct) {
        setHearts(prev => Math.max(0, prev - 1));
        const wrongItem = currentItems.find(it => it.imageUrl === selectedOption);
        const wrongText = wrongItem ? (wrongItem.keyword || wrongItem.contentText) : (selectedOption || 'chưa chính xác');
        recordMistakeIfWrong(wrongText);
      }
      return;
    }

    // 3. SPEAKING: Ghi âm & Gọi AI Faster-Whisper chấm điểm phát âm
    if (activeLayout === 'SPEAKING') {
      if (recordedBlob && currentItem.contentText) {
        setIsAssessing(true);
        try {
          const res = await learningApi.assessPronunciation(recordedBlob, currentItem.contentText, currentItem.keyword);
          setSpeakingResult(res.details);
          setIsCorrect(res.isAllCorrect);
          setIsChecked(true);
          if (!res.isAllCorrect) {
            setHearts(prev => Math.max(0, prev - 1));
            recordMistakeIfWrong(res.recognizedText || 'Phát âm chưa chuẩn');
          }
        } catch (error) {
          console.error("Lỗi khi chấm điểm phát âm:", error);
          // Xử lý khi service không phản hồi hoặc không nhận diện được: Đánh dấu là chưa đạt
          setIsCorrect(false);
          setHearts(prev => Math.max(0, prev - 1));
          setSpeakingResult(currentItem.contentText.split(' ').map(w => ({ word: w, status: 'wrong' })));
          setIsChecked(true);
          recordMistakeIfWrong('Không thể nhận diện giọng nói');
        } finally {
          setIsAssessing(false);
        }
      } else {
        setIsCorrect(false);
        setIsChecked(true);
      }
      return;
    }

    // 4. QUIZ (WORD_RECOGNITION): So sánh từ khóa
    if (activeLayout === 'QUIZ') {
      const correct = (selectedOption?.trim().toLowerCase() === currentItem.keyword?.trim().toLowerCase());
      setIsCorrect(correct);
      setIsChecked(true);
      if (!correct) {
        setHearts(prev => Math.max(0, prev - 1));
        recordMistakeIfWrong(selectedOption || 'Đáp án chưa đúng');
      }
      return;
    }

    // 5. FILL_IN_BLANK (Vòng 5 - SENTENCE BUILDER): So sánh câu đã ghép
    if (activeLayout === 'FILL_IN_BLANK') {
      const userSentence = placedWords.map(w => w.text.trim().toLowerCase()).join(' ');
      const expectedSentence = currentItem.contentText
        .replace(/[.?!,]+$/g, '')
        .trim()
        .toLowerCase();

      const correct = userSentence === expectedSentence;
      setIsCorrect(correct);
      setIsChecked(true);
      if (!correct) {
        setHearts(prev => Math.max(0, prev - 1));
        const submitted = placedWords.map(w => w.text).join(' ') || 'Chưa ghép câu';
        recordMistakeIfWrong(submitted);
      }
      return;
    }

    // Fallback trắc nghiệm thông thường khác
    const answer = currentItem.correctAnswer || currentItem.translation || '';
    const correct = selectedOption === answer;
    setIsCorrect(correct);
    setIsChecked(true);
    if (!correct) {
      setHearts(prev => Math.max(0, prev - 1));
      recordMistakeIfWrong(selectedOption || 'Chưa đúng');
    }
  };

  const handleRetrySpeaking = () => {
    setIsChecked(false);
    setIsCorrect(false);
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setSpeakingResult(null);
    setSelectedOption(null);
  };

  const handleContinue = () => {
    // Reset state câu hỏi cũ
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setListeningOptions([]);
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setSpeakingResult(null);
    setIsAssessing(false);
    setQuizOptions([]);
    setShowTranslationHint(false);
    setAvailableWords([]);
    setPlacedWords([]);
    setDraggedItem(null);
    setDropIndicatorIndex(null);

    if (hearts <= 0) {
      // Hết tim -> Thua cuộc
      onClose();
      resetSessionState();
      return;
    }

    if (currentStepIndex === currentItems.length - 1) {
      // Hoàn thành bài học
      setSessionFinished(true);
    } else {
      nextStep();
    }
  };

  const handleFinishSession = async () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    await completeSession(session.id, elapsedSeconds);
    onClose();
    resetSessionState();
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-svh">
        <Mascot expression="thinking" speechBubbleText="Đợi Enjoy chuẩn bị bài học một xíu nhé..." />
      </div>
    );
  }

  if (sessionFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-svh animate-fade-in-up space-y-8 max-w-xl mx-auto">
        <Mascot expression="happy" speechBubbleText="Tuyệt vời quá! Bé đã hoàn thành bài học hôm nay rồi!" size={200} />

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-extrabold text-primary">BÀI HỌC HOÀN THÀNH</h2>
          <p className="text-sm font-semibold text-text-main/70">
            Bé nhận được 10 XP thưởng và mở khóa bài học tiếp theo!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="card-3d p-4 border-2 border-warning/20 bg-warning-soft/20 text-center">
            <span className="text-[10px] font-extrabold text-warning-dark uppercase block">KINH NGHIỆM</span>
            <span className="text-2xl font-display font-extrabold text-warning">+10 XP</span>
          </div>
          <div className="card-3d p-4 border-2 border-primary/20 bg-primary-soft/20 text-center">
            <span className="text-[10px] font-extrabold text-primary-dark uppercase block">CHỈ SỐ TIM</span>
            <span className="text-2xl font-display font-extrabold text-primary">{hearts}/5</span>
          </div>
        </div>

        <Button3D variant="pink" fullWidth onClick={handleFinishSession}>
          TIẾP TỤC HỌC
        </Button3D>
      </div>
    );
  }

  if (session.sessionType === 'LISTENING' && listeningOptions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-svh">
        <Mascot expression="thinking" speechBubbleText="Đợi Enjoy chuẩn bị hình ảnh câu hỏi một xíu nhé..." />
      </div>
    );
  }



  if (loading || (sessionItems && sessionItems.length > 0 && playItems.length === 0)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-svh">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-bold text-text-muted">Đang tải bài học...</span>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-svh">
        <Mascot expression="sad" speechBubbleText="Oops! Bài học này chưa có nội dung rồi bé ơi!" />
        <Button3D variant="gray" className="mt-6" onClick={onClose}>
          Quay lại
        </Button3D>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-between bg-white min-h-svh select-none relative">
      {/* Top Header Bar */}
      <header className={`max-w-4xl w-full mx-auto px-6 flex items-center justify-between gap-6 transition-all ${activeLayout === 'INTRODUCTION' && introPhase === 'CONVERSATION' ? 'py-3' : 'py-6'}`}>
        <button
          onClick={() => setShowExitModal(true)}
          className="text-text-muted hover:text-text-main transition-colors cursor-pointer"
        >
          <XMarkIcon className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Progress Bar container */}
        <div className="flex-1 bg-border-main h-4 rounded-full overflow-hidden relative border border-border-main">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Health point stats */}
        <div className="flex items-center gap-1.5 text-primary font-display font-extrabold text-sm select-none">
          <HeartIcon className="w-6 h-6 fill-current stroke-[2.5]" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Core Question Area */}
      <main className={`w-full mx-auto px-4 sm:px-6 flex-1 flex flex-col space-y-6 transition-all duration-300 ${activeLayout === 'INTRODUCTION' && introPhase === 'CONVERSATION'
          ? 'w-full md:w-[50%] max-w-none py-2 justify-start'
          : 'max-w-2xl py-6 justify-center'
        }`}>

        {/* Render Title/Task */}
        {!(activeLayout === 'INTRODUCTION' && introPhase === 'CONVERSATION') && (
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
              {activeLayout === 'INTRODUCTION'
                ? 'Làm quen từ mới'
                : activeLayout === 'LISTENING'
                  ? 'Chọn hình tương ứng'
                  : activeLayout === 'SPEAKING'
                    ? 'Tập phát âm chuẩn'
                    : activeLayout === 'FILL_IN_BLANK'
                      ? 'Sắp xếp câu đúng'
                      : 'Điền từ còn thiếu'}
            </span>
            <h2 className="text-2xl font-display font-extrabold text-text-main m-0 leading-tight">
              {activeLayout === 'INTRODUCTION'
                ? 'Khám phá các từ vựng sẽ xuất hiện trong bài nhé!'
                : activeLayout === 'LISTENING'
                  ? 'Nghe loa phát âm và chọn hình ảnh phù hợp nhé!'
                  : activeLayout === 'SPEAKING'
                    ? 'Nghe phát âm mẫu và ấn ghi âm để tập đọc nhé!'
                    : activeLayout === 'FILL_IN_BLANK'
                      ? 'Nhấp các từ bên dưới theo đúng thứ tự để xếp câu nhé!'
                      : 'Chọn từ đúng nhất để hoàn thành câu nhé!'}
            </h2>
          </div>
        )}

        {activeLayout === 'INTRODUCTION' ? (
          introPhase === 'PREVIEW' ? (
            /* GIAI ĐOẠN 1: PREVIEW TỪ VỰNG TARGET TRONG HỘI THOẠI */
            <div className="flex flex-col items-center space-y-6 animate-fade-in-up w-full">
              {/* Indicator badge */}
              <div className="flex items-center gap-2 bg-primary-soft/40 border border-primary/20 px-4 py-1.5 rounded-full">
                <span className="text-xs font-black text-primary uppercase tracking-widest">
                  Từ vựng {previewIndex + 1} / {previewKeywords.length}
                </span>
              </div>

              {/* Preview Flashcard */}
              {previewKeywords.length > 0 && previewKeywords[previewIndex] ? (
                <div className="w-full max-w-sm bg-white border-2 border-border-main rounded-[2.5rem] shadow-[0_8px_0_0_#e5e5e5] p-6 flex flex-col items-center space-y-5 hover:translate-y-[-2px] transition-all relative overflow-hidden group">
                  {/* Image Frame */}
                  {previewKeywords[previewIndex].imageUrl ? (
                    <div className="w-full h-52 bg-slate-50 border-2 border-border-main/50 rounded-3xl overflow-hidden relative flex items-center justify-center p-3">
                      <img
                        src={getAssetUrl(previewKeywords[previewIndex].imageUrl)}
                        alt={previewKeywords[previewIndex].keyword || ''}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-primary-soft/10 border-2 border-dashed border-primary/20 rounded-3xl flex items-center justify-center">
                      <span className="text-sm text-text-muted font-bold">Hình ảnh minh họa</span>
                    </div>
                  )}

                  {/* Keyword Text & Audio Button */}
                  <div className="w-full text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-4xl sm:text-5xl font-display font-extrabold text-text-main tracking-wide capitalize">
                        {previewKeywords[previewIndex].keyword}
                      </h3>

                      {/* Speaker Button: Speaks keyword using keywordAudioUrl or Web Speech API */}
                      <button
                        onClick={() => playKeywordAudio(previewKeywords[previewIndex])}
                        className={`btn-3d w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${isPlayingAudio
                            ? 'btn-3d-pink scale-110 animate-pulse'
                            : 'btn-3d-blue hover:scale-105'
                          }`}
                        title="Phát âm từ vựng"
                      >
                        <SpeakerWaveIcon className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Contextual Translation */}
                    {(previewKeywords[previewIndex].keywordTranslation || previewKeywords[previewIndex].translation) && (
                      <div className="border-t-2 border-border-main/30 my-2 pt-3">
                        <span className="text-xs font-extrabold text-primary tracking-wider uppercase block mb-1">
                          Nghĩa từ vựng
                        </span>
                        <p className="text-2xl font-display font-extrabold text-primary-dark">
                          {previewKeywords[previewIndex].keywordTranslation || previewKeywords[previewIndex].translation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-bold text-text-muted">Không có từ khóa preview, hãy bắt đầu hội thoại!</p>
                </div>
              )}

              {/* Mascot cheering */}
              <div className="flex items-center gap-4 py-1">
                <Mascot
                  expression="thinking"
                  speechBubbleText="Làm quen các từ này trước khi bước vào câu chuyện nhé!"
                  bubblePosition="right"
                  size={80}
                />
              </div>
            </div>
          ) : (
            /* GIAI ĐOẠN 2: TOÀN BỘ CUỘC HỘI THOẠI DẠNG STREAM CUỘN XUỐNG */
            <div className="flex flex-col items-center w-full space-y-4 animate-fade-in-up">
              {/* Header Box: Bạn A (Left), Tên Part (Center), Bạn B (Right) */}
              <div className="w-full bg-white border-2 border-border-main/80 rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4">
                {/* Người A: Vịt con */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-300 overflow-hidden shadow-sm bg-amber-50">
                    <img src={AVATAR_A} alt="Bạn A" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-display font-black text-amber-800 uppercase mt-1">BẠN A</span>
                </div>

                {/* Tiêu đề Part ở giữa & Nút điều khiển phát */}
                <div className="flex flex-col items-center gap-2 text-center flex-1">
                  <div className="bg-gradient-to-r from-amber-50 via-pink-50 to-purple-50 border-2 border-primary/20 px-6 py-1.5 rounded-full shadow-xs">
                    <span className="text-base sm:text-xl font-display font-black text-primary uppercase tracking-wider">
                      {currentPartTitle.toUpperCase()}
                    </span>
                  </div>

                  {isAutoPlayingAll ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentAudio) currentAudio.pause();
                        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        setIsAutoPlayingAll(false);
                        // Do not set playingLineIndex to null so we can resume
                        setIsPlayingAudio(false);
                      }}
                      className="text-xs font-black flex items-center gap-1.5 px-3.5 py-1 rounded-full border transition-all cursor-pointer bg-amber-100 border-amber-400 text-amber-800 animate-pulse"
                    >
                      <SpeakerWaveIcon className="w-3.5 h-3.5" />
                      <span>Đang đọc hội thoại (Bấm để dừng)</span>
                    </button>
                  ) : playingLineIndex !== null && playingLineIndex < playItems.length - 1 ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playConversationLine(0, true)}
                        className="text-xs font-black flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer bg-slate-50 hover:bg-white border-border-main text-text-muted hover:text-primary"
                      >
                        <ArrowPathIcon className="w-3.5 h-3.5" />
                        <span>Nghe lại từ đầu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => playConversationLine(playingLineIndex, true)}
                        className="text-xs font-black flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-sm"
                      >
                        <PlayIcon className="w-3.5 h-3.5" />
                        <span>Tiếp tục nghe</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => playConversationLine(0, true)}
                      className="text-xs font-black flex items-center gap-1.5 px-3.5 py-1 rounded-full border transition-all cursor-pointer bg-slate-50 hover:bg-white border-border-main text-text-muted hover:text-primary"
                    >
                      <SpeakerWaveIcon className="w-3.5 h-3.5" />
                      <span>Phát lại toàn bộ cuộc trò chuyện</span>
                    </button>
                  )}
                </div>

                {/* Người B: Cậu bé */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-purple-300 overflow-hidden shadow-sm bg-purple-50">
                    <img src={AVATAR_B} alt="Bạn B" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-display font-black text-purple-800 uppercase mt-1">BẠN B</span>
                </div>
              </div>

              {/* Chat Stream: Cuộn thẳng xuống */}
              <div
                ref={chatContainerRef}
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
                    setMaxConversationIndex(playItems.length - 1);
                  }
                }}
                className="w-full bg-slate-50/80 border-2 border-border-main/60 rounded-3xl p-4 sm:p-6 shadow-inner max-h-[65vh] overflow-y-auto space-y-5 scroll-smooth"
              >
                {playItems.map((item, idx) => {
                  const isA = item.speakerRole === SpeakerRole.SPEAKER_1 || item.speakerRole === 'SPEAKER_1' || !item.speakerRole;
                  const isLinePlaying = playingLineIndex === idx;

                  return (
                    <div
                      key={item.id || idx}
                      id={`chat-line-${idx}`}
                      className={`flex flex-col w-full space-y-2 ${isA ? 'items-start' : 'items-end'} transition-all duration-300 scroll-mt-6`}
                    >
                      {/* BUBBLE CHỨA TEXT */}
                      <div
                        className={`relative w-fit max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 shadow-sm ${isA
                            ? 'bg-[#FFF9E6] border-[#FDE68A] text-slate-900 rounded-tl-sm'
                            : 'bg-[#F5F3FF] border-[#DDD6FE] text-slate-900 rounded-tr-sm'
                          } ${isLinePlaying
                            ? isA
                              ? 'ring-4 ring-amber-400/60 scale-[1.02] shadow-md border-amber-400'
                              : 'ring-4 ring-purple-400/60 scale-[1.02] shadow-md border-purple-400'
                            : ''
                          }`}
                      >
                        {/* Triangle pointer */}
                        {isA ? (
                          <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#FDE68A] border-b-8 border-b-transparent" />
                        ) : (
                          <div className="absolute -right-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-[#DDD6FE] border-b-8 border-b-transparent" />
                        )}

                        {/* Content text & Speaker radio button */}
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-base sm:text-xl font-display font-extrabold text-slate-900 leading-snug m-0 flex-1">
                            {renderHighlightedSentence(item.contentText, item.keyword)}
                          </p>
                          <button
                            type="button"
                            onClick={() => playConversationLine(idx, false)}
                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer mt-0.5 ${isLinePlaying
                                ? isA
                                  ? 'bg-amber-500 text-white scale-110 shadow-sm animate-pulse'
                                  : 'bg-purple-600 text-white scale-110 shadow-sm animate-pulse'
                                : isA
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                              }`}
                            title="Nghe câu này"
                          >
                            <SpeakerWaveIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Translation */}
                        {item.translation && (
                          <p className={`text-xs sm:text-base font-bold border-t pt-2 mt-3 m-0 ${isA ? 'text-amber-900/80 border-amber-200/80' : 'text-purple-900/80 border-purple-200/80'
                            }`}>
                            {item.translation}
                          </p>
                        )}
                      </div>

                      {/* BUBBLE CHỨA HÌNH ẢNH (TÁCH BIỆT HOÀN TOÀN KHỎI BUBBLE TEXT) */}
                      {item.imageUrl && (
                        <div className={`w-[85%] sm:w-[50%] rounded-3xl bg-white border-2 overflow-hidden shadow-sm relative flex items-center justify-center p-1.5 ${isA ? 'border-amber-200 ml-4' : 'border-purple-200 mr-4'
                          } ${isLinePlaying ? 'ring-2 ring-primary/40' : ''}`}>
                          <img
                            src={getAssetUrl(item.imageUrl)}
                            alt="Hình minh họa"
                            className="w-full h-auto object-contain rounded-2xl"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="w-full h-12 flex-shrink-0" />
              </div>
            </div>
          )

        ) : activeLayout === 'LISTENING' ? (
          <div className="flex flex-col items-center space-y-8 animate-fade-in-up w-full">
            {/* Speech Dialog Area with Mascot & 2 Sound speed buttons */}
            <div className="flex items-center justify-center py-4">
              <div className="relative bg-white border-2 border-border-main rounded-[2rem] p-5 shadow-sm flex items-center gap-6 animate-fade-in-up">

                {/* Standard speed sound button */}
                <button
                  onClick={() => playSound(1.0)}
                  className={`btn-3d w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${isPlayingAudio ? 'btn-3d-pink animate-pulse' : 'btn-3d-blue hover:scale-105'
                    }`}
                >
                  <SpeakerWaveIcon className="w-8 h-8 text-white" />
                </button>

                {/* Slow speed sound button (0.6x) */}
                <button
                  onClick={() => playSound(0.6)}
                  className="btn-3d w-12 h-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-[#fff4cc] hover:bg-[#ffeaa7] border-2 border-[#f5cd79] border-b-4 border-b-[#e5b955] shadow-[0_2px_0_0_#d4a237] hover:scale-105 text-[#d97706]"
                  title="Nghe chậm (0.6x)"
                >
                  <SpeakerWaveIcon className="w-5 h-5 text-[#d97706]" />
                  <span className="text-[9px] font-black tracking-tight leading-none text-[#b45309]">0.6x</span>
                </button>

                <div className="text-left">
                  <h4 className="text-sm font-display font-extrabold text-text-main m-0 leading-tight">HÃY NGHE KỸ NHÉ!</h4>
                  <p className="text-[10px] font-semibold text-text-muted mt-0.5 leading-none">Bấm nút để nghe giọng đọc mẫu.</p>
                </div>
              </div>
            </div>

            {/* 4 Image Choices Grid */}
            <div className="grid grid-cols-2 gap-5 w-full max-w-lg pt-2">
              {listeningOptions.map((imageUrl, idx) => {
                const isSelected = selectedOption === imageUrl;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={imageUrl + '-' + idx}
                    onClick={() => handleSelectOption(imageUrl)}
                    className={`card-3d p-2 border-2 transition-all flex flex-col items-center gap-2 cursor-pointer relative ${isSelected
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
          </div>
        ) : activeLayout === 'SPEAKING' ? (
          <div className="flex flex-col items-center space-y-6 animate-fade-in-up w-full">
            {/* Flashcard container (Same as INTRODUCTION but tailored for Speaking) */}
            <div className="w-full max-w-sm bg-white border-2 border-border-main rounded-[2.5rem] shadow-[0_8px_0_0_#e5e5e5] p-6 flex flex-col items-center space-y-6 hover:translate-y-[-2px] hover:shadow-[0_10px_0_0_#e5e5e5] transition-all duration-150 relative overflow-hidden group">

              {/* Image Frame */}
              {currentItem.imageUrl ? (
                <div className="w-full h-52 bg-slate-50/80 border-2 border-border-main/50 rounded-3xl overflow-hidden relative flex items-center justify-center p-3">
                  <img
                    src={getAssetUrl(currentItem.imageUrl)}
                    alt={currentItem.contentText}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-primary-soft/10 border-2 border-dashed border-primary/20 rounded-3xl flex items-center justify-center">
                  <span className="text-sm text-text-muted font-bold">Hình ảnh minh họa</span>
                </div>
              )}

              {/* Text & Audio Controls */}
              <div className="w-full text-center space-y-4">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {speakingResult ? (
                    <div className="flex flex-wrap items-center justify-center gap-2 py-1">
                      {speakingResult.map((res, idx) => (
                        <span
                          key={idx}
                          className={`text-3xl font-display font-extrabold px-3 py-1.5 rounded-2xl border-2 transition-all ${res.status === 'correct'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-300 shadow-sm'
                            : 'bg-rose-50 text-rose-600 border-rose-400 font-extrabold shadow-sm animate-pulse'
                            }`}
                        >
                          {res.word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <h3 className="text-4xl font-display font-extrabold text-text-main tracking-wide">
                      {currentItem.contentText}
                    </h3>
                  )}

                  {/* Speaker Button */}
                  <button
                    onClick={() => playSound(1.0)}
                    className={`btn-3d w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${isPlayingAudio
                      ? 'btn-3d-pink scale-110 animate-pulse'
                      : 'btn-3d-blue hover:scale-105'
                      }`}
                  >
                    <SpeakerWaveIcon className={`w-7 h-7 text-white ${isPlayingAudio ? 'animate-bounce-soft' : ''}`} />
                  </button>
                </div>

                <div className="border-t-2 border-border-main/30 my-2 pt-3">
                  <span className="text-xs font-extrabold text-primary tracking-wider uppercase block mb-1">
                    Nghĩa tiếng Việt
                  </span>
                  <p className="text-xl font-display font-extrabold text-primary-dark">
                    {currentItem.translation}
                  </p>
                </div>
              </div>
            </div>

            {/* Speaking voice recording controller */}
            <div className="w-full max-w-sm bg-white border-2 border-border-main rounded-[2rem] p-5 shadow-sm flex flex-col items-center gap-4">
              <span className="text-xs font-extrabold text-text-muted uppercase tracking-widest">LUYỆN PHÁT ÂM</span>

              <div className="flex items-center gap-4 justify-center w-full">
                {/* 1. Record Button */}
                {!isRecording && !recordedAudioUrl && (
                  <button
                    onClick={startRecording}
                    disabled={isChecked}
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
                    ĐANG GHI ÂM (DỪNG)
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
                      disabled={isChecked}
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
              ) : recordedAudioUrl ? (
                <p className="text-[11px] text-[#52c41a] font-bold">Đã lưu giọng bé! Hãy bấm KIỂM TRA để tiếp tục học.</p>
              ) : (
                <p className="text-[11px] text-text-muted font-bold">Hãy cho phép mic và nhấn nút đỏ để bắt đầu nói.</p>
              )}
            </div>
          </div>
        ) : activeLayout === 'QUIZ' ? (
          <div className="flex flex-col items-center space-y-4 w-full animate-fade-in-up">
            {/* Question speech bubble with Mascot, Audio Speaker & Hint Toggle */}
            <div className="flex items-center justify-center gap-3 py-1 flex-wrap">
              {/* Mascot */}
              <div className="shrink-0">
                <Mascot
                  expression={isChecked ? (isCorrect ? 'happy' : 'sad') : 'thinking'}
                  size={100}
                />
              </div>

              {/* Speech Bubble Container */}
              <div className="relative bg-white border-2 border-border-main rounded-2xl p-3 sm:p-4 shadow-sm min-w-[240px] max-w-sm flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base sm:text-lg m-0 leading-relaxed text-left flex-1">
                    {showTranslationHint && currentItem.translation ? (
                      <span className="font-display font-extrabold text-[#0288d1]">{currentItem.translation}</span>
                    ) : (
                      renderMaskedSentence(currentItem.contentText, currentItem.keyword)
                    )}
                  </div>

                  {/* Nút phát âm thanh nằm ngay cạnh câu hỏi */}
                  <button
                    onClick={() => playSound(1.0)}
                    className={`btn-3d w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer ${isPlayingAudio
                        ? 'btn-3d-pink scale-110 animate-pulse'
                        : 'btn-3d-blue hover:scale-105'
                      }`}
                    title="Nghe câu hỏi"
                  >
                    <SpeakerWaveIcon className={`w-5 h-5 text-white ${isPlayingAudio ? 'animate-bounce-soft' : ''}`} />
                  </button>
                </div>

                {/* Nút Gợi ý (Dịch nghĩa câu hỏi) */}
                {currentItem.translation && (
                  <div className="flex items-center gap-2 pt-1 border-t border-border-main/30">
                    <button
                      type="button"
                      onClick={() => setShowTranslationHint(prev => !prev)}
                      className={`text-[11px] font-extrabold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${showTranslationHint
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-slate-50 hover:bg-amber-50 border-border-main/60 text-text-muted hover:text-amber-700'
                        }`}
                    >
                      <LightBulbIcon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{showTranslationHint ? 'Xem câu tiếng Anh' : 'Gợi ý nghĩa'}</span>
                    </button>

                    {showTranslationHint && (
                      <span className="text-[10px] text-text-muted italic">Đã dịch sang tiếng Việt</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Question Image Box */}
            {currentItem.imageUrl ? (
              <div className="w-full max-w-xs sm:max-w-sm bg-white border-2 border-border-main rounded-3xl p-3 shadow-[0_4px_0_0_#e5e5e5] flex items-center justify-center">
                <div className="w-full h-44 sm:h-52 bg-slate-50 border-2 border-border-main/50 rounded-2xl overflow-hidden relative flex items-center justify-center p-2">
                  <img
                    src={getAssetUrl(currentItem.imageUrl)}
                    alt={currentItem.contentText || 'Quiz image'}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400";
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-xs bg-primary-soft/10 border-2 border-dashed border-primary/20 rounded-2xl p-4 text-center">
                <span className="text-xs text-text-muted font-bold">Hình ảnh minh họa câu hỏi</span>
              </div>
            )}

            {/* QUIZ Choices (Keywords) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
              {quizOptions.map((option, idx) => {
                const isSelected = selectedOption === option;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={option + '-' + idx}
                    onClick={() => handleSelectOption(option)}
                    className={`card-3d p-4 text-left font-sans font-bold text-sm tracking-wide transition-all border-2 select-none cursor-pointer flex items-center gap-4 ${isSelected
                      ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/10 shadow-[0_4px_0_0_#d93d74] scale-[1.01]'
                      : 'border-border-main hover:bg-bg-light text-text-main bg-white shadow-[0_4px_0_0_#e5e5e5]'
                      }`}
                    style={{
                      pointerEvents: isChecked ? 'none' : 'auto',
                    }}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-display text-xs ${isSelected
                        ? 'border-primary bg-primary text-white font-extrabold'
                        : 'border-border-main text-text-muted bg-white'
                        }`}
                    >
                      {optionLabel}
                    </span>
                    <span className="text-sm font-display font-bold leading-none">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : activeLayout === 'FILL_IN_BLANK' ? (
          <div className="flex flex-col items-center space-y-6 w-full animate-fade-in-up">
            {/* Mascot hướng dẫn */}
            <div className="flex items-center justify-center py-2">
              <Mascot
                expression={isChecked ? (isCorrect ? 'happy' : 'sad') : 'thinking'}
                speechBubbleText="Kéo thả hoặc nhấp chọn các từ bên dưới để ghép thành câu hoàn chỉnh nhé!"
                bubblePosition="right"
                size={90}
              />
            </div>

            {/* Gợi ý dịch nghĩa & nút nghe mẫu */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#f0f9ff] border-2 border-[#b3e5fc] px-5 py-3 rounded-2xl w-full">
              <div className="text-left">
                <span className="text-[10px] font-extrabold text-[#0288d1] tracking-wider uppercase block mb-0.5">Dịch nghĩa:</span>
                <p className="text-base font-display font-extrabold text-[#01579b]">{currentItem.translation}</p>
              </div>
              {currentItem.audioUrl && (
                <button
                  type="button"
                  onClick={() => playAudioWithFallback(1.0)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#b3e5fc] hover:bg-sky-50 text-[#0288d1] rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <SpeakerWaveIcon className="w-4 h-4 text-[#0288d1]" />
                  <span>Nghe câu</span>
                </button>
              )}
            </div>

            {/* Ảnh minh họa (nếu có) */}
            {currentItem.imageUrl && (
              <div className="w-full max-w-[200px] h-28 bg-white border-2 border-border-main/50 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                <img src={getAssetUrl(currentItem.imageUrl)} alt="Minh họa" className="w-full h-full object-contain hover:scale-105 transition-transform" />
              </div>
            )}

            {/* KHAY GHÉP CÂU (SENTENCE DROP TRAY) */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase">
                  CÂU CỦA BÉ:
                </span>
                {placedWords.length > 0 && !isChecked && (
                  <span className="text-[11px] text-primary font-bold">
                    💡 Nhấp từ để bỏ ra, hoặc kéo để đổi vị trí
                  </span>
                )}
              </div>

              <div
                onDragOver={handleDragOverTrayContainer}
                onDrop={handleDropOnTrayContainer}
                className={`w-full min-h-[5.5rem] p-4 rounded-[2rem] border-2 transition-all flex flex-wrap items-center justify-center gap-2.5 ${placedWords.length === 0
                    ? 'bg-slate-50/80 border-dashed border-border-main text-text-muted'
                    : 'bg-white border-primary/40 shadow-sm'
                  }`}
              >
                {placedWords.length === 0 ? (
                  <div className="flex items-center gap-2 text-text-muted select-none py-3 pointer-events-none">
                    <span className="text-sm font-bold">Kéo hoặc chạm các từ bên dưới vào đây để ghép câu...</span>
                  </div>
                ) : (
                  placedWords.map((chip, idx) => (
                    <React.Fragment key={chip.id}>
                      {/* Vạch chỉ thị vị trí chèn khi đang kéo rê qua */}
                      {dropIndicatorIndex === idx && (
                        <div className="w-1.5 h-10 bg-primary rounded-full animate-pulse transition-all shadow-[0_0_8px_rgba(217,61,116,0.6)]" />
                      )}

                      <div
                        role="button"
                        draggable={!isChecked}
                        onDragStart={(e) => handleDragStart(e, 'placed', chip)}
                        onDragOver={(e) => handleDragOverChip(e, idx)}
                        onDrop={(e) => handleDropOnChip(e, idx)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleWordClickPlaced(chip.id)}
                        className={`group relative px-4 py-2.5 rounded-xl font-display font-extrabold text-base transition-all select-none border-2 flex items-center gap-1.5 cursor-grab active:cursor-grabbing ${isChecked
                            ? isCorrect
                              ? 'bg-green-50 border-green-500 text-green-700 shadow-[0_3px_0_0_#22c55e]'
                              : 'bg-red-50 border-red-400 text-red-600 shadow-[0_3px_0_0_#ef4444]'
                            : 'bg-primary-soft border-primary text-primary shadow-[0_3px_0_0_#d93d74] hover:bg-red-50 hover:border-red-400 active:translate-y-[1px]'
                          }`}
                      >
                        <span className="pointer-events-none">{chip.text}</span>
                        {!isChecked && (
                          <XMarkIcon className="w-3.5 h-3.5 text-primary/60 group-hover:text-red-500 transition-colors pointer-events-none" />
                        )}
                      </div>
                    </React.Fragment>
                  ))
                )}

                {/* Vạch chỉ thị ở cuối hàng */}
                {dropIndicatorIndex === placedWords.length && placedWords.length > 0 && (
                  <div className="w-1.5 h-10 bg-primary rounded-full animate-pulse transition-all shadow-[0_0_8px_rgba(217,61,116,0.6)]" />
                )}
              </div>
            </div>

            {/* KHO TỪ BÊN DƯỚI (AVAILABLE WORD POOL) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={handleDropOnAvailablePool}
              className="w-full space-y-2 pt-2"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase">
                  TỪ CÒN LẠI ({availableWords.length}):
                </span>
                <span className="text-[11px] text-text-muted">
                  Bé có thể kéo hoặc nhấp chọn
                </span>
              </div>

              <div className="flex flex-wrap gap-3 justify-center p-5 border-2 border-border-main/50 rounded-2xl bg-white shadow-sm min-h-[5rem] items-center">
                {availableWords.length === 0 ? (
                  <span className="text-xs font-bold text-green-600 py-2">
                    ✨ Bé đã chọn hết tất cả các từ! Hãy bấm KIỂM TRA nhé!
                  </span>
                ) : (
                  availableWords.map((chip) => (
                    <div
                      key={chip.id}
                      role="button"
                      draggable={!isChecked}
                      onDragStart={(e) => handleDragStart(e, 'available', chip)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleWordClickAvailable(chip)}
                      className={`px-4 py-2.5 bg-white border-2 border-border-main shadow-[0_4px_0_0_#e5e5e5] text-text-main hover:bg-primary-soft hover:border-primary hover:text-primary active:translate-y-[2px] rounded-xl font-display font-bold text-base min-w-[3.5rem] text-center transition-all select-none ${isChecked ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                        }`}
                    >
                      <span className="pointer-events-none">{chip.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Fallback multiple-choice */
          <>
            {/* Speech Dialog Area with Mascot */}
            <div className="flex items-center justify-center py-4">
              <Mascot
                expression={isChecked ? (isCorrect ? 'happy' : 'sad') : 'thinking'}
                speechBubbleText={currentItem.contentText}
                bubblePosition="right"
                size={130}
              />
            </div>

            {/* Sound option for vocabulary / speaking */}
            {(currentItem.itemType === SessionItemType.FLASHCARD || currentItem.itemType === SessionItemType.QUIZ) && (
              <div className="flex justify-center">
                <button
                  onClick={() => playSound(1.0)}
                  className={`btn-3d w-14 h-14 rounded-full flex items-center justify-center cursor-pointer ${isPlayingAudio ? 'btn-3d-pink scale-110 animate-pulse' : 'btn-3d-blue'
                    }`}
                >
                  <SpeakerWaveIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            )}

            {/* Multiple Choices Options */}
            {currentItem.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {currentItem.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectOption(option)}
                      className={`card-3d p-4 text-left font-sans font-bold text-sm tracking-wide transition-all border-2 select-none cursor-pointer flex items-center gap-4 ${isSelected
                        ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/10'
                        : 'border-border-main hover:bg-bg-light text-text-main'
                        }`}
                      style={{
                        pointerEvents: isChecked ? 'none' : 'auto',
                      }}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-display text-xs ${isSelected
                          ? 'border-primary bg-primary text-white font-extrabold'
                          : 'border-border-main text-text-muted bg-white'
                          }`}
                      >
                        {optionLabel}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Check Answer / Continue Bar */}
      <footer
        className={`w-full py-6 px-6 border-t-2 select-none transition-colors duration-200 ${session.sessionType !== 'INTRODUCTION' && isChecked
          ? isCorrect
            ? 'bg-[#d7f5b3] border-[#a0da5a]' // Đúng: Banner màu xanh
            : 'bg-[#ffdfe0] border-[#ffb3b5]' // Sai: Banner màu đỏ
          : 'bg-white border-border-main'
          }`}
      >
        <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-4">
          {session.sessionType === 'INTRODUCTION' ? (
            <div className="flex justify-between w-full">
              {introPhase === 'PREVIEW' ? (
                <>
                  <Button3D
                    variant="gray"
                    onClick={() => setPreviewIndex(prev => Math.max(0, prev - 1))}
                    disabled={previewIndex === 0}
                    className="px-8 min-w-[120px] sm:min-w-[150px]"
                  >
                    TRỞ LẠI
                  </Button3D>
                  <Button3D
                    variant={previewIndex === previewKeywords.length - 1 ? "green" : "pink"}
                    onClick={() => {
                      if (previewIndex < previewKeywords.length - 1) {
                        setPreviewIndex(prev => prev + 1);
                      } else {
                        setIntroPhase('CONVERSATION');
                      }
                    }}
                    className="px-8 min-w-[120px] sm:min-w-[180px]"
                  >
                    {previewIndex === previewKeywords.length - 1 ? 'VÀO HỘI THOẠI 🚀' : 'TIẾP THEO'}
                  </Button3D>
                </>
              ) : (
                <>
                  <Button3D
                    variant="gray"
                    onClick={() => {
                      if (currentAudio) currentAudio.pause();
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                      setIsAutoPlayingAll(false);
                      setPlayingLineIndex(null);
                      setIsPlayingAudio(false);
                      setIntroPhase('PREVIEW');
                      setPreviewIndex(Math.max(0, previewKeywords.length - 1));
                    }}
                    className="px-8 min-w-[120px] sm:min-w-[150px]"
                  >
                    TRỞ LẠI
                  </Button3D>
                  <Button3D
                    variant={maxConversationIndex >= playItems.length - 1 ? "green" : "pink"}
                    onClick={() => {
                      if (currentAudio) currentAudio.pause();
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                      setIsAutoPlayingAll(false);
                      setPlayingLineIndex(null);
                      setIsPlayingAudio(false);
                      setSessionFinished(true);
                    }}
                    className="px-8 min-w-[120px] sm:min-w-[150px]"
                  >
                    HOÀN THÀNH 🏆
                  </Button3D>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Banner message displaying feedback details */}
              {isChecked ? (
                <div className="flex items-center gap-3 text-left">
                  {isCorrect ? (
                    <>
                      <CheckCircleIcon className="w-8 h-8 text-success fill-white stroke-[2.5] animate-bounce-soft" />
                      <div>
                        <h4 className="text-base font-display font-extrabold text-[#439c00] m-0">Tuyệt vời quá bé ơi!</h4>
                        <p className="text-[11px] font-semibold text-[#5aa81e]">Đáp án hoàn toàn chính xác.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="w-8 h-8 text-primary fill-white stroke-[2.5] animate-shake" />
                      <div>
                        <h4 className="text-base font-display font-extrabold text-primary-dark m-0">Chưa chính xác rồi bé!</h4>
                        <p className="text-[11px] font-semibold text-primary/80">
                          Đáp án đúng là: <strong>{getCorrectAnswerText()}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-left text-xs font-bold text-text-muted hidden sm:block">
                  {isCheckButtonEnabled
                    ? 'Tuyệt vời! Bé hãy nhấn "Kiểm Tra" đáp án nhé.'
                    : 'Bé hãy chọn một đáp án đúng nhất phía trên.'}
                </div>
              )}

              {/* Action button */}
              {!isChecked ? (
                <Button3D
                  variant={isCheckButtonEnabled ? 'pink' : 'gray'}
                  disabled={!isCheckButtonEnabled || isAssessing}
                  onClick={handleCheckAnswer}
                  className="px-8 min-w-[150px]"
                >
                  {isAssessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>ĐANG KIỂM TRA...</span>
                    </div>
                  ) : (
                    'KIỂM TRA'
                  )}
                </Button3D>
              ) : activeLayout === 'SPEAKING' && !isCorrect ? (
                <div className="flex items-center gap-3">
                  <Button3D
                    variant="gray"
                    onClick={handleRetrySpeaking}
                    className="px-6 min-w-[120px]"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-1.5 inline" />
                    LÀM LẠI
                  </Button3D>
                  <Button3D
                    variant="pink"
                    onClick={handleContinue}
                    className="px-6 min-w-[120px]"
                  >
                    TIẾP TỤC
                  </Button3D>
                </div>
              ) : (
                <Button3D
                  variant={isCorrect ? 'green' : 'pink'}
                  onClick={handleContinue}
                  className="px-8 min-w-[150px]"
                >
                  TIẾP TỤC
                </Button3D>
              )}
            </>
          )}
        </div>
      </footer>

      {/* Confirmation Modal when clicking Close */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-border-main rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-6 animate-fade-in-up">
            <Mascot expression="sad" speechBubbleText="Bé có chắc muốn thoát không? Tiến độ học của bài này sẽ bị mất đó!" size={100} />
            <div className="flex gap-4">
              <Button3D variant="gray" fullWidth size="sm" onClick={() => setShowExitModal(false)}>
                Học Tiếp
              </Button3D>
              <Button3D variant="pink" fullWidth size="sm" onClick={() => {
                onClose();
                resetSessionState();
              }}>
                Thoát Ra
              </Button3D>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
