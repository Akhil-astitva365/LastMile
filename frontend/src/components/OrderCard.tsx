import React from 'react';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Navigation, Calendar, Scale, ArrowRight, RefreshCcw } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onTrack?: (order: Order) => void;
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
  const canReschedule = (order.status === 'FAILED' || order.status === 'FAILED_DELIVERY' || order.status === 'RESCHEDULED');

  return (
    <div className="ios-glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4 bg-black/90 border border-neutral-800 hover:border-orange-500/50 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-impact uppercase tracking-widest text-neutral-400">ORDER NUMBER</span>
            <h4 className="text-lg font-impact text-orange-500 tracking-wider">{order.orderNumber}</h4>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Addresses */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-orange-500/10 text-orange-500 shrink-0 mt-0.5 border border-orange-500/30">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-impact uppercase tracking-wider text-neutral-400">PICKUP ADDRESS</div>
              <div className="text-xs font-semibold text-white truncate">{order.pickupAddress}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-orange-500/10 text-orange-500 shrink-0 mt-0.5 border border-orange-500/30">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-impact uppercase tracking-wider text-neutral-400">DROP ADDRESS</div>
              <div className="text-xs font-semibold text-white truncate">{order.dropAddress}</div>
            </div>
          </div>
        </div>

        {/* Specs & Pricing Grid */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
            <span className="text-[9px] font-impact uppercase text-neutral-400 block">BILLABLE WEIGHT</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Scale className="w-3 h-3 text-orange-500" /> {order.billableWeight} kg
            </span>
          </div>

          <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
            <span className="text-[9px] font-impact uppercase text-neutral-400 block">FINAL PRICE</span>
            <span className="font-impact text-orange-500 text-sm">₹{order.finalCharge}</span>
          </div>

          <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800 col-span-2 sm:col-span-1">
            <span className="text-[9px] font-impact uppercase text-neutral-400 block">DELIVERY DATE</span>
            <span className="font-bold text-white flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-orange-500" /> {order.deliveryDate || 'Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
        {onTrack && (
          <button
            onClick={() => onTrack(order)}
            className="flex-1 py-2.5 rounded-full ios-button-primary text-xs flex items-center justify-center gap-1.5"
          >
            LIVE TRACKING <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {canReschedule && onReschedule && (
          <button
            onClick={() => onReschedule(order)}
            className="px-4 py-2.5 rounded-full bg-neutral-900 border border-orange-500 text-orange-400 font-impact text-xs hover:bg-orange-500 hover:text-black transition-all flex items-center gap-1"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> RESCHEDULE
          </button>
        )}

        {onAction && actionLabel && (
          <button
            onClick={() => onAction(order)}
            className="px-4 py-2.5 rounded-full ios-button-emerald text-xs"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
