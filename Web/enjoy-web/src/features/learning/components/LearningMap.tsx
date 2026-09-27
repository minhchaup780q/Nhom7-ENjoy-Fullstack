import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { SessionStatus, SessionType } from '../types';
import type { Session, Topic } from '../types';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import mascotImg from '../../../assets/mascot.png';
import { 
  AcademicCapIcon, 
  TrophyIcon, 
  SparklesIcon, 
  StarIcon, 
  LockClosedIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  MicrophoneIcon,
  Bars3BottomLeftIcon,
  CursorArrowRaysIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

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
    selectLevel,
    selectTopic,
    selectSession,
    loading,
    error,
  } = useLearningStore();

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);


  
  // Trạng thái màn hình: 'levels' (Trình độ) | 'topics' (Chủ đề) | 'sessions' (Bản đồ bài học)
  const [currentView, setCurrentView] = useState<'levels' | 'topics' | 'sessions'>(() => {
    const state = useLearningStore.getState();
    if (state.activeTopic && state.parts && state.parts.length > 0) return 'sessions';
    if (state.activeLevel) return 'topics';
    return 'levels';
  });

  useEffect(() => {
    if (levels.length === 0) {
      fetchLevels();
    }
  }, [fetchLevels, levels.length]);

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
    useLearningStore.setState({ activeLevel: null, activeTopic: null });
    setCurrentView('levels');
  };

  // Quay lại màn hình Chủ đề
  const handleBackToTopics = () => {
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
      case SessionType.SPEAKING: Icon = MicrophoneIcon; break;
      case SessionType.RE_ORDER: Icon = Bars3BottomLeftIcon; break;
      case SessionType.DRAG_DROP: Icon = CursorArrowRaysIcon; break;
      case SessionType.GRAMMAR: Icon = BookOpenIcon; break;
      case SessionType.PRACTICE: Icon = ChatBubbleLeftRightIcon; break;
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

  // Map trạng thái bài học dựa trên userProgress cá nhân
  const allSessionsInTopic = rawSessionsInTopic.map((session, index) => {
    const prog = userProgress.find(p => p.session && p.session.id === session.id);
    let calculatedStatus = SessionStatus.LOCK;

    if (prog) {
      calculatedStatus = prog.status;
    } else {
      const prevSession = index > 0 ? rawSessionsInTopic[index - 1] : null;
      const prevProg = prevSession ? userProgress.find(p => p.session && p.session.id === prevSession.id) : null;
      const isPrevFinished = prevProg ? prevProg.status === SessionStatus.FINISH : false;

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
  const getTopicProgress = (topicId: number) => {
    // Đếm số bài học đã hoàn thành (FINISH) thuộc topic này trong userProgress
    const finishedCount = userProgress.filter(p => {
      if (p.status !== SessionStatus.FINISH) return false;
      if (p.session?.part?.topic?.id === topicId) return true;
      if (activeTopic?.id === topicId && parts.some(part => part.id === p.session?.part?.id)) return true;
      return false;
    }).length;

    // Tổng số bài học trong topic
    if (activeTopic && activeTopic.id === topicId && rawSessionsInTopic.length > 0) {
      return Math.min(100, Math.round((finishedCount / rawSessionsInTopic.length) * 100));
    }

    const topicObj = topics.find(t => t.id === topicId);
    const totalSessions = (topicObj?.parts && topicObj.parts.length > 0)
      ? topicObj.parts.reduce((sum, part) => sum + (part.sessions?.length || 5), 0)
      : 10;

    if (totalSessions === 0) return 0;
    return Math.min(100, Math.round((finishedCount / totalSessions) * 100));
  };

  const isTopicUnlocked = (topic: Topic, index: number) => {
    // Chủ đề đầu tiên (Chủ đề 1) luôn luôn được mở khóa mặc định
    if (index === 0) return true;

    // Nếu chủ đề này đã có bài học nào được UNLOCK hoặc FINISH trong userProgress -> Đã mở khóa
    const hasProgressInThisTopic = userProgress.some(
      p => p.session?.part?.topic?.id === topic.id && (p.status === SessionStatus.FINISH || p.status === SessionStatus.UNLOCK)
    );
    if (hasProgressInThisTopic) return true;

    // Hoặc nếu chủ đề liền trước đã hoàn thành (100%)
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
    <div className="flex-1 w-full mx-auto py-6 px-4 select-none pb-24">
      
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

                return (
                  <div
                    key={tpc.id}
                    className={`border-2 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_6px_0_0_#e5e5e5] transition-all relative ${
                      isUnlocked
                        ? 'bg-[#e5f5ff] border-[#84d8ff] text-text-main shadow-[0_6px_0_0_#84d8ff]'
                        : 'bg-[#f7f7f7] border-border-main text-text-muted shadow-[0_6px_0_0_#e5e5e5]'
                    }`}
                  >
                    {/* Left details & progress & action button */}
                    <div className="flex-grow text-left space-y-4 w-full">
                       <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-primary/70 tracking-widest uppercase block">Chủ đề {index + 1}</span>
                        <h3 className={`text-lg font-display font-extrabold ${isUnlocked ? 'text-[#0079b8]' : 'text-text-muted'}`}>
                          {tpc.title}
                        </h3>
                        <p className="text-xs font-semibold text-text-muted line-clamp-2">{tpc.description}</p>
                        {!isUnlocked && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted pt-1">
                            <LockClosedIcon className="w-3.5 h-3.5" /> CHƯA MỞ KHÓA
                          </span>
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
                            NHẢY TỚI CHỦ ĐỀ {index + 1}
                          </Button3D>
                        )}
                      </div>
                    </div>

                    {/* Right side mascot & inline bubble inside flex flow to avoid overlap */}
                    {isUnlocked && (
                      <div className="flex flex-col items-center flex-shrink-0 w-full md:w-auto">
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

          {/* Sessions Map Winding Road (Image 2) - EXPANSED to fit page, NO borders, NO bg-white, NO shadow */}
          {loading && allSessionsInTopic.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-4 min-h-[400px]">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-text-muted">Đang tải bài học của chủ đề...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 w-full relative min-h-[500px]">
              {currentParts.map((part, partIdx) => {
                const partSessions = allSessionsInTopic.filter(s => s.partId === part.id);
                
                const isGrammarSession = (session: Session) => {
                  return (
                    session.sessionType === SessionType.GRAMMAR ||
                    session.sessionType === SessionType.PRACTICE ||
                    (session.orderIndex !== undefined && session.orderIndex !== null && session.orderIndex >= 6) ||
                    (session.sessionIdx !== undefined && session.sessionIdx >= 5)
                  );
                };

                const vocabSessions = partSessions.filter(s => !isGrammarSession(s));
                const grammarSessions = partSessions.filter(s => isGrammarSession(s));

                const renderSessionNode = (session: typeof partSessions[0], localIdx: number, isGrammar: boolean) => {
                  const isSelected = selectedNodeId === session.id;
                  const isUnlocked = session.status === SessionStatus.UNLOCK;
                  const curveStyle = getCurveMargin(localIdx, isGrammar);
                  const palette = getSessionPalette(session.partIdx || 0);

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
                          onClick={() => handleNodeClick(session)}
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold transition-all duration-150 cursor-pointer ${getNodeBackground(
                            session,
                            isSelected
                          )}`}
                        >
                          {getSessionIcon(session)}
                        </button>

                        {/* Tooltip Dialog for starting session */}
                        {isSelected && (
                          <div className="absolute bottom-full mb-4 bg-white border-2 border-[#e5e5e5] rounded-[2rem] p-5 shadow-2xl z-20 w-72 text-center animate-fade-in-up">
                            <span className={`text-[10px] font-extrabold tracking-widest uppercase block mb-1 ${palette.textClass}`}>
                              Vòng {session.sessionIdx + 1}: {session.sessionType === SessionType.PRACTICE ? 'Practice' : session.sessionType}
                            </span>
                            <h4 className="text-sm font-display font-extrabold text-text-main m-0 leading-tight">
                              {session.title}
                            </h4>

                            <p className="text-[11px] font-semibold text-text-main/60 leading-relaxed mb-4">
                              {session.description}
                            </p>
                            <div className="flex gap-2">
                              <Button3D
                                variant={palette.btnVariant}
                                fullWidth
                                size="sm"
                                onClick={() => onStartSession(session)}
                              >
                                BẮT ĐẦU
                              </Button3D>
                              <button
                                onClick={() => setSelectedNodeId(null)}
                                className="px-3 border-2 border-border-main rounded-xl hover:bg-bg-light text-xs font-bold text-text-main cursor-pointer"
                              >
                                Đóng
                              </button>
                            </div>
                            {/* Tooltip arrow pointer */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[10px] border-solid border-t-white border-x-transparent border-b-transparent" />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[11px] border-solid border-t-[#e5e5e5] border-x-transparent border-b-transparent -z-10" />
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

                    {/* Dải phân cách nhẹ nhàng */}
                    {vocabSessions.length > 0 && grammarSessions.length > 0 && (
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
    </div>
  );
};
