import React from 'react';
import {
  CheckCircleIcon,
  PencilSquareIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import type { SessionBadge, TopicBadge, PartBadge } from '../api/adminCourseApi';

export type BadgeStatus = SessionBadge | TopicBadge | PartBadge;

export interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  customLabel?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  customLabel,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PUBLISHED':
        return {
          label: customLabel || 'Đã phát hành',
          bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
          dotClass: 'bg-emerald-500',
          icon: CheckCircleIcon,
        };
      case 'HAS_DRAFT':
        return {
          label: customLabel || 'Có bản nháp mới',
          bgClass: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10',
          dotClass: 'bg-sky-500 animate-pulse',
          icon: PencilSquareIcon,
        };
      case 'DRAFT':
      default:
        return {
          label: customLabel || 'Bản nháp',
          bgClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
          dotClass: 'bg-amber-500',
          icon: ClockIcon,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ring-1 ring-inset transition-colors duration-150 ${config.bgClass} ${sizeClasses} ${className}`}
      title={config.label}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />
      {showIcon && <Icon className={`${iconSizes} shrink-0 opacity-80`} aria-hidden="true" />}
      <span className="truncate">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
