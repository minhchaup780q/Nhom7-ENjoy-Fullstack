import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  CameraOff, 
  RefreshCw, 
  CheckCircle, 
  Volume2, 
  BoxSelect, 
  Clock, 
  FastForward, 
  Play, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  XCircle,
  Award
} from 'lucide-react';
import { exploreApi } from '../services/exploreApi';
import { Mascot } from '../../../components/ui/Mascot';

export interface DetectionItem {
  class_name: string;
  confidence: number;
  bbox?: [number, number, number, number]; // [x, y, width, height] normalized (0 - 1)
}

interface RealWorldExplorerProps {
  onBack: () => void;
}

const OBJECT_LABELS: Record<string, string> = {
  "pencil": "Bút chì",
  "pen": "Bút mực",
  "marker": "Bút lông",
  "highlighter": "Bút dạ quang",
  "eraser": "Gôm tẩy",
  "pencil_sharpener": "Gọt bút chì",
  "ruler": "Thước kẻ",
  "compass": "Com-pa",
  "scissors": "Kéo",
  "book": "Cuốn sách",
  "pencil_case": "Hộp đựng bút",
  "backpack": "Ba lô",
  "mini_whiteboard": "Bảng trắng mini",
  "binder_clip": "Kẹp bướm",
  "board_eraser": "Đồ lau bảng",
  "chalk": "Phấn",
  "tape": "Băng keo",
  "ink_pad": "Hộp mực dấu",
  "stapler": "Đồ bấm kim",
  "staple": "Kim bấm"
};

const SUCCESS_CONFIDENCE_THRESHOLD = 0.65; // Ngưỡng độ tin cậy để tính điểm thành công (65%)
const ITEM_TIME_LIMIT = 120; // 2 phút mỗi vật phẩm (120 giây)
const TOTAL_QUEST_ITEMS = 5; // Số vật phẩm mỗi lượt chơi

export type QuestItemStatus = 'pending' | 'found' | 'skipped' | 'timeout';

export interface QuestItem {
  key: string;
  nameVi: string;
  nameEn: string;
  status: QuestItemStatus;
  foundTime?: number; // Thời gian đã dùng để tìm (giây)
}

