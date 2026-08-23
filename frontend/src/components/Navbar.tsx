import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, LogOut, User, ShieldCheck, UserCheck } from 'lucide-react';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const { user, quickSwitch, logout } = useAuth();

  return (
    <header className="glass-panel sticky top-0 z-40 w-full border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-100 flex items-center gap-2">
              Last-Mile Delivery Tracker
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                MVP v1.0
              </span>
            </h1>
          </div>
        </div>

        {/* User Info & Role Switcher */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 px-2 uppercase">Switch Role:</span>
              <button
                onClick={() => quickSwitch('CUSTOMER')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'CUSTOMER' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => quickSwitch('DELIVERY_AGENT')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'DELIVERY_AGENT' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => quickSwitch('ADMIN')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'ADMIN' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block text-xs">
                <div className="font-bold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-cyan-400 font-semibold uppercase">{user.role}</div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
