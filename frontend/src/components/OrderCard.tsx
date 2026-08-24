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

  // Format delivery date nicely to fit grid without truncation
  const formattedDate = order.deliveryDate ? order.deliveryDate : 'Today';

  return (
    <div className="ios-glass-card p-4 sm:p-5 rounded-3xl flex flex-col justify-between space-y-3.5 bg-black/40 backdrop-blur-md transition-all h-full min-h-[350px] select-none">
      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
        {/* Header - Order Number & Status Badge with Reschedule Loop Icon */}
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800/40 gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block whitespace-nowrap">ORDER NUMBER</span>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider font-sreda whitespace-nowrap truncate">{order.orderNumber}</h4>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={order.status} />
            {canReschedule && (
              <button
                type="button"
                onClick={handleRescheduleClick}
                title="Reschedule Failed Delivery"
                className="p-1 sm:p-1.5 rounded-full bg-neutral-900 text-white hover:bg-white hover:text-black transition-all active:scale-90 flex items-center justify-center shrink-0 shadow-sm"
              >
                <RefreshCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="space-y-2.5 my-auto">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-neutral-900 text-white shrink-0">
              <MapPin className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">PICKUP ADDRESS</div>
              <div className="text-[11px] font-semibold text-white truncate" title={order.pickupAddress}>{order.pickupAddress}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-neutral-900 text-white shrink-0">
              <Navigation className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">DROP ADDRESS</div>
              <div className="text-[11px] font-semibold text-white truncate" title={order.dropAddress}>{order.dropAddress}</div>
            </div>
          </div>
        </div>

        {/* Specs & Pricing 3-Column Grid - Borderless Boxes */}
        <div className="pt-2.5 border-t border-neutral-800/40 grid grid-cols-3 gap-1.5 text-xs">
          <div className="bg-neutral-950/80 p-2 rounded-xl h-13 flex flex-col justify-center min-w-0">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase text-neutral-400 block truncate">WEIGHT</span>
            <span className="font-bold text-white flex items-center gap-1 text-[10px] sm:text-xs truncate">
              <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-300 shrink-0" /> {order.billableWeight} kg
            </span>
          </div>

          <div className="bg-neutral-950/80 p-2 rounded-xl h-13 flex flex-col justify-center min-w-0">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase text-neutral-400 block truncate">PRICE</span>
            <span className="font-bold text-white text-[11px] sm:text-xs font-sreda truncate">₹{order.finalCharge}</span>
          </div>

          <div className="bg-neutral-950/80 p-2 rounded-xl h-13 flex flex-col justify-center min-w-0">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase text-neutral-400 block truncate">DATE</span>
            <span className="font-bold text-white flex items-center gap-0.5 text-[9px] sm:text-[10px] truncate" title={formattedDate}>
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-300 shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center gap-1.5 sm:gap-2 pt-2.5 border-t border-neutral-800/40 min-h-[48px]">
        <button
          onClick={handleTrackClick}
          className="flex-1 min-w-0 h-8 sm:h-9 px-3 rounded-full ios-button-primary text-[10px] sm:text-[11px] font-bold tracking-tight flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap leading-none"
        >
          <span className="whitespace-nowrap">LIVE TRACKING</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>

        {/* Delete Order Button (Customer Portal Only) */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            title="Delete Order"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-all active:scale-95 flex items-center justify-center shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {onAction && actionLabel && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction(order); }}
            className="h-8 sm:h-9 px-3 rounded-full ios-button-emerald text-[10px] sm:text-[11px] font-bold tracking-tight shrink-0 whitespace-nowrap leading-none"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
