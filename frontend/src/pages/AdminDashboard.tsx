import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { DeliveryAgent, Order, OrderStatus, RateCard, Zone } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ManualAssignModal } from '../components/ManualAssignModal';
import { AIAgentModal } from '../components/AIAgentModal';
import { MapView } from '../components/MapView';
import { ShieldCheck, Package, DollarSign, Users, RefreshCw, Bot, ChevronLeft, ChevronRight, MapPin, Maximize2, Minimize2 } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [rates, setRates] = useState<RateCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrderForMap, setSelectedOrderForMap] = useState<Order | null>(null);
  const [isLargeMapOpen, setIsLargeMapOpen] = useState<boolean>(false);

  // Filters state
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('');

  // Manual Assign Modal
  const [assignOrder, setAssignOrder] = useState<Order | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [orderList, agentList, zoneList, rateList] = await Promise.all([
        adminApi.getFilteredOrders({
          status: filterStatus || undefined,
          zoneCode: filterZone || undefined,
        }),
        adminApi.getAgents(),
        adminApi.getZones(),
        adminApi.getRates(),
      ]);
      setOrders(orderList);
      setAgents(agentList);
      setZones(zoneList);
      setRates(rateList);
      if (orderList.length > 0 && !selectedOrderForMap) {
        setSelectedOrderForMap(orderList[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [filterStatus, filterZone]);

  // Pagination logic: Exactly 6 orders per page
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleManualAssignSubmit = async (orderId: number, agentId: number) => {
    await adminApi.manualAssign(orderId, agentId);
    await fetchAdminData();
  };

  const handleAutoAssignTrigger = async (orderId: number) => {
    await adminApi.autoAssign(orderId);
    await fetchAdminData();
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.finalCharge), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Header */}
      <div className="ios-glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl border border-neutral-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-full bg-white text-black font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-playfair">ADMIN DASHBOARD</h2>
            <p className="text-xs text-neutral-400 font-medium font-helvetica">Logistics fleet, rate cards, and order dispatch management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="px-5 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 active:scale-95 font-helvetica"
          >
            <Bot className="w-4 h-4" /> 🤖 AI AGENT MODE
          </button>
          <button
            onClick={fetchAdminData}
            className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white active:scale-95 transition-all flex items-center gap-2 text-xs font-bold shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="ios-glass-card p-4 rounded-3xl bg-black/90 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400">Total Revenue</span>
          <div className="text-xl font-bold text-white font-sreda">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="ios-glass-card p-4 rounded-3xl bg-black/90 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400">Total Orders</span>
          <div className="text-xl font-bold text-white font-sreda">{orders.length}</div>
        </div>
        <div className="ios-glass-card p-4 rounded-3xl bg-black/90 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400">Field Agents</span>
          <div className="text-xl font-bold text-white font-sreda">{agents.length}</div>
        </div>
        <div className="ios-glass-card p-4 rounded-3xl bg-black/90 border border-neutral-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400">Coverage Zones</span>
          <div className="text-xl font-bold text-white font-sreda">{zones.length}</div>
        </div>
      </div>

      {/* Main Content Grid: Left 6 Orders Per Page, Right Corner Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 6 Orders List & Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-white" /> Orders Matrix
            </h3>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="bg-neutral-950 border border-neutral-800 rounded-full px-3 py-1 text-xs text-white font-bold"
            >
              <option value="">All Statuses</option>
              <option value="CREATED">CREATED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_TRANSIT">IN TRANSIT</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>

          {isLoading ? (
            <div className="ios-glass-panel p-8 text-center text-neutral-400 text-xs font-bold">
              Loading orders matrix...
            </div>
          ) : orders.length === 0 ? (
            <div className="ios-glass-panel p-12 text-center text-neutral-400 text-xs font-bold border border-neutral-800 rounded-3xl">
              No matching orders found.
            </div>
          ) : (
            <>
              {/* 6 Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderForMap(order)}
                    className={`ios-glass-card p-5 rounded-3xl space-y-3 bg-black/40 backdrop-blur-md border border-neutral-800 cursor-pointer transition-all h-full flex flex-col justify-between ${
                      selectedOrderForMap?.id === order.id ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">ORDER</span>
                        <h4 className="font-bold text-white text-base">{order.orderNumber}</h4>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="space-y-1 text-xs text-neutral-300">
                      <div className="truncate"><b className="text-neutral-400">From:</b> {order.pickupAddress}</div>
                      <div className="truncate"><b className="text-neutral-400">To:</b> {order.dropAddress}</div>
                      <div className="pt-1 flex items-center justify-between text-neutral-400">
                        <span>Agent: <b className="text-white">{order.assignedAgentName || 'Unassigned'}</b></span>
                        <span className="font-bold text-white">₹{order.finalCharge}</span>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-800 text-xs">
                      <button
                        onClick={(e) => { e.stopPropagation(); setAssignOrder(order); }}
                        className="flex-1 py-1.5 rounded-full ios-button-primary text-black font-bold text-[11px]"
                      >
                        Assign Agent
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAutoAssignTrigger(order.id); }}
                        className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold text-[10px]"
                      >
                        Auto-Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 6-Item Pagination Controls */}
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
        <div className="lg:col-span-6 sticky top-24">
          <div className="ios-glass-panel p-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-neutral-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 px-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">
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
              <div className="h-[550px] rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
                <MapView
                  pickupLat={selectedOrderForMap.pickupLatitude || 23.2599}
                  pickupLon={selectedOrderForMap.pickupLongitude || 77.4126}
                  dropLat={selectedOrderForMap.dropLatitude || 22.7196}
                  dropLon={selectedOrderForMap.dropLongitude || 75.8577}
                  agentName={selectedOrderForMap.assignedAgentName}
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

      {/* Manual Assignment Modal */}
      {assignOrder && (
        <ManualAssignModal
          order={assignOrder}
          agents={agents}
          onClose={() => setAssignOrder(null)}
          onAssign={handleManualAssignSubmit}
        />
      )}

      {/* AI Agent Mode Modal */}
      <AIAgentModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onOrderCreated={fetchAdminData}
      />
    </div>
  );
};
