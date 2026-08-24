import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Truck, LogOut, Package, PlusCircle, ShieldCheck, DollarSign, Users } from 'lucide-react';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const { user, quickSwitch, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = async (targetRole: Role) => {
    await quickSwitch(targetRole);
    if (targetRole === 'ADMIN') navigate('/admin');
    else if (targetRole === 'DELIVERY_AGENT') navigate('/agent');
    else navigate('/customer');
  };

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 space-y-2">
      <div className="ios-glass-panel rounded-full px-6 h-16 flex items-center justify-between shadow-2xl bg-black/95 border border-neutral-800">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-white text-black font-bold active:scale-95 transition-all shadow-md">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-['Helvetica_Neue',Helvetica,Arial,sans-serif] font-bold text-lg sm:text-xl tracking-wide text-white flex items-center gap-2">
                LAST-MILE
                <span className="text-neutral-400 font-medium text-sm tracking-wider pl-1">
                  DELIVERY TRACKER
                </span>
              </h1>
            </div>
          </Link>
        </div>

        {/* User Info & Role Switcher */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-950 p-1 rounded-full border border-neutral-800 text-xs">
              <span className="text-[10px] font-bold text-neutral-400 px-3 uppercase tracking-wider">Role:</span>
              <button
                onClick={() => handleRoleSwitch('CUSTOMER')}
                className={`px-3.5 py-1 rounded-full font-bold text-xs transition-all ${
                  user.role === 'CUSTOMER'
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleSwitch('DELIVERY_AGENT')}
                className={`px-3.5 py-1 rounded-full font-bold text-xs transition-all ${
                  user.role === 'DELIVERY_AGENT'
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`px-3.5 py-1 rounded-full font-bold text-xs transition-all ${
                  user.role === 'ADMIN'
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-neutral-800">
              <div className="text-right hidden sm:block text-xs">
                <div className="font-bold text-white tracking-wide text-sm">{user.name}</div>
                <div className="text-neutral-400 text-xs capitalize">{user.role.toLowerCase()}</div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all border border-neutral-800 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Navigation Webpage Menu Bar */}
      {user && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-4 text-xs font-bold bg-neutral-950/80 rounded-2xl border border-neutral-800/80 max-w-fit mx-auto">
          {user.role === 'CUSTOMER' && (
            <>
              <Link
                to="/customer"
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  location.pathname === '/customer' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" /> My Orders List
              </Link>
              <Link
                to="/customer/create-order"
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  location.pathname === '/customer/create-order' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" /> New Shipping Order Webpage
              </Link>
            </>
          )}

          {user.role === 'DELIVERY_AGENT' && (
            <Link
              to="/agent"
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                location.pathname === '/agent' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Agent Deliveries & GPS Telemetry Page
            </Link>
          )}

          {user.role === 'ADMIN' && (
            <>
              <Link
                to="/admin"
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  location.pathname === '/admin' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Center
              </Link>
              <Link
                to="/admin/rate-cards"
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  location.pathname === '/admin/rate-cards' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Rate Cards & Pricing Webpage
              </Link>
              <Link
                to="/admin/agents"
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  location.pathname === '/admin/agents' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Agent Roster Webpage
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
