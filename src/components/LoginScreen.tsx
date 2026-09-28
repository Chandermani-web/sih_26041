import React, { useState } from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { Worker } from '../types';
import { DEMO_WORKER } from '../storage/LocalStorageManager';
import { Shield, KeyRound, UserCheck, HardHat, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (worker: Worker, remember: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useLocalization();

  const [workerId, setWorkerId] = useState('JH-W-001');
  const [pin, setPin] = useState('1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim()) {
      setErrorMsg('Please enter Worker ID');
      return;
    }
    if (!pin.trim()) {
      setErrorMsg('Please enter 4-digit PIN');
      return;
    }

    // Authenticate demo or custom worker
    const worker: Worker = {
      ...DEMO_WORKER,
      id: workerId.toUpperCase(),
      name: workerId.toUpperCase() === 'JH-W-001' ? 'Rahul Kumar' : `Worker ${workerId.toUpperCase()}`,
      lastLogin: new Date().toISOString(),
    };

    onLogin(worker, rememberMe);
  };

  const handleQuickDemoLogin = () => {
    setWorkerId(DEMO_WORKER.id);
    setPin('1234');
    onLogin(DEMO_WORKER, true);
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center px-4 py-8 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Industrial Warning Stripe accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 safety-stripes" />

        {/* Govt of Jharkhand & DGMS Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <HardHat className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 mb-1">
            {t.login.jharkhandGovt}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-tech text-white tracking-wide">
            {t.login.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.login.subtitle}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl text-xs text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* 1-Tap Demo Worker Button for Instant Testing */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>{t.login.demoWorkerButton}</span>
          </button>
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-2 text-[10px] text-slate-500 uppercase tracking-widest">or sign in</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.login.workerIdLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                placeholder={t.login.workerIdPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.login.pinLabel}
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder={t.login.pinPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition font-mono tracking-widest"
              />
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/30"
              />
              <span className="text-xs text-slate-300">{t.login.rememberMe}</span>
            </label>
            <span className="text-[11px] text-slate-500">PIN: 1234</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{t.login.submitButton}</span>
          </button>
        </form>

        {/* Offline & DGMS Security Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.login.offlineIndicator}</span>
          </div>
          <span className="font-mono text-[10px] text-slate-600">v2.4-SIH26</span>
        </div>
      </div>
    </div>
  );
};
