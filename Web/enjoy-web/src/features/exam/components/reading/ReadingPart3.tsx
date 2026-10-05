import React, { useState, useMemo } from 'react';
import type { ReadingPart3Item, PartAnswer } from '../../types';

interface Props {
  data: ReadingPart3Item[];
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

// Xáo trộn chữ cái của một từ (chỉ lấy 1 hàm bên ngoài để tránh cấp phát lại)
const shuffleWord = (word: string): string[] => {
  return word.split('').sort(() => Math.random() - 0.5);
};

export const ReadingPart3: React.FC<Props> = ({ data, answers, onChange }) => {
  const example = useMemo(() => data.find(q => q.is_example), [data]);
  const actual = useMemo(() => data.filter(q => !q.is_example), [data]);

  // Sinh random chữ cái 1 lần duy nhất cho mỗi từ
  const shuffledExample = useMemo(() => example ? shuffleWord(example.word) : [], [example]);
  const shuffledActual = useMemo(() => actual.map(q => shuffleWord(q.word)), [actual]);

  const [values, setValues] = useState<string[]>(() =>
    actual.map((_, i) => answers[i]?.answer || '')
  );

  const handleChange = (idx: number, val: string) => {
    const updated = [...values];
    updated[idx] = val;
    setValues(updated);
    onChange(updated.map((v, i) => ({ index: i, answer: v })));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: instruction + example */}
      <div className="md:w-5/12 flex flex-col gap-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          LOOK AT THE PICTURES. LOOK AT THE LETTERS. ARRANGE THE LETTERS TO MAKE A WORD.
        </p>

        {example && (
          <div className="bg-gray-50 border border-border rounded-2xl p-4">
            <p className="text-xs font-bold text-text-muted mb-3">Example:</p>
            <div className="flex items-center gap-3">
              <img src={example.img_url} alt={example.word}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1">
                {/* Scrambled letters */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {shuffledExample.map((letter, i) => (
                    <div key={i}
                      className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-text-muted">
                      {letter}
                    </div>
                  ))}
                </div>
                {/* Answer (filled in) */}
                <div className="border-b-2 border-[#58cc02] text-[#58cc02] font-bold text-sm pb-1">
                  {example.word}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: actual questions */}
      <div className="flex-1 flex flex-col gap-4">
        {actual.map((q, idx) => {
          const shuffled = shuffledActual[idx];
          return (
            <div key={idx} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-primary font-bold text-sm">{idx + 1}.</span>
                <img src={q.img_url} alt=""
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />

                <div className="flex-1 flex flex-col gap-2">
                  {/* Shuffled letter bubbles (click to fill) */}
                  <div className="flex flex-wrap gap-1.5">
                    {shuffled.map((letter, li) => (
                      <button
                        key={li}
                        onClick={() => {
                          const current = values[idx] || '';
                          if (current.length < q.word.length) {
                            handleChange(idx, current + letter);
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 active:scale-95 transition-all"
                      >
                        {letter}
                      </button>
                    ))}
                    {/* Clear button */}
                    {values[idx] && (
                      <button
                        onClick={() => handleChange(idx, '')}
                        className="w-7 h-7 rounded-full bg-red-100 text-red-500 font-bold text-sm hover:bg-red-200 transition-all"
                        title="Xóa"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Text input (cho phép cả gõ tay) */}
                  <input
                    type="text"
                    value={values[idx]}
                    onChange={(e) => handleChange(idx, e.target.value.toLowerCase())}
                    placeholder="Type or click letters..."
                    className="border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent text-sm font-bold text-text-main transition-colors placeholder:text-gray-300 pb-1"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
