import React from 'react';
import { ChevronDoubleUpIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/solid';

interface PromotionDividerProps {
  type: 'promotion' | 'demotion';
}

export const PromotionDivider: React.FC<PromotionDividerProps> = ({ type }) => {
  if (type === 'promotion') {
    return (
      <div className="flex items-center justify-center gap-2 py-3 my-2 select-none">
        <ChevronDoubleUpIcon className="w-4 h-4 text-[#58cc02]" />
        <span className="text-[11px] font-display font-black tracking-widest text-[#58cc02] uppercase">
          NHÓM THĂNG HẠNG
        </span>
        <ChevronDoubleUpIcon className="w-4 h-4 text-[#58cc02]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-3 my-2 select-none">
      <ChevronDoubleDownIcon className="w-4 h-4 text-[#ea2b2b]" />
      <span className="text-[11px] font-display font-black tracking-widest text-[#ea2b2b] uppercase">
        NHÓM RỚT HẠNG
      </span>
      <ChevronDoubleDownIcon className="w-4 h-4 text-[#ea2b2b]" />
    </div>
  );
};
