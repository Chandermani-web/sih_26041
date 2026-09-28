import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ARTrackingState, ModuleId, FireExtinguisherType, PPESelection } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface ARCameraViewProps {
  moduleId: ModuleId;
  trackingState: ARTrackingState;
  currentStep: number;
  onPlaneDetected: () => void;
  onPlaceScenario: (x: number, y: number) => void;
  onFireIdentified: () => void;
  onExtinguisherSelected: (type: FireExtinguisherType) => void;
  onExtinguishComplete: () => void;
  onExitIdentified: () => void;
  onSafeZoneReached: () => void;
  // Gas leak scenario callbacks
  onGasAlarmAcknowledged: () => void;
  onPPESelected: (ppe: PPESelection) => void;
  onSparkLockdown: () => void;
  onBuddyConfirmed: () => void;
  onRefugeChamberEntered: () => void;
  // Controls
  selectedExtinguisher: FireExtinguisherType | null;
  selectedPPE: PPESelection | null;
  isPaused: boolean;
}

export const ARCameraView: React.FC<ARCameraViewProps> = ({
  moduleId,
  trackingState,
  currentStep,
  onPlaneDetected,
  onPlaceScenario,
  onFireIdentified,
  onExtinguisherSelected,
  onExtinguishComplete,
  onExitIdentified,
  onSafeZoneReached,
  onGasAlarmAcknowledged,
  onPPESelected,
  onSparkLockdown,
  onBuddyConfirmed,
  onRefugeChamberEntered,
  selectedExtinguisher,
  selectedPPE,
  isPaused,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [useCamera, setUseCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [flameHealth, setFlameHealth] = useState(100);
  const [isSpraying, setIsSpraying] = useState(false);
  const [reticlePos, setReticlePos] = useState({ x: 0.5, y: 0.65 });
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    async function setupCamera() {
      if (!useCamera) return;
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser context');
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }

        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
        }
        setCameraPermissionGranted(true);
        setCameraError(null);
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Camera access denied';
          setCameraError(msg);
          setUseCamera(false);
        }
      }
    }

    setupCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useCamera]);

  // Simulate floor plane detection after 1.8 seconds of scanning
  useEffect(() => {
    if (trackingState === 'scanning_surface') {
      const timer = setTimeout(() => {
        onPlaneDetected();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [trackingState, onPlaneDetected]);

  // Reset flame health when restarting
  useEffect(() => {
    if (currentStep === 1) {
      setFlameHealth(100);
      setIsSpraying(false);
    }
  }, [currentStep]);

  // Extinguishing loop
  useEffect(() => {
    if (isSpraying && flameHealth > 0 && !isPaused) {
      soundEffects.playSprayHiss();
      const interval = setInterval(() => {
        setFlameHealth((prev) => {
          const next = Math.max(0, prev - 7);
          if (next <= 0) {
            clearInterval(interval);
            setIsSpraying(false);
            onExtinguishComplete();
          }
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isSpraying, flameHealth, isPaused, onExtinguishComplete]);

  // Main AR Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    // Feature detection dots for floor plane
    const featureDots = Array.from({ length: 48 }, () => ({
      rx: 0.15 + Math.random() * 0.7,
      ry: 0.45 + Math.random() * 0.45,
      size: 2 + Math.random() * 3,
      alpha: 0.4 + Math.random() * 0.6,
    }));

    const render = () => {
      time += 0.03;
      const width = (canvas.width = canvas.clientWidth);
      const height = (canvas.height = canvas.clientHeight);

      ctx.clearRect(0, 0, width, height);

      // If synthetic camera mode (camera denied or fallback), draw realistic mine gallery background
      if (!useCamera || cameraError) {
        drawSyntheticIndustrialEnvironment(ctx, width, height, time);
      }

      // 1. Draw Surface Detection Plane & Scanning Reticle
      if (trackingState === 'scanning_surface' || trackingState === 'surface_detected') {
        drawSurfacePlaneGrid(ctx, width, height, time, featureDots, trackingState === 'surface_detected');
        drawPlacementReticle(ctx, width * reticlePos.x, height * reticlePos.y, time, trackingState === 'surface_detected');
      }

      // 2. Draw 3D Anchored Scenario Objects
      if (trackingState === 'placed' || trackingState === 'active') {
        const anchorX = anchorPos ? anchorPos.x * width : width * 0.5;
        const anchorY = anchorPos ? anchorPos.y * height : height * 0.68;

        if (moduleId === 'fire-explosion') {
          drawFireScenarioObjects(ctx, anchorX, anchorY, width, height, time, currentStep, flameHealth, isSpraying);
        } else {
          drawGasLeakScenarioObjects(ctx, anchorX, anchorY, width, height, time, currentStep);
        }
      }

      if (!isPaused) {
        animFrame = requestAnimationFrame(render);
      }
    };

    animFrame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animFrame);
  }, [trackingState, currentStep, flameHealth, isSpraying, useCamera, cameraError, reticlePos, anchorPos, isPaused, moduleId]);

  // Handle canvas click / touch for 3D placement and scene interaction
  const handleCanvasInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (isPaused) return;

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

      // STEP: Place scenario
      if (trackingState === 'surface_detected') {
        soundEffects.playTap();
        setAnchorPos({ x, y });
        onPlaceScenario(x, y);
        return;
      }

      // Placed interactions based on current step
      if (trackingState === 'active' || trackingState === 'placed') {
        const anchorX = anchorPos ? anchorPos.x : 0.5;
        const anchorY = anchorPos ? anchorPos.y : 0.68;

        const distToAnchor = Math.hypot(x - anchorX, y - anchorY);

        if (moduleId === 'fire-explosion') {
          // Step 1: Identify Hazard
          if (currentStep === 1) {
            if (distToAnchor < 0.25 || y > 0.45) {
              soundEffects.playSuccess();
              onFireIdentified();
            }
          }
          // Step 4: Identify Emergency Exit Marker
          else if (currentStep === 4) {
            if (x < 0.35 && y < 0.55) {
              soundEffects.playSuccess();
              onExitIdentified();
            }
          }
          // Step 5: Enter Safe Zone
          else if (currentStep === 5) {
            if (x > 0.65 && y < 0.6) {
              soundEffects.playSuccess();
              onSafeZoneReached();
            }
          }
        } else {
          // Gas leak interactions
          if (currentStep === 1) {
            soundEffects.playSuccess();
            onGasAlarmAcknowledged();
          } else if (currentStep === 3) {
            soundEffects.playSuccess();
            onSparkLockdown();
          } else if (currentStep === 4) {
            soundEffects.playSuccess();
            onBuddyConfirmed();
          } else if (currentStep === 5) {
            soundEffects.playSuccess();
            onRefugeChamberEntered();
          }
        }
      }
    },
    [
      trackingState,
      currentStep,
      isPaused,
      anchorPos,
      moduleId,
      onPlaceScenario,
      onFireIdentified,
      onExitIdentified,
      onSafeZoneReached,
      onGasAlarmAcknowledged,
      onSparkLockdown,
      onBuddyConfirmed,
      onRefugeChamberEntered,
    ]
  );

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none touch-none">
      {/* Real Rear Camera Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover ${
          useCamera && !cameraError ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* AR 3D Rendering & Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
        className="absolute inset-0 w-full h-full cursor-crosshair z-10"
      />

      {/* Camera permission / Fallback notice */}
      {cameraError && (
        <div className="absolute top-16 left-4 right-4 z-20 bg-slate-900/90 border border-amber-500/40 rounded-lg p-3 text-xs text-amber-200 backdrop-blur-md flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>AR High-Precision Synthetic Camera Feed Active</span>
          </div>
          <button
            onClick={() => {
              setCameraError(null);
              setUseCamera(true);
            }}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded font-medium text-xs transition"
          >
            Retry Camera
          </button>
        </div>
      )}

      {/* STEP 2: Fire Extinguisher Selector Overlay */}
      {moduleId === 'fire-explosion' && currentStep === 2 && (
        <div className="absolute bottom-6 left-3 right-3 z-30 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Select Certified Mine Extinguisher
            </span>
            <span className="text-[10px] text-slate-400">Class C Electrical / Coal Fuel</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onExtinguisherSelected('water')}
              className="flex flex-col items-start p-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition active:scale-95"
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                <span className="font-semibold text-xs text-slate-100">Water (Class A)</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Water jet for solid wood/paper only</span>
            </button>

            <button
              onClick={() => onExtinguisherSelected('foam')}
              className="flex flex-col items-start p-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition active:scale-95"
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="w-3 h-3 rounded-full bg-amber-200 inline-block" />
                <span className="font-semibold text-xs text-slate-100">AFFF Foam (Class B)</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Liquid fuel pool fires</span>
            </button>

            <button
              onClick={() => onExtinguisherSelected('abc_dry_powder')}
              className="flex flex-col items-start p-2.5 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500 rounded-lg text-left transition active:scale-95 shadow-lg shadow-amber-500/10"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="font-semibold text-xs text-amber-200">ABC Dry Powder</span>
                </div>
                <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1 rounded">CORRECT</span>
              </div>
              <span className="text-[10px] text-amber-300/80 mt-1">Monoammonium Phosphate · Live Electric safe</span>
            </button>

            <button
              onClick={() => onExtinguisherSelected('co2')}
              className="flex flex-col items-start p-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition active:scale-95"
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                <span className="font-semibold text-xs text-slate-100">CO2 Gas (Class B/C)</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Limited draft range in mine airflow</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Extinguisher PASS Aim & Sweep Interaction Control */}
      {moduleId === 'fire-explosion' && currentStep === 3 && (
        <div className="absolute bottom-6 left-4 right-4 z-30 bg-slate-900/90 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Fire Suppression: Sweep at Base of Flames
            </span>
            <span className="text-xs font-tech font-bold text-amber-400">{flameHealth}% Active</span>
          </div>

          {/* Flame Health Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-150 ${
                flameHealth > 40 ? 'bg-gradient-to-r from-amber-500 to-red-600' : 'bg-emerald-500'
              }`}
              style={{ width: `${flameHealth}%` }}
            />
          </div>

          {/* Action Trigger Button */}
          <button
            onMouseDown={() => setIsSpraying(true)}
            onMouseUp={() => setIsSpraying(false)}
            onTouchStart={() => setIsSpraying(true)}
            onTouchEnd={() => setIsSpraying(false)}
            className={`w-full py-3.5 px-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition select-none shadow-lg ${
              isSpraying
                ? 'bg-amber-400 text-slate-950 scale-[0.98] ring-4 ring-amber-500/50'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/20'
            }`}
          >
            <span>{isSpraying ? 'Discharging ABC Powder (HOLD & SWEEP)...' : 'PRESS & HOLD TO DISCHARGE (P.A.S.S.)'}</span>
          </button>
        </div>
      )}

      {/* STEP 2 for Gas Leak: PPE Selection Overlay */}
      {moduleId === 'gas-leak' && currentStep === 2 && (
        <div className="absolute bottom-6 left-3 right-3 z-30 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Select Respiratory PPE for H2S Atmosphere
            </span>
            <span className="text-[10px] text-slate-400">DGMS Standard CMR-156</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPPESelected('dust_mask')}
              className="flex flex-col items-start p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition active:scale-95"
            >
              <span className="font-semibold text-xs text-slate-200">N95 Dust Mask</span>
              <span className="text-[10px] text-slate-400 mt-1">Particulate filter only (Unsafe for gas)</span>
            </button>

            <button
              onClick={() => onPPESelected('scba_apparatus')}
              className="flex flex-col items-start p-2 bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500 rounded-lg text-left transition active:scale-95 shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-xs text-emerald-200">Positive-Pressure SCBA</span>
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1 rounded">CORRECT</span>
              </div>
              <span className="text-[10px] text-emerald-300/80 mt-1">Self-Contained Breathing Unit (300 Bar)</span>
            </button>

            <button
              onClick={() => onPPESelected('cloth_bandana')}
              className="flex flex-col items-start p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition active:scale-95"
            >
              <span className="font-semibold text-xs text-slate-200">Cloth Face Covering</span>
              <span className="text-[10px] text-slate-400 mt-1">Zero chemical protection</span>
            </button>

            <button
              onClick={() => onPPESelected('cartridge_half_mask')}
              className="flex flex-col items-start p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition active:scale-95"
            >
              <span className="font-semibold text-xs text-slate-200">Organic Vapor Half-Mask</span>
              <span className="text-[10px] text-slate-400 mt-1">Insufficient for low-oxygen drift</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// CANVAS DRAWING HELPER FUNCTIONS
// ----------------------------------------------------

function drawSyntheticIndustrialEnvironment(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number
) {
  // Underground mine gallery floor & rock walls
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.45, '#131b2c');
  grad.addColorStop(0.7, '#1f293d');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Industrial conveyor frame silhouettes in distance
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
  ctx.lineWidth = 1.5;

  // Floor perspective lines
  const horizon = h * 0.45;
  for (let i = -6; i <= 6; i++) {
    const startX = w * 0.5 + i * (w * 0.08);
    const endX = w * 0.5 + i * (w * 0.25);
    ctx.beginPath();
    ctx.moveTo(startX, horizon);
    ctx.lineTo(endX, h);
    ctx.stroke();
  }

  // Steel roof arch supports
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
  for (let y = horizon - 20; y > 0; y -= 40) {
    ctx.beginPath();
    ctx.arc(w * 0.5, y + 80, w * 0.45, Math.PI, 0);
    ctx.stroke();
  }

  // Floating industrial dust motes
  for (let i = 0; i < 20; i++) {
    const x = ((Math.sin(time * 0.2 + i * 2) * 0.5 + 0.5) * w + i * 37) % w;
    const y = ((Math.cos(time * 0.15 + i) * 0.5 + 0.5) * h * 0.8 + i * 23) % (h * 0.9);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSurfacePlaneGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  dots: { rx: number; ry: number; size: number; alpha: number }[],
  isDetected: boolean
) {
  // Feature points (tracking dots)
  dots.forEach((dot, idx) => {
    const pulse = Math.sin(time * 3 + idx) * 0.3 + 0.7;
    const x = dot.rx * w;
    const y = dot.ry * h;
    ctx.fillStyle = isDetected
      ? `rgba(16, 185, 129, ${dot.alpha * pulse})`
      : `rgba(245, 158, 11, ${dot.alpha * pulse})`;
    ctx.beginPath();
    ctx.arc(x, y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Perspective floor grid overlay
  ctx.strokeStyle = isDetected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.2)';
  ctx.lineWidth = 1;

  const groundY = h * 0.65;
  for (let step = 0; step < 6; step++) {
    const y = groundY + step * (h * 0.05);
    ctx.beginPath();
    ctx.moveTo(w * 0.15 - step * 20, y);
    ctx.lineTo(w * 0.85 + step * 20, y);
    ctx.stroke();
  }
}

function drawPlacementReticle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number,
  isReady: boolean
) {
  const pulse = Math.sin(time * 4) * 6;
  const radius = 48 + pulse;

  // Outer ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = isReady ? '#10b981' : '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.stroke();

  // Inner solid ring
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = isReady ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.3)';
  ctx.fill();
  ctx.strokeStyle = isReady ? '#10b981' : '#f59e0b';
  ctx.setLineDash([]);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center crosshair
  ctx.strokeStyle = isReady ? '#10b981' : '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy);
  ctx.lineTo(cx + 24, cy);
  ctx.moveTo(cx, cy - 24);
  ctx.lineTo(cx, cy + 24);
  ctx.stroke();

  // Prompt banner
  ctx.font = '600 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  const text = isReady ? 'TAP TO PLACE TRAINING SCENARIO' : 'SCANNING FLOOR SURFACE...';
  const tw = ctx.measureText(text).width;

  ctx.fillStyle = isReady ? 'rgba(16, 185, 129, 0.95)' : 'rgba(245, 158, 11, 0.9)';
  ctx.beginPath();
  ctx.roundRect(cx - tw / 2 - 12, cy + radius + 12, tw + 24, 26, 6);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillText(text, cx, cy + radius + 29);

  ctx.restore();
}

function drawFireScenarioObjects(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  w: number,
  h: number,
  time: number,
  step: number,
  flameHealth: number,
  isSpraying: boolean
) {
  ctx.save();

  // 1. Conveyor Belt Motor Housing (Floor anchor)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(anchorX - 70, anchorY - 25, 140, 50, 4);
  ctx.fill();
  ctx.stroke();

  // Industrial hazard warning diagonal stripes on motor bed
  ctx.save();
  ctx.beginPath();
  ctx.rect(anchorX - 68, anchorY + 12, 136, 10);
  ctx.clip();
  for (let s = -80; s < 80; s += 16) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(anchorX + s, anchorY + 12, 8, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(anchorX + s + 8, anchorY + 12, 8, 10);
  }
  ctx.restore();

  // 2. Fire and Smoke Simulation (if health > 0)
  if (flameHealth > 0) {
    const flameScale = (flameHealth / 100);

    // Billowing smoke particles
    for (let p = 0; p < 12; p++) {
      const pTime = time * 1.5 + p * 0.8;
      const smokeY = anchorY - 40 - (pTime % 4) * 45 * flameScale;
      const smokeX = anchorX + Math.sin(pTime * 2 + p) * (20 + p * 4);
      const smokeRadius = 14 + (pTime % 4) * 12;
      const smokeAlpha = Math.max(0, 0.4 - ((pTime % 4) / 4) * 0.4) * flameScale;

      ctx.fillStyle = `rgba(51, 65, 85, ${smokeAlpha})`;
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, smokeRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flame Core (Layered turbulent gradients)
    const flameHeight = (90 + Math.sin(time * 12) * 12) * flameScale;
    const flameWidth = (55 + Math.cos(time * 10) * 8) * flameScale;

    // Outer Red Glow
    const outerGlow = ctx.createRadialGradient(
      anchorX,
      anchorY - 20,
      10,
      anchorX,
      anchorY - 30,
      flameHeight
    );
    outerGlow.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
    outerGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.6)');
    outerGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.moveTo(anchorX - flameWidth, anchorY);
    ctx.quadraticCurveTo(anchorX - flameWidth * 0.5, anchorY - flameHeight * 0.6, anchorX, anchorY - flameHeight);
    ctx.quadraticCurveTo(anchorX + flameWidth * 0.5, anchorY - flameHeight * 0.6, anchorX + flameWidth, anchorY);
    ctx.closePath();
    ctx.fill();

    // Inner Hot Core (Yellow/White)
    const innerGlow = ctx.createRadialGradient(
      anchorX,
      anchorY - 10,
      4,
      anchorX,
      anchorY - 20,
      flameHeight * 0.65
    );
    innerGlow.addColorStop(0, '#ffffff');
    innerGlow.addColorStop(0.4, '#fef08a');
    innerGlow.addColorStop(0.8, '#f59e0b');
    innerGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.moveTo(anchorX - flameWidth * 0.5, anchorY);
    ctx.quadraticCurveTo(anchorX - flameWidth * 0.25, anchorY - flameHeight * 0.45, anchorX, anchorY - flameHeight * 0.7);
    ctx.quadraticCurveTo(anchorX + flameWidth * 0.25, anchorY - flameHeight * 0.45, anchorX + flameWidth * 0.5, anchorY);
    ctx.closePath();
    ctx.fill();

    // Sparks / Embers
    for (let s = 0; s < 8; s++) {
      const sY = anchorY - 10 - ((time * 80 + s * 30) % (flameHeight * 1.6));
      const sX = anchorX + Math.sin(time * 5 + s * 2) * (flameWidth * 0.6);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(sX, sY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. STEP 1: Hazard Identification Beacon
  if (step === 1) {
    const pulse = Math.sin(time * 6) * 5;
    const tagY = anchorY - 120 + pulse;

    ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
    ctx.strokeStyle = '#fef2f2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(anchorX - 90, tagY - 16, 180, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAP TO IDENTIFY HAZARD', anchorX, tagY + 4);

    // Flashing Hazard Triangle
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(anchorX - 74, tagY + 7);
    ctx.lineTo(anchorX - 66, tagY - 9);
    ctx.lineTo(anchorX - 58, tagY + 7);
    ctx.closePath();
    ctx.fill();
  }

  // 4. STEP 3: Spraying Powder Cloud & Fire Extinguisher in Hand
  if (step === 3) {
    // Extinguisher Body anchored to bottom right
    const extX = w * 0.78;
    const extY = h * 0.82;

    // Draw Extinguisher Cylinder
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(extX - 22, extY - 70, 44, 110, 8);
    ctx.fill();
    ctx.stroke();

    // Pressure Gauge & Yellow ABC band
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(extX - 20, extY - 35, 40, 24);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ABC DRY', extX, extY - 20);

    // Nozzle aiming at anchor base
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(extX - 10, extY - 70);
    ctx.quadraticCurveTo(extX - 60, extY - 80, anchorX + 40, anchorY - 10);
    ctx.stroke();

    // Active Spray Particle Cone
    if (isSpraying) {
      const sprayGrad = ctx.createLinearGradient(extX - 60, extY - 80, anchorX, anchorY - 10);
      sprayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sprayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      sprayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

      ctx.fillStyle = sprayGrad;
      ctx.beginPath();
      ctx.moveTo(anchorX + 40, anchorY - 10);
      ctx.lineTo(anchorX - 30, anchorY + 15);
      ctx.lineTo(anchorX - 10, anchorY - 50);
      ctx.closePath();
      ctx.fill();

      // Powder residue on ground
      ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY + 10, 60, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. STEP 4: Emergency Exit Marker (Intake Airway Escapeway)
  if (step === 4) {
    const exitX = w * 0.22;
    const exitY = h * 0.35;
    const pulse = Math.sin(time * 5) * 4;

    // Glowing green emergency exit sign
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#059669';
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(exitX - 60, exitY - 26, 120, 52, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMERGENCY EXIT', exitX, exitY - 6);
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillStyle = '#d1fae5';
    ctx.fillText('← INTAKE ESCAPEWAY', exitX, exitY + 12);

    // Chevron pulse
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(exitX - 45 + pulse, exitY + 2);
    ctx.lineTo(exitX - 52 + pulse, exitY - 4);
    ctx.lineTo(exitX - 45 + pulse, exitY - 10);
    ctx.stroke();
  }

  // 6. STEP 5: Safe Muster Zone Cylinder
  if (step === 5) {
    const safeX = w * 0.76;
    const safeY = h * 0.45;

    // Holographic safe zone cylinder
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(safeX, safeY + 40, 65, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Vertical light beam
    const beamGrad = ctx.createLinearGradient(safeX, safeY - 100, safeX, safeY + 40);
    beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
    beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0.35)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(safeX - 45, safeY - 100, 90, 140);

    // Banner
    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(safeX - 65, safeY - 120, 130, 30, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAFE MUSTER ZONE', safeX, safeY - 101);
  }

  ctx.restore();
}

function drawGasLeakScenarioObjects(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  w: number,
  h: number,
  time: number,
  step: number
) {
  ctx.save();

  // 1. Semi-transparent toxic gas cloud (CH4 & H2S)
  const cloudGrad = ctx.createRadialGradient(
    anchorX,
    anchorY - 40,
    20,
    anchorX,
    anchorY - 40,
    140
  );
  cloudGrad.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
  cloudGrad.addColorStop(0.5, 'rgba(202, 138, 4, 0.25)');
  cloudGrad.addColorStop(1, 'rgba(113, 63, 18, 0)');

  ctx.fillStyle = cloudGrad;
  ctx.beginPath();
  ctx.ellipse(anchorX, anchorY - 40, 150 + Math.sin(time * 3) * 15, 80 + Math.cos(time * 2) * 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Multi-Gas Detector Holographic Readout
  const gaugeX = w * 0.5;
  const gaugeY = h * 0.25;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(gaugeX - 110, gaugeY - 45, 220, 85, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ATMOSPHERIC GAS MONITOR · DGMS', gaugeX, gaugeY - 26);

  // CH4 and H2S readouts
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('CH4: 2.4% LEL', gaugeX - 45, gaugeY + 4);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('H2S: 18 PPM', gaugeX + 50, gaugeY + 4);

  ctx.font = '600 10px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('ALARM LEVEL 2 · EXPLOSIVE & TOXIC', gaugeX, gaugeY + 26);

  // 3. STEP 3: Spark Isolation Switch
  if (step === 3) {
    const swX = anchorX;
    const swY = anchorY + 20;

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(swX - 90, swY - 20, 180, 44, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CUT ELECTRICAL POWER (LOTO)', swX, swY + 6);
  }

  // 4. STEP 4: Buddy Worker Status
  if (step === 4) {
    const budX = w * 0.3;
    const budY = h * 0.5;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(budX - 70, budY - 20, 140, 40, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BUDDY CHECK: OK', budX, budY + 5);
  }

  // 5. STEP 5: Underground Refuge Chamber Egress
  if (step === 5) {
    const refX = w * 0.72;
    const refY = h * 0.42;

    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(refX - 75, refY - 25, 150, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('REFUGE CHAMBER', refX, refY - 5);
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('HERMETIC SAFE ZONE →', refX, refY + 12);
  }

  ctx.restore();
}
