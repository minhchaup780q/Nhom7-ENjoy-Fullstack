import React, { useState } from 'react';
import type { ListeningPart4Data, PartAnswer } from '../../types';

// Màu sắc common với tên tiếng Anh -> mã màu CSS
const COLOR_MAP: Record<string, string> = {
  red: '#ef4444', yellow: '#eab308', blue: '#3b82f6',
  green: '#22c55e', pink: '#ec4899', purple: '#a855f7',
  orange: '#f97316', brown: '#92400e', grey: '#6b7280',
  gray: '#6b7280', white: '#ffffff', black: '#000000',
};

interface Props {
  data: ListeningPart4Data;
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ListeningPart4: React.FC<Props> = ({ data, answers, onChange }) => {
  const nonExampleCoords = data.coordinates.filter(c => !c.is_example);

  // Tất cả màu có thể kéo (chỉ is_example=false)
  const colorTags = data.coordinates.filter(c => !c.is_example).map(c => c.word);

  const [placed, setPlaced] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    answers.forEach((a, i) => { if (a.answer) init[i] = a.answer; });
    return init;
  });

  const placedColors = Object.values(placed);

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    const color = e.dataTransfer.getData('text/plain');
    if (!color) return;
    const newPlaced = { ...placed, [idx]: color };
    setPlaced(newPlaced);
    onChange(nonExampleCoords.map((_, i) => ({ index: i, answer: newPlaced[i] || '' })));
  };

  const handleRemove = (idx: number) => {
    const newPlaced = { ...placed };
    delete newPlaced[idx];
    setPlaced(newPlaced);
    onChange(nonExampleCoords.map((_, i) => ({ index: i, answer: newPlaced[i] || '' })));
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
        LISTEN AND COLOUR. THERE IS ONE EXAMPLE.
      </p>

      {/* Color Palette to drag */}
      <div className="flex flex-wrap gap-3">
        {data.coordinates.map((coord, idx) => {
          const cssColor = COLOR_MAP[coord.word.toLowerCase()] || '#ccc';
          if (coord.is_example) {
            return (
              <div key={idx} className="flex flex-col items-center gap-1 opacity-50">
                <div className="w-10 h-10 rounded-xl border-2 border-gray-200" style={{ backgroundColor: cssColor }} />
                <span className="text-xs text-gray-400">{coord.word}</span>
              </div>
            );
          }
          const isPlaced = placedColors.includes(coord.word);
          return (
            <div
              key={idx}
              draggable={!isPlaced}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', coord.word)}
              className={`flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none transition-all ${isPlaced ? 'opacity-30' : 'hover:scale-105'}`}
            >
              <div
                className="w-10 h-10 rounded-xl border-2 border-white shadow-md"
                style={{ backgroundColor: cssColor }}
              />
              <span className="text-xs font-semibold text-text-muted">{coord.word}</span>
            </div>
          );
        })}
      </div>

      {/* Image with color drop zones */}
      <div className="relative inline-block max-w-full">
        <img
          src={data.img_url}
          alt="Listening Part 4"
          className="max-w-full rounded-2xl shadow-lg border-4 border-white select-none"
          draggable={false}
        />
        {data.coordinates.map((coord, idx) => {
          const nonExIdx = nonExampleCoords.findIndex(c => c.word === coord.word);
          const cssColor = COLOR_MAP[coord.word.toLowerCase()] || '#ccc';

          if (coord.is_example) {
            return (
              <div
                key={idx}
                className="absolute rounded-lg border-2 border-[#58cc02] pointer-events-none"
                style={{
                  left: `${coord.x * 100}%`, top: `${coord.y * 100}%`,
                  width: `${coord.width * 100}%`, height: `${coord.height * 100}%`,
                  backgroundColor: cssColor, opacity: 0.7,
                }}
              />
            );
          }

          const currentColor = placed[nonExIdx];
          const currentCss = currentColor ? (COLOR_MAP[currentColor.toLowerCase()] || '#ccc') : undefined;

          return (
            <div
              key={idx}
              className={`absolute rounded-lg border-2 border-dashed transition-all cursor-pointer
                ${currentColor ? 'border-primary' : 'border-gray-400 hover:border-primary'}`}
              style={{
                left: `${coord.x * 100}%`, top: `${coord.y * 100}%`,
                width: `${coord.width * 100}%`, height: `${coord.height * 100}%`,
                backgroundColor: currentCss ? `${currentCss}cc` : 'rgba(255,255,255,0.5)',
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, nonExIdx)}
              onClick={() => currentColor && handleRemove(nonExIdx)}
            />
          );
        })}
      </div>
    </div>
  );
};
