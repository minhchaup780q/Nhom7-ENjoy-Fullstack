import React from 'react';
import { PlusIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { SessionType } from '../../api/adminCourseApi';

interface SentenceItem {
  order: number;
  sentence: string;
  image_url?: string;
  audio_url?: string;
  answer?: string;
  distractors?: string[];
}

interface SentencePayloadFormProps {
  sessionType: SessionType;
  payload: any;
  onChange: (newPayload: any) => void;
}

export const SentencePayloadForm: React.FC<SentencePayloadFormProps> = ({
  sessionType,
  payload,
  onChange,
}) => {
  const items: SentenceItem[] = payload?.items || [];

  const updateItems = (newItems: SentenceItem[]) => {
    onChange({
      ...payload,
      items: newItems.map((item, idx) => ({ ...item, order: idx + 1 })),
    });
  };

  const handleAdd = () => {
    const newItem: SentenceItem = {
      order: items.length + 1,
      sentence: '',
      image_url: '',
      audio_url: '',
      answer: sessionType === 'FILL_IN_BLANK' ? '' : undefined,
      distractors: sessionType === 'FILL_IN_BLANK' ? ['', '', ''] : undefined,
    };
    updateItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    updateItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof SentenceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateItems(updated);
  };

  const handleDistractorChange = (itemIdx: number, distractorIdx: number, value: string) => {
    const updated = [...items];
    const currentDistractors = [...(updated[itemIdx].distractors || ['', '', ''])];
    currentDistractors[distractorIdx] = value;
    updated[itemIdx].distractors = currentDistractors;
    updateItems(updated);
  };

  return (
    <div className="space-y-4">
      {sessionType === 'FILL_IN_BLANK' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <InformationCircleIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Mẹo điền từ:</span> Trong câu tiếng Anh, hãy dùng dấu gạch dưới <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">___</code> tại vị trí cần khuyết để hệ thống tự động hiển thị ô trống cho học sinh điền từ!
          </div>
        </div>
      )}

      {sessionType === 'RE_ORDER_SENTENCE' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
          <InformationCircleIcon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Mẹo sắp xếp câu:</span> Hãy nhập câu tiếng Anh hoàn chỉnh và chuẩn xác. Khi bắt đầu bài tập, hệ thống sẽ tự động tách câu thành các từ xáo trộn để học sinh ghép lại đúng thứ tự.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Danh sách câu hỏi ({items.length})
        </h4>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Thêm câu hỏi
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">Chưa có câu nào trong danh sách. Bấm "Thêm câu hỏi" để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative space-y-2.5"
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">Câu #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Câu tiếng Anh *
                </label>
                <input
                  type="text"
                  value={item.sentence}
                  onChange={(e) => handleItemChange(index, 'sentence', e.target.value)}
                  placeholder={
                    sessionType === 'FILL_IN_BLANK'
                      ? 'VD: She is a ___ student.'
                      : 'VD: The cat is sleeping on the floor.'
                  }
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
                />
              </div>

              {sessionType === 'FILL_IN_BLANK' && (
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-700 mb-1">
                      Từ đáp án đúng cần điền *
                    </label>
                    <input
                      type="text"
                      value={item.answer || ''}
                      onChange={(e) => handleItemChange(index, 'answer', e.target.value)}
                      placeholder="VD: good"
                      className="w-full text-xs px-2 py-1 border border-emerald-300 bg-emerald-50/40 rounded-md outline-none text-emerald-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Các từ gây nhiễu (Distractors):
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {(item.distractors || ['', '', '']).map((dist, dIdx) => (
                        <input
                          key={dIdx}
                          type="text"
                          value={dist}
                          onChange={(e) => handleDistractorChange(index, dIdx, e.target.value)}
                          placeholder={`Nhiễu ${dIdx + 1}...`}
                          className="w-full text-xs px-2 py-1 border border-slate-300 rounded-md outline-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL âm thanh phát âm (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={item.audio_url || ''}
                    onChange={(e) => handleItemChange(index, 'audio_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL hình ảnh minh họa (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={item.image_url || ''}
                    onChange={(e) => handleItemChange(index, 'image_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentencePayloadForm;
