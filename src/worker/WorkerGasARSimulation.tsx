import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ModuleId,
  KnowledgeQuestion,
  TrainingSessionResult,
  Worker,
  PPESelection,
} from '../types';
import { ScoringEngine } from '../scoring/ScoringEngine';
import { soundEffects } from '../utils/soundEffects';
import {
  Camera,
  Layers,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  RotateCw,
  Wind,
  Activity,
} from 'lucide-react';
import { useLocalization } from '../localization/LocalizationContext';
import { getLocalizedGasQuestions, getLocalizedARText } from '../localization/localizedContent';

interface WorkerGasARSimulationProps {
  moduleId: ModuleId;
  moduleTitle: string;
  moduleCode: string;
  worker: Worker;
  onFinishTest: (result: TrainingSessionResult) => void;
  onAbort: () => void;
}

export type GasScenarioStep =
  | 'SCAN_ENVIRONMENT'
  | 'INITIAL_LEAK_OBSERVE'
  | 'DETECT_AND_ISOLATE'
  | 'SELECT_PPE'
  | 'CLOSE_VALVE_MANUAL'
  | 'EVACUATION_DECISION'
  | 'REFUGE_CHAMBER'
  | 'KNOWLEDGE_ASSESSMENT';

const GAS_KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: 'gkq-1',
    question: 'Under DGMS Coal Mines Regulations 2017 (Reg 153), what is the maximum permissible concentration of Inflammable Gas (Methane) in general body of air before work must be stopped immediately?',
    options: [
      '0.50% (Work continues with fans)',
      '1.25% (Mandatory immediate power cut-off & withdrawal of workers)',
      '3.00% (High risk threshold)',
      '5.00% (Lower explosive limit)'
    ],
    correctIndex: 1,
    explanation: 'Under DGMS Coal Mines Regulations, if inflammable gas exceeds 1.25%, electrical supply must be disconnected immediately and all personnel evacuated.'
  },
  {
    id: 'gkq-2',
    question: 'Why is an ordinary cartridge or cloth dust mask completely useless and fatal during a Hydrogen Sulfide (H2S) gas burst in an underground confined shaft?',
    options: [
      'H2S clogs the dust filter fabric immediately',
      'H2S is a lethal nerve gas that passes directly through particulate filters; only positive-pressure SCBA supplies isolated breathing oxygen',
      'Dust masks react with moisture and catch fire',
      'Cartridge filters are too heavy for confined movement'
    ],
    correctIndex: 1,
    explanation: 'Particulate and dust filters only trap physical airborne dust. Toxic gases (H2S/CO) pass straight through into lungs, causing olfactory paralysis and fatal hypoxia.'
  },
  {
    id: 'gkq-3',
    question: 'When evacuating an underground section during an uncontrolled methane or toxic gas blowout, which path must workers follow?',
    options: [
      'Downwind towards the main exhaust ventilation shaft',
      'Upwind into the fresh Intake Airway traveling against the contaminated airflow direction',
      'Crawl into the lowest drainage sump',
      'Wait stationary at the borehole header until rescue teams arrive'
    ],
    correctIndex: 1,
    explanation: 'Always evacuate upwind into the fresh Intake Airway so the positive pressure of clean air sweeps contaminants away from your escape path.'
  }
];

