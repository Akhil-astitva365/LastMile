import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { OrderCard } from '../components/OrderCard';
import { MapView } from '../components/MapView';
import { AIAgentModal } from '../components/AIAgentModal';
import { Plus, RefreshCw, Bot, ChevronLeft, ChevronRight, MapPin, Maximize2, Minimize2 } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrderForMap, setSelectedOrderForMap] = useState<Order | null>(null);
  const [isLargeMapOpen, setIsLargeMapOpen] = useState<boolean>(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
      if (data.length > 0 && !selectedOrderForMap) {
        setSelectedOrderForMap(data[0]);
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

  // Pagination logic: Exactly 6 orders per page
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectMapOrder = (order: Order) => {
    setSelectedOrderForMap(order);
  };

  const handleDeleteOrder = async (orderToDelete: Order) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderToDelete.orderNumber}?`)) {
      return;
    }
    try {
      await orderApi.deleteOrder(orderToDelete.id);
      const updatedList = orders.filter((o) => o.id !== orderToDelete.id);
      setOrders(updatedList);
      if (selectedOrderForMap?.id === orderToDelete.id) {
        setSelectedOrderForMap(updatedList.length > 0 ? updatedList[0] : null);
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to delete order.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ios-glass-panel p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-neutral-800 shadow-2xl">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-playfair">CUSTOMER DASHBOARD</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="px-5 py-3 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-2 active:scale-95 shadow-md"
          >
            <Bot className="w-4 h-4" /> 🤖 AI AGENT MODE
          </button>
          <button
            onClick={fetchOrders}
            className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white active:scale-95 transition-all shadow-md"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/customer/create-order')}
            className="px-6 py-3 rounded-full ios-button-primary flex items-center gap-2 text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> CREATE ORDER
          </button>
        </div>
      </div>

      {/* Main Grid: Left Orders (Max 6), Right Corner Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders List & 6-Item Pagination */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-6">
          {isLoading ? (
            <div className="ios-glass-panel p-12 text-center text-neutral-400 font-bold text-sm">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="ios-glass-panel p-12 text-center space-y-3 border border-neutral-800 rounded-3xl">
              <p className="text-sm font-bold text-white">No shipping orders created yet</p>
              <button
                onClick={() => navigate('/customer/create-order')}
                className="px-6 py-2.5 rounded-full ios-button-primary text-xs"
              >
                Create Your First Order
              </button>
            </div>
          ) : (
            <>
              {/* 6 Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleSelectMapOrder(order)}
                    className={`cursor-pointer transition-all h-full ${
                      selectedOrderForMap?.id === order.id ? 'ring-2 ring-white rounded-3xl' : ''
                    }`}
                  >
                    <OrderCard order={order} onDelete={handleDeleteOrder} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls (Max 6 Per Page) */}
              {totalPages > 1 && (
                <div className="ios-glass-panel px-6 py-4 rounded-2xl flex items-center justify-between bg-black/90 border border-neutral-800 text-xs">
                  <span className="text-neutral-400 font-medium">
                    Page <b className="text-white">{currentPage}</b> of <b className="text-white">{totalPages}</b> ({orders.length} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-neutral-800"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-xl font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-white text-black'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-neutral-800"
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
        <div className="lg:col-span-6 xl:col-span-6 sticky top-24">
          <div className="ios-glass-panel p-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-neutral-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 px-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white tracking-wide">
                  {selectedOrderForMap ? `Order #${selectedOrderForMap.orderNumber}` : 'Select Order for Map'}
                </span>
              </div>
              <button
                onClick={() => setIsLargeMapOpen(true)}
                className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold text-[10px] hover:bg-white hover:text-black transition-all flex items-center gap-1.5 active:scale-95 shadow-sm font-helvetica"
              >
                <Maximize2 className="w-3 h-3" />
                <span>LARGE MAP VIEW</span>
              </button>
            </div>

            {selectedOrderForMap ? (
              <div className="space-y-2">
                <div className="text-[11px] text-neutral-300 font-medium px-1 flex justify-between">
                  <span>From: <b className="text-white">{selectedOrderForMap.pickupAddress}</b></span>
                </div>
                <div className="text-[11px] text-neutral-300 font-medium px-1 flex justify-between">
                  <span>To: <b className="text-white">{selectedOrderForMap.dropAddress}</b></span>
                </div>
                <div className="h-[520px] rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
                  <MapView
                    pickupLat={selectedOrderForMap.pickupLatitude || 23.2599}
                    pickupLon={selectedOrderForMap.pickupLongitude || 77.4126}
                    dropLat={selectedOrderForMap.dropLatitude || 22.7196}
                    dropLon={selectedOrderForMap.dropLongitude || 75.8577}
                    agentName={selectedOrderForMap.assignedAgentName}
                  />
                </div>
              </div>
            ) : (
              <div className="h-[520px] rounded-2xl bg-neutral-950 flex items-center justify-center text-neutral-500 text-xs font-bold border border-neutral-800">
                Click an order to focus route map
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 16:9 Large Map Modal triggered by LARGE MAP VIEW button */}
      {isLargeMapOpen && selectedOrderForMap && (
        <div className="fixed inset-0 z-[1000] p-4 sm:p-6 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl ios-glass-panel p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white text-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide font-playfair">16:9 LARGE MAP VIEW — ORDER #{selectedOrderForMap.orderNumber}</h3>
                <p className="text-xs text-neutral-400 font-helvetica">{selectedOrderForMap.pickupAddress} ➔ {selectedOrderForMap.dropAddress}</p>
              </div>
            </div>

            <button
              onClick={() => setIsLargeMapOpen(false)}
              className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 font-helvetica"
            >
              <Minimize2 className="w-4 h-4" /> CLOSE 16:9 VIEW
            </button>
          </div>

          <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/30 shadow-2xl relative bg-neutral-950">
            <MapView
              pickupLat={selectedOrderForMap.pickupLatitude || 23.2599}
              pickupLon={selectedOrderForMap.pickupLongitude || 77.4126}
              dropLat={selectedOrderForMap.dropLatitude || 22.7196}
              dropLon={selectedOrderForMap.dropLongitude || 75.8577}
              agentName={selectedOrderForMap.assignedAgentName}
              showExpandButton={false}
            />
          </div>
        </div>
      )}

      {/* AI Agent Modal */}
      <AIAgentModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onOrderCreated={fetchOrders}
      />
    </div>
  );
};
