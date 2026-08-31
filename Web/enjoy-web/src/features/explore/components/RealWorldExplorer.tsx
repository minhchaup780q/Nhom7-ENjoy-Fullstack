import React, { useState, useEffect, useRef } from 'react';
import { exploreApi } from '../services/exploreApi';
// Thêm bbox vào kiểu dữ liệu (nếu chưa có)
export interface DetectionItem {
  class_name: string;
  confidence: number;
  bbox?: [number, number, number, number]; // Giả sử format: [x, y, width, height] (tỷ lệ 0 - 1)
}
import { Mascot } from '../../../components/ui/Mascot';

interface RealWorldExplorerProps {
  onBack: () => void;
}

const OBJECT_LABELS: Record<string, string> = {
  "pencil": "Bút chì",
  "pen": "Bút mực",
  "marker": "Bút lông",
  "highlighter": "Bút dạ quang",
  "eraser": "Gôm",
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

const CONFIDENCE_THRESHOLD = 0.75; // Ngưỡng độ tin cậy nhận diện vật thể (75%)

export const RealWorldExplorer: React.FC<RealWorldExplorerProps> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAutoScan, setIsAutoScan] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true); // State bật tắt ô vuông
  
  const [detectionResult, setDetectionResult] = useState<DetectionItem | null>(null);
  const [currentDetections, setCurrentDetections] = useState<DetectionItem[]>([]); // Lưu list để vẽ box
  
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let intervalId: any = null;
    if (isCameraActive && isAutoScan) {
      intervalId = setInterval(() => {
        if (!isDetecting) {
          captureAndDetect();
        }
      }, 1500); // Có thể giảm xuống 500-1000ms nếu muốn bắt mượt hơn
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraActive, isAutoScan, isDetecting]);

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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !isCameraActive) return;

    setIsDetecting(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Chụp toàn bộ khung hình thay vì crop để có thể lấy tọa độ bounding box chính xác
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas 2D context");
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsDetecting(false);
          return;
        }

        try {
          const res = await exploreApi.detectObject(blob);
          if (res.detections && res.detections.length > 0) {
            
            // Cập nhật toàn bộ các vật thể nhận được để vẽ ô vuông
            setCurrentDetections(res.detections);

            const bestDetection = res.detections.reduce((best, cur) => 
              cur.confidence > best.confidence ? cur : best
            , res.detections[0]);

            setDetectionResult(bestDetection);

            if (OBJECT_LABELS[bestDetection.class_name] && bestDetection.confidence > CONFIDENCE_THRESHOLD) {
              const itemKey = bestDetection.class_name;
              
              setFoundItems(prev => {
                if (!prev.includes(itemKey)) {
                  speakWord(itemKey);
                  return [...prev, itemKey];
                }
                return prev;
              });
            }
          } else {
            setDetectionResult(null);
            setCurrentDetections([]);
          }
        } catch (err) {
          console.error("Object detection request error:", err);
        } finally {
          setIsDetecting(false);
        }
      }, 'image/jpeg', 0.85);

    } catch (err) {
      console.error("Frame capture error:", err);
      setIsDetecting(false);
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col max-w-6xl mx-auto w-full select-none gap-6">
      <div className="flex items-center justify-between pb-2 border-b-2 border-border-main">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-display font-extrabold text-[#5c5c5c] hover:text-primary transition-colors hover:bg-bg-light rounded-xl border-2 border-transparent hover:border-border-main"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          QUAY LẠI
        </button>
        <div className="text-right">
          <h2 className="text-xl font-display font-extrabold text-[#2b2b2b] uppercase tracking-wide">
            Khám phá thế giới thực
          </h2>
          <p className="text-xs font-semibold text-text-muted">
            Quét đồ dùng học tập bằng camera để học từ vựng
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Target Items List (Giữ nguyên của bạn) */}
        <div className="lg:col-span-5 bg-white border-4 border-border-main rounded-3xl p-5 flex flex-col h-[calc(100vh-180px)] overflow-hidden">
          <div className="mb-4">
            <h3 className="text-base font-display font-extrabold text-[#2b2b2b] flex items-center justify-between">
              <span>ĐỒ DÙNG CẦN TÌM</span>
              <span className="px-3 py-1 bg-primary-soft text-primary rounded-full text-xs">
                Đã tìm thấy: {foundItems.length} / {Object.keys(OBJECT_LABELS).length}
              </span>
            </h3>
            <p className="text-xs font-semibold text-text-muted mt-1 leading-relaxed">
              Bé hãy cầm các đồ vật này và đưa vào khung hình camera nhé!
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-full">
            {Object.entries(OBJECT_LABELS).map(([key, label]) => {
              const isFound = foundItems.includes(key);
              return (
                <div 
                  key={key}
                  onClick={() => isFound && speakWord(key)}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-150 ${
                    isFound 
                      ? 'bg-[#f6ffed] border-[#b7eb8f] text-[#389e0d] cursor-pointer' 
                      : 'bg-white border-border-main text-[#5c5c5c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isFound ? 'bg-[#d9f7be]' : 'bg-[#f5f5f5]'
                    }`}>
                      {isFound ? (
                        <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Search className="w-4 h-4 text-text-muted" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-display font-extrabold">{label}</p>
                      <p className={`text-[11px] font-bold ${isFound ? 'text-[#52c41a]' : 'text-text-muted'}`}>
                        {key.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {isFound && (
                    <button className="p-2 bg-[#d9f7be] hover:bg-[#b7eb8f] rounded-xl transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Camera View Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-border-main aspect-[4/3] flex items-center justify-center">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />
            
            {/* Lớp phủ Bounding Boxes (Các ô vuông) */}
            {isCameraActive && showBoundingBoxes && currentDetections.map((det, idx) => {
              // Giả sử API trả về bbox dưới dạng [x, y, w, h] (tỷ lệ 0-1)
              // Chỉnh sửa theo format API thực tế của bạn tại mảng này
              const [x, y, w, h] = det.bbox || [0, 0, 0, 0];
              
              if (w === 0 && h === 0) return null; // API không hỗ trợ box
              
              const left = `${x * 100}%`;
              const top = `${y * 100}%`;
              const width = `${w * 100}%`;
              const height = `${h * 100}%`;
              const labelText = OBJECT_LABELS[det.class_name] || det.class_name;

              return (
                <div 
                  key={idx}
                  className="absolute border-[3px] border-[#52c41a] z-10 transition-all duration-300 pointer-events-none rounded-sm shadow-[0_0_8px_rgba(82,196,26,0.5)]"
                  style={{ left, top, width, height }}
                >
                  <span className="absolute -top-7 left-[-3px] bg-[#52c41a] text-white text-[11px] font-bold px-2 py-1 whitespace-nowrap rounded-t-md shadow-md flex items-center gap-1">
                    <BoxSelect className="w-3 h-3" />
                    {labelText} ({Math.round(det.confidence * 100)}%)
                  </span>
                </div>
              )
            })}

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

            {isCameraActive && (
              <div className="absolute top-4 left-4 right-[45%] bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white flex items-center gap-3 select-none z-20">
                {isDetecting ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ĐANG PHÂN TÍCH...
                  </div>
                ) : detectionResult && OBJECT_LABELS[detectionResult.class_name] && detectionResult.confidence > CONFIDENCE_THRESHOLD ? (
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-primary font-bold uppercase tracking-wider">Đã nhận diện:</div>
                    <div className="text-sm font-display font-extrabold text-white flex items-center gap-1.5">
                      {OBJECT_LABELS[detectionResult.class_name]}
                      <span className="text-xs text-[#52c41a] font-mono">({Math.round(detectionResult.confidence * 100)}%)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-white/50" />
                    Đang tìm đồ dùng học tập...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Camera Action Controls */}
          {isCameraActive && (
            <div className="bg-white border-4 border-border-main rounded-3xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={stopCamera}
                  className="px-5 py-3 bg-[#f5f5f5] hover:bg-[#e8e8e8] text-[#5c5c5c] font-display font-extrabold rounded-2xl text-xs uppercase tracking-wide border-2 border-border-main transition-colors"
                >
                  Tắt Camera
                </button>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="autoScanCheck"
                    checked={isAutoScan}
                    onChange={(e) => setIsAutoScan(e.target.checked)}
                    className="w-5 h-5 accent-primary border-2 border-border-main rounded cursor-pointer"
                  />
                  <label htmlFor="autoScanCheck" className="text-xs font-display font-extrabold text-[#5c5c5c] cursor-pointer uppercase select-none">
                    Tự động (1.5s)
                  </label>
                </div>
                
                {/* Toggle Bật/Tắt Ô Vuông */}
                <div className="flex items-center gap-2 border-l-2 border-border-main pl-4">
                  <input 
                    type="checkbox" 
                    id="showBBoxCheck"
                    checked={showBoundingBoxes}
                    onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                    className="w-5 h-5 accent-[#52c41a] border-2 border-border-main rounded cursor-pointer"
                  />
                  <label htmlFor="showBBoxCheck" className="text-xs font-display font-extrabold text-[#5c5c5c] cursor-pointer uppercase select-none">
                    Hiển thị ô nhận diện
                  </label>
                </div>
              </div>

              {!isAutoScan && (
                <button
                  onClick={captureAndDetect}
                  disabled={isDetecting}
                  className="px-6 py-3 bg-primary text-white font-display font-extrabold rounded-2xl text-xs uppercase tracking-wide border-b-4 border-primary-dark shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {isDetecting ? "Đang quét..." : "Quét Ngay"}
                </button>
              )}
            </div>
          )}

          <div className="bg-white border-4 border-border-main rounded-3xl p-4 flex items-center gap-4">
            <Mascot 
              expression={foundItems.length > 0 ? "happy" : "thinking"} 
              speechBubbleText={
                foundItems.length === 0 
                  ? "Bé ơi, hãy tìm một món đồ dùng học tập (ví dụ: bút chì hoặc thước kẻ) và đưa lên trước camera để Enjoy xem nhé!" 
                  : foundItems.length === Object.keys(OBJECT_LABELS).length
                  ? "Tuyệt vời! Bé đã xuất sắc tìm thấy đầy đủ tất cả đồ dùng học tập rồi! Bé giỏi quá đi!"
                  : `Bé đã tìm được ${foundItems.length} đồ dùng học tập rồi! Cố gắng tìm thêm các món khác nhé!`
              }
              size={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};