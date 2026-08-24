import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { Calendar, ArrowLeft, RefreshCcw, AlertCircle, CheckCircle } from 'lucide-react';

export const ReschedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('Customer Request');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    orderApi.getOrderById(Number(id))
      .then((res) => {
        setOrder(res);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNewDate(tomorrow.toISOString().split('T')[0]);
      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.message || 'Failed to fetch order details');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newDate) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await orderApi.rescheduleOrder(Number(id), newDate, reason, notes);
      navigate('/customer');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to reschedule order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-neutral-400 font-bold">
        Loading reschedule details...
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="ios-glass-panel p-8 rounded-3xl space-y-4 border border-neutral-800">
          <AlertCircle className="w-12 h-12 text-white mx-auto" />
          <h3 className="text-lg font-bold text-white">Reschedule Error</h3>
          <p className="text-xs text-neutral-400">{errorMessage || 'Order not found'}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-full ios-button-primary text-xs">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide">RESCHEDULE DELIVERY</h2>
      </div>

      <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl space-y-6 bg-black/95 border border-neutral-800 shadow-2xl">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ORDER #{order.orderNumber}</span>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <RefreshCcw className="w-6 h-6 text-white" /> Request Delivery Reschedule
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            Pickup: {order.pickupAddress} ➔ Drop: {order.dropAddress}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-white font-bold mb-1.5 pl-1">New Delivery Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-white absolute left-3.5 top-3.5" />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full ios-input rounded-2xl pl-10 pr-4 py-3 text-white font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-1.5 pl-1">Reason for Reschedule</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium"
            >
              <option value="Customer Unavailable">Customer Unavailable</option>
              <option value="Incorrect Address">Incorrect Address</option>
              <option value="Customer Requested Delay">Customer Requested Delay</option>
              <option value="Weather / Regional Delay">Weather / Regional Delay</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-bold mb-1.5 pl-1">Additional Delivery Instructions (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Leave package at security gate, call before arrival..."
              className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full ios-button-primary text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? 'Submitting Reschedule...' : 'Confirm Reschedule Date'}
          </button>
        </form>
      </div>
    </div>
  );
};
