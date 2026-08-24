import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isCompleted = status === 'DELIVERED';
  const isFailed = status === 'FAILED' || status === 'FAILED_DELIVERY';

  const getBadgeStyle = () => {
    if (isCompleted) {
      return 'bg-neutral-900 text-white border-white/40 shadow-sm';
    }
    if (isFailed) {
      return 'bg-neutral-900 text-neutral-300 border-neutral-700 shadow-sm';
    }
    return 'bg-black text-white border-white/60 shadow-sm';
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border transition-all ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-white' : isFailed ? 'bg-neutral-400' : 'bg-white'} animate-pulse shrink-0`} />
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
};
