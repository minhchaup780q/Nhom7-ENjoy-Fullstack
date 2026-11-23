import React, { useEffect, useRef, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface InfoPopoverProps {
  children: React.ReactNode;
  // Căn panel so với icon
  align?: 'left' | 'right';
  // Label cho a11y
  ariaLabel?: string;
}

// Icon ⓘ nhỏ cạnh tiêu đề, bấm hiện panel chú thích; đóng khi bấm ra ngoài hoặc nhấn Esc.
export const InfoPopover: React.FC<InfoPopoverProps> = ({ children, align = 'left', ariaLabel = 'Xem chú thích' }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100 transition align-middle"
      >
        <InformationCircleIcon className="w-5 h-5 stroke-[2]" />
      </button>

      {open && (
        <div
          role="dialog"
          className={`absolute z-20 mt-2 w-[22rem] max-w-[90vw] p-4 bg-white rounded-xl border-2 border-slate-100 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
