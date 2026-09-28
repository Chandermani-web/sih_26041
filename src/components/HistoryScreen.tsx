import React from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { TrainingSessionResult } from '../types';
import { Award, RotateCcw, Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface HistoryScreenProps {
  history: TrainingSessionResult[];
  onViewCertificate: (certId: string) => void;
  onClearHistory: () => void;
  onBackToHome: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onViewCertificate,
  onClearHistory,
  onBackToHome,
}) => {
  const { t } = useLocalization();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white">
            {t.history.title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized offline records & DGMS competency logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 text-slate-400 rounded-xl text-xs font-semibold transition"
            >
              {t.history.clearRecords}
            </button>
          )}
          <button
            onClick={onBackToHome}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-sm text-slate-400">{t.history.emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.sessionId}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md transition hover:border-slate-700"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {record.moduleCode}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      record.isPassed
                        ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/70 border-rose-800 text-rose-300'
                    }`}
                  >
                    {record.isPassed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-400" />
                    )}
                    <span>{record.isPassed ? 'PASSED' : 'FAILED'}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {record.moduleTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(record.completedAt).toLocaleString()}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{record.durationSeconds}s</span>
                  </div>
                  <span>·</span>
                  <span className="font-mono text-slate-500">{record.sessionId}</span>
                </div>
              </div>

              {/* Right Side: Score & Certificate Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Score Achieved
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-bold font-tech ${
                        record.isPassed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {record.totalScore}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                {record.certificateId ? (
                  <button
                    onClick={() => onViewCertificate(record.certificateId!)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/10 shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>{t.history.viewCert}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">No Certificate</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
