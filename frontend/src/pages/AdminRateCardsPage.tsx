import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { RateCard } from '../types';
import { ShieldCheck, Plus, RefreshCw, DollarSign, Layers } from 'lucide-react';

export const AdminRateCardsPage: React.FC = () => {
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRateCards = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getRates();
      setRateCards(res);
    } catch (err) {
      console.error('Failed to fetch rate cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRateCards();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl bg-black/95 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-full bg-white text-black font-bold shadow-md">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Rate Cards & Pricing Rules</h2>
            <p className="text-xs text-neutral-400 font-medium">Manage B2B, B2C, Intra-zone, Inter-zone volumetric pricing matrix</p>
          </div>
        </div>

        <button
          onClick={fetchRateCards}
          className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH MATRIX
        </button>
      </div>

      {/* Rate Cards Table */}
      <div className="ios-glass-panel p-6 rounded-3xl space-y-4 bg-black/95 border border-neutral-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-white" /> Active Logistics Rate Cards
          </h3>
          <span className="text-xs text-neutral-400 font-bold">{rateCards.length} Total Rules</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-neutral-400 text-sm font-bold">Loading rate cards...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-bold border-b border-neutral-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Order Type</th>
                  <th className="p-3">Zone Type</th>
                  <th className="p-3">Weight Range (kg)</th>
                  <th className="p-3">Base Charge</th>
                  <th className="p-3">Per Kg Surcharge</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 font-medium text-white">
                {rateCards.map((card) => (
                  <tr key={card.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-3 font-bold text-neutral-400">#{card.id}</td>
                    <td className="p-3 font-bold text-white">{card.orderType}</td>
                    <td className="p-3">{card.zoneType}</td>
                    <td className="p-3">{card.minWeight} - {card.maxWeight} kg</td>
                    <td className="p-3 font-bold text-white">₹{card.baseCharge}</td>
                    <td className="p-3">₹{card.perKgCharge}/kg</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900 border border-white/40 text-white">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
