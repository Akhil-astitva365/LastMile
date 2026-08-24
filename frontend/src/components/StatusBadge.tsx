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
      return 'bg-neutral-900 text-white border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
    }
    if (isFailed) {
      return 'bg-neutral-900 text-white border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
    }
    return 'bg-black text-white border-orange-500/60 shadow-[0_0_12px_rgba(255,102,0,0.3)]';
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-impact tracking-wider uppercase border transition-all ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : isFailed ? 'bg-rose-400' : 'bg-orange-500'} animate-pulse shrink-0`} />
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
};
