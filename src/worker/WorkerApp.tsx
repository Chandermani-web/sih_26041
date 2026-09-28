import React, { useState, useEffect } from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { WorkerLogin } from './WorkerLogin';
import { WorkerHome } from './WorkerHome';
import { WorkerLearningView } from './WorkerLearningView';
import { WorkerARSimulation } from './WorkerARSimulation';
import { WorkerScoreResult } from './WorkerScoreResult';
import { WorkerCertificate } from './WorkerCertificate';
import { localStorageManager } from '../storage/LocalStorageManager';
import { CertificateManager } from '../certificate/CertificateManager';
import { getLocalizedModules } from '../data/modulesData';
import {
  Worker,
  TrainingModule,
  TrainingSessionResult,
  CertificateData,
  LanguageCode,
} from '../types';
import { HardHat, Globe, Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface WorkerAppProps {
  onLogout?: () => void;
}

export const WorkerApp: React.FC<WorkerAppProps> = ({ onLogout }) => {
  const { language, setLanguage, languages } = useLocalization();

  const [currentWorker, setCurrentWorker] = useState<Worker | null>(() =>
    localStorageManager.getCurrentWorker()
  );
  const [activeScreen, setActiveScreen] = useState<
    'login' | 'home' | 'learning' | 'ar_test' | 'result' | 'certificate'
  >(() => (localStorageManager.getCurrentWorker() ? 'home' : 'login'));

  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [testResult, setTestResult] = useState<TrainingSessionResult | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Offline First States
  const [isOffline, setIsOffline] = useState<boolean>(() => localStorageManager.isOfflineMode());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() =>
    localStorageManager.getSyncQueue().length
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Training history & certificates state (synced with storage)
  const [trainingHistory, setTrainingHistory] = useState<TrainingSessionResult[]>(() =>
    localStorageManager.getTrainingHistory()
  );
  const [certificates, setCertificates] = useState<CertificateData[]>(() =>
    localStorageManager.getCertificates()
  );

  useEffect(() => {
    setPendingSyncCount(localStorageManager.getSyncQueue().length);
  }, [trainingHistory]);

  const toggleOfflineMode = () => {
    const next = !isOffline;
    setIsOffline(next);
    localStorageManager.setOfflineMode(next);
  };

  const handleManualSync = () => {
    if (isOffline) {
      // Reconnect online first
      setIsOffline(false);
      localStorageManager.setOfflineMode(false);
    }
    setIsSyncing(true);
    setTimeout(() => {
      const flushed = localStorageManager.flushSyncQueue();
      setPendingSyncCount(0);
      setIsSyncing(false);
      setSyncFeedback(`Successfully synchronized ${flushed} offline assessment(s) to DGMS Central Server.`);
      setTimeout(() => setSyncFeedback(null), 3500);
    }, 1000);
  };

  // Handle Login
  const handleLogin = (worker: Worker) => {
    setCurrentWorker(worker);
    localStorageManager.setCurrentWorker(worker);
    setActiveScreen('home');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentWorker(null);
    localStorageManager.setCurrentWorker(null);
    setActiveScreen('login');
    if (onLogout) {
      onLogout();
    }
  };

  // Select Module -> Step 1: LEARNING
  const handleSelectModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setActiveScreen('learning');
  };

  // Step 2: START AR SIMULATION from Learning
  const handleStartAR = () => {
    if (selectedModule) {
      setActiveScreen('ar_test');
    }
  };

  // Handle Manual AR Test Completion
  const handleFinishTest = async (result: TrainingSessionResult) => {
    setTestResult(result);
    localStorageManager.addTrainingSession(result);
    setTrainingHistory(localStorageManager.getTrainingHistory());
    setPendingSyncCount(localStorageManager.getSyncQueue().length);

    if (result.isPassed) {
      const cert = await CertificateManager.generateCertificate(
        result.workerId,
        result.workerName,
        result.moduleId,
        result.moduleTitle,
        result.moduleCode,
        result.totalScore
      );
      localStorageManager.addCertificate(cert);
      setCertificates(localStorageManager.getCertificates());
      setSelectedCert(cert);
    } else {
      setSelectedCert(null);
    }

    setActiveScreen('result');
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Mobile App Bar (Hidden during full-screen AR test) */}
      {activeScreen !== 'ar_test' && (
        <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-tech font-bold text-sm text-white">AR-SAFE WORKER</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-mono">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Jharkhand Mines Safety Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Online / Offline Toggle Switch */}
            <button
              onClick={toggleOfflineMode}
              title={isOffline ? 'Switch to ONLINE Mode' : 'Switch to OFFLINE Mode'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition ${
                isOffline
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md'
                  : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </button>

            {/* Sync Queue Button (if items pending) */}
            {pendingSyncCount > 0 && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                title="Sync offline records with Central Server"
                className="flex items-center gap-1 px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync ({pendingSyncCount})</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                aria-label="Language"
                className="bg-transparent text-xs text-amber-300 font-medium py-1 px-1 outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Sign Out Button when Worker is logged in */}
            {currentWorker && (
              <button
                onClick={handleLogout}
                title="Sign out of Worker account"
                className="px-2 py-1 bg-slate-950 hover:bg-rose-950/70 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-semibold transition"
              >
                Sign Out
              </button>
            )}
          </div>
        </header>
      )}

      {/* Sync Toast Feedback */}
      {syncFeedback && (
        <div className="bg-emerald-950 border-b border-emerald-500 px-4 py-2 text-center text-xs text-emerald-200 font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Screen Views */}
      <main className="flex-1 flex flex-col">
        {activeScreen === 'login' || !currentWorker ? (
          <WorkerLogin onLogin={handleLogin} />
        ) : activeScreen === 'learning' && selectedModule ? (
          <WorkerLearningView
            module={selectedModule}
            onBack={() => setActiveScreen('home')}
            onStartAR={handleStartAR}
            isOffline={isOffline}
          />
        ) : activeScreen === 'ar_test' && selectedModule ? (
          <WorkerARSimulation
            moduleId={selectedModule.id}
            moduleTitle={selectedModule.title}
            moduleCode={selectedModule.code}
            worker={currentWorker}
            onFinishTest={handleFinishTest}
            onAbort={() => setActiveScreen('home')}
          />
        ) : activeScreen === 'result' && testResult ? (
          <WorkerScoreResult
            result={testResult}
            onRetry={() => {
              if (selectedModule) {
                setActiveScreen('ar_test');
              } else {
                setActiveScreen('home');
              }
            }}
            onViewCertificate={() => {
              if (selectedCert) {
                setActiveScreen('certificate');
              }
            }}
            onReturnHome={() => setActiveScreen('home')}
          />
        ) : activeScreen === 'certificate' && selectedCert ? (
          <WorkerCertificate
            certificate={selectedCert}
            onBack={() => setActiveScreen('home')}
          />
        ) : (
          <WorkerHome
            worker={currentWorker}
            modules={getLocalizedModules(language)}
            trainingHistory={trainingHistory.filter((t) => t.workerId === currentWorker.id)}
            certificates={certificates.filter((c) => c.workerId === currentWorker.id)}
            onStartAR={handleSelectModule}
            onViewCertificate={(cert) => {
              setSelectedCert(cert);
              setActiveScreen('certificate');
            }}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
};
