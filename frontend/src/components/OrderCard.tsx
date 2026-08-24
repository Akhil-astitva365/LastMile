import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Navigation, Calendar, Scale, ArrowRight, RefreshCcw, Trash2 } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onTrack?: (order: Order) => void;
  onReschedule?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onAction?: (order: Order) => void;
  actionLabel?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onTrack,
  onReschedule,
  onDelete,
  onAction,
  actionLabel,
}) => {
  const navigate = useNavigate();
  const canReschedule = (order.status === 'FAILED' || order.status === 'FAILED_DELIVERY' || order.status === 'RESCHEDULED');

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTrack) {
      onTrack(order);
    } else {
      navigate(`/customer/orders/${order.id}/track`);
    }
  };

  const handleRescheduleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReschedule) {
      onReschedule(order);
    } else {
      navigate(`/customer/orders/${order.id}/reschedule`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(order);
    }
  };

  return (
    <div className="ios-glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4 bg-black/40 backdrop-blur-md border border-neutral-800 hover:border-neutral-500 transition-all h-full min-h-[350px]">
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Header - Single line Order Number with Truncation */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">ORDER NUMBER</span>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider font-sreda whitespace-nowrap">{order.orderNumber}</h4>
          </div>
          <div className="shrink-0">
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-3 my-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-neutral-900 text-white shrink-0 border border-neutral-700">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">PICKUP ADDRESS</div>
              <div className="text-xs font-semibold text-white truncate" title={order.pickupAddress}>{order.pickupAddress}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-neutral-900 text-white shrink-0 border border-neutral-700">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">DROP ADDRESS</div>
              <div className="text-xs font-semibold text-white truncate" title={order.dropAddress}>{order.dropAddress}</div>
            </div>
          </div>
        </div>

        {/* Specs & Pricing Grid - Fixed Uniform Height across 3 columns */}
        <div className="pt-3 border-t border-neutral-800 grid grid-cols-3 gap-2 text-xs">
          <div className="bg-neutral-950/80 p-2 rounded-xl border border-neutral-800 h-14 flex flex-col justify-center">
            <span className="text-[9px] font-bold uppercase text-neutral-400 block truncate">WEIGHT</span>
            <span className="font-bold text-white flex items-center gap-1 text-xs truncate">
              <Scale className="w-3 h-3 text-neutral-300 shrink-0" /> {order.billableWeight} kg
            </span>
          </div>

          <div className="bg-neutral-950/80 p-2 rounded-xl border border-neutral-800 h-14 flex flex-col justify-center">
            <span className="text-[9px] font-bold uppercase text-neutral-400 block truncate">PRICE</span>
            <span className="font-bold text-white text-sm font-sreda truncate">₹{order.finalCharge}</span>
          </div>

          <div className="bg-neutral-950/80 p-2 rounded-xl border border-neutral-800 h-14 flex flex-col justify-center">
            <span className="text-[9px] font-bold uppercase text-neutral-400 block truncate">DATE</span>
            <span className="font-bold text-white flex items-center gap-1 text-[11px] truncate">
              <Calendar className="w-3 h-3 text-neutral-300 shrink-0" /> {order.deliveryDate || 'Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed Height Baseline */}
      <div className="flex items-center gap-2 pt-3 border-t border-neutral-800 min-h-[54px]">
        <button
          onClick={handleTrackClick}
          className="flex-1 h-10 rounded-full ios-button-primary text-xs flex items-center justify-center gap-1.5 shrink-0 font-bold"
        >
          <span>LIVE TRACKING</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {canReschedule && (
          <button
            onClick={handleRescheduleClick}
            className="h-10 px-3.5 rounded-full bg-neutral-900 border border-neutral-600 text-white font-bold text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-1 shrink-0 whitespace-nowrap"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>RESCHEDULE</span>
          </button>
        )}

        {/* Delete Order Button (Customer Portal Only) */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            title="Delete Order"
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:border-white transition-all active:scale-95 flex items-center justify-center shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {onAction && actionLabel && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction(order); }}
            className="h-10 px-3.5 rounded-full ios-button-emerald text-xs shrink-0 whitespace-nowrap"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
