import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { SessionItemType } from '../types';
import type { Session, SessionItem } from '../types';
import { Mascot } from '../../../components/ui/Mascot';
import { Button3D } from '../../../components/ui/Button3D';
import { BASE_URL } from '../../../services/apiClient';
import { learningApi } from '../services/learningApi';
import { mistakeApi } from '../services/mistakeApi';

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

  // Trạng thái cho Vòng 4 (GAMIFIED_REVIEW)
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<{ id: number; text: string; selected: boolean }[]>([]);
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({});

  // Trạng thái layout ngẫu nhiên cho Vòng 5 (GAMIFIED_REVIEW)
  const [itemLayouts, setItemLayouts] = useState<Record<number, 'LISTENING' | 'SPEAKING' | 'QUIZ' | 'FILL_IN_BLANK'>>({});

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

  const [playItems, setPlayItems] = useState<InteractiveItem[]>([]);

  // Cập nhật và xáo trộn các câu hỏi mỗi khi chơi Vòng 5 (GAMIFIED_REVIEW)
  useEffect(() => {
    if (!sessionItems) return;
    let items = [...sessionItems] as InteractiveItem[];
    if (session.sessionType === 'GAMIFIED_REVIEW') {
      items.sort(() => 0.5 - Math.random());
    }
    setPlayItems(items);
  }, [sessionItems, session.sessionType]);

  const currentItems = playItems;
  const currentItem = currentItems[currentStepIndex];
  const progressPercent = currentItems.length > 0
    ? ((currentStepIndex) / currentItems.length) * 100
    : 0;

  const getActiveLayout = (): 'INTRODUCTION' | 'LISTENING' | 'SPEAKING' | 'QUIZ' | 'FILL_IN_BLANK' | 'UNKNOWN' => {
    if (!session || !currentItem) return 'UNKNOWN';
    if (session.sessionType === 'INTRODUCTION') return 'INTRODUCTION';
    if (session.sessionType === 'LISTENING') return 'LISTENING';
    if (session.sessionType === 'SPEAKING') return 'SPEAKING';
    if (session.sessionType === 'WORD_RECOGNITION') {
      return currentItem.itemType === SessionItemType.QUIZ ? 'QUIZ' : 'FILL_IN_BLANK';
    }
    if (session.sessionType === 'GAMIFIED_REVIEW') {
      return itemLayouts[currentItem.id] || 'UNKNOWN';
    }
    return 'UNKNOWN';
  };

  const activeLayout = getActiveLayout();

  const parseSentence = (text: string) => {
    const regex = /\[([^\]]+)\]/g;
    const tokens: { type: 'text' | 'blank'; content: string; blankIndex?: number }[] = [];
    let lastIndex = 0;
    let blankIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.substring(lastIndex, matchIndex)
        });
      }
      tokens.push({
        type: 'blank',
        content: match[1],
        blankIndex: blankIndex++
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return tokens;
  };

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

  // Tạo layout ngẫu nhiên cho các câu hỏi trong Vòng 5 (GAMIFIED_REVIEW)
  useEffect(() => {
    if (!sessionItems || session.sessionType !== 'GAMIFIED_REVIEW') return;

    const layouts: Record<number, 'LISTENING' | 'SPEAKING' | 'QUIZ' | 'FILL_IN_BLANK'> = {};
    sessionItems.forEach((item) => {
      if (item.itemType === SessionItemType.FILL_IN_BLANK) {
        layouts[item.id] = 'FILL_IN_BLANK';
      } else if (item.itemType === SessionItemType.QUIZ) {
        layouts[item.id] = 'QUIZ';
      } else {
        // Đối với FLASHCARD, chọn ngẫu nhiên giữa LISTENING (Vòng 2) hoặc SPEAKING (Vòng 3)
        layouts[item.id] = Math.random() < 0.5 ? 'LISTENING' : 'SPEAKING';
      }
    });
    setItemLayouts(layouts);
  }, [sessionItems, session.sessionType]);

  // Tạo danh sách 4 lựa chọn cho Vòng 4/5 (QUIZ)
  useEffect(() => {
    const isQuizLayout = (session.sessionType === 'WORD_RECOGNITION' && currentItem?.itemType === SessionItemType.QUIZ) ||
      (session.sessionType === 'GAMIFIED_REVIEW' && itemLayouts[currentItem?.id] === 'QUIZ');

    if (!currentItem || !isQuizLayout) return;

    const correctKeyword = currentItem.keyword || '';

    // Tìm các keyword của các items khác có cùng type QUIZ
    const otherKeywords = currentItems
      .filter(item => item.itemType === SessionItemType.QUIZ && item.keyword && item.keyword !== correctKeyword)
      .map(item => item.keyword as string);

    const uniqueOthers = Array.from(new Set(otherKeywords));
    const backupKeywords = ['cow', 'pig', 'duck', 'horse', 'sheep', 'run', 'swim', 'eat', 'sleep', 'fly', 'red', 'blue', 'green', 'yellow', 'black'];

    const shuffledOthers = [...uniqueOthers].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);

    while (selectedOthers.length < 3) {
      const backup = backupKeywords[Math.floor(Math.random() * backupKeywords.length)];
      if (backup !== correctKeyword && !selectedOthers.includes(backup)) {
        selectedOthers.push(backup);
      }
    }

    const finalChoices = [correctKeyword, ...selectedOthers].sort(() => 0.5 - Math.random());
    setQuizOptions(finalChoices);
    setSelectedOption(null);
    setIsChecked(false);
  }, [currentItem, currentItems, session.sessionType, itemLayouts]);

  // Tạo danh sách các từ xáo trộn cho Vòng 4/5 (FILL_IN_BLANK)
  useEffect(() => {
    const isFillLayout = (session.sessionType === 'WORD_RECOGNITION' && currentItem?.itemType === SessionItemType.FILL_IN_BLANK) ||
      (session.sessionType === 'GAMIFIED_REVIEW' && itemLayouts[currentItem?.id] === 'FILL_IN_BLANK');

    if (!currentItem || !isFillLayout) return;

    // Chỉ trích xuất các từ trong ngoặc vuông [word] làm đáp án
    const regex = /\[([^\]]+)\]/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(currentItem.contentText)) !== null) {
      matches.push(match[1]);
    }

    const wordsWithId = matches.map((word, index) => ({
      id: index,
      text: word,
      selected: false
    }));

    const shuffled = [...wordsWithId].sort(() => 0.5 - Math.random());
    setShuffledWords(shuffled);
    setBlankAnswers({});
    setIsChecked(false);
  }, [currentItem, session.sessionType, itemLayouts]);



  // Tạo danh sách 4 lựa chọn hình ảnh ngẫu nhiên cho Vòng 3 (LISTENING)
  useEffect(() => {
    const isListeningLayout = session.sessionType === 'LISTENING' ||
      (session.sessionType === 'GAMIFIED_REVIEW' && itemLayouts[currentItem?.id] === 'LISTENING');

    if (!currentItem || !isListeningLayout) return;

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
  }, [currentItem, currentItems, session.sessionType, itemLayouts]);



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

    // Reset thời gian bắt đầu câu hỏi khi chuyển step
    setQuestionStartTime(Date.now());

    // Cleanup khi chuyển câu hỏi
    return () => {
      clearTimeout(playTimeout);
      audio.pause();
    };
  }, [currentStepIndex, currentItem?.id]);

  const playSound = (speed: number = 1.0) => {
    if (!currentItem || !currentItem.audioUrl) return;

    const fullAudioUrl = getAssetUrl(currentItem.audioUrl);

    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(fullAudioUrl);
    audio.playbackRate = speed;
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

  const handleAddWordToBlank = (word: { id: number; text: string }) => {
    if (isChecked || !currentItem) return;

    // Tìm ô trống đầu tiên chưa được điền
    const tokens = parseSentence(currentItem.contentText);
    const expectedBlanks = tokens.filter(t => t.type === 'blank');

    const firstEmptyBlank = expectedBlanks.find(blank => !blankAnswers[blank.blankIndex!]);
    if (!firstEmptyBlank) return; // Đã điền đầy tất cả các ô trống rồi

    const blankIndex = firstEmptyBlank.blankIndex!;
    setBlankAnswers(prev => ({
      ...prev,
      [blankIndex]: word.text
    }));

    // Đánh dấu từ đã chọn
    setShuffledWords(prev =>
      prev.map(w => w.id === word.id ? { ...w, selected: true } : w)
    );
  };

  const handleRemoveWordFromBlank = (blankIndex: number, text: string) => {
    if (isChecked) return;

    // Gỡ khỏi map điền từ
    setBlankAnswers(prev => {
      const copy = { ...prev };
      delete copy[blankIndex];
      return copy;
    });

    // Trả từ về trạng thái chưa được chọn
    setShuffledWords(prev => {
      // Tìm từ đầu tiên trùng text và đang selected = true để reset về false
      let found = false;
      return prev.map(w => {
        if (!found && w.text === text && w.selected) {
          found = true;
          return { ...w, selected: false };
        }
        return w;
      });
    });
  };

  const isCheckButtonEnabled = (() => {
    if (!currentItem) return false;
    if (activeLayout === 'FILL_IN_BLANK') {
      const tokens = parseSentence(currentItem.contentText);
      const expectedCount = tokens.filter(t => t.type === 'blank').length;
      const filledCount = Object.keys(blankAnswers).length;
      return filledCount === expectedCount;
    }
    if (activeLayout === 'SPEAKING') {
      return !!recordedAudioUrl;
    }
    return !!selectedOption;
  })();

  const getCorrectAnswerText = () => {
    if (!currentItem) return '';
    if (activeLayout === 'FILL_IN_BLANK') {
      return currentItem.contentText.replace(/[\[\]]/g, '');
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
        recordMistakeIfWrong(selectedOption || 'Ảnh chưa đúng');
      }
      return;
    }

    // 3. SPEAKING: Ghi âm & Gọi AI Faster-Whisper chấm điểm phát âm
    if (activeLayout === 'SPEAKING') {
      if (recordedBlob && currentItem.contentText) {
        setIsAssessing(true);
        try {
          const res = await learningApi.assessPronunciation(recordedBlob, currentItem.contentText);
          setSpeakingResult(res.details);
          setIsCorrect(res.isAllCorrect);
          setIsChecked(true);
          if (!res.isAllCorrect) {
            recordMistakeIfWrong(res.recognizedText || 'Phát âm chưa chuẩn');
          }
        } catch (error) {
          console.error("Lỗi khi chấm điểm phát âm:", error);
          // Fallback nếu chưa bật service AI: Cho qua luôn
          setIsCorrect(true);
          setIsChecked(true);
        } finally {
          setIsAssessing(false);
        }
      } else {
        setIsCorrect(true);
        setIsChecked(true);
      }
      return;
    }

    // 4. QUIZ: So sánh từ khóa
    if (activeLayout === 'QUIZ') {
      const correct = selectedOption === currentItem.keyword;
      setIsCorrect(correct);
      setIsChecked(true);
      if (!correct) {
        setHearts(prev => Math.max(0, prev - 1));
        recordMistakeIfWrong(selectedOption || 'Đáp án chưa đúng');
      }
      return;
    }

    // 5. FILL_IN_BLANK: So sánh câu xếp
    if (activeLayout === 'FILL_IN_BLANK') {
      const tokens = parseSentence(currentItem.contentText);
      const expectedBlanks = tokens.filter(t => t.type === 'blank');
      let correct = true;
      expectedBlanks.forEach(blank => {
        const userVal = blankAnswers[blank.blankIndex!]?.trim().toLowerCase();
        const expectedVal = blank.content.trim().toLowerCase();
        if (userVal !== expectedVal) {
          correct = false;
        }
      });
      setIsCorrect(correct);
      setIsChecked(true);
      if (!correct) {
        setHearts(prev => Math.max(0, prev - 1));
        const userFilled = Object.values(blankAnswers).join(' ') || 'Điền từ chưa đúng';
        recordMistakeIfWrong(userFilled);
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
    setListeningOptions([]);
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setSpeakingResult(null);
    setIsAssessing(false);
    setQuizOptions([]);
    setShuffledWords([]);
    setBlankAnswers({});

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
        {!(activeLayout === 'QUIZ') && (
          <div className="text-left space-y-1">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
              {activeLayout === 'INTRODUCTION'
                ? 'Giới thiệu từ mới'
                : activeLayout === 'LISTENING'
                  ? 'Chọn hình tương ứng'
                  : activeLayout === 'SPEAKING'
                    ? 'Tập phát âm chuẩn'
                    : activeLayout === 'FILL_IN_BLANK'
                      ? 'Sắp xếp câu đúng'
                      : 'Chọn đáp án chính xác'}
            </span>
            <h2 className="text-2xl font-display font-extrabold text-text-main m-0 leading-tight">
              {activeLayout === 'INTRODUCTION'
                ? 'Làm quen và phát âm từ mới nhé!'
                : activeLayout === 'LISTENING'
                  ? 'Nghe loa phát âm và chọn hình ảnh phù hợp nhé!'
                  : activeLayout === 'SPEAKING'
                    ? 'Nghe phát âm mẫu và ấn ghi âm để tập đọc nhé!'
                    : activeLayout === 'FILL_IN_BLANK'
                      ? 'Nhấp các từ bên dưới theo đúng thứ tự để xếp câu nhé!'
                      : 'Nghĩa của từ/câu sau đây là gì?'}
            </h2>
          </div>
        )}

        {activeLayout === 'INTRODUCTION' ? (
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
                    onClick={() => playSound(1.0)}
                    className={`btn-3d w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${isPlayingAudio
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
                  <Volume2 className="w-8 h-8 text-white" />
                </button>

                {/* Turtle slow speed sound button */}
                <button
                  onClick={() => playSound(0.6)}
                  className={`btn-3d w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all bg-amber-100 hover:scale-105 hover:bg-amber-200 border-b-4 border-amber-300 shadow-[0_2px_0_0_#d97706]`}
                >
                  <span className="text-2xl select-none" title="Turtle Mode (Chậm)">🐢</span>
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
                    <div className="w-full aspect-video sm:h-32 rounded-xl overflow-hidden bg-bg-light relative">
                      <img
                        src={getAssetUrl(imageUrl)}
                        alt={`Lựa chọn ${optionLabel}`}
                        className="w-full h-full object-cover"
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
                    <Mic className="w-5 h-5 text-white" />
                    NHẤN ĐỂ GHI ÂM
                  </button>
                )}

                {/* 2. Recording Status Pulsing Button */}
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-[#ff4d4f] border-b-4 border-[#cf1322] text-white hover:bg-[#ff7875] rounded-2xl flex items-center gap-2 cursor-pointer font-display font-extrabold text-xs animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-current text-white" />
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
                      <Play className="w-4 h-4 text-white" />
                      NGHE LẠI
                    </button>

                    <button
                      onClick={startRecording}
                      disabled={isChecked}
                      className="px-4 py-3 bg-white border-2 border-border-main text-text-main hover:bg-bg-light rounded-2xl flex items-center gap-1.5 cursor-pointer font-display font-extrabold text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
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
          <div className="flex flex-col items-center space-y-6 w-full animate-fade-in-up">
            {/* Question speech bubble with Mascot */}
            <div className="flex items-center justify-center py-4">
              <Mascot
                expression={isChecked ? (isCorrect ? 'happy' : 'sad') : 'thinking'}
                speechBubbleText={currentItem.contentText}
                bubblePosition="right"
                size={140}
              />
            </div>

            {/* QUIZ Choices (Keywords) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
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
            {/* Instruction Mascot */}
            <div className="flex items-center justify-center py-2">
              <Mascot
                expression={isChecked ? (isCorrect ? 'happy' : 'sad') : 'thinking'}
                speechBubbleText="Hãy nhấp chọn các từ bên dưới để điền vào chỗ trống nhé!"
                bubblePosition="right"
                size={90}
              />
            </div>

            {/* Translation hint */}
            <div className="text-center bg-[#f0f9ff] border border-[#b3e5fc] px-5 py-3 rounded-2xl w-full">
              <span className="text-[10px] font-extrabold text-[#0288d1] tracking-wider uppercase block mb-1">Dịch nghĩa:</span>
              <p className="text-base font-display font-extrabold text-[#01579b]">{currentItem.translation}</p>
            </div>

            {/* Image if available */}
            {currentItem.imageUrl && (
              <div className="w-full max-w-[200px] h-28 bg-white border border-border-main/50 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
                <img src={getAssetUrl(currentItem.imageUrl)} alt="Gợi ý" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Câu hỏi có chứa các ô trống */}
            <div className="w-full bg-[#f8fafc] border-2 border-border-main rounded-[2rem] p-6 shadow-sm flex flex-wrap items-center justify-center gap-y-3 gap-x-1.5 leading-relaxed text-center min-h-[5rem]">
              {parseSentence(currentItem.contentText).map((token, index) => {
                if (token.type === 'text') {
                  return (
                    <span key={index} className="text-lg font-sans font-extrabold text-text-main">
                      {token.content}
                    </span>
                  );
                } else {
                  const filledWord = blankAnswers[token.blankIndex!];
                  return (
                    <button
                      key={index}
                      onClick={() => filledWord && handleRemoveWordFromBlank(token.blankIndex!, filledWord)}
                      disabled={isChecked}
                      className={`inline-flex items-center justify-center min-w-24 h-10 px-3 border-2 rounded-xl font-sans font-extrabold text-sm transition-all ${filledWord
                          ? 'bg-white border-primary text-primary shadow-[0_2px_0_0_#d93d74] hover:bg-red-50 hover:border-red-300 cursor-pointer active:translate-y-[1px]'
                          : 'bg-white/50 border-dashed border-border-main text-transparent pointer-events-none'
                        }`}
                    >
                      {filledWord || '_______'}
                    </button>
                  );
                }
              })}
            </div>

            {/* Danh sách các thẻ từ khóa để chọn */}
            <div className="w-full space-y-2 pt-4">
              <span className="text-[10px] font-extrabold text-text-muted tracking-widest uppercase block text-left">CHỌN TỪ ĐỂ ĐIỀN:</span>
              <div className="flex flex-wrap gap-2.5 justify-center p-4 border border-border-main/40 rounded-2xl bg-white shadow-sm min-h-16">
                {shuffledWords.map((word) => {
                  if (word.selected) {
                    return (
                      <div key={word.id} className="px-4 py-2.5 rounded-xl bg-bg-light/30 border-2 border-dashed border-border-main/20 text-transparent pointer-events-none min-w-[4rem] text-center h-10 flex items-center justify-center text-sm font-bold">
                        {word.text}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={word.id}
                      onClick={() => handleAddWordToBlank(word)}
                      disabled={isChecked}
                      className="px-4 py-2.5 bg-white border-2 border-border-main shadow-[0_4px_0_0_#e5e5e5] text-text-main hover:bg-bg-light cursor-pointer active:translate-y-[2px] rounded-xl font-sans font-bold text-sm min-w-[4rem] text-center"
                    >
                      {word.text}
                    </button>
                  );
                })}
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
                    <RotateCcw className="w-4 h-4 mr-1.5 inline" />
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
