import React from 'react';
import {
  HardHat,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Award,
  Video,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import { INITIAL_REGISTERED_WORKERS } from '../storage/LocalStorageManager';
import { useLocalization } from '../localization/LocalizationContext';

interface PortalGateProps {
  onSelectWorker: () => void;
  onSelectAdmin: () => void;
  onSelectVerification: () => void;
  onClearSessions: () => void;
  workerLoggedIn: boolean;
  adminLoggedIn: boolean;
  workerName?: string;
  adminName?: string;
}

export const PortalGate: React.FC<PortalGateProps> = ({
  onSelectWorker,
  onSelectAdmin,
  onSelectVerification,
  onClearSessions,
  workerLoggedIn,
  adminLoggedIn,
  workerName,
  adminName,
}) => {
  const { t } = useLocalization();

  return (
    <div className="w-full flex-1 bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Official Government of Jharkhand / SIH Banner */}
      <section className="w-full border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono uppercase">{t.portalGate.sihTag}</span>
          </div>

          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
              <span>Govt. of Jharkhand</span>
              <span>•</span>
              <span>DGMS Safety Framework</span>
              <span>•</span>
              <span>ARCore Immersive Sim</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-tech tracking-tight text-white leading-tight">
              {t.portalGate.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t.portalGate.heroSubtitle}
            </p>
          </div>

          {/* Quick Metrics ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Region</span>
              <span className="text-sm font-bold text-amber-400 font-tech">{t.portalGate.regionLabel}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Standard</span>
              <span className="text-sm font-bold text-amber-400 font-tech">{t.portalGate.standardLabel}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Passing Grade</span>
              <span className="text-sm font-bold text-emerald-400 font-tech">{t.portalGate.passingGradeLabel}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Execution</span>
              <span className="text-sm font-bold text-emerald-400 font-tech">{t.portalGate.executionLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portals Selection */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold font-tech text-white uppercase tracking-wider">
              {t.portalGate.portalsTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {t.portalGate.portalsSubtitle}
            </p>
          </div>
          {(workerLoggedIn || adminLoggedIn) && (
            <button
              onClick={onClearSessions}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4"
            >
              {t.portalGate.signOutAll}
            </button>
          )}
        </div>

        {/* Portal Entrance Cards */}
        <div className={`grid grid-cols-1 ${workerLoggedIn ? 'max-w-xl mx-auto' : 'lg:grid-cols-2'} gap-8`}>
          {/* Card 1: Worker Mobile AR App */}
          <div className="bg-slate-900 border-2 border-slate-800 hover:border-amber-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 safety-stripes" />

            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shadow-inner">
                  <HardHat className="w-9 h-9" />
                </div>
                {workerLoggedIn ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active: {workerName}</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono uppercase font-semibold">
                    {t.portalGate.workerPortalTitle}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  {t.portalGate.workerPortalTag}
                </span>
                <h3 className="text-2xl font-bold font-tech text-white group-hover:text-amber-300 transition">
                  {t.portalGate.workerPortalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {t.portalGate.workerPortalDesc}
                </p>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                  <Video className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Rear Camera AR Overlay</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant QR Certificate</span>
                </div>
              </div>

              {/* Demo Worker Credentials */}
              {!workerLoggedIn && (
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Registered Test Credentials (PIN: 1234):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {INITIAL_REGISTERED_WORKERS.map((w) => (
                      <span
                        key={w.id}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-xs font-mono text-amber-300 rounded-lg"
                      >
                        {w.id} ({w.name.split(' ')[0]})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800">
              <button
                onClick={onSelectWorker}
                className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <span>{workerLoggedIn ? t.portalGate.workerContinueBtn : t.portalGate.workerBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Admin Regulatory Dashboard (Hidden when worker is signed in) */}
          {!workerLoggedIn && (
            <div className="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition shadow-inner">
                    <Building2 className="w-9 h-9" />
                  </div>
                  {adminLoggedIn ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Active: {adminName}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono uppercase font-semibold">
                      {t.portalGate.adminPortalTitle}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                    {t.portalGate.adminPortalTag}
                  </span>
                  <h3 className="text-2xl font-bold font-tech text-white group-hover:text-emerald-300 transition">
                    {t.portalGate.adminPortalTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {t.portalGate.adminPortalDesc}
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>State Mining Audit Logs</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                    <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Certificate Revocation</span>
                  </div>
                </div>

                {/* Demo Admin Credentials */}
                {!adminLoggedIn && (
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Inspector Credentials:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-emerald-300 rounded-lg">
                        ID: DGMS-ADM-01
                      </span>
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-slate-300 rounded-lg">
                        Passcode: dgms2026
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 mt-6 border-t border-slate-800">
                <button
                  onClick={onSelectAdmin}
                  className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-xl border border-slate-700 active:scale-[0.99]"
                >
                  <span>{adminLoggedIn ? t.portalGate.adminContinueBtn : t.portalGate.adminBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section: Public Certificate Verification Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-0.5">
                PUBLIC REGISTRY
              </span>
              <h4 className="text-lg font-bold font-tech text-white">
                {t.portalGate.publicCertTitle}
              </h4>
              <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                {t.portalGate.publicCertDesc}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={onSelectVerification}
              className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-600/20"
            >
              {t.portalGate.verifyBtn}
            </button>
          </div>
        </div>
      </section>

      {/* SIH Compliance Footnote */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 font-mono space-y-1">
        <p>AR-SAFE: Smart India Hackathon 2026 Prototype — Problem Statement SIH26041</p>
        <p className="text-[11px] text-slate-600">
          Complies with DGMS (Directorate General of Mines Safety) Regulations & Google ARCore Standards.
        </p>
      </footer>
    </div>
  );
};
