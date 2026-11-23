import React from 'react';
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { GrammarBlock, GrammarOption } from '../../../learning/types';

interface GrammarPayloadFormProps {
  payload: any;
  onChange: (newPayload: any) => void;
}

export const GrammarPayloadForm: React.FC<GrammarPayloadFormProps> = ({
  payload,
  onChange,
}) => {
  const title: string = payload?.title || '';
  const blocks: GrammarBlock[] = payload?.blocks || [];

  const handleTitleChange = (val: string) => {
    onChange({
      ...payload,
      title: val,
    });
  };

  const updateBlocks = (newBlocks: GrammarBlock[]) => {
    onChange({
      ...payload,
      title,
      blocks: newBlocks.map((b, idx) => ({ ...b, order: idx + 1 })),
    });
  };

  const handleAddBlock = (type: GrammarBlock['type']) => {
    const newBlock: GrammarBlock = {
      order: blocks.length + 1,
      type,
      text: '',
      audio_url: '',
      image_url: '',
      options:
        type === 'QUESTION'
          ? [
              { id: '1', text: '', is_correct: true },
              { id: '2', text: '', is_correct: false },
            ]
          : undefined,
    };
    updateBlocks([...blocks, newBlock]);
  };

  const handleRemoveBlock = (index: number) => {
    updateBlocks(blocks.filter((_, idx) => idx !== index));
  };

  const handleBlockChange = (index: number, field: keyof GrammarBlock, value: any) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
    updateBlocks(updated);
  };

  const handleAddOption = (blockIndex: number) => {
    const updated = [...blocks];
    const currentOptions = updated[blockIndex].options || [];
    const newId = String(currentOptions.length + 1);
    updated[blockIndex].options = [
      ...currentOptions,
      { id: newId, text: '', is_correct: false },
    ];
    updateBlocks(updated);
  };

  const handleRemoveOption = (blockIndex: number, optionIndex: number) => {
    const updated = [...blocks];
    const currentOptions = updated[blockIndex].options || [];
    updated[blockIndex].options = currentOptions.filter((_, idx) => idx !== optionIndex);
    updateBlocks(updated);
  };

  const handleOptionChange = (
    blockIndex: number,
    optionIndex: number,
    field: keyof GrammarOption,
    value: any
  ) => {
    const updated = [...blocks];
    const currentOptions = [...(updated[blockIndex].options || [])];
    if (field === 'is_correct' && value === true) {
      // Đặt tất cả đáp án khác thành false (radio style)
      currentOptions.forEach((opt, idx) => {
        opt.is_correct = idx === optionIndex;
      });
    } else {
      currentOptions[optionIndex] = {
        ...currentOptions[optionIndex],
        [field]: value,
      };
    }
    updated[blockIndex].options = currentOptions;
    updateBlocks(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Tiêu đề chủ đề Ngữ pháp *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="VD: Cấu trúc câu Hiện tại đơn (Present Simple)"
          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Khối nội dung & Câu hỏi ({blocks.length})
        </h4>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleAddBlock('EXPLANATION')}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition"
          >
            + Giải thích
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('TEXT_SPEECH')}
            className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition"
          >
            + Audio/Phát âm
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('QUESTION')}
            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"
          >
            + Câu hỏi trắc nghiệm
          </button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">Chưa có khối bài giảng nào. Hãy chọn loại khối ở trên để thêm.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative space-y-2.5"
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-indigo-700 uppercase">
                  Khối #{index + 1}: {block.type}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveBlock(index)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nội dung văn bản / Câu hỏi *
                </label>
                <textarea
                  rows={2}
                  value={block.text || ''}
                  onChange={(e) => handleBlockChange(index, 'text', e.target.value)}
                  placeholder="Nhập nội dung giải thích hoặc đề câu hỏi..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL âm thanh (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={block.audio_url || ''}
                    onChange={(e) => handleBlockChange(index, 'audio_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL hình ảnh (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={block.image_url || ''}
                    onChange={(e) => handleBlockChange(index, 'image_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              {block.type === 'QUESTION' && (
                <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Các đáp án lựa chọn:</span>
                    <button
                      type="button"
                      onClick={() => handleAddOption(index)}
                      className="text-[11px] text-indigo-600 font-semibold hover:underline"
                    >
                      + Thêm phương án
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {(block.options || []).map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`block-${index}-correct`}
                          checked={opt.is_correct}
                          onChange={() => handleOptionChange(index, optIdx, 'is_correct', true)}
                          title="Chọn làm đáp án đúng"
                          className="w-4 h-4 text-emerald-600 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionChange(index, optIdx, 'text', e.target.value)}
                          placeholder={`Đáp án ${optIdx + 1}...`}
                          className={`flex-1 text-xs px-2 py-1 border rounded-md outline-none ${
                            opt.is_correct
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-medium'
                              : 'border-slate-300'
                          }`}
                        />
                        {opt.is_correct && (
                          <span className="text-[11px] font-semibold text-emerald-600 shrink-0">
                            (Đúng)
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index, optIdx)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrammarPayloadForm;
