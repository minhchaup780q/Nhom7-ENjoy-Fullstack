import React from 'react';

interface FormattedAiTextProps {
  text?: string | null;
  className?: string;
  badgeClassName?: string;
}

export const renderFormattedAiText = (
  text?: string | null,
  badgeClassName: string = 'inline-flex items-center px-2 py-0.5 mx-0.5 font-bold text-[#ff5e97] bg-pink-50 border border-pink-200 rounded-lg shadow-2xs align-baseline'
): React.ReactNode => {
  if (!text) return null;

  // Split by markdown bold (**...**) or italic (*...*)
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const content = part.slice(2, -2);
      return (
        <span key={index} className={badgeClassName}>
          {content}
        </span>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const content = part.slice(1, -1);
      return (
        <span key={index} className="font-bold text-[#ff5e97] mx-0.5">
          {content}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const FormattedAiText: React.FC<FormattedAiTextProps> = ({
  text,
  className = '',
  badgeClassName,
}) => {
  if (!text) return null;
  return (
    <span className={className}>
      {renderFormattedAiText(text, badgeClassName)}
    </span>
  );
};

export default FormattedAiText;
