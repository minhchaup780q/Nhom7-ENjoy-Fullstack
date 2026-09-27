import React, { useState, useEffect } from 'react';
import type { SessionPayload } from '../../types';

interface DragDropExerciseProps {
  payload: SessionPayload;
  onComplete: () => void;
  onMistake: () => void;
  onProgress?: (current: number, total: number) => void;
}

export const DragDropExercise: React.FC<DragDropExerciseProps> = ({
  payload,
  onComplete,
  onMistake,
  onProgress
}) => {
  // Debug: log raw payload to check what comes from API
  console.log('[DragDropExercise] payload received:', JSON.stringify(payload, null, 2));
  
  // Defensive: payload may be a JsonNode object with different property access patterns
  // Try direct access first, then try to handle edge cases
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = payload as any;
  const imageUrl: string = raw?.image_url ?? raw?.imageUrl ?? '';
  const audioUrl: string = raw?.audio_url ?? raw?.audioUrl ?? '';
  
  // coordinates can be a proper array or need extraction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawCoords: any[] = [];
  if (Array.isArray(raw?.coordinates)) {
    rawCoords = raw.coordinates;
  }
  console.log('[DragDropExercise] imageUrl:', imageUrl, '| coords count:', rawCoords.length);

  const coords = rawCoords as { word: string; x: number; y: number; width: number; height: number }[];
  
  // List of words to drag, taken directly from payload coordinates, shuffled
  const [draggableWords] = useState(() => 
    coords.map(c => c.word).sort(() => Math.random() - 0.5)
  );

  // State maps coordinate index to the word placed in it
  const [placedWords, setPlacedWords] = useState<Record<number, string>>({});
  
  // State for wrong boxes (indices)
  const [wrongBoxes, setWrongBoxes] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Auto play audio when component mounts
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {});
    }
  }, [audioUrl]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string, sourceIndex?: number) => {
    e.dataTransfer.setData('text/plain', word);
    if (sourceIndex !== undefined) {
      e.dataTransfer.setData('source-index', sourceIndex.toString());
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (checked && isCorrect) return; // Prevent changes if already correct

    const word = e.dataTransfer.getData('text/plain');
    const sourceIndexStr = e.dataTransfer.getData('source-index');

    if (!word) return;

    setPlacedWords(prev => {
      const newPlaced = { ...prev };
      
      // If word came from another box, empty the source box
      if (sourceIndexStr) {
        const sourceIndex = parseInt(sourceIndexStr, 10);
        if (sourceIndex !== targetIndex) {
          delete newPlaced[sourceIndex];
        }
      }

      // If the target box already had a word, we just overwrite it.
      // The old word goes back to the list automatically (because it's not in placedWords anymore).
      newPlaced[targetIndex] = word;
      
      if (onProgress) {
        onProgress(Object.keys(newPlaced).length, coords.length);
      }

      return newPlaced;
    });

    // Reset check state if they modify something
    if (checked) {
      setChecked(false);
      setWrongBoxes([]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // allow dropping
  };

  const handleRemoveWord = (index: number) => {
    if (checked && isCorrect) return;
    setPlacedWords(prev => {
      const newPlaced = { ...prev };
      delete newPlaced[index];
      if (onProgress) {
        onProgress(Object.keys(newPlaced).length, coords.length);
      }
      return newPlaced;
    });
    if (checked) {
      setChecked(false);
      setWrongBoxes([]);
    }
  };

  const handleCheck = () => {
    let hasMistake = false;
    const mistakes: number[] = [];

    coords.forEach((c, index) => {
      if (placedWords[index]?.toLowerCase() !== c.word.toLowerCase()) {
        hasMistake = true;
        mistakes.push(index);
      }
    });

    setChecked(true);

    if (hasMistake) {
      setWrongBoxes(mistakes);
      setIsCorrect(false);
      onMistake();
    } else {
      setWrongBoxes([]);
      setIsCorrect(true);
    }
  };

  // Find which words are currently placed in boxes
  const placedWordsArray = Object.values(placedWords);

  return (
    <div className="dragdrop-exercise">
      <p className="exercise-instruction">Kéo các từ vựng vào đúng vị trí trên bức tranh</p>
      
      <div className="dragdrop-container">
        {/* Left Side: Image with drop zones */}
        <div className="dragdrop-image-area">
          <img 
            src={imageUrl} 
            alt="Drag Drop Context" 
            className="dragdrop-main-image"
          />
          
          {coords.map((coord, index) => {
            const isWrong = wrongBoxes.includes(index);
            const currentWord = placedWords[index];

            return (
              <div
                key={index}
                className={`dragdrop-box ${isWrong ? 'box-wrong animate-shake' : ''} ${currentWord ? 'box-filled' : ''} ${checked && isCorrect ? 'box-correct' : ''}`}
                style={{
                  left: `${coord.x * 100}%`,
                  top: `${coord.y * 100}%`,
                  width: `${coord.width * 100}%`,
                  height: `${coord.height * 100}%`
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => currentWord && handleRemoveWord(index)}
              >
                {currentWord ? (
                  <div 
                    className="dragdrop-placed-word"
                    draggable={!checked || !isCorrect}
                    onDragStart={(e) => handleDragStart(e, currentWord, index)}
                  >
                    {currentWord}
                  </div>
                ) : (
                  <div className="dragdrop-box-placeholder">+</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Draggable words */}
        <div className="dragdrop-words-area">
          <h3 className="dragdrop-words-title">Từ vựng</h3>
          <div className="dragdrop-words-list">
            {draggableWords.map((word, idx) => {
              // Only show the word in the list if it is not placed yet
              // Wait, if the same word appears twice in the draggableWords, we need to count them.
              // To be simple, we can just hide it if it's placed.
              const countInList = draggableWords.filter(w => w === word).length;
              const countPlaced = placedWordsArray.filter(w => w === word).length;
              
              // If we render the list by map, we should hide the item if its instances are all placed.
              // Actually, since all words are unique in the part (usually), we can just check if it's placed.
              const isPlaced = placedWordsArray.includes(word);

              if (isPlaced) {
                // Return a placeholder to keep layout stable
                return <div key={idx} className="dragdrop-word-btn placeholder"></div>;
              }

              return (
                <div
                  key={idx}
                  className="dragdrop-word-btn"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, word)}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result & Actions */}
      <div className="dragdrop-actions">
        {!isCorrect && (
          <button
            className="btn-check"
            onClick={handleCheck}
            disabled={Object.keys(placedWords).length !== coords.length}
          >
            Kiểm tra ✔
          </button>
        )}

        {checked && isCorrect && (
          <div className="dragdrop-result correct">
            <p>✅ Chính xác hoàn toàn!</p>
            <button className="btn-next-exercise mt-2" onClick={() => onComplete()}>
              Tiếp tục →
            </button>
          </div>
        )}

        {checked && !isCorrect && (
          <div className="dragdrop-result incorrect">
            <p>❌ Có ô chưa đúng. Vui lòng thử lại!</p>
          </div>
        )}
      </div>
    </div>
  );
};
