import React, { useState } from 'react';
import type { ReadingPart1Item, PartAnswer } from '../../types';

interface Props {
  data: ReadingPart1Item[];
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ReadingPart1: React.FC<Props> = ({ data, answers, onChange }) => {
  const examples = data.filter(q => q.is_example);
  const actual = data.filter(q => !q.is_example);

  const [selected, setSelected] = useState<string[]>(() =>
    actual.map((_, i) => answers[i]?.answer || '')
  );

  const handleSelect = (idx: number, val: 'right' | 'wrong') => {
    const updated = [...selected];
    updated[idx] = val;
    setSelected(updated);
    onChange(updated.map((v, i) => ({ index: i, answer: v })));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: instruction + examples */}
      <div className="md:w-5/12 flex flex-col gap-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          LOOK AND READ. TICK THE BOX. THERE ARE TWO EXAMPLES.
        </p>
        {examples.map((ex, i) => (
          <div key={i} className="bg-gray-50 border border-border rounded-2xl p-4">
            <p className="text-xs font-bold text-text-muted mb-2">Example {i + 1}:</p>
            <div className="flex gap-3 items-start">
              <img src={ex.img_url} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-text-main mb-2">{ex.question}</p>
                <div className="flex gap-3">
                  {(['right', 'wrong'] as const).map((opt) => (
                    <span key={opt}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg
                      ${ex.status === opt ? 'bg-[#58cc02]/20 text-[#58cc02]' : 'text-text-muted'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${ex.status === opt ? 'border-[#58cc02] bg-[#58cc02]' : 'border-gray-300'}`}>
                        {ex.status === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      {opt === 'right' ? 'A. Right' : 'B. Wrong'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: actual questions */}
      <div className="flex-1 flex flex-col gap-4">
        {actual.map((q, idx) => (
          <div key={idx} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex gap-3 items-start">
              <span className="text-primary font-bold text-sm mt-0.5">{idx + 1}.</span>
              <img src={q.img_url} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-text-main mb-3">{q.question}</p>
                <div className="flex gap-3">
                  {(['right', 'wrong'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(idx, opt)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border-2 transition-all
                        ${selected[idx] === opt
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-text-muted hover:border-primary/40'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                        ${selected[idx] === opt ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {selected[idx] === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      {opt === 'right' ? 'A. Right' : 'B. Wrong'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
