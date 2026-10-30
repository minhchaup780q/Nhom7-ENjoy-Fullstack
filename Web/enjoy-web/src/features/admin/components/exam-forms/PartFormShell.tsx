import React from 'react';
import { ArrowPathIcon, CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

/** Props chung của 9 form soạn phần thi. Parent truyền key={partKey} để state khởi tạo lại khi đổi phần. */
export interface PartFormProps {
  initial: any;
  onSave: (data: any) => void;
  saving: boolean;
}

interface PartFormShellProps {
  title: string;
  description: string;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}

/** Khung chung cho 9 form soạn phần thi: tiêu đề + nội dung + nút lưu riêng từng phần. */
export const PartFormShell: React.FC<PartFormShellProps> = ({
  title,
  description,
  onSave,
  saving,
  children,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition disabled:opacity-50 shrink-0"
      >
        {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
        Lưu phần này
      </button>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

/** Khối chứa 1 câu hỏi trong danh sách, kèm số thứ tự và nút xóa. */
export const RowCard: React.FC<{
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
  label?: string;
}> = ({ index, onRemove, children, label = 'Câu' }) => (
  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {label} {index + 1}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
        title="Xóa"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
    {children}
  </div>
);

/** Nút thêm một dòng vào danh sách câu hỏi. */
export const AddRowButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition"
  >
    <PlusIcon className="w-4 h-4" />
    {label}
  </button>
);

/** Checkbox đánh dấu câu ví dụ (câu mẫu, không tính điểm). */
export const ExampleCheckbox: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer shrink-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
    />
    Câu ví dụ
  </label>
);

/** Ô nhập text dùng chung trong các form phần thi. */
export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}> = ({ label, value, onChange, placeholder, textarea = false, rows = 4 }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    )}
  </div>
);

/** Nhóm nút chọn 1 trong 2 đáp án (Right/Wrong, Yes/No). */
export const BinaryChoice: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}> = ({ value, onChange, options }) => (
  <div className="flex items-center gap-1.5">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
          value === opt.value
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);
