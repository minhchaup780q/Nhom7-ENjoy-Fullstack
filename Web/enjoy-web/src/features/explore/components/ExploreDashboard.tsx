import React, { useState } from 'react';
import { RealWorldExplorer } from './RealWorldExplorer';

export const ExploreDashboard: React.FC = () => {
  const [activeSubMode, setActiveSubMode] = useState<string | null>(null);

  if (activeSubMode === 'realworld') {
    return <RealWorldExplorer onBack={() => setActiveSubMode(null)} />;
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto flex flex-col justify-center space-y-8 select-none">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex w-14 h-14 bg-sky-50 text-sky-600 border border-sky-100 rounded-2xl items-center justify-center shadow-xs mx-auto mb-1">
          <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            explore
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
          Khám Phá Cùng ENjoy
        </h1>
        <p className="text-sm font-medium text-slate-500 max-w-lg mx-auto leading-relaxed">
          Bước vào thế giới thực tế và sáng tạo tương tác! Quét đồ vật xung quanh để học thêm nhiều từ vựng thú vị mỗi ngày.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        {/* Card 1: Real World Explorer */}
        <div 
          onClick={() => setActiveSubMode('realworld')}
          className="bg-white rounded-3xl border border-slate-200/90 hover:border-sky-300 p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:shadow-md shadow-xs group"
        >
          <div className="w-20 h-20 bg-sky-50 text-sky-600 border border-sky-100 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200 shadow-xs">
            <span className="material-symbols-outlined text-[40px]">photo_camera</span>
          </div>

          <div className="mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
              AI Camera Thông Minh
            </span>
          </div>

          <h2 className="text-xl font-display font-bold text-slate-900 mb-2">
            Khám Phá Thế Giới Thực
          </h2>

          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
            Dùng camera để quét các đồ dùng học tập xung quanh bé. Enjoy sẽ nhận diện chính xác và dạy bé phát âm chuẩn bản ngữ!
          </p>

          <button className="mt-7 px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white font-display font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2">
            <span>KHÁM PHÁ NGAY</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Card 2: Drawing Explorer (Coming Soon) */}
        <div 
          onClick={() => alert("Tính năng Vẽ Cùng Enjoy đang được phát triển, bé đợi Enjoy chút nhé!")}
          className="bg-white/70 rounded-3xl border border-dashed border-slate-200 p-8 flex flex-col items-center text-center relative opacity-85 hover:opacity-100 transition-all duration-200 shadow-xs cursor-pointer"
        >
          <div className="absolute top-5 right-5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold rounded-full tracking-wider uppercase">
            Sắp ra mắt
          </div>

          <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform duration-200 border border-slate-200">
            <span className="material-symbols-outlined text-[40px]">draw</span>
          </div>

          <div className="mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
              Sáng Tạo Nghệ Thuật
            </span>
          </div>

          <h2 className="text-xl font-display font-bold text-slate-700 mb-2">
            Vẽ Cùng ENjoy
          </h2>

          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
            Thỏa sức sáng tạo hội họa! Bé vẽ các con vật, đồ vật học tập và AI của ENjoy sẽ đoán xem bé đang vẽ gì nhé!
          </p>

          <button disabled className="mt-7 px-7 py-3 bg-slate-100 text-slate-400 font-display font-extrabold rounded-2xl text-xs uppercase tracking-wider cursor-not-allowed">
            ĐANG HOÀN THIỆN
          </button>
        </div>
      </div>
    </div>
  );
};

