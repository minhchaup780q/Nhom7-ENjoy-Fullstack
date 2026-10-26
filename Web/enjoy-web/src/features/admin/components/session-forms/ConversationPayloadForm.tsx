import React from 'react';
import { PlusIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
  type: 'question' | 'answer' | 'distractor';
  text: string;
  audio_url?: string;
  is_correct?: boolean;
}

interface ConversationItem {
  order: number;
  question: ChatMessage;
  answer: ChatMessage;
  distractor: ChatMessage;
}

interface ConversationPayloadFormProps {
  payload: any;
  onChange: (newPayload: any) => void;
}

export const ConversationPayloadForm: React.FC<ConversationPayloadFormProps> = ({
  payload,
  onChange,
}) => {
  const items: ConversationItem[] = payload?.items || [];

  const updateItems = (newItems: ConversationItem[]) => {
    onChange({
      ...payload,
      items: newItems.map((item, idx) => ({ ...item, order: idx + 1 })),
    });
  };

  const handleAdd = () => {
    const newItem: ConversationItem = {
      order: items.length + 1,
      question: { type: 'question', text: '', audio_url: '' },
      answer: { type: 'answer', text: '', audio_url: '', is_correct: true },
      distractor: { type: 'distractor', text: '', audio_url: '', is_correct: false },
    };
    updateItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    updateItems(items.filter((_, idx) => idx !== index));
  };

  const handleMessageChange = (
    itemIndex: number,
    target: 'question' | 'answer' | 'distractor',
    field: 'text' | 'audio_url',
    value: string
  ) => {
    const updated = [...items];
    updated[itemIndex] = {
      ...updated[itemIndex],
      [target]: {
        ...updated[itemIndex][target],
        [field]: value,
      },
    };
    updateItems(updated);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5 text-xs text-purple-800">
        <InformationCircleIcon className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Cấu trúc Hội thoại:</span> Mỗi lượt đối thoại gồm câu thoại của Nhân vật 1 (Question), câu trả lời chính xác (Answer) và câu trả lời gây nhiễu (Distractor) để học sinh chọn đáp án chuẩn phản hồi.
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Các lượt đối thoại ({items.length})
        </h4>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Thêm lượt đối thoại
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">Chưa có lượt đối thoại nào. Bấm "Thêm lượt đối thoại" để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative space-y-3"
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-purple-700">Lượt đối thoại #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Câu hỏi của nhân vật dẫn */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700">1. Câu thoại của nhân vật chính (Question):</span>
                <input
                  type="text"
                  value={item.question?.text || ''}
                  onChange={(e) => handleMessageChange(index, 'question', 'text', e.target.value)}
                  placeholder="VD: How are you today?"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md outline-none"
                />
                <input
                  type="text"
                  value={item.question?.audio_url || ''}
                  onChange={(e) => handleMessageChange(index, 'question', 'audio_url', e.target.value)}
                  placeholder="URL audio (tùy chọn)..."
                  className="w-full text-[11px] px-2.5 py-1 border border-slate-200 rounded-md outline-none font-mono"
                />
              </div>

              {/* 2. Câu trả lời đúng */}
              <div className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800">2. Câu phản hồi đúng (Correct Answer):</span>
                <input
                  type="text"
                  value={item.answer?.text || ''}
                  onChange={(e) => handleMessageChange(index, 'answer', 'text', e.target.value)}
                  placeholder="VD: I am doing great, thank you!"
                  className="w-full text-xs px-2.5 py-1.5 border border-emerald-300 rounded-md outline-none font-medium text-emerald-900 bg-white"
                />
                <input
                  type="text"
                  value={item.answer?.audio_url || ''}
                  onChange={(e) => handleMessageChange(index, 'answer', 'audio_url', e.target.value)}
                  placeholder="URL audio (tùy chọn)..."
                  className="w-full text-[11px] px-2.5 py-1 border border-emerald-200 rounded-md outline-none font-mono bg-white"
                />
              </div>

              {/* 3. Câu gây nhiễu */}
              <div className="p-2.5 bg-rose-50/40 border border-rose-200 rounded-lg space-y-1.5">
                <span className="text-[11px] font-bold text-rose-800">3. Câu phản hồi gây nhiễu (Distractor):</span>
                <input
                  type="text"
                  value={item.distractor?.text || ''}
                  onChange={(e) => handleMessageChange(index, 'distractor', 'text', e.target.value)}
                  placeholder="VD: I have two apples."
                  className="w-full text-xs px-2.5 py-1.5 border border-rose-300 rounded-md outline-none text-rose-900 bg-white"
                />
                <input
                  type="text"
                  value={item.distractor?.audio_url || ''}
                  onChange={(e) => handleMessageChange(index, 'distractor', 'audio_url', e.target.value)}
                  placeholder="URL audio (tùy chọn)..."
                  className="w-full text-[11px] px-2.5 py-1 border border-rose-200 rounded-md outline-none font-mono bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationPayloadForm;
