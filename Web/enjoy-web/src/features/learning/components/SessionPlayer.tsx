import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import type { Session, SessionItem } from '../types';
import { Mascot } from '../../../components/ui/Mascot';
import { Button3D } from '../../../components/ui/Button3D';
import { X, Heart, AlertTriangle, CheckCircle, Volume2 } from 'lucide-react';
import { BASE_URL } from '../../../services/apiClient';

interface SessionPlayerProps {
  session: Session;
  onClose: () => void;
}

// Bổ sung kiểu mở rộng cho SessionItem trong lúc chạy tương tác
interface InteractiveItem extends SessionItem {
  options?: string[];
  correctAnswer?: string;
}

export const SessionPlayer: React.FC<SessionPlayerProps> = ({ session, onClose }) => {
  const {
    sessionItems,
    currentStepIndex,
    selectSession,
    nextStep,
    prevStep,
    resetSessionState,
    completeSession,
    loading,
  } = useLearningStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

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

  // Tạo danh sách câu hỏi mẫu phòng khi dữ liệu database rỗng (Offline Mode)
  const mockItems: InteractiveItem[] = [
    {
      id: 2001,
      contentText: 'Dog',
      translation: 'Con chó',
      itemType: 'INTRODUCTION',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://dict.youdao.com/dictvoice?audio=dog&type=2',
    },
    {
      id: 2002,
      contentText: 'Cat',
      translation: 'Con mèo',
      itemType: 'INTRODUCTION',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://dict.youdao.com/dictvoice?audio=cat&type=2',
    },
    {
      id: 2003,
      contentText: 'Elephant',
      translation: 'Con voi',
      itemType: 'INTRODUCTION',
      imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://dict.youdao.com/dictvoice?audio=elephant&type=2',
    },
    {
      id: 2004,
      contentText: 'Lion',
      translation: 'Sư tử',
      itemType: 'INTRODUCTION',
      imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://dict.youdao.com/dictvoice?audio=lion&type=2',
    },
    {
      id: 2005,
      contentText: 'Monkey',
      translation: 'Con khỉ',
      itemType: 'INTRODUCTION',
      imageUrl: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://dict.youdao.com/dictvoice?audio=monkey&type=2',
    },
  ];

  const currentItems = sessionItems.length > 0 ? (sessionItems as InteractiveItem[]) : mockItems;
  const currentItem = currentItems[currentStepIndex];
  const progressPercent = currentItems.length > 0 
    ? ((currentStepIndex) / currentItems.length) * 100 
    : 0;

  // Phát âm thanh tự động khi câu hỏi hoặc từ vựng thay đổi
  useEffect(() => {
    if (!currentItem) return;
    
    // Tìm URL âm thanh
    const audioUrl = currentItem.audioUrl;
    if (!audioUrl) return;

    const fullAudioUrl = getAssetUrl(audioUrl);
    
    // Stop any previous audio
    if (currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
    }

    // Tạo đối tượng âm thanh mới
    const audio = new Audio(fullAudioUrl);
    setCurrentAudio(audio);

    // Auto-play âm thanh sau khi chuyển từ (chỉ áp dụng ở chế độ INTRODUCTION)
    const playTimeout = setTimeout(() => {
      audio.play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(err => {
          console.warn("Không thể tự động phát âm thanh:", err);
        });
    }, 500);

    // Lắng nghe khi phát xong
    audio.onended = () => {
      setIsPlayingAudio(false);
    };

    // Cleanup khi chuyển câu hỏi
    return () => {
      clearTimeout(playTimeout);
      audio.pause();
    };
  }, [currentStepIndex, currentItem?.id]);

  const playSound = () => {
    if (!currentItem || !currentItem.audioUrl) return;

    const fullAudioUrl = getAssetUrl(currentItem.audioUrl);

    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(fullAudioUrl);
    setCurrentAudio(audio);
    setIsPlayingAudio(true);

    audio.play()
      .then(() => {
        setIsPlayingAudio(true);
      })
      .catch(err => {
        console.error("Lỗi phát âm thanh:", err);
        setIsPlayingAudio(false);
      });

    audio.onended = () => {
      setIsPlayingAudio(false);
    };
  };

  const handleSelectOption = (option: string) => {
    if (isChecked) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!currentItem) return;

    // Trường hợp INTRODUCTION: Bấm là qua luôn không cần check đáp án đúng sai
    if (session.sessionType === 'INTRODUCTION') {
      setIsCorrect(true);
      setIsChecked(true);
      return;
    }

    const answer = currentItem.correctAnswer || currentItem.translation || '';
    const correct = selectedOption === answer;
    
    setIsCorrect(correct);
    setIsChecked(true);

    if (!correct) {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleContinue = () => {
    // Reset state câu hỏi cũ
    setSelectedOption(null);
    setIsChecked(false);

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
    await completeSession(session.id);
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
      <header className="max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between gap-6">
        <button
          onClick={() => setShowExitModal(true)}
          className="text-text-muted hover:text-text-main transition-colors cursor-pointer"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
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
          <Heart className="w-6 h-6 fill-current stroke-[2.5]" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Core Question Area */}
      <main className="max-w-2xl w-full mx-auto px-6 py-8 flex-1 flex flex-col justify-center space-y-8">
        
        {/* Render Title/Task */}
        <div className="text-left space-y-1">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
            {session.sessionType === 'INTRODUCTION' ? 'Giới thiệu từ mới' : 'Chọn đáp án chính xác'}
          </span>
          <h2 className="text-2xl font-display font-extrabold text-text-main m-0 leading-tight">
            {session.sessionType === 'INTRODUCTION' 
              ? 'Làm quen và phát âm từ mới nhé!' 
              : 'Nghĩa của từ/câu sau đây là gì?'}
          </h2>
        </div>

        {session.sessionType === 'INTRODUCTION' ? (
          <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
            {/* Flashcard container */}
            <div className="w-full max-w-sm bg-white border-2 border-border-main rounded-[2.5rem] shadow-[0_8px_0_0_#e5e5e5] p-6 flex flex-col items-center space-y-6 hover:translate-y-[-2px] hover:shadow-[0_10px_0_0_#e5e5e5] transition-all duration-150 relative overflow-hidden group">
              
              {/* Image Frame */}
              {currentItem.imageUrl ? (
                <div className="w-full h-48 bg-bg-light border-2 border-border-main/50 rounded-3xl overflow-hidden relative flex items-center justify-center">
                  <img
                    src={getAssetUrl(currentItem.imageUrl)}
                    alt={currentItem.contentText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="flex items-center justify-center gap-4">
                  <h3 className="text-4xl font-display font-extrabold text-text-main tracking-wide">
                    {currentItem.contentText}
                  </h3>
                  
                  {/* Speaker Button */}
                  <button
                    onClick={playSound}
                    className={`btn-3d w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'btn-3d-pink scale-110 animate-pulse'
                        : 'btn-3d-blue hover:scale-105'
                    }`}
                  >
                    <Volume2 className={`w-7 h-7 text-white ${isPlayingAudio ? 'animate-bounce-soft' : ''}`} />
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

            {/* Mascot cheering below the card */}
            <div className="flex items-center gap-4 py-2">
              <Mascot
                expression={isPlayingAudio ? 'happy' : 'thinking'}
                speechBubbleText="Bé hãy ấn nút loa để nghe và đọc to theo nhé!"
                bubblePosition="right"
                size={80}
              />
            </div>
          </div>
        ) : (
          /* Normal multiple-choice and question rendering */
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
            {(currentItem.itemType === 'VOCABULARY' || currentItem.itemType === 'LISTENING') && (
              <div className="flex justify-center">
                <button
                  onClick={playSound}
                  className={`btn-3d w-14 h-14 rounded-full flex items-center justify-center cursor-pointer ${
                    isPlayingAudio ? 'btn-3d-pink scale-110 animate-pulse' : 'btn-3d-blue'
                  }`}
                >
                  <Volume2 className="w-6 h-6 text-white" />
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
                      className={`card-3d p-4 text-left font-sans font-bold text-sm tracking-wide transition-all border-2 select-none cursor-pointer flex items-center gap-4 ${
                        isSelected
                          ? 'border-primary bg-primary-soft text-primary ring-2 ring-primary/10'
                          : 'border-border-main hover:bg-bg-light text-text-main'
                      }`}
                      style={{
                        pointerEvents: isChecked ? 'none' : 'auto',
                      }}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-display text-xs ${
                          isSelected
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
        className={`w-full py-6 px-6 border-t-2 select-none transition-colors duration-200 ${
          session.sessionType !== 'INTRODUCTION' && isChecked
            ? isCorrect
              ? 'bg-[#d7f5b3] border-[#a0da5a]' // Đúng: Banner màu xanh
              : 'bg-[#ffdfe0] border-[#ffb3b5]' // Sai: Banner màu đỏ
            : 'bg-white border-border-main'
        }`}
      >
        <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-4">
          {session.sessionType === 'INTRODUCTION' ? (
            <div className="flex justify-between w-full">
              <Button3D
                variant="gray"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="px-8 min-w-[120px] sm:min-w-[150px]"
              >
                TRỞ LẠI
              </Button3D>
              <Button3D
                variant="pink"
                onClick={handleContinue}
                className="px-8 min-w-[120px] sm:min-w-[150px]"
              >
                {currentStepIndex === currentItems.length - 1 ? 'HOÀN THÀNH' : 'TIẾP THEO'}
              </Button3D>
            </div>
          ) : (
            <>
              {/* Banner message displaying feedback details */}
              {isChecked ? (
                <div className="flex items-center gap-3 text-left">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-success fill-white stroke-[2.5] animate-bounce-soft" />
                      <div>
                        <h4 className="text-base font-display font-extrabold text-[#439c00] m-0">Tuyệt vời quá bé ơi!</h4>
                        <p className="text-[11px] font-semibold text-[#5aa81e]">Đáp án hoàn toàn chính xác.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-8 h-8 text-primary fill-white stroke-[2.5] animate-shake" />
                      <div>
                        <h4 className="text-base font-display font-extrabold text-primary-dark m-0">Chưa chính xác rồi bé!</h4>
                        <p className="text-[11px] font-semibold text-primary/80">
                          Đáp án đúng là: <strong>{currentItem.correctAnswer || currentItem.translation}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-left text-xs font-bold text-text-muted hidden sm:block">
                  {selectedOption 
                    ? 'Tuyệt vời! Bé hãy nhấn "Kiểm Tra" đáp án nhé.' 
                    : 'Bé hãy chọn một đáp án đúng nhất phía trên.'}
                </div>
              )}

              {/* Action button */}
              {!isChecked ? (
                <Button3D
                  variant={selectedOption ? 'pink' : 'gray'}
                  disabled={!selectedOption}
                  onClick={handleCheckAnswer}
                  className="px-8 min-w-[150px]"
                >
                  KIỂM TRA
                </Button3D>
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
