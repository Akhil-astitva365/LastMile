import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, UserCheck, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Headline */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 shadow-2xl shadow-cyan-500/30 text-slate-950 transform hover:scale-105 transition-all">
            <Truck className="w-9 h-9" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-100 flex items-center justify-center gap-2">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
            Sign in to access your role-based PAN-India logistics dashboard
          </p>
        </div>

        {/* Demo Quick Accounts */}
        <div className="ios-glass-card p-5 rounded-3xl space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Instant Demo Access
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleDemoClick('CUSTOMER')}
              className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" /> Customer
            </button>
            <button
              onClick={() => handleDemoClick('DELIVERY_AGENT')}
              className="p-3 rounded-2xl bg-purple-500/10 border border-purple-400/30 text-purple-300 hover:bg-purple-500/20 active:scale-95 transition-all text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm"
            >
              <Truck className="w-4 h-4 text-purple-400" /> Agent
            </button>
            <button
              onClick={() => handleDemoClick('ADMIN')}
              className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="ios-glass-panel p-8 rounded-3xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ios-input rounded-2xl pl-10 pr-4 py-3 text-slate-100 font-medium focus:outline-none placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ios-input rounded-2xl pl-10 pr-4 py-3 text-slate-100 font-medium focus:outline-none placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl ios-button-primary text-slate-950 font-black tracking-wide text-xs uppercase flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-extrabold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
