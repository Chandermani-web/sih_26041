import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ARCameraView } from './ARCameraView';
import { AROverlayHUD } from './AROverlayHUD';
import {
  ModuleId,
  ARTrackingState,
  FireExtinguisherType,
  PPESelection,
  TrainingSessionResult,
  Worker,
} from '../../types';
import { ScoringEngine } from '../../scoring/ScoringEngine';
import { useLocalization } from '../../localization/LocalizationContext';
import { soundEffects } from '../../utils/soundEffects';

interface ARScenarioRunnerProps {
  moduleId: ModuleId;
  moduleTitle: string;
  moduleCode: string;
  worker: Worker;
  onComplete: (result: TrainingSessionResult) => void;
  onExit: () => void;
}

export const ARScenarioRunner: React.FC<ARScenarioRunnerProps> = ({
  moduleId,
  moduleTitle,
  moduleCode,
  worker,
  onComplete,
  onExit,
}) => {
  const { t } = useLocalization();

  const [trackingState, setTrackingState] = useState<ARTrackingState>('scanning_surface');
  const [currentStep, setCurrentStep] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<FireExtinguisherType | null>(null);
  const [selectedPPE, setSelectedPPE] = useState<PPESelection | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isPositive: boolean } | null>(null);

  const scoringEngineRef = useRef<ScoringEngine>(new ScoringEngine({ passingThreshold: 80, maxScore: 100 }));
  const startTimeRef = useRef<number>(Date.now());
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((text: string, isPositive: boolean) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedback({ text, isPositive });
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 3200);
  }, []);

  const totalSteps = 5;

  // 1. Plane detected by ARCore scanner
  const handlePlaneDetected = useCallback(() => {
    setTrackingState((prev: ARTrackingState) => (prev === 'scanning_surface' ? 'surface_detected' : prev));
  }, []);

  // 2. Scenario Placed in 3D Space
  const handlePlaceScenario = useCallback((_x: number, _y: number) => {
    setTrackingState('placed');
    setTimeout(() => {
      setTrackingState('active');
    }, 400);
  }, []);

  // ----------------------------------------------------
  // FIRE & EXPLOSION SCENARIO STEPS (Section 5)
  // ----------------------------------------------------

  // Step 1: Identify Fire Hazard (+20 pts)
  const handleFireIdentified = useCallback(() => {
    if (currentStep !== 1) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 1,
      stepTitle: 'Hazard Identification',
      actionTaken: 'Conveyor Drive Motor Fire Identified',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.fireSteps.step1Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.fireSteps.step1Success, true);
    setCurrentStep(2);
  }, [currentStep, t, showFeedback]);

  // Step 2: Extinguisher Selection (Correct: ABC Dry Powder +20 pts, Incorrect: -10 pts)
  const handleExtinguisherSelected = useCallback(
    (type: FireExtinguisherType) => {
      if (currentStep !== 2) return;
      setSelectedExtinguisher(type);

      if (type === 'abc_dry_powder') {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 2,
          stepTitle: 'Extinguisher Media Selection',
          actionTaken: 'Selected ABC Dry Chemical Powder (MAP 90%)',
          maxPoints: 20,
          awardedPoints: 20,
          isCorrect: true,
          feedback: t.fireSteps.step2Success,
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        showFeedback(t.fireSteps.step2Success, true);
        setCurrentStep(3);
      } else {
        soundEffects.playPenalty();
        scoringEngineRef.current.recordAction({
          stepNumber: 2,
          stepTitle: 'Extinguisher Media Selection',
          actionTaken: `Selected ${type.toUpperCase()} (Hazardous Choice)`,
          maxPoints: 20,
          awardedPoints: -10, // -10 penalty
          isCorrect: false,
          feedback: t.fireSteps.step2Penalty,
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        showFeedback(t.fireSteps.step2Penalty, false);
      }
    },
    [currentStep, t, showFeedback]
  );

  // Step 3: Extinguish Fire with PASS technique (+30 pts)
  const handleExtinguishComplete = useCallback(() => {
    if (currentStep !== 3) return;
    soundEffects.playSuccess();
    scoringEngineRef.current.recordAction({
      stepNumber: 3,
      stepTitle: 'PASS Fire Suppression',
      actionTaken: 'Discharged agent at base of flame with sweeping motion',
      maxPoints: 30,
      awardedPoints: 30,
      isCorrect: true,
      feedback: t.fireSteps.step3Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.fireSteps.step3Success, true);
    setCurrentStep(4);
  }, [currentStep, t, showFeedback]);

  // Step 4: Identify Emergency Exit (+20 pts)
  const handleExitIdentified = useCallback(() => {
    if (currentStep !== 4) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 4,
      stepTitle: 'Emergency Exit Identification',
      actionTaken: 'Selected Primary Intake Airway Escapeway',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.fireSteps.step4Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.fireSteps.step4Success, true);
    setCurrentStep(5);
  }, [currentStep, t, showFeedback]);

  // Step 5: Safe Zone Evacuation (+20 pts) -> Finish
  const handleSafeZoneReached = useCallback(() => {
    if (currentStep !== 5) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 5,
      stepTitle: 'Safe Zone Evacuation',
      actionTaken: 'Reached Underground Mine Muster Station',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.fireSteps.step5Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.fireSteps.step5Success, true);

    // Finish session
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const result = scoringEngineRef.current.evaluateSession(
      worker.id,
      worker.name,
      moduleId,
      moduleTitle,
      moduleCode,
      duration
    );

    setTimeout(() => {
      onComplete(result);
    }, 1200);
  }, [currentStep, t, showFeedback, worker, moduleId, moduleTitle, moduleCode, onComplete]);

  // ----------------------------------------------------
  // GAS LEAK & CONFINED SPACE SCENARIO STEPS (Section 7)
  // ----------------------------------------------------

  // Step 1: Detect toxic gas (+20 pts)
  const handleGasAlarmAcknowledged = useCallback(() => {
    if (currentStep !== 1) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 1,
      stepTitle: 'Gas Hazard Recognition',
      actionTaken: 'CH4 (2.4% LEL) & H2S (18 PPM) verified on detector',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.gasSteps.step1Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.gasSteps.step1Success, true);
    setCurrentStep(2);
  }, [currentStep, t, showFeedback]);

  // Step 2: PPE Selection (+20 pts, -10 pts)
  const handlePPESelected = useCallback(
    (ppe: PPESelection) => {
      if (currentStep !== 2) return;
      setSelectedPPE(ppe);

      if (ppe === 'scba_apparatus') {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 2,
          stepTitle: 'Critical PPE Selection',
          actionTaken: 'Donned Positive-Pressure SCBA Apparatus (300 Bar)',
          maxPoints: 20,
          awardedPoints: 20,
          isCorrect: true,
          feedback: t.gasSteps.step2Success,
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        showFeedback(t.gasSteps.step2Success, true);
        setCurrentStep(3);
      } else {
        soundEffects.playPenalty();
        scoringEngineRef.current.recordAction({
          stepNumber: 2,
          stepTitle: 'Critical PPE Selection',
          actionTaken: `Selected ${ppe.toUpperCase()} (Fatal Asphyxiation Hazard)`,
          maxPoints: 20,
          awardedPoints: -10,
          isCorrect: false,
          feedback: t.gasSteps.step2Penalty,
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        showFeedback(t.gasSteps.step2Penalty, false);
      }
    },
    [currentStep, t, showFeedback]
  );

  // Step 3: Spark Isolation / Electrical Cutoff (+20 pts)
  const handleSparkLockdown = useCallback(() => {
    if (currentStep !== 3) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 3,
      stepTitle: 'Intrinsic Spark Isolation',
      actionTaken: 'Main drift power de-energized (Lockout/Tagout)',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.gasSteps.step3Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.gasSteps.step3Success, true);
    setCurrentStep(4);
  }, [currentStep, t, showFeedback]);

  // Step 4: Buddy System Confirmation (+20 pts)
  const handleBuddyConfirmed = useCallback(() => {
    if (currentStep !== 4) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 4,
      stepTitle: 'Buddy Worker Protocol',
      actionTaken: 'Coworker headcount verified & surface contacted',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.gasSteps.step4Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.gasSteps.step4Success, true);
    setCurrentStep(5);
  }, [currentStep, t, showFeedback]);

  // Step 5: Refuge Chamber Egress (+20 pts) -> Finish
  const handleRefugeChamberEntered = useCallback(() => {
    if (currentStep !== 5) return;
    scoringEngineRef.current.recordAction({
      stepNumber: 5,
      stepTitle: 'Safe Zone Evacuation',
      actionTaken: 'Secured inside Hermetic Mine Refuge Station',
      maxPoints: 20,
      awardedPoints: 20,
      isCorrect: true,
      feedback: t.gasSteps.step5Success,
    });
    setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
    showFeedback(t.gasSteps.step5Success, true);

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const result = scoringEngineRef.current.evaluateSession(
      worker.id,
      worker.name,
      moduleId,
      moduleTitle,
      moduleCode,
      duration
    );

    setTimeout(() => {
      onComplete(result);
    }, 1200);
  }, [currentStep, t, showFeedback, worker, moduleId, moduleTitle, moduleCode, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* 3D AR Camera and Canvas */}
      <ARCameraView
        moduleId={moduleId}
        trackingState={trackingState}
        currentStep={currentStep}
        onPlaneDetected={handlePlaneDetected}
        onPlaceScenario={handlePlaceScenario}
        onFireIdentified={handleFireIdentified}
        onExtinguisherSelected={handleExtinguisherSelected}
        onExtinguishComplete={handleExtinguishComplete}
        onExitIdentified={handleExitIdentified}
        onSafeZoneReached={handleSafeZoneReached}
        onGasAlarmAcknowledged={handleGasAlarmAcknowledged}
        onPPESelected={handlePPESelected}
        onSparkLockdown={handleSparkLockdown}
        onBuddyConfirmed={handleBuddyConfirmed}
        onRefugeChamberEntered={handleRefugeChamberEntered}
        selectedExtinguisher={selectedExtinguisher}
        selectedPPE={selectedPPE}
        isPaused={isPaused}
      />

      {/* AR HUD Overlay */}
      <AROverlayHUD
        moduleId={moduleId}
        currentStep={currentStep}
        totalSteps={totalSteps}
        currentScore={currentScore}
        trackingState={trackingState}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onExitSimulation={onExit}
        feedbackMessage={feedback}
      />
    </div>
  );
};
