import React from 'react';
import congratulationImg from '../../../../assets/congratulation.png';
import mascotImg from '../../../../assets/mascot.png';
import { Button3D } from '../../../../components/ui/Button3D';

interface Props {
  onNext: () => void;
}

export const CongratulationScreen: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col z-50 bg-[#e0f6ff]">
      {/* Khung chứa nội dung chính (Ảnh nền + Chữ) */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Ảnh nền giữ nguyên tỉ lệ, không bị phóng to nát ảnh */}
        <img 
          src={congratulationImg} 
          alt="Congratulation" 
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Chữ hiển thị chính giữa màn hình */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full animate-[bounce_1s_ease-in-out]">
          <div className="bg-white/95 backdrop-blur-md px-6 py-8 md:px-12 md:py-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border-4 border-white flex flex-col items-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#ff9600] font-display uppercase tracking-widest mb-4 drop-shadow-[0_3px_0_#cc7600] text-center leading-tight">
              BẠN ĐÃ HOÀN THÀNH BÀI HỌC
            </h1>
            <p className="text-xl md:text-2xl text-[#1cb0f6] font-bold drop-shadow-sm">
              Xuất sắc! Hãy tiếp tục chinh phục thử thách mới nào!
            </p>
          </div>
        </div>
      </div>

      {/* Footer giống hệt ExerciseFooter */}
      <div className="w-full bg-[#58cc02] border-t-4 border-black/10 transition-colors duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] shrink-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-2 md:py-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <img src={mascotImg} alt="Mascot" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="font-bold text-base md:text-lg font-display text-white">
              Tuyệt vời!
            </span>
          </div>
          
          <div>
            <Button3D
              variant="green"
              onClick={onNext}
              size="md"
              className="text-sm md:text-base !border-white shadow-xl animate-pulse"
            >
              BÀI TIẾP THEO
            </Button3D>
          </div>
        </div>
      </div>
    </div>
  );
};
