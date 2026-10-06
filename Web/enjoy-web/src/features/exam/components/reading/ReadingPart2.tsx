import React, { useState } from 'react';
import type { ReadingPart2Data, PartAnswer } from '../../types';

interface Props {
  data: ReadingPart2Data;
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ReadingPart2: React.FC<Props> = ({ data, answers, onChange }) => {
  const examples = data.questions.filter(q => q.is_example);
  const actual = data.questions.filter(q => !q.is_example);

  // Lấy ảnh chung 
  const sharedImg = data.img_url;

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
      {/* Left: instruction + image + examples */}
      <div className="md:w-5/12 flex flex-col gap-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          LOOK AND READ. WRITE YES OR NO.
        </p>
        {sharedImg && (
          <img src={sharedImg} alt="Reading Part 2" className="w-full rounded-2xl shadow border border-border" />
        )}
        {examples.length > 0 && (
          <div className="bg-gray-50 border border-border rounded-2xl p-4">
            <p className="text-xs font-bold text-text-muted mb-2">Examples:</p>
            {examples.map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-sm mb-1.5">
                <span className="text-text-muted flex-1">{ex.question}</span>
                <span className="font-bold text-[#58cc02] min-w-[30px]">{ex.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: actual questions */}
      <div className="flex-1 flex flex-col gap-4">
        {actual.map((q, idx) => (
          <div key={idx} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold text-sm">{idx + 1}.</span>
              <p className="text-sm text-text-main flex-1">{q.question}</p>
              <input
                type="text"
                value={values[idx]}
                onChange={(e) => handleChange(idx, e.target.value.toLowerCase())}
                placeholder="yes / no"
                maxLength={3}
                className="w-20 text-center border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent text-sm font-bold text-text-main transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
