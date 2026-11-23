import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { learningApi } from '../../../learning/services/learningApi';

export interface VocabItem {
  word: string;
  translation: string;
  imageUrl?: string;
  audioUrl?: string;
}

interface FlashcardPayloadFormProps {
  payload: any;
  onChange: (newPayload: any) => void;
  partId?: number;
  isEdit?: boolean;
}

export const FlashcardPayloadForm: React.FC<FlashcardPayloadFormProps> = ({
  payload,
  onChange,
  partId,
  isEdit = false,
}) => {
  const vocabs: VocabItem[] = payload?.vocabularies || payload?.items || [];
  const [loading, setLoading] = useState(false);

  // Tự động nạp danh sách từ vựng từ Part nếu tạo mới và payload đang rỗng
  useEffect(() => {
    if (vocabs.length === 0 && partId && !isEdit) {
      let isMounted = true;
      setLoading(true);

      learningApi
        .getPartVocabularies(partId)
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const mappedVocabs: VocabItem[] = data.map((v) => ({
              word: v.word || '',
              translation: v.translation || '',
              imageUrl: v.imageUrl || '',
              audioUrl: v.audioUrl || '',
            }));
            onChange({
              ...payload,
              vocabularies: mappedVocabs,
            });
          }
        })
        .catch((err) => {
          console.warn('Không thể nạp từ vựng từ Part:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [partId]);

  const updateVocabs = (newVocabs: VocabItem[]) => {
    onChange({
      ...payload,
      vocabularies: newVocabs,
    });
  };

  const handleAdd = () => {
    updateVocabs([
      ...vocabs,
      { word: '', translation: '', imageUrl: '', audioUrl: '' },
    ]);
  };

  const handleRemove = (index: number) => {
    updateVocabs(vocabs.filter((_, idx) => idx !== index));
  };

  const handleFieldChange = (index: number, field: keyof VocabItem, value: string) => {
    const updated = [...vocabs];
    updated[index] = { ...updated[index], [field]: value };
    updateVocabs(updated);
  };

  const handleResetFromPart = async () => {
    if (!partId) return;
    setLoading(true);
    try {
      const data = await learningApi.getPartVocabularies(partId);
      if (Array.isArray(data)) {
        const mappedVocabs: VocabItem[] = data.map((v) => ({
          word: v.word || '',
          translation: v.translation || '',
          imageUrl: v.imageUrl || '',
          audioUrl: v.audioUrl || '',
        }));
        updateVocabs(mappedVocabs);
      }
    } catch (err) {
      console.error('Lỗi khi tải lại từ vựng:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && vocabs.length === 0) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
        <ArrowPathIcon className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Đang tải danh sách từ vựng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Danh sách Từ vựng ({vocabs.length})
          </h4>
          {partId && !isEdit && (
            <button
              type="button"
              onClick={handleResetFromPart}
              title="Khôi phục danh sách từ vựng mặc định từ Phần học (Part)"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" />
              <span>Nạp lại từ Part</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Thêm từ vựng
        </button>
      </div>

      {vocabs.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
          <p className="text-xs text-slate-500">Chưa có từ vựng nào trong bài học này.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Thêm từ đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {vocabs.map((vocab, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative space-y-2.5 group"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
                <span className="text-xs font-bold text-slate-500">Từ #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                  title="Xóa từ"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Từ tiếng Anh *
                  </label>
                  <input
                    type="text"
                    value={vocab.word}
                    onChange={(e) => handleFieldChange(index, 'word', e.target.value)}
                    placeholder="VD: Elephant"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Dịch nghĩa tiếng Việt *
                  </label>
                  <input
                    type="text"
                    value={vocab.translation}
                    onChange={(e) => handleFieldChange(index, 'translation', e.target.value)}
                    placeholder="VD: Con voi"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL hình ảnh minh họa
                  </label>
                  <input
                    type="text"
                    value={vocab.imageUrl || ''}
                    onChange={(e) => handleFieldChange(index, 'imageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    URL âm thanh phát âm
                  </label>
                  <input
                    type="text"
                    value={vocab.audioUrl || ''}
                    onChange={(e) => handleFieldChange(index, 'audioUrl', e.target.value)}
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

export default FlashcardPayloadForm;
