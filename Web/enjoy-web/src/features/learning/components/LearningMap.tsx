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
      { name: 'sky', bg: 'bg-sky-500', border: 'border-sky-600', ring: 'ring-sky-200', textClass: 'text-sky-600', borderClass: 'border-sky-500' },
      { name: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-600', ring: 'ring-indigo-200', textClass: 'text-indigo-600', borderClass: 'border-indigo-500' },
      { name: 'emerald', bg: 'bg-emerald-500', border: 'border-emerald-600', ring: 'ring-emerald-200', textClass: 'text-emerald-600', borderClass: 'border-emerald-500' },
      { name: 'amber', bg: 'bg-amber-500', border: 'border-amber-600', ring: 'ring-amber-200', textClass: 'text-amber-600', borderClass: 'border-amber-500' }
    ];
    return palettes[partIdx % palettes.length];
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
      return <Icon className="w-7 h-7 text-slate-300" />;
    }
    return <Icon className="w-7 h-7 text-white drop-shadow-xs" />;
  };

  const getNodeBackground = (session: any, isSelected: boolean) => {
    if (session.status === SessionStatus.LOCK) {
      return 'bg-slate-100 border-2 border-slate-200 text-slate-300 shadow-2xs cursor-not-allowed opacity-80';
    }

    const palette = getSessionPalette(session.partIdx || 0);

    if (session.status === SessionStatus.FINISH) {
      return `bg-emerald-500 text-white border-2 border-emerald-600 shadow-md hover:scale-105 active:scale-95 transition-all`;
    }

    // Đang mở khóa (UNLOCK) - bài hiện tại
    return isSelected
      ? `${palette.bg} text-white border-2 ${palette.border} ring-4 ${palette.ring} scale-110 shadow-lg active:scale-100 transition-all`
      : `${palette.bg} text-white border-2 ${palette.border} ring-4 ${palette.ring} hover:scale-110 shadow-md animate-pulse transition-all`;
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
      
      {/* 1. MÀN HÌNH CHỌN TRÌNH ĐỘ (LEVEL ROADMAP PROGRESSION) */}
      {currentView === 'levels' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up py-4">
          <div className="text-center sm:text-left space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
              BẢN ĐỒ TRÌNH ĐỘ
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Bé hãy chọn một trình độ học tập phía dưới nhé!
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Level Card 1: PRE A1 - BEGINNER (Active / Current) */}
            {(() => {
              const lvl1 = currentLevels[0] || { id: 1, name: 'Pre A1 - Beginner', code: 'PRE_A1' };
              const finishedCount = userProgress.filter((p) => p.status === SessionStatus.FINISH).length;
              const totalCount = Math.max(finishedCount, 8);
              const percent = Math.min(100, Math.round((finishedCount / Math.max(totalCount, 1)) * 100));

              return (
                <div className="relative bg-white rounded-3xl border-2 border-emerald-500 shadow-md p-6 sm:p-7 transition-all hover:shadow-lg text-left">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
                        <span
                          className="material-symbols-outlined text-[36px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          school
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                            {lvl1.code || 'PRE_A1'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Đang học
                          </span>
                        </div>
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                          {lvl1.name || 'Pre A1 - Beginner'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
                          Dành cho người mới bắt đầu làm quen tiếng Anh. Nhận diện từ vựng cơ bản, phát âm âm tiết đầu tiên và chào hỏi tự nhiên.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLevelClick(lvl1)}
                      className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <span>VÀO HỌC</span>
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    </button>
                  </div>

                  {/* Progress Track inside Level 1 */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Tiến độ hoàn thành</span>
                      <span className="text-emerald-600 font-bold">
                        {finishedCount}/{totalCount} Bài học ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Level Card 2: A1 - MOVERS (Next in path) */}
            {(() => {
              const lvl2 = currentLevels[1] || { id: 2, name: 'A1 - Movers', code: 'A1_MOVERS' };
              const isLvl1Done = userProgress.filter((p) => p.status === SessionStatus.FINISH).length >= 8;

              return (
                <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all text-left">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[36px]">auto_stories</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
                            {lvl2.code || 'A1_MOVERS'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Cambridge A1</span>
                        </div>
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                          {lvl2.name || 'A1 - Movers'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
                          Mở rộng câu giao tiếp thường ngày, ngữ pháp cơ bản, đọc hiểu truyện ngắn và phản xạ tự tin hơn.
                        </p>
                      </div>
                    </div>

                    {isLvl1Done ? (
                      <button
                        onClick={() => handleLevelClick(lvl2)}
                        className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-display font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <span>VÀO HỌC</span>
                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                      </button>
                    ) : (
                      <div className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-500 text-xs font-bold">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        <span>MỞ SAU PRE-A1</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Level Card 3: A2 - FLYERS (Locked) */}
            {(() => {
              const lvl3 = currentLevels[2] || { id: 3, name: 'A2 - Flyers', code: 'A2_FLYERS' };

              return (
                <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs opacity-75 hover:opacity-90 transition-all text-left">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[36px]">military_tech</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            {lvl3.code || 'A2_FLYERS'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Cambridge A2</span>
                        </div>
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                          {lvl3.name || 'A2 - Flyers'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
                          Làm chủ các tình huống thảo luận, vốn từ 1000+ từ thông dụng và sẵn sàng cho bài thi chứng chỉ Cambridge.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span>ĐANG KHÓA</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 2. MÀN HÌNH CHỌN CHỦ ĐỀ (TOPICS VIEW) */}
      {currentView === 'topics' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={handleBackToLevels}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-sky-600 font-display font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>QUAY LẠI TRÌNH ĐỘ</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold font-display">
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span>Trình độ: {currentLevel?.name}</span>
            </div>
          </div>

          {/* Topics List with Modern Sky Blue Cards Layout */}
          <div className="space-y-4 pt-1">
            {loading && topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold text-slate-500">Đang tải danh sách chủ đề...</span>
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
                  "Practice makes perfect! Cùng cố gắng nhé!",
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
                    className={`relative rounded-3xl border-2 p-6 sm:p-7 transition-all text-left overflow-hidden shadow-sm ${
                      isUnlocked
                        ? 'border-white hover:border-sky-300 hover:shadow-md'
                        : 'border-slate-300 opacity-80'
                    }`}
                  >
                    {/* Hình nền topic1 hiển thị đầy đủ, rõ nét */}
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

                    {/* Lớp phủ màu xám khi chủ đề bị khóa */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-200/75 backdrop-grayscale z-0 pointer-events-none" />
                    )}

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      {/* Left information */}
                      <div className="flex-1 space-y-3 w-full">
                        {/* Status badge row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/85 backdrop-blur-xs text-slate-800 border border-white/60 shadow-2xs">
                            Chủ đề {index + 1}
                          </span>
                          {isUnlocked ? (
                            progress >= 100 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white/90 backdrop-blur-xs border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                                <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                                Đã hoàn thành
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-white/90 backdrop-blur-xs border border-sky-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                Đang học
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                              <span className="material-symbols-outlined text-[14px]">lock</span>
                              Chưa mở khóa
                            </span>
                          )}
                        </div>

                        {/* Title and grammar tag */}
                        <div>
                          {finalShowTopicName && (
                            <h3 className={`text-xl font-display font-extrabold drop-shadow-sm ${
                              isUnlocked ? 'text-slate-900' : 'text-slate-700'
                            }`}>
                              {tpc.title}
                            </h3>
                          )}
                          {showGrammarName && (
                            <div className="mt-1.5">
                              <span className={`inline-flex items-center gap-1.5 font-display text-xs font-extrabold px-3 py-1 rounded-xl shadow-2xs ${
                                isUnlocked
                                  ? 'bg-white/90 backdrop-blur-xs border border-indigo-200 text-indigo-700'
                                  : 'bg-white/80 text-slate-600 border border-slate-200'
                              }`}>
                                <span className="material-symbols-outlined text-[16px] text-indigo-600">menu_book</span>
                                <span>{grammarTitle}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar with Trophy */}
                        {isUnlocked && (
                          <div className="pt-2 max-w-md space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-800 drop-shadow-xs">Tiến độ bài học</span>
                              <span className="text-sky-700 font-extrabold bg-white/85 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/60 shadow-2xs">
                                {progress}%
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-white/90 border border-slate-200/80 overflow-hidden shadow-inner">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action button */}
                        <div className="pt-2">
                          {isUnlocked ? (
                            <button
                              onClick={() => handleTopicClick(tpc)}
                              className="px-7 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-display font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 active:scale-95 cursor-pointer"
                            >
                              <span>{progress > 0 ? 'TIẾP TỤC HỌC' : 'BẮT ĐẦU CHỦ ĐỀ'}</span>
                              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-xs text-slate-500 text-xs font-bold border border-slate-200 cursor-not-allowed shadow-2xs">
                              <span className="material-symbols-outlined text-[16px]">lock</span>
                              <span>HOÀN THÀNH CHỦ ĐỀ TRƯỚC ĐỂ MỞ</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side mascot with cute speech bubble */}
                      {isUnlocked && (
                        <div className="shrink-0 flex md:flex-col items-center gap-3 relative">
                          <div className="relative bg-white/95 backdrop-blur-xs border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm max-w-[190px] text-center leading-snug">
                            {bubbleText}
                          </div>
                          <img
                            src={mascotImg}
                            alt="ENjoy Mascot"
                            className="w-16 h-16 object-contain rounded-2xl select-none pointer-events-none drop-shadow-md animate-float"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 font-bold text-sm bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                Chưa có chủ đề nào trong trình độ này!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MÀN HÌNH BẢN ĐỒ BÀI HỌC DÀI CUỐN CHIẾU (SESSIONS MAP VIEW) */}
      {currentView === 'sessions' && (
        <div className="w-full space-y-6 animate-fade-in-up relative">
          
          {/* Sticky Header with Modern Sky Blue Theme */}
          <div className="max-w-2xl mx-auto sticky top-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <button
                onClick={handleBackToTopics}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer text-slate-600"
                title="Quay lại danh sách chủ đề"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 inline-block mb-1">
                  Phần {activeSession ? activeSession.partIdx + 1 : 1} • Cửa {activeSession ? activeSession.sessionIdx + 1 : 1}
                </span>
                <h2 className="text-base font-display font-bold text-slate-900 m-0 leading-tight">
                  {currentTopic?.title}
                </h2>
              </div>
            </div>
            <button
              onClick={() => alert("Mẹo học: Bé hãy ấn nút loa để nghe phát âm, sau đó luyện nói to theo linh vật nhé!")}
              className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-display font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-sky-200 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
              <span>Hướng dẫn</span>
            </button>
          </div>

          {/* Sessions Map Winding Road */}
          {(loading || (Boolean(activeTopic) && currentParts.length === 0)) ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-4 min-h-[400px]">
              <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-slate-500">Đang tải bài học của chủ đề...</span>
            </div>
          ) : allSessionsInTopic.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-4 min-h-[300px] text-center">
              <span className="text-base font-bold text-slate-500">Chưa có bài học nào trong chủ đề này.</span>
              <button
                onClick={handleBackToTopics}
                className="mt-4 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-display font-bold text-xs text-slate-600 transition-all cursor-pointer"
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

                  // Alternating Mascot placement next to the road
                  const hasMascotLeft = !isGrammar && localIdx === 2;
                  const hasMascotRight = isGrammar && localIdx === 1;

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
                          <div className="absolute bottom-full mb-3 bg-sky-600 text-white font-display font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md animate-bounce whitespace-nowrap z-10 flex items-center gap-1">
                            <span>BẮT ĐẦU</span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-solid border-x-transparent border-b-transparent border-t-sky-600" />
                          </div>
                        )}

                        {/* Circular Node button */}
                        <button
                          data-node-id={session.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNodeClick(session);
                          }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-display font-bold transition-all duration-200 cursor-pointer ${getNodeBackground(
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
                            className="absolute bottom-full mb-4 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xl z-30 w-72 text-center animate-fade-in-up text-slate-800"
                          >
                            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 mx-auto flex items-center justify-center mb-3">
                              <span className="material-symbols-outlined text-[24px]">play_circle</span>
                            </div>
                            <h4 className="text-base font-display font-bold text-slate-900 m-0 leading-tight mb-1 text-center">
                              {session.title}
                            </h4>
                            <span className="text-xs font-semibold text-slate-500 block mb-4 text-center">
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
                                className="w-full py-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-display font-bold text-xs tracking-wider uppercase rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                              >
                                <span>BẮT ĐẦU</span>
                                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold">
                                  {session.status === SessionStatus.FINISH ? '+5 KN' : '+20 KN'}
                                </span>
                              </button>
                            </div>
                            {/* Tooltip arrow pointer */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-solid border-t-white border-x-transparent border-b-transparent drop-shadow-xs" />
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
                    <div className="w-full max-w-xl text-center my-6 py-2 border-b border-dashed border-slate-200 relative z-10">
                      <span className="bg-slate-50 px-4 text-xs font-display font-bold text-slate-500 tracking-wider uppercase rounded-full py-1 border border-slate-200">
                        PHẦN {partIdx + 1}: {part.title}
                      </span>
                    </div>

                    {/* Vòng Từ vựng */}
                    {vocabSessions.length > 0 && (
                      <div className="flex flex-col items-center w-full relative py-4">
                        {/* Đường ray dọc riêng của cụm Từ vựng */}
                        <div className="absolute top-4 bottom-4 w-2 bg-slate-200 rounded-full -z-10" />
                        {vocabSessions.map((session, localIdx) => renderSessionNode(session, localIdx, false))}
                      </div>
                    )}

                    {/* Dải phân cách nhẹ nhàng báo hiệu phần Ngữ pháp */}
                    {grammarSessions.length > 0 && (
                      <div className="w-full max-w-md my-8 flex items-center justify-center gap-3 relative z-10">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                        <div className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-display font-bold tracking-wider uppercase flex items-center gap-2 shadow-2xs">
                          <span className="material-symbols-outlined text-[16px]">magic_button</span>
                          <span>Ngữ pháp & Luyện tập</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-indigo-300 to-transparent" />
                      </div>
                    )}

                    {/* Vòng Ngữ pháp */}
                    {grammarSessions.length > 0 && (
                      <div className="flex flex-col items-center w-full relative py-4">
                        {/* Đường ray dọc riêng của cụm Ngữ pháp - tone tím nhạt nhẹ nhàng */}
                        <div className="absolute top-4 bottom-4 w-2 bg-indigo-100 rounded-full -z-10" />
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
