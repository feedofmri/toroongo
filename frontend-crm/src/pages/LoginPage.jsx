import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Already logged in
  if (user?.role === 'admin') {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative animate-slide-up">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-border-soft shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-border-soft bg-gradient-to-b from-brand-primary/[0.03] to-transparent">
            <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20">
              <Shield size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Toroongo CRM</h1>
            <p className="text-sm text-text-muted mt-1">Admin access only</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 animate-fade-in">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@toroongo.com"
                  className="w-full pl-10 pr-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign In to CRM</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-5">
          Toroongo Admin Panel · Internal Use Only
        </p>
      </div>
    </div>
  );
}
