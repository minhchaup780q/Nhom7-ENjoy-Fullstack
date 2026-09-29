import React, { useState, useMemo, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem, type MistakeCreatePayload } from '../../learning/services/mistakeApi';
import type { Vocabulary, SessionPayload } from '../../learning/types';
import { FlashcardExercise } from '../../learning/components/exercises/FlashcardExercise';
import { MatchWordExercise } from '../../learning/components/exercises/MatchWordExercise';
import { SpeakingExercise } from '../../learning/components/exercises/SpeakingExercise';
import { ReorderExercise } from '../../learning/components/exercises/ReorderExercise';
import { DragDropExercise } from '../../learning/components/exercises/DragDropExercise';
import { GrammarExercise } from '../../learning/components/exercises/GrammarExercise';
import { FillInBlankExercise } from '../../learning/components/exercises/FillInBlankExercise';
import { ReorderSentenceExercise } from '../../learning/components/exercises/ReorderSentenceExercise';
import { SpeakingSentenceExercise } from '../../learning/components/exercises/SpeakingSentenceExercise';
import { ConversationExercise } from '../../learning/components/exercises/ConversationExercise';
import { CongratulationScreen } from '../../learning/components/ui/CongratulationScreen';

interface MistakePracticePlayerProps {
  mistakes: MistakeItem[];
  onClose: () => void;
  onFinished: (stats: { total: number; mastered: number; score: number }) => void;
  /** Khi true: không gọi API cập nhật status (dùng khi luyện tập cá nhân hoá) */
  skipStatusUpdate?: boolean;
}

const getAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
};

interface PracticeRound {
  roundType: number;
  items: MistakeItem[];
}

