import React from 'react';
import { Smartphone, Box, Layers, Terminal, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react';

export const NativeArchitectureGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              Technical Architecture & Hardware Deployment
            </span>
            <h1 className="text-xl font-bold font-tech text-white">
              Android Native + Unity AR Foundation Integration
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Honest breakdown of what is running in this live prototype vs. what builds into the Android APK for physical device deployment.
        </p>
      </div>

      {/* Honest Implementation Transparency Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Web Prototype Capability */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Currently Running in This Prototype:</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>
              <strong>Live Hardware Rear Camera Access:</strong> Uses <code className="text-amber-400 font-mono">navigator.mediaDevices.getUserMedia</code> to feed the phone's physical rear camera in real time.
            </li>
            <li>
              <strong>Real-Time 3D Spatial Canvas:</strong> Overlays animated particle fire, billowing smoke, extinguishers, and exit beacons directly over the real camera view.
            </li>
            <li>
              <strong>Real Manual Interaction:</strong> Physical tapping, aiming, and pressing to discharge powder to extinguish fire with health tracking.
            </li>
            <li>
              <strong>Zero Hardcoded Scores:</strong> Real-time dynamic scoring (PASS $\ge$ 80, FAIL &lt; 80) with dynamic QR certificate generation.
            </li>
            <li>
              <strong>Real-Time Admin Dashboard:</strong> Safety inspector dashboard updating automatically as workers take tests.
            </li>
          </ul>
        </div>

        {/* Unity / Native Android Module */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Box className="w-4 h-4" />
            <span>Unity as a Library (UaaL) & ARCore Bridge:</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>
              <strong>Unity Version:</strong> Unity 2022.3 LTS or 2023.2 with <em>AR Foundation 5.1+</em> and <em>Google ARCore XR Plugin</em>.
            </li>
            <li>
              <strong>Android Native Host:</strong> Kotlin + Jetpack Compose Material 3 managing authentication, offline Room database, and navigation.
            </li>
            <li>
              <strong>Integration Method:</strong> Exported as an Android Archive (<code className="text-amber-400 font-mono">unityLibrary</code>) included in <code className="text-amber-400 font-mono">settings.gradle.kts</code>.
            </li>
            <li>
              <strong>Data Bridge:</strong> <code className="text-amber-400 font-mono">UnitySendMessage()</code> relays scenario step completions and score events back to Android Kotlin.
            </li>
          </ul>
        </div>
      </div>

      {/* Android Native Integration Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Android Host & Unity AR Integration Architecture</span>
        </h3>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
          <div className="text-amber-400 font-bold">// 1. settings.gradle.kts (Connecting Unity AR Module)</div>
          <div className="text-slate-400">include(":app")</div>
          <div className="text-slate-400">include(":unityLibrary")</div>
          <div className="text-slate-400">project(":unityLibrary").projectDir = File("../unity_ar_module/unityLibrary")</div>
          <div className="pt-2 text-amber-400 font-bold">// 2. app/build.gradle.kts</div>
          <div className="text-slate-400">dependencies {'{'}</div>
          <div className="text-slate-400">&nbsp;&nbsp;implementation(project(":unityLibrary"))</div>
          <div className="text-slate-400">&nbsp;&nbsp;implementation("com.google.ar:core:1.45.0")</div>
          <div className="text-slate-400">&nbsp;&nbsp;implementation("androidx.room:room-runtime:2.6.1")</div>
          <div className="text-slate-400">{'}'}</div>
        </div>
      </div>

      {/* Physical Device Testing Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>How to Test on a Physical Android Phone</span>
        </h3>

        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
          <li>
            <strong>Open Android Project:</strong> Navigate to the <code className="text-amber-400 font-mono">android/</code> directory in this repository and open in Android Studio.
          </li>
          <li>
            <strong>Enable USB Debugging:</strong> Connect any Android 8.0+ phone with Developer Options enabled.
          </li>
          <li>
            <strong>Install Google Play Services for AR:</strong> Ensure ARCore is present on the physical phone.
          </li>
          <li>
            <strong>Build & Run:</strong> Press <code className="text-amber-400 font-mono">Shift + F10</code> to deploy to the device. Grant camera permission when prompted.
          </li>
          <li>
            <strong>Or Test Browser Simulator:</strong> Open this app directly on mobile Chrome/Firefox over HTTPS to experience the live rear-camera WebRTC AR tracking right now!
          </li>
        </ol>
      </div>
    </div>
  );
};
