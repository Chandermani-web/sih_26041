import React from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { Worker, LanguageCode } from '../types';
import { Shield, Smartphone, Globe, LogOut, Code2, WifiOff } from 'lucide-react';

interface NavbarProps {
  worker: Worker | null;
  onLogout: () => void;
  activeTab: 'app' | 'history' | 'android-source';
  setActiveTab: (tab: 'app' | 'history' | 'android-source') => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  worker,
  onLogout,
  activeTab,
  setActiveTab,
  isDeviceFrame,
  setIsDeviceFrame,
}) => {
  const { language, setLanguage, languages, t } = useLocalization();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & Jharkhand Safety Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech font-bold text-base tracking-wide text-white">AR-SAFE</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Jharkhand Mining & Heavy Manufacturing Safety AR Simulator
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        {worker && (
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-950/60 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'app'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Training Portal
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.home.trainingHistoryTitle}
            </button>
            <button
              onClick={() => setActiveTab('android-source')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'android-source'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Android Native Code</span>
            </button>
          </div>
        )}

        {/* Right Action Tools: Language, Offline Indicator, Frame toggle, Logout */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-md text-[11px] text-emerald-300">
            <WifiOff className="w-3 h-3 text-emerald-400" />
            <span>Offline Ready</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 hidden sm:inline" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label="Select Language"
              className="bg-transparent text-xs text-amber-300 font-medium py-1 px-1.5 outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                  {l.nativeName} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Device Frame (Mobile Phone Frame vs Full Viewport) */}
          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            title={isDeviceFrame ? 'Switch to Full Screen' : 'Switch to Android Frame'}
            className={`p-1.5 rounded-lg border text-xs transition hidden sm:flex items-center gap-1.5 ${
              isDeviceFrame
                ? 'bg-slate-800 text-amber-400 border-amber-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[11px] hidden xl:inline">
              {isDeviceFrame ? 'Device Frame' : 'Full Screen'}
            </span>
          </button>

          {/* Worker Badge & Logout */}
          {worker && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-200">{worker.name}</p>
                <p className="text-[10px] text-amber-400 font-mono">{worker.id}</p>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
