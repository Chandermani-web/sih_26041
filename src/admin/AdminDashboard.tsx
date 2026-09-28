import React, { useState, useEffect } from 'react';
import { AdminUser, Worker, TrainingSessionResult, CertificateData } from '../types';
import { localStorageManager, DEMO_ADMIN } from '../storage/LocalStorageManager';
import {
  Shield,
  Users,
  Award,
  FileCheck,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  RotateCcw,
  LogOut,
  Building2,
  AlertTriangle,
  QrCode,
  ExternalLink,
} from 'lucide-react';

import { AdminLogin } from './AdminLogin';
import { useLocalization } from '../localization/LocalizationContext';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { language } = useLocalization();
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() =>
    localStorageManager.getCurrentAdmin()
  );

  // Real-time data from storage
  const [workers, setWorkers] = useState<Worker[]>(() =>
    localStorageManager.getRegisteredWorkers()
  );
  const [history, setHistory] = useState<TrainingSessionResult[]>(() =>
    localStorageManager.getTrainingHistory()
  );
  const [certificates, setCertificates] = useState<CertificateData[]>(() =>
    localStorageManager.getCertificates()
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'workers' | 'logs' | 'certificates'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateData | null>(null);

  // Sync data every 2 seconds to reflect tests taken in worker app
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers(localStorageManager.getRegisteredWorkers());
      setHistory(localStorageManager.getTrainingHistory());
      setCertificates(localStorageManager.getCertificates());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    localStorageManager.setCurrentAdmin(null);
    if (onLogout) {
      onLogout();
    }
  };

  // KPIs
  const totalTests = history.length;
  const passedTests = history.filter((h) => h.isPassed).length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  const averageScore =
    totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.totalScore, 0) / totalTests) : 0;

  // Filtered workers
  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.mineSite.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered logs
  const filteredLogs = history.filter(
    (l) =>
      l.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in as Admin, show Admin Login Portal
  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <AdminLogin
          onLogin={(admin) => {
            setCurrentAdmin(admin);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech font-bold text-base text-white">AR-SAFE ADMIN</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                DGMS MONITORING
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Jharkhand Directorate General of Mines Safety Regulatory System
            </p>
          </div>
        </div>

        {/* Admin User Badge & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">{currentAdmin.name}</p>
            <p className="text-[10px] text-amber-400 font-mono">
              {language === 'hi' ? 'खान सुरक्षा निदेशक, झारखंड' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱭᱨᱮᱠᱴᱚᱨ' : currentAdmin.designation}
            </p>
          </div>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'साइन आउट' : language === 'sat' ? 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* Admin Tab Navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? 'अवलोकन एवं मेट्रिक्स' : language === 'sat' ? 'ᱢᱩᱬᱩᱛ ᱨᱮᱠᱚᱨᱰ' : 'Overview & Metrics'}
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'workers'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? `पंजीकृत श्रमिक (${workers.length})` : language === 'sat' ? `ᱠᱟᱹᱢᱤᱭᱟᱹ ᱨᱮᱡᱤᱥᱴᱟᱨ (${workers.length})` : `Registered Workers (${workers.length})`}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'logs'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? `लाइव परीक्षण रिकॉर्ड (${history.length})` : language === 'sat' ? `ᱵᱤᱱᱤᱰ ᱨᱮᱠᱚᱨᱰ (${history.length})` : `Live Test Logs (${history.length})`}
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'certificates'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? `जारी प्रमाणपत्र (${certificates.length})` : language === 'sat' ? `ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱚ (${certificates.length})` : `Issued Certificates (${certificates.length})`}
          </button>
        </div>

        {/* Live sync heartbeat */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{language === 'hi' ? 'रीयल-टाइम सिंक सक्रिय' : language === 'sat' ? 'ᱥᱤᱝᱠ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ' : 'Real-Time Sync Active'}</span>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: OVERVIEW & REAL-TIME KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  {language === 'hi' ? 'कुल पंजीकृत श्रमिक' : language === 'sat' ? 'ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ' : 'Registered Workers'}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-tech text-white">
                    {workers.length}
                  </span>
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  {language === 'hi' ? 'बोकारो, धनबाद एवं रांची खदान' : language === 'sat' ? 'ᱵᱚᱠᱟᱨᱳ, ᱫᱷᱟᱱᱵᱟᱫᱽ, ᱨᱟᱺᱪᱤ' : 'Bokaro, Dhanbad & Ranchi Mines'}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  {language === 'hi' ? 'वास्तविक AR परीक्षण' : language === 'sat' ? 'AR ᱵᱤᱱᱤᱰ ᱮᱞ' : 'Actual AR Tests Taken'}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-tech text-amber-400">
                    {totalTests}
                  </span>
                  <FileCheck className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  {totalTests === 0
                    ? (language === 'hi' ? 'अभी तक कोई परीक्षण नहीं हुआ' : language === 'sat' ? 'ᱱᱤᱛᱚᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱵᱟᱝ ᱦᱩᱭ ᱟᱠᱟᱱᱟ' : 'No tests performed yet')
                    : (language === 'hi' ? 'वास्तविक मैनुअल ड्रिल रिकॉर्ड' : language === 'sat' ? 'ᱥᱟᱹᱨᱤ ᱵᱤᱱᱤᱰ ᱨᱮᱠᱚᱨᱰ' : 'Real manual drills recorded')}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  {language === 'hi' ? 'दक्षता उत्तीर्णता दर' : language === 'sat' ? 'ᱯᱟᱥ ᱦᱟᱨ' : 'Competency Pass Rate'}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-tech text-emerald-400">
                    {passRate}%
                  </span>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  {language === 'hi' ? 'DGMS न्यूनतम मानक: 80%' : language === 'sat' ? 'DGMS ᱢᱟᱱᱚᱠ: ᱘᱐%' : 'DGMS Benchmark Threshold: 80%'}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  {language === 'hi' ? 'उत्पन्न डिजिटल प्रमाणपत्र' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱞ' : 'Certificates Generated'}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-tech text-white">
                    {certificates.length}
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  {language === 'hi' ? 'QR कोड द्वारा सत्यापन योग्य' : language === 'sat' ? 'QR ᱠᱳᱰ ᱛᱮ ᱥᱟᱹᱵᱤᱛᱚᱜ-ᱟ' : 'Verifiable via QR Code'}
                </span>
              </div>
            </div>

            {/* Recent Actual Test Results Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Recent AR Test Submissions</h3>
                  <p className="text-xs text-slate-400">
                    Live stream of practical safety tests submitted by workers
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs font-semibold text-amber-400 hover:underline"
                >
                  View Full Logs
                </button>
              </div>

              {history.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    No actual tests submitted yet.
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Open the Worker App, start an AR simulation, complete the manual actions, and the real score will appear here automatically!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {history.slice(0, 5).map((h) => (
                    <div key={h.sessionId} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-xs text-white">{h.workerName}</span>
                          <span className="text-[10px] font-mono text-slate-400">({h.workerId})</span>
                        </div>
                        <p className="text-xs text-slate-300">{h.moduleTitle}</p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(h.completedAt).toLocaleString()} · Duration: {h.durationSeconds}s
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-medium block">
                            Score
                          </span>
                          <span
                            className={`font-mono font-bold text-sm ${
                              h.isPassed ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {h.totalScore}/100
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            h.isPassed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {h.isPassed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED WORKERS */}
        {activeTab === 'workers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Registered Mining Workers</h3>
                <p className="text-xs text-slate-400">
                  Worker identities, assignments, and practical compliance state
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workers by name, ID..."
                  className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Worker ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Trade & Role</th>
                    <th className="p-3">Mine Location</th>
                    <th className="p-3">Completed Drills</th>
                    <th className="p-3">Certificates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredWorkers.map((w) => {
                    const workerTests = history.filter((h) => h.workerId === w.id);
                    const workerCerts = certificates.filter((c) => c.workerId === w.id);

                    return (
                      <tr key={w.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">{w.id}</td>
                        <td className="p-3 font-bold text-white">{w.name}</td>
                        <td className="p-3 text-slate-300">{w.role}</td>
                        <td className="p-3 text-slate-400">{w.mineSite}</td>
                        <td className="p-3">
                          {workerTests.length === 0 ? (
                            <span className="text-slate-500 italic">Not tested yet</span>
                          ) : (
                            <span className="font-mono text-emerald-400">
                              {workerTests.filter((t) => t.isPassed).length} Passed / {workerTests.length} Attempts
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {workerCerts.length === 0 ? (
                            <span className="text-slate-500 italic">None</span>
                          ) : (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono text-[11px]">
                              {workerCerts.length} Issued
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE TEST LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Practical AR Test Audit Logs</h3>
              <p className="text-xs text-slate-400">
                Detailed record of worker manual actions, point penalties, and duration
              </p>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400">No test records matching query.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.sessionId}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{log.workerName}</span>
                          <span className="text-xs font-mono text-amber-400">({log.workerId})</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs font-semibold text-slate-300">{log.moduleTitle}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Session: {log.sessionId} · Date: {new Date(log.completedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            log.isPassed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          Score: {log.totalScore}/100 ({log.isPassed ? 'PASSED' : 'FAILED'})
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {log.actions.map((act) => (
                        <div
                          key={act.id}
                          className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-200 text-[11px]">
                              Step {act.stepNumber}: {act.stepTitle}
                            </span>
                            <span
                              className={`font-mono font-bold text-[10px] ${
                                act.awardedPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {act.awardedPoints >= 0 ? `+${act.awardedPoints}` : act.awardedPoints}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{act.actionTaken}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ISSUED CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Digital Competency Certificates Registry</h3>
              <p className="text-xs text-slate-400">
                Official certificates awarded to workers upon scoring 80+ in practical AR tests
              </p>
            </div>

            {certificates.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl">
                <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No certificates issued yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Certificates are automatically generated when a worker scores 80/100 or above in the AR test.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.certificateId}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {cert.certificateId}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                          {cert.score}/100
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{cert.workerName}</h4>
                      <p className="text-xs text-slate-400 font-mono">{cert.workerId}</p>

                      <div className="mt-3 p-2 bg-slate-900 rounded-lg text-xs text-slate-300">
                        <span className="block font-semibold text-slate-200">{cert.moduleTitle}</span>
                        <span className="text-[10px] text-slate-500">
                          Issued: {new Date(cert.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        {cert.status === 'VALID' ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valid (Active)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Revoked</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const newStatus = cert.status === 'VALID' ? 'REVOKED' : 'VALID';
                            localStorageManager.updateCertificateStatus(cert.certificateId, newStatus);
                            setCertificates(localStorageManager.getCertificates());
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition border ${
                            cert.status === 'VALID'
                              ? 'bg-rose-950/40 hover:bg-rose-950 border-rose-800 text-rose-300'
                              : 'bg-emerald-950/40 hover:bg-emerald-950 border-emerald-800 text-emerald-300'
                          }`}
                        >
                          {cert.status === 'VALID' ? 'Revoke' : 'Re-Activate'}
                        </button>
                        <button
                          onClick={() => setSelectedCertForModal(cert)}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition"
                        >
                          Inspect QR
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* QR Code Inspection Modal */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Certificate QR Verification</h3>
            <p className="text-xs font-mono text-amber-400 mb-4">{selectedCertForModal.certificateId}</p>

            {selectedCertForModal.qrCodeDataUrl ? (
              <img
                src={selectedCertForModal.qrCodeDataUrl}
                alt="QR Code"
                className="w-48 h-48 bg-white p-2 rounded-2xl mx-auto mb-4 shadow-md"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-950 rounded-2xl mx-auto flex items-center justify-center text-slate-600 mb-4">
                <QrCode className="w-16 h-16" />
              </div>
            )}

            <p className="text-xs text-slate-300 font-semibold">{selectedCertForModal.workerName}</p>
            <p className="text-[11px] text-slate-400 mb-3">{selectedCertForModal.moduleTitle}</p>

            <div className="flex flex-col gap-2">
              <a
                href={`#verify/${selectedCertForModal.certificateId}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>Open in Public Verification Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedCertForModal(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
