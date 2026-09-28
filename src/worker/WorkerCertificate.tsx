import React, { useRef } from 'react';
import { CertificateData } from '../types';
import { useLocalization } from '../localization/LocalizationContext';
import { Award, ArrowLeft, Download, Printer, CheckCircle2, Shield, QrCode } from 'lucide-react';

interface WorkerCertificateProps {
  certificate: CertificateData;
  onBack: () => void;
}

export const WorkerCertificate: React.FC<WorkerCertificateProps> = ({ certificate, onBack }) => {
  const { t, language } = useLocalization();
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `Certificate_${certificate.certificateId}.txt`;
    link.href =
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(
        `GOVERNMENT OF JHARKHAND - DGMS SAFETY COMPETENCY CERTIFICATE\n` +
          `Certificate ID: ${certificate.certificateId}\n` +
          `Worker: ${certificate.workerName} (${certificate.workerId})\n` +
          `Module: ${certificate.moduleTitle}\n` +
          `Score: ${certificate.score}/100 (PASSED)\n` +
          `Completed: ${certificate.completedAt}\n` +
          `Verification URL: ${certificate.verificationUrl}\n`
      );
    link.click();
  };

  const backHomeBtn = language === 'hi'
    ? 'होम पर वापस जाएं'
    : language === 'sat'
    ? 'ᱢᱩᱬᱩᱛ ᱥᱟᱦᱴᱟ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ'
    : 'Back to Home';

  const downloadBtn = language === 'hi'
    ? 'डाउनलोड'
    : language === 'sat'
    ? 'ᱰᱟᱣᱩᱱᱞᱳᱰ'
    : 'Download';

  const printBtn = language === 'hi'
    ? 'प्रिंट करें'
    : language === 'sat'
    ? 'ᱯᱨᱤᱱᱴ ᱢᱮ'
    : 'Print';

  const certTitle = language === 'hi'
    ? 'डिजिटल सुरक्षा सक्षमता प्रमाणपत्र'
    : language === 'sat'
    ? 'ᱰᱤᱡᱤᱴᱟᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱹᱵᱤᱛ ᱥᱟᱠᱟᱢ'
    : 'SAFETY COMPETENCY CERTIFICATE';

  const certifiesText = language === 'hi'
    ? 'यह आधिकारिक रूप से प्रमाणित किया जाता है कि'
    : language === 'sat'
    ? 'ᱱᱚᱶᱟ ᱫᱚ ᱥᱟᱹᱨᱤ ᱞᱮᱠᱟᱛᱮ ᱥᱟᱹᱵᱤᱛᱚᱜ ᱠᱟᱱᱟ ᱡᱮ'
    : 'This is to officially certify that';

  const demonstratedText = language === 'hi'
    ? 'ने ऑगमेंटेड रियलिटी (AR) सिमुलेशन में व्यावहारिक सुरक्षा सक्षमता सफलतापूर्वक प्रदर्शित की है:'
    : language === 'sat'
    ? 'AR ᱥᱤᱢᱩᱞᱮᱴᱚᱨ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱱᱤᱰ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱟᱥ ᱟᱠᱟᱱᱟᱭ:'
    : 'has demonstrated practical competency in Augmented Reality simulation for:';

  const verifiedScoreLabel = language === 'hi'
    ? 'प्रमाणित स्कोर'
    : language === 'sat'
    ? 'ᱥᱟᱹᱵᱤᱛ ᱮᱞ'
    : 'Verified Score';

  const dateOfIssueLabel = language === 'hi'
    ? 'जारी करने की तिथि'
    : language === 'sat'
    ? 'ᱮᱢ ᱟᱠᱟᱱ ᱢᱟᱹᱦᱤᱛ'
    : 'Date of Issue';

  const scanVerifyText = language === 'hi'
    ? 'ऑनलाइन सत्यापन हेतु स्कैन करें'
    : language === 'sat'
    ? 'ᱥᱟᱹᱵᱤᱛ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱥᱠᱮᱱ ᱢᱮ'
    : 'Scan to verify';

  const signatureTitle = language === 'hi'
    ? 'खान सुरक्षा निदेशक, झारखंड'
    : language === 'sat'
    ? 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱭᱨᱮᱠᱴᱚᱨ'
    : 'Director of Mines Safety';

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backHomeBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadBtn}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{printBtn}</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div
        ref={certRef}
        className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100 print:bg-white print:text-black print:border-black"
      >
        <div className="absolute inset-2 border border-dashed border-amber-500/20 rounded-2xl pointer-events-none" />

        {/* Top Directorate Header */}
        <div className="text-center relative z-10 mb-6 pb-4 border-b border-amber-500/20">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-2">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 block mb-0.5">
            {language === 'hi' ? 'झारखंड सरकार' : language === 'sat' ? 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ' : 'GOVERNMENT OF JHARKHAND'}
          </span>
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            {language === 'hi' ? 'खान सुरक्षा महानिदेशालय (DGMS)' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱦᱟᱱᱤᱫᱮᱥᱟᱲᱚᱭ' : 'DIRECTORATE GENERAL OF MINES SAFETY (DGMS)'}
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {language === 'hi' ? 'खनन एवं औद्योगिक सुरक्षा प्रशिक्षण प्रभाग · रांची' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱟᱹᱴᱤᱧ · ᱨᱟᱺᱪᱤ' : 'Heavy Mining & Industrial Safety Training Cell · Ranchi'}
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-base font-extrabold font-tech text-white uppercase tracking-wider">
            {certTitle}
          </h1>
        </div>

        {/* Body Text */}
        <div className="text-center space-y-3 mb-6 relative z-10 text-xs">
          <p className="text-slate-400 italic text-[11px]">{certifiesText}</p>

          <div className="py-1 border-b border-amber-500/30 max-w-xs mx-auto">
            <h3 className="text-xl font-bold font-tech text-amber-300">
              {certificate.workerName}
            </h3>
            <span className="text-[11px] font-mono text-slate-400 block">
              {language === 'hi' ? 'श्रमिक ID:' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ID:' : 'Worker ID:'}{' '}
              <strong className="text-slate-200">{certificate.workerId}</strong>
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {demonstratedText}
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <h4 className="text-xs font-bold text-white">{certificate.moduleTitle}</h4>
            <span className="text-[10px] font-mono text-amber-400">
              DGMS Ref: {certificate.moduleCode}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">{verifiedScoreLabel}</span>
              <span className="text-sm font-bold font-tech text-emerald-400">
                {certificate.score} / 100 ({language === 'hi' ? 'उत्तीर्ण' : language === 'sat' ? 'ᱯᱟᱥ' : 'PASSED'})
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block">{dateOfIssueLabel}</span>
              <span className="text-[11px] font-mono text-slate-300">
                {new Date(certificate.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom QR Code & Signatures */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 items-end relative z-10">
          {/* QR Code */}
          <div className="flex items-center gap-2">
            <a
              href={`#verify/${certificate.certificateId}`}
              className="p-1.5 bg-white rounded-lg block shadow-sm border border-slate-200"
              title="Click to open public verification page"
            >
              <QrCode className="w-10 h-10 text-slate-950" />
            </a>
            <div>
              <span className="text-[10px] font-mono text-amber-400 block font-bold">
                {certificate.certificateId}
              </span>
              <span className="text-[9px] text-slate-400">{scanVerifyText}</span>
            </div>
          </div>

          {/* Signature */}
          <div className="text-right">
            <div className="inline-block border-b border-slate-600 pb-1 mb-1 font-signature text-amber-300 text-sm italic">
              R. Soren
            </div>
            <span className="text-[10px] font-bold text-slate-300 block">{signatureTitle}</span>
            <span className="text-[9px] text-slate-500 font-mono">
              Govt. of Jharkhand · DGMS CMR-2017
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
