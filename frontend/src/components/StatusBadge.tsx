import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (status: OrderStatus | string) => {
    switch (status) {
      case 'CREATED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ASSIGNED':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'DISPATCHED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'PICKED_UP':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'IN_TRANSIT':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'FAILED':
      case 'FAILED_DELIVERY':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'RESCHEDULED':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'RETURNED':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wide uppercase ${getBadgeStyle(
        status
      )}`}
    >
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
};
