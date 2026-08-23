import React from 'react';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, ArrowRight, Package, Calendar, User, DollarSign } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onTrack: (order: Order) => void;
  onReschedule?: (order: Order) => void;
  onAction?: (order: Order) => void;
  actionLabel?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onTrack,
  onReschedule,
  onAction,
  actionLabel,
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order ID</span>
            <h4 className="text-base font-bold text-cyan-400 tracking-tight">{order.orderNumber}</h4>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Route Details */}
        <div className="my-4 flex items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-900">
          <div className="flex-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pickup</span>
            <p className="text-xs text-slate-200 font-medium truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              {order.pickupAddress}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex-1 text-right">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Drop</span>
            <p className="text-xs text-slate-200 font-medium truncate flex items-center gap-1 justify-end">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              {order.dropAddress}
            </p>
          </div>
        </div>

        {/* Specs & Pricing */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Billable Weight</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <Package className="w-3 h-3 text-amber-400" />
              {order.billableWeight} kg
            </span>
          </div>

          <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Total Charge</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              ₹{order.finalCharge} ({order.paymentType})
            </span>
          </div>
        </div>

        {/* Agent details if assigned */}
        {order.assignedAgentName && (
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <User className="w-3 h-3 text-cyan-400" />
            Agent: <span className="text-slate-200 font-semibold">{order.assignedAgentName}</span>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        {order.status === 'FAILED' && onReschedule && (
          <button
            onClick={() => onReschedule(order)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" /> Reschedule
          </button>
        )}

        {onAction && actionLabel && (
          <button
            onClick={() => onAction(order)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all"
          >
            {actionLabel}
          </button>
        )}

        <button
          onClick={() => onTrack(order)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};
