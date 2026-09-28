import React, { useRef } from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { CertificateData } from '../types';
import { Shield, Award, Download, Printer, ArrowLeft, CheckCircle2, QrCode } from 'lucide-react';

interface CertificateViewProps {
  certificate: CertificateData;
  onBack: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onBack }) => {
  const { t } = useLocalization();
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate image download via canvas or fallback
    const link = document.createElement('a');
    link.download = `Certificate_${certificate.certificateId}.txt`;
    link.href =
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(
        `GOVERNMENT OF JHARKHAND - DGMS SAFETY CERTIFICATE\n` +
          `Certificate ID: ${certificate.certificateId}\n` +
          `Worker Name: ${certificate.workerName} (${certificate.workerId})\n` +
          `Module: ${certificate.moduleTitle}\n` +
          `Score: ${certificate.score}/100\n` +
          `Issued: ${certificate.completedAt}\n` +
          `Verification URL: ${certificate.verificationUrl}\n`
      );
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Action Header */}
      <div className="flex items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.certificate.backBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span>{t.certificate.downloadBtn}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>{t.certificate.printBtn}</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div
        ref={certRef}
        className="bg-slate-900 border-4 border-amber-500/40 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-slate-100 print:bg-white print:text-black print:border-black"
      >
        {/* Subtle Decorative Guilloche / Seal Border */}
        <div className="absolute inset-2 border-2 border-dashed border-amber-500/30 rounded-2xl pointer-events-none" />

        {/* Certificate Watermark Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Shield className="w-96 h-96" />
        </div>

        {/* Top Directorate Header */}
        <div className="text-center relative z-10 mb-8 pb-6 border-b border-amber-500/20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-7 h-7" />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-400 block mb-1">
            {t.certificate.header}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-200">
            {t.certificate.subHeader}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {t.certificate.directorate} · {t.certificate.stateName}
          </p>
        </div>

        {/* Main Certificate Title */}
        <div className="text-center mb-8 relative z-10">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">
            Official Competency Record
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold font-tech text-white tracking-wide uppercase">
            {t.certificate.title}
          </h1>
        </div>

        {/* Body Text */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10 relative z-10">
          <p className="text-xs sm:text-sm text-slate-300 italic">
            {t.certificate.certifiesThat}
          </p>

          <div className="py-2 border-b-2 border-amber-500/40 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold font-tech text-amber-300 tracking-wider">
              {certificate.workerName}
            </h3>
            <span className="text-xs font-mono text-slate-400 mt-1 block">
              {t.certificate.workerId}: <span className="text-slate-200 font-bold">{certificate.workerId}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            {t.certificate.hasCompleted}
          </p>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 max-w-lg mx-auto">
            <h4 className="text-sm sm:text-base font-bold text-white">
              {certificate.moduleTitle}
            </h4>
            <span className="text-xs font-mono text-amber-400">
              DGMS Module Ref: {certificate.moduleCode}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <div>
              <span className="text-[11px] text-slate-400 block">{t.certificate.scoreAchieved}</span>
              <span className="text-lg font-bold font-tech text-emerald-400">
                {certificate.score} / 100 (PASSED)
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[11px] text-slate-400 block">{t.certificate.issuedOn}</span>
              <span className="text-xs font-mono font-medium text-slate-200">
                {new Date(certificate.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Verification & Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 items-end relative z-10">
          {/* QR Code Verification */}
          <div className="flex items-center gap-3">
            {certificate.qrCodeDataUrl ? (
              <img
                src={certificate.qrCodeDataUrl}
                alt="Verification QR Code"
                className="w-20 h-20 bg-white p-1 rounded-xl shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                <QrCode className="w-8 h-8" />
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                Digital Verification
              </span>
              <p className="text-[10px] text-slate-400 leading-tight">
                Scan to verify on Jharkhand Mining Safety portal
              </p>
              <span className="text-[9px] font-mono text-slate-500 mt-1 block break-all">
                {certificate.verificationUrl}
              </span>
            </div>
          </div>

          {/* Certificate ID & Validity Badge */}
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              {t.certificate.certificateId}
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 inline-block">
              {certificate.certificateId}
            </span>
            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 mt-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t.certificate.validity}</span>
            </div>
          </div>

          {/* Authorized Signatory */}
          <div className="text-center sm:text-right">
            <div className="border-b border-slate-700 pb-1 mb-1 max-w-[160px] ml-auto">
              <span className="font-serif italic text-amber-300 text-sm tracking-wide">
                Dr. A. K. Soren
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-200 block">
              {t.certificate.authorizedSignatory}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Govt. of Jharkhand
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
