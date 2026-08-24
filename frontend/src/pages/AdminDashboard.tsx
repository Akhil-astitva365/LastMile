import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { DeliveryAgent, Order, OrderStatus, RateCard, Zone } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ManualAssignModal } from '../components/ManualAssignModal';
import { AIAgentModal } from '../components/AIAgentModal';
import { ShieldCheck, Package, DollarSign, AlertTriangle, Users, Map, Settings, RefreshCw, UserCheck, Zap, Bot } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [rates, setRates] = useState<RateCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  // Filters state
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'agents' | 'rates' | 'zones'>('orders');

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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [filterStatus, filterZone]);

  const handleManualAssignSubmit = async (orderId: number, agentId: number) => {
    await adminApi.manualAssign(orderId, agentId);
    await fetchAdminData();
  };

  const handleAutoAssignTrigger = async (orderId: number) => {
    await adminApi.autoAssign(orderId);
    await fetchAdminData();
  };

  const handleOverrideStatus = async (orderId: number, newStatus: OrderStatus) => {
    await adminApi.overrideStatus(orderId, newStatus, 'Admin override');
    await fetchAdminData();
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.finalCharge), 0);
  const activeCount = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'FAILED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const failedCount = orders.filter((o) => o.status === 'FAILED').length;
  const availableAgentsCount = agents.filter((a) => a.availabilityStatus === 'AVAILABLE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">ADMIN DASHBOARD</h2>
            <p className="text-xs text-neutral-400 font-medium">Logistics fleet, rate cards, and order dispatch management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="px-5 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 active:scale-95"
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="ios-glass-card p-5 rounded-3xl border-l-4 border-l-cyan-400 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Total Revenue</span>
          <div className="text-2xl font-black text-cyan-400 flex items-center gap-1">
            <DollarSign className="w-5 h-5" /> ₹{totalRevenue.toFixed(0)}
          </div>
        </div>

        <div className="ios-glass-card p-5 rounded-3xl border-l-4 border-l-purple-400 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Active Orders</span>
          <div className="text-2xl font-black text-purple-400 flex items-center gap-1">
            <Package className="w-5 h-5" /> {activeCount}
          </div>
        </div>

        <div className="ios-glass-card p-5 rounded-3xl border-l-4 border-l-emerald-400 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Delivered</span>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-1">
            <UserCheck className="w-5 h-5" /> {deliveredCount}
          </div>
        </div>

        <div className="ios-glass-card p-5 rounded-3xl border-l-4 border-l-rose-400 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Failed Count</span>
          <div className="text-2xl font-black text-rose-400 flex items-center gap-1">
            <AlertTriangle className="w-5 h-5" /> {failedCount}
          </div>
        </div>

        <div className="ios-glass-card p-5 rounded-3xl border-l-4 border-l-amber-400 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Available Agents</span>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
            <Users className="w-5 h-5" /> {availableAgentsCount}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Orders Management ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'agents' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Agents Monitoring ({agents.length})
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'rates' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Rate Cards Engine ({rates.length})
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'zones' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Zones Config ({zones.length})
        </button>
      </div>

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold text-slate-300">Filters:</span>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
              >
                <option value="">All Statuses</option>
                <option value="CREATED">CREATED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="PICKED_UP">PICKED_UP</option>
                <option value="IN_TRANSIT">IN_TRANSIT</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="FAILED">FAILED</option>
                <option value="RESCHEDULED">RESCHEDULED</option>
              </select>
            </div>

            <div>
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
              >
                <option value="">All Zones</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.zoneCode}>
                    {z.zoneName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Weight / Charge</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Agent</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-900/40">
                      <td className="p-4 font-bold text-cyan-400">{o.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{o.customerName}</div>
                        <div className="text-[10px] text-slate-500">{o.customerEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="truncate max-w-xs">{o.pickupAddress} ➔ {o.dropAddress}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{o.zoneType} ({o.pickupZoneCode} ➔ {o.dropZoneCode})</div>
                      </td>
                      <td className="p-4">
                        <div>{o.billableWeight} kg (Vol: {o.volumetricWeight}kg)</div>
                        <div className="font-bold text-emerald-400">₹{o.finalCharge} ({o.paymentType})</div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="p-4">
                        {o.assignedAgentName ? (
                          <span className="font-semibold text-purple-300">{o.assignedAgentName}</span>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleAutoAssignTrigger(o.id)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold"
                          title="Trigger Auto Nearest Agent Assignment"
                        >
                          <Zap className="w-3.5 h-3.5 inline" /> Auto
                        </button>
                        <button
                          onClick={() => setAssignOrder(o)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold"
                        >
                          Manual Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Agents Monitoring */}
      {activeTab === 'agents' && (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Agent Name</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4">Assigned Zone</th>
                  <th className="p-4">GPS Coordinates</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {agents.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-amber-400">{a.employeeCode}</td>
                    <td className="p-4 font-semibold text-slate-100">{a.user.name}</td>
                    <td className="p-4 text-slate-400">{a.user.email} • {a.user.phone || 'N/A'}</td>
                    <td className="p-4">{a.zone?.zoneName || 'Global'}</td>
                    <td className="p-4 font-mono text-slate-400">{a.latitude?.toFixed(4)}, {a.longitude?.toFixed(4)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        a.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {a.availabilityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Rate Cards Engine */}
      {activeTab === 'rates' && (
        <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-100">Database-Driven Rate Cards</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order Type</th>
                  <th className="p-4">Zone Type</th>
                  <th className="p-4">Weight Slab (kg)</th>
                  <th className="p-4">Base Charge (₹)</th>
                  <th className="p-4">Per KG Charge (₹)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {rates.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-cyan-400">{r.orderType}</td>
                    <td className="p-4 font-bold text-purple-400">{r.zoneType}</td>
                    <td className="p-4 font-semibold">{r.minWeight} kg - {r.maxWeight} kg</td>
                    <td className="p-4 text-emerald-400 font-bold">₹{r.baseCharge}</td>
                    <td className="p-4 text-amber-400 font-bold">₹{r.perKgCharge}/kg</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {r.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Zones Config */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((z) => (
            <div key={z.id} className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-cyan-400 text-sm">{z.zoneCode}</span>
                <span className="text-xs font-bold text-slate-300">{z.zoneName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Mapped Areas:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {z.areas?.map((area) => (
                    <span key={area.id} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                      📍 {area.areaName} ({area.pincode})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
