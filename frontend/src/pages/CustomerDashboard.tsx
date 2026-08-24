import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { Order, OrderQuoteResponse, OrderType, PaymentType, TrackingEvent } from '../types';
import { OrderCard } from '../components/OrderCard';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { RescheduleModal } from '../components/RescheduleModal';
import { MapView } from '../components/MapView';
import { LocationAutocompleteInput } from '../components/LocationAutocompleteInput';
import { Plus, Calculator, Package, RefreshCw, X, AlertCircle } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Selected Order for tracking timeline view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingTimeline, setTrackingTimeline] = useState<TrackingEvent[]>([]);

  // Reschedule modal order
  const [rescheduleOrder, setRescheduleOrder] = useState<Order | null>(null);

  // Order Quote & Form state
  const [pickupAddress, setPickupAddress] = useState<string>('VIT Bhopal Campus, Sehore, Bhopal 462001');
  const [dropAddress, setDropAddress] = useState<string>('Vijay Nagar, Indore 452001');
  const [length, setLength] = useState<number>(50);
  const [breadth, setBreadth] = useState<number>(40);
  const [height, setHeight] = useState<number>(30);
  const [actualWeight, setActualWeight] = useState<number>(8);
  const [orderType, setOrderType] = useState<OrderType>('B2C');
  const [paymentType, setPaymentType] = useState<PaymentType>('COD');

  const [quote, setQuote] = useState<OrderQuoteResponse | null>(null);
  const [isCalculatingQuote, setIsCalculatingQuote] = useState<boolean>(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
      if (data.length > 0 && !selectedOrder) {
        handleTrackOrder(data[0]);
      }
    } catch (e: any) {
      console.error('Error fetching orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCalculateQuote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsCalculatingQuote(true);
    try {
      const q = await orderApi.getQuote({
        pickupAddress,
        dropAddress,
        length,
        breadth,
        height,
        actualWeight,
        orderType,
        paymentType,
      });
      setQuote(q);
      return q;
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to calculate shipping rate.';
      setErrorMessage(msg);
      console.error(e);
      return null;
    } finally {
      setIsCalculatingQuote(false);
    }
  };

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsCreatingOrder(true);
    try {
      await orderApi.createOrder({
        pickupAddress,
        dropAddress,
        length,
        breadth,
        height,
        actualWeight,
        orderType,
        paymentType,
      });
      setShowCreateModal(false);
      setQuote(null);
      await fetchOrders();
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to create order. Please verify backend connection.';
      setErrorMessage(msg);
      console.error(e);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleTrackOrder = async (order: Order) => {
    setSelectedOrder(order);
    try {
      const events = await orderApi.getTrackingTimeline(order.id);
      setTrackingTimeline(events);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRescheduleSubmit = async (orderId: number, newDate: string, reason: string, notes: string) => {
    await orderApi.rescheduleOrder(orderId, newDate, reason, notes);
    await fetchOrders();
    if (selectedOrder?.id === orderId) {
      const updated = await orderApi.getOrderById(orderId);
      handleTrackOrder(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ios-glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl bg-black/95 border border-neutral-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            CUSTOMER DASHBOARD
            <span className="text-neutral-400 font-medium text-base font-normal">
              Logistics Portal
            </span>
          </h2>
          <p className="text-xs font-medium text-neutral-400 mt-1">
            Create shipping orders, preview volumetric rate quotes, and track real-time delivery events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 active:scale-95 transition-all shadow-md"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setErrorMessage(null);
              setQuote(null);
              setShowCreateModal(true);
            }}
            className="px-6 py-3.5 rounded-full ios-button-primary flex items-center gap-2 text-xs"
          >
            <Plus className="w-4 h-4" /> CREATE ORDER
          </button>
        </div>
      </div>

      {/* Main Grid: Orders & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-200 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" /> My Orders ({orders.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="ios-glass-panel p-8 rounded-3xl text-center text-slate-400 text-sm font-medium">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="ios-glass-panel p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-800">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No orders created yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Click "Create Order" above to calculate a volumetric rate quote and place your first delivery!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onTrack={handleTrackOrder}
                  onReschedule={(ord) => setRescheduleOrder(ord)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Tracking Timeline & Route Map */}
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="ios-glass-panel p-6 rounded-3xl space-y-6 sticky top-24 shadow-2xl">
              <div>
                <div className="text-[10px] uppercase font-black text-cyan-400 tracking-widest">Live Tracker</div>
                <h3 className="font-black text-xl text-slate-100 mt-0.5">Order #{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium truncate">
                  {selectedOrder.pickupAddress} ➔ {selectedOrder.dropAddress}
                </p>
              </div>

              {/* Map */}
              <MapView
                pickupLat={selectedOrder.pickupLatitude || 23.2599}
                pickupLon={selectedOrder.pickupLongitude || 77.4126}
                dropLat={selectedOrder.dropLatitude || 22.7196}
                dropLon={selectedOrder.dropLongitude || 75.8577}
                agentName={selectedOrder.assignedAgentName}
              />

              {/* Immutable Event Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Immutable Tracking History
                </h4>
                <TrackingTimeline events={trackingTimeline} />
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl text-center text-slate-500 text-xs">
              Select an order to view live map route and tracking timeline.
            </div>
          )}
        </div>
      </div>

      {/* Create Order & Rate Calculation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-slate-100 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-cyan-400" /> Create Order & Rate Estimator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dynamic pricing engine automatically calculates volumetric & billable weight.
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Order Error</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateOrderSubmit} className="space-y-6 text-xs">
              {/* Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocationAutocompleteInput
                  label="Pickup Address / City / Pincode"
                  value={pickupAddress}
                  onChange={(val) => setPickupAddress(val)}
                  placeholder="e.g. Bhopal, Connaught Place Delhi 110001..."
                  required
                />
                <LocationAutocompleteInput
                  label="Drop Address / City / Pincode"
                  value={dropAddress}
                  onChange={(val) => setDropAddress(val)}
                  placeholder="e.g. Indore, Bandra West Mumbai 400050..."
                  required
                />
              </div>

              {/* Dimensions */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="font-bold text-slate-200 text-xs">Package Specs (Volumetric Formula: L×B×H / 5000)</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">Length (cm)</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">Breadth (cm)</label>
                    <input
                      type="number"
                      value={breadth}
                      onChange={(e) => setBreadth(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">Actual Wt (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={actualWeight}
                      onChange={(e) => setActualWeight(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                      min={0.1}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order & Payment Types */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="B2C">B2C (Retail Consumer)</option>
                    <option value="B2B">B2B (Business Bulk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="COD">Cash On Delivery (COD Surcharge)</option>
                    <option value="PREPAID">Prepaid (No Surcharge)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCalculateQuote()}
                  disabled={isCalculatingQuote}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  {isCalculatingQuote ? 'Calculating...' : 'Preview Rate Quote'}
                </button>

                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-sm hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isCreatingOrder ? 'Creating Order...' : 'CONFIRM & PLACE ORDER'}
                </button>
              </div>
            </form>

            {/* Calculated Quote Breakdown Display */}
            {quote && (
              <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 p-5 rounded-2xl border border-cyan-500/30 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Calculated Shipping Breakdown</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {quote.zoneType} ({quote.pickupZoneCode} ➔ {quote.dropZoneCode})
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Actual Weight</span>
                    <span className="font-bold text-slate-200">{quote.actualWeight} kg</span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Volumetric Weight</span>
                    <span className="font-bold text-cyan-400">{quote.volumetricWeight} kg</span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Billable Weight MAX</span>
                    <span className="font-bold text-amber-400">{quote.billableWeight} kg</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Freight Charge ({quote.orderType} Rate Card):</span>
                    <span>₹{quote.baseCharge}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>COD Surcharge ({quote.paymentType}):</span>
                    <span>₹{quote.codSurcharge}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-emerald-400 pt-2 border-t border-slate-800">
                    <span>TOTAL CHARGE:</span>
                    <span>₹{quote.finalCharge}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleOrder && (
        <RescheduleModal
          order={rescheduleOrder}
          onClose={() => setRescheduleOrder(null)}
          onSubmit={handleRescheduleSubmit}
        />
      )}
    </div>
  );
};
