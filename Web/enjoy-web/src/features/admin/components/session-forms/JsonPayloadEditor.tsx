import React, { useState, useEffect } from 'react';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface JsonPayloadEditorProps {
  value: any;
  onChange: (val: any) => void;
  error?: string | null;
}

export const JsonPayloadEditor: React.FC<JsonPayloadEditorProps> = ({
  value,
  onChange,
  error: externalError,
}) => {
  const [text, setText] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setText(value ? JSON.stringify(value, null, 2) : '{\n  \n}');
      setParseError(null);
    } catch {
      setText('{}');
    }
  }, [value]);

  const handleChange = (newText: string) => {
    setText(newText);
    try {
      const parsed = JSON.parse(newText);
      setParseError(null);
      onChange(parsed);
    } catch (err: any) {
      setParseError(err.message || 'Cú pháp JSON không hợp lệ');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setParseError(null);
      onChange(parsed);
    } catch (err: any) {
      setParseError(err.message || 'Không thể định dạng do lỗi cú pháp JSON');
    }
  };

  const currentError = parseError || externalError;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Payload JSON (Chế độ nâng cao)
        </label>
        <button
          type="button"
          onClick={handleFormat}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          Format JSON
        </button>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={'{\n  "items": []\n}'}
          className={`w-full font-mono text-xs p-3.5 rounded-xl border bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 transition ${
            currentError
              ? 'border-red-400 focus:ring-red-400/30'
              : 'border-slate-700 focus:ring-indigo-500/30'
          }`}
        />
      </div>

      {currentError ? (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
          <span>{currentError}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <CheckCircleIcon className="w-4 h-4 shrink-0" />
          <span>Cú pháp JSON hợp lệ</span>
        </div>
      )}
    </div>
  );
};

export default JsonPayloadEditor;
