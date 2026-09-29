import React, { useState, useEffect, useRef } from 'react';
import type { Vocabulary } from '../../types';
import type { MistakeCreatePayload } from '../../services/mistakeApi';
import { ExerciseFooter, type FooterStatus } from '../ui/ExerciseFooter';

interface MatchWordExerciseProps {
  partId?: number;
  vocabularies: Vocabulary[];
  onComplete: () => void;
  onMistake?: (data: MistakeCreatePayload) => void;
  onProgress?: (current: number, total: number) => void;
}

export const MatchWordExercise: React.FC<MatchWordExerciseProps> = ({
  vocabularies,
  onComplete,
  onMistake,
  onProgress
}) => {
  // Xáo trộn ảnh và từ riêng biệt
  const [shuffledImages] = useState(() => [...vocabularies].sort(() => Math.random() - 0.5));
  const [shuffledWords]  = useState(() => [...vocabularies].sort(() => Math.random() - 0.5));

  // Trạng thái đang chọn
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);

  // Tập hợp các ID đã ghép đúng (mờ xám - không cho chọn nữa)
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());

  // Hiệu ứng chớp nhoáng khi chọn đúng hoặc sai
  const [correctFlash, setCorrectFlash] = useState<{ imageId: number; wordId: number } | null>(null);
  const [wrongFlash, setWrongFlash] = useState<{ imageId: number; wordId: number } | null>(null);

  // Trạng thái footer chung
  const [footerStatus, setFooterStatus] = useState<FooterStatus>('idle');

  // Helper chia mảng thành 2 hàng theo quy tắc:
  // Nếu <= 5 từ thì giữ 1 hàng.
  // Nếu > 5 từ: hàng 1 có Math.floor(N/2), hàng 2 có phần còn lại Math.ceil(N/2)
  // Ví dụ 6 -> 3,3 | 7 -> 3,4 | 8 -> 4,4 | 10 -> 5,5
  const splitIntoTwoRows = <T,>(items: T[]): [T[], T[]] => {
    if (items.length <= 5) {
      return [items, []];
    }
    const mid = Math.floor(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
  };

  const [imagesRow1, imagesRow2] = splitIntoTwoRows(shuffledImages);
  const [wordsRow1, wordsRow2] = splitIntoTwoRows(shuffledWords);

  // Phát âm thanh khi ghép đúng
  const playWordAudio = (word?: string, audioUrl?: string) => {
    if (!word) return;
    if (audioUrl) {
      const safeUrl = audioUrl.replace(/ /g, '%20');
      new Audio(safeUrl).play().catch(() => fallbackSpeech(word));
    } else {
      fallbackSpeech(word);
    }
  };

  const fallbackSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const onMistakeRef = useRef(onMistake);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onMistakeRef.current = onMistake;
    onProgressRef.current = onProgress;
  }, [onMistake, onProgress]);

  // Kiểm tra ghép cặp mỗi khi cả 2 mục được chọn
  useEffect(() => {
    if (selectedImageId === null || selectedWordId === null) return;

    if (selectedImageId === selectedWordId) {
      // ĐÚNG: mờ nhẹ một lớp màu xanh trong chớp nhoáng cùng với đáp án đó
      setCorrectFlash({ imageId: selectedImageId, wordId: selectedWordId });

      const vocab = vocabularies.find(v => v.id === selectedWordId);
      if (vocab) {
        playWordAudio(vocab.word, vocab.audioUrl);
      }

      const timer = setTimeout(() => {
        setMatchedIds(prev => {
          const next = new Set(prev);
          next.add(selectedImageId);
          if (onProgressRef.current) {
            onProgressRef.current(next.size, vocabularies.length);
          }
          return next;
        });
        setCorrectFlash(null);
        setSelectedImageId(null);
        setSelectedWordId(null);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // SAI: mờ đỏ và phải tự chọn lại
      setWrongFlash({ imageId: selectedImageId, wordId: selectedWordId });

      const wrongWord = vocabularies.find(v => v.id === selectedWordId);
      if (onMistakeRef.current) {
        onMistakeRef.current({
          questionId: selectedImageId,
          roundType: 2,
          wrongAnswerSubmitted: wrongWord?.word || 'Sai',
        });
      }

      const timer = setTimeout(() => {
        setWrongFlash(null);
        setSelectedImageId(null);
        setSelectedWordId(null);
      }, 650);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageId, selectedWordId]);

  // Khi tất cả đều đúng -> hoàn thành bài học, footer bật nút Tiếp tục
  useEffect(() => {
    if (vocabularies.length > 0 && matchedIds.size === vocabularies.length) {
      setFooterStatus('correct');
    } else {
      setFooterStatus('idle');
    }
  }, [matchedIds.size, vocabularies.length]);

  // Click vào ảnh
  const handleImageClick = (imageId: number) => {
    if (correctFlash || wrongFlash || matchedIds.has(imageId)) return;
    setSelectedImageId(prev => (prev === imageId ? null : imageId));
  };

  // Click vào từ
  const handleWordClick = (wordId: number) => {
    if (correctFlash || wrongFlash || matchedIds.has(wordId)) return;
    setSelectedWordId(prev => (prev === wordId ? null : wordId));
  };

  // Render thẻ ảnh
  const renderImageCard = (v: Vocabulary) => {
    const isMatched = matchedIds.has(v.id);
    const isSelected = selectedImageId === v.id;
    const isCorrect = correctFlash?.imageId === v.id;
    const isWrong = wrongFlash?.imageId === v.id;

    let borderClass = 'border-gray-200';
    let bgClass = 'bg-white';
    let ringClass = '';
    let scaleClass = 'hover:scale-[1.02] shadow-sm hover:shadow-md';

    if (isMatched) {
      borderClass = 'border-gray-200';
      bgClass = 'bg-gray-100';
      scaleClass = 'opacity-35 grayscale cursor-not-allowed pointer-events-none shadow-none';
    } else if (isCorrect) {
      borderClass = 'border-[#58cc02]';
      bgClass = 'bg-[#58cc02]/10';
      ringClass = 'ring-4 ring-[#58cc02]/30';
      scaleClass = 'scale-105 shadow-md';
    } else if (isWrong) {
      borderClass = 'border-red-500';
      bgClass = 'bg-red-50';
      ringClass = 'ring-4 ring-red-200';
      scaleClass = 'scale-105 shadow-md animate-shake';
    } else if (isSelected) {
      borderClass = 'border-primary';
      bgClass = 'bg-primary/5';
      ringClass = 'ring-4 ring-primary/20';
      scaleClass = 'scale-105 shadow-md';
    }

    return (
      <button
        key={v.id}
        type="button"
        onClick={() => handleImageClick(v.id)}
        disabled={isMatched || isCorrect || isWrong}
        className={`w-[115px] sm:w-[124px] md:w-[130px] h-28 sm:h-30 md:h-32 rounded-2xl border-2 ${borderClass} ${bgClass} ${ringClass} ${scaleClass} p-2 flex items-center justify-center transition-all overflow-hidden relative cursor-pointer`}
      >
        {v.imageUrl ? (
          <img
            src={v.imageUrl}
            alt={v.word}
            className="w-full h-full object-contain select-none pointer-events-none"
            loading="lazy"
          />
        ) : (
          <span className="text-3xl">🖼️</span>
        )}

        {/* Lớp phủ mờ nhẹ màu xanh trong chớp nhoáng khi chọn đúng */}
        {isCorrect && (
          <div className="absolute inset-0 bg-[#58cc02]/40 backdrop-blur-[0.5px] rounded-2xl animate-fade-in" />
        )}

        {/* Lớp phủ mờ đỏ khi chọn sai */}
        {isWrong && (
          <div className="absolute inset-0 bg-red-500/40 backdrop-blur-[0.5px] rounded-2xl animate-fade-in" />
        )}
      </button>
    );
  };

  // Render nút từ
  const renderWordButton = (w: Vocabulary) => {
    const isMatched = matchedIds.has(w.id);
    const isSelected = selectedWordId === w.id;
    const isCorrect = correctFlash?.wordId === w.id;
    const isWrong = wrongFlash?.wordId === w.id;

    let btnClass = 'bg-white text-text-main border-gray-200 hover:border-primary hover:text-primary active:scale-95 shadow-sm hover:shadow';

    if (isMatched) {
      btnClass = 'opacity-35 bg-gray-100 text-gray-400 border-dashed border-gray-300 cursor-not-allowed pointer-events-none shadow-none';
    } else if (isCorrect) {
      btnClass = 'bg-[#58cc02] text-white border-[#58cc02] ring-4 ring-[#58cc02]/30 scale-105 shadow-md';
    } else if (isWrong) {
      btnClass = 'bg-red-500 text-white border-red-600 ring-4 ring-red-200 scale-105 shadow-md animate-shake';
    } else if (isSelected) {
      btnClass = 'bg-primary text-white border-primary scale-105 shadow-md';
    }

    return (
      <button
        key={w.id}
        type="button"
        onClick={() => handleWordClick(w.id)}
        disabled={isMatched || isCorrect || isWrong}
        className={`px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base md:text-lg font-bold border-2 transition-all cursor-pointer ${btnClass}`}
      >
        {w.word}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center relative animate-fade-in pb-28">
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start gap-6 pt-2 px-2">
        {/* Tiêu đề vòng học */}
        <h2 className="text-xl md:text-2xl font-bold text-text-main text-center tracking-wide">
          Match the words with the correct pictures
        </h2>

        {/* Dãy ảnh chia làm 2 hàng */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Hàng ảnh 1 */}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {imagesRow1.map(v => renderImageCard(v))}
          </div>

          {/* Hàng ảnh 2 (nếu có hơn 5 ảnh) */}
          {imagesRow2.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {imagesRow2.map(v => renderImageCard(v))}
            </div>
          )}
        </div>

        {/* Dãy đáp án chia làm 2 hàng */}
        <div className="flex flex-col items-center gap-2.5 w-full mt-2">
          {/* Hàng đáp án 1 */}
          <div className="flex flex-wrap justify-center gap-2.5 w-full">
            {wordsRow1.map(w => renderWordButton(w))}
          </div>

          {/* Hàng đáp án 2 (nếu có hơn 5 từ) */}
          {wordsRow2.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2.5 w-full">
              {wordsRow2.map(w => renderWordButton(w))}
            </div>
          )}
        </div>
      </div>

      {/* Footer chung: không có nút thử lại, phải làm đúng hết mới có nút Tiếp tục để qua vòng */}
      <div className="fixed bottom-0 left-0 w-full z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <ExerciseFooter
          status={footerStatus}
          onCheck={() => {}}
          onNext={onComplete}
          disabled={matchedIds.size < vocabularies.length}
          nextLabel="Hoàn thành"
          customMessage="Hãy ghép các từ với hình ảnh đúng nhé!"
        />
      </div>
    </div>
  );
};