export const WorkerGasARSimulation: React.FC<WorkerGasARSimulationProps> = ({
  moduleId,
  moduleTitle,
  moduleCode,
  worker,
  onFinishTest,
  onAbort,
}) => {
  const { language } = useLocalization();
  const arText = getLocalizedARText(language);
  const gasQuestions = getLocalizedGasQuestions(language);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [, setCameraPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [, setCameraError] = useState<string | null>(null);

  // Depth API & Occlusion State
  const [isOcclusionEnabled, setIsOcclusionEnabled] = useState(true);

  // Timer & State Machine
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [scenarioStep, setScenarioStep] = useState<GasScenarioStep>('SCAN_ENVIRONMENT');
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [anchorPose, setAnchorPose] = useState<{ x: number; y: number } | null>(null);

  // Multi-Gas Detector Readings (dynamic)
  const [detectorActive, setDetectorActive] = useState(false);
  const [gasReadings, setGasReadings] = useState({
    ch4Percent: 0.2,
    h2sPpm: 2,
    coPpm: 12,
    o2Percent: 20.9,
  });

  // Valve isolation progress (0 to 100%)
  const [valveTurnProgress, setValveTurnProgress] = useState(0);
  const [pipePressureBar, setPipePressureBar] = useState(42);
  const [isTurningValve, setIsTurningValve] = useState(false);

  // PPE selection
  const [, setSelectedPPE] = useState<PPESelection | null>(null);

  // Knowledge assessment questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [knowledgeScore, setKnowledgeScore] = useState(0);

  // Scoring engine & audio
  const scoringEngineRef = useRef<ScoringEngine>(new ScoringEngine({ passingThreshold: 80, maxScore: 100 }));
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; isPositive: boolean; points: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Open REAL hardware phone rear camera
  const initHardwareCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Hardware camera API not available in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
      setCameraActive(true);
      setCameraPermissionState('granted');
      setCameraError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Camera permission denied or camera device unavailable';
      setCameraError(msg);
      setCameraActive(false);
      setCameraPermissionState('denied');
    }
  }, []);

  useEffect(() => {
    initHardwareCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initHardwareCamera]);

  // Scenario Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floor Surface Detection Simulation
  useEffect(() => {
    if (!surfaceDetected && scenarioStep === 'SCAN_ENVIRONMENT') {
      const detectTimer = setTimeout(() => {
        setSurfaceDetected(true);
        soundEffects.playWarningBeep();
      }, 2500);
      return () => clearTimeout(detectTimer);
    }
  }, [surfaceDetected, scenarioStep]);

  // Timeline progression after anchoring
  useEffect(() => {
    if (!anchorPose) return;

    if (scenarioStep === 'INITIAL_LEAK_OBSERVE') {
      soundEffects.playGasHiss();
      const leakTimer = setTimeout(() => {
        soundEffects.playGasHiss();
        soundEffects.playGasDetectorAlarm();
        setDetectorActive(true);
        setGasReadings({
          ch4Percent: 2.8,
          h2sPpm: 28,
          coPpm: 65,
          o2Percent: 18.2,
        });
        setScenarioStep('DETECT_AND_ISOLATE');
        setFeedback({
          text: 'HIGH TOXICITY WARNING! Multi-gas alarm activated: H2S > 25 PPM, CH4 > 2.5% LEL',
          isPositive: false,
          points: 0,
        });
      }, 4500);

      return () => clearTimeout(leakTimer);
    }
  }, [anchorPose, scenarioStep]);

  // Valve rotation continuous interaction
  useEffect(() => {
    let turnInterval: ReturnType<typeof setInterval>;
    if (isTurningValve && scenarioStep === 'CLOSE_VALVE_MANUAL' && valveTurnProgress < 100) {
      soundEffects.playValveCreak();

      turnInterval = setInterval(() => {
        setValveTurnProgress((prev) => {
          const next = Math.min(100, prev + 5);
          setPipePressureBar(Math.max(0, Math.round(42 * (1 - next / 100))));

          if (next >= 100) {
            clearInterval(turnInterval);
            setIsTurningValve(false);
            soundEffects.playSuccess();

            scoringEngineRef.current.recordAction({
              stepNumber: 3,
              stepTitle: 'Isolation Valve Operation',
              actionTaken: 'Completed full clockwise wheel torque to shut isolation flange (0 Bar)',
              maxPoints: 25,
              awardedPoints: 25,
              isCorrect: true,
              feedback: 'High-pressure toxic flange sealed! Gas venting halted (+25 pts)',
            });
            setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
            setFeedback({
              text: 'Pipeline Flange Sealed! Pressure dropped to 0.0 Bar (+25 pts)',
              isPositive: true,
              points: 25,
            });

            // Transition to Evacuation Decision
            setTimeout(() => {
              setScenarioStep('EVACUATION_DECISION');
              soundEffects.playAlarm(true);
            }, 1200);
          }
          return next;
        });
      }, 120);
    }

    return () => clearInterval(turnInterval);
  }, [isTurningValve, scenarioStep, valveTurnProgress]);

  // Main 3D Canvas Render Loop over Real Camera Feed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.035;
      const w = (canvas.width = canvas.clientWidth);
      const h = (canvas.height = canvas.clientHeight);

      ctx.clearRect(0, 0, w, h);

      // 1. Surface scanning indicator
      if (!anchorPose) {
        drawGasScanningReticle(ctx, w * 0.5, h * 0.65, time, surfaceDetected);
      }

      // 2. Anchored Virtual Gas Pipeline & Flange in Real Environment
      if (anchorPose) {
        const ax = anchorPose.x * w;
        const ay = anchorPose.y * h;

        drawGasLeakEmergencyScene(
          ctx,
          ax,
          ay,
          w,
          h,
          time,
          scenarioStep,
          valveTurnProgress,
          pipePressureBar,
          detectorActive,
          gasReadings,
          isOcclusionEnabled
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [anchorPose, surfaceDetected, scenarioStep, valveTurnProgress, pipePressureBar, detectorActive, gasReadings, isOcclusionEnabled]);

  // Handle Manual Screen Touch Interaction
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    // Anchor virtual pipeline in real room
    if (!anchorPose) {
      if (surfaceDetected) {
        soundEffects.playTap();
        setAnchorPose({ x, y });
        setScenarioStep('INITIAL_LEAK_OBSERVE');
        setFeedback({
          text: 'Confined Space Pipeline Header Anchored in Environment.',
          isPositive: true,
          points: 0,
        });
      }
      return;
    }

    const ax = anchorPose.x;
    const ay = anchorPose.y;
    const dist = Math.hypot(x - ax, y - ay);

    // Phase 2: Detect & Isolate (Tap the leaking flange to identify source: +15 pts)
    if (scenarioStep === 'DETECT_AND_ISOLATE') {
      if (dist < 0.28 || y > 0.42) {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 1,
          stepTitle: 'Gas Leak Pinpointing',
          actionTaken: 'Identified ruptured flange gasket on methane/H2S drainage line',
          maxPoints: 15,
          awardedPoints: 15,
          isCorrect: true,
          feedback: 'Toxic emission point pinpointed and marked (+15 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'Gas Leak Point Pinpointed! High toxicity area demarcated (+15 pts)',
          isPositive: true,
          points: 15,
        });
        setScenarioStep('SELECT_PPE');
      }
    }
    // Phase 4: Evacuation Decision (Upwind Escape: +15 pts, Downwind Escape: -10 pts)
    else if (scenarioStep === 'EVACUATION_DECISION') {
      // Tap Left (Upwind Fresh Airway): Correct +15
      if (x < 0.45 && y < 0.55) {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 4,
          stepTitle: 'Evacuation Route Decision',
          actionTaken: 'Navigated upwind towards fresh intake airway',
          maxPoints: 15,
          awardedPoints: 15,
          isCorrect: true,
          feedback: 'Correct upwind route selected against contaminant plume (+15 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'Upwind Evacuation Correct! Fresh atmospheric flow verified (+15 pts)',
          isPositive: true,
          points: 15,
        });
        setScenarioStep('REFUGE_CHAMBER');
      }
      // Tap Right (Downwind Plume Drift): Penalty -10
      else if (x > 0.55 && y < 0.55) {
        soundEffects.playPenalty();
        scoringEngineRef.current.recordAction({
          stepNumber: 4,
          stepTitle: 'Evacuation Route Decision',
          actionTaken: 'Walked downwind into migrating toxic gas cloud',
          maxPoints: 15,
          awardedPoints: -10,
          isCorrect: false,
          feedback: 'FATAL PENALTY: Downwind evacuation walks directly into dense toxic gas plume (-10 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'PENALTY: Downwind path! Entering deadly gas cloud (-10 pts)',
          isPositive: false,
          points: -10,
        });
      }
    }
    // Phase 5: Refuge Chamber Assembly (+20 pts)
    else if (scenarioStep === 'REFUGE_CHAMBER') {
      if (x > 0.55 && y < 0.65) {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 5,
          stepTitle: 'Safe Refuge Assembly',
          actionTaken: 'Entered sealed Mine Refuge Chamber with positive air supply',
          maxPoints: 20,
          awardedPoints: 20,
          isCorrect: true,
          feedback: 'Safe sealed refuge chamber entered; atmospheric test normal (+20 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'Refuge Chamber Reached! Oxygen 20.9%, H2S 0.0 PPM (+20 pts)',
          isPositive: true,
          points: 20,
        });
        setTimeout(() => {
          setScenarioStep('KNOWLEDGE_ASSESSMENT');
        }, 1200);
      }
    }
  };

  // Phase 3: PPE Selection (Correct: SCBA +15 pts, Incorrect: -10 pts)
  const handleSelectPPE = (type: PPESelection) => {
    setSelectedPPE(type);

    if (type === 'scba_apparatus') {
      soundEffects.playSuccess();
      scoringEngineRef.current.recordAction({
        stepNumber: 2,
        stepTitle: 'Respiratory PPE Selection',
        actionTaken: 'Equipped Self-Contained Breathing Apparatus (SCBA 300 Bar Positive Pressure)',
        maxPoints: 15,
        awardedPoints: 15,
        isCorrect: true,
        feedback: 'Correct! Only positive-pressure SCBA isolates breathing in toxic gas atmospheres (+15 pts)',
      });
      setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
      setFeedback({
        text: 'Correct PPE: SCBA Positive Pressure Equipped (+15 pts)',
        isPositive: true,
        points: 15,
      });
      setScenarioStep('CLOSE_VALVE_MANUAL');
    } else {
      soundEffects.playPenalty();
      scoringEngineRef.current.recordAction({
        stepNumber: 2,
        stepTitle: 'Respiratory PPE Selection',
        actionTaken: `Selected ${type.replace('_', ' ').toUpperCase()} (Fatal Inhalation Risk)`,
        maxPoints: 15,
        awardedPoints: -10,
        isCorrect: false,
        feedback: 'LETHAL ERROR: Filter/dust masks cannot stop toxic H2S/CO or supply oxygen (-10 pts)',
      });
      setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
      setFeedback({
        text: 'FATAL PENALTY: Zero toxic gas protection! Wrong PPE (-10 pts)',
        isPositive: false,
        points: -10,
      });
    }
  };

  // Phase 6: Practical Knowledge Questions (10 pts total)
  const handleAnswerQuestion = (idx: number) => {
    setSelectedAnswerIndex(idx);
    const q = GAS_KNOWLEDGE_QUESTIONS[currentQuestionIndex];
    const isCorrect = idx === q.correctIndex;

    if (isCorrect) {
      soundEffects.playSuccess();
      setKnowledgeScore((prev) => prev + 3.33);
    } else {
      soundEffects.playPenalty();
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < gasQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswerIndex(null);
      } else {
        const finalKnowledgePoints = Math.round(knowledgeScore + (isCorrect ? 3.34 : 0));
        scoringEngineRef.current.recordAction({
          stepNumber: 6,
          stepTitle: language === 'hi' ? 'गैस सुरक्षा ज्ञान मूल्यांकन' : language === 'sat' ? 'ᱜᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱱᱤᱰ' : 'Knowledge Assessment',
          actionTaken: language === 'hi'
            ? `DGMS गैस सुरक्षा परीक्षा पूर्ण की (प्राप्तांक: ${finalKnowledgePoints}/10)`
            : language === 'sat'
            ? `DGMS ᱜᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱱᱤᱰ ᱢᱩᱪᱟᱹᱫ (ᱮᱞ: ${finalKnowledgePoints}/10)`
            : `Completed DGMS gas safety standards examination (Points: ${finalKnowledgePoints}/10)`,
          maxPoints: 10,
          awardedPoints: finalKnowledgePoints,
          isCorrect: finalKnowledgePoints >= 6,
          feedback: language === 'hi'
            ? 'DGMS गैस एवं संकीर्ण स्थान सुरक्षा मूल्यांकन पूर्ण'
            : language === 'sat'
            ? 'DGMS ᱜᱮᱥ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱱᱤᱰ ᱥᱟᱹᱛ ᱮᱱᱟ'
            : 'DGMS Gas & Confined Space Safety evaluation completed',
        });

        const result = scoringEngineRef.current.evaluateSession(
          worker.id,
          worker.name,
          moduleId,
          moduleTitle,
          moduleCode,
          secondsElapsed
        );
        onFinishTest(result);
      }
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none touch-none flex flex-col">
      {/* 1. REAL HARDWARE REAR CAMERA FEED */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. REAL-TIME 3D AR CANVAS OVER CAMERA */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
        className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
      />

      {/* Top HUD */}
      <div className="relative z-30 p-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between gap-2">
        <button
          onClick={onAbort}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold backdrop-blur-md transition active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white backdrop-blur-md">
            {formatTime(secondsElapsed)}
          </div>

          <button
            onClick={() => setIsOcclusionEnabled(!isOcclusionEnabled)}
            className={`px-2 py-1 rounded-lg border text-[11px] font-mono transition flex items-center gap-1 ${
              isOcclusionEnabled
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Depth Occlusion: {isOcclusionEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg font-bold font-tech text-sm shadow-md">
            SCORE: {currentScore}
          </div>
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              soundEffects.setMuted(next);
            }}
            className="p-1.5 bg-slate-900/80 text-slate-300 rounded-lg border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* DYNAMIC FEEDBACK TOAST */}
      {feedback && (
        <div className="absolute top-16 left-4 right-4 z-40 max-w-md mx-auto pointer-events-none transition-all">
          <div
            className={`p-3 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-2 text-xs font-bold ${
              feedback.isPositive
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500 text-rose-200'
            }`}
          >
            {feedback.isPositive ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        </div>
      )}

      {/* REAL-TIME MULTI-GAS DETECTOR HUD BADGE */}
      {detectorActive && (
        <div className="absolute top-28 right-4 z-30 bg-slate-950/90 border-2 border-amber-500/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-[10px] font-mono space-y-1 w-44">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-300 font-sans font-bold">
            <span className="flex items-center gap-1 text-amber-400">
              <Activity className="w-3.5 h-3.5" />
              GAS DETECTOR
            </span>
            <span className="text-[9px] text-rose-400 animate-pulse font-mono">ALARM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">CH4:</span>
            <span className={`font-bold ${gasReadings.ch4Percent > 1.25 ? 'text-rose-400' : 'text-slate-200'}`}>
              {gasReadings.ch4Percent.toFixed(1)}% LEL
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">H2S:</span>
            <span className={`font-bold ${gasReadings.h2sPpm > 10 ? 'text-rose-400' : 'text-slate-200'}`}>
              {gasReadings.h2sPpm} PPM
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">CO:</span>
            <span className={`font-bold ${gasReadings.coPpm > 50 ? 'text-rose-400' : 'text-slate-200'}`}>
              {gasReadings.coPpm} PPM
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">O2:</span>
            <span className={`font-bold ${gasReadings.o2Percent < 19.5 ? 'text-amber-400' : 'text-slate-200'}`}>
              {gasReadings.o2Percent.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* BOTTOM OBJECTIVE & ACTIONS */}
      <div className="mt-auto relative z-30 p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
        {/* Phase 0: Scanning */}
        {!anchorPose && (
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-center max-w-md mx-auto backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              {surfaceDetected ? 'Surface Ready' : 'Scanning Floor / Surface'}
            </span>
            <p className="text-xs text-slate-200">
              {surfaceDetected
                ? 'Point camera at floor and tap the reticle to anchor gas pipeline header.'
                : 'Move your phone slowly to scan the environment...'}
            </p>
          </div>
        )}

        {/* Phase 1: Observation */}
        {anchorPose && scenarioStep === 'INITIAL_LEAK_OBSERVE' && (
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 text-center max-w-md mx-auto backdrop-blur-md">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
              0:30 - 1:00 · INCIDENT INITIATION
            </span>
            <h3 className="text-sm font-bold text-white mb-1">Confined Space Pipeline Header</h3>
            <p className="text-xs text-slate-300">
              Virtual borehole pipe header anchored in your room. Listen for acoustic hissing pressure leak.
            </p>
          </div>
        )}

        {/* Phase 2: Detect & Isolate */}
        {anchorPose && scenarioStep === 'DETECT_AND_ISOLATE' && (
          <div className="bg-slate-900/90 border border-amber-500 rounded-2xl p-4 text-center max-w-md mx-auto backdrop-blur-md shadow-2xl">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
              1:00 - 1:45 · HAZARD PINPOINTING (+15 PTS)
            </span>
            <h3 className="text-sm font-bold text-white mb-1">Locate the Ruptured Pipe Flange</h3>
            <p className="text-xs text-slate-300">
              Inspect the virtual piping in your room. Tap the leaking yellow flange gasket to pinpoint the toxic gas breach.
            </p>
          </div>
        )}

        {/* Phase 3: PPE Selection */}
        {anchorPose && scenarioStep === 'SELECT_PPE' && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              1:45 - 2:30 · RESPIRATORY PPE DECISION (+15 PTS / -10 PENALTY)
            </span>
            <h3 className="text-sm font-bold text-white">Select Confined Space Respiratory Gear</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectPPE('dust_mask')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition"
              >
                <span className="font-bold text-xs text-slate-200 block">N95 Dust Mask</span>
                <span className="text-[10px] text-slate-400">Dust only · Ineffective against gas</span>
              </button>
              <button
                onClick={() => handleSelectPPE('scba_apparatus')}
                className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500 rounded-xl text-left transition shadow-md"
              >
                <span className="font-bold text-xs text-amber-200 block">SCBA Positive Pressure</span>
                <span className="text-[10px] text-amber-300">300 Bar · Isolated Breathing Oxygen</span>
              </button>
              <button
                onClick={() => handleSelectPPE('cloth_bandana')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition"
              >
                <span className="font-bold text-xs text-slate-200 block">Cloth Bandana</span>
                <span className="text-[10px] text-slate-400">Fatal Inhalation Hazard</span>
              </button>
              <button
                onClick={() => handleSelectPPE('cartridge_half_mask')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition"
              >
                <span className="font-bold text-xs text-slate-200 block">Half-Face Cartridge</span>
                <span className="text-[10px] text-slate-400">Cannot supply oxygen in deficient air</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 4: Manual Valve Wheel Turning */}
        {anchorPose && scenarioStep === 'CLOSE_VALVE_MANUAL' && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                2:30 - 3:15 · VALVE ISOLATION (+25 PTS)
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">Pressure: {pipePressureBar} Bar</span>
            </div>
            <p className="text-xs text-slate-300">
              Turn the isolation wheel clockwise to shut off the gas supply. Hold the button to torque the high-pressure wheel.
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-100"
                style={{ width: `${valveTurnProgress}%` }}
              />
            </div>
            <button
              onMouseDown={() => setIsTurningValve(true)}
              onMouseUp={() => setIsTurningValve(false)}
              onTouchStart={() => setIsTurningValve(true)}
              onTouchEnd={() => setIsTurningValve(false)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition select-none shadow-lg flex items-center justify-center gap-2 ${
                isTurningValve
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-500/50'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isTurningValve ? 'animate-spin' : ''}`} />
              <span>{isTurningValve ? 'TORQUING ISOLATION VALVE CLOCKWISE...' : 'PRESS & HOLD TO CLOSE VALVE WHEEL'}</span>
            </button>
          </div>
        )}

        {/* Phase 5: Evacuation Direction */}
        {anchorPose && scenarioStep === 'EVACUATION_DECISION' && (
          <div className="bg-slate-900/90 border border-emerald-500/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              3:15 - 4:15 · WIND EVACUATION ROUTE (+15 PTS)
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold">
              <Wind className="w-4 h-4" />
              <span>Atmospheric Wind Blowing Eastward →</span>
            </div>
            <p className="text-xs text-slate-300">
              Do NOT travel downwind into the toxic cloud! Tap the <strong className="text-emerald-400">Upwind Escapeway (Left)</strong> to evacuate into fresh intake airflow.
            </p>
          </div>
        )}

        {/* Phase 6: Safe Refuge Chamber */}
        {anchorPose && scenarioStep === 'REFUGE_CHAMBER' && (
          <div className="bg-slate-900/90 border border-emerald-500/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              4:15 - 4:45 · REFUGE CHAMBER (+20 PTS)
            </span>
            <h3 className="text-sm font-bold text-white">Enter Mine Refuge Chamber</h3>
            <p className="text-xs text-slate-300">
              Traverse toward the hermetically sealed green Refuge Chamber and tap to enter.
            </p>
          </div>
        )}

        {/* Phase 7: Knowledge Assessment */}
        {scenarioStep === 'KNOWLEDGE_ASSESSMENT' && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 max-w-lg mx-auto backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                4:45 - 5:00 · DGMS GAS SAFETY ASSESSMENT (+10 PTS)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Question {currentQuestionIndex + 1} / {GAS_KNOWLEDGE_QUESTIONS.length}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              {GAS_KNOWLEDGE_QUESTIONS[currentQuestionIndex].question}
            </h3>

            <div className="space-y-2 pt-1">
              {GAS_KNOWLEDGE_QUESTIONS[currentQuestionIndex].options.map((opt, i) => (
                <button
                  key={i}
                  disabled={selectedAnswerIndex !== null}
                  onClick={() => handleAnswerQuestion(i)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    selectedAnswerIndex === i
                      ? i === GAS_KNOWLEDGE_QUESTIONS[currentQuestionIndex].correctIndex
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedAnswerIndex === i && (
                    i === GAS_KNOWLEDGE_QUESTIONS[currentQuestionIndex].correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3D CANVAS RENDERING OVER REAL CAMERA FEED (GAS LEAK)
// ----------------------------------------------------

function drawGasScanningReticle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number,
  isReady: boolean
) {
  const pulse = Math.sin(time * 4) * 6;
  const radius = 52 + pulse;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = isReady ? '#10b981' : '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.stroke();

  // Center indicator
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = isReady ? 'rgba(16, 185, 129, 0.45)' : 'rgba(6, 182, 212, 0.4)';
  ctx.fill();
  ctx.strokeStyle = isReady ? '#10b981' : '#06b6d4';
  ctx.setLineDash([]);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy);
  ctx.lineTo(cx + 24, cy);
  ctx.moveTo(cx, cy - 24);
  ctx.lineTo(cx, cy + 24);
  ctx.stroke();

  // Prompt banner
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  const text = isReady ? 'TAP TO PLACE GAS PIPELINE HEADER' : 'SCANNING ENVIRONMENT FOR PIPING...';
  const tw = ctx.measureText(text).width;

  ctx.fillStyle = isReady ? 'rgba(16, 185, 129, 0.95)' : 'rgba(6, 182, 212, 0.95)';
  ctx.beginPath();
  ctx.roundRect(cx - tw / 2 - 12, cy + radius + 14, tw + 24, 26, 6);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillText(text, cx, cy + radius + 31);

  ctx.restore();
}

function drawGasLeakEmergencyScene(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  w: number,
  h: number,
  time: number,
  step: GasScenarioStep,
  valveProgress: number,
  pressureBar: number,
  detectorActive: boolean,
  _gasReadings: { ch4Percent: number; h2sPpm: number; coPpm: number; o2Percent: number },
  isOcclusionEnabled: boolean
) {
  ctx.save();

  if (isOcclusionEnabled) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 14;
  }

  // 1. Industrial High-Pressure Gas Pipeline Header (Anchored on floor/wall)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(ax - 85, ay - 18, 170, 36, 6);
  ctx.fill();
  ctx.stroke();

  // Pipeline metal tube
  const pipeGrad = ctx.createLinearGradient(ax - 80, ay - 14, ax + 80, ay - 14);
  pipeGrad.addColorStop(0, '#334155');
  pipeGrad.addColorStop(0.5, '#64748b');
  pipeGrad.addColorStop(1, '#334155');

  ctx.fillStyle = pipeGrad;
  ctx.beginPath();
  ctx.roundRect(ax - 80, ay - 12, 160, 24, 4);
  ctx.fill();

  // Toxic Hazard stripes on pipe
  ctx.save();
  ctx.beginPath();
  ctx.rect(ax - 78, ay - 10, 156, 6);
  ctx.clip();
  for (let s = -80; s < 80; s += 14) {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(ax + s, ay - 10, 7, 6);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(ax + s + 7, ay - 10, 7, 6);
  }
  ctx.restore();

  // Bolted Flange Joint (The Rupture Point)
  ctx.fillStyle = '#eab308';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(ax - 18, ay - 24, 36, 48, 4);
  ctx.fill();
  ctx.stroke();

  // Bolts on flange
  for (let b = 0; b < 4; b++) {
    const by = ay - 20 + b * 12;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ax - 10, by + 4, 2.5, 0, Math.PI * 2);
    ctx.arc(ax + 10, by + 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. High-Pressure Isolation Valve Wheel
  const valveWheelAngle = (valveProgress / 100) * Math.PI * 4;
  ctx.save();
  ctx.translate(ax, ay - 45);
  ctx.rotate(valveWheelAngle);

  // Wheel rim
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#dc2626';
  ctx.stroke();

  // Wheel spokes
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(18, 0);
  ctx.moveTo(0, -18);
  ctx.lineTo(0, 18);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#dc2626';
  ctx.stroke();
  ctx.restore();

  // Valve Stem
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(ax - 3, ay - 25, 6, 12);

  // 3. Pressure Gauge Dial
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ax + 45, ay - 35, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Gauge needle (points based on pressure)
  const needleAngle = Math.PI * 0.75 + (pressureBar / 42) * Math.PI * 1.5;
  ctx.beginPath();
  ctx.moveTo(ax + 45, ay - 35);
  ctx.lineTo(ax + 45 + Math.cos(needleAngle) * 10, ay - 35 + Math.sin(needleAngle) * 10);
  ctx.strokeStyle = pressureBar > 20 ? '#dc2626' : '#16a34a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 4. Toxic Gas Plume Simulation (Methane & H2S cloud)
  if (pressureBar > 0) {
    const leakScale = pressureBar / 42;

    for (let i = 0; i < 14; i++) {
      const pTime = time * 2.2 + i * 0.6;
      const progress = (pTime % 3) / 3;
      const gx = ax + Math.sin(pTime * 2 + i) * (25 + progress * 50);
      const gy = ay - 24 - progress * 110 * leakScale;
      const gRadius = (12 + progress * 32) * leakScale;
      const gAlpha = Math.max(0, (1 - progress) * 0.45 * leakScale);

      // Yellow-greenish toxic vapor tint for H2S and invisible heat shimmer for CH4
      ctx.fillStyle = `rgba(202, 138, 4, ${gAlpha})`;
      ctx.beginPath();
      ctx.arc(gx, gy, gRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Target Flag for Pinpointing Hazard (Step: DETECT_AND_ISOLATE)
  if (step === 'DETECT_AND_ISOLATE') {
    const pulse = Math.sin(time * 6) * 5;
    const tagY = ay - 110 + pulse;

    ctx.fillStyle = 'rgba(234, 179, 8, 0.95)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(ax - 90, tagY - 16, 180, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAP TO PINPOINT GAS LEAK', ax, tagY + 4);
  }

  // 6. Evacuation Markers (Step: EVACUATION_DECISION)
  if (step === 'EVACUATION_DECISION') {
    // Upwind Fresh Airway (Left)
    const exitX = w * 0.25;
    const exitY = h * 0.35;

    ctx.fillStyle = '#059669';
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(exitX - 65, exitY - 25, 130, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UPWIND ESCAPEWAY', exitX, exitY - 4);
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillStyle = '#d1fae5';
    ctx.fillText('← FRESH INTAKE AIR', exitX, exitY + 12);

    // Downwind Plume Route (Right - Deadly Trap)
    const trapX = w * 0.75;
    const trapY = h * 0.35;

    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(trapX - 65, trapY - 25, 130, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DOWNWIND CORRIDOR', trapX, trapY - 4);
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillStyle = '#fecaca';
    ctx.fillText('TOXIC GAS PLUME ⚠', trapX, trapY + 12);
  }

  // 7. Refuge Chamber (Step: REFUGE_CHAMBER)
  if (step === 'REFUGE_CHAMBER') {
    const safeX = w * 0.75;
    const safeY = h * 0.45;

    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(safeX, safeY + 40, 60, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(safeX - 65, safeY - 30, 130, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MINE REFUGE CHAMBER', safeX, safeY - 14);
    ctx.font = '600 9px Inter, sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('TAP TO ENTER', safeX, safeY - 2);
  }

  ctx.restore();
}
