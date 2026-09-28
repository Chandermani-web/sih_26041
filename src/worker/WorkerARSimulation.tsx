import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ModuleId,
  ScenarioState,
  FireLevel,
  FireExtinguisherType,
  PPESelection,
  KnowledgeQuestion,
  TrainingSessionResult,
  Worker,
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
  Flame,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Crosshair,
  HelpCircle,
} from 'lucide-react';
import { WorkerGasARSimulation } from './WorkerGasARSimulation';
import { useLocalization } from '../localization/LocalizationContext';
import { getLocalizedFireQuestions, getLocalizedARText } from '../localization/localizedContent';

interface WorkerARSimulationProps {
  moduleId: ModuleId;
  moduleTitle: string;
  moduleCode: string;
  worker: Worker;
  onFinishTest: (result: TrainingSessionResult) => void;
  onAbort: () => void;
}

const FIRE_KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: 'kq-1',
    question: 'Why is a Class A water stream strictly prohibited on underground conveyor motor fires?',
    options: [
      'Water evaporates too quickly in mine temperature',
      'High risk of lethal electrical shock & arc flash deflagration',
      'Water increases toxic carbon dioxide production',
      'Water damages the conveyor vulcanized rubber'
    ],
    correctIndex: 1,
    explanation: 'Water conducts electricity across energized conveyor motor switchgear, causing severe electrocution hazard.'
  },
  {
    id: 'kq-2',
    question: 'During mine conveyor fire evacuation, why must workers traverse via the Intake Airway?',
    options: [
      'Intake airways deliver fresh, positive-pressure air free of toxic combustion fumes',
      'Intake airways have lower mechanical friction',
      'Return airways are exclusively reserved for diesel machinery',
      'Intake airways have higher humidity'
    ],
    correctIndex: 0,
    explanation: 'Intake airway provides fresh atmospheric oxygen flowing toward the face, preventing toxic gas asphyxiation.'
  },
  {
    id: 'kq-3',
    question: 'Under DGMS Coal Mines Regulations 2017, what is the mandatory immediate action after flame suppression?',
    options: [
      'Immediately resume conveyor haulage',
      'De-energize main electrical breaker (Lockout/Tagout) and report to surface control room',
      'Wash the switchgear housing with water',
      'Leave the area unmonitored'
    ],
    correctIndex: 1,
    explanation: 'Lockout/Tagout ensures equipment cannot re-energize or cause secondary smoldering ignition.'
  }
];

