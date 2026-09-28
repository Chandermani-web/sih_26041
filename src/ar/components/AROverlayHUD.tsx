import React, { useState } from 'react';
import { useLocalization } from '../../localization/LocalizationContext';
import { ARTrackingState, ModuleId } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { Volume2, VolumeX, Pause, Play, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AROverlayHUDProps {
  moduleId: ModuleId;
  currentStep: number;
  totalSteps: number;
  currentScore: number;
  trackingState: ARTrackingState;
  isPaused: boolean;
  onTogglePause: () => void;
  onExitSimulation: () => void;
  feedbackMessage: { text: string; isPositive: boolean } | null;
}

export const AROverlayHUD: React.FC<AROverlayHUDProps> = ({
  moduleId,
  currentStep,
  totalSteps,
  currentScore,
  trackingState,
  isPaused,
  onTogglePause,
  onExitSimulation,
  feedbackMessage,
}) => {
  const { t } = useLocalization();
  const [isMuted, setIsMuted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
  };

  // Get current step title & instruction
  const getStepDetails = () => {
    if (moduleId === 'fire-explosion') {
      switch (currentStep) {
        case 1:
          return {
            title: t.fireSteps.step1Title,
            desc: t.fireSteps.step1Instruction,
          };
        case 2:
          return {
            title: t.fireSteps.step2Title,
            desc: t.fireSteps.step2Instruction,
          };
        case 3:
          return {
            title: t.fireSteps.step3Title,
            desc: t.fireSteps.step3Instruction,
          };
        case 4:
          return {
            title: t.fireSteps.step4Title,
            desc: t.fireSteps.step4Instruction,
          };
        case 5:
          return {
            title: t.fireSteps.step5Title,
            desc: t.fireSteps.step5Instruction,
          };
        default:
          return { title: '', desc: '' };
      }
    } else {
      switch (currentStep) {
        case 1:
          return {
            title: t.gasSteps.step1Title,
            desc: t.gasSteps.step1Instruction,
          };
        case 2:
          return {
            title: t.gasSteps.step2Title,
            desc: t.gasSteps.step2Instruction,
          };
        case 3:
          return {
            title: t.gasSteps.step3Title,
            desc: t.gasSteps.step3Instruction,
          };
        case 4:
          return {
            title: t.gasSteps.step4Title,
            desc: t.gasSteps.step4Instruction,
          };
        case 5:
          return {
            title: t.gasSteps.step5Title,
            desc: t.gasSteps.step5Instruction,
          };
        default:
          return { title: '', desc: '' };
      }
    }
  };

  const stepDetails = getStepDetails();

  return (
    <>
      {/* Top Status & Controls Header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-3 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent">
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
          {/* Exit / Abort Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 rounded-lg text-xs font-medium backdrop-blur-md transition active:scale-95"
          >
            <span>{t.ar.exitAR}</span>
          </button>

          {/* AR Tracking Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-300 font-mono">
              ARCore: {trackingState === 'scanning_surface' ? 'Scanning Plane' : 'Spatial Lock'}
            </span>
          </div>

          {/* Score Counter & Controls */}
          <div className="flex items-center gap-1.5">
            <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-lg flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400">Score</span>
              <span className="text-sm font-bold font-tech text-amber-300">{currentScore}</span>
            </div>

            {/* Pause / Resume */}
            <button
              onClick={onTogglePause}
              aria-label={isPaused ? t.ar.resumeSimulation : t.ar.pauseSimulation}
              className="p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleSound}
              aria-label="Toggle Sound"
              className="p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Step Progress Segment Bar */}
        <div className="mt-2.5 max-w-2xl mx-auto flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Context Action Instruction Card (Placed below header) */}
      {trackingState !== 'scanning_surface' && trackingState !== 'surface_detected' && (
        <div className="absolute top-18 left-3 right-3 z-30 max-w-lg mx-auto">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {stepDetails.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentStep} / {totalSteps}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {stepDetails.desc}
            </p>
          </div>
        </div>
      )}

      {/* Instant Feedback Toast (+20 pts / -10 pts) */}
      {feedbackMessage && (
        <div className="absolute top-36 left-4 right-4 z-40 max-w-md mx-auto pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div
            className={`p-2.5 rounded-lg border backdrop-blur-md shadow-2xl flex items-center gap-2 text-xs font-semibold ${
              feedbackMessage.isPositive
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500 text-rose-200'
            }`}
          >
            {feedbackMessage.isPositive ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog to Abort Simulation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-2">
              {t.ar.confirmExit}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Your current progress in this AR training drill will be discarded.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg"
              >
                Continue Drill
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitSimulation();
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg"
              >
                Abort Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Screen Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-45 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center max-w-xs shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">Drill Paused</h3>
            <p className="text-xs text-slate-400 mb-4">Safety protocol timer is suspended.</p>
            <button
              onClick={onTogglePause}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition"
            >
              Resume AR Drill
            </button>
          </div>
        </div>
      )}
    </>
  );
};
