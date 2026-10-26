import React from 'react';
import { PlusIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { DragDropCoordinate } from '../../../learning/types';

interface DragDropPayloadFormProps {
  payload: any;
  onChange: (newPayload: any) => void;
}

export const DragDropPayloadForm: React.FC<DragDropPayloadFormProps> = ({
  payload,
  onChange,
}) => {
  const imageUrl: string = payload?.image_url || payload?.image || '';
  const audioUrl: string = payload?.audio_url || payload?.audio || '';
  const coordinates: DragDropCoordinate[] = payload?.coordinates || [];

  const handleFieldChange = (field: string, val: string) => {
    onChange({
      ...payload,
      [field]: val,
    });
  };

  const updateCoordinates = (newCoords: DragDropCoordinate[]) => {
    onChange({
      ...payload,
      image_url: imageUrl,
      audio_url: audioUrl,
      coordinates: newCoords,
    });
  };

  const handleAddCoordinate = () => {
    updateCoordinates([
      ...coordinates,
      { word: '', x: 50, y: 50, width: 100, height: 40 },
    ]);
  };

  const handleRemoveCoordinate = (index: number) => {
    updateCoordinates(coordinates.filter((_, idx) => idx !== index));
  };

  const handleCoordChange = (index: number, field: keyof DragDropCoordinate, value: any) => {
    const updated = [...coordinates];
    updated[index] = { ...updated[index], [field]: value };
    updateCoordinates(updated);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5 text-xs text-teal-800">
        <InformationCircleIcon className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Mô hình Kéo-Thả (Drag & Drop):</span> Yêu cầu một URL ảnh nền chứa các đối tượng và danh sách tọa độ (X, Y, Chiều rộng, Chiều cao) của từng ô mục tiêu để học sinh kéo từ tương ứng vào đúng vị trí trên hình.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            URL ảnh nền sơ đồ/hình ảnh *
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => handleFieldChange('image_url', e.target.value)}
            placeholder="https://..."
            className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg outline-none font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            URL âm thanh hướng dẫn (tùy chọn)
          </label>
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => handleFieldChange('audio_url', e.target.value)}
            placeholder="https://..."
            className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg outline-none font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Tọa độ các ô mục tiêu ({coordinates.length})
        </h4>
        <button
          type="button"
          onClick={handleAddCoordinate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Thêm ô tọa độ
        </button>
      </div>

      {coordinates.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">Chưa có ô mục tiêu nào. Bấm "Thêm ô tọa độ" để tạo.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {coordinates.map((coord, index) => (
            <div
              key={index}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 flex-wrap"
            >
              <span className="text-xs font-bold text-slate-500 shrink-0">#{index + 1}</span>

              <div className="flex-1 min-w-[140px]">
                <input
                  type="text"
                  value={coord.word}
                  onChange={(e) => handleCoordChange(index, 'word', e.target.value)}
                  placeholder="Từ khóa (VD: Head)..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-slate-500">X:</span>
                <input
                  type="number"
                  value={coord.x}
                  onChange={(e) => handleCoordChange(index, 'x', Number(e.target.value))}
                  className="w-16 text-xs px-2 py-1 border border-slate-300 rounded-md outline-none"
                />
                <span className="text-[11px] text-slate-500">Y:</span>
                <input
                  type="number"
                  value={coord.y}
                  onChange={(e) => handleCoordChange(index, 'y', Number(e.target.value))}
                  className="w-16 text-xs px-2 py-1 border border-slate-300 rounded-md outline-none"
                />
                <span className="text-[11px] text-slate-500">W:</span>
                <input
                  type="number"
                  value={coord.width}
                  onChange={(e) => handleCoordChange(index, 'width', Number(e.target.value))}
                  className="w-16 text-xs px-2 py-1 border border-slate-300 rounded-md outline-none"
                />
                <span className="text-[11px] text-slate-500">H:</span>
                <input
                  type="number"
                  value={coord.height}
                  onChange={(e) => handleCoordChange(index, 'height', Number(e.target.value))}
                  className="w-16 text-xs px-2 py-1 border border-slate-300 rounded-md outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCoordinate(index)}
                className="text-slate-400 hover:text-red-500 p-1 shrink-0"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropPayloadForm;
