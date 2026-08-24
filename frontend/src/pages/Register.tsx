import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Package, ArrowRight } from 'lucide-react';
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
          <div className="inline-flex p-4 rounded-full bg-white text-black shadow-xl">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-xs text-neutral-400 font-medium">Register for Last-Mile Delivery Access</p>
        </div>

        <div className="ios-glass-panel p-8 rounded-3xl space-y-5 bg-black/95 border border-neutral-800 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium focus:outline-none placeholder:text-neutral-600"
                required
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium focus:outline-none placeholder:text-neutral-600"
                required
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium focus:outline-none placeholder:text-neutral-600"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium focus:outline-none placeholder:text-neutral-600"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-1.5 pl-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium focus:outline-none"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="DELIVERY_AGENT">Delivery Agent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {role === 'CUSTOMER' && (
              <div>
                <label className="block text-white font-bold mb-1.5 pl-1">Company Name (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full ios-input rounded-2xl px-4 py-3 text-white font-medium focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full ios-button-primary text-black font-bold tracking-wide text-xs uppercase flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-neutral-400 pt-3 border-t border-neutral-800 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
