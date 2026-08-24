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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-black border border-neutral-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-white" />
            <h3 className="font-bold text-lg text-white">Assign Delivery Agent</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-xs">
          <div className="font-bold text-white">Order #{order.orderNumber}</div>
          <div className="text-neutral-400">{order.pickupAddress} ➔ {order.dropAddress}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white font-bold mb-2">Select Agent</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {agents.map((agent) => (
                <label
                  key={agent.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedAgentId === agent.id
                      ? 'bg-neutral-900 border-white text-white font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="agent"
                      value={agent.id}
                      checked={selectedAgentId === agent.id}
                      onChange={() => setSelectedAgentId(agent.id)}
                      className="accent-white"
                    />
                    <div>
                      <div className="font-bold text-white">{agent.user.name}</div>
                      <div className="text-[10px] text-neutral-400">{agent.employeeCode} • {agent.zone?.zoneName || 'All Zones'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-white">
                    {agent.availabilityStatus}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedAgentId}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
