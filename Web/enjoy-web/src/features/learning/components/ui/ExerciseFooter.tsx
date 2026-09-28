import React from 'react';
import { Button3D } from '../../../../components/ui/Button3D';
import mascotImg from '../../../../assets/mascot.png';
import fightingImg from '../../../../assets/fighting.jpg';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';

export type FooterStatus = 'idle' | 'selected' | 'correct' | 'incorrect';

interface ExerciseFooterProps {
  status: FooterStatus;
  onCheck: () => void;
  onNext: () => void;
  disabled?: boolean;
  correctAnswer?: string;
}

export const ExerciseFooter: React.FC<ExerciseFooterProps> = ({
  status,
  onCheck,
  onNext,
  disabled,
  correctAnswer
}) => {
  const getBackgroundColorStyle = () => {
    switch (status) {
      case 'correct': return '#58cc02';
      case 'incorrect': return '#ff4b4b';
      case 'idle':
      case 'selected':
      default: return '#e5e7eb';
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'idle':
        return 'Chưa có câu trả lời';
      case 'selected':
        return 'Sẵn sàng kiểm tra';
      case 'correct':
        return 'Tuyệt vời!';
      case 'incorrect':
        // Nếu có correctAnswer truyền vào, hiển thị thông báo đặc biệt cho vòng như FILL_IN_BLANK
        if (correctAnswer) return 'Mình cùng thử lại sau nhé!';
        return 'Chưa chính xác, thử lại nhé!';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'idle':
        return 'text-gray-500';
      case 'selected':
        return 'text-gray-700';
      case 'correct':
      case 'incorrect':
      default:
        return 'text-white';
    }
  };

  return (
    <div 
      className="w-full border-t-4 border-black/10 transition-colors duration-300"
      style={{ backgroundColor: getBackgroundColorStyle() }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-2 md:py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <img 
            src={status === 'incorrect' ? fightingImg : mascotImg} 
            alt="Mascot" 
            className="w-10 h-10 md:w-16 md:h-16 object-contain rounded-xl bg-white/20 p-1" 
          />
          <div className="flex flex-col">
            <span className={`font-bold text-base md:text-xl font-display ${getTextColor()}`}>
              {getMessage()}
            </span>
            {status === 'incorrect' && correctAnswer && (
              <span className="text-white/90 text-sm md:text-base font-bold mt-1">
                Đáp án đúng: <span className="text-white font-black underline">{correctAnswer}</span>
              </span>
            )}
          </div>
        </div>
        
        <div>
          {(status === 'idle' || status === 'selected') ? (
            <Button3D
              variant={status === 'selected' ? 'green' : 'gray'} 
              onClick={onCheck}
              disabled={disabled || status === 'idle'}
              size="md"
            >
              <div className="flex items-center gap-2">
                <RocketLaunchIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">KIỂM TRA ĐÁP ÁN</span>
              </div>
            </Button3D>
          ) : (
            <Button3D
              variant={status === 'correct' ? 'green' : 'red'}
              onClick={onNext}
              size="md"
              className="text-sm md:text-base !border-white"
            >
              TIẾP TỤC
            </Button3D>
          )}
        </div>
      </div>
    </div>
  );
};
