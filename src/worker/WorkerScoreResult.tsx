import React, { useEffect } from 'react';
import { TrainingSessionResult } from '../types';
import { useLocalization } from '../localization/LocalizationContext';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, Home, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WorkerScoreResultProps {
  result: TrainingSessionResult;
  onRetry: () => void;
  onViewCertificate: () => void;
  onReturnHome: () => void;
}

export const WorkerScoreResult: React.FC<WorkerScoreResultProps> = ({
  result,
  onRetry,
  onViewCertificate,
  onReturnHome,
}) => {
  const { t, language } = useLocalization();

  useEffect(() => {
    if (result.isPassed) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ffffff'],
        });
      } catch {
        // ignore
      }
    }
  }, [result.isPassed]);

  const passedStatusText = language === 'hi'
    ? 'उत्तीर्ण · DGMS प्रमाणित'
    : language === 'sat'
    ? 'ᱯᱟᱥ ᱮᱱᱟ · DGMS ᱥᱟᱹᱵᱤᱛ'
    : 'PASSED · DGMS CERTIFIED';

  const failedStatusText = language === 'hi'
    ? 'अनुत्तीर्ण · पुनः प्रशिक्षण आवश्यक'
    : language === 'sat'
    ? 'ᱵᱟᱝ ᱯᱟᱥ ᱞᱮᱱᱟ · ᱟᱨᱦᱚᱸ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱠᱛᱤ'
    : 'FAILED · RE-TRAINING REQUIRED';

  const realScoreLabel = language === 'hi'
    ? 'आपका वास्तविक स्कोर'
    : language === 'sat'
    ? 'ᱟᱢᱟᱜ ᱥᱠᱳᱨ'
    : 'Your Real Score';

  const passingMarkLabel = language === 'hi'
    ? 'उत्तीर्णता मानक'
    : language === 'sat'
    ? 'ᱯᱟᱥ ᱮᱞ'
    : 'Passing Mark';

  const evaluatedActionsTitle = language === 'hi'
    ? 'मूल्यांकित व्यावहारिक क्रियाएं'
    : language === 'sat'
    ? 'ᱵᱤᱱᱤᱰ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤ'
    : 'Manual Actions Evaluated';

  const stepLabel = language === 'hi' ? 'चरण' : language === 'sat' ? 'ᱛᱷᱟᱨ' : 'Step';

  const strongTitle = language === 'hi'
    ? 'प्रमाणित क्षमताएं'
    : language === 'sat'
    ? 'ᱱᱟᱯᱟᱭ ᱠᱟᱹᱢᱤ'
    : 'Demonstrated Strengths';

  const weakTitle = language === 'hi'
    ? 'सुधार हेतु क्षेत्र'
    : language === 'sat'
    ? 'ᱠᱚᱢᱡᱳᱨ ᱴᱷᱟᱶ'
    : 'Areas for Improvement';

  return (
    <div className="min-h-full max-w-lg mx-auto p-4 flex flex-col justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Top Status Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            result.isPassed ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />

        {/* Result Header */}
        <div className="text-center mb-6">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center border shadow-inner ${
              result.isPassed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {result.isPassed ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-block mb-1.5 ${
              result.isPassed
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}
          >
            {result.isPassed ? passedStatusText : failedStatusText}
          </span>

          <h2 className="text-lg font-bold text-white mt-1">{result.moduleTitle}</h2>
          <p className="text-xs text-slate-400 font-mono">
            {language === 'hi' ? 'समय:' : language === 'sat' ? 'ᱚᱠᱛᱚ:' : 'Time Taken:'} {result.durationSeconds}s · Test ID: {result.sessionId}
          </p>
        </div>

        {/* Calculated Score */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
              {realScoreLabel}
            </span>
            <span
              className={`text-3xl font-extrabold font-tech ${
                result.isPassed ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.totalScore}
            </span>
            <span className="text-[10px] text-slate-500 block">/ 100</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
              {passingMarkLabel}
            </span>
            <span className="text-3xl font-extrabold font-tech text-amber-400">
              {result.passingScore}
            </span>
            <span className="text-[10px] text-slate-500 block">/ 100</span>
          </div>
        </div>

        {/* Action Performance Log */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {evaluatedActionsTitle}
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {result.actions.map((act) => (
              <div
                key={act.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block text-[11px]">
                    {stepLabel} {act.stepNumber}: {act.stepTitle}
                  </span>
                  <span className="text-[10px] text-slate-400">{act.actionTaken}</span>
                  {act.feedback && (
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        act.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {act.feedback}
                    </span>
                  )}
                </div>
                <span
                  className={`font-mono font-bold text-xs shrink-0 ${
                    act.awardedPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {act.awardedPoints >= 0 ? `+${act.awardedPoints}` : act.awardedPoints}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths or Weak Areas */}
        <div className="mb-6 space-y-2">
          {result.strongAreas.length > 0 && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-xs">
              <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{strongTitle}</span>
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                {result.strongAreas.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.weakAreas.length > 0 && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs">
              <span className="font-bold text-rose-400 block mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{weakTitle}</span>
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                {result.weakAreas.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2">
          {result.isPassed && (
            <button
              onClick={onViewCertificate}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>{t.scoring.viewCertificateButton}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onRetry}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-xl transition border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.scoring.retryButton}</span>
            </button>

            <button
              onClick={onReturnHome}
              className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 active:scale-95 text-slate-300 font-semibold text-xs rounded-xl transition border border-slate-800 flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.scoring.returnHome}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
