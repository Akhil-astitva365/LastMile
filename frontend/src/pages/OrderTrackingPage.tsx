import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import { Order, TrackingEvent } from '../types';
import { MapView } from '../components/MapView';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, RefreshCw, AlertCircle, Package } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTrackingDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const orderId = Number(id);
      const [orderData, timelineData] = await Promise.all([
        orderApi.getOrderById(orderId),
        orderApi.getTrackingTimeline(orderId),
      ]);
      setOrder(orderData);
      setTimeline(timelineData);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch tracking information for this order.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-neutral-400 font-bold">
        Loading live tracking details...
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-4 text-center">
        <div className="ios-glass-panel p-8 rounded-3xl space-y-4 border border-neutral-800">
          <AlertCircle className="w-12 h-12 text-white mx-auto" />
          <h3 className="text-lg font-bold text-white">Tracking Error</h3>
          <p className="text-xs text-neutral-400">{errorMessage || 'Order not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-full ios-button-primary text-xs"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>

        <button
          onClick={fetchTrackingDetails}
          className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" /> REFRESH LIVE TRACKING
        </button>
      </div>

      {/* Main Tracking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl space-y-4 bg-black/95 border border-neutral-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">TRACKING ORDER</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">{order.orderNumber}</h2>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Pickup Location</span>
                <div className="text-white font-bold mt-1">{order.pickupAddress}</div>
              </div>
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Drop Location</span>
                <div className="text-white font-bold mt-1">{order.dropAddress}</div>
              </div>
            </div>

            {/* Interactive Map */}
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase mb-2">Live Route Bounding Map</div>
              <MapView
                pickupLat={order.pickupLatitude || 23.2599}
                pickupLon={order.pickupLongitude || 77.4126}
                dropLat={order.dropLatitude || 22.7196}
                dropLon={order.dropLongitude || 75.8577}
                agentName={order.assignedAgentName}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Tracking History Timeline */}
        <div className="space-y-6">
          <div className="ios-glass-panel p-6 rounded-3xl space-y-4 bg-black/95 border border-neutral-800 shadow-2xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">TELEMETRY LOGS</span>
              <h3 className="text-lg font-bold text-white">Tracking Event History</h3>
            </div>
            <TrackingTimeline events={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};