export const WorkerARSimulation: React.FC<WorkerARSimulationProps> = (props) => {
  if (props.moduleId === 'gas-leak') {
    return <WorkerGasARSimulation {...props} />;
  }

  const {
    moduleId,
    moduleTitle,
    moduleCode,
    worker,
    onFinishTest,
    onAbort,
  } = props;

  const { language } = useLocalization();
  const arText = getLocalizedARText(language);
  const fireQuestions = getLocalizedFireQuestions(language);

  // 1. REAL REAR CAMERA STREAM
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermissionState, setCameraPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Depth API & Occlusion Simulation State
  const [isDepthSupported, setIsDepthSupported] = useState(true);
  const [isOcclusionEnabled, setIsOcclusionEnabled] = useState(true);
  const [showDepthInspector, setShowDepthInspector] = useState(false);

  // Timer & State Machine (4-5 minutes progression)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [scenarioState, setScenarioState] = useState<ScenarioState>('SCAN_ENVIRONMENT');
  const [fireLevel, setFireLevel] = useState<FireLevel>('FIRE_LEVEL_0');
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [anchorPose, setAnchorPose] = useState<{ x: number; y: number } | null>(null);

  // Extinguisher aiming & continuous discharge
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<FireExtinguisherType | null>(null);
  const [isDischarging, setIsDischarging] = useState(false);
  const [flameHealth, setFlameHealth] = useState(100);
  const [crosshairOnFire, setCrosshairOnFire] = useState(false);

  // Secondary hazard & evacuation
  const [smokeCorridorBlocked, setSmokeCorridorBlocked] = useState(false);
  const [exitIdentified, setExitIdentified] = useState(false);

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

  // Scenario Timer (4-5 minutes progression)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floor Surface Detection Simulation (detects within 2-3 seconds of scanning)
  useEffect(() => {
    if (!surfaceDetected && scenarioState === 'SCAN_ENVIRONMENT') {
      const detectTimer = setTimeout(() => {
        setSurfaceDetected(true);
        soundEffects.playWarningBeep();
      }, 2500);
      return () => clearTimeout(detectTimer);
    }
  }, [surfaceDetected, scenarioState]);

  // Realistic Incident Timeline Evolution
  useEffect(() => {
    if (!anchorPose) return;

    // Phase 1 (0:30 - 1:00): Initial Incident (SPARK -> electrical flicker -> alarm)
    if (scenarioState === 'INITIAL_INCIDENT') {
      soundEffects.playSpark();
      setFireLevel('SPARK');

      const sparkTimer = setTimeout(() => {
        soundEffects.playSpark();
        setFeedback({
          text: 'Flickering electrical arc detected on conveyor switchgear!',
          isPositive: false,
          points: 0,
        });
      }, 3000);

      const smallFireTimer = setTimeout(() => {
        setFireLevel('SMALL_FIRE');
        soundEffects.playAlarm(false);
        setScenarioState('IDENTIFY_HAZARD');
      }, 7000);

      return () => {
        clearTimeout(sparkTimer);
        clearTimeout(smallFireTimer);
      };
    }

    // Phase 2 (1:00 - 1:45): Hazard Observation & Escalation
    // If worker neglects to identify the hazard, fire naturally escalates!
    if (scenarioState === 'IDENTIFY_HAZARD') {
      const escalationTimer = setTimeout(() => {
        if (scenarioState === 'IDENTIFY_HAZARD') {
          setFireLevel('MEDIUM_FIRE');
          soundEffects.playAlarm(true);
          setFeedback({
            text: 'WARNING: Unattended friction hazard growing! Locate and identify source immediately!',
            isPositive: false,
            points: 0,
          });
        }
      }, 8000);

      return () => clearTimeout(escalationTimer);
    }
  }, [anchorPose, scenarioState]);

  // Continuous Extinguisher Suppression Action Loop
  useEffect(() => {
    let sprayInterval: ReturnType<typeof setInterval>;

    if (isDischarging && scenarioState === 'USE_EXTINGUISHER' && flameHealth > 0) {
      soundEffects.playSprayHiss();

      sprayInterval = setInterval(() => {
        // If crosshairs are kept aligned with the base of the fire, flame health reduces
        if (crosshairOnFire) {
          soundEffects.playFireCrackle();
          setFlameHealth((prev) => {
            const next = Math.max(0, prev - 7);
            if (next <= 0) {
              clearInterval(sprayInterval);
              setIsDischarging(false);
              setFireLevel('EXTINGUISHED');
              soundEffects.playSuccess();

              // Step 3 validated (+25 pts)
              scoringEngineRef.current.recordAction({
                stepNumber: 3,
                stepTitle: 'Manual Extinguisher Operation',
                actionTaken: 'Maintained continuous nozzle aim at base of fire with P.A.S.S. sweep',
                maxPoints: 25,
                awardedPoints: 25,
                isCorrect: true,
                feedback: 'Flames completely extinguished with continuous sweep technique (+25 pts)',
              });
              setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
              setFeedback({
                text: 'Fire Successfully Extinguished! Base sweep technique validated (+25 pts)',
                isPositive: true,
                points: 25,
              });

              // Transition to Phase 4: Emergency Escalation & Evacuation
              setTimeout(() => {
                setSmokeCorridorBlocked(true);
                setScenarioState('EMERGENCY_ESCALATION');
                soundEffects.playAlarm(true);
              }, 1200);
            } else if (next < 30) {
              setFireLevel('CONTROLLED');
            }
            return next;
          });
        }
      }, 100);
    }

    return () => clearInterval(sprayInterval);
  }, [isDischarging, crosshairOnFire, scenarioState, flameHealth]);

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

      // 1. Surface scanning indicator (Floor plane)
      if (!anchorPose) {
        drawScanningReticle(ctx, w * 0.5, h * 0.65, time, surfaceDetected);
      }

      // 2. 3D Anchored Virtual Industrial Emergency
      if (anchorPose) {
        const ax = anchorPose.x * w;
        const ay = anchorPose.y * h;

        // Check if screen center crosshairs align with base of fire
        const screenCenterX = w * 0.5;
        const screenCenterY = h * 0.5;
        const distFromCenterToFire = Math.hypot(screenCenterX - ax, screenCenterY - (ay - 10));
        setCrosshairOnFire(distFromCenterToFire < 70);

        drawIndustrialEmergencyIncident(
          ctx,
          ax,
          ay,
          w,
          h,
          time,
          fireLevel,
          flameHealth,
          isDischarging,
          scenarioState,
          smokeCorridorBlocked,
          isOcclusionEnabled
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [anchorPose, surfaceDetected, fireLevel, flameHealth, isDischarging, scenarioState, smokeCorridorBlocked, isOcclusionEnabled]);

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

    // A. Place virtual scenario in real room
    if (!anchorPose) {
      if (surfaceDetected) {
        soundEffects.playTap();
        setAnchorPose({ x, y });
        setScenarioState('INITIAL_INCIDENT');
        setFeedback({
          text: 'Industrial Incident Anchored onto Surface. Observe equipment.',
          isPositive: true,
          points: 0,
        });
      }
      return;
    }

    const ax = anchorPose.x;
    const ay = anchorPose.y;
    const dist = Math.hypot(x - ax, y - ay);

    // B. Phase 2: Hazard Identification (Tap the fire: +15 pts)
    if (scenarioState === 'IDENTIFY_HAZARD') {
      if (dist < 0.28 || y > 0.45) {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 1,
          stepTitle: 'Hazard Identification',
          actionTaken: 'Tapped and isolated conveyor drive motor ignition source',
          maxPoints: 15,
          awardedPoints: 15,
          isCorrect: true,
          feedback: 'Fire source detected! Conveyor friction hazard isolated (+15 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'Hazard Identified! Electric Motor Fire Isolated (+15 pts)',
          isPositive: true,
          points: 15,
        });
        setScenarioState('SELECT_EXTINGUISHER');
      }
    }
    // C. Phase 4: Emergency Escalation (Exit choice: +15 pts or -10 pts)
    else if (scenarioState === 'EMERGENCY_ESCALATION') {
      // Tap Left (Clear Intake Airway Exit): Correct +15
      if (x < 0.45 && y < 0.55) {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 4,
          stepTitle: 'Emergency Decision',
          actionTaken: 'Selected clear intake airway emergency escapeway',
          maxPoints: 15,
          awardedPoints: 15,
          isCorrect: true,
          feedback: 'Primary intake escapeway verified clear of smoke (+15 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'Correct Escapeway! Intake Airway Smoke-Free (+15 pts)',
          isPositive: true,
          points: 15,
        });
        setExitIdentified(true);
        setScenarioState('REACH_SAFE_ZONE');
      }
      // Tap Right (Smoke-Blocked Return Airway): Penalty -10
      else if (x > 0.55 && y < 0.55) {
        soundEffects.playPenalty();
        scoringEngineRef.current.recordAction({
          stepNumber: 4,
          stepTitle: 'Emergency Decision',
          actionTaken: 'Attempted escape through smoke-choked return airway',
          maxPoints: 15,
          awardedPoints: -10,
          isCorrect: false,
          feedback: 'PENALTY: Deadly smoke-filled corridor! High carbon monoxide risk (-10 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'PENALTY: Corridor blocked by toxic smoke! (-10 pts)',
          isPositive: false,
          points: -10,
        });
      }
    }
    // D. Phase 5: Safe Muster Zone Evacuation (+20 pts)
    else if (scenarioState === 'REACH_SAFE_ZONE') {
      if (x > 0.55 && y < 0.65) {
        soundEffects.playSuccess();
        scoringEngineRef.current.recordAction({
          stepNumber: 5,
          stepTitle: 'Safe Zone Evacuation',
          actionTaken: 'Worker entered Underground Safe Muster Chamber',
          maxPoints: 20,
          awardedPoints: 20,
          isCorrect: true,
          feedback: 'Underground Safe Muster Chamber safely reached (+20 pts)',
        });
        setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
        setFeedback({
          text: 'Safe Muster Zone reached! Evacuation Successful (+20 pts)',
          isPositive: true,
          points: 20,
        });
        // Proceed to Final Knowledge Assessment
        setTimeout(() => {
          setScenarioState('KNOWLEDGE_ASSESSMENT');
        }, 1200);
      }
    }
  };

  // Phase 3: Extinguisher Selection (Correct: ABC Dry Powder +15 pts, Incorrect: -10 pts)
  const handleSelectExtinguisher = (type: FireExtinguisherType) => {
    setSelectedExtinguisher(type);

    if (type === 'abc_dry_powder') {
      soundEffects.playSuccess();
      scoringEngineRef.current.recordAction({
        stepNumber: 2,
        stepTitle: 'Equipment Selection',
        actionTaken: 'Selected ABC Dry Chemical Powder (MAP 90%)',
        maxPoints: 15,
        awardedPoints: 15,
        isCorrect: true,
        feedback: 'Correct! ABC powder safely suppresses live electrical and coal fuel fires (+15 pts)',
      });
      setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
      setFeedback({
        text: 'Correct Equipment: ABC Dry Powder Chosen (+15 pts)',
        isPositive: true,
        points: 15,
      });
      setScenarioState('USE_EXTINGUISHER');
    } else {
      soundEffects.playPenalty();
      scoringEngineRef.current.recordAction({
        stepNumber: 2,
        stepTitle: 'Equipment Selection',
        actionTaken: `Selected ${type.toUpperCase()} (Lethal Electric Shock Risk)`,
        maxPoints: 15,
        awardedPoints: -10,
        isCorrect: false,
        feedback: 'Hazardous choice! Water or foam on live electrical mine equipment conducts current (-10 pts)',
      });
      setCurrentScore(scoringEngineRef.current.calculateCurrentScore());
      setFeedback({
        text: 'PENALTY: Fatal shock hazard! Wrong extinguisher (-10 pts)',
        isPositive: false,
        points: -10,
      });
      setFireLevel('LARGE_FIRE');
    }
  };

  // Phase 6: Practical Knowledge Questions (10 pts total)
  const handleAnswerQuestion = (idx: number) => {
    setSelectedAnswerIndex(idx);
    const q = fireQuestions[currentQuestionIndex];
    const isCorrect = idx === q.correctIndex;

    if (isCorrect) {
      soundEffects.playSuccess();
      setKnowledgeScore((prev) => prev + 3.33);
    } else {
      soundEffects.playPenalty();
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < fireQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswerIndex(null);
      } else {
        // Complete evaluation
        const finalKnowledgePoints = Math.round(knowledgeScore + (isCorrect ? 3.34 : 0));
        scoringEngineRef.current.recordAction({
          stepNumber: 6,
          stepTitle: language === 'hi' ? 'ज्ञान मूल्यांकन' : language === 'sat' ? 'ᱵᱤᱱᱤᱰ ᱠᱩᱠᱞᱤ' : 'Knowledge Assessment',
          actionTaken: language === 'hi'
            ? `DGMS सुरक्षा प्रश्नों के उत्तर दिए (प्राप्तांक: ${finalKnowledgePoints}/10)`
            : language === 'sat'
            ? `DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ (ᱮᱞ: ${finalKnowledgePoints}/10)`
            : `Answered DGMS safety questions (Points: ${finalKnowledgePoints}/10)`,
          maxPoints: 10,
          awardedPoints: finalKnowledgePoints,
          isCorrect: finalKnowledgePoints >= 6,
          feedback: language === 'hi'
            ? 'व्यावहारिक ज्ञान मूल्यांकन पूर्ण हुआ'
            : language === 'sat'
            ? 'ᱵᱤᱱᱤᱰ ᱢᱩᱪᱟᱹᱫ ᱮᱱᱟ'
            : 'Practical knowledge evaluation completed',
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

  // Format MM:SS timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none touch-none flex flex-col">
      {/* 1. REAL HARDWARE PHONE CAMERA VIDEO FEED */}
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

      {/* Camera Permission Denied / Prompt Dialog */}
      {!cameraActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-sm text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {language === 'hi' ? 'कैमरा अनुमति आवश्यक' : language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱦᱩᱠᱩᱢ ᱞᱟᱹᱠᱛᱤ' : 'Camera Permission Required'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {language === 'hi'
                ? 'AR-SAFE को फर्श की सतह का पता लगाने और वास्तविक कमरे में आपातकालीन 3D घटना प्रदर्शित करने हेतु आपके फोन के रियर कैमरे की अनुमति की आवश्यकता है।'
                : language === 'sat'
                ? 'AR-SAFE ᱫᱚ ᱚᱛ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱚᱱ ᱨᱮᱱᱟᱜ ᱠᱮᱢᱮᱨᱟ ᱞᱟᱹᱠᱛᱤᱭᱟᱭ, ᱡᱟᱦᱟᱸᱛᱮ 3D ᱥᱤᱱ ᱧᱮᱞᱚᱜ-ᱟ᱾'
                : 'AR-SAFE requires access to your physical phone rear camera to detect floor surfaces and display the emergency incident in your real physical room.'}
            </p>
            <button
              onClick={initHardwareCamera}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              {language === 'hi' ? 'कैमरा चालू करें' : language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩᱭ ᱢᱮ' : 'Grant Camera Access'}
            </button>
          </div>
        </div>
      )}

      {/* MINIMAL TOP AR HUD: Timer, Status, Score, Depth Toggle */}
      <div className="relative z-30 p-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between gap-2">
        <button
          onClick={onAbort}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold backdrop-blur-md transition active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'बाहर निकलें' : language === 'sat' ? 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ' : 'Exit'}</span>
        </button>

        {/* Live AR Timer & Depth Status */}
        <div className="flex items-center gap-1.5">
          <div className="px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white backdrop-blur-md">
            {formatTime(secondsElapsed)}
          </div>

          <button
            onClick={() => setIsOcclusionEnabled(!isOcclusionEnabled)}
            title="Toggle ARCore Depth Occlusion"
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

        {/* Dynamic Real Score & Sound */}
        <div className="flex items-center gap-1.5">
          <div className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg font-bold font-tech text-sm shadow-md">
            {language === 'hi' ? 'स्कोर:' : language === 'sat' ? 'ᱮᱞ:' : 'SCORE:'} {currentScore}
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

      {/* CENTER CROSSHAIRS (For aiming fire extinguisher in Phase 3) */}
      {scenarioState === 'USE_EXTINGUISHER' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              crosshairOnFire
                ? 'border-emerald-400 scale-110 bg-emerald-500/20 ring-4 ring-emerald-500/30'
                : 'border-amber-400/80'
            }`}
          >
            <Crosshair className={`w-6 h-6 ${crosshairOnFire ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
        </div>
      )}

      {/* MINIMAL BOTTOM OBJECTIVE BANNER & MANUAL ACTION CONTROLS */}
      <div className="mt-auto relative z-30 p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
        {/* Phase 0: Scanning */}
        {!anchorPose && (
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-center max-w-md mx-auto backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              {surfaceDetected
                ? (language === 'hi' ? 'सतह तैयार' : language === 'sat' ? 'ᱚᱛ ᱥᱟᱯᱲᱟᱣ' : 'Surface Ready')
                : (language === 'hi' ? 'भौतिक फर्श की सतह को स्कैन किया जा रहा है' : language === 'sat' ? 'ᱚᱛ ᱥᱠᱮᱱ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ' : 'Scanning Physical Floor')}
            </span>
            <p className="text-xs text-slate-200">
              {surfaceDetected
                ? (language === 'hi' ? 'कैमरे को फर्श पर केंद्रित करें और 3D आपातकालीन सिनेरियो स्थापित करने के लिए टैप करें।' : language === 'sat' ? 'ᱥᱤᱱ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱚᱛ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾' : 'Point camera at floor and tap the reticle to place industrial emergency scenario.')
                : (language === 'hi' ? 'पर्यावरण को स्कैन करने के लिए अपने फोन को धीरे-धीरे घुमाएं...' : language === 'sat' ? 'ᱚᱛ ᱥᱠᱮᱱ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱚᱱ ᱫᱚ ᱵᱟᱹᱭ-ᱵᱟᱹᱭ ᱛᱮ ᱦᱤᱞᱟᱹᱣ ᱢᱮ...' : 'Move your phone slowly to scan the environment...')}
            </p>
          </div>
        )}

        {/* Phase 1: Initial Incident Observation */}
        {anchorPose && scenarioState === 'INITIAL_INCIDENT' && (
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 text-center max-w-md mx-auto backdrop-blur-md">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
              {language === 'hi' ? 'प्रारंभिक घटना अवलोकन' : language === 'sat' ? 'ᱮᱦᱚᱵ ᱜᱷᱚᱴᱱᱟ ᱧᱮᱞ' : '0:30 - 1:00 · INITIAL INCIDENT'}
            </span>
            <h3 className="text-sm font-bold text-white mb-1">
              {language === 'hi' ? 'औद्योगिक मशीनरी का निरीक्षण करें' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱢᱮᱥᱤᱱ ᱧᱮᱞ ᱢᱮ' : 'Observe Industrial Machinery'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'hi' ? 'आपके कमरे में कन्वेयर मोटर स्थापित है। विद्युत विसंगति एवं ताप पर ध्यान दें।' : language === 'sat' ? 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱳᱴᱚᱨ ᱚᱛ ᱨᱮ ᱫᱚᱦᱚ ᱮᱱᱟ᱾ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱴᱠᱟᱹᱣ ᱧᱮᱞ ᱢᱮ᱾' : 'Virtual conveyor switchgear anchored in your room. Watch for electrical anomalies.'}
            </p>
          </div>
        )}

        {/* Phase 2: Hazard Identification */}
        {anchorPose && scenarioState === 'IDENTIFY_HAZARD' && (
          <div className="bg-slate-900/90 border border-amber-500 rounded-2xl p-4 text-center max-w-md mx-auto backdrop-blur-md shadow-2xl">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
              {language === 'hi' ? 'खतरे की पहचान (+15 अंक)' : language === 'sat' ? 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ (+᱑᱕ ᱮᱞ)' : '1:00 - 1:45 · HAZARD IDENTIFICATION (+15 PTS)'}
            </span>
            <h3 className="text-sm font-bold text-white mb-1">
              {language === 'hi' ? 'खतरे के स्रोत का पता लगाएं और स्क्रीन पर टैप करें' : language === 'sat' ? 'ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ' : 'Locate & Tap the Hazard Source'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'hi' ? 'अपने कमरे में उपकरण का निरीक्षण करें। विद्युत आग को इंगित करने हेतु मोटर पर टैप करें।' : language === 'sat' ? 'ᱢᱳᱴᱚᱨ ᱨᱮ ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾' : 'Inspect the equipment in your room. Tap the virtual fire at the motor bed to isolate the electrical ignition.'}
            </p>
          </div>
        )}

        {/* Phase 3: Equipment Decision Making */}
        {anchorPose && scenarioState === 'SELECT_EXTINGUISHER' && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              1:45 - 2:30 · {arText.fireSelectBadge}
            </span>
            <h3 className="text-sm font-bold text-white">{arText.fireSelectTitle}</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectExtinguisher('water')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition"
              >
                <span className="font-bold text-xs text-slate-200 block">{arText.waterName}</span>
                <span className="text-[10px] text-slate-400">{arText.waterDesc}</span>
              </button>
              <button
                onClick={() => handleSelectExtinguisher('foam')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition"
              >
                <span className="font-bold text-xs text-slate-200 block">{arText.foamName}</span>
                <span className="text-[10px] text-slate-400">{arText.foamDesc}</span>
              </button>
              <button
                onClick={() => handleSelectExtinguisher('abc_dry_powder')}
                className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500 rounded-xl text-left transition shadow-md"
              >
                <span className="font-bold text-xs text-amber-200 block">{arText.abcName}</span>
                <span className="text-[10px] text-amber-300">{arText.abcDesc}</span>
              </button>
              <button
                onClick={() => handleSelectExtinguisher('co2')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition"
              >
                <span className="font-bold text-xs text-slate-200 block">{arText.co2Name}</span>
                <span className="text-[10px] text-slate-400">{arText.co2Desc}</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 4: Manual Extinguisher Action */}
        {anchorPose && scenarioState === 'USE_EXTINGUISHER' && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                2:30 - 3:15 · {arText.fireDischargeTitle}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">{flameHealth}% {arText.active}</span>
            </div>
            <p className="text-xs text-slate-300">
              {arText.fireDischargeDesc}
            </p>
            {/* Health bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-100"
                style={{ width: `${flameHealth}%` }}
              />
            </div>
            {/* Press and Hold discharge trigger */}
            <button
              onMouseDown={() => setIsDischarging(true)}
              onMouseUp={() => setIsDischarging(false)}
              onTouchStart={() => setIsDischarging(true)}
              onTouchEnd={() => setIsDischarging(false)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition select-none shadow-lg ${
                isDischarging
                  ? 'bg-amber-400 text-slate-950 scale-[0.98] ring-4 ring-amber-500/50'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isDischarging
                ? crosshairOnFire
                  ? arText.fireSuppressing
                  : arText.fireAimDrifted
                : arText.firePressHold}
            </button>
          </div>
        )}

        {/* Phase 5: Emergency Escalation & Escapeway Identification */}
        {anchorPose && scenarioState === 'EMERGENCY_ESCALATION' && (
          <div className="bg-slate-900/90 border border-emerald-500/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              {language === 'hi' ? 'आपातकालीन निकास निर्णय (+15 अंक)' : language === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱵᱟᱪᱷᱟᱣ (+᱑᱕ ᱮᱞ)' : '3:15 - 4:15 · EVACUATION DECISION (+15 PTS)'}
            </span>
            <h3 className="text-sm font-bold text-white">
              {language === 'hi' ? 'द्वितीयक खतरा: घना धुआं फैल रहा है' : language === 'sat' ? 'ᱫᱚᱥᱟᱨ ᱵᱤᱯᱚᱫᱽ: ᱫᱷᱩᱶᱟᱹ ᱯᱟᱥᱱᱟᱣ ᱮᱱᱟ' : 'Secondary Hazard: Dense Smoke Influx'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'दायां गलियारा धुएं से अवरुद्ध है। कमरे को स्कैन करें और सुरक्षित निकास हेतु हरे इनटेक एयरवे पर टैप करें।'
                : language === 'sat'
                ? 'ᱡᱚᱡᱚᱢ ᱥᱮᱫ ᱫᱷᱩᱶᱟᱹ ᱯᱮᱨᱮᱡ ᱮᱱᱟ᱾ ᱞᱮᱸᱜᱟ ᱥᱮᱫ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾'
                : 'Smoke is choking the right corridor. Scan your room and tap the illuminated Intake Airway (Left) to evacuate safely.'}
            </p>
          </div>
        )}

        {/* Phase 6: Safe Muster Zone */}
        {anchorPose && scenarioState === 'REACH_SAFE_ZONE' && (
          <div className="bg-slate-900/90 border border-emerald-500/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md shadow-2xl text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              {language === 'hi' ? 'सुरक्षित मस्टर क्षेत्र (+20 अंक)' : language === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ (+᱒᱐ ᱮᱞ)' : '4:15 - 4:45 · SAFE MUSTER ZONE (+20 PTS)'}
            </span>
            <h3 className="text-sm font-bold text-white">
              {language === 'hi' ? 'भूमिगत सुरक्षित चैंबर में प्रवेश करें' : language === 'sat' ? 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ' : 'Enter Underground Safe Chamber'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'स्क्रीन पर हरे बेलनाकार सेफ मस्टर स्टेशन की ओर बढ़ें और अंदर जाने के लिए टैप करें।'
                : language === 'sat'
                ? 'ᱥᱠᱨᱤᱱ ᱨᱮ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱪᱮᱢᱵᱟᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾'
                : 'Traverse toward the green cylindrical Safe Muster Station on your screen and tap to enter.'}
            </p>
          </div>
        )}

        {/* Phase 7: Knowledge Assessment Modal */}
        {scenarioState === 'KNOWLEDGE_ASSESSMENT' && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 max-w-lg mx-auto backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                4:45 - 5:00 · {arText.questionBadge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {arText.questionLabel} {currentQuestionIndex + 1} / {fireQuestions.length}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              {fireQuestions[currentQuestionIndex].question}
            </h3>

            <div className="space-y-2 pt-1">
              {fireQuestions[currentQuestionIndex].options.map((opt, i) => (
                <button
                  key={i}
                  disabled={selectedAnswerIndex !== null}
                  onClick={() => handleAnswerQuestion(i)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    selectedAnswerIndex === i
                      ? i === fireQuestions[currentQuestionIndex].correctIndex
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedAnswerIndex === i && (
                    i === fireQuestions[currentQuestionIndex].correctIndex ? (
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
// 3D CANVAS RENDERING OVER REAL CAMERA FEED
// ----------------------------------------------------

function drawScanningReticle(
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
  ctx.strokeStyle = isReady ? '#10b981' : '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.stroke();

  // Center indicator
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = isReady ? 'rgba(16, 185, 129, 0.45)' : 'rgba(245, 158, 11, 0.4)';
  ctx.fill();
  ctx.strokeStyle = isReady ? '#10b981' : '#f59e0b';
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
  const text = isReady ? 'TAP TO PLACE INDUSTRIAL INCIDENT' : 'SCANNING PHYSICAL ENVIRONMENT...';
  const tw = ctx.measureText(text).width;

  ctx.fillStyle = isReady ? 'rgba(16, 185, 129, 0.95)' : 'rgba(245, 158, 11, 0.95)';
  ctx.beginPath();
  ctx.roundRect(cx - tw / 2 - 12, cy + radius + 14, tw + 24, 26, 6);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillText(text, cx, cy + radius + 31);

  ctx.restore();
}

function drawIndustrialEmergencyIncident(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  w: number,
  h: number,
  time: number,
  fireLevel: FireLevel,
  flameHealth: number,
  isDischarging: boolean,
  state: ScenarioState,
  smokeCorridorBlocked: boolean,
  isOcclusionEnabled: boolean
) {
  ctx.save();

  // Depth Occlusion visualization (subtle depth shading rim)
  if (isOcclusionEnabled) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12;
  }

  // 1. Heavy Conveyor Motor Bed & Electrical Panel (anchored to physical floor)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(ax - 75, ay - 20, 150, 48, 6);
  ctx.fill();
  ctx.stroke();

  // Industrial hazard warning diagonal stripes
  ctx.save();
  ctx.beginPath();
  ctx.rect(ax - 73, ay + 14, 146, 10);
  ctx.clip();
  for (let s = -80; s < 80; s += 16) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(ax + s, ay + 14, 8, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(ax + s + 8, ay + 14, 8, 10);
  }
  ctx.restore();

  // Electrical switchgear housing box
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(ax - 40, ay - 55, 80, 38, 4);
  ctx.fill();
  ctx.stroke();

  // 2. Dynamic Electrical Sparks (During SPARK stage)
  if (fireLevel === 'SPARK' || fireLevel === 'SMALL_FIRE') {
    for (let i = 0; i < 6; i++) {
      const sx = ax - 10 + Math.sin(time * 30 + i * 2) * 20;
      const sy = ay - 40 + Math.cos(time * 25 + i) * 15;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sx, sy, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Dynamic Multi-Stage Fire & Smoke Simulation
  if (fireLevel !== 'FIRE_LEVEL_0' && fireLevel !== 'EXTINGUISHED' && flameHealth > 0) {
    let scale = 0.5;
    if (fireLevel === 'MEDIUM_FIRE') scale = 0.85;
    if (fireLevel === 'LARGE_FIRE') scale = 1.25;
    if (fireLevel === 'CONTROLLED') scale = 0.35;
    scale *= (flameHealth / 100);

    // Billowing smoke particles rising from the equipment
    for (let p = 0; p < 10; p++) {
      const pTime = time * 1.5 + p * 0.8;
      const sy = ay - 45 - (pTime % 4) * 50 * scale;
      const sx = ax + Math.sin(pTime * 2 + p) * (20 + p * 5);
      const sRadius = 16 + (pTime % 4) * 12;
      const sAlpha = Math.max(0, 0.5 - ((pTime % 4) / 4) * 0.5) * scale;

      ctx.fillStyle = `rgba(51, 65, 85, ${sAlpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic turbulent flames
    const fHeight = (90 + Math.sin(time * 16) * 14) * scale;
    const fWidth = (55 + Math.cos(time * 12) * 8) * scale;

    const outerGlow = ctx.createRadialGradient(ax, ay - 20, 10, ax, ay - 30, fHeight);
    outerGlow.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
    outerGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.7)');
    outerGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.moveTo(ax - fWidth, ay - 20);
    ctx.quadraticCurveTo(ax - fWidth * 0.5, ay - 20 - fHeight * 0.6, ax, ay - 20 - fHeight);
    ctx.quadraticCurveTo(ax + fWidth * 0.5, ay - 20 - fHeight * 0.6, ax + fWidth, ay - 20);
    ctx.closePath();
    ctx.fill();

    const innerGlow = ctx.createRadialGradient(ax, ay - 15, 4, ax, ay - 25, fHeight * 0.65);
    innerGlow.addColorStop(0, '#ffffff');
    innerGlow.addColorStop(0.4, '#fef08a');
    innerGlow.addColorStop(0.8, '#f59e0b');
    innerGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.moveTo(ax - fWidth * 0.5, ay - 20);
    ctx.quadraticCurveTo(ax - fWidth * 0.25, ay - 20 - fHeight * 0.45, ax, ay - 20 - fHeight * 0.7);
    ctx.quadraticCurveTo(ax + fWidth * 0.25, ay - 20 - fHeight * 0.45, ax + fWidth * 0.5, ay - 20);
    ctx.closePath();
    ctx.fill();
  }

  // Smoldering extinguished residue
  if (fireLevel === 'EXTINGUISHED') {
    for (let p = 0; p < 5; p++) {
      const pTime = time * 0.8 + p;
      const sy = ay - 30 - (pTime % 2.5) * 20;
      const sx = ax + Math.sin(pTime * 1.5 + p) * 15;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
      ctx.beginPath();
      ctx.arc(sx, sy, 8 + (pTime % 2.5) * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Hazard Identification Target (Phase 2)
  if (state === 'IDENTIFY_HAZARD') {
    const pulse = Math.sin(time * 6) * 5;
    const tagY = ay - 120 + pulse;

    ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(ax - 90, tagY - 16, 180, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAP TO ISOLATE HAZARD', ax, tagY + 4);
  }

  // 5. Extinguisher Spray Stream (Phase 4)
  if (state === 'USE_EXTINGUISHER') {
    const extX = w * 0.82;
    const extY = h * 0.82;

    // Extinguisher cylinder
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(extX - 22, extY - 60, 44, 105, 8);
    ctx.fill();

    // Nozzle
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(extX - 10, extY - 60);
    ctx.quadraticCurveTo(extX - 45, extY - 70, w * 0.5, h * 0.5);
    ctx.stroke();

    // Active Spray Cone
    if (isDischarging) {
      const sprayGrad = ctx.createLinearGradient(extX - 45, extY - 70, ax, ay - 10);
      sprayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sprayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      sprayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

      ctx.fillStyle = sprayGrad;
      ctx.beginPath();
      ctx.moveTo(extX - 45, extY - 70);
      ctx.lineTo(ax - 30, ay + 15);
      ctx.lineTo(ax + 30, ay - 35);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 6. Secondary Hazard: Smoke Corridor Blocked & Clear Intake Airway Exit (Phase 5)
  if (smokeCorridorBlocked && state === 'EMERGENCY_ESCALATION') {
    // Left: Clear Emergency Exit Route (Intake Airway)
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
    ctx.fillText('EMERGENCY EXIT', exitX, exitY - 4);
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillStyle = '#d1fae5';
    ctx.fillText('← INTAKE ESCAPEWAY', exitX, exitY + 12);

    // Right: Blocked Return Airway (Hazardous Smoke Plume)
    const blockedX = w * 0.75;
    const blockedY = h * 0.35;

    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(blockedX - 65, blockedY - 25, 130, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RETURN AIRWAY', blockedX, blockedY - 4);
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillStyle = '#fecaca';
    ctx.fillText('BLOCKED BY SMOKE ⚠', blockedX, blockedY + 12);
  }

  // 7. Safe Muster Zone Cylinder (Phase 6)
  if (state === 'REACH_SAFE_ZONE') {
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
    ctx.fillText('SAFE MUSTER ZONE', safeX, safeY - 14);
    ctx.font = '600 9px Inter, sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('TAP TO ENTER', safeX, safeY - 2);
  }

  ctx.restore();
}
