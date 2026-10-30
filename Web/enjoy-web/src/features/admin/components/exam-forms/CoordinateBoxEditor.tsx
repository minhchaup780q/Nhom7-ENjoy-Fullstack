import React, { useEffect, useRef, useState } from 'react';
import {
  TrashIcon,
  Square2StackIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

export interface CoordinateBox {
  word: string;
  x: number;
  y: number;
  width: number;
  height: number;
  is_example?: boolean;
}

interface CoordinateBoxEditorProps {
  imageUrl: string;
  value: CoordinateBox[];
  onChange: (boxes: CoordinateBox[]) => void;
  /** Part 1 bài Nghe có câu ví dụ; Part 4 thì mọi ô đều là đáp án thật. */
  allowExample: boolean;
}

type Interaction =
  | { mode: 'draw'; startX: number; startY: number }
  | { mode: 'drag'; index: number; clientX: number; clientY: number; initialX: number; initialY: number }
  | null;

/** Kích thước tối thiểu (px) để coi là một ô hợp lệ, tránh click nhầm tạo ô rỗng. */
const MIN_BOX_PX = 10;

export const CoordinateBoxEditor: React.FC<CoordinateBoxEditorProps> = ({
  imageUrl,
  value,
  onChange,
  allowExample,
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<Interaction>(null);

  // Giữ props mới nhất cho các handler gắn trên document (tránh stale closure)
  const latest = useRef({ value, onChange, allowExample });
  latest.current = { value, onChange, allowExample };

  const [tempRect, setTempRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [dragPos, setDragPos] = useState<{ index: number; left: number; top: number } | null>(null);

  // Kích thước mẫu để vẽ nhanh nhiều ô cùng cỡ (giữ nguyên tính năng của tool gốc)
  const [templateSize, setTemplateSize] = useState<{ w: number; h: number } | null>(null);
  const lastSizeRef = useRef<{ w: number; h: number } | null>(null);
  const templateRef = useRef<{ w: number; h: number } | null>(null);
  templateRef.current = templateSize;

  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const wordInputsRef = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    if (focusIndex !== null) {
      wordInputsRef.current[focusIndex]?.focus();
      setFocusIndex(null);
    }
  }, [focusIndex]);

  // Gắn listener trên document 1 lần: kéo nhanh ra ngoài ảnh vẫn không mất thao tác
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const act = interactionRef.current;
      const layer = layerRef.current;
      if (!act || !layer) return;
      const rect = layer.getBoundingClientRect();

      if (act.mode === 'draw') {
        const tpl = templateRef.current;
        if (tpl) {
          setTempRect({
            left: act.startX,
            top: act.startY,
            width: tpl.w * rect.width,
            height: tpl.h * rect.height,
          });
        } else {
          const curX = e.clientX - rect.left;
          const curY = e.clientY - rect.top;
          setTempRect({
            left: Math.min(act.startX, curX),
            top: Math.min(act.startY, curY),
            width: Math.abs(curX - act.startX),
            height: Math.abs(curY - act.startY),
          });
        }
        return;
      }

      // Kéo ô đã có để chỉnh lại vị trí
      const box = latest.current.value[act.index];
      if (!box) return;
      const boxW = box.width * rect.width;
      const boxH = box.height * rect.height;
      const nextLeft = Math.max(0, Math.min(act.initialX + (e.clientX - act.clientX), rect.width - boxW));
      const nextTop = Math.max(0, Math.min(act.initialY + (e.clientY - act.clientY), rect.height - boxH));
      setDragPos({ index: act.index, left: nextLeft, top: nextTop });
    };

    const handleUp = (e: MouseEvent) => {
      const act = interactionRef.current;
      const layer = layerRef.current;
      if (!act || !layer) return;
      interactionRef.current = null;

      const rect = layer.getBoundingClientRect();
      const { value: boxes, onChange: emit, allowExample: canExample } = latest.current;

      if (act.mode === 'draw') {
        setTempRect(null);
        const tpl = templateRef.current;

        let left = act.startX;
        let top = act.startY;
        let wFrac: number;
        let hFrac: number;

        if (tpl) {
          wFrac = tpl.w;
          hFrac = tpl.h;
        } else {
          const endX = e.clientX - rect.left;
          const endY = e.clientY - rect.top;
          const wPx = Math.abs(endX - act.startX);
          const hPx = Math.abs(endY - act.startY);
          if (wPx < MIN_BOX_PX || hPx < MIN_BOX_PX) return; // click nhầm, bỏ qua
          left = Math.min(act.startX, endX);
          top = Math.min(act.startY, endY);
          wFrac = wPx / rect.width;
          hFrac = hPx / rect.height;
          lastSizeRef.current = { w: wFrac, h: hFrac };
        }

        emit([
          ...boxes,
          {
            word: '',
            x: round4(left / rect.width),
            y: round4(top / rect.height),
            width: round4(wFrac),
            height: round4(hFrac),
            // Ô đầu tiên mặc định là câu ví dụ (ở phần có ví dụ)
            ...(canExample ? { is_example: boxes.length === 0 } : {}),
          },
        ]);
        setFocusIndex(boxes.length);
        return;
      }

      // Kết thúc kéo: chốt lại toạ độ theo tỉ lệ
      setDragPos(null);
      const box = boxes[act.index];
      if (!box) return;
      const boxW = box.width * rect.width;
      const boxH = box.height * rect.height;
      const finalLeft = Math.max(0, Math.min(act.initialX + (e.clientX - act.clientX), rect.width - boxW));
      const finalTop = Math.max(0, Math.min(act.initialY + (e.clientY - act.clientY), rect.height - boxH));

      const next = [...boxes];
      next[act.index] = { ...box, x: round4(finalLeft / rect.width), y: round4(finalTop / rect.height) };
      emit(next);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, []);

  const handleLayerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Chỉ bắt đầu vẽ khi bấm vào vùng trống, không phải lên ô đã có
    if (e.target !== layerRef.current || !layerRef.current) return;
    const rect = layerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    interactionRef.current = { mode: 'draw', startX, startY };

    if (templateSize) {
      setTempRect({
        left: startX,
        top: startY,
        width: templateSize.w * rect.width,
        height: templateSize.h * rect.height,
      });
    }
  };

  const handleBoxMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!layerRef.current) return;
    const rect = layerRef.current.getBoundingClientRect();
    const box = value[index];
    interactionRef.current = {
      mode: 'drag',
      index,
      clientX: e.clientX,
      clientY: e.clientY,
      initialX: box.x * rect.width,
      initialY: box.y * rect.height,
    };
  };

  const updateBox = (index: number, patch: Partial<CoordinateBox>) => {
    const next = [...value];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeBox = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSaveTemplate = () => {
    if (lastSizeRef.current) setTemplateSize(lastSizeRef.current);
  };

  if (!imageUrl) {
    return (
      <div className="p-6 text-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60">
        <p className="text-xs font-semibold text-slate-500">
          Hãy tải ảnh lên trước, sau đó bạn mới khoanh được vùng từ vựng trên ảnh.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-2.5 text-xs text-indigo-800">
        <InformationCircleIcon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Cách dùng:</span> Kéo chuột trên ảnh để khoanh một ô,
          nhập từ vựng cho ô đó ở danh sách bên dưới. Kéo thả ô để chỉnh vị trí, bấm dấu × trên ô để xóa.
          {allowExample && ' Ô đầu tiên được khoanh mặc định là câu ví dụ.'}
        </div>
      </div>

      {/* Thanh công cụ kích thước mẫu */}
      <div className="flex items-center gap-2 flex-wrap">
        {templateSize ? (
          <>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              <Square2StackIcon className="w-3.5 h-3.5" />
              Đang dùng kích thước mẫu
            </span>
            <button
              type="button"
              onClick={() => setTemplateSize(null)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              <XCircleIcon className="w-3.5 h-3.5" />
              Hủy mẫu
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={!lastSizeRef.current}
            title={lastSizeRef.current ? undefined : 'Hãy vẽ ít nhất 1 ô tự do trước để lấy kích thước mẫu'}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square2StackIcon className="w-3.5 h-3.5" />
            Lưu kích thước mẫu
          </button>
        )}
        <span className="text-[11px] font-semibold text-slate-400 ml-auto">
          Đã khoanh: {value.length} ô
        </span>
      </div>

      {/* Ảnh + lớp vẽ */}
      <div className="inline-block relative border-2 border-slate-200 rounded-xl overflow-hidden select-none max-w-full">
        <img src={imageUrl} alt="" className="block max-w-full h-auto pointer-events-none" draggable={false} />
        <div
          ref={layerRef}
          onMouseDown={handleLayerMouseDown}
          className="absolute inset-0 cursor-crosshair"
        >
          {value.map((box, index) => {
            const dragging = dragPos?.index === index;
            return (
              <div
                key={index}
                onMouseDown={(e) => handleBoxMouseDown(e, index)}
                className={`absolute flex items-center justify-center text-center text-[11px] font-bold cursor-grab group border-2 transition-colors ${
                  box.is_example
                    ? 'border-amber-500 bg-amber-400/25 text-amber-900'
                    : 'border-emerald-600 bg-emerald-500/25 text-emerald-900'
                } ${dragging ? 'opacity-80 cursor-grabbing' : ''}`}
                style={
                  dragging
                    ? {
                        left: dragPos.left,
                        top: dragPos.top,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                      }
                    : {
                        left: `${box.x * 100}%`,
                        top: `${box.y * 100}%`,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                      }
                }
              >
                <span className="px-0.5 truncate">{box.word || index + 1}</span>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBox(index);
                  }}
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none shadow hidden group-hover:flex items-center justify-center"
                  title="Xóa ô này"
                >
                  ×
                </button>
              </div>
            );
          })}

          {tempRect && (
            <div
              className="absolute border-2 border-dashed border-indigo-500 bg-indigo-500/20 pointer-events-none"
              style={{ left: tempRect.left, top: tempRect.top, width: tempRect.width, height: tempRect.height }}
            />
          )}
        </div>
      </div>

      {/* Danh sách ô đã khoanh */}
      {value.length === 0 ? (
        <p className="text-xs text-slate-400 font-medium italic">
          Chưa khoanh ô nào. Kéo chuột trên ảnh để bắt đầu.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((box, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <span className="w-6 h-6 shrink-0 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500 flex items-center justify-center">
                {index + 1}
              </span>
              <input
                ref={(el) => { wordInputsRef.current[index] = el; }}
                type="text"
                value={box.word}
                onChange={(e) => updateBox(index, { word: e.target.value })}
                placeholder="Nhập đáp án cho ô này..."
                className="flex-1 min-w-0 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {allowExample && (
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!box.is_example}
                    onChange={(e) => updateBox(index, { is_example: e.target.checked })}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                  Câu ví dụ
                </label>
              )}
              <button
                type="button"
                onClick={() => removeBox(index)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                title="Xóa ô này"
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

const round4 = (n: number) => Number(n.toFixed(4));
