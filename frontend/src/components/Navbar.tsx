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
      <div className="ios-glass-panel rounded-full px-6 h-16 flex items-center justify-between shadow-2xl bg-black/90 border border-orange-500/30">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-orange-500 text-black font-bold active:scale-95 transition-all shadow-md shadow-orange-500/40">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-impact text-lg sm:text-xl tracking-wider text-white flex items-center gap-2">
              LAST-MILE
              <span className="font-royale text-xl text-orange-400 capitalize normal-case tracking-normal pl-1">
                Royale Edition
              </span>
            </h1>
          </div>
        </div>

        {/* User Info & Role Switcher */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-950 p-1 rounded-full border border-neutral-800 text-xs">
              <span className="text-[10px] font-impact text-neutral-400 px-3 uppercase tracking-wider">Role:</span>
              <button
                onClick={() => handleRoleSwitch('CUSTOMER')}
                className={`px-3.5 py-1 rounded-full font-impact text-xs transition-all ${
                  user.role === 'CUSTOMER'
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/40 scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleSwitch('DELIVERY_AGENT')}
                className={`px-3.5 py-1 rounded-full font-impact text-xs transition-all ${
                  user.role === 'DELIVERY_AGENT'
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/40 scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`px-3.5 py-1 rounded-full font-impact text-xs transition-all ${
                  user.role === 'ADMIN'
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/40 scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-neutral-800">
              <div className="text-right hidden sm:block text-xs">
                <div className="font-impact text-white tracking-wide text-sm">{user.name}</div>
                <div className="font-royale text-orange-400 text-base -mt-1 capitalize">{user.role.toLowerCase()}</div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 rounded-full text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all border border-neutral-800 active:scale-95"
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
