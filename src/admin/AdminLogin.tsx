import React, { useState } from 'react';
import { AdminUser } from '../types';
import { localStorageManager, DEMO_ADMIN } from '../storage/LocalStorageManager';
import {
  Building2,
  KeyRound,
  ShieldCheck,
  Lock,
  ArrowRight,
  Shield,
  FileCheck2,
} from 'lucide-react';

interface AdminLoginProps {
  onLogin: (admin: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [adminId, setAdminId] = useState('DGMS-ADM-01');
  const [password, setPassword] = useState('dgms2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId.trim() && (password === 'dgms2026' || password === 'admin')) {
      localStorageManager.setCurrentAdmin(DEMO_ADMIN);
      onLogin(DEMO_ADMIN);
      setLoginError(null);
    } else {
      setLoginError('Invalid Inspector ID or Passcode. (Demo: DGMS-ADM-01 / Passcode: dgms2026)');
    }
  };

  const handleQuickLogin = () => {
    setAdminId('DGMS-ADM-01');
    setPassword('dgms2026');
    localStorageManager.setCurrentAdmin(DEMO_ADMIN);
    onLogin(DEMO_ADMIN);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-inner">
            <Building2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
          </span>
          <h1 className="text-2xl font-bold font-tech text-white">
            STATE SAFETY ADMINISTRATION
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Jharkhand Mining Inspectorate Compliance & Certification System
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200">
            {loginError}
          </div>
        )}

        {/* Quick Inspector Demo Card */}
        <div className="mb-6 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 block font-bold uppercase">
              Official Inspector Credential
            </span>
            <span className="text-xs font-semibold text-slate-200 block">Er. Rajeshwar Soren</span>
            <span className="text-[10px] text-slate-500 font-mono">ID: DGMS-ADM-01 · PIN: dgms2026</span>
          </div>
          <button
            type="button"
            onClick={handleQuickLogin}
            className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition"
          >
            1-Click Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Officer / Inspector ID
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="DGMS-ADM-01"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 uppercase font-mono outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Security Authorization Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="dgms2026"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Admin Portal</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500 font-mono">
            Authorized DGMS & Jharkhand Safety Inspectorate Personnel Only
          </span>
        </div>
      </div>
    </div>
  );
};
