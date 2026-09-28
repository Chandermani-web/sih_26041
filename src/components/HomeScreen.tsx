import React from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { Worker, TrainingModule, TrainingSessionResult, CertificateData } from '../types';
import { Flame, ShieldAlert, Award, CheckCircle, Clock, ArrowRight, Play, FileCheck } from 'lucide-react';

interface HomeScreenProps {
  worker: Worker;
  modules: TrainingModule[];
  trainingHistory: TrainingSessionResult[];
  certificates: CertificateData[];
  onSelectModule: (module: TrainingModule) => void;
  onLaunchAR: (module: TrainingModule) => void;
  onViewCertificates: () => void;
  onViewHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  worker,
  modules,
  trainingHistory,
  certificates,
  onSelectModule,
  onLaunchAR,
  onViewCertificates,
  onViewHistory,
}) => {
  const { t } = useLocalization();

  // Metrics
  const passedSessions = trainingHistory.filter((h) => h.isPassed);
  const completedModuleIds = new Set(passedSessions.map((s) => s.moduleId));
  const progressPercent = Math.round((completedModuleIds.size / modules.length) * 100);

  // Highest score
  const highestScore = trainingHistory.reduce((max, h) => Math.max(max, h.totalScore), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Worker Safety Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {t.home.site}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">{worker.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {t.home.greeting} {worker.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {worker.role} · {worker.department}
            </p>
          </div>

          {/* Quick AR Launcher Action */}
          <button
            onClick={() => onLaunchAR(modules[0])}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.home.startTrainingCTA}</span>
          </button>
        </div>

        {/* Competency Readiness Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[11px] text-slate-400 block mb-1">
              {t.home.progressTitle}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-tech text-white">
                {progressPercent}%
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Ready</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[11px] text-slate-400 block mb-1">
              {t.home.completedModules}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-tech text-white">
                {completedModuleIds.size} / {modules.length}
              </span>
            </div>
          </div>

          <button
            onClick={onViewCertificates}
            className="bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 p-3 rounded-xl text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400">
                {t.home.activeCertificates}
              </span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-tech text-amber-300">
                {certificates.length}
              </span>
              <span className="text-[10px] text-amber-400/80 group-hover:underline">View</span>
            </div>
          </button>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <span className="text-[11px] text-slate-400 block mb-1">
              Highest Benchmark
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-tech text-emerald-400">
                {highestScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{t.home.trainingModulesTitle}</span>
            <span className="text-xs font-mono font-normal text-slate-400">({modules.length} Modules)</span>
          </h2>
          <span className="text-[11px] text-amber-400/90 font-medium hidden sm:inline">
            {t.home.dgmsCompliance}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const isCompleted = completedModuleIds.has(mod.id);
            const isFire = mod.id === 'fire-explosion';

            return (
              <div
                key={mod.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isFire
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {isFire ? <Flame className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {mod.code} · {mod.category}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                          {isFire ? t.modules.fireTitle : t.modules.gasTitle}
                        </h3>
                      </div>
                    </div>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {isFire ? t.modules.fireShortDesc : t.modules.gasShortDesc}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.modules.durationMinutes}</span>
                    </div>
                    <span>·</span>
                    <span>5 AR Assessment Steps</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onSelectModule(mod)}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition text-center"
                  >
                    {t.modules.startModule}
                  </button>
                  <button
                    onClick={() => onLaunchAR(mod)}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{t.modules.startARSimulation}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Training Records Quick Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>{t.home.trainingHistoryTitle}</span>
          </h2>
          <button
            onClick={onViewHistory}
            className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {trainingHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">{t.history.emptyText}</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {trainingHistory.slice(0, 2).map((item) => (
              <div key={item.sessionId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{item.moduleTitle}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(item.completedAt).toLocaleDateString()} · Score: {item.totalScore}/100
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.isPassed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {item.isPassed ? 'PASSED' : 'FAILED'}
                  </span>
                  {item.certificateId && (
                    <button
                      onClick={onViewCertificates}
                      className="text-[11px] text-amber-400 hover:underline font-mono"
                    >
                      {item.certificateId}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
