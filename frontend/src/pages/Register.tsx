import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Truck, ArrowRight } from 'lucide-react';
import { Role } from '../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authApi.register({
        name,
        email,
        password,
        phone,
        role,
        companyName,
      });
      const userRes = await login(email, password);
      const userRole = userRes?.role || role;
      if (userRole === 'ADMIN') navigate('/admin');
      else if (userRole === 'DELIVERY_AGENT') navigate('/agent');
      else navigate('/customer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 shadow-2xl shadow-cyan-500/30 text-slate-950">
            <Truck className="w-9 h-9" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400 font-medium">Join the Last-Mile Logistics Network</p>
        </div>

        <div className="ios-glass-panel p-8 rounded-3xl space-y-5 border border-slate-800">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-slate-100 font-medium focus:outline-none placeholder:text-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-slate-100 font-medium focus:outline-none placeholder:text-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-slate-100 font-medium focus:outline-none placeholder:text-slate-600"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-slate-100 font-medium focus:outline-none placeholder:text-slate-600"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 pl-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-slate-100 font-medium focus:outline-none"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="DELIVERY_AGENT">Delivery Agent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {role === 'CUSTOMER' && (
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 pl-1">Company Name (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full ios-input rounded-2xl px-4 py-3 text-slate-100 font-medium focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl ios-button-primary text-slate-950 font-black tracking-wide text-xs uppercase flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-extrabold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
