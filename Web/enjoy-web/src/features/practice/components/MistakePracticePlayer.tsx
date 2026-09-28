import React, { useState, useEffect, useMemo } from 'react';
import { 
  XMarkIcon, 
  HeartIcon, 
  ExclamationTriangleIcon, 
  CpuChipIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { chatbotApi } from '../../learning/services/chatbotApi';
import type { Vocabulary, SessionPayload } from '../../learning/types';
import { FlashcardExercise } from '../../learning/components/exercises/FlashcardExercise';
import { MatchWordExercise } from '../../learning/components/exercises/MatchWordExercise';
import { SpeakingExercise } from '../../learning/components/exercises/SpeakingExercise';
import { ReorderExercise } from '../../learning/components/exercises/ReorderExercise';
import { DragDropExercise } from '../../learning/components/exercises/DragDropExercise';
import { GrammarExercise } from '../../learning/components/exercises/GrammarExercise';
import { FillInBlankExercise } from '../../learning/components/exercises/FillInBlankExercise';
import { CongratulationScreen } from '../../learning/components/ui/CongratulationScreen';

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
  1: 'Màn 1: Học từ vựng (Flashcard)',
  2: 'Màn 2: Nối từ vựng (Vocabulary)',
  3: 'Màn 3: Luyện nói (Speaking)',
  4: 'Màn 4: Sắp xếp chữ cái (Writing)',
  5: 'Màn 5: Nghe và kéo thả (Listening)',
  6: 'Màn 6: Ngữ pháp trắc nghiệm (Reading)',
  7: 'Màn 7: Điền từ vào chỗ trống (Reading)'
};

