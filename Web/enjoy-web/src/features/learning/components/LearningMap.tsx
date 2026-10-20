import React, { useState, useEffect, useRef } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { SessionStatus, SessionType } from '../types';
import type { Session, Topic } from '../types';
import type { TopicWithProgress } from '../types/placementTest';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import mascotImg from '../../../assets/mascot.png';
import topic1Bg from '../../../assets/topic1.png';
import { 
  AcademicCapIcon, 
  TrophyIcon, 
  SparklesIcon, 
  StarIcon, 
  LockClosedIcon, 
  ArrowLeftIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  MicrophoneIcon,
  Bars3BottomLeftIcon,
  CursorArrowRaysIcon,
  BookOpenIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { TargetSelectionScreen } from '../../placement-test/components/TargetSelectionScreen';
import type { UserExamTarget } from '../services/learningApi';

interface LearningMapProps {
  onStartSession: (session: Session) => void;
}

export const LearningMap: React.FC<LearningMapProps> = ({ onStartSession }) => {
  const {
    levels,
    topics,
    parts,
    sessionsByPart,
    userProgress = [],
    activeLevel,
    activeTopic,
    fetchLevels,
    fetchUserProgress,
    selectLevel,
    selectTopic,
    selectSession,
    loading,
    error,
  } = useLearningStore();

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuthStore();
  const [pendingLevel, setPendingLevel] = useState<any>(null);
  const [showTargetModal, setShowTargetModal] = useState<boolean>(false);

  // Tự động đóng popup khi click ra ngoài hoặc bấm phím Escape
  useEffect(() => {
    if (!selectedNodeId) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Click vào bên trong popup thì không đóng
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }

      // Click vào chính nút bài học đang được chọn thì để onClick của nút xử lý toggle
      if (target.closest(`[data-node-id="${selectedNodeId}"]`)) {
        return;
      }

      // Click ra ngoài -> tự động tắt popup
      setSelectedNodeId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId]);


  
  // Trạng thái màn hình: 'levels' (Trình độ) | 'topics' (Chủ đề) | 'sessions' (Bản đồ bài học)
  const [currentView, setCurrentView] = useState<'levels' | 'topics' | 'sessions'>(() => {
    const state = useLearningStore.getState();
    if (state.activeTopic) return 'sessions';
    if (state.activeLevel) return 'topics';
    return 'levels';
  });

  useEffect(() => {
    if (levels.length === 0) {
      fetchLevels();
    }
    fetchUserProgress();
    
    // Nếu đã chọn activeTopic và chưa có parts (ví dụ F5 tải lại trang):
    if (activeTopic) {
      if (parts.length === 0) {
        selectTopic(activeTopic);
      }
    } else if (activeLevel) {
      // Chỉ tải topics nếu danh sách topics đang rỗng
      if (topics.length === 0) {
        selectLevel(activeLevel);
      }
    }
  }, []);

  // Tự động tải lại Parts và Sessions nếu đang ở view 'sessions' mà parts bị rỗng
  useEffect(() => {
    if (currentView === 'sessions' && activeTopic && parts.length === 0 && !loading) {
      selectTopic(activeTopic);
    }
  }, [currentView, activeTopic?.id, parts.length, loading]);

  const getLevelColors = (index: number) => {
    const palettes = [
      {
        bg: 'bg-[#eefcf2]',
        border: 'border-[#a0da5a]',
        shadow: 'shadow-[0_8px_0_0_#8bc34a]',
        text: 'text-[#2c8a00]',
        iconBg: 'bg-[#e3f8e9]',
        iconColor: 'text-[#58cc02]',
        codeColor: 'text-[#58cc02]/80',
        hoverShadow: 'hover:shadow-[0_10px_0_0_#8bc34a]'
      },
      {
        bg: 'bg-[#fff8e7]',
        border: 'border-[#ffc83d]',
        shadow: 'shadow-[0_8px_0_0_#e0a800]',
        text: 'text-[#c77800]',
        iconBg: 'bg-[#fff2cc]',
        iconColor: 'text-[#ffc83d]',
        codeColor: 'text-[#ffc83d]/80',
        hoverShadow: 'hover:shadow-[0_10px_0_0_#e0a800]'
      },
      {
        bg: 'bg-[#fdf4ff]',
        border: 'border-[#f3a0ff]',
        shadow: 'shadow-[0_8px_0_0_#d97eff]',
        text: 'text-[#a83bb5]',
        iconBg: 'bg-[#fae8ff]',
        iconColor: 'text-[#e85df5]',
        codeColor: 'text-[#e85df5]/80',
        hoverShadow: 'hover:shadow-[0_10px_0_0_#d97eff]'
      },
      {
        bg: 'bg-[#e5f5ff]',
        border: 'border-[#84d8ff]',
        shadow: 'shadow-[0_8px_0_0_#46c0ff]',
        text: 'text-[#0079b8]',
        iconBg: 'bg-[#d0f0ff]',
        iconColor: 'text-[#1890ff]',
        codeColor: 'text-[#1890ff]/80',
        hoverShadow: 'hover:shadow-[0_10px_0_0_#46c0ff]'
      }
    ];
    return palettes[index % palettes.length];
  };

  const getLevelIcon = (index: number) => {
    switch (index % 4) {
      case 0:
        return <AcademicCapIcon className="w-9 h-9" />;
      case 1:
        return <TrophyIcon className="w-9 h-9" />;
      case 2:
        return <SparklesIcon className="w-9 h-9" />;
      case 3:
        return <TrophyIcon className="w-9 h-9" />;
      default:
        return <SparklesIcon className="w-9 h-9" />;
    }
  };

  // Hành động khi nhấp vào Trình độ -> Chuyển sang màn hình Chủ đề và tải Topics
  const handleLevelClick = async (lvl: any) => {
    const currentUserId = user?.id || (() => {
      try {
        const str = localStorage.getItem('enjoy_user');
        return str ? JSON.parse(str)?.id : null;
      } catch {
        return null;
      }
    })();
    const targetKey = currentUserId ? `enjoy_target_${currentUserId}` : null;
    const hasTarget = targetKey ? Boolean(localStorage.getItem(targetKey)) : false;

    if (!hasTarget) {
      setPendingLevel(lvl);
      setShowTargetModal(true);
      return;
    }

    setCurrentView('topics');
    await selectLevel(lvl);
  };

  // Hành động khi nhấp vào Chủ đề -> Chuyển sang Bản đồ bài học và tải Parts + Sessions
  const handleTopicClick = async (tpc: Topic) => {
    setCurrentView('sessions');
    await selectTopic(tpc);
  };

  // Quay lại màn hình Trình độ
  const handleBackToLevels = () => {
    setSelectedNodeId(null);
    useLearningStore.setState({ activeLevel: null, activeTopic: null });
    setCurrentView('levels');
  };

  // Quay lại màn hình Chủ đề
  const handleBackToTopics = () => {
    setSelectedNodeId(null);
    useLearningStore.setState({ activeTopic: null });
    setCurrentView('topics');
  };

  // Hàm tính toán độ dịch chuyển ngang (margin-left) để tạo đường cong hình chữ S
  const getCurveMargin = (index: number, isGrammar: boolean = false) => {
    const patternVocab = [0, 50, 90, 50, 0, -50, -90, -50];
    const patternGrammar = [0, -50, -90, -50, 0, 50, 90, 50];
    const pattern = isGrammar ? patternGrammar : patternVocab;
    const offset = pattern[index % pattern.length];
    return { transform: `translateX(${offset}px)` };
  };

  const getSessionPalette = (partIdx: number) => {
    const palettes = [
      { name: 'green', bg: 'bg-[#58cc02]', border: 'border-[#489d02]', ring: 'ring-[#58cc02]/25', shadow: 'shadow-[0_4px_0_0_#489d02]', textClass: 'text-[#58cc02]', borderClass: 'border-[#58cc02]', btnVariant: 'green' as const },
      { name: 'orange', bg: 'bg-[#ff9600]', border: 'border-[#cc7800]', ring: 'ring-[#ff9600]/25', shadow: 'shadow-[0_4px_0_0_#cc7800]', textClass: 'text-[#ff9600]', borderClass: 'border-[#ff9600]', btnVariant: 'pink' as const },
      { name: 'blue', bg: 'bg-[#1cb0f6]', border: 'border-[#1899d6]', ring: 'ring-[#1cb0f6]/25', shadow: 'shadow-[0_4px_0_0_#1899d6]', textClass: 'text-[#1cb0f6]', borderClass: 'border-[#1cb0f6]', btnVariant: 'blue' as const },
      { name: 'pink', bg: 'bg-[#ff71a2]', border: 'border-[#cc5a81]', ring: 'ring-[#ff71a2]/25', shadow: 'shadow-[0_4px_0_0_#cc5a81]', textClass: 'text-[#ff71a2]', borderClass: 'border-[#ff71a2]', btnVariant: 'pink' as const }
    ];
    return palettes[partIdx % 4];
  };

  const getSessionIcon = (session: any) => {
    let Icon = StarIcon;
    switch (session.sessionType) {
      case SessionType.FLASHCARD: Icon = DocumentTextIcon; break;
      case SessionType.MATCH_WORD: Icon = PuzzlePieceIcon; break;
      case SessionType.SPEAKING: 
      case SessionType.SPEAKING_SENTENCE:
        Icon = MicrophoneIcon; break;
      case SessionType.RE_ORDER:
      case SessionType.RE_ORDER_SENTENCE:
        Icon = Bars3BottomLeftIcon;
        break;
      case SessionType.DRAG_DROP: Icon = CursorArrowRaysIcon; break;
      case SessionType.GRAMMAR: Icon = BookOpenIcon; break;
      case SessionType.FILL_IN_BLANK: Icon = PencilSquareIcon; break;
      case SessionType.CONVERSATION: Icon = ChatBubbleLeftRightIcon; break;
    }

    if (session.status === SessionStatus.LOCK) {
      return <Icon className="w-8 h-8 text-[#afafaf] opacity-60" />;
    }
    return <Icon className="w-8 h-8 text-white drop-shadow-sm" />;
  };

  const getNodeBackground = (session: any, isSelected: boolean) => {
    const base3D = 'border-b-[6px] active:border-b-0 active:translate-y-1.5 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1),_inset_0_4px_0_rgba(255,255,255,0.3)]';

    if (session.status === SessionStatus.LOCK) {
      return 'bg-[#e5e5e5] border-[#c0c0c0] text-[#afafaf] border-b-[6px] shadow-[inset_0_4px_0_rgba(255,255,255,0.5)] cursor-not-allowed hover:brightness-100';
    }

    const palette = getSessionPalette(session.partIdx || 0);

    if (session.status === SessionStatus.FINISH) {
      return `${palette.bg} text-white ${palette.border} ${base3D} hover:brightness-110`;
    }

    // Đang mở khóa (UNLOCK)
    return isSelected
      ? `${palette.bg} text-white ${palette.border} ring-8 ${palette.ring} scale-110 ${base3D}`
      : `${palette.bg} text-white ${palette.border} hover:scale-105 hover:brightness-110 ring-4 ${palette.ring} ${base3D} animate-pulse`;
  };

  const handleNodeClick = (session: Session) => {
    if (session.status === SessionStatus.LOCK) return;
    if (selectedNodeId === session.id) {
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(session.id);
      selectSession(session);
    }
  };

  const currentLevels = levels;
  const currentLevel = activeLevel;
  const currentTopic = activeTopic;
  const currentParts = parts;

  const getSessionsForPart = (partId: number): Session[] => {
    return sessionsByPart[partId] || [];
  };

  // Phẳng hóa toàn bộ bài học (Sessions) của các Phần (Parts) thuộc Chủ đề hiện tại để vẽ bản đồ dài nối liền
  const rawSessionsInTopic = currentParts.flatMap((part, partIdx) => {
    const partSessions = getSessionsForPart(part.id);
    return partSessions.map((session, sessionIdx) => ({
      ...session,
      partId: part.id,
      partTitle: part.title,
      partIdx,
      sessionIdx,
    }));
  });

  // Lọc bỏ sessions đã SKIPPED bởi placement test (không hiển thị trên UI)
  // Nhưng vẫn giữ nguyên rawSessionsInTopic đầy đủ để tính toán chain unlock
  const skippedSessionIds = new Set(
    userProgress
      .filter(p => p.status === SessionStatus.SKIPPED)
      .map(p => p.session?.id || (p as any).sessionId)
      .filter(Boolean)
  );
  const visibleSessionsInTopic = rawSessionsInTopic.filter(s => !skippedSessionIds.has(s.id));

  // Map trạng thái bài học dựa trên userProgress cá nhân (dùng rawSessionsInTopic đầy đủ để tính chain)
  const allSessionsInTopic = visibleSessionsInTopic.map((session, index) => {
    const prog = userProgress.find(p => (p.session && p.session.id === session.id) || (p as any).sessionId === session.id);
    let calculatedStatus = SessionStatus.LOCK;

    if (prog) {
      // SKIPPED từ placement test → không còn hiển thị (đã lọc ở trên), giữ logic an toàn
      calculatedStatus = prog.status === SessionStatus.SKIPPED ? SessionStatus.FINISH : prog.status;
    } else {
      // Chỉ kiểm tra session liền kề trước đó trong danh sách RAW
      const myRawIdx = rawSessionsInTopic.findIndex(s => s.id === session.id);
      let isPrevFinished = false;
      if (myRawIdx > 0) {
        const prevRaw = rawSessionsInTopic[myRawIdx - 1];
        const prevProg = userProgress.find(p => (p.session && p.session.id === prevRaw.id) || (p as any).sessionId === prevRaw.id);
        if (prevProg) {
          isPrevFinished = prevProg.status === SessionStatus.FINISH || prevProg.status === SessionStatus.SKIPPED;
        } else {
          // Bài học liền trước chưa có tiến độ (chưa học) -> bài này không được mở khóa
          isPrevFinished = false;
        }
      } else {
        isPrevFinished = true; // session đầu tiên → luôn mở khóa
      }

      if (index === 0 || isPrevFinished) {
        calculatedStatus = SessionStatus.UNLOCK;
      }
    }

    return {
      ...session,
      status: calculatedStatus
    };
  });

  // Tính toán tiến trình hoàn thành của một Chủ đề (%)
  // % được tính dựa trên số bài học chưa được skip:
  // - Tổng bài học cần học = tổng bài trong topic - số bài đã SKIPPED
  // - Số bài đã học = số bài có trạng thái FINISH (không tính các bài SKIPPED)
  const getTopicProgress = (topicId: number) => {
    const isProgInTopic = (p: (typeof userProgress)[0]) => {
      if (p.session?.part?.topic?.id === topicId) return true;
      if (activeTopic?.id === topicId && parts.some(part => part.id === p.session?.part?.id)) return true;
      return false;
    };

    const topicProgress = userProgress.filter(isProgInTopic);

    // Tập hợp sessionId đã SKIPPED trong topic này
    const skippedSessionIds = new Set(
      topicProgress
        .filter(p => p.status === SessionStatus.SKIPPED)
        .map(p => p.session?.id || (p as any).sessionId)
        .filter(Boolean)
    );

    // Tập hợp sessionId đã FINISH trong topic này (chỉ tính bài chưa được skip)
    const finishedSessionIds = new Set(
      topicProgress
        .filter(p => p.status === SessionStatus.FINISH)
        .map(p => p.session?.id || (p as any).sessionId)
        .filter(id => Boolean(id) && !skippedSessionIds.has(id))
    );

    const topicObj = topics.find(t => t.id === topicId) as (Topic & Partial<TopicWithProgress>) | undefined;

    // Xác định tổng số bài học gốc của topic
    let totalSessions = 10;
    if (activeTopic && activeTopic.id === topicId && rawSessionsInTopic.length > 0) {
      totalSessions = rawSessionsInTopic.length;
    } else if (topicObj?.totalSessions !== undefined && topicObj.totalSessions > 0) {
      totalSessions = topicObj.totalSessions;
    } else if (topicObj?.parts && topicObj.parts.length > 0) {
      totalSessions = topicObj.parts.reduce((sum, part) => sum + (part.sessions?.length || 5), 0);
    } else if (topicObj?.learningStatus === 'VOCAB_ONLY' && skippedSessionIds.size === 0) {
      // Chỉ khi topic thực sự không có bài ngữ pháp nào trong DB (và chưa có bài nào bị skip) thì tổng bài mới là 5
      totalSessions = 5;
    } else {
      totalSessions = 10;
    }

    // Số bài học thực tế user cần học (loại trừ các bài đã SKIPPED)
    let totalActiveSessions: number;
    if (topicObj?.totalActiveSessions !== undefined) {
      totalActiveSessions = topicObj.totalActiveSessions;
    } else if (skippedSessionIds.size > 0) {
      totalActiveSessions = Math.max(0, totalSessions - skippedSessionIds.size);
    } else {
      totalActiveSessions = totalSessions;
    }

    // Nếu không còn bài học nào cần học (đã miễn toàn bộ topic) -> 100%
    if (totalActiveSessions === 0) return 100;

    // Nếu chưa học bài nào (chưa có bài FINISH)
    if (finishedSessionIds.size === 0) {
      return topicObj?.progressPercent ?? 0;
    }

    return Math.min(100, Math.round((finishedSessionIds.size / totalActiveSessions) * 100));
  };

  const isTopicUnlocked = (topic: Topic, index: number) => {
    // Chủ đề đầu tiên (Chủ đề 1) luôn luôn được mở khóa mặc định
    if (index === 0) return true;

    // Nếu chủ đề này đã hoàn thành 100% thì luôn mở khóa để có thể ôn tập lại
    const currentProgress = getTopicProgress(topic.id);
    if (currentProgress === 100) return true;

    // Các chủ đề tiếp theo chỉ được mở khóa khi chủ đề liền trước đã hoàn thành (100%)
    const prevTopic = topics[index - 1];
    if (prevTopic) {
      const prevTopicProgress = getTopicProgress(prevTopic.id);
      if (prevTopicProgress === 100) return true;
    }

    return false;
  };

  // Tìm bài học đang học hiện tại (UNLOCK) để hiển thị thông tin động trên Sticky Header
  const activeSession = allSessionsInTopic.find(s => s.status === SessionStatus.UNLOCK) || allSessionsInTopic[0];

  if (loading && levels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-text-muted">Đang tải danh sách trình độ...</span>
      </div>
    );
  }

  if (error && levels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 text-center">
        <span className="text-sm font-bold text-red-500">Đã xảy ra lỗi: {error}</span>
        <button 
          onClick={() => fetchLevels()}
          className="px-4 py-2 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (levels.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 text-center">
        <span className="text-sm font-bold text-text-muted">Không tìm thấy trình độ học tập nào. Vui lòng kết nối database và chạy script khởi tạo.</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full mx-auto py-6 px-4 select-none pb-24 bg-white min-h-screen">
      
      {/* 1. MÀN HÌNH CHỌN TRÌNH ĐỘ (LEVELS VIEW) */}
      {currentView === 'levels' && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
          <div className="text-center space-y-2 py-4">
            <h1 className="text-3xl font-display font-extrabold text-primary tracking-wide">BẢN ĐỒ TRÌNH ĐỘ</h1>
            <p className="text-sm font-semibold text-text-muted">Bé hãy chọn một trình độ học tập phía dưới nhé!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {currentLevels.map((lvl, index) => {
              const colors = getLevelColors(index);
              return (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelClick(lvl)}
                  className={`p-8 text-center rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center space-y-4 hover:translate-y-[-2px] ${colors.bg} ${colors.border} ${colors.shadow} ${colors.hoverShadow}`}
                >
                  <div className={`w-16 h-16 rounded-3xl border-2 flex items-center justify-center ${colors.iconBg} ${colors.border} ${colors.iconColor}`}>
                    {getLevelIcon(index)}
                  </div>
                  <div className="space-y-1">
                    <span className={`text-[10px] font-extrabold tracking-widest uppercase ${colors.codeColor}`}>
                      {lvl.code || `LVL ${index + 1}`}
                    </span>
                    <h3 className={`text-lg font-display font-extrabold ${colors.text}`}>{lvl.name}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MÀN HÌNH CHỌN CHỦ ĐỀ (TOPICS VIEW - GIỐNG ẢNH 1) */}
      {currentView === 'topics' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={handleBackToLevels}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-border-main rounded-xl hover:bg-bg-light font-display font-bold text-xs text-text-muted transition-all cursor-pointer shadow-[0_2px_0_0_#e5e5e5] active:translate-y-[1px]"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              QUAY LẠI
            </button>
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
              Trình độ: {currentLevel?.name}
            </span>
          </div>

          {/* Topics List with Duolingo Cards Layout (Image 1 Style) */}
          <div className="space-y-6 pt-2">
            {loading && topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold text-text-muted">Đang tải danh sách chủ đề...</span>
              </div>
            ) : topics.length > 0 ? (
              topics.map((tpc, index) => {
                const progress = getTopicProgress(tpc.id);
                const isUnlocked = isTopicUnlocked(tpc, index);
                
                // Trực quan hóa câu thoại bong bóng của Linh vật ENjoy
                const speechBubbleTexts = [
                  "Hello! Let's learn English!",
                  "I'm starting to learn English.",
                  "I know some words in English.",
                  "Practice makes perfect! Cùng cố gắng nhé bé!",
                  "You are doing great! Bé xuất sắc quá!"
                ];
                const bubbleText = speechBubbleTexts[index % speechBubbleTexts.length];

                // Xác định thông tin tên chủ đề và tên ngữ pháp cho topic
                const tWithProg = tpc as Topic & Partial<TopicWithProgress>;

                // Lấy tên grammar từ session 6 (ưu tiên grammarName từ backend)
                let grammarTitle: string | null = tWithProg.grammarName || null;
                if (!grammarTitle && tWithProg.learningStatus === 'GRAMMAR_ONLY' && tWithProg.displayTitle) {
                  grammarTitle = tWithProg.displayTitle;
                }
                if (!grammarTitle && tpc.parts) {
                  for (const part of tpc.parts) {
                    if (part.sessions) {
                      const s6 = part.sessions.find(s => s.orderIndex === 6 || s.sessionType === SessionType.GRAMMAR);
                      if (s6) {
                        const payloadTitle = (s6.payload as any)?.title;
                        grammarTitle = payloadTitle || s6.title;
                        break;
                      }
                    }
                  }
                }
                if (!grammarTitle && userProgress.length > 0) {
                  const progS6 = userProgress.find(
                    p => (p.session?.part?.topic?.id === tpc.id) &&
                         (p.session?.orderIndex === 6 || p.session?.sessionType === SessionType.GRAMMAR)
                  );
                  if (progS6?.session) {
                    const payloadTitle = (progS6.session.payload as any)?.title;
                    grammarTitle = payloadTitle || progS6.session.title;
                  }
                }

                // Lấy các bản ghi userProgress thuộc topic này
                const topicProgList = userProgress.filter(
                  p => p.session?.part?.topic?.id === tpc.id || (activeTopic?.id === tpc.id && parts.some(part => part.id === p.session?.part?.id))
                );

                // Điều kiện part Từ vựng đã skip:
                // - learningStatus là 'GRAMMAR_ONLY' (backend đã skip vocab)
                // - Hoặc trong userProgress, bài vocab (orderIndex <= 5) là SKIPPED
                const isVocabSkipped =
                  tWithProg.learningStatus === 'GRAMMAR_ONLY' ||
                  (topicProgList.length > 0 &&
                    topicProgList.some(
                      p => p.status === SessionStatus.SKIPPED &&
                        (p.session?.orderIndex ? p.session.orderIndex <= 5 : true) &&
                        p.session?.sessionType !== SessionType.GRAMMAR &&
                        p.session?.sessionType !== SessionType.FILL_IN_BLANK &&
                        p.session?.sessionType !== SessionType.RE_ORDER_SENTENCE &&
                        p.session?.sessionType !== SessionType.SPEAKING_SENTENCE &&
                        p.session?.sessionType !== SessionType.CONVERSATION
                    ));

                // Điều kiện part Ngữ pháp đã skip:
                // - Topic không có ngữ pháp (grammarTitle null)
                // - Hoặc learningStatus là 'VOCAB_ONLY'
                // - Hoặc trong userProgress, bài grammar (orderIndex >= 6 hoặc type GRAMMAR) là SKIPPED
                const isGrammarSkipped =
                  !grammarTitle ||
                  tWithProg.learningStatus === 'VOCAB_ONLY' ||
                  (topicProgList.length > 0 &&
                    topicProgList.some(
                      p => p.status === SessionStatus.SKIPPED &&
                        ((p.session?.orderIndex && p.session.orderIndex >= 6) ||
                          p.session?.sessionType === SessionType.GRAMMAR ||
                          p.session?.sessionType === SessionType.FILL_IN_BLANK ||
                          p.session?.sessionType === SessionType.RE_ORDER_SENTENCE ||
                          p.session?.sessionType === SessionType.SPEAKING_SENTENCE ||
                          p.session?.sessionType === SessionType.CONVERSATION)
                    ));

                const showTopicName = !isVocabSkipped;
                const showGrammarName = !isGrammarSkipped && Boolean(grammarTitle);
                const finalShowTopicName = showTopicName || (!showTopicName && !showGrammarName);

                return (
                  <div
                    key={tpc.id}
                    className={`border-2 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all relative overflow-hidden ${
                      isUnlocked
                        ? 'border-white text-text-main shadow-md'
                        : 'border-[#dcdcdc] text-text-muted shadow-sm'
                    }`}
                  >
                    {/* Hình nền topic1 hiển thị cho cả chủ đề mở khóa và chủ đề bị khóa */}
                    <div
                      className={`absolute inset-0 z-0 pointer-events-none transition-all ${
                        !isUnlocked ? 'grayscale contrast-75 brightness-95' : ''
                      }`}
                      style={{
                        backgroundImage: `url(${topic1Bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />

                    {/* Lớp phủ màu xám khi chủ đề bị khóa (giữ background topic1 nhưng phủ màu xám) */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-[#e5e7eb]/75 backdrop-grayscale z-0 pointer-events-none" />
                    )}

                    {/* Left details & progress & action button */}
                    <div className="flex-grow text-left space-y-4 w-full relative z-10">
                      <div className="space-y-1.5">
                        {/* 1. Tên Topic (hiển thị khi part từ vựng chưa skip) */}
                        {finalShowTopicName && (
                          <h3 className={`text-xl font-display font-extrabold drop-shadow-sm ${
                            isUnlocked ? 'text-black' : 'text-gray-700'
                          }`}>
                            {tpc.title}
                          </h3>
                        )}

                        {/* 2. Tên Grammar (ở title vòng 6, hiển thị khi part ngữ pháp chưa skip) */}
                        {showGrammarName && (
                          <div className={`flex items-center gap-1.5 font-display drop-shadow-sm ${
                            finalShowTopicName
                              ? (isUnlocked
                                  ? 'text-sm font-extrabold text-[#7c3aed] bg-purple-100/80 border border-purple-200/80 px-2.5 py-1 rounded-xl w-fit'
                                  : 'text-sm font-extrabold text-gray-600 bg-white/60 border border-gray-300 px-2.5 py-1 rounded-xl w-fit')
                              : (isUnlocked
                                  ? 'text-xl font-extrabold text-black'
                                  : 'text-xl font-extrabold text-gray-700')
                          }`}>
                            <BookOpenIcon className={`w-4 h-4 shrink-0 ${isUnlocked ? 'text-[#7c3aed]' : 'text-gray-500'}`} />
                            <span>{grammarTitle}</span>
                          </div>
                        )}

                        {!isUnlocked && (
                          <div className="pt-0.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-300 shadow-xs">
                              <LockClosedIcon className="w-3.5 h-3.5 text-gray-500" /> CHƯA MỞ KHÓA
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar with Trophy */}
                      {isUnlocked && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-5 bg-white border-2 border-[#84d8ff]/30 rounded-full overflow-hidden relative">
                            <div
                              className="h-full bg-[#58cc02] rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-[#0079b8] leading-none">
                              {progress}%
                            </span>
                          </div>
                          <span className="text-lg">🏆</span>
                        </div>
                      )}

                      {/* Active Continue Button / Skip/Jump Button */}
                      <div className="pt-1">
                        {isUnlocked ? (
                          <Button3D
                            variant="blue"
                            onClick={() => handleTopicClick(tpc)}
                            className="px-8 py-3 text-xs tracking-wider font-display font-extrabold uppercase"
                          >
                            TIẾP TỤC
                          </Button3D>
                        ) : (
                          <Button3D
                            variant="gray"
                            onClick={() => alert("Bé hãy hoàn thành các chủ đề trước để mở khóa nhé!")}
                            className="px-8 py-3 text-xs tracking-wider font-display font-extrabold uppercase border-2 border-border-main bg-white text-text-muted"
                          >
                            <LockClosedIcon className="w-4 h-4 mr-2 inline" />
                            NHẢY TỚI BÀI HỌC
                          </Button3D>
                        )}
                      </div>
                    </div>

                    {/* Right side mascot & inline bubble inside flex flow to avoid overlap */}
                    {isUnlocked && (
                      <div className="flex flex-col items-center flex-shrink-0 w-full md:w-auto relative z-10">
                        {/* Inline speech bubble above the mascot */}
                        <div className="relative bg-white border-2 border-border-main rounded-2xl px-4 py-2 shadow-sm max-w-[200px] mb-3 animate-fade-in-up">
                          <p className="text-xs font-semibold text-text-main text-center leading-tight">
                            {bubbleText}
                          </p>
                          {/* Triangle pointer tail pointing down */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-solid border-t-white border-x-transparent border-b-transparent" />
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-solid border-t-border-main border-x-transparent border-b-transparent -z-10" />
                        </div>
                        {/* Mascot Image */}
                        <div className="animate-float">
                          <img
                            src={mascotImg}
                            alt="ENjoy Mascot"
                            className="w-16 h-16 object-contain rounded-full select-none pointer-events-none drop-shadow-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-text-muted font-bold text-sm bg-bg-light border-2 border-dashed border-border-main rounded-2xl animate-pulse">
                Chưa có chủ đề nào trong trình độ này bé ơi!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MÀN HÌNH BẢN ĐỒ BÀI HỌC DÀI CUỐN CHIẾU (SESSIONS MAP VIEW - GIỐNG ẢNH 2) */}
      {currentView === 'sessions' && (
        <div className="w-full space-y-6 animate-fade-in-up relative">
          
          {/* Sticky Header like Image 2 */}
          <div className="max-w-2xl mx-auto sticky top-0 z-30 bg-[#a55eea] text-white rounded-2xl p-4 shadow-md flex items-center justify-between border-b-4 border-[#8854d0]">
            <div className="flex items-center gap-3 text-left">
              <button
                onClick={handleBackToTopics}
                className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer text-white"
              >
                <ArrowLeftIcon className="w-5 h-5 stroke-[2.5]" />
              </button>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f1e6ff] block mb-0.5">
                  Phần {activeSession ? activeSession.partIdx + 1 : 1}, Cửa {activeSession ? activeSession.sessionIdx + 1 : 1}
                </span>
                <h2 className="text-base font-display font-extrabold m-0 leading-tight">
                  {currentTopic?.title}
                </h2>
              </div>
            </div>
            <button
              onClick={() => alert("Mẹo học: Bé hãy ấn nút loa để nghe phát âm, sau đó luyện nói to theo linh vật nhé!")}
              className="bg-white/25 hover:bg-white/35 text-white font-display font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border-b-2 border-[#8854d0]"
            >
              HƯỚNG DẪN
            </button>
          </div>

          {/* Sessions Map Winding Road (Image 2) */}
          {(loading || (Boolean(activeTopic) && currentParts.length === 0)) ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-4 min-h-[400px]">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-text-muted">Đang tải bài học của chủ đề...</span>
            </div>
          ) : allSessionsInTopic.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-4 min-h-[300px] text-center">
              <span className="text-base font-bold text-text-muted">Chưa có bài học nào trong chủ đề này.</span>
              <button
                onClick={handleBackToTopics}
                className="mt-4 px-4 py-2 border-2 border-border-main rounded-xl hover:bg-bg-light font-display font-bold text-xs text-text-muted transition-all cursor-pointer"
              >
                QUAY LẠI DANH SÁCH CHỦ ĐỀ
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 w-full relative min-h-[500px]">
              {currentParts.map((part, partIdx) => {
                const partSessions = allSessionsInTopic.filter(s => s.partId === part.id);
                
                const isGrammarSession = (session: Session) => {
                  const sAny = session as any;
                  return (
                    session.sessionType === SessionType.GRAMMAR ||
                    session.sessionType === SessionType.FILL_IN_BLANK ||
                    session.sessionType === SessionType.RE_ORDER_SENTENCE ||
                    session.sessionType === SessionType.SPEAKING_SENTENCE ||
                    (session.orderIndex !== undefined && session.orderIndex !== null && session.orderIndex >= 6) ||
                    (sAny.sessionIdx !== undefined && sAny.sessionIdx >= 5)
                  );
                };

                const vocabSessions = partSessions.filter(s => !isGrammarSession(s));
                const grammarSessions = partSessions.filter(s => isGrammarSession(s));

                const renderSessionNode = (session: typeof partSessions[0], localIdx: number, isGrammar: boolean) => {
                  const isSelected = selectedNodeId === session.id;
                  const isUnlocked = session.status === SessionStatus.UNLOCK;
                  const curveStyle = getCurveMargin(localIdx, isGrammar);
                  const palette = getSessionPalette((session as any).partIdx || 0);

                  // Alternating Mascot placement next to the road
                  const hasMascotLeft = !isGrammar && localIdx === 2; // Mascot on the left of node 3
                  const hasMascotRight = isGrammar && localIdx === 1; // Mascot on the right of node 7 (which is index 1 of grammar)

                  return (
                    <div key={session.id} className={`w-full max-w-2xl flex justify-center items-center relative py-6 ${isSelected ? 'z-20' : ''}`}>
                      
                      {/* Left mascot placement */}
                      {hasMascotLeft && (
                        <div className="absolute left-0 sm:left-4 md:left-12 top-1/2 -translate-y-1/2">
                          <Mascot expression="happy" speechBubbleText="Bé học xuất sắc quá!" bubblePosition="right" size={90} />
                        </div>
                      )}

                      {/* Node container with S-curve offset */}
                      <div className={`relative flex flex-col items-center ${isSelected ? 'z-20' : ''}`} style={curveStyle}>
                        
                        {/* Floating Start tag */}
                        {isUnlocked && (
                          <div className={`absolute bottom-full mb-3 bg-white border-2 font-display font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-xl shadow-md animate-bounce-soft whitespace-nowrap z-10 ${palette.textClass} ${palette.borderClass}`}>
                            BẮT ĐẦU
                            {/* Little bubble tail */}
                            <div className={`absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-solid border-x-transparent border-b-transparent border-t-current`} style={{borderTopColor: 'inherit'}} />
                          </div>
                        )}

                        {/* Circular Node button */}
                        <button
                          data-node-id={session.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNodeClick(session);
                          }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold transition-all duration-150 cursor-pointer ${getNodeBackground(
                            session,
                            isSelected
                          )}`}
                        >
                          {getSessionIcon(session)}
                        </button>

                        {/* Tooltip Dialog for starting session */}
                        {isSelected && (
                          <div
                            ref={popupRef}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-full mb-4 bg-[#b066fe] border-2 border-[#9333ea] rounded-3xl p-5 shadow-2xl z-20 w-72 text-center animate-fade-in-up text-white"
                          >
                            <h4 className="text-base font-display font-black text-white m-0 leading-tight mb-1 text-center drop-shadow-sm">
                              {session.title}
                            </h4>
                            <span className="text-xs font-bold text-white/90 block mb-4 text-center">
                              Bài học {(session.sessionIdx ?? 0) + 1} / {partSessions.length}
                            </span>
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  setSelectedNodeId(null);
                                  onStartSession(session);
                                }}
                                className="w-full py-3 bg-white text-[#9333ea] font-display font-black text-sm tracking-wider uppercase rounded-2xl shadow-lg hover:bg-white/95 active:scale-95 transition-all cursor-pointer border-b-4 border-[#e9d5ff]"
                              >
                                BẮT ĐẦU {session.status === SessionStatus.FINISH ? '+5 KN' : '+20 KN'}
                              </button>
                            </div>
                            {/* Tooltip arrow pointer */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[10px] border-solid border-t-[#b066fe] border-x-transparent border-b-transparent" />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[12px] border-solid border-t-[#9333ea] border-x-transparent border-b-transparent -z-10" />
                          </div>
                        )}
                      </div>

                      {/* Right mascot placement */}
                      {hasMascotRight && (
                        <div className="absolute right-0 sm:right-4 md:right-12 top-1/2 -translate-y-1/2">
                          <Mascot expression="thinking" speechBubbleText="Cùng cố lên nào bé yêu!" bubblePosition="left" size={90} />
                        </div>
                      )}

                    </div>
                  );
                };

                return (
                  <React.Fragment key={part.id}>
                    {/* Part Separator Divider line right before the first session of each Part */}
                    <div className="w-full max-w-2xl text-center my-6 py-2 border-b-2 border-dashed border-border-main/50 relative z-10">
                      <span className="bg-bg-main px-4 text-xs font-display font-extrabold text-text-muted tracking-widest uppercase">
                        PHẦN {partIdx + 1}: {part.title}
                      </span>
                    </div>

                    {/* Vòng Từ vựng */}
                    {vocabSessions.length > 0 && (
                      <div className="flex flex-col items-center w-full relative py-4">
                        {/* Đường ray dọc riêng của cụm Từ vựng */}
                        <div className="absolute top-4 bottom-4 w-2.5 bg-[#e5e5e5] rounded-full -z-10" />
                        {vocabSessions.map((session, localIdx) => renderSessionNode(session, localIdx, false))}
                      </div>
                    )}

                    {/* Dải phân cách nhẹ nhàng báo hiệu phần Ngữ pháp */}
                    {grammarSessions.length > 0 && (
                      <div className="w-full max-w-md my-8 flex items-center justify-center gap-3 relative z-10">
                        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#d8b4fe] to-transparent" />
                        <div className="px-4 py-1.5 rounded-full bg-[#faf5ff] border border-[#d8b4fe] text-[#8854d0] text-xs font-display font-extrabold tracking-wider uppercase flex items-center gap-2 shadow-sm">
                          <span>✨</span>
                          <span>Ngữ pháp & Luyện tập</span>
                        </div>
                        <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#d8b4fe] to-transparent" />
                      </div>
                    )}

                    {/* Vòng Ngữ pháp */}
                    {grammarSessions.length > 0 && (
                      <div className="flex flex-col items-center w-full relative py-4">
                        {/* Đường ray dọc riêng của cụm Ngữ pháp - tone tím nhạt nhẹ nhàng */}
                        <div className="absolute top-4 bottom-4 w-2.5 bg-[#ede9fe] rounded-full -z-10" />
                        {grammarSessions.map((session, localIdx) => renderSessionNode(session, localIdx, true))}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal chọn target khi lần đầu bấm vào khóa học */}
      {showTargetModal && (
        <TargetSelectionScreen
          userId={Number(user?.id || 1)}
          isModal={true}
          onConfirm={async (_target: UserExamTarget) => {
            setShowTargetModal(false);
            const lvl = pendingLevel || levels[0];
            setCurrentView('topics');
            if (lvl) {
              await selectLevel(lvl);
            }
          }}
          onCancel={() => setShowTargetModal(false)}
        />
      )}
    </div>
  );
};
