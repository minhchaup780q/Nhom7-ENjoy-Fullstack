import React, { useState, useEffect, useMemo } from 'react';
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
  /** Khi true: không gọi API cập nhật status (dùng khi luyện tập cá nhân hoá) */
  skipStatusUpdate?: boolean;
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
  1: 'Vòng 1: Học từ vựng',
  2: 'Vòng 2: Nối từ vựng',
  3: 'Vòng 3: Luyện nói',
  4: 'Vòng 4: Sắp xếp chữ cái',
  5: 'Vòng 5: Kéo thả toạ độ',
  6: 'Vòng 6: Ngữ pháp trắc nghiệm',
  7: 'Vòng 7: Điền từ vào chỗ trống',
};

export const MistakePracticePlayer: React.FC<MistakePracticePlayerProps> = ({
  mistakes,
  onClose,
  onFinished,
  skipStatusUpdate = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    // Chỉ gọi API cập nhật status khi KHÔNG phải chế độ luyện cá nhân hoá
    if (!skipStatusUpdate) {
      try {
        await mistakeApi.submitPracticeStep(currentItem.id, true);
      } catch (err) {
        console.warn('Lỗi khi nộp kết quả luyện tập:', err);
      }
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
    // Chỉ gọi API cập nhật status khi KHÔNG phải chế độ luyện cá nhân hoá
    if (!skipStatusUpdate) {
      try {
        await mistakeApi.submitPracticeStep(currentItem.id, false);
      } catch (err) {
        console.warn('Lỗi khi ghi nhận sai trong lúc luyện tập:', err);
      }
    }
    // Không trừ mạng, chỉ ghi nhận sai để chuyển câu tiếp theo
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      onFinished({ total: mistakes.length, mastered: masteredCount, score: totalScore });
    }
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
      imageUrl: currentItem.imageUrl ? getAssetUrl(currentItem.imageUrl) : undefined,
      audioUrl: currentItem.audioUrl ? getAssetUrl(currentItem.audioUrl) : undefined,
    };
  }, [currentItem]);

  // Danh sách từ vựng cho bài tập ghép cặp (Vòng 2) - Lấy trực tiếp từ vựng của câu sai
  const matchVocabs: Vocabulary[] = useMemo(() => {
    if (!currentItem) return [];
    return [currentVocab];
  }, [currentVocab, currentItem]);

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
    return <CongratulationScreen onNext={onClose} />;
  }

  // ──────────────────────────────────────────────
  // Header giống SessionPlayer
  // ──────────────────────────────────────────────
  const Header = () => (
    <div className="session-player-header bg-white border-b border-slate-200 shrink-0">
      <button
        id="practice-player-exit-btn"
        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
        onClick={() => setShowExitModal(true)}
        aria-label="Thoát ôn tập"
      >
        Đóng
      </button>

      <div className="session-progress-bar bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div className="session-progress-fill bg-pink-400" style={{ width: `${progressPercent}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-500">
        {currentIndex + 1} / {mistakes.length}
      </span>
    </div>
  );

  // ──────────────────────────────────────────────
  // Chọn Exercise Component theo roundType thực tế
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
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-y-auto session-player">
      <Header />

      {/* Top Banner Lỗi Sai Trước Đó & Trợ Lý AI */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-display font-black">
            {ROUND_NAMES[currentItem.roundType] || `Vòng ${currentItem.roundType}`}
          </span>
          <span className="text-xs font-bold text-slate-500">
            Câu {currentIndex + 1} / {mistakes.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(currentItem.recognizedAudioTranscript || currentItem.wrongAnswerSubmitted) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-700 font-semibold">
              <span>{currentItem.roundType === 3 || currentItem.recognizedAudioTranscript ? 'Lần trước đọc: ' : 'Lần trước sai: '}</span>
              {isImageUrl(currentItem.wrongAnswerSubmitted) ? (
                <div className="w-6 h-6 rounded border border-pink-300 overflow-hidden inline-flex items-center justify-center bg-white p-0.5">
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
            className="px-3.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-display font-black text-xs transition-all cursor-pointer shadow-xs"
          >
            HỎI AI
          </button>
        </div>
      </div>

      {/* Khu vực trò chơi */}
      <div className="session-exercise-area">
        {renderExercise()}
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <h3 className="text-base font-display font-black text-slate-800">Dừng phiên luyện tập?</h3>
            <p className="text-xs text-slate-500 font-medium">Tiến độ của các câu chưa hoàn thành sẽ không được tính.</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200"
                onClick={() => setShowExitModal(false)}
              >
                Tiếp tục ôn
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs cursor-pointer"
                onClick={onClose}
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Advice Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-display font-black text-slate-800 text-sm uppercase">
                Hướng Dẫn Lỗi Sai Từ AI
              </span>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer text-xs font-bold"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-3">
                  {currentItem.imageUrl && (
                    <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-white p-1">
                      <img
                        src={getAssetUrl(currentItem.imageUrl)}
                        alt="Question"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-slate-800">
                      Từ / Câu chuẩn: <strong className="text-pink-600">{currentItem.contentText || currentItem.keyword}</strong>
                    </p>
                    {currentItem.translation && (
                      <p className="text-slate-500 text-[11px]">({currentItem.translation})</p>
                    )}
                  </div>
                </div>

                {lastWrongAnswer && (
                  <div className="flex items-center gap-2 text-pink-600 font-semibold pt-2 border-t border-slate-200">
                    <span className="shrink-0 text-slate-500 font-medium">Bé đã đọc/chọn:</span>
                    {isImageUrl(lastWrongAnswer) ? (
                      <div className="w-8 h-8 rounded border border-pink-200 overflow-hidden shrink-0 bg-white p-0.5 inline-flex items-center justify-center">
                        <img src={getAssetUrl(lastWrongAnswer)} alt="Wrong" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <strong className="line-through bg-pink-50 px-2 py-0.5 rounded border border-pink-200">{lastWrongAnswer}</strong>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed min-h-[90px] flex items-center">
                {aiLoading ? (
                  <div className="w-full flex flex-col items-center justify-center gap-2 py-3 text-slate-600">
                    <p className="text-xs font-bold text-slate-700">Trợ lý AI đang chuẩn bị lời khuyên...</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 w-full">
                    <p className="font-bold text-slate-800 uppercase text-[11px]">
                      Lời khuyên từ Trợ lý AI:
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                      {aiAdvice || 'Bé hãy chú ý từ vựng và luyện tập lại thật kỹ nhé!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button3D variant="pink" fullWidth size="md" onClick={() => setIsAiModalOpen(false)}>
              ĐÃ HIỂU RỒI!
            </Button3D>
          </div>
        </div>
      )}
    </div>
  );
};
