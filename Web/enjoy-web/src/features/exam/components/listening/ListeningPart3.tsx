import React, { useState } from 'react';
import type { ListeningPart3Data, PartAnswer } from '../../types';

interface Props {
  data: ListeningPart3Data;
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

const CHOICE_LABELS = ['A', 'B', 'C'];

export const ListeningPart3: React.FC<Props> = ({ data, answers, onChange }) => {
  const examples = data.questions.filter(q => q.is_example);
  const actual = data.questions.filter(q => !q.is_example);

  const [selected, setSelected] = useState<string[]>(() =>
    actual.map((_, i) => answers[i]?.answer || '')
  );

  const handleSelect = (qIdx: number, choice: string) => {
    const updated = [...selected];
    updated[qIdx] = choice;
    setSelected(updated);
    onChange(updated.map((v, i) => ({ index: i, answer: v })));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: instruction + example */}
      <div className="md:w-5/12 flex flex-col gap-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          LISTEN AND TICK THE BOX. THERE IS ONE EXAMPLE.
        </p>

        {examples.map((ex, i) => (
          <div key={i} className="bg-gray-50 border border-border rounded-2xl p-4">
            <p className="text-xs font-bold text-text-muted mb-3">Example:</p>
            <p className="text-sm font-semibold text-text-main mb-3">{ex.question}</p>
            <div className="grid grid-cols-3 gap-2">
              {CHOICE_LABELS.map((label) => (
                <div key={label} className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 
                  ${label === ex.answer ? 'border-[#58cc02] bg-[#58cc02]/10' : 'border-transparent'}`}>
                  <img src={ex.img_url} alt={label}
                    className="w-full aspect-square object-cover rounded-lg" />
                  <span className={`text-xs font-bold ${label === ex.answer ? 'text-[#58cc02]' : 'text-text-muted'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right: actual questions */}
      <div className="flex-1 flex flex-col gap-5">
        {actual.map((q, qIdx) => (
          <div key={qIdx} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <p className="text-sm font-semibold text-text-main mb-3">
              <span className="text-primary font-bold mr-1">{qIdx + 1}.</span> {q.question}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {CHOICE_LABELS.map((label) => (
                <button
                  key={label}
                  onClick={() => handleSelect(qIdx, label)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all active:scale-95
                    ${selected[qIdx] === label
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border hover:border-primary/40'}`}
                >
                  <img src={q.img_url} alt={label}
                    className="w-full aspect-square object-cover rounded-lg" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${selected[qIdx] === label
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'}`}>
                    {selected[qIdx] === label && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`text-xs font-bold ${selected[qIdx] === label ? 'text-primary' : 'text-text-muted'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
