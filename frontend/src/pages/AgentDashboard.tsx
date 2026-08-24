import React, { useState, useEffect } from 'react';
import { agentApi, orderApi } from '../services/api';
import { Order, OrderStatus, TrackingEvent } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { MapView } from '../components/MapView';
import { Truck, MapPin, CheckCircle2, AlertCircle, RefreshCw, Navigation, X } from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingTimeline, setTrackingTimeline] = useState<TrackingEvent[]>([]);

  // Agent Availability & Coordinates state
  const [availability, setAvailability] = useState<string>('AVAILABLE');
  const [currentLat, setCurrentLat] = useState<number>(23.2599);
  const [currentLon, setCurrentLon] = useState<number>(77.4126);

  // Failure modal state
  const [failOrder, setFailOrder] = useState<Order | null>(null);
  const [failReason, setFailReason] = useState<string>('CUSTOMER_UNAVAILABLE');
  const [failRemarks, setFailRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchAssignedOrders = async () => {
    setIsLoading(true);
    try {
      const data = await agentApi.getAssignedOrders();
      setAssignedOrders(data);
      if (data.length > 0 && !selectedOrder) {
        handleSelectOrder(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const handleSelectOrder = async (order: Order) => {
    setSelectedOrder(order);
    try {
      const events = await orderApi.getTrackingTimeline(order.id);
      setTrackingTimeline(events);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    setIsSubmitting(true);
    try {
      const updated = await agentApi.updateStatus(orderId, nextStatus, `Updated to ${nextStatus}`, currentLat, currentLon);
      await fetchAssignedOrders();
      handleSelectOrder(updated);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkFailedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!failOrder) return;
    setIsSubmitting(true);
    try {
      await agentApi.markFailed(failOrder.id, failReason, failRemarks);
      setFailOrder(null);
      setFailRemarks('');
      await fetchAssignedOrders();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to mark order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      await agentApi.updateLocation(currentLat, currentLon, availability);
      alert('Agent location & availability status updated successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Delivery Agent Portal</h2>
            <p className="text-xs text-slate-400 font-medium">Manage assigned deliveries and broadcast real-time GPS updates</p>
          </div>
        </div>

        {/* Location & Availability Toolbar */}
        <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-full border border-slate-800/80 text-xs shadow-inner">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">Status:</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-slate-200 font-bold focus:outline-none"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BUSY">BUSY</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>

          <button
            onClick={handleUpdateLocation}
            className="px-4 py-1.5 rounded-full ios-button-primary text-white font-black hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md"
          >
            <Navigation className="w-3.5 h-3.5" /> Update GPS
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Assigned Jobs Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-200 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-400" /> Assigned Delivery Jobs ({assignedOrders.length})
            </h3>
            <button onClick={fetchAssignedOrders} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
              Fetching assigned delivery tasks...
            </div>
          ) : assignedOrders.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-dashed border-slate-800">
              <Truck className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No active delivery assignments</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Set your status to AVAILABLE to automatically receive nearby package delivery assignments!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedOrders.map((o) => (
                <div key={o.id} className="glass-card p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Order ID</span>
                      <h4 className="font-bold text-cyan-400 text-base">{o.orderNumber}</h4>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Pickup Address</span>
                      <span className="font-medium text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {o.pickupAddress}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Drop Address</span>
                      <span className="font-medium text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> {o.dropAddress}
                      </span>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      {o.status === 'ASSIGNED' || o.status === 'DISPATCHED' ? (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'PICKED_UP')}
                          disabled={isSubmitting}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 disabled:opacity-50"
                        >
                          Mark Picked Up
                        </button>
                      ) : null}
                      {o.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'IN_TRANSIT')}
                          disabled={isSubmitting}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 disabled:opacity-50"
                        >
                          Mark In Transit
                        </button>
                      )}
                      {o.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'OUT_FOR_DELIVERY')}
                          disabled={isSubmitting}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {o.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'DELIVERED')}
                          disabled={isSubmitting}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                        </button>
                      )}
                    </div>

                    {o.status !== 'DELIVERED' && o.status !== 'FAILED' && (
                      <button
                        onClick={() => setFailOrder(o)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-xs hover:bg-rose-500/20 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Report Failed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Tracking Timeline */}
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6 sticky top-24">
              <div>
                <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Audit Log</div>
                <h3 className="font-extrabold text-lg text-slate-100">Order #{selectedOrder.orderNumber}</h3>
              </div>

              <MapView
                pickupLat={selectedOrder.pickupLatitude || 23.2599}
                pickupLon={selectedOrder.pickupLongitude || 77.4126}
                dropLat={selectedOrder.dropLatitude || 22.7196}
                dropLon={selectedOrder.dropLongitude || 75.8577}
                agentLat={currentLat}
                agentLon={currentLon}
                agentName="You (Agent)"
              />

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tracking History</h4>
                <TrackingTimeline events={trackingTimeline} />
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl text-center text-slate-500 text-xs">
              Select an order to view tracking history timeline.
            </div>
          )}
        </div>
      </div>

      {/* Failure Reason Modal */}
      {failOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-lg text-slate-100">Report Failed Delivery</h3>
              </div>
              <button onClick={() => setFailOrder(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMarkFailedSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Failure Reason</label>
                <select
                  value={failReason}
                  onChange={(e) => setFailReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="CUSTOMER_UNAVAILABLE">Customer Unavailable</option>
                  <option value="WRONG_ADDRESS">Wrong Address</option>
                  <option value="ADDRESS_NOT_FOUND">Address Not Found</option>
                  <option value="CUSTOMER_REFUSED">Customer Refused Delivery</option>
                  <option value="DAMAGED_PACKAGE">Damaged Package</option>
                  <option value="WEATHER_ISSUE">Weather Issue</option>
                  <option value="VEHICLE_ISSUE">Vehicle Break Down</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Remarks / Details</label>
                <textarea
                  rows={3}
                  value={failRemarks}
                  onChange={(e) => setFailRemarks(e.target.value)}
                  placeholder="Provide explicit context for the failure..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFailOrder(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Delivery Failure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
