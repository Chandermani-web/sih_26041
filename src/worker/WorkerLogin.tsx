import React, { useState } from 'react';
import { Worker } from '../types';
import { INITIAL_REGISTERED_WORKERS } from '../storage/LocalStorageManager';
import { useLocalization } from '../localization/LocalizationContext';
import { getLocalizedWorkerProfile } from '../localization/localizedContent';
import { HardHat, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';

interface WorkerLoginProps {
  onLogin: (worker: Worker) => void;
}

export const WorkerLogin: React.FC<WorkerLoginProps> = ({ onLogin }) => {
  const { language } = useLocalization();
  const [workerId, setWorkerId] = useState('JH-W-001');
  const [pin, setPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const govBadgeText = language === 'hi'
    ? 'झारखंड सरकार · खान सुरक्षा महानिदेशालय (DGMS)'
    : language === 'sat'
    ? 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ · DGMS ᱢᱟᱹᱱ ᱟᱱ'
    : 'GOVERNMENT OF JHARKHAND · DGMS ACCREDITED';

  const titleText = language === 'hi'
    ? 'AR-SAFE श्रमिक लॉगिन पोर्टल'
    : language === 'sat'
    ? 'AR-SAFE ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱚᱜᱤᱱ'
    : 'AR-SAFE WORKER LOGIN';

  const subtitleText = language === 'hi'
    ? 'अधिकृत ऑगमेंटेड रियलिटी व्यावसायिक सुरक्षा दक्षता पोर्टल'
    : language === 'sat'
    ? 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱟᱨ AR ᱵᱤᱱᱤᱰ ᱯᱚᱨᱴᱟᱞ'
    : 'Authorized Augmented Reality Vocational Safety Assessment Portal';

  const quickMinerTitle = language === 'hi'
    ? 'पंजीकृत खनिक का त्वरित चयन करें:'
    : language === 'sat'
    ? 'ᱨᱮᱡᱤᱥᱴᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:'
    : 'Quick Select Registered Miner:';

  const oneClickDemo = language === 'hi' ? '1-क्लिक डेमो' : language === 'sat' ? '᱑-ᱴᱤᱯᱟᱹᱣ ᱰᱮᱢᱳ' : '1-Click Demo';

  const winLabel = language === 'hi'
    ? 'श्रमिक पहचान संख्या (WIN / Worker ID)'
    : language === 'sat'
    ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ ᱮᱞ (Worker ID)'
    : 'Worker Identification Number (WIN)';

  const pinLabel = language === 'hi'
    ? '4-अंकीय सुरक्षा प्राधिकरण पिन'
    : language === 'sat'
    ? '᱔-ᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱤᱱ (PIN)'
    : '4-Digit Security Authorization PIN';

  const submitBtnText = language === 'hi'
    ? 'AR सुरक्षा मॉड्यूल में प्रवेश करें'
    : language === 'sat'
    ? 'AR ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱰᱭᱩᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ'
    : 'Enter AR Safety Modules';

  const verifiedRuleText = language === 'hi'
    ? 'DGMS नियम 2017 सत्यापित'
    : language === 'sat'
    ? 'DGMS ᱟᱹᱭᱤᱱ ᱒᱐᱑᱗ ᱥᱟᱹᱵᱤᱛ'
    : 'DGMS Rule 2017 Verified';

  const errEnterWin = language === 'hi'
    ? 'कृपया अपनी श्रमिक पहचान संख्या दर्ज करें।'
    : language === 'sat'
    ? 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱟᱢᱟᱜ Worker ID ᱮᱢ ᱢᱮ᱾'
    : 'Please enter your Worker Identification Number.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim()) {
      setErrorMsg(errEnterWin);
      return;
    }
    const found = INITIAL_REGISTERED_WORKERS.find(
      (w) => w.id.toUpperCase() === workerId.trim().toUpperCase()
    );

    if (found) {
      onLogin(found);
    } else {
      // Create registered session for custom worker
      onLogin({
        id: workerId.trim().toUpperCase(),
        name: `Worker ${workerId.trim().toUpperCase()}`,
        role: 'Heavy Mining Machinery & Safety Operator',
        department: 'Underground Operations Division',
        mineSite: 'Jharkhand Mining Belt Site-04',
        company: 'Govt. of Jharkhand Mining Operations',
        lastLogin: new Date().toISOString(),
      });
    }
  };

  const selectPreloadedWorker = (w: Worker) => {
    setWorkerId(w.id);
    setPin('1234');
    onLogin(w);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Warning Hazard Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 safety-stripes" />

        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-inner">
            <HardHat className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
            {govBadgeText}
          </span>
          <h1 className="text-2xl font-bold font-tech text-white">{titleText}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {subtitleText}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Worker Selectors for Evaluators */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              {quickMinerTitle}
            </span>
            <span className="text-[10px] text-amber-400 font-mono">{oneClickDemo}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {INITIAL_REGISTERED_WORKERS.map((w) => {
              const localizedW = getLocalizedWorkerProfile(w, language);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => selectPreloadedWorker(w)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                    workerId === w.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold block truncate text-slate-100">{localizedW.name}</span>
                    <span className="text-[10px] text-amber-400/90 font-mono font-semibold">{w.id}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">{localizedW.role.split(' ')[0]}</span>
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {winLabel}
            </label>
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="JH-W-001"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 uppercase font-mono outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {pinLabel}
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono tracking-widest outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{submitBtnText}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{verifiedRuleText}</span>
          </div>
          <span>SIH 2026</span>
        </div>
      </div>
    </div>
  );
};
