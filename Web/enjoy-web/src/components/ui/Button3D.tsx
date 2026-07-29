import React from 'react';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'green' | 'blue' | 'gray';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'pink',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'pink':
        return 'btn-3d-pink';
      case 'green':
        return 'btn-3d-green';
      case 'blue':
        return 'btn-3d-blue';
      case 'gray':
        return 'btn-3d-gray';
      default:
        return 'btn-3d-pink';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-xs rounded-xl';
      case 'md':
        return 'px-6 py-3 text-sm rounded-2xl';
      case 'lg':
        return 'px-8 py-4 text-base rounded-2xl';
      default:
        return 'px-6 py-3 text-sm rounded-2xl';
    }
  };

  return (
    <button
      className={`btn-3d ${getVariantClass()} ${getSizeClass()} ${
        fullWidth ? 'w-full' : ''
      } select-none ${
        props.disabled 
          ? 'opacity-50 cursor-not-allowed pointer-events-none' 
          : 'active:translate-y-[4px]'
      } outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
