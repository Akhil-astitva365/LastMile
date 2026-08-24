import React, { useState, useEffect } from 'react';
import { agentApi, orderApi } from '../services/api';
import { Order, OrderStatus, TrackingEvent } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { MapView } from '../components/MapView';
import { Truck, MapPin, CheckCircle2, AlertCircle, RefreshCw, Navigation, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const AgentDashboard: React.FC = () => {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
        setSelectedOrder(data[0]);
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

  // Pagination logic: Exactly 6 orders per page
  const totalPages = Math.ceil(assignedOrders.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = assignedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    setIsSubmitting(true);
    try {
      const updated = await agentApi.updateStatus(orderId, nextStatus, `Updated to ${nextStatus}`, currentLat, currentLon);
      await fetchAssignedOrders();
      setSelectedOrder(updated);
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
      alert('GPS location & status updated!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="ios-glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/95 border border-neutral-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-white text-black font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AGENT PORTAL</h2>
            <p className="text-xs text-neutral-400 font-medium">Assigned delivery queue ({assignedOrders.length} total, 6 per page)</p>
          </div>
        </div>

        {/* Location & Availability Toolbar */}
        <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-full border border-neutral-800 text-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2">Status:</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-black border border-neutral-800 rounded-full px-3 py-1 text-white font-bold focus:outline-none"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BUSY">BUSY</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>

          <button
            onClick={handleUpdateLocation}
            className="px-4 py-1.5 rounded-full ios-button-primary text-black font-bold flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" /> Update GPS
          </button>
        </div>
      </div>

      {/* Main Grid: Left Orders (Max 6), Right Corner Large Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Assigned Delivery Cards & 6-Item Pagination */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-white" /> Assigned Orders Queue
            </h3>
            <button onClick={fetchAssignedOrders} className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="ios-glass-panel p-8 rounded-2xl text-center text-neutral-400 text-xs font-bold">
              Fetching assigned tasks...
            </div>
          ) : assignedOrders.length === 0 ? (
            <div className="ios-glass-panel p-12 rounded-3xl text-center space-y-2 border border-neutral-800">
              <Truck className="w-10 h-10 text-neutral-600 mx-auto" />
              <div className="text-sm font-bold text-white">No assigned delivery tasks</div>
            </div>
          ) : (
            <>
              {/* 6 Assigned Order Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`ios-glass-card p-5 rounded-3xl space-y-3 bg-black/90 border border-neutral-800 cursor-pointer transition-all ${
                      selectedOrder?.id === o.id ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">ORDER</span>
                        <h4 className="font-bold text-white text-base">{o.orderNumber}</h4>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="text-neutral-300 font-medium truncate">
                        <b className="text-neutral-400">From:</b> {o.pickupAddress}
                      </div>
                      <div className="text-neutral-300 font-medium truncate">
                        <b className="text-neutral-400">To:</b> {o.dropAddress}
                      </div>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800 text-xs">
                      {o.status === 'ASSIGNED' || o.status === 'DISPATCHED' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o.id, 'PICKED_UP'); }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 rounded-full ios-button-primary text-black font-bold text-[11px]"
                        >
                          Pick Up
                        </button>
                      ) : null}
                      {o.status === 'PICKED_UP' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o.id, 'IN_TRANSIT'); }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 rounded-full ios-button-primary text-black font-bold text-[11px]"
                        >
                          In Transit
                        </button>
                      )}
                      {o.status === 'IN_TRANSIT' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o.id, 'OUT_FOR_DELIVERY'); }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 rounded-full ios-button-primary text-black font-bold text-[11px]"
                        >
                          Out For Delivery
                        </button>
                      )}
                      {o.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(o.id, 'DELIVERED'); }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 rounded-full ios-button-emerald text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </button>
                      )}

                      {o.status !== 'DELIVERED' && o.status !== 'FAILED' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setFailOrder(o); }}
                          className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold text-[10px]"
                        >
                          Report Failure
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="ios-glass-panel px-6 py-4 rounded-2xl flex items-center justify-between bg-black/90 border border-neutral-800 text-xs">
                  <span className="text-neutral-400 font-medium">
                    Page <b className="text-white">{currentPage}</b> of <b className="text-white">{totalPages}</b>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold disabled:opacity-40 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold disabled:opacity-40 flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Corner: Separate Large View Map */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="ios-glass-panel p-4 rounded-3xl bg-black/95 border border-neutral-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 px-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">
                  {selectedOrder ? `Order #${selectedOrder.orderNumber}` : 'Select Order for Map'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                LARGE MAP VIEW
              </span>
            </div>

            {selectedOrder ? (
              <div className="h-[550px] rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
                <MapView
                  pickupLat={selectedOrder.pickupLatitude || 23.2599}
                  pickupLon={selectedOrder.pickupLongitude || 77.4126}
                  dropLat={selectedOrder.dropLatitude || 22.7196}
                  dropLon={selectedOrder.dropLongitude || 75.8577}
                  agentLat={currentLat}
                  agentLon={currentLon}
                  agentName="You (Agent)"
                />
              </div>
            ) : (
              <div className="h-[550px] rounded-2xl bg-neutral-950 flex items-center justify-center text-neutral-500 text-xs font-bold border border-neutral-800">
                Click an order to display route map
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Failure Reason Modal */}
      {failOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-black border border-neutral-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base text-white">Report Delivery Failure</h3>
              </div>
              <button onClick={() => setFailOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMarkFailedSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white font-bold mb-1">Select Failure Reason</label>
                <select
                  value={failReason}
                  onChange={(e) => setFailReason(e.target.value)}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white"
                >
                  <option value="CUSTOMER_UNAVAILABLE">Customer Unavailable</option>
                  <option value="WRONG_ADDRESS">Wrong Address</option>
                  <option value="ADDRESS_NOT_FOUND">Address Not Found</option>
                  <option value="CUSTOMER_REFUSED">Customer Refused Delivery</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-bold mb-1">Remarks</label>
                <textarea
                  rows={3}
                  value={failRemarks}
                  onChange={(e) => setFailRemarks(e.target.value)}
                  placeholder="Provide failure context..."
                  className="w-full ios-input rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFailOrder(null)}
                  className="px-4 py-2 rounded-xl text-neutral-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold"
                >
                  Confirm Failure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
