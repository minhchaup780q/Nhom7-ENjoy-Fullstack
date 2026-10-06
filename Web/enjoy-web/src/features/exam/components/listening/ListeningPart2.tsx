import React, { useState } from 'react';
import type { ListeningPart2Data, PartAnswer } from '../../types';

interface Props {
  data: ListeningPart2Data;
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ListeningPart2: React.FC<Props> = ({ data, answers, onChange }) => {
  const examples = data.questions.filter(q => q.is_example);
  const actual = data.questions.filter(q => !q.is_example);

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
      {/* Left: instruction + audio label + image + example */}
      <div className="md:w-5/12 flex flex-col gap-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          READ THE QUESTION. LISTEN AND WRITE A NAME OR A NUMBER. THERE ARE TWO EXAMPLES.
        </p>
        {data.img_url && (
          <img
            src={data.img_url}
            alt="Listening Part 2"
            className="w-full rounded-2xl shadow border border-border"
          />
        )}
        {examples.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 border border-border text-sm">
            <p className="text-xs font-bold text-text-muted mb-2">Examples:</p>
            {examples.map((ex, i) => (
              <div key={i} className="mb-1">
                <span className="text-text-muted">{ex.question} </span>
                <span className="font-bold text-[#58cc02]">{ex.keyword}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: actual questions */}
      <div className="flex-1 flex flex-col gap-4">
        {actual.map((q, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary min-w-[24px]">{idx + 1}.</span>
            <div className="flex-1">
              <p className="text-sm text-text-main mb-1.5">{q.question}</p>
              <input
                type="text"
                value={values[idx]}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder="Write your answer..."
                className="w-full border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent text-sm font-semibold text-text-main py-1 transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
