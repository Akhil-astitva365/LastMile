import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
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
      const userRes = await login(email, password);
      const role = userRes?.role || 'CUSTOMER';
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'DELIVERY_AGENT') navigate('/agent');
      else navigate('/customer');
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

  const fillCredentials = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Headline */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-full bg-white text-black shadow-xl">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            LOGISTICS AUTHENTICATION
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto font-medium">
            Sign in with your role credentials to access your dedicated portal
          </p>
        </div>

        {/* Demo Account Credentials Preset helper */}
        <div className="ios-glass-card p-4 rounded-3xl space-y-2.5 bg-black/40 backdrop-blur-xl border border-neutral-800">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-center">
            🔒 Select Demo Credentials
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('customer@demo.com')}
              className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-all text-xs font-bold text-center"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('agent1@demo.com')}
              className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-all text-xs font-bold text-center"
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@demo.com')}
              className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-all text-xs font-bold text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="ios-glass-panel p-8 rounded-3xl space-y-5 bg-black/95 border border-neutral-800 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ios-input rounded-2xl pl-10 pr-4 py-3 text-white font-medium focus:outline-none placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ios-input rounded-2xl pl-10 pr-4 py-3 text-white font-medium focus:outline-none placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full ios-button-primary text-black font-bold tracking-wide text-xs uppercase flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In To Panel'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-neutral-400 pt-3 border-t border-neutral-800 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
