import React from 'react';
import { Worker, TrainingModule, TrainingSessionResult, CertificateData } from '../types';
import { useLocalization } from '../localization/LocalizationContext';
import { getLocalizedWorkerProfile } from '../localization/localizedContent';
import { Flame, ShieldAlert, Award, Play, CheckCircle2, Clock, HardHat, ChevronRight } from 'lucide-react';

interface WorkerHomeProps {
  worker: Worker;
  modules: TrainingModule[];
  trainingHistory: TrainingSessionResult[];
  certificates: CertificateData[];
  onStartAR: (module: TrainingModule) => void;
  onViewCertificate: (cert: CertificateData) => void;
  onLogout: () => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({
  worker,
  modules,
  trainingHistory,
  certificates,
  onStartAR,
  onViewCertificate,
  onLogout,
}) => {
  const { t, language } = useLocalization();

  // Full Localized Worker Profile Details
  const profile = getLocalizedWorkerProfile(worker, language);

  // Real metrics calculated from worker's actual tests
  const completedSessions = trainingHistory.filter((t) => t.isPassed);
  const completedModuleIds = new Set(completedSessions.map((s) => s.moduleId));

  const signOutText = language === 'hi' ? 'साइन आउट' : language === 'sat' ? 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ' : 'Sign Out';
  const completedLabel = language === 'hi' ? 'पूर्ण मॉड्यूल' : language === 'sat' ? 'ᱥᱟᱹᱛ ᱮᱱᱟ' : 'Completed';
  const certificatesLabel = language === 'hi' ? 'सक्रिय प्रमाणपत्र' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : 'Certificates';
  const testAttemptsLabel = language === 'hi' ? 'परीक्षण प्रयास' : language === 'sat' ? 'ᱵᱤᱱᱤᱰ ᱮᱞ' : 'Test Attempts';
  const passingMarkLabel = language === 'hi' ? 'उत्तीर्णता मानक: 80/100' : language === 'sat' ? 'ᱯᱟᱥ ᱮᱞ: ᱘᱐/᱑᱐᱐' : 'Passing Mark: 80/100';
  const stepsLabel = language === 'hi' ? '5 AR व्यावहारिक चरण' : language === 'sat' ? '᱕ ᱜᱚᱴᱟᱝ AR ᱛᱷᱟᱨ' : '5 AR Physical Steps';
  const passedBadgeText = language === 'hi' ? 'उत्तीर्ण (PASSED)' : language === 'sat' ? 'ᱯᱟᱥ ᱮᱱᱟ' : 'PASSED';
  const failedBadgeText = language === 'hi' ? 'अनुत्तीर्ण (FAIL)' : language === 'sat' ? 'ᱵᱟᱝ ᱯᱟᱥ' : 'FAIL';
  const earnedCertsTitle = language === 'hi' ? 'अर्जित सुरक्षा प्रमाणपत्र' : language === 'sat' ? 'ᱧᱟᱢ ᱟᱠᱟᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : 'Earned Safety Certificates';
  const recentAttemptsTitle = language === 'hi' ? 'हालिया परीक्षण रिकॉर्ड' : language === 'sat' ? 'ᱱᱤᱛᱚᱜᱟᱜ ᱵᱤᱱᱤᱰ ᱨᱮᱠᱚᱨᱰ' : 'Recent Test Attempts';
  const shiftLabel = language === 'hi' ? 'कार्य पाली' : language === 'sat' ? 'ᱠᱟᱹᱢᱤ ᱥᱤᱯᱷᱴ' : 'Work Shift';
  const bloodLabel = language === 'hi' ? 'रक्त समूह' : language === 'sat' ? 'ᱢᱟᱭᱟᱢ ᱦᱟᱹᱴᱤᱧ' : 'Blood Group';
  const siteLabel = language === 'hi' ? 'खदान कार्यस्थल' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱴᱷᱟᱶ' : 'Mine Location';

  return (
    <div className="max-w-md mx-auto p-4 space-y-5">
      {/* Worker Safety Profile Card - Complete Profile Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <HardHat className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {worker.id}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">{profile.dgmsBadge}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{profile.name}</h2>
              <p className="text-[11px] text-slate-300 font-medium">{profile.role}</p>
              <p className="text-[10px] text-slate-400">{profile.department}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-[11px] text-slate-400 hover:text-rose-400 font-semibold transition shrink-0"
          >
            {signOutText}
          </button>
        </div>

        {/* Detailed Worker Metadata Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px]">
          <div className="text-slate-400">
            <span className="text-slate-500 block">{siteLabel}:</span>
            <span className="text-slate-200 font-medium truncate block">{profile.mineSite}</span>
          </div>
          <div className="text-slate-400">
            <span className="text-slate-500 block">{shiftLabel}:</span>
            <span className="text-slate-200 font-medium truncate block">{profile.shift} · {bloodLabel}: {profile.bloodGroup}</span>
          </div>
        </div>

        {/* Real Training Status */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">{completedLabel}</span>
            <span className="text-lg font-bold font-tech text-white">
              {completedModuleIds.size} / {modules.length}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">{certificatesLabel}</span>
            <span className="text-lg font-bold font-tech text-amber-400">
              {certificates.length}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">{testAttemptsLabel}</span>
            <span className="text-lg font-bold font-tech text-slate-300">
              {trainingHistory.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory AR Training Modules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t.home.trainingModulesTitle}
          </h3>
          <span className="text-[10px] text-amber-400 font-mono">{passingMarkLabel}</span>
        </div>

        {modules.map((mod) => {
          const isFire = mod.id === 'fire-explosion';
          const isPassed = completedModuleIds.has(mod.id);

          return (
            <div
              key={mod.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isFire
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    {isFire ? <Flame className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {mod.code} · {mod.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                  </div>
                </div>

                {isPassed && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{passedBadgeText}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{mod.shortDesc}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{stepsLabel}</span>
                </div>

                <button
                  onClick={() => onStartAR(mod)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{t.home.startTrainingCTA}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Earned Certificates Section */}
      {certificates.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {earnedCertsTitle}
          </h3>
          <div className="space-y-2">
            {certificates.map((cert) => {
              // Ensure certificate displays localized module title if available
              const matchedMod = modules.find((m) => m.id === cert.moduleId);
              const displayTitle = matchedMod ? matchedMod.title : cert.moduleTitle;

              return (
                <button
                  key={cert.certificateId}
                  onClick={() => onViewCertificate(cert)}
                  className="w-full bg-slate-900 border border-amber-500/30 hover:border-amber-500 rounded-2xl p-3 text-left transition flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{displayTitle}</h4>
                      <span className="text-[10px] font-mono text-amber-300 block">
                        {cert.certificateId} · {t.scoring.finalScore}: {cert.score}/100
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Actual Test Attempts */}
      {trainingHistory.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {recentAttemptsTitle}
          </h3>
          <div className="space-y-1.5">
            {trainingHistory.slice(0, 3).map((hist) => {
              const matchedMod = modules.find((m) => m.id === hist.moduleId);
              const displayTitle = matchedMod ? matchedMod.title : hist.moduleTitle;

              return (
                <div
                  key={hist.sessionId}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block text-[11px]">
                      {displayTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(hist.completedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold text-xs ${
                        hist.isPassed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {hist.totalScore}/100 {hist.isPassed ? `(${passedBadgeText})` : `(${failedBadgeText})`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
