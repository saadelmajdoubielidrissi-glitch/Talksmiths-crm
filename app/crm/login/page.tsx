'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, AlertCircle } from 'lucide-react';
import { useCRM } from '../lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useCRM();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) router.push('/crm');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600));

    if (login(email, password)) {
      router.push('/crm');
    } else {
      setError('Invalid credentials. Try admin@talksmiths.ma / admin123');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" 
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1540 0%, #0a0b0f 70%)' }}>
      <div className="w-full max-w-[400px] crm-animate-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Talksmiths</h1>
          <p className="text-xs text-slate-500 uppercase tracking-[0.25em] mt-1">Command Center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="crm-card p-8 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@talksmiths.ma"
              className="crm-input"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="crm-input"
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="crm-btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Talksmiths Sales CRM — Internal Use Only
        </p>
      </div>
    </div>
  );
}
