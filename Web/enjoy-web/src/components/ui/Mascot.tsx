import React from 'react';
import mascotImg from '../../assets/mascot.png';

interface MascotProps {
  expression?: 'happy' | 'sad' | 'thinking' | 'normal';
  speechBubbleText?: string;
  bubblePosition?: 'top' | 'right' | 'left';
  size?: number;
}

export const Mascot: React.FC<MascotProps> = ({
  expression = 'happy',
  speechBubbleText,
  bubblePosition = 'right',
  size = 150,
}) => {
  const getAnimationClass = () => {
    switch (expression) {
      case 'happy':
        return 'animate-float';
      case 'thinking':
        return 'animate-bounce-soft';
      case 'sad':
        return 'animate-shake';
      default:
        return 'animate-float';
    }
  };

  const renderBubble = () => {
    if (!speechBubbleText) return null;

    const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-4',
      right: 'left-full top-1/2 -translate-y-1/2 ml-4',
      left: 'right-full top-1/2 -translate-y-1/2 mr-4',
    };

    const arrowClasses = {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-white border-x-transparent border-b-transparent',
      right: 'right-full top-1/2 -translate-y-1/2 border-r-white border-y-transparent border-l-transparent',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-white border-y-transparent border-r-transparent',
    };

    return (
      <div
        className={`absolute ${positionClasses[bubblePosition]} z-10 bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 shadow-sm min-w-[180px] max-w-[280px] animate-fade-in-up`}
      >
        <p className="text-sm font-semibold text-text-main leading-relaxed text-left">
          {speechBubbleText}
        </p>
        <div
          className={`absolute border-[8px] border-solid w-0 h-0 ${arrowClasses[bubblePosition]}`}
          style={{
            filter: 'drop-shadow(0 2px 0 #e5e5e5)',
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={getAnimationClass()}>
        <img
          src={mascotImg}
          alt="ENjoy Mascot"
          width={size}
          height={size}
          className="object-contain drop-shadow-md rounded-full select-none pointer-events-none"
        />
      </div>
      {renderBubble()}
    </div>
  );
};
