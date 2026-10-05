import React, { useState } from 'react';
import type { ReadingPart5Group, PartAnswer } from '../../types';

interface Props {
  data: ReadingPart5Group[];
  answers: PartAnswer[];
  onChange: (answers: PartAnswer[]) => void;
}

export const ReadingPart5: React.FC<Props> = ({ data, answers, onChange }) => {
  // Map: groupIndex-questionIndex -> user answer
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    answers.forEach((a) => {
      if (a.groupIndex != null && a.questionIndex != null) {
        init[`${a.groupIndex}-${a.questionIndex}`] = a.answer;
      }
    });
    return init;
  });

  const handleChange = (gi: number, qi: number, val: string) => {
    const key = `${gi}-${qi}`;
    const updated = { ...values, [key]: val };
    setValues(updated);

    // Rebuild flat answers array
    const allAnswers: PartAnswer[] = [];
    data.forEach((group, gIdx) => {
      group.questions.forEach((q, qIdx) => {
        if (!q.is_example) {
          allAnswers.push({
            groupIndex: gIdx,
            questionIndex: qIdx,
            answer: updated[`${gIdx}-${qIdx}`] || '',
          });
        }
      });
    });
    onChange(allAnswers);
  };

  // Tính số thứ tự câu hỏi thực tế (bỏ qua example)
  let questionCounter = 0;

  return (
    <div>
      <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
        LOOK AT THE PICTURES AND READ THE QUESTIONS. WRITE ONE-WORD ANSWERS. THERE ARE TWO EXAMPLES.
      </p>

      <div className="flex flex-col gap-8">
        {data.map((group, gi) => {
          const examples = group.questions.filter(q => q.is_example);
          const actual = group.questions.filter(q => !q.is_example);

          return (
            <div key={gi} className="flex flex-col md:flex-row gap-5">
              {/* Left: Image + Examples */}
              <div className="md:w-5/12 flex flex-col gap-3">
                <img src={group.img_url} alt={`Group ${gi + 1}`}
                  className="w-full rounded-2xl shadow border border-border" />

                {gi === 0 && examples.length > 0 && (
                  <div className="bg-gray-50 border border-border rounded-xl p-3">
                    <p className="text-xs font-bold text-text-muted mb-2">Examples:</p>
                    {examples.map((ex, i) => (
                      <div key={i} className="text-sm mb-1.5">
                        <span className="text-text-muted">{ex.question} </span>
                        <span className="font-bold text-[#58cc02]">{ex.answer}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: actual questions */}
              <div className="flex-1 flex flex-col gap-3">
                {actual.map((q, qi) => {
                  const realQIdx = group.questions.indexOf(q);
                  questionCounter++;
                  return (
                    <div key={qi} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-bold text-sm min-w-[24px]">
                          {questionCounter}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-text-main mb-2">{q.question}</p>
                          <input
                            type="text"
                            value={values[`${gi}-${realQIdx}`] || ''}
                            onChange={(e) => handleChange(gi, realQIdx, e.target.value.toLowerCase())}
                            placeholder="Write one word..."
                            className="w-full border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent text-sm font-bold text-text-main transition-colors placeholder:text-gray-300 pb-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