export const RealWorldExplorer: React.FC<RealWorldExplorerProps> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Game states: 'START' | 'PLAYING' | 'RESULT'
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
  const [questList, setQuestList] = useState<QuestItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ITEM_TIME_LIMIT);
  const [isSuccessTransition, setIsSuccessTransition] = useState<boolean>(false);

  // Camera & Detection states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAutoScan, setIsAutoScan] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [currentDetections, setCurrentDetections] = useState<DetectionItem[]>([]);
  const [detectionResult, setDetectionResult] = useState<DetectionItem | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Refs to avoid stale closures in intervals & asynchronous detection
  const isDetectingRef = useRef(false);
  const questListRef = useRef<QuestItem[]>(questList);
  questListRef.current = questList;
  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;
  const timeLeftRef = useRef<number>(timeLeft);
  timeLeftRef.current = timeLeft;
  const isSuccessTransitionRef = useRef<boolean>(isSuccessTransition);
  isSuccessTransitionRef.current = isSuccessTransition;

  // Hàm phát âm từ vựng tiếng Anh
  const speakWord = useCallback((word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanWord = word.replace(/_/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Khởi tạo lượt chơi ngẫu nhiên 5 món
  const initNewGame = useCallback(() => {
    const allKeys = Object.keys(OBJECT_LABELS);
    const shuffled = [...allKeys].sort(() => 0.5 - Math.random());
    const selectedKeys = shuffled.slice(0, TOTAL_QUEST_ITEMS);

    const newQuests: QuestItem[] = selectedKeys.map(key => ({
      key,
      nameVi: OBJECT_LABELS[key],
      nameEn: key.replace(/_/g, ' ').toUpperCase(),
      status: 'pending'
    }));

    setQuestList(newQuests);
    setCurrentIndex(0);
    setTimeLeft(ITEM_TIME_LIMIT);
    setIsSuccessTransition(false);
    isSuccessTransitionRef.current = false;
    setDetectionResult(null);
    setCurrentDetections([]);
    setGameState('PLAYING');
  }, []);

  // Bật camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        }
      });
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      }
    } catch (err) {
      console.error("Error opening camera:", err);
      setCameraError("Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt.");
      setIsCameraActive(false);
    }
  };

  // Tắt camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  // Quản lý bật/tắt camera theo gameState
  useEffect(() => {
    if (gameState === 'PLAYING') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [gameState, stopCamera]);

  // Chuyển sang món tiếp theo hoặc kết thúc game
  const moveToNextItem = useCallback((updatedQuests: QuestItem[], nextIdx: number) => {
    if (nextIdx >= TOTAL_QUEST_ITEMS) {
      setQuestList(updatedQuests);
      setGameState('RESULT');
      setIsSuccessTransition(false);
      isSuccessTransitionRef.current = false;
    } else {
      setQuestList(updatedQuests);
      setCurrentIndex(nextIdx);
      setTimeLeft(ITEM_TIME_LIMIT);
      setIsSuccessTransition(false);
      isSuccessTransitionRef.current = false;
      setDetectionResult(null);
      setCurrentDetections([]);
    }
  }, []);

  // Xử lý khi nhấn nút BỎ QUA (Skip)
  const handleSkipCurrentItem = () => {
    if (gameState !== 'PLAYING' || isSuccessTransitionRef.current) return;
    
    const updated = [...questListRef.current];
    updated[currentIndexRef.current] = {
      ...updated[currentIndexRef.current],
      status: 'skipped'
    };
    moveToNextItem(updated, currentIndexRef.current + 1);
  };

  // Đếm ngược thời gian mỗi món (2 phút = 120s)
  useEffect(() => {
    if (gameState !== 'PLAYING' || isSuccessTransition) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          const updated = [...questListRef.current];
          if (updated[currentIndexRef.current]) {
            updated[currentIndexRef.current] = {
              ...updated[currentIndexRef.current],
              status: 'timeout'
            };
          }
          moveToNextItem(updated, currentIndexRef.current + 1);
          return ITEM_TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, isSuccessTransition, moveToNextItem]);

  // Xử lý chụp ảnh và gọi AI nhận diện (Sử dụng Refs để tránh stale closures)
  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !isCameraActive || isDetectingRef.current || isSuccessTransitionRef.current) return;
    if (videoRef.current.readyState < 2) return; // Chưa sẵn sàng khung hình

    const currentTarget = questListRef.current[currentIndexRef.current];
    if (!currentTarget) return;

    isDetectingRef.current = true;
    setIsDetecting(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      await new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve();
            return;
          }

          try {
            const res = await exploreApi.detectObject(blob);
            if (res && res.detections && res.detections.length > 0) {
              // CẬP NHẬT TẤT CẢ VẬT THỂ ĐƯỢC NHẬN DIỆN ĐỂ VẼ KHUNG
              setCurrentDetections(res.detections);

              const bestDetection = res.detections.reduce((best, cur) => 
                cur.confidence > best.confidence ? cur : best
              , res.detections[0]);

              setDetectionResult(bestDetection);

              // KIỂM TRA XEM CÓ VẬT THỂ NÀO TRÙNG VỚI MỤC TIÊU HIỆN TẠI KHÔNG
              const matchedTargetDetection = res.detections.find(
                det => det.class_name === currentTarget.key && det.confidence >= SUCCESS_CONFIDENCE_THRESHOLD
              );

              if (matchedTargetDetection && !isSuccessTransitionRef.current) {
                isSuccessTransitionRef.current = true;
                setIsSuccessTransition(true);
                speakWord(currentTarget.key);

                const timeSpent = ITEM_TIME_LIMIT - timeLeftRef.current;
                const updated = [...questListRef.current];
                updated[currentIndexRef.current] = {
                  ...updated[currentIndexRef.current],
                  status: 'found',
                  foundTime: Math.max(1, timeSpent)
                };
                setQuestList(updated);

                setTimeout(() => {
                  moveToNextItem(updated, currentIndexRef.current + 1);
                }, 1800);
              }
            } else {
              setDetectionResult(null);
              setCurrentDetections([]);
            }
          } catch (err) {
            console.error("Object detection request error:", err);
          } finally {
            resolve();
          }
        }, 'image/jpeg', 0.85);
      });

    } catch (err) {
      console.error("Frame capture error:", err);
    } finally {
      isDetectingRef.current = false;
      setIsDetecting(false);
    }
  }, [isCameraActive, speakWord, moveToNextItem]);

  // Quét tự động mỗi 1.2s - Sử dụng pattern Ref để timer luôn đều đặn không bị reset mỗi giây
  const captureAndDetectRef = useRef(captureAndDetect);
  captureAndDetectRef.current = captureAndDetect;

  useEffect(() => {
    if (gameState !== 'PLAYING' || !isCameraActive || !isAutoScan || isSuccessTransition) return;

    const intervalId = setInterval(() => {
      captureAndDetectRef.current();
    }, 1200);

    return () => clearInterval(intervalId);
  }, [gameState, isCameraActive, isAutoScan, isSuccessTransition]);

  // Format giây thành mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTarget = questList[currentIndex];
  const foundCount = questList.filter(item => item.status === 'found').length;

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col max-w-6xl mx-auto w-full select-none gap-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-border-main">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-display font-extrabold text-[#5c5c5c] hover:text-primary transition-colors hover:bg-bg-light rounded-xl border-2 border-transparent hover:border-border-main"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          QUAY LẠI
        </button>
        <div className="text-right">
          <h2 className="text-xl font-display font-extrabold text-[#2b2b2b] uppercase tracking-wide flex items-center gap-2 justify-end">
            <Sparkles className="w-5 h-5 text-primary" />
            Khám phá thế giới thực
          </h2>
          <p className="text-xs font-semibold text-text-muted">
            Quét đồ vật xung quanh bằng camera để học từ vựng
          </p>
        </div>
      </div>

      {/* ==================== MÀN HÌNH 1: BẮT ĐẦU (START) ==================== */}
      {gameState === 'START' && (
        <div className="bg-white border-4 border-border-main rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm flex flex-col items-center gap-6 my-auto">
          <div className="w-20 h-20 bg-primary-soft rounded-3xl flex items-center justify-center text-primary shadow-inner">
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-display font-black text-[#2b2b2b] uppercase tracking-wide">
              Thử Thách Thám Tử Nhí
            </h1>
            <p className="text-sm font-semibold text-text-muted max-w-md mx-auto leading-relaxed">
              Mỗi lượt chơi, Enjoy sẽ đưa ra ngẫu nhiên <strong className="text-primary font-bold">5 đồ dùng học tập</strong> để bé đi tìm trong thế giới thực!
            </p>
          </div>

          <div className="bg-[#f8f9fa] border-2 border-border-main rounded-2xl p-4 w-full text-left space-y-2.5 text-xs font-semibold text-[#5c5c5c]">
            <div className="flex items-center gap-2 text-sm font-display font-extrabold text-[#2b2b2b]">
              <Sparkles className="w-4 h-4 text-primary" />
              LUẬT CHƠI DÀNH CHO BÉ:
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black">1</span>
              <span>Hệ thống chọn ngẫu nhiên 5 món đồ dùng học tập.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black">2</span>
              <span>Mỗi món đồ có <strong>2 phút (120 giây)</strong> để tìm và giơ trước camera.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black">3</span>
              <span>Nếu không tìm thấy, bé có thể bấm <strong>"Bỏ qua"</strong> để sang món tiếp theo.</span>
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-4 pt-2">
            <Mascot 
              expression="happy" 
              speechBubbleText="Bé đã sẵn sàng khám phá cùng Enjoy chưa? Bấm Bắt đầu ngay nhé!"
              size={90}
            />
          </div>

          <button
            onClick={initNewGame}
            className="w-full max-w-xs py-4 bg-primary hover:bg-primary-dark text-white font-display font-black rounded-2xl text-base uppercase tracking-wider border-b-4 border-primary-dark shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            BẮT ĐẦU KHÁM PHÁ
          </button>
        </div>
      )}

      {/* ==================== MÀN HÌNH 2: ĐANG CHƠI (PLAYING) ==================== */}
      {gameState === 'PLAYING' && currentTarget && (
        <div className="flex flex-col gap-6">
          {/* Top Progress Tracker */}
          <div className="bg-white border-4 border-border-main rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-display font-black text-[#5c5c5c] uppercase">Tiến trình:</span>
              <div className="flex items-center gap-2 flex-1">
                {questList.map((item, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <div 
                      key={idx}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-display text-xs font-black transition-all ${
                        item.status === 'found'
                          ? 'bg-[#f6ffed] border-[#b7eb8f] text-[#389e0d]'
                          : item.status === 'skipped'
                          ? 'bg-[#fff7e6] border-[#ffd591] text-[#d46b08]'
                          : item.status === 'timeout'
                          ? 'bg-[#fff1f0] border-[#ffa39e] text-[#cf1322]'
                          : isCurrent
                          ? 'bg-primary-soft border-primary text-primary ring-2 ring-primary/20 scale-105'
                          : 'bg-[#f5f5f5] border-border-main text-text-muted opacity-60'
                      }`}
                    >
                      {item.status === 'found' && <CheckCircle className="w-3.5 h-3.5" />}
                      {item.status === 'skipped' && <FastForward className="w-3.5 h-3.5" />}
                      {item.status === 'timeout' && <XCircle className="w-3.5 h-3.5" />}
                      {item.status === 'pending' && <span>{idx + 1}</span>}
                      <span>Món {idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timer Counter */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-mono font-black text-base ${
              timeLeft <= 20 
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' 
                : timeLeft <= 60 
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-primary-soft border-primary/30 text-primary'
            }`}>
              <Clock className="w-4 h-4 stroke-[2.5]" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Side: Current Quest Target Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border-4 border-border-main rounded-3xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-display font-black uppercase tracking-wider">
                    MỤC TIÊU {currentIndex + 1} / {TOTAL_QUEST_ITEMS}
                  </span>
                  <button
                    onClick={() => speakWord(currentTarget.key)}
                    className="p-2 bg-primary-soft hover:bg-primary/20 text-primary rounded-xl transition-colors flex items-center gap-1.5 text-xs font-display font-bold"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe</span>
                  </button>
                </div>

                <div className="space-y-1 mb-6 text-center py-4 bg-[#fafafa] rounded-2xl border-2 border-border-main">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Hãy tìm món đồ:</p>
                  <h3 className="text-3xl font-display font-black text-[#2b2b2b] tracking-wide">
                    {currentTarget.nameVi}
                  </h3>
                  <p className="text-base font-mono font-black text-primary uppercase">
                    {currentTarget.nameEn}
                  </p>
                </div>

                <p className="text-xs font-semibold text-text-muted text-center mb-6 leading-relaxed">
                  Bé hãy lấy <strong className="text-[#2b2b2b]">{currentTarget.nameVi}</strong> và đưa vào giữa khung hình camera để Enjoy nhận diện nhé!
                </p>

                {/* Skip Button */}
                <button
                  onClick={handleSkipCurrentItem}
                  disabled={isSuccessTransition}
                  className="w-full py-3 bg-[#fff7e6] hover:bg-[#ffe7ba] text-[#d46b08] font-display font-black rounded-2xl text-xs uppercase tracking-wide border-2 border-[#ffd591] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FastForward className="w-4 h-4" />
                  BỎ QUA MÓN NÀY (KHÔNG TÍNH ĐIỂM)
                </button>
              </div>

              {/* Mascot Assistant Feedback */}
              <div className="bg-white border-4 border-border-main rounded-3xl p-4 flex items-center gap-4">
                <Mascot 
                  expression={isSuccessTransition ? "happy" : timeLeft <= 20 ? "surprised" : "thinking"} 
                  speechBubbleText={
                    isSuccessTransition 
                      ? `Tuyệt vời! Bé đã tìm đúng ${currentTarget.nameVi} (${currentTarget.nameEn}) rồi!` 
                      : timeLeft <= 20
                      ? `Sắp hết 2 phút rồi bé ơi! Mau đưa ${currentTarget.nameVi} lên camera nào!`
                      : detectionResult && detectionResult.class_name !== currentTarget.key
                      ? `Enjoy nhìn thấy "${OBJECT_LABELS[detectionResult.class_name] || detectionResult.class_name}" rồi! Hãy tìm "${currentTarget.nameVi}" bé nhé!`
                      : `Bé ơi, cùng đi tìm "${currentTarget.nameVi}" nhé! Cố lên nào!`
                  }
                  size={85}
                />
              </div>
            </div>

            {/* Right Side: Camera View & AI Scanner */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-border-main aspect-[4/3] flex items-center justify-center shadow-md">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                />

                {/* Lớp phủ Bounding Boxes (VẼ TẤT CẢ VẬT THỂ NHẬN DIỆN ĐƯỢC) */}
                {isCameraActive && showBoundingBoxes && currentDetections.map((det, idx) => {
                  const [x, y, w, h] = det.bbox || [0, 0, 0, 0];
                  if (w === 0 && h === 0) return null;
                  
                  const isMatchTarget = det.class_name === currentTarget.key;
                  const labelText = OBJECT_LABELS[det.class_name] || det.class_name;

                  return (
                    <div 
                      key={idx}
                      className={`absolute border-[3px] z-10 transition-all duration-200 pointer-events-none rounded-sm ${
                        isMatchTarget 
                          ? 'border-[#52c41a] shadow-[0_0_15px_rgba(82,196,26,0.9)] scale-[1.01]' 
                          : 'border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      }`}
                      style={{ 
                        left: `${x * 100}%`, 
                        top: `${y * 100}%`, 
                        width: `${w * 100}%`, 
                        height: `${h * 100}%` 
                      }}
                    >
                      <span className={`absolute -top-7 left-[-3px] text-white text-[11px] font-bold px-2 py-0.5 whitespace-nowrap rounded-t-md shadow-md flex items-center gap-1 ${
                        isMatchTarget ? 'bg-[#52c41a]' : 'bg-amber-500'
                      }`}>
                        <BoxSelect className="w-3 h-3" />
                        {isMatchTarget ? `🎯 ${labelText}` : labelText} ({Math.round(det.confidence * 100)}%)
                      </span>
                    </div>
                  );
                })}

                {/* Success Animation Overlay */}
                {isSuccessTransition && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-[#52c41a] rounded-full flex items-center justify-center text-white mb-2 shadow-lg animate-bounce">
                      <CheckCircle className="w-10 h-10 stroke-[3]" />
                    </div>
                    <h4 className="text-2xl font-display font-black uppercase text-[#52c41a]">
                      CHÍNH XÁC!
                    </h4>
                    <p className="text-base font-bold font-mono text-white/90">
                      {currentTarget.nameEn} - {currentTarget.nameVi}
                    </p>
                  </div>
                )}

                {/* Camera Inactive Overlay */}
                {!isCameraActive && (
                  <div className="text-center p-6 space-y-4 absolute inset-0 flex flex-col justify-center items-center bg-[#0d0d0d]">
                    <CameraOff className="w-16 h-16 text-[#5c5c5c] mx-auto animate-pulse" />
                    <p className="text-sm font-semibold text-text-muted">
                      {cameraError || "Camera chưa được bật"}
                    </p>
                    <button 
                      onClick={startCamera}
                      className="px-6 py-3 bg-primary text-white font-display font-extrabold rounded-2xl text-xs uppercase tracking-wide border-b-4 border-primary-dark shadow-md"
                    >
                      Bật Camera
                    </button>
                  </div>
                )}

                {/* Scanner Status Badge */}
                {isCameraActive && (
                  <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-md bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white flex items-center gap-3 select-none z-20">
                    {isDetecting ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ĐANG PHÂN TÍCH...
                      </div>
                    ) : detectionResult && OBJECT_LABELS[detectionResult.class_name] ? (
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider flex items-center gap-2">
                          <span>Đang thấy:</span>
                          {detectionResult.class_name === currentTarget.key ? (
                            <span className="text-[#52c41a] font-black">KHỚP MỤC TIÊU!</span>
                          ) : (
                            <span className="text-amber-300 font-medium">Chưa đúng món cần tìm</span>
                          )}
                        </div>
                        <div className="text-sm font-display font-extrabold text-white flex items-center gap-1.5">
                          {OBJECT_LABELS[detectionResult.class_name]}
                          <span className={`text-xs font-mono ${detectionResult.class_name === currentTarget.key ? 'text-[#52c41a]' : 'text-amber-400'}`}>
                            ({Math.round(detectionResult.confidence * 100)}%)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                        Đang quét đồ vật trước camera...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {isCameraActive && (
                <div className="bg-white border-4 border-border-main rounded-3xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="autoScanCheck"
                        checked={isAutoScan}
                        onChange={(e) => setIsAutoScan(e.target.checked)}
                        className="w-4 h-4 accent-primary border-2 border-border-main rounded cursor-pointer"
                      />
                      <label htmlFor="autoScanCheck" className="text-xs font-display font-extrabold text-[#5c5c5c] cursor-pointer uppercase select-none">
                        Tự động quét (1.2s)
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2 border-l-2 border-border-main pl-4">
                      <input 
                        type="checkbox" 
                        id="showBBoxCheck"
                        checked={showBoundingBoxes}
                        onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                        className="w-4 h-4 accent-[#52c41a] border-2 border-border-main rounded cursor-pointer"
                      />
                      <label htmlFor="showBBoxCheck" className="text-xs font-display font-extrabold text-[#5c5c5c] cursor-pointer uppercase select-none">
                        Hiện khung nhận diện
                      </label>
                    </div>
                  </div>

                  {!isAutoScan && (
                    <button
                      onClick={captureAndDetect}
                      disabled={isDetecting || isSuccessTransition}
                      className="px-5 py-2.5 bg-primary text-white font-display font-extrabold rounded-2xl text-xs uppercase tracking-wide border-b-4 border-primary-dark shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      {isDetecting ? "Đang quét..." : "Quét Ngay"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MÀN HÌNH 3: TỔNG KẾT (RESULT) ==================== */}
      {gameState === 'RESULT' && (
        <div className="bg-white border-4 border-border-main rounded-3xl p-6 md:p-10 max-w-3xl mx-auto w-full shadow-sm space-y-8 my-auto">
          {/* Header Summary Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 bg-primary-soft text-primary rounded-3xl shadow-inner mb-2">
              <Award className="w-12 h-12 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-[#2b2b2b] uppercase tracking-wide">
              Tổng Kết Cuộc Khám Phá!
            </h2>
            <p className="text-sm font-semibold text-text-muted">
              Bé đã xuất sắc hoàn thành thử thách tìm kiếm 5 đồ vật!
            </p>
          </div>

          {/* Score Stat Box */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-[#f6ffed] border-2 border-[#b7eb8f] rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-[#389e0d] uppercase">Tìm Thấy</p>
              <p className="text-3xl font-display font-black text-[#389e0d] mt-1">
                {foundCount} / {TOTAL_QUEST_ITEMS}
              </p>
            </div>
            <div className="bg-primary-soft border-2 border-primary/30 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-primary uppercase">Tỷ Lệ Đạt</p>
              <p className="text-3xl font-display font-black text-primary mt-1">
                {Math.round((foundCount / TOTAL_QUEST_ITEMS) * 100)}%
              </p>
            </div>
          </div>

          {/* 5-Item Details List */}
          <div className="space-y-2.5 max-w-xl mx-auto">
            <h4 className="text-xs font-display font-black text-[#5c5c5c] uppercase px-1">
              Danh sách từ vựng trong lượt chơi:
            </h4>
            {questList.map((item, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                  item.status === 'found'
                    ? 'bg-[#f6ffed] border-[#b7eb8f]'
                    : item.status === 'skipped'
                    ? 'bg-[#fff7e6] border-[#ffd591]'
                    : 'bg-[#fff1f0] border-[#ffa39e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    item.status === 'found'
                      ? 'bg-[#d9f7be] text-[#389e0d]'
                      : item.status === 'skipped'
                      ? 'bg-[#ffe7ba] text-[#d46b08]'
                      : 'bg-[#ffccc7] text-[#cf1322]'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-display font-extrabold text-[#2b2b2b]">{item.nameVi}</p>
                    <p className="text-xs font-mono font-bold text-text-muted">{item.nameEn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-display font-black px-2.5 py-1 rounded-full ${
                    item.status === 'found'
                      ? 'bg-[#d9f7be] text-[#389e0d]'
                      : item.status === 'skipped'
                      ? 'bg-[#ffe7ba] text-[#d46b08]'
                      : 'bg-[#ffccc7] text-[#cf1322]'
                  }`}>
                    {item.status === 'found' && 'ĐÃ TÌM THẤY'}
                    {item.status === 'skipped' && 'ĐÃ BỎ QUA'}
                    {item.status === 'timeout' && 'HẾT GIỜ'}
                  </span>

                  <button 
                    onClick={() => speakWord(item.key)}
                    className="p-2 bg-white hover:bg-bg-light rounded-xl border border-border-main text-[#5c5c5c] hover:text-primary transition-colors"
                    title="Nghe lại phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mascot Remark */}
          <div className="max-w-xl mx-auto flex items-center justify-center">
            <Mascot 
              expression={foundCount >= 4 ? "happy" : foundCount >= 2 ? "surprised" : "thinking"} 
              speechBubbleText={
                foundCount === 5 
                  ? "Xuất sắc tuyệt đối! Bé chính là siêu thám tử nhí của ENjoy!" 
                  : foundCount >= 3 
                  ? `Bé đã tìm được ${foundCount}/5 đồ vật! Bé giỏi lắm, tiếp tục phát huy nhé!`
                  : `Lần này bé tìm được ${foundCount} đồ vật. Hãy chơi lại để đạt 5/5 nhé!`
              }
              size={90}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto">
            <button
              onClick={initNewGame}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-display font-black rounded-2xl text-xs uppercase tracking-wider border-b-4 border-primary-dark shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              CHƠI LƯỢT MỚI (5 MÓN MỚI)
            </button>
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-[#f5f5f5] hover:bg-[#e8e8e8] text-[#5c5c5c] font-display font-extrabold rounded-2xl text-xs uppercase tracking-wider border-2 border-border-main transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              VỀ TRANG KHÁM PHÁ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};