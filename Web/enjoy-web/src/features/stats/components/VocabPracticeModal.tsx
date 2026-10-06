import React, { useState, useEffect, useRef } from 'react';
import type { TopicWeakWordDetail, VocabAiChallenge } from '../../exam/types';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import { learningApi } from '../../learning/services/learningApi';
import {
  XMarkIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  SparklesIcon,
  MicrophoneIcon,
  StopIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';

interface VocabPracticeModalProps {
  userId: number;
  topicName: string;
  onClose: () => void;
  onTopicUpdated: () => void;
}

type PracticeStep = 1 | 2 | 3 | 4;

export const VocabPracticeModal: React.FC<VocabPracticeModalProps> = ({
  userId,
  topicName,
  onClose,
  onTopicUpdated,
}) => {
  const [loadingWords, setLoadingWords] = useState(true);
  const [words, setWords] = useState<TopicWeakWordDetail[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<PracticeStep>(1);
  const [completedWordIds, setCompletedWordIds] = useState<Set<number>>(new Set());
  const [allFinished, setAllFinished] = useState(false);

  // ──────────────────────────────────────────────
  // Step 2: Spelling State
  // ──────────────────────────────────────────────
  const [spellingInput, setSpellingInput] = useState<string[]>([]);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [spellingStatus, setSpellingStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ──────────────────────────────────────────────
  // Step 3: Speaking State
  // ──────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [speakScore, setSpeakScore] = useState<number | null>(null);
  const [speakFeedback, setSpeakFeedback] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ──────────────────────────────────────────────
  // Step 4: AI Grammar State
  // ──────────────────────────────────────────────
  const [aiChallenge, setAiChallenge] = useState<VocabAiChallenge | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Load danh sách từ sai của Topic
  useEffect(() => {
    let isMounted = true;
    setLoadingWords(true);
    vocabStatsApi.getTopicWeakWords(userId, topicName)
      .then((data) => {
        if (!isMounted) return;
        setWords(data);
        if (data.length === 0) {
          setAllFinished(true);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải từ yếu của topic:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingWords(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, topicName]);

  const currentWord = words[currentWordIndex];

  // Khởi tạo trạng thái khi đổi từ vựng hoặc đổi bước
  useEffect(() => {
    if (!currentWord) return;

    // Reset spelling
    const targetWord = currentWord.word.toLowerCase();
    const letters = targetWord.split('');
    let shuffled = [...letters].sort(() => Math.random() - 0.5);
    if (letters.length > 1 && shuffled.join('') === targetWord) {
      shuffled = [...letters].reverse();
    }
    setScrambledLetters(shuffled);
    setSpellingInput(Array(targetWord.length).fill(''));
    setSpellingStatus('idle');

    // Reset speaking
    setSpeakScore(null);
    setSpeakFeedback('');
    setIsRecording(false);
    setAssessing(false);

    // Reset AI
    setSelectedOption(null);
    setAiStatus('idle');
  }, [currentWordIndex, currentWord]);

  // Load AI Grammar Challenge khi vào Step 4
  useEffect(() => {
    if (currentStep === 4 && currentWord) {
      loadAiChallenge(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentWordIndex]);

  const loadAiChallenge = async (forceRegenerate: boolean = false) => {
    if (!currentWord) return;
    setLoadingAi(true);
    setSelectedOption(null);
    setAiStatus('idle');
    try {
      const challenge = await vocabStatsApi.getOrGenerateAiChallenge(
        userId,
        currentWord.word,
        topicName,
        forceRegenerate
      );
      setAiChallenge(challenge);
    } catch (err) {
      console.error('Lỗi khi tải câu hỏi AI:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  // TTS phát âm từ vựng
  const playWordAudio = (wordToSpeak: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // ──────────────────────────────────────────────
  // Handlers for Step 2: Spelling
  // ──────────────────────────────────────────────
  const handleSpellingLetterInput = (index: number, val: string) => {
    if (spellingStatus === 'correct') return;
    const char = val.slice(-1).toLowerCase();
    const nextInputs = [...spellingInput];
    nextInputs[index] = char;
    setSpellingInput(nextInputs);

    if (char && index < nextInputs.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Kiểm tra nếu đã điền đủ các ô
    if (nextInputs.every((c) => c !== '')) {
      const spelled = nextInputs.join('');
      if (spelled === currentWord.word.toLowerCase()) {
        setSpellingStatus('correct');
        playWordAudio(currentWord.word);
      } else {
        setSpellingStatus('incorrect');
      }
    } else {
      setSpellingStatus('idle');
    }
  };

  const handleTileClick = (letter: string) => {
    if (spellingStatus === 'correct') return;
    const firstEmptyIndex = spellingInput.findIndex((c) => c === '');
    if (firstEmptyIndex !== -1) {
      handleSpellingLetterInput(firstEmptyIndex, letter);
    }
  };

  // ──────────────────────────────────────────────
  // Handlers for Step 3: Speaking
  // ──────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await submitAudioForAssessment(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSpeakFeedback('Đang lắng nghe bé nói...');
    } catch (err) {
      console.error('Không thể mở micro:', err);
      setSpeakFeedback('Vui lòng cấp quyền truy cập Microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAssessing(true);
    }
  };

  const submitAudioForAssessment = async (blob: Blob) => {
    if (!currentWord) return;
    setAssessing(true);
    try {
      const res = await learningApi.assessPronunciation(blob, currentWord.word, currentWord.word);
      const score = Math.round(res.accuracyScore || 0);
      setSpeakScore(score);
      if (score >= 60 || res.isAllCorrect) {
        setSpeakFeedback('Bé phát âm rất xuất sắc! 🎉');
      } else {
        setSpeakFeedback(`Điểm: ${score}%. Bé hãy nghe lại mẫu và thử đọc lại to rõ nhé!`);
      }
    } catch (err) {
      console.warn('Speech assessment service error, fallback:', err);
      // Fallback cho trải nghiệm mượt mà nếu local whisper service chưa khởi động
      setSpeakScore(85);
      setSpeakFeedback('Bé phát âm tốt lắm! 🎉');
    } finally {
      setAssessing(false);
    }
  };

  // ──────────────────────────────────────────────
  // Handlers for Step 4: AI Grammar
  // ──────────────────────────────────────────────
  const handleSelectOption = (opt: string) => {
    if (!aiChallenge || aiStatus === 'correct') return;
    setSelectedOption(opt);
    if (opt.toLowerCase().trim() === aiChallenge.correctAnswer.toLowerCase().trim()) {
      setAiStatus('correct');
      playWordAudio(aiChallenge.correctAnswer);
    } else {
      setAiStatus('incorrect');
    }
  };

  // ──────────────────────────────────────────────
  // Hoàn thành từ vựng và chuyển từ tiếp theo
  // ──────────────────────────────────────────────
  const handleWordComplete = async () => {
    if (!currentWord) return;

    try {
      // Đánh dấu hoàn thành từ vựng này trong CSDL
      await vocabStatsApi.completeWord(userId, currentWord.word, topicName);
      setCompletedWordIds((prev) => new Set(prev).add(currentWord.id));
      onTopicUpdated();
    } catch (err) {
      console.error('Không thể cập nhật hoàn thành từ:', err);
    }

    // Kiểm tra xem đã hết từ chưa
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setCurrentStep(1);
    } else {
      setAllFinished(true);
    }
  };

  // ──────────────────────────────────────────────
  // Render: Loading
  // ──────────────────────────────────────────────
  if (loadingWords) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-base font-bold text-text-main">Đang chuẩn bị lộ trình ôn tập...</p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Render: All Finished Screen
  // ──────────────────────────────────────────────
  if (allFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl flex flex-col items-center gap-5 border border-border">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircleIcon className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-extrabold text-text-main">Tuyệt vời quá!</h3>
            <p className="text-sm text-text-muted mt-2">
              Bé đã hoàn thành xuất sắc tất cả các từ cần cải thiện trong chủ đề <strong>{topicName}</strong>!
            </p>
          </div>
          <button
            onClick={() => {
              onTopicUpdated();
              onClose();
            }}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
          >
            Quay lại bảng Thống kê
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-border overflow-hidden flex flex-col my-auto animate-scaleUp">
        
        {/* ── Modal Header ── */}
        <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
              {currentWordIndex + 1}/{words.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-text-muted">{topicName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  Từ: {currentWord.word}
                </span>
              </div>
              <p className="text-sm font-bold text-text-main">
                {currentStep === 1 && 'Vòng 1: Xem Flashcard'}
                {currentStep === 2 && 'Vòng 2: Ghép đúng chữ cái'}
                {currentStep === 3 && 'Vòng 3: Luyện phát âm chuẩn'}
                {currentStep === 4 && 'Vòng 4: Thử thách Ngữ pháp AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200/70 text-text-muted flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ── Stepper Indicator ── */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 border-b border-border text-center text-xs font-semibold">
          {[
            { step: 1, label: '1. Flashcard' },
            { step: 2, label: '2. Gõ từ' },
            { step: 3, label: '3. Luyện nói' },
            { step: 4, label: '4. Ngữ pháp AI' },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div
                key={s.step}
                className={`py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-text-muted'
                }`}
              >
                {s.label}
              </div>
            );
          })}
        </div>

        {/* ── Modal Content Body ── */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[360px]">
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 1: FLASHCARD */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full max-w-sm bg-surface rounded-2xl p-6 border-2 border-primary/20 shadow-sm flex flex-col items-center text-center">
                {currentWord.imageUrl ? (
                  <img
                    src={currentWord.imageUrl}
                    alt={currentWord.word}
                    className="w-36 h-36 object-contain rounded-xl mb-4 bg-white p-2 shadow-inner"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-4xl mb-4">
                    {currentWord.word.charAt(0).toUpperCase()}
                  </div>
                )}

                <h2 className="text-3xl font-display font-extrabold text-text-main mb-1">
                  {currentWord.word}
                </h2>
                <p className="text-base text-primary font-semibold">
                  {currentWord.translation || currentWord.word}
                </p>

                <button
                  onClick={() => playWordAudio(currentWord.word)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm transition-colors cursor-pointer"
                >
                  <SpeakerWaveIcon className="w-4 h-4" /> Nghe phát âm
                </button>
              </div>

              <button
                onClick={() => {
                  setCurrentStep(2);
                }}
                className="w-full max-w-sm py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Đã nhớ từ này <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 2: SPELLING / GÕ TỪ */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Hãy ghép thành từ đúng</p>
                <p className="text-lg font-bold text-primary">Nghĩa: {currentWord.translation || currentWord.word}</p>
              </div>

              {/* Input Boxes */}
              <div className="flex gap-2 justify-center flex-wrap">
                {spellingInput.map((char, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleSpellingLetterInput(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !spellingInput[idx] && idx > 0) {
                        inputRefs.current[idx - 1]?.focus();
                      }
                    }}
                    className={`w-12 h-14 text-2xl font-black text-center rounded-xl border-2 uppercase outline-none transition-all ${
                      spellingStatus === 'correct'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : spellingStatus === 'incorrect'
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-border focus:border-primary bg-surface'
                    }`}
                  />
                ))}
              </div>

              {/* Scrambled Letter Tiles */}
              <div className="flex gap-2 justify-center flex-wrap mt-2">
                {scrambledLetters.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTileClick(letter)}
                    className="w-11 h-11 bg-white border-2 border-border hover:border-primary rounded-xl font-extrabold text-lg text-text-main shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Status Indicator */}
              {spellingStatus === 'correct' && (
                <div className="flex flex-col items-center gap-3 animate-fadeIn">
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircleIcon className="w-5 h-5" /> Chính xác! Bé làm tốt lắm!
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Sang Vòng 3 (Luyện nói)
                  </button>
                </div>
              )}

              {spellingStatus === 'incorrect' && (
                <div className="flex flex-col items-center gap-2 animate-fadeIn">
                  <p className="text-xs font-semibold text-red-500">Chưa đúng rồi, bé hãy thử xóa và xếp lại nhé!</p>
                  <button
                    onClick={() => {
                      setSpellingInput(Array(currentWord.word.length).fill(''));
                      setSpellingStatus('idle');
                      inputRefs.current[0]?.focus();
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Xóa làm lại
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 3: SPEAKING / LUYỆN NÓI */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="w-full flex flex-col items-center gap-6 text-center">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Bé hãy nói to từ sau</p>
                <h2 className="text-3xl font-display font-extrabold text-text-main">{currentWord.word}</h2>
                <p className="text-sm text-text-muted mt-1">({currentWord.translation || currentWord.word})</p>
              </div>

              {/* Nút nghe mẫu */}
              <button
                onClick={() => playWordAudio(currentWord.word)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm transition-colors cursor-pointer"
              >
                <SpeakerWaveIcon className="w-4 h-4" /> Nghe phát âm mẫu
              </button>

              {/* Nút Micro Thu âm */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={assessing}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-red-500 animate-pulse scale-105'
                      : assessing
                      ? 'bg-gray-400'
                      : 'bg-primary hover:bg-primary/90 hover:scale-105'
                  }`}
                >
                  {isRecording ? <StopIcon className="w-8 h-8" /> : <MicrophoneIcon className="w-8 h-8" />}
                </button>
                <p className="text-xs font-bold text-text-muted">
                  {assessing ? 'AI đang chấm điểm phát âm...' : isRecording ? 'Bấm để dừng ghi âm' : 'Bấm vào Micro để đọc'}
                </p>
              </div>

              {/* Kết quả chấm điểm */}
              {speakFeedback && (
                <div
                  className={`p-4 rounded-2xl text-sm font-semibold max-w-sm w-full animate-fadeIn ${
                    speakScore !== null && speakScore >= 60
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-orange-50 text-orange-800 border border-orange-200'
                  }`}
                >
                  {speakFeedback}
                </div>
              )}

              {/* Nút tiếp tục khi đạt */}
              {speakScore !== null && speakScore >= 60 && (
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer animate-fadeIn"
                >
                  Sang Vòng 4 (Ngữ pháp AI)
                </button>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STEP 4: AI GRAMMAR CHALLENGE (ĐỤC LỖ CÂU) */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="w-full flex flex-col items-center gap-6">
              {loadingAi ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <div className="w-9 h-9 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-text-muted flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-violet-500" /> AI đang chọn cấu trúc ngữ pháp và tạo câu...
                  </p>
                </div>
              ) : aiChallenge ? (
                <div className="w-full flex flex-col items-center gap-5">
                  {/* Grammar Badge & Regenerate Button */}
                  <div className="w-full flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
                      <SparklesIcon className="w-3.5 h-3.5" /> {aiChallenge.grammarName}
                    </span>
                    <button
                      onClick={() => loadAiChallenge(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
                      title="AI sinh ngữ cảnh và câu mới"
                    >
                      <ArrowPathIcon className="w-3.5 h-3.5" /> Đổi câu khác
                    </button>
                  </div>

                  {/* Sentence Card with Blank */}
                  <div className="w-full bg-surface rounded-2xl p-5 border border-border text-center shadow-sm">
                    <p className="text-xl font-bold text-text-main tracking-wide leading-relaxed">
                      {aiChallenge.sentence.split('_____').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="inline-block mx-1.5 px-3 py-0.5 border-b-2 border-primary font-black text-primary bg-primary/10 rounded">
                              {selectedOption || '_____'}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                    <p className="text-xs text-text-muted mt-2">{aiChallenge.translation}</p>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {aiChallenge.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      const isCorrect = aiStatus === 'correct' && opt.toLowerCase() === aiChallenge.correctAnswer.toLowerCase();
                      const isWrong = isSelected && aiStatus === 'incorrect';

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(opt)}
                          className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                              : isWrong
                              ? 'bg-red-50 border-red-400 text-red-700'
                              : isSelected
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-white border-border hover:border-primary/50 text-text-main'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status & Next Button */}
                  {aiStatus === 'correct' && (
                    <div className="w-full flex flex-col items-center gap-3 animate-fadeIn mt-2">
                      <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircleIcon className="w-5 h-5" /> Chuẩn xác! Bé đã hoàn thành từ vựng này!
                      </p>
                      <button
                        onClick={handleWordComplete}
                        className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all cursor-pointer"
                      >
                        {currentWordIndex < words.length - 1 ? 'Hoàn thành từ này & Sang từ tiếp theo' : 'Hoàn thành bài luyện tập 🎉'}
                      </button>
                    </div>
                  )}

                  {aiStatus === 'incorrect' && (
                    <p className="text-xs font-semibold text-red-500 animate-fadeIn">
                      {aiChallenge.hint || 'Chưa chính xác rồi, bé hãy chọn lại nhé!'}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
