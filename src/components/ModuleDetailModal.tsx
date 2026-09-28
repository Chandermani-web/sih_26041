import React from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { TrainingModule } from '../types';
import { X, Flame, ShieldAlert, Clock, CheckCircle2, AlertOctagon, Play } from 'lucide-react';

interface ModuleDetailModalProps {
  module: TrainingModule | null;
  onClose: () => void;
  onLaunchAR: (module: TrainingModule) => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  onClose,
  onLaunchAR,
}) => {
  const { t } = useLocalization();

  if (!module) return null;

  const isFire = module.id === 'fire-explosion';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isFire
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isFire ? <Flame className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {module.code}
                </span>
                <span className="text-xs text-slate-400">{module.category}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {isFire ? t.modules.fireTitle : t.modules.gasTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Detailed Description */}
          <div>
            <h3 className="font-semibold text-slate-100 text-sm mb-1.5">Scenario Overview</h3>
            <p className="leading-relaxed text-slate-300">{module.fullDesc}</p>
          </div>

          {/* DGMS Standards & Duration */}
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">{t.modules.safetyStandard}</span>
              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{module.durationMinutes} Minutes</span>
              </div>
            </div>
            <p className="text-[11px] font-mono text-amber-300/80">{module.dgmsStandard}</p>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="font-semibold text-slate-100 text-sm mb-2">
              {t.modules.objectivesTitle}
            </h3>
            <div className="space-y-2">
              {module.objectives.map((obj, i) => (
                <div key={obj.id} className="flex items-start gap-2.5 p-2 bg-slate-950/40 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      {i + 1}. {obj.title}
                    </span>
                    <span className="text-[11px] text-slate-400">{obj.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Operating Procedures & Precautions */}
          <div>
            <h3 className="font-semibold text-slate-100 text-sm mb-2">
              {t.modules.precautionsTitle}
            </h3>
            <div className="space-y-1.5">
              {module.safetyPrecautions.map((prec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{prec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            {t.modules.backToList}
          </button>

          <button
            onClick={() => onLaunchAR(module)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.modules.startARSimulation}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
