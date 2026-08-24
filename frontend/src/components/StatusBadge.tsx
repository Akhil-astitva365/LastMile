import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (status: OrderStatus | string) => {
    switch (status) {
      case 'CREATED':
        return 'bg-blue-500/15 text-blue-300 border-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]';
      case 'ASSIGNED':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]';
      case 'DISPATCHED':
        return 'bg-sky-500/15 text-sky-300 border-sky-400/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]';
      case 'PICKED_UP':
        return 'bg-purple-500/15 text-purple-300 border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]';
      case 'IN_TRANSIT':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-500/15 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
      case 'DELIVERED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
      case 'FAILED':
      case 'FAILED_DELIVERY':
        return 'bg-rose-500/15 text-rose-300 border-rose-400/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
      case 'RESCHEDULED':
        return 'bg-orange-500/15 text-orange-300 border-orange-400/30 shadow-[0_0_12px_rgba(249,115,22,0.2)]';
      case 'RETURNED':
        return 'bg-pink-500/15 text-pink-300 border-pink-400/30 shadow-[0_0_12px_rgba(236,72,153,0.2)]';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-400/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-md transition-all ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
};
