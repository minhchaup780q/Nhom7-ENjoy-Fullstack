import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MediaUploadField } from './MediaUploadField';
import {
  PartFormShell,
  RowCard,
  AddRowButton,
  ExampleCheckbox,
  TextField,
  BinaryChoice,
  type PartFormProps,
} from './PartFormShell';

// ============================================================
// PART 1 — Nhìn ảnh và đánh giá Đúng / Sai
// ============================================================
export const ReadingPart1Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [items, setItems] = useState<any[]>(Array.isArray(initial) ? initial : []);

  const update = (i: number, patch: any) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <PartFormShell
      title="Đọc — Part 1: Nhìn ảnh, chọn Đúng/Sai"
      description="Mỗi câu gồm một ảnh và một phát biểu; chọn phát biểu đó đúng hay sai."
      saving={saving}
      onSave={() => onSave(items)}
    >
      <div className="space-y-2.5">
        {items.map((it, i) => (
          <RowCard key={i} index={i} onRemove={() => setItems(items.filter((_, idx) => idx !== i))}>
            <MediaUploadField
              label="Ảnh"
              kind="image"
              value={it.img_url || ''}
              onChange={(url) => update(i, { img_url: url })}
            />
            <TextField
              label="Phát biểu"
              value={it.question || ''}
              onChange={(v) => update(i, { question: v })}
              placeholder="Ví dụ: This is a cat."
            />
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Đáp án</span>
              <BinaryChoice
                value={it.status || 'right'}
                onChange={(v) => update(i, { status: v })}
                options={[
                  { value: 'right', label: 'Đúng (right)' },
                  { value: 'wrong', label: 'Sai (wrong)' },
                ]}
              />
              <ExampleCheckbox checked={!!it.is_example} onChange={(v) => update(i, { is_example: v })} />
            </div>
          </RowCard>
        ))}
        <AddRowButton
          label="Thêm câu"
          onClick={() => setItems([...items, { question: '', img_url: '', status: 'right', is_example: false }])}
        />
      </div>
    </PartFormShell>
  );
};

// ============================================================
// PART 2 — Một ảnh chung, trả lời Yes / No
// ============================================================
export const ReadingPart2Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [imgUrl, setImgUrl] = useState<string>(initial?.img_url || '');
  const [questions, setQuestions] = useState<any[]>(initial?.questions || []);

  const update = (i: number, patch: any) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));

  return (
    <PartFormShell
      title="Đọc — Part 2: Nhìn ảnh, trả lời Yes/No"
      description="Dùng chung một ảnh cho tất cả các câu hỏi của phần này."
      saving={saving}
      onSave={() => onSave({ img_url: imgUrl, questions })}
    >
      <MediaUploadField label="Ảnh dùng chung" kind="image" value={imgUrl} onChange={setImgUrl} required />

      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <RowCard key={i} index={i} onRemove={() => setQuestions(questions.filter((_, idx) => idx !== i))}>
            <TextField
              label="Câu hỏi"
              value={q.question || ''}
              onChange={(v) => update(i, { question: v })}
              placeholder="Ví dụ: Is the dog sleeping?"
            />
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Đáp án</span>
              <BinaryChoice
                value={q.status || 'yes'}
                onChange={(v) => update(i, { status: v })}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <ExampleCheckbox checked={!!q.is_example} onChange={(v) => update(i, { is_example: v })} />
            </div>
          </RowCard>
        ))}
        <AddRowButton
          label="Thêm câu hỏi"
          onClick={() => setQuestions([...questions, { question: '', status: 'yes', is_example: false }])}
        />
      </div>
    </PartFormShell>
  );
};

// ============================================================
// PART 3 — Sắp xếp chữ cái thành từ đúng
// ============================================================
export const ReadingPart3Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [items, setItems] = useState<any[]>(Array.isArray(initial) ? initial : []);

  const update = (i: number, patch: any) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <PartFormShell
      title="Đọc — Part 3: Sắp xếp chữ cái thành từ"
      description="Mỗi câu gồm một ảnh gợi ý và từ đúng. Học viên sẽ xếp lại các chữ cái của từ này."
      saving={saving}
      onSave={() => onSave(items)}
    >
      <div className="space-y-2.5">
        {items.map((it, i) => (
          <RowCard key={i} index={i} onRemove={() => setItems(items.filter((_, idx) => idx !== i))}>
            <MediaUploadField
              label="Ảnh gợi ý"
              kind="image"
              value={it.img_url || ''}
              onChange={(url) => update(i, { img_url: url })}
            />
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <TextField
                  label="Từ đúng"
                  value={it.word || ''}
                  onChange={(v) => update(i, { word: v })}
                  placeholder="Ví dụ: elephant"
                />
              </div>
              <div className="pb-2">
                <ExampleCheckbox checked={!!it.is_example} onChange={(v) => update(i, { is_example: v })} />
              </div>
            </div>
          </RowCard>
        ))}
        <AddRowButton
          label="Thêm câu"
          onClick={() => setItems([...items, { img_url: '', word: '', is_example: false }])}
        />
      </div>
    </PartFormShell>
  );
};

