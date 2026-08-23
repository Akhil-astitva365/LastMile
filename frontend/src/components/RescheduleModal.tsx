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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-lg text-slate-100">Reschedule Delivery</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200">
            Order <span className="font-bold text-rose-400">#{order.orderNumber}</span> failed delivery. Please select a new date for reassignment.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">New Delivery Date</label>
            <input
              type="date"
              min={minDateStr}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Reason for Reschedule</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="CUSTOMER_UNAVAILABLE">Customer Unavailable</option>
              <option value="WRONG_ADDRESS">Wrong Address</option>
              <option value="CUSTOMER_REFUSED">Refused Delivery</option>
              <option value="WEATHER_ISSUE">Weather Issue</option>
              <option value="OTHER">Other Reason</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Additional Instructions (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please deliver between 2 PM and 5 PM"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
