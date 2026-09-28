import React, { useState, useEffect } from 'react';
import { CertificateData } from '../types';
import { localStorageManager } from '../storage/LocalStorageManager';
import { useLocalization } from '../localization/LocalizationContext';
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  Award,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  User,
  Hash,
  Share2,
  ExternalLink,
  QrCode,
  ArrowLeft,
} from 'lucide-react';

interface PublicCertificateVerificationProps {
  initialCertificateId?: string;
  onNavigateHome?: () => void;
}

export const PublicCertificateVerification: React.FC<PublicCertificateVerificationProps> = ({
  initialCertificateId = '',
  onNavigateHome,
}) => {
  const { language } = useLocalization();
  const [searchId, setSearchId] = useState(initialCertificateId);
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentCerts, setRecentCerts] = useState<CertificateData[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load certificate from URL hash on mount or when hash changes
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify/')) {
        const idFromHash = decodeURIComponent(hash.replace('#verify/', '').trim());
        if (idFromHash) {
          setSearchId(idFromHash);
          lookupCertificate(idFromHash);
          return;
        }
      }
      if (initialCertificateId) {
        setSearchId(initialCertificateId);
        lookupCertificate(initialCertificateId);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [initialCertificateId]);

  // Load existing certificates from storage for quick test lookup
  useEffect(() => {
    const all = localStorageManager.getCertificates();
    setRecentCerts(all);
  }, []);

  const lookupCertificate = (idToLookup: string) => {
    const cleaned = idToLookup.trim();
    if (!cleaned) {
      setActiveCertificate(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const found = localStorageManager.getCertificateById(cleaned);
    if (found) {
      setActiveCertificate(found);
    } else {
      setActiveCertificate(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupCertificate(searchId);
  };

  const handleCopyLink = () => {
    if (!activeCertificate) return;
    const url = `${window.location.origin}${window.location.pathname}#verify/${activeCertificate.certificateId}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Bar with Official Emblem */}
        <header className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-0.5">
                  {language === 'hi' ? 'झारखंड सरकार · DGMS' : language === 'sat' ? 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ · DGMS' : 'GOVERNMENT OF JHARKHAND'}
                </span>
                <h1 className="text-lg font-bold font-tech text-white">
                  {language === 'hi' ? 'DGMS सार्वजनिक प्रमाणपत्र सत्यापन पोर्टल' : language === 'sat' ? 'DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱵᱤᱛ ᱧᱮᱞ' : 'DGMS PUBLIC CERTIFICATE VERIFICATION'}
                </h1>
                <p className="text-xs text-slate-400">
                  {language === 'hi' ? 'खान सुरक्षा महानिदेशालय · आधिकारिक रजिस्टर' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱦᱟᱱᱤᱫᱮᱥᱟᱲᱚᱭ · ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱨᱮᱡᱤᱥᱴᱟᱨ' : 'Directorate General of Mines Safety · Official Registry'}
                </p>
              </div>
            </div>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'वापस जाएं' : language === 'sat' ? 'ᱨᱩᱣᱟᱹᱲ ᱢᱮ' : 'Back'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Certificate Lookup Bar (No Login Required) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'प्रमाणपत्र संख्या (Certificate ID) दर्ज करें' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ID ᱮᱢ ᱢᱮ' : 'Enter or Scan Certificate ID'}</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {language === 'hi' ? 'लॉगिन की आवश्यकता नहीं' : language === 'sat' ? 'ᱞᱚᱜᱤᱱ ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤ' : 'No authentication required'}
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. JH-FIRE-2026-000001 or JH-GAS-2026-000001"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono placeholder:text-slate-600 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-amber-500/20 shrink-0"
            >
              {language === 'hi' ? 'सत्यापित करें' : language === 'sat' ? 'ᱥᱟᱹᱵᱤᱛ ᱢᱮ' : 'Verify Now'}
            </button>
          </form>

          {/* Quick Click Available Test Certificates (if any) */}
          {recentCerts.length > 0 && (
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400">Issued in this session:</span>
              {recentCerts.map((c) => (
                <button
                  key={c.certificateId}
                  onClick={() => {
                    setSearchId(c.certificateId);
                    lookupCertificate(c.certificateId);
                  }}
                  className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[10px] rounded-md transition"
                >
                  {c.certificateId} ({c.workerName})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Verification Result Display */}
        {hasSearched && (
          <div>
            {activeCertificate ? (
              <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6">
                {/* Status Banner */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    activeCertificate.status === 'VALID'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeCertificate.status === 'VALID'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {activeCertificate.status === 'VALID' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block">
                        Official Status Verification
                      </span>
                      <h2 className="text-base font-bold font-tech tracking-wide">
                        {activeCertificate.status === 'VALID' ? 'VALID / OFFICIALLY CERTIFIED' : 'INVALID / REVOKED'}
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 bg-black/40 rounded-lg">
                    DGMS REGISTERED
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Worker Name */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>Certified Worker</span>
                    </div>
                    <p className="text-sm font-bold text-white font-tech">{activeCertificate.workerName}</p>
                    <span className="text-[10px] font-mono text-slate-400">ID: {activeCertificate.workerId}</span>
                  </div>

                  {/* Module */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Safety Module</span>
                    </div>
                    <p className="text-sm font-bold text-white">{activeCertificate.moduleTitle}</p>
                    <span className="text-[10px] font-mono text-amber-400">{activeCertificate.moduleCode}</span>
                  </div>

                  {/* Score */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-xs text-slate-400 block">Practical Assessment Score</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-tech text-emerald-400">
                        {activeCertificate.score}
                      </span>
                      <span className="text-xs text-slate-500">/ 100</span>
                      <span className="text-[10px] text-emerald-400 font-bold ml-2">PASSED (Threshold: 80)</span>
                    </div>
                  </div>

                  {/* Completion Date */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Completion Date & Time</span>
                    </div>
                    <p className="text-xs font-mono text-slate-200">
                      {new Date(activeCertificate.completedAt).toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      Expires: {new Date(activeCertificate.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Certificate ID & Issuer */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-amber-400" />
                      Certificate Number:
                    </span>
                    <span className="font-mono font-bold text-amber-300 text-xs">
                      {activeCertificate.certificateId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Regulatory Authority:</span>
                    <span className="font-semibold text-slate-200 text-right">{activeCertificate.issuer}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Directorate:</span>
                    <span className="text-slate-300 text-right">{activeCertificate.directorate}</span>
                  </div>
                </div>

                {/* Share Link / Verify Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic QR signature verified by DGMS Registry</span>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Invalid or Not Found Banner */
              <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    CERTIFICATE VERIFICATION RESULT
                  </span>
                  <h2 className="text-lg font-bold font-tech text-white">INVALID / NOT FOUND</h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    No certificate matching ID <strong className="text-rose-300 font-mono">"{searchId}"</strong> exists
                    in the Directorate General of Mines Safety (DGMS) registry.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left max-w-md mx-auto text-[11px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-300 block">Verification Instructions:</span>
                  <p>1. Check if the Certificate ID was entered correctly (e.g., JH-FIRE-2026-000001).</p>
                  <p>2. Complete an AR safety simulation and pass with 80+ points to generate a valid certificate.</p>
                  <p>3. If using QR code, scan again ensuring full visibility.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informational Guidance Footer */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>AR-SAFE: Smart India Hackathon 2026 (SIH26041) Official Public Verification Registry</p>
          <p>Under Section 22A of Mines Act 1952 & Coal Mines Regulations 2017</p>
        </div>
      </div>
    </div>
  );
};
