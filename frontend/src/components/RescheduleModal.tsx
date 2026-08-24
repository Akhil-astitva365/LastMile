import React, { useState } from 'react';
import { Order } from '../types';
import { Calendar, X, AlertTriangle } from 'lucide-react';

interface RescheduleModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (orderId: number, newDate: string, reason: string, notes: string) => Promise<void>;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ order, onClose, onSubmit }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [newDate, setNewDate] = useState<string>(minDateStr);
  const [reason, setReason] = useState<string>('CUSTOMER_UNAVAILABLE');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(order.id, newDate, reason, notes);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-black border border-neutral-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white" />
            <h3 className="font-bold text-lg text-white">Reschedule Delivery</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-white shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-300">
            Order <span className="font-bold text-white">#{order.orderNumber}</span> delivery update required. Select new delivery date.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white font-bold mb-1">New Delivery Date</label>
            <input
              type="date"
              min={minDateStr}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full ios-input rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-1">Reason for Reschedule</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full ios-input rounded-xl px-3 py-2 text-white"
            >
              <option value="CUSTOMER_UNAVAILABLE">Customer Unavailable</option>
              <option value="WRONG_ADDRESS">Wrong Address</option>
              <option value="CUSTOMER_REFUSED">Refused Delivery</option>
              <option value="WEATHER_ISSUE">Weather Issue</option>
              <option value="OTHER">Other Reason</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-bold mb-1">Instructions (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Leave package at security desk"
              className="w-full ios-input rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