export const MistakePracticePlayer: React.FC<MistakePracticePlayerProps> = ({
  mistakes,
  onClose,
  onFinished,
  skipStatusUpdate = false,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundProgress, setRoundProgress] = useState({ current: 0, total: 1 });
  const [showExitModal, setShowExitModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Nhóm các câu sai theo roundType liên tiếp thành các vòng học hoàn chỉnh
  const rounds: PracticeRound[] = useMemo(() => {
    if (!mistakes || mistakes.length === 0) return [];
    const result: PracticeRound[] = [];
    mistakes.forEach((m) => {
      const last = result[result.length - 1];
      const rType = m.roundType || 4;
      if (last && last.roundType === rType) {
        last.items.push(m);
      } else {
        result.push({ roundType: rType, items: [m] });
      }
    });
    return result;
  }, [mistakes]);

  const currentRound = rounds[currentRoundIndex];

  // Tính toán phần trăm tiến độ bài học mượt mà dựa trên số câu
  const completedItemsBeforeCurrentRound = useMemo(() => {
    return rounds.slice(0, currentRoundIndex).reduce((sum, r) => sum + r.items.length, 0);
  }, [rounds, currentRoundIndex]);

  const totalMistakesCount = mistakes.length;

  const progressPercent = useMemo(() => {
    if (totalMistakesCount === 0) return 100;
    const progressInCurrentRound = roundProgress.current;
    const completedTotal = completedItemsBeforeCurrentRound + progressInCurrentRound;
    return Math.min(100, Math.round((completedTotal / totalMistakesCount) * 100));
  }, [completedItemsBeforeCurrentRound, roundProgress.current, totalMistakesCount]);

  // Xử lý khi hoàn thành một vòng luyện tập
  const handleRoundComplete = useCallback(async () => {
    if (!currentRound) return;

    // Cập nhật mastered status cho các item trong vòng nếu không skip
    if (!skipStatusUpdate) {
      await Promise.allSettled(
        currentRound.items.map((item) =>
          mistakeApi.submitPracticeStep(item.id, true).catch((e) => {
            console.warn('Lỗi submit practice step:', e);
          })
        )
      );
    }

    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setRoundProgress({ current: 0, total: 1 });
    } else {
      setIsFinished(true);
      onFinished({
        total: totalMistakesCount,
        mastered: totalMistakesCount,
        score: totalMistakesCount * 20,
      });
    }
  }, [currentRound, currentRoundIndex, rounds.length, skipStatusUpdate, totalMistakesCount, onFinished]);

  // Xử lý khi làm sai trong bài tập
  const handleMistake = useCallback(
    async (mistakeData?: MistakeCreatePayload) => {
      if (!skipStatusUpdate && mistakeData?.questionId) {
        try {
          await mistakeApi.submitPracticeStep(mistakeData.questionId, false);
        } catch (err) {
          console.warn('Lỗi ghi nhận sai khi luyện tập:', err);
        }
      }
    },
    [skipStatusUpdate]
  );

  // Callback nhận tiến độ từ từng component bài tập
  const handleProgress = useCallback((current: number, total: number) => {
    setRoundProgress({ current, total: Math.max(1, total) });
  }, []);

  // Danh sách từ vựng cho các vòng 1, 2, 3, 4
  const currentRoundVocabs: Vocabulary[] = useMemo(() => {
    if (!currentRound) return [];
    return currentRound.items.map((m, idx) => ({
      id: m.questionId || m.id || idx + 1,
      word: m.contentText || m.keyword || '',
      translation: m.translation || '',
      imageUrl: m.imageUrl ? getAssetUrl(m.imageUrl) : undefined,
      audioUrl: m.audioUrl ? getAssetUrl(m.audioUrl) : undefined,
    }));
  }, [currentRound]);

  // Payload cho các dạng bài nâng cao (vòng 5, 6, 7, 8, 9, 10)
  const currentRoundPayload: SessionPayload = useMemo(() => {
    if (!currentRound) return {};
    const items = currentRound.items;

    // 1. Ưu tiên hàng đầu: Lấy trực tiếp payload gốc của Session từ CSDL
    for (const m of items) {
      if (m.sessionPayload) {
        try {
          const raw = typeof m.sessionPayload === 'string' ? JSON.parse(m.sessionPayload) : m.sessionPayload;
          if (raw && (raw.items || raw.blocks || raw.coordinates)) {
            const resolved: SessionPayload = { ...raw };
            if (Array.isArray(resolved.items)) {
              resolved.items = resolved.items.map((it: any) => ({
                ...it,
                image_url: it.image_url ? getAssetUrl(it.image_url) : it.image_url,
                audio_url: it.audio_url ? getAssetUrl(it.audio_url) : it.audio_url,
                question: it.question ? {
                  ...it.question,
                  audio_url: it.question.audio_url ? getAssetUrl(it.question.audio_url) : it.question.audio_url,
                } : it.question,
                answer: it.answer && typeof it.answer === 'object' ? {
                  ...it.answer,
                  audio_url: it.answer.audio_url ? getAssetUrl(it.answer.audio_url) : it.answer.audio_url,
                } : it.answer,
                distractor: it.distractor && typeof it.distractor === 'object' ? {
                  ...it.distractor,
                  audio_url: it.distractor.audio_url ? getAssetUrl(it.distractor.audio_url) : it.distractor.audio_url,
                } : it.distractor,
              }));
            }
            return resolved;
          }
        } catch (e) {
          console.warn('Lỗi khi phân giải sessionPayload gốc:', e);
        }
      }
    }

    // 2. Dự phòng: Tổng hợp từ phonemeErrorType hoặc dữ liệu câu sai nếu chưa có sessionPayload
    // Vòng 7: Fill In Blank (Điền từ vào chỗ trống)
    if (currentRound.roundType === 7) {
      return {
        items: items.map((m, idx) => {
          const wordText = m.contentText || m.keyword || '';
          let sentence = m.contentText || `[${wordText}]`;
          let answer = wordText;
          let distractors: string[] = [];
          let imageUrl = m.imageUrl || '';
          let audioUrl = m.audioUrl || '';

          if (m.phonemeErrorType) {
            try {
              const parsed = JSON.parse(m.phonemeErrorType);
              if (parsed.sentence) sentence = parsed.sentence;
              if (parsed.answer) answer = parsed.answer;
              if (Array.isArray(parsed.distractors)) distractors = parsed.distractors;
              if (parsed.imageUrl) imageUrl = parsed.imageUrl;
              if (parsed.audioUrl) audioUrl = parsed.audioUrl;
            } catch {}
          }

          if (!distractors || distractors.length === 0) {
            const otherWords = mistakes
              .filter((other) => other.id !== m.id)
              .map((other) => other.contentText || other.keyword)
              .filter(Boolean);
            distractors = Array.from(new Set(otherWords)).slice(0, 3);
          }

          // Đảm bảo câu có dấu ngoặc vuông bao quanh vị trí điền
          if (!sentence.includes('[')) {
            if (answer && sentence.toLowerCase().includes(answer.toLowerCase())) {
              const regex = new RegExp(`(${answer})`, 'i');
              sentence = sentence.replace(regex, '[$1]');
            } else {
              sentence = `[${sentence}]`;
            }
          }

          return {
            order: idx + 1,
            sentence,
            image_url: getAssetUrl(imageUrl),
            audio_url: getAssetUrl(audioUrl),
            answer,
            distractors: distractors.filter((d) => d && d.toLowerCase() !== answer.toLowerCase()),
          };
        }),
      };
    }

    // Vòng 8: Reorder Sentence (Sắp xếp câu)
    if (currentRound.roundType === 8) {
      return {
        items: items.map((m, idx) => {
          let sentence = m.contentText || m.keyword || '';
          let imageUrl = m.imageUrl || '';
          let audioUrl = m.audioUrl || '';

          if (m.phonemeErrorType) {
            try {
              const parsed = JSON.parse(m.phonemeErrorType);
              if (parsed.sentence) sentence = parsed.sentence;
              if (parsed.imageUrl) imageUrl = parsed.imageUrl;
              if (parsed.audioUrl) audioUrl = parsed.audioUrl;
            } catch {
              if (m.phonemeErrorType.trim().length > 0) {
                sentence = m.phonemeErrorType.trim();
              }
            }
          }

          return {
            order: idx + 1,
            sentence,
            image_url: getAssetUrl(imageUrl),
            audio_url: getAssetUrl(audioUrl),
          };
        }),
      };
    }

    // Vòng 9: Speaking Sentence (Luyện nói câu)
    if (currentRound.roundType === 9) {
      return {
        items: items.map((m, idx) => {
          let sentence = m.contentText || m.keyword || '';
          let imageUrl = m.imageUrl || '';
          let audioUrl = m.audioUrl || '';

          if (m.phonemeErrorType) {
            try {
              const parsed = JSON.parse(m.phonemeErrorType);
              if (parsed.sentence) sentence = parsed.sentence;
              if (parsed.imageUrl) imageUrl = parsed.imageUrl;
              if (parsed.audioUrl) audioUrl = parsed.audioUrl;
            } catch {
              if (m.phonemeErrorType.trim().length > 0) {
                sentence = m.phonemeErrorType.trim();
              }
            }
          }

          return {
            order: idx + 1,
            sentence,
            image_url: getAssetUrl(imageUrl),
            audio_url: getAssetUrl(audioUrl),
          };
        }),
      };
    }

    // Vòng 10: Conversation (Hội thoại đọc hiểu)
    if (currentRound.roundType === 10) {
      return {
        items: items.map((m, idx) => {
          let questionObj = {
            type: 'question' as const,
            text: m.contentText || 'How are you today?',
            audio_url: m.audioUrl ? getAssetUrl(m.audioUrl) : '',
          };
          let answerObj = {
            type: 'answer' as const,
            text: m.contentText || m.keyword || 'I am fine, thank you.',
            audio_url: m.audioUrl ? getAssetUrl(m.audioUrl) : '',
            is_correct: true,
          };
          let distractorObj = {
            type: 'distractor' as const,
            text: 'No, thank you.',
            audio_url: '',
            is_correct: false,
          };

          if (m.phonemeErrorType) {
            try {
              const parsed = JSON.parse(m.phonemeErrorType);
              if (parsed.question) {
                questionObj = {
                  ...questionObj,
                  ...parsed.question,
                  audio_url: getAssetUrl(parsed.question.audio_url || ''),
                };
              }
              if (parsed.answer) {
                answerObj = {
                  ...answerObj,
                  ...parsed.answer,
                  audio_url: getAssetUrl(parsed.answer.audio_url || ''),
                };
              }
              if (parsed.distractor) {
                distractorObj = {
                  ...distractorObj,
                  ...parsed.distractor,
                  audio_url: getAssetUrl(parsed.distractor.audio_url || ''),
                };
              }
            } catch {}
          }

          return {
            order: idx + 1,
            question: questionObj,
            answer: answerObj,
            distractor: distractorObj,
          };
        }),
      };
    }

    // Vòng 6: Grammar (Ngữ pháp trắc nghiệm)
    if (currentRound.roundType === 6) {
      return {
        title: 'Ôn tập Ngữ pháp',
        blocks: items.map((m, idx) => {
          const wordText = m.contentText || m.keyword || '';
          const otherWords = mistakes
            .filter((other) => other.id !== m.id)
            .map((other) => other.contentText || other.keyword)
            .filter(Boolean);
          const optionsList = [wordText, ...otherWords.slice(0, 3)];
          return {
            order: idx + 1,
            type: 'QUESTION' as const,
            text: m.contentText || `Chọn từ đúng: []`,
            audio_url: m.audioUrl ? getAssetUrl(m.audioUrl) : undefined,
            options: optionsList.map((opt, optIdx) => ({
              id: String(optIdx),
              text: opt,
              is_correct: opt.toLowerCase() === wordText.toLowerCase(),
            })),
          };
        }),
      };
    }

    // Vòng 5: Drag & Drop (Kéo thả toạ độ)
    if (currentRound.roundType === 5) {
      return {
        image_url: items[0]?.imageUrl ? getAssetUrl(items[0].imageUrl) : '',
        audio_url: items[0]?.audioUrl ? getAssetUrl(items[0].audioUrl) : '',
        coordinates: items.map((m) => ({
          word: m.contentText || m.keyword || '',
          x: 0.35,
          y: 0.35,
          width: 0.3,
          height: 0.3,
        })),
      };
    }

    return {};
  }, [currentRound, mistakes]);

  // ──────────────────────────────────────────────
  // Màn hình kết thúc
  // ──────────────────────────────────────────────
  if (!currentRound || isFinished) {
    return <CongratulationScreen onNext={onClose} />;
  }

  // ──────────────────────────────────────────────
  // Header chuẩn giống SessionPlayer
  // ──────────────────────────────────────────────
  const Header = () => (
    <div className="session-player-header sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs flex items-center gap-4 px-4 md:px-8 py-3 shrink-0">
      <button
        id="session-player-exit-btn"
        className="session-exit-btn p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-700"
        onClick={() => setShowExitModal(true)}
        aria-label="Thoát ôn tập"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      <div className="session-progress-bar flex-1 h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
        <div 
          className="session-progress-fill h-full bg-[#ff5e97] rounded-full transition-all duration-300" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>
    </div>
  );

  // ──────────────────────────────────────────────
  // Chọn Exercise Component theo roundType thực tế
  // ──────────────────────────────────────────────
  const renderExercise = () => {
    const roundKey = `round-${currentRoundIndex}-${currentRound.roundType}`;

    switch (currentRound.roundType) {
      case 1: // FLASHCARD
        return (
          <FlashcardExercise
            key={roundKey}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onProgress={handleProgress}
          />
        );

      case 2: // MATCH_WORD
        return (
          <MatchWordExercise
            key={roundKey}
            partId={0}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 3: // SPEAKING
        return (
          <SpeakingExercise
            key={roundKey}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 4: // RE_ORDER
        return (
          <ReorderExercise
            key={roundKey}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 5: // DRAG_DROP
        return (
          <DragDropExercise
            key={roundKey}
            payload={currentRoundPayload}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 6: // GRAMMAR
        return (
          <GrammarExercise
            key={roundKey}
            payload={currentRoundPayload}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 7: // FILL_IN_BLANK
        return (
          <FillInBlankExercise
            key={roundKey}
            payload={currentRoundPayload}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 8: // RE_ORDER_SENTENCE
        return (
          <ReorderSentenceExercise
            key={roundKey}
            payload={currentRoundPayload}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 9: // SPEAKING_SENTENCE
        return (
          <SpeakingSentenceExercise
            key={roundKey}
            payload={currentRoundPayload}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      case 10: // CONVERSATION
        return (
          <ConversationExercise
            key={roundKey}
            payload={currentRoundPayload}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );

      default:
        return (
          <ReorderExercise
            key={roundKey}
            vocabularies={currentRoundVocabs}
            onComplete={handleRoundComplete}
            onMistake={handleMistake}
            onProgress={handleProgress}
          />
        );
    }
  };

  // ──────────────────────────────────────────────
  // Exit Modal
  // ──────────────────────────────────────────────
  const ExitModal = () => (
    <div 
      className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={() => setShowExitModal(false)}
    >
      <div 
        className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center animate-in zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800">Dừng luyện tập?</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Tiến độ của các câu chưa hoàn thành sẽ không được lưu. Bé có chắc muốn dừng không?
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button 
            id="exit-modal-stay-btn" 
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-colors" 
            onClick={() => setShowExitModal(false)}
          >
            Tiếp tục ôn
          </button>
          <button 
            id="exit-modal-leave-btn" 
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#ff5e97] hover:bg-[#e84c85] text-white font-bold text-xs cursor-pointer transition-colors shadow-xs" 
            onClick={onClose}
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8fafc] flex flex-col overflow-y-auto session-player">
      <Header />

      <div className="session-exercise-area flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 py-6 pb-32">
        {renderExercise()}
      </div>

      {showExitModal && <ExitModal />}
    </div>
  );
};
