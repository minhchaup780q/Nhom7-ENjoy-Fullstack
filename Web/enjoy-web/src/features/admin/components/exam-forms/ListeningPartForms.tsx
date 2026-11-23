import React, { useState } from 'react';
import { MediaUploadField } from './MediaUploadField';
import { CoordinateBoxEditor, type CoordinateBox } from './CoordinateBoxEditor';
import {
  PartFormShell,
  RowCard,
  AddRowButton,
  ExampleCheckbox,
  TextField,
  type PartFormProps,
} from './PartFormShell';

// ============================================================
// PART 1 — Nghe và kéo tên vào đúng vị trí trên ảnh
// ============================================================
export const ListeningPart1Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [audioUrl, setAudioUrl] = useState<string>(initial?.audio_url || '');
  const [imgUrl, setImgUrl] = useState<string>(initial?.img_url || '');
  const [coordinates, setCoordinates] = useState<CoordinateBox[]>(initial?.coordinates || []);

  return (
    <PartFormShell
      title="Nghe — Part 1: Kéo tên vào vị trí trên ảnh"
      description="Tải 1 ảnh lớn, sau đó khoanh từng vùng trên ảnh và nhập đáp án cho mỗi vùng."
      saving={saving}
      onSave={() => onSave({ audio_url: audioUrl, img_url: imgUrl, coordinates })}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MediaUploadField label="File nghe" kind="audio" value={audioUrl} onChange={setAudioUrl} required />
        <MediaUploadField label="Ảnh bài tập" kind="image" value={imgUrl} onChange={setImgUrl} required />
      </div>

      <CoordinateBoxEditor
        imageUrl={imgUrl}
        value={coordinates}
        onChange={setCoordinates}
        allowExample
      />
    </PartFormShell>
  );
};

// ============================================================
// PART 2 — Nghe và điền từ/số
// ============================================================
export const ListeningPart2Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [audioUrl, setAudioUrl] = useState<string>(initial?.audio_url || '');
  const [imgUrl, setImgUrl] = useState<string>(initial?.img_url || '');
  const [questions, setQuestions] = useState<any[]>(initial?.questions || []);

  const update = (i: number, patch: any) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));

  return (
    <PartFormShell
      title="Nghe — Part 2: Nghe và điền từ/số"
      description="Mỗi câu gồm nội dung câu hỏi, định dạng đáp án mong muốn và từ khóa đáp án đúng."
      saving={saving}
      onSave={() => onSave({ audio_url: audioUrl, img_url: imgUrl, questions })}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MediaUploadField label="File nghe" kind="audio" value={audioUrl} onChange={setAudioUrl} required />
        <MediaUploadField label="Ảnh minh họa (tùy chọn)" kind="image" value={imgUrl} onChange={setImgUrl} />
      </div>

      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <RowCard key={i} index={i} onRemove={() => setQuestions(questions.filter((_, idx) => idx !== i))}>
            <TextField
              label="Nội dung câu hỏi"
              value={q.question || ''}
              onChange={(v) => update(i, { question: v })}
              placeholder="Ví dụ: How old is Sam?"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextField
                label="Định dạng đáp án"
                value={q.answer_format || ''}
                onChange={(v) => update(i, { answer_format: v })}
                placeholder="Ví dụ: Một số / Một từ"
              />
              <TextField
                label="Đáp án đúng (keyword)"
                value={q.keyword || ''}
                onChange={(v) => update(i, { keyword: v })}
                placeholder="Ví dụ: seven"
              />
            </div>
            <ExampleCheckbox checked={!!q.is_example} onChange={(v) => update(i, { is_example: v })} />
          </RowCard>
        ))}
        <AddRowButton
          label="Thêm câu hỏi"
          onClick={() =>
            setQuestions([...questions, { question: '', answer_format: '', keyword: '', is_example: false }])
          }
        />
      </div>
    </PartFormShell>
  );
};

// ============================================================
// PART 3 — Trắc nghiệm hình ảnh A/B/C
// ============================================================
const CHOICES = ['A', 'B', 'C'] as const;

export const ListeningPart3Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [audioUrl, setAudioUrl] = useState<string>(initial?.audio_url || '');
  const [questions, setQuestions] = useState<any[]>(initial?.questions || []);

  const update = (i: number, patch: any) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));

  const updateImage = (qi: number, ci: number, url: string) =>
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qi) return q;
        const imgs = [...(q.img_urls || ['', '', ''])];
        imgs[ci] = url;
        return { ...q, img_urls: imgs };
      }),
    );

  return (
    <PartFormShell
      title="Nghe — Part 3: Trắc nghiệm hình ảnh A/B/C"
      description="Mỗi câu có 3 ảnh lựa chọn A, B, C — chọn ảnh nào là đáp án đúng."
      saving={saving}
      onSave={() => onSave({ audio_url: audioUrl, questions })}
    >
      <MediaUploadField label="File nghe" kind="audio" value={audioUrl} onChange={setAudioUrl} required />

      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <RowCard key={i} index={i} onRemove={() => setQuestions(questions.filter((_, idx) => idx !== i))}>
            <TextField
              label="Nội dung câu hỏi"
              value={q.question || ''}
              onChange={(v) => update(i, { question: v })}
              placeholder="Ví dụ: What is Jane doing?"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CHOICES.map((choice, ci) => (
                <MediaUploadField
                  key={choice}
                  label={`Ảnh ${choice}`}
                  kind="image"
                  value={(q.img_urls || [])[ci] || ''}
                  onChange={(url) => updateImage(i, ci, url)}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Đáp án đúng</span>
              <div className="flex items-center gap-1.5">
                {CHOICES.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => update(i, { answer: choice })}
                    className={`w-9 h-8 rounded-lg text-[11px] font-bold transition ${
                      q.answer === choice
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              <ExampleCheckbox checked={!!q.is_example} onChange={(v) => update(i, { is_example: v })} />
            </div>
          </RowCard>
        ))}
        <AddRowButton
          label="Thêm câu hỏi"
          onClick={() =>
            setQuestions([...questions, { question: '', img_urls: ['', '', ''], answer: 'A', is_example: false }])
          }
        />
      </div>
    </PartFormShell>
  );
};

// ============================================================
// PART 4 — Kéo thả màu sắc vào ảnh (không có câu ví dụ)
// ============================================================
export const ListeningPart4Form: React.FC<PartFormProps> = ({ initial, onSave, saving }) => {
  const [audioUrl, setAudioUrl] = useState<string>(initial?.audio_url || '');
  const [imgUrl, setImgUrl] = useState<string>(initial?.img_url || '');
  const [coordinates, setCoordinates] = useState<CoordinateBox[]>(initial?.coordinates || []);

  return (
    <PartFormShell
      title="Nghe — Part 4: Tô màu theo vị trí trên ảnh"
      description="Khoanh từng vùng cần tô màu và nhập tên màu đúng. Phần này không có câu ví dụ."
      saving={saving}
      onSave={() => onSave({ audio_url: audioUrl, img_url: imgUrl, coordinates })}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MediaUploadField label="File nghe" kind="audio" value={audioUrl} onChange={setAudioUrl} required />
        <MediaUploadField label="Ảnh bài tập" kind="image" value={imgUrl} onChange={setImgUrl} required />
      </div>

      <CoordinateBoxEditor
        imageUrl={imgUrl}
        value={coordinates}
        onChange={setCoordinates}
        allowExample={false}
      />
    </PartFormShell>
  );
};
