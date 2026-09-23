import React, { useState, useEffect, useCallback } from 'react';
import type { Vocabulary } from '../../types';

interface MatchWordExerciseProps {
  partId: number;
  vocabularies: Vocabulary[];   // được fetch sẵn từ SessionPlayer
  onComplete: () => void;
  onProgress?: (current: number, total: number) => void;
}

interface MatchState {
  selectedImageId: number | null;
  selectedWordId:  number | null;
  matchedIds:      Set<number>;
}

export const MatchWordExercise: React.FC<MatchWordExerciseProps> = ({
  vocabularies,
  onComplete,
  onProgress
}) => {
  // Xáo trộn ảnh và từ riêng lẻ để trẻ khó đoán
  const [shuffledImages] = useState(() => [...vocabularies].sort(() => Math.random() - 0.5));
  const [shuffledWords]  = useState(() => [...vocabularies].sort(() => Math.random() - 0.5));

  const [state, setState] = useState<MatchState>({
    selectedImageId: null,
    selectedWordId: null,
    matchedIds: new Set(),
  });

  const [wrongFlash, setWrongFlash] = useState<number | null>(null);

  // Kiểm tra ghép cặp mỗi khi cả 2 đều được chọn
  useEffect(() => {
    const { selectedImageId, selectedWordId } = state;
    if (selectedImageId === null || selectedWordId === null) return;

    const timer = setTimeout(() => {
      if (selectedImageId === selectedWordId) {
        // Đúng: thêm vào matched set
        setState(prev => {
          const newMatchedIds = new Set([...prev.matchedIds, selectedImageId]);
          if (onProgress) onProgress(newMatchedIds.size, vocabularies.length);
          return {
            selectedImageId: null,
            selectedWordId: null,
            matchedIds: newMatchedIds,
          };
        });
      } else {
        // Sai: flash đỏ rồi bỏ chọn
        setWrongFlash(selectedWordId);
        setTimeout(() => {
          setWrongFlash(null);
          setState(prev => ({ ...prev, selectedImageId: null, selectedWordId: null }));
        }, 700);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [state.selectedImageId, state.selectedWordId, vocabularies.length, onProgress]);

  // Khi tất cả đều khớp → hoàn thành
  useEffect(() => {
    if (vocabularies.length > 0 && state.matchedIds.size === vocabularies.length) {
      const t = setTimeout(onComplete, 800);
      return () => clearTimeout(t);
    }
  }, [state.matchedIds.size, vocabularies.length, onComplete]);

  const handleSelectImage = useCallback((id: number) => {
    if (state.matchedIds.has(id)) return;
    setState(prev => ({ ...prev, selectedImageId: prev.selectedImageId === id ? null : id }));
  }, [state.matchedIds]);

  const handleSelectWord = useCallback((id: number) => {
    if (state.matchedIds.has(id)) return;
    setState(prev => ({ ...prev, selectedWordId: prev.selectedWordId === id ? null : id }));
  }, [state.matchedIds]);

  const isMatched = (id: number) => state.matchedIds.has(id);

  return (
    <div className="matchword-exercise">
      <p className="exercise-instruction">Ghép từ với ảnh đúng 🎯</p>

      {/* Dãy ảnh */}
      <div className="matchword-images">
        {shuffledImages.map(v => (
          <button
            key={v.id}
            className={[
              'matchword-img-btn',
              isMatched(v.id)           ? 'matched'   : '',
              state.selectedImageId === v.id ? 'selected' : '',
            ].join(' ')}
            onClick={() => handleSelectImage(v.id)}
            disabled={isMatched(v.id)}
          >
            {v.imageUrl
              ? <img src={v.imageUrl} alt={v.word} />
              : <span className="matchword-placeholder">🖼️</span>
            }
          </button>
        ))}
      </div>

      {/* Dãy từ */}
      <div className="matchword-words">
        {shuffledWords.map(v => (
          <button
            key={v.id}
            className={[
              'matchword-word-btn',
              isMatched(v.id)               ? 'matched'   : '',
              state.selectedWordId === v.id  ? 'selected'  : '',
              wrongFlash === v.id            ? 'wrong'     : '',
            ].join(' ')}
            onClick={() => handleSelectWord(v.id)}
            disabled={isMatched(v.id)}
          >
            {v.word}
          </button>
        ))}
      </div>

      <p className="matchword-progress">
        {state.matchedIds.size} / {vocabularies.length} cặp đúng
      </p>
    </div>
  );
};
