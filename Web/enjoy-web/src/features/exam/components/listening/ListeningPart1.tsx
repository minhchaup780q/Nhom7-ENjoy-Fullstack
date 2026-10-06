import React, { useState } from 'react';
import type { ListeningPart1Data, PartAnswer } from '../../types';

interface Props {
  data: ListeningPart1Data;
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ListeningPart1: React.FC<Props> = ({ data, answers, onChange }) => {
  // Lấy danh sách tên cần kéo (chỉ is_example=false)
  const draggableItems = data.coordinates
    .filter(c => !c.is_example)
    .map(c => c.word);

  // Lấy tất cả vị trí (bao gồm example để hiển thị)
  const allCoords = data.coordinates;
  const nonExampleCoords = data.coordinates.filter(c => !c.is_example);

  // Map: index trong nonExampleCoords -> từ đã thả
  const [placed, setPlaced] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    answers.forEach((a, i) => { if (a.answer) init[i] = a.answer; });
    return init;
  });

  const [dragging, setDragging] = useState<string | null>(null);

  const placedWords = Object.values(placed);

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    if (!word) return;
    const newPlaced = { ...placed, [idx]: word };
    setPlaced(newPlaced);

    // Sync to store
    const newAnswers = nonExampleCoords.map((_, i) => ({
      index: i,
      answer: newPlaced[i] || '',
    }));
    onChange(newAnswers);
  };

  const handleRemove = (idx: number) => {
    const newPlaced = { ...placed };
    delete newPlaced[idx];
    setPlaced(newPlaced);
    const newAnswers = nonExampleCoords.map((_, i) => ({
      index: i,
      answer: newPlaced[i] || '',
    }));
    onChange(newAnswers);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Instruction */}
      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
        LISTEN. DRAG THE NAME AND DROP IT ONTO THE CORRECT PERSON IN THE PICTURE. THERE IS ONE EXAMPLE.
      </p>

      {/* Draggable Tags */}
      <div className="flex flex-wrap gap-3">
        {allCoords.map((coord, idx) => {
          if (coord.is_example) {
            return (
              <div
                key={idx}
                className="px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 font-bold text-sm"
                title="Ví dụ (đã được điền sẵn)"
              >
                {coord.word} <span className="text-xs">(example)</span>
              </div>
            );
          }
          const isPlaced = placedWords.includes(coord.word);
          return (
            <div
              key={idx}
              draggable={!isPlaced}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', coord.word);
                setDragging(coord.word);
              }}
              onDragEnd={() => setDragging(null)}
              className={`px-4 py-2 rounded-xl border-2 border-dashed font-bold text-sm cursor-grab active:cursor-grabbing select-none transition-all
                ${isPlaced
                  ? 'border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                  : 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                } ${dragging === coord.word ? 'scale-105 shadow-md' : ''}`}
            >
              {coord.word}
            </div>
          );
        })}
      </div>

      {/* Image with Drop Zones */}
      <div className="relative inline-block max-w-full md:max-w-[50%] self-center">
        <img
          src={data.img_url}
          alt="Listening Part 1"
          className="max-w-full rounded-2xl shadow-lg border-4 border-white select-none"
          draggable={false}
        />

        {allCoords.map((coord, idx) => {
          const nonExIdx = nonExampleCoords.findIndex(c => c.word === coord.word);

          if (coord.is_example) {
            return (
              <div
                key={idx}
                className="absolute flex items-center justify-center bg-[#58cc02]/20 border-2 border-[#58cc02] rounded-lg pointer-events-none"
                style={{
                  left: `${coord.x * 100}%`,
                  top: `${coord.y * 100}%`,
                  width: `${coord.width * 100}%`,
                  height: `${coord.height * 100}%`,
                }}
              >
                <span className="text-[#58cc02] font-bold text-xs md:text-sm">{coord.word}</span>
              </div>
            );
          }

          const current = placed[nonExIdx];
          return (
            <div
              key={idx}
              className={`absolute flex items-center justify-center border-2 border-dashed rounded-lg transition-all cursor-pointer
                ${current
                  ? 'border-primary bg-primary/20'
                  : 'border-gray-400 bg-white/50 hover:border-primary hover:bg-primary/10'}`}
              style={{
                left: `${coord.x * 100}%`,
                top: `${coord.y * 100}%`,
                width: `${coord.width * 100}%`,
                height: `${coord.height * 100}%`,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, nonExIdx)}
              onClick={() => current && handleRemove(nonExIdx)}
            >
              {current ? (
                <span className="text-primary font-bold text-xs md:text-sm">{current}</span>
              ) : (
                <span className="text-gray-400 font-bold text-lg">+</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
