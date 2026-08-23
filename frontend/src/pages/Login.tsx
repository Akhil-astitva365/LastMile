import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { Role } from '../types';

export const Login: React.FC = () => {
  const { login, quickSwitch } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('customer@demo.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend API server (http://localhost:8080). Make sure backend is running.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (role: Role) => {
    setError('');
    setIsSubmitting(true);
    try {
      await quickSwitch(role);
      navigate('/');
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend API server (http://localhost:8080). Make sure backend is running.');
      } else {
        setError(err.response?.data?.message || 'Demo login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Headline */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20 text-slate-950">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to your role-based logistics dashboard</p>
        </div>

        {/* Demo Quick Accounts */}
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
            🚀 Quick Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoClick('CUSTOMER')}
              className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all text-xs font-semibold flex flex-col items-center gap-1"
            >
              <UserCheck className="w-4 h-4" /> Customer
            </button>
            <button
              onClick={() => handleDemoClick('DELIVERY_AGENT')}
              className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-xs font-semibold flex flex-col items-center gap-1"
            >
              <Truck className="w-4 h-4" /> Agent
            </button>
            <button
              onClick={() => handleDemoClick('ADMIN')}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all text-xs font-semibold flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
