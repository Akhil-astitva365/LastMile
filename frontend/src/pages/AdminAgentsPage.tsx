import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { DeliveryAgent } from '../types';
import { Users, Navigation, RefreshCw, MapPin } from 'lucide-react';

export const AdminAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAgents();
      setAgents(res);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl bg-black/95 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-full bg-white text-black font-bold shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Delivery Agent Telemetry</h2>
            <p className="text-xs text-neutral-400 font-medium">Monitor active field agents, zones, and live GPS broadcast coordinates</p>
          </div>
        </div>

        <button
          onClick={fetchAgents}
          className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH FLEET
        </button>
      </div>

      {/* Agents Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="ios-glass-card p-5 rounded-3xl space-y-3 bg-black/90 border border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{agent.employeeCode}</span>
                <h4 className="text-base font-bold text-white">{agent.user.name}</h4>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-neutral-900 border border-white/40 text-white uppercase">
                {agent.availabilityStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Zone: <b className="text-white">{agent.zone?.zoneName || 'PAN-India Hub'}</b></span>
              </div>

              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-white shrink-0" />
                <span>GPS: <b className="text-white">{agent.latitude?.toFixed(4) || '23.2599'}, {agent.longitude?.toFixed(4) || '77.4126'}</b></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
