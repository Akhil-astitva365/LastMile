import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 mb-4">
      <div className="ios-glass-panel rounded-full px-6 h-16 flex items-center justify-between shadow-2xl bg-black/40 backdrop-blur-xl border border-neutral-800 w-full">
        {/* Brand Logo - Far Left Edge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div>
              <h1 className="font-syne font-extrabold text-lg sm:text-xl tracking-wider text-white flex items-center gap-2">
                LAST-MILE
              </h1>
            </div>
          </Link>
        </div>

        {/* User Info & Logout Sign - Far Right Edge */}
        {user && (
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block text-xs">
              <div className="font-bold text-white tracking-wide text-sm">{user.name}</div>
              <div className="text-neutral-400 text-xs uppercase font-semibold">{user.role}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-white hover:text-black transition-all active:scale-95 flex items-center gap-1.5 shadow-md shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
