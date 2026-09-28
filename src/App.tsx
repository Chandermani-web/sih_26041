/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LocalizationProvider, useLocalization } from './localization/LocalizationContext';
import { WorkerApp } from './worker/WorkerApp';
import { AdminDashboard } from './admin/AdminDashboard';
import { PublicCertificateVerification } from './certificate/PublicCertificateVerification';
import { PortalGate } from './components/PortalGate';
import { localStorageManager } from './storage/LocalStorageManager';
import { LanguageCode } from './types';
import {
  HardHat,
  Building2,
  Smartphone,
  ShieldCheck,
  LayoutGrid,
  RotateCcw,
  CheckCircle2,
  Globe,
} from 'lucide-react';

type PortalMode = 'portal_gate' | 'worker_app' | 'admin_dashboard' | 'public_verification';

function AppContent() {
  const { language, setLanguage, languages, t } = useLocalization();

  const [portalMode, setPortalMode] = useState<PortalMode>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#verify/')) {
      return 'public_verification';
    }
    return 'portal_gate';
  });

  const [isDeviceFrame, setIsDeviceFrame] = useState(false);
  const [targetCertId, setTargetCertId] = useState<string>('');
  const [sessionKey, setSessionKey] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [workerSession, setWorkerSession] = useState(() => localStorageManager.getCurrentWorker());
  const [adminSession, setAdminSession] = useState(() => localStorageManager.getCurrentAdmin());

  // Listen for hash changes (e.g. from QR codes)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#verify/')) {
        const id = decodeURIComponent(window.location.hash.replace('#verify/', '').trim());
        setTargetCertId(id);
        setPortalMode('public_verification');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync active sessions
  useEffect(() => {
    const checkSessions = () => {
      setWorkerSession(localStorageManager.getCurrentWorker());
      setAdminSession(localStorageManager.getCurrentAdmin());
    };
    const interval = setInterval(checkSessions, 1500);
    return () => clearInterval(interval);
  }, []);

  // Clear all logins for worker and admin
  const handleClearAllLogins = () => {
    localStorageManager.clearAllSessions();
    setWorkerSession(null);
    setAdminSession(null);
    setSessionKey((prev) => prev + 1);
    setPortalMode('portal_gate');
    setToastMessage('All active worker and admin sessions cleared. Ready for fresh login.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWorkerLogout = () => {
    setWorkerSession(null);
    setPortalMode('portal_gate');
    setSessionKey((prev) => prev + 1);
    setToastMessage('Worker signed out successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    setPortalMode('portal_gate');
    setSessionKey((prev) => prev + 1);
    setToastMessage('Admin signed out successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top-Level Master Portal Switcher Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-50 sticky top-0 shadow-lg">
        {/* Logo & Portal Reset to Gate */}
        <button
          onClick={() => {
            setPortalMode('portal_gate');
            if (window.location.hash.startsWith('#verify/')) {
              window.location.hash = '';
            }
          }}
          className="flex items-center gap-2 hover:opacity-90 transition text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-tech text-sm shadow-inner">
            AR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-tech font-bold text-amber-400 text-sm tracking-wide">
                AR-SAFE
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono border border-slate-700">
                SIH 2026
              </span>
            </div>
            <span className="text-slate-400 text-[10px] hidden sm:block">
              {t.appSubtitle}
            </span>
          </div>
        </button>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {/* Starting Gate Button */}
          <button
            onClick={() => {
              setPortalMode('portal_gate');
              if (window.location.hash.startsWith('#verify/')) {
                window.location.hash = '';
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
              portalMode === 'portal_gate'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.nav.portals}</span>
          </button>

          {/* Worker App Mode */}
          <button
            onClick={() => {
              setPortalMode('worker_app');
              if (window.location.hash.startsWith('#verify/')) {
                window.location.hash = '';
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
              portalMode === 'worker_app'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>{t.nav.workerApp}</span>
            {workerSession && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 hidden md:inline-block" />
            )}
          </button>

          {/* Admin Dashboard Mode - STRICTLY HIDDEN WHEN WORKER IS SIGNED IN */}
          {!workerSession && (
            <button
              onClick={() => {
                setPortalMode('admin_dashboard');
                if (window.location.hash.startsWith('#verify/')) {
                  window.location.hash = '';
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                portalMode === 'admin_dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.nav.adminDashboard}</span>
              {adminSession && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 hidden md:inline-block" />
              )}
            </button>
          )}

          {/* Public Certificate Verification */}
          <button
            onClick={() => setPortalMode('public_verification')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
              portalMode === 'public_verification'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.nav.publicVerification}</span>
            <span className="sm:hidden">Verify</span>
          </button>
        </div>

        {/* Right Toolbar: Global Language Selector, Device Frame & Clear Logins */}
        <div className="flex items-center gap-2">
          {/* Global Language Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label="Website Language"
              className="bg-transparent text-xs text-amber-300 font-bold outline-none cursor-pointer pr-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 font-sans">
                  {l.nativeName} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {portalMode === 'worker_app' && (
            <button
              onClick={() => setIsDeviceFrame(!isDeviceFrame)}
              title={isDeviceFrame ? 'Switch to Full Screen View' : 'Simulate Mobile Device Frame'}
              className={`p-1.5 rounded-lg border text-xs transition hidden sm:flex items-center gap-1.5 ${
                isDeviceFrame
                  ? 'bg-slate-800 text-amber-400 border-amber-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xl:inline">
                {isDeviceFrame ? t.nav.deviceFrame : t.nav.fullScreen}
              </span>
            </button>
          )}

          <button
            onClick={handleClearAllLogins}
            title="Clear all saved logins and reset sessions"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/80 rounded-lg text-xs font-semibold transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">{t.nav.clearLogins}</span>
          </button>
        </div>
      </header>

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="bg-emerald-950 border-b border-emerald-500 px-4 py-2 text-center text-xs text-emerald-200 font-semibold flex items-center justify-center gap-2 z-40 transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {portalMode === 'portal_gate' && (
          <PortalGate
            onSelectWorker={() => setPortalMode('worker_app')}
            onSelectAdmin={() => setPortalMode('admin_dashboard')}
            onSelectVerification={() => setPortalMode('public_verification')}
            onClearSessions={handleClearAllLogins}
            workerLoggedIn={Boolean(workerSession)}
            adminLoggedIn={Boolean(adminSession)}
            workerName={workerSession?.name}
            adminName={adminSession?.name}
          />
        )}

        {portalMode === 'worker_app' && (
          <div className="flex-1 flex flex-col items-center justify-start">
            {isDeviceFrame ? (
              <div className="py-6 px-4 w-full flex flex-col items-center">
                <div className="w-full max-w-[420px] h-[840px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700">
                  {/* Camera notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 pointer-events-none ring-2 ring-slate-800" />
                  {/* Status bar */}
                  <div className="h-7 bg-slate-950 px-6 pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none z-40">
                    <span>09:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-emerald-400 font-bold">5G AR</span>
                      <span className="w-3 h-2 border border-slate-400 rounded-sm inline-block" />
                    </div>
                  </div>
                  {/* Screen Body */}
                  <div className="flex-1 overflow-y-auto relative bg-slate-950">
                    <WorkerApp
                      key={`worker-${sessionKey}-${language}`}
                      onLogout={handleWorkerLogout}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col">
                <WorkerApp
                  key={`worker-${sessionKey}-${language}`}
                  onLogout={handleWorkerLogout}
                />
              </div>
            )}
          </div>
        )}

        {portalMode === 'admin_dashboard' && (
          <AdminDashboard
            key={`admin-${sessionKey}-${language}`}
            onLogout={handleAdminLogout}
          />
        )}

        {portalMode === 'public_verification' && (
          <PublicCertificateVerification
            key={`verify-${language}`}
            initialCertificateId={targetCertId}
            onNavigateHome={() => {
              setPortalMode('portal_gate');
              window.location.hash = '';
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
}
