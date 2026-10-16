import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed, ArrowRight, ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  // Quick 1-click demo buttons
  const fillCustomerDemo = () => {
    setEmail('customer@foodiehub.com');
    setPassword('Customer@123456');
    setErrorMsg('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@foodiehub.com');
    setPassword('Admin@123456');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-gray-100 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/25">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-gray-900">
              Foodie<span className="text-[#FF6B35]">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-500">
            Sign in to access your orders, saved addresses, and profile
          </p>
        </div>

        {/* Demo Fast Login Helper */}
        <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 space-y-2.5">
          <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="px-3 py-2 bg-white hover:bg-orange-100/50 border border-orange-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="px-3 py-2 bg-white hover:bg-orange-100/50 border border-orange-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] disabled:bg-gray-300 text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] mt-6"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#FF6B35] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