export const MistakePracticePlayer: React.FC<MistakePracticePlayerProps> = ({
  mistakes,
  onClose,
  onFinished,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [masteredCount, setMasteredCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // States dành cho AI Advice Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [lastWrongAnswer, setLastWrongAnswer] = useState<string | null>(null);

  const currentItem = mistakes[currentIndex];

  useEffect(() => {
    if (currentItem) {
      setLastWrongAnswer(currentItem.wrongAnswerSubmitted || null);
    }
  }, [currentIndex, currentItem]);

  const handleOpenAiAdvice = async () => {
    if (!currentItem) return;
    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiAdvice('');
    try {
      const explanation = await chatbotApi.explainMistake(currentItem, lastWrongAnswer || undefined);
      setAiAdvice(explanation);
      mistakeApi.updateAiExplanation(currentItem.id, explanation).catch(() => {});
    } catch {
      setAiAdvice('Trợ lý AI đang bận một chút. Bé hãy xem lại từ vựng và đáp án đúng nhé!');
    } finally {
      setAiLoading(false);
    }
  };

  const progressPercent = mistakes.length > 0 ? (currentIndex / mistakes.length) * 100 : 0;

  const handleStepSuccess = async () => {
    if (!currentItem) return;
    try {
      await mistakeApi.submitPracticeStep(currentItem.id, true);
    } catch (err) {
      console.warn('Lỗi khi nộp kết quả luyện tập:', err);
    }
    setMasteredCount(prev => prev + 1);
    setTotalScore(prev => prev + 20);

    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      onFinished({
        total: mistakes.length,
        mastered: masteredCount + 1,
        score: totalScore + 20,
      });
    }
  };

  const handleStepMistake = async (wrongAns?: string) => {
    if (!currentItem) return;
    if (wrongAns) {
      setLastWrongAnswer(wrongAns);
    }
    try {
      await mistakeApi.submitPracticeStep(currentItem.id, false);
    } catch (err) {
      console.warn('Lỗi khi ghi nhận sai trong lúc luyện tập:', err);
    }
    setHearts(h => {
      const next = Math.max(0, h - 1);
      if (next === 0) {
        setIsFinished(true);
      }
      return next;
    });
  };

  // Tạo Vocabulary object cho item hiện tại
  const currentVocab: Vocabulary = useMemo(() => {
    if (!currentItem) {
      return { id: 0, word: '', translation: '' };
    }
    return {
      id: currentItem.questionId || currentItem.id,
      word: currentItem.contentText || currentItem.keyword || '',
      translation: currentItem.translation || '',
      imageUrl: currentItem.imageUrl,
      audioUrl: currentItem.audioUrl,
    };
  }, [currentItem]);

  // Danh sách từ vựng cho bài tập ghép cặp (Vòng 2)
  const matchVocabs: Vocabulary[] = useMemo(() => {
    if (!currentItem) return [];
    const list: Vocabulary[] = [currentVocab];
    const otherMistakes = mistakes.filter(m => m.id !== currentItem.id);
    otherMistakes.forEach(m => {
      if (list.length < 4) {
        list.push({
          id: m.questionId || m.id,
          word: m.contentText || m.keyword || '',
          translation: m.translation || '',
          imageUrl: m.imageUrl,
          audioUrl: m.audioUrl,
        });
      }
    });
    return list;
  }, [currentItem, currentVocab, mistakes]);

  // Payload cho các dạng bài nâng cao (DragDrop, Grammar, FillInBlank)
  const currentPayload: SessionPayload = useMemo(() => {
    if (!currentItem) return {};
    const wordText = currentItem.keyword || currentItem.contentText || '';

    // Dạng Fill In Blank
    if (currentItem.roundType === 7) {
      const otherWords = mistakes
        .filter(m => m.id !== currentItem.id)
        .map(m => m.keyword || m.contentText)
        .filter(Boolean);
      const distractors = Array.from(new Set(otherWords)).slice(0, 3);
      if (distractors.length < 3) {
        ['apple', 'banana', 'orange', 'cat', 'dog'].forEach(w => {
          if (distractors.length < 3 && w.toLowerCase() !== wordText.toLowerCase() && !distractors.includes(w)) {
            distractors.push(w);
          }
        });
      }

      return {
        items: [{
          order: 1,
          sentence: currentItem.contentText && currentItem.contentText.includes('[]')
            ? currentItem.contentText
            : `[${wordText}]`,
          image_url: currentItem.imageUrl || '',
          audio_url: currentItem.audioUrl || '',
          answer: wordText,
          distractors,
        }],
      };
    }

    // Dạng Grammar
    if (currentItem.roundType === 6) {
      const otherWords = mistakes
        .filter(m => m.id !== currentItem.id)
        .map(m => m.keyword || m.contentText)
        .filter(Boolean);
      const optionsList = [wordText, ...otherWords.slice(0, 3)];
      return {
        title: 'Ôn tập Ngữ pháp',
        blocks: [{
          order: 1,
          type: 'QUESTION',
          text: currentItem.contentText || `Chọn từ đúng: []`,
          audio_url: currentItem.audioUrl,
          options: optionsList.map((opt, idx) => ({
            id: String(idx),
            text: opt,
            is_correct: opt.toLowerCase() === wordText.toLowerCase(),
          })),
        }],
      };
    }

    // Dạng Drag & Drop
    if (currentItem.roundType === 5) {
      return {
        image_url: currentItem.imageUrl || '',
        audio_url: currentItem.audioUrl || '',
        coordinates: [
          { word: wordText, x: 0.35, y: 0.35, width: 0.3, height: 0.3 }
        ],
      };
    }

    return {
      word: wordText,
      translation: currentItem.translation,
      image_url: currentItem.imageUrl,
      audio_url: currentItem.audioUrl,
    };
  }, [currentItem, mistakes]);

  // ──────────────────────────────────────────────
  // Màn hình kết thúc
  // ──────────────────────────────────────────────
  if (!currentItem || isFinished) {
    if (hearts > 0) {
      return <CongratulationScreen onNext={onClose} />;
    }

    return (
      <div className="session-finished">
        <div className="session-finished-card">
          <div className="session-finished-emoji">😢</div>
          <h2 className="session-finished-title">Hết lượt! Cố lên lần sau nhé!</h2>
          <p className="text-sm text-text-muted mt-2">
            Bé đã hoàn thành {masteredCount}/{mistakes.length} câu trong phiên ôn tập này.
          </p>
          <div className="mt-4 flex justify-center">
            <Button3D variant="blue" size="md" onClick={onClose}>
              Quay lại danh sách ôn tập
            </Button3D>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Header giống hệt SessionPlayer
  // ──────────────────────────────────────────────
  const Header = () => (
    <div className="session-player-header">
      <button
        id="practice-player-exit-btn"
        className="session-exit-btn"
        onClick={() => setShowExitModal(true)}
        aria-label="Thoát ôn tập"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      <div className="session-progress-bar">
        <div className="session-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="session-hearts">
        {Array.from({ length: 5 }).map((_, i) => (
          <HeartIcon
            key={i}
            className={`w-5 h-5 ${i < hearts ? 'text-red-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );

  // ──────────────────────────────────────────────
  // Chọn Exercise Component theo roundType thực tế 100% giống màn chơi
  // ──────────────────────────────────────────────
  const renderExercise = () => {
    switch (currentItem.roundType) {
      case 1: // FLASHCARD
        return (
          <FlashcardExercise
            key={`flashcard-${currentItem.id}`}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
          />
        );

      case 2: // MATCH_WORD
        return (
          <MatchWordExercise
            key={`matchword-${currentItem.id}`}
            partId={0}
            vocabularies={matchVocabs}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );

      case 3: // SPEAKING
        return (
          <SpeakingExercise
            key={`speaking-${currentItem.id}`}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );

      case 4: // RE_ORDER
        return (
          <ReorderExercise
            key={`reorder-${currentItem.id}`}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );

      case 5: // DRAG_DROP
        return (
          <DragDropExercise
            key={`dragdrop-${currentItem.id}`}
            payload={currentPayload}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );

      case 6: // GRAMMAR
        return (
          <GrammarExercise
            key={`grammar-${currentItem.id}`}
            payload={currentPayload}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );

      case 7: // FILL_IN_BLANK
        return (
          <FillInBlankExercise
            key={`fillblank-${currentItem.id}`}
            payload={currentPayload}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );

      default:
        return (
          <ReorderExercise
            key={`default-${currentItem.id}`}
            vocabularies={[currentVocab]}
            onComplete={handleStepSuccess}
            onMistake={(m) => handleStepMistake(m.wrongAnswerSubmitted)}
          />
        );
    }
  };

  return (
    <div className="session-player">
      <Header />

      {/* Top Banner Lỗi Sai Trước Đó & Trợ Lý AI */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary-soft text-primary rounded-full text-xs font-display font-black uppercase">
            {ROUND_NAMES[currentItem.roundType] || `Vòng ${currentItem.roundType}`}
          </span>
          <span className="text-xs font-bold text-text-muted">
            Câu {currentIndex + 1} / {mistakes.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(currentItem.recognizedAudioTranscript || currentItem.wrongAnswerSubmitted) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs text-red-600 font-semibold">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{currentItem.roundType === 3 || currentItem.recognizedAudioTranscript ? 'Lần trước bé đọc: ' : 'Lần trước bé sai: '}</span>
              {isImageUrl(currentItem.wrongAnswerSubmitted) ? (
                <div className="w-6 h-6 rounded border border-red-300 overflow-hidden inline-flex items-center justify-center bg-white p-0.5">
                  <img src={getAssetUrl(currentItem.wrongAnswerSubmitted)} alt="Wrong" className="w-full h-full object-cover" />
                </div>
              ) : (
                <strong className="line-through">
                  {currentItem.recognizedAudioTranscript || currentItem.wrongAnswerSubmitted}
                </strong>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenAiAdvice}
            className="px-3 py-1 bg-[#f0f5ff] hover:bg-[#d6e4ff] text-[#2f54eb] rounded-xl border border-[#adc6ff] font-display font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <CpuChipIcon className="w-3.5 h-3.5 text-[#2f54eb]" />
            HỎI AI
          </button>
        </div>
      </div>

      {/* Khu vực trò chơi giống 100% màn chơi */}
      <div className="session-exercise-area">
        {renderExercise()}
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="exit-modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="exit-modal" onClick={e => e.stopPropagation()}>
            <h3>Dừng phiên luyện tập?</h3>
            <p>Tiến độ của các câu chưa hoàn thành sẽ không được tính.</p>
            <div className="exit-modal-actions">
              <button className="btn-secondary" onClick={() => setShowExitModal(false)}>
                Tiếp tục ôn tập
              </button>
              <button className="btn-danger" onClick={onClose}>
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Advice Modal */}
      {isAiModalOpen && (
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
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-[#2b2b2b]">
                      Từ / Câu chuẩn: <strong className="text-primary">{currentItem.contentText || currentItem.keyword}</strong>
                    </p>
                    {currentItem.translation && (
                      <p className="text-text-muted text-[11px]">({currentItem.translation})</p>
                    )}
                  </div>
                </div>

                {lastWrongAnswer && (
                  <div className="flex items-center gap-2 text-[#cf1322] font-semibold pt-2 border-t border-border-main/50">
                    <span className="shrink-0">Bé đã đọc/chọn:</span>
                    {isImageUrl(lastWrongAnswer) ? (
                      <div className="w-8 h-8 rounded border border-red-300 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                        <img src={getAssetUrl(lastWrongAnswer)} alt="Wrong" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <strong className="line-through">{lastWrongAnswer}</strong>
                    )}
                  </div>
                )}
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
