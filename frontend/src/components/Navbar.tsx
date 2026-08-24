import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck, LogOut, Sparkles } from 'lucide-react';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const { user, quickSwitch, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (targetRole: Role) => {
    await quickSwitch(targetRole);
    if (targetRole === 'ADMIN') navigate('/admin');
    else if (targetRole === 'DELIVERY_AGENT') navigate('/agent');
    else navigate('/customer');
  };

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="ios-glass-panel rounded-full px-6 h-16 flex items-center justify-between shadow-2xl">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 shadow-lg shadow-cyan-500/30 text-slate-950 font-bold active:scale-95 transition-all">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-100 flex items-center gap-2">
              Last-Mile
              <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Pro Edition
              </span>
            </h1>
          </div>
        </div>

        {/* User Info & Role Switcher */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-full border border-slate-800/80 text-xs">
              <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider">Role:</span>
              <button
                onClick={() => handleRoleSwitch('CUSTOMER')}
                className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                  user.role === 'CUSTOMER'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleSwitch('DELIVERY_AGENT')}
                className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                  user.role === 'DELIVERY_AGENT'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                  user.role === 'ADMIN'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800/80">
              <div className="text-right hidden sm:block text-xs">
                <div className="font-bold text-slate-100 tracking-tight">{user.name}</div>
                <div className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">{user.role}</div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-slate-800/80 active:scale-95"
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
