import React, { useState } from 'react';
import { DeliveryAgent, Order } from '../types';
import { UserCheck, X } from 'lucide-react';

interface ManualAssignModalProps {
  order: Order;
  agents: DeliveryAgent[];
  onClose: () => void;
  onAssign: (orderId: number, agentId: number) => Promise<void>;
}

export const ManualAssignModal: React.FC<ManualAssignModalProps> = ({ order, agents, onClose, onAssign }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<number>(agents[0]?.id || 0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    setIsSubmitting(true);
    try {
      await onAssign(order.id, selectedAgentId);
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
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-slate-100">Assign Delivery Agent</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="font-semibold text-cyan-400">Order #{order.orderNumber}</div>
          <div className="text-slate-400">{order.pickupAddress} ➔ {order.dropAddress}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Select Agent</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {agents.map((agent) => (
                <label
                  key={agent.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedAgentId === agent.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="agent"
                      value={agent.id}
                      checked={selectedAgentId === agent.id}
                      onChange={() => setSelectedAgentId(agent.id)}
                      className="accent-cyan-500"
                    />
                    <div>
                      <div className="font-bold">{agent.user.name}</div>
                      <div className="text-[10px] text-slate-500">{agent.employeeCode} • {agent.zone?.zoneName || 'All Zones'}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      agent.availabilityStatus === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {agent.availabilityStatus}
                  </span>
                </label>
              ))}
            </div>
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
              disabled={isSubmitting || !selectedAgentId}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
