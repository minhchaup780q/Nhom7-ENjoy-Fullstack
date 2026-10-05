import React, { useState } from 'react';
import type { ReadingPart4Data, PartAnswer } from '../../types';

interface Props {
  data: ReadingPart4Data;
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ReadingPart4: React.FC<Props> = ({ data, answers, onChange }) => {
  // Map: position -> user answer
  const [filled, setFilled] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    answers.forEach((a) => { if (a.position != null) init[a.position] = a.answer; });
    return init;
  });

  const handleChange = (position: number, val: string) => {
    const updated = { ...filled, [position]: val };
    setFilled(updated);
    onChange(
      data.answers.map((ans) => ({
        position: ans.position,
        answer: updated[ans.position] || '',
      }))
    );
  };

  /**
   * Chuyển đổi text chứa (1), (2)... thành array xen kẽ text và input.
   * Giữ số (1), (2)... để dễ tham chiếu, và thêm ô ___ sau số.
   */
  const renderText = () => {
    const parts = data.text.split(/(\(\d+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/^\((\d+)\)$/);
      if (match) {
        const pos = parseInt(match[1]);
        return (
          <span key={i} className="inline-flex items-baseline gap-1 mx-1">
            <span className="text-primary font-bold text-sm">({pos})</span>
            <input
              type="text"
              value={filled[pos] || ''}
              onChange={(e) => handleChange(pos, e.target.value.toLowerCase())}
              placeholder="___________"
              className="inline-block border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent text-sm font-bold text-text-main w-24 transition-colors placeholder:text-gray-200"
            />
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: Word Bank */}
      <div className="md:w-5/12 flex flex-col gap-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          READ THIS. CHOOSE A WORD FROM THE BOX. WRITE THE CORRECT WORD NEXT TO NUMBERS 1–5. THERE IS ONE EXAMPLE.
        </p>
        <div className="bg-surface rounded-2xl border border-border p-4">
          <p className="text-xs font-bold text-text-muted mb-3">Word Bank:</p>
          <div className="grid grid-cols-2 gap-3">
            {data.options.map((opt, i) => {
              const isUsed = Object.values(filled).includes(opt.word);
              return (
                <div key={i}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border border-border transition-all
                    ${isUsed ? 'opacity-40' : 'bg-white hover:border-primary/40'}`}>
                  <img src={opt.img_url} alt={opt.word}
                    className="w-full aspect-square object-cover rounded-lg" />
                  <span className={`text-sm font-bold ${isUsed ? 'text-text-muted' : 'text-text-main'}`}>
                    {opt.word}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Text with blanks */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm leading-loose text-text-main">{renderText()}</p>
        </div>

        {/* Example hint */}
        <div className="bg-gray-50 border border-border rounded-xl p-4 text-sm">
          <p className="text-xs font-bold text-text-muted mb-1">Example (từ đã điền sẵn):</p>
          {data.answers.find(a => a.position === 0) && (
            <span className="text-[#58cc02] font-bold">(0) {data.answers.find(a => a.position === 0)?.word}</span>
          )}
        </div>
      </div>
    </div>
  );
};
