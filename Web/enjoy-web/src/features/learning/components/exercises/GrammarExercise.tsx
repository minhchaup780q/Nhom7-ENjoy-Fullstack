import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GrammarBlock, GrammarOption, SessionPayload } from '../../types';

interface GrammarExerciseProps {
  payload: SessionPayload;
  onComplete: () => void;
  onMistake: () => void;
  onProgress?: (current: number, total: number) => void;
}

/** Thay thế [] trong text thành _____ */
function formatQuestionText(text: string): string {
  return text.replace(/\[\]/g, '_____');
}

/** Tự động play audio, trả về ref cleanup */
function playAudio(url: string): void {
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

interface QuestionState {
  selectedId: string | null;    // id đáp án đã chọn (null nếu chưa chọn)
  isCorrect: boolean;           // đã chọn đúng chưa
}

export const GrammarExercise: React.FC<GrammarExerciseProps> = ({
  payload,
  onComplete,
  onMistake,
  onProgress,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = payload as any;
  const blocks: GrammarBlock[] = Array.isArray(raw?.blocks) ? raw.blocks : [];
  const title: string = raw?.title ?? '';

  // Số block đang hiển thị (bắt đầu từ 1)
  const [visibleCount, setVisibleCount] = useState(1);

  // Trạng thái câu hỏi: key = index block, value = QuestionState
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});

  // Ref để auto-scroll xuống cuối khi thêm block mới
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ref để tracking audio đang phát (để tránh chồng chéo audio)
  const playedAudioIndexes = useRef<Set<number>>(new Set());

  const visibleBlocks = blocks.slice(0, visibleCount);
  const currentIndex = visibleCount - 1;
  const currentBlock = blocks[currentIndex];
  const isLastBlock = visibleCount >= blocks.length;

  // Kiểm tra xem block hiện tại có cần đợi người dùng trả lời đúng không
  const isCurrentBlockAnswered = useCallback((): boolean => {
    if (!currentBlock) return true;
    if (currentBlock.type !== 'QUESTION') return true;
    return questionStates[currentIndex]?.isCorrect === true;
  }, [currentBlock, currentIndex, questionStates]);

  // Auto-scroll khi thêm block mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount]);

  // Auto-play audio khi block TEXT_SPEECH được hiển thị
  useEffect(() => {
    const lastIndex = visibleCount - 1;
    const lastBlock = blocks[lastIndex];
    if (
      lastBlock?.type === 'TEXT_SPEECH' &&
      lastBlock.audio_url &&
      !playedAudioIndexes.current.has(lastIndex)
    ) {
      playedAudioIndexes.current.add(lastIndex);
      // Delay nhỏ để đảm bảo animation render xong
      setTimeout(() => playAudio(lastBlock.audio_url!), 300);
    }
  }, [visibleCount, blocks]);

  // Cập nhật progress
  useEffect(() => {
    if (onProgress) onProgress(visibleCount, blocks.length);
  }, [visibleCount, blocks.length, onProgress]);

  const handleNext = () => {
    if (!isCurrentBlockAnswered()) return;
    if (isLastBlock) {
      onComplete();
    } else {
      setVisibleCount(prev => prev + 1);
    }
  };

  const handleSelectOption = (blockIndex: number, option: GrammarOption) => {
    // Nếu đã trả lời đúng rồi thì không cho chọn lại
    if (questionStates[blockIndex]?.isCorrect) return;

    if (option.is_correct) {
      setQuestionStates(prev => ({
        ...prev,
        [blockIndex]: { selectedId: option.id, isCorrect: true },
      }));
    } else {
      // Chọn sai: đánh dấu sai option này, cho phép thử lại
      onMistake();
      setQuestionStates(prev => ({
        ...prev,
        [blockIndex]: { selectedId: option.id, isCorrect: false },
      }));
    }
  };

  const canProceed = isCurrentBlockAnswered();

  const renderBlock = (block: GrammarBlock, index: number) => {
    const key = `block-${index}`;

    switch (block.type) {
      case 'TEXT_SPEECH':
        return (
          <div key={key} className="grammar-block grammar-block-enter">
            <div className="grammar-bubble-left">
              <span className="grammar-bubble-icon">🗣️</span>
              <p className="grammar-bubble-text">{block.text}</p>
            </div>
          </div>
        );

      case 'IMAGE':
        return (
          <div key={key} className="grammar-block grammar-block-enter grammar-center">
            <img
              src={block.image_url}
              alt="Grammar illustration"
              className="grammar-image"
            />
          </div>
        );

      case 'EXPLANATION':
        return (
          <div key={key} className="grammar-block grammar-block-enter grammar-center">
            <p className="grammar-explanation">{block.text}</p>
          </div>
        );

      case 'QUESTION': {
        const qState = questionStates[index];
        const displayText = formatQuestionText(block.text ?? '');

        return (
          <div key={key} className="grammar-block grammar-block-enter">
            <div className="grammar-question-card">
              {block.audio_url && (
                <button
                  className="grammar-audio-btn"
                  onClick={() => playAudio(block.audio_url!)}
                  title="Nghe lại"
                >
                  🔊
                </button>
              )}
              <p className="grammar-question-text">{displayText}</p>
              <div className="grammar-options">
                {(block.options ?? []).map((opt) => {
                  const isSelected = qState?.selectedId === opt.id;
                  const isAnsweredCorrectly = qState?.isCorrect;

                  let btnClass = 'grammar-option-btn';
                  if (isAnsweredCorrectly && opt.is_correct) {
                    btnClass += ' correct';
                  } else if (isSelected && !isAnsweredCorrectly) {
                    // Đây là nút đã chọn nhưng sai
                    btnClass += ' incorrect';
                  }

                  // Nếu đã trả lời đúng thì disable hết
                  const disabled = isAnsweredCorrectly === true;

                  return (
                    <button
                      key={opt.id}
                      className={btnClass}
                      disabled={disabled}
                      onClick={() => handleSelectOption(index, opt)}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="grammar-exercise">
      {title && <h3 className="grammar-title">{title}</h3>}

      <div className="grammar-blocks-container">
        {visibleBlocks.map((block, index) => renderBlock(block, index))}

        {/* Nút Tiếp tục nằm ngay dưới block cuối cùng */}
        <div className="grammar-next-area" ref={bottomRef}>
          <button
            className={`grammar-next-btn ${canProceed ? '' : 'disabled'}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastBlock ? 'Hoàn thành ✓' : 'Tiếp tục →'}
          </button>
        </div>
      </div>
    </div>
  );
};