// ============================================================
// PART 4 — Điền từ vào đoạn văn
// ============================================================
export const ReadingPart4Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [text, setText] = useState<string>(initial?.text || '');
  const [options, setOptions] = useState<any[]>(initial?.options || []);
  const [answers, setAnswers] = useState<any[]>(initial?.answers || []);

  const updateOption = (i: number, patch: any) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));

  const updateAnswer = (i: number, patch: any) =>
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));

  const wordChoices = options.map((o) => o.word).filter((w: string) => w && w.trim());

  return (
    <PartFormShell
      title="Đọc — Part 4: Điền từ vào đoạn văn"
      description="Viết đoạn văn với các chỗ trống đánh số (1), (2)... rồi khai báo ngân hàng từ và đáp án từng vị trí."
      saving={saving}
      onSave={() => onSave({ text, options, answers })}
    >
      <TextField
        label="Đoạn văn (dùng (1), (2)... cho chỗ trống)"
        value={text}
        onChange={setText}
        textarea
        rows={6}
        placeholder="Ví dụ: A cat is an (1) ____ . It likes to (2) ____ ."
      />

      {/* Ngân hàng từ */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Ngân hàng từ</h5>
        {options.map((o, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Từ {i + 1}</span>
              <button
                type="button"
                onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <TextField
              label="Từ"
              value={o.word || ''}
              onChange={(v) => updateOption(i, { word: v })}
              placeholder="Ví dụ: animal"
            />
            <MediaUploadField
              label="Ảnh minh họa (tùy chọn)"
              kind="image"
              value={o.img_url || ''}
              onChange={(url) => updateOption(i, { img_url: url })}
            />
          </div>
        ))}
        <AddRowButton label="Thêm từ vào ngân hàng" onClick={() => setOptions([...options, { word: '', img_url: '' }])} />
      </div>

      {/* Đáp án theo vị trí */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Đáp án theo vị trí</h5>
        {wordChoices.length === 0 && (
          <p className="text-[11px] text-amber-600 font-semibold">
            Hãy nhập ngân hàng từ ở trên trước, rồi mới chọn được đáp án cho từng vị trí.
          </p>
        )}
        {answers.map((a, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white">
            <div className="shrink-0">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vị trí</label>
              <input
                type="number"
                min={1}
                value={a.position ?? ''}
                onChange={(e) => updateAnswer(i, { position: Number(e.target.value) })}
                className="w-20 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Từ đúng</label>
              <select
                value={a.word || ''}
                onChange={(e) => updateAnswer(i, { word: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="">-- Chọn từ --</option>
                {wordChoices.map((w: string) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setAnswers(answers.filter((_, idx) => idx !== i))}
              className="p-1.5 mt-4 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition shrink-0"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <AddRowButton
          label="Thêm đáp án"
          onClick={() => setAnswers([...answers, { position: answers.length + 1, word: '' }])}
        />
      </div>
    </PartFormShell>
  );
};

// ============================================================
// PART 5 — Trả lời câu hỏi ngắn theo cụm ảnh
// ============================================================
export const ReadingPart5Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [groups, setGroups] = useState<any[]>(Array.isArray(initial) ? initial : []);

  const updateGroup = (gi: number, patch: any) =>
    setGroups((prev) => prev.map((g, idx) => (idx === gi ? { ...g, ...patch } : g)));

  const updateQuestion = (gi: number, qi: number, patch: any) =>
    setGroups((prev) =>
      prev.map((g, idx) => {
        if (idx !== gi) return g;
        const questions = (g.questions || []).map((q: any, qIdx: number) =>
          qIdx === qi ? { ...q, ...patch } : q,
        );
        return { ...g, questions };
      }),
    );

  return (
    <PartFormShell
      title="Đọc — Part 5: Trả lời câu hỏi ngắn theo cụm ảnh"
      description="Mỗi nhóm gồm một ảnh và nhiều câu hỏi ngắn kèm từ khóa đáp án."
      saving={saving}
      onSave={() => onSave(groups)}
    >
      <div className="space-y-3">
        {groups.map((g, gi) => (
          <div key={gi} className="p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Nhóm {gi + 1}</span>
              <button
                type="button"
                onClick={() => setGroups(groups.filter((_, idx) => idx !== gi))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            <MediaUploadField
              label="Ảnh của nhóm"
              kind="image"
              value={g.img_url || ''}
              onChange={(url) => updateGroup(gi, { img_url: url })}
            />

            <div className="space-y-2 pl-3 border-l-2 border-slate-200">
              {(g.questions || []).map((q: any, qi: number) => (
                <div key={qi} className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Câu {qi + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateGroup(gi, {
                          questions: (g.questions || []).filter((_: any, idx: number) => idx !== qi),
                        })
                      }
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <TextField
                    label="Câu hỏi"
                    value={q.question || ''}
                    onChange={(v) => updateQuestion(gi, qi, { question: v })}
                    placeholder="Ví dụ: What colour is the bag?"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <TextField
                      label="Định dạng đáp án"
                      value={q.answer_format || ''}
                      onChange={(v) => updateQuestion(gi, qi, { answer_format: v })}
                      placeholder="Ví dụ: Một từ"
                    />
                    <TextField
                      label="Đáp án đúng (keyword)"
                      value={q.keyword || ''}
                      onChange={(v) => updateQuestion(gi, qi, { keyword: v })}
                      placeholder="Ví dụ: red"
                    />
                  </div>
                  <ExampleCheckbox
                    checked={!!q.is_example}
                    onChange={(v) => updateQuestion(gi, qi, { is_example: v })}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  updateGroup(gi, {
                    questions: [
                      ...(g.questions || []),
                      { question: '', answer_format: '', keyword: '', is_example: false },
                    ],
                  })
                }
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-[11px] font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Thêm câu hỏi vào nhóm này
              </button>
            </div>
          </div>
        ))}

        <AddRowButton
          label="Thêm nhóm"
          onClick={() => setGroups([...groups, { img_url: '', questions: [] }])}
        />
      </div>
    </PartFormShell>
  );
};
