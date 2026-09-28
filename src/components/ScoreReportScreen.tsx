import React, { useEffect } from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { TrainingSessionResult } from '../types';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, Home, CheckCircle, XCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ScoreReportScreenProps {
  result: TrainingSessionResult;
  onRetry: () => void;
  onViewCertificate: (certId: string) => void;
  onReturnHome: () => void;
}

export const ScoreReportScreen: React.FC<ScoreReportScreenProps> = ({
  result,
  onRetry,
  onViewCertificate,
  onReturnHome,
}) => {
  const { t } = useLocalization();

  useEffect(() => {
    if (result.isPassed) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ffffff'],
        });
      } catch {
        // ignore
      }
    }
  }, [result.isPassed]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Result Banner */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            result.isPassed ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center border shadow-inner ${
              result.isPassed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {result.isPassed ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>

          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-block mb-2 ${
              result.isPassed
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}
          >
            {result.isPassed ? t.scoring.passedBadge : t.scoring.failedBadge}
          </span>

          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {result.moduleTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Session ID: {result.sessionId} · Time: {result.durationSeconds}s
          </p>
        </div>

        {/* Score Readout Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">
              {t.scoring.finalScore}
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className={`text-4xl font-extrabold font-tech ${
                  result.isPassed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.totalScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">
              {t.scoring.passingScore}
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold font-tech text-amber-400">
                {result.passingScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Action Performance Breakdown */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {t.scoring.performanceBreakdown}
          </h2>
          <div className="space-y-2">
            {result.actions.map((act) => (
              <div
                key={act.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-200">
                      Step {act.stepNumber}: {act.stepTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{act.actionTaken}</p>
                  {act.feedback && (
                    <p
                      className={`text-[10px] mt-1 ${
                        act.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {act.feedback}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-mono font-bold ${
                      act.awardedPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {act.awardedPoints >= 0 ? `+${act.awardedPoints}` : act.awardedPoints} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competencies Validated or Weak Areas */}
        <div className="space-y-3 mb-6">
          {result.strongAreas.length > 0 && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.scoring.strongAreasTitle}</span>
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                {result.strongAreas.map((sa, i) => (
                  <li key={i}>{sa}</li>
                ))}
              </ul>
            </div>
          )}

          {result.weakAreas.length > 0 && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl">
              <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.scoring.weakAreasTitle}</span>
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                {result.weakAreas.map((wa, i) => (
                  <li key={i}>{wa}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{t.scoring.returnHome}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetry}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.scoring.retryButton}</span>
            </button>

            {result.isPassed && result.certificateId && (
              <button
                onClick={() => onViewCertificate(result.certificateId!)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4" />
                <span>{t.scoring.viewCertificateButton}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
