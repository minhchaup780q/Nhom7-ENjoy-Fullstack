import React, { useState } from 'react';
import { CameraIcon, PencilSquareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { RealWorldExplorer } from './RealWorldExplorer';

export const ExploreDashboard: React.FC = () => {
  const [activeSubMode, setActiveSubMode] = useState<string | null>(null);

  if (activeSubMode === 'realworld') {
    return <RealWorldExplorer onBack={() => setActiveSubMode(null)} />;
  }

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto flex flex-col justify-center space-y-8 select-none">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-primary-soft text-primary rounded-2xl animate-bounce">
          <SparklesIcon className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="text-4xl font-display font-extrabold text-[#2b2b2b] uppercase tracking-wide">
          Học Và Khám Phá Cùng Enjoy
        </h1>
        <p className="text-sm font-semibold text-text-muted max-w-lg mx-auto">
          Chào mừng bé đến với thế giới đầy điều thú vị! Hãy cùng Enjoy khám phá và học thêm nhiều từ vựng mới nhé!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
        {/* Card 1: Real World Explorer */}
        <div 
          onClick={() => setActiveSubMode('realworld')}
          className="bg-white border-4 border-border-main hover:border-primary/50 rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-200 transform hover:-translate-y-2 hover:shadow-xl group"
        >
          <div className="w-20 h-20 bg-primary-soft text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
            <CameraIcon className="w-10 h-10 stroke-[2]" />
          </div>
          <h2 className="text-xl font-display font-extrabold text-[#2b2b2b] uppercase mb-3">
            Khám Phá Thế Giới Thực
          </h2>
          <p className="text-xs text-text-muted font-semibold leading-relaxed">
            Dùng camera để quét các đồ dùng học tập xung quanh bé. Enjoy sẽ giúp bé nhận diện và dạy bé tên tiếng Anh của chúng!
          </p>
          <button className="mt-8 px-6 py-3 bg-primary text-white font-display font-extrabold rounded-2xl text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors duration-150 border-b-4 border-primary-dark shadow-md cursor-pointer">
            Khám phá ngay
          </button>
        </div>

        {/* Card 2: Drawing Explorer (Coming Soon) */}
        <div 
          onClick={() => alert("Tính năng Vẽ Cùng Enjoy đang được phát triển, bé đợi Enjoy chút nhé!")}
          className="bg-white/70 border-4 border-dashed border-border-main rounded-3xl p-8 flex flex-col items-center text-center relative opacity-85 group hover:opacity-100 transition-all duration-200"
        >
          <div className="absolute top-4 right-4 px-3 py-1 bg-accent-soft text-accent text-[10px] font-extrabold rounded-full tracking-wider uppercase border border-accent/20">
            Sắp ra mắt
          </div>
          <div className="w-20 h-20 bg-[#f5f5f5] text-[#8e8e8e] rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-200">
            <PencilSquareIcon className="w-10 h-10 stroke-[2]" />
          </div>
          <h2 className="text-xl font-display font-extrabold text-[#8e8e8e] uppercase mb-3">
            Vẽ Cùng Enjoy
          </h2>
          <p className="text-xs text-text-muted font-semibold leading-relaxed">
            Thỏa sức sáng tạo hội họa! Bé vẽ các con vật, đồ vật học tập và Enjoy sẽ đoán xem bé đang vẽ gì nhé!
          </p>
          <button disabled className="mt-8 px-6 py-3 bg-[#e2e2e2] text-[#8e8e8e] font-display font-extrabold rounded-2xl text-xs uppercase tracking-wider cursor-not-allowed">
            Chưa mở khóa
          </button>
        </div>
      </div>
    </div>
  );
};
