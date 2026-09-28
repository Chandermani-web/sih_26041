import React, { useState } from 'react';
import { TrainingModule } from '../types';
import { localStorageManager } from '../storage/LocalStorageManager';
import { useLocalization } from '../localization/LocalizationContext';
import {
  Flame,
  ShieldAlert,
  ArrowLeft,
  Play,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  Wind,
  ShieldCheck,
  Eye,
  Bell,
  LogOut,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';

interface WorkerLearningViewProps {
  module: TrainingModule;
  onBack: () => void;
  onStartAR: () => void;
  isOffline: boolean;
}

export const WorkerLearningView: React.FC<WorkerLearningViewProps> = ({
  module,
  onBack,
  onStartAR,
  isOffline,
}) => {
  const { t, language } = useLocalization();
  const isFire = module.id === 'fire-explosion';
  const [downloaded, setDownloaded] = useState(() =>
    localStorageManager.getDownloadedModules().includes(module.id)
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sop' | 'equipment' | 'evacuation' | 'regulations'>('sop');

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      localStorageManager.setModuleDownloaded(module.id, true);
      setDownloaded(true);
      setIsDownloading(false);
    }, 800);
  };

  const backText = language === 'hi'
    ? 'मॉड्यूल सूची पर वापस जाएं'
    : language === 'sat'
    ? 'ᱢᱚᱰᱭᱩᱞ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ'
    : 'Back to Modules';

  const offlineReadyText = language === 'hi'
    ? 'ऑफलाइन तैयार'
    : language === 'sat'
    ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱟᱯᱲᱟᱣ'
    : 'Offline Ready';

  const downloadText = language === 'hi'
    ? (isDownloading ? 'डाउनलोड हो रहा है...' : 'ऑफलाइन डाउनलोड करें')
    : language === 'sat'
    ? (isDownloading ? 'ᱰᱟᱣᱩᱱᱞᱳᱰ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...' : 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ')
    : (isDownloading ? 'Downloading Pack...' : 'Download for Offline');

  const tabSOP = language === 'hi' ? 'आपातकालीन SOP' : language === 'sat' ? 'ᱟᱯᱚᱛᱠᱟᱞ SOP' : 'Emergency SOP';
  const tabEquip = language === 'hi' ? 'सुरक्षा उपकरण' : language === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ' : 'Equipment';
  const tabEvac = language === 'hi' ? 'सुरक्षित निकासी' : language === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ' : 'Evacuation';
  const tabRules = language === 'hi' ? 'DGMS नियम' : language === 'sat' ? 'DGMS ᱟᱹᱭᱤᱱ' : 'DGMS Rules';

  const realEnvTitle = language === 'hi'
    ? 'वास्तविक परिवेश में व्यावहारिक परीक्षण'
    : language === 'sat'
    ? 'ᱥᱟᱹᱨᱤ ᱚᱛ ᱨᱮ AR ᱵᱤᱱᱤᱰ'
    : 'Real Environment Practical Test';

  const realEnvDesc = language === 'hi'
    ? 'कैमरा वास्तविक भौतिक कमरे को खोलता है · 5 संवादात्मक चरण · उत्तीर्ण अंक: 80/100'
    : language === 'sat'
    ? 'ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱕ ᱛᱷᱟᱨ ᱨᱮᱱᱟᱜ ᱵᱤᱱᱤᱰ · ᱯᱟᱥ ᱮᱞ: ᱘᱐/᱑᱐᱐'
    : 'Camera opens real physical room · 5 interactive physical stages · Pass mark: 80/100';

  const launchARBtn = language === 'hi'
    ? 'रियल कैमरा AR सिमुलेशन प्रारंभ करें'
    : language === 'sat'
    ? 'ᱥᱟᱹᱨᱤ ᱠᱮᱢᱮᱨᱟ AR ᱥᱤᱢᱩᱞᱮᱴᱚᱨ ᱮᱦᱚᱵ ᱢᱮ'
    : 'Launch Real Camera AR Simulation';

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backText}</span>
        </button>

        <div className="flex items-center gap-2">
          {downloaded ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded-lg font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>{offlineReadyText}</span>
            </span>
          ) : (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/30 transition"
            >
              <DownloadCloud className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{downloadText}</span>
            </button>
          )}
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
              isFire
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isFire ? <Flame className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                {module.code}
              </span>
              <span className="text-[10px] text-slate-400">{module.dgmsStandard}</span>
            </div>
            <h1 className="text-base font-bold text-white mt-1">{module.title}</h1>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{module.shortDesc}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 mt-4 pt-3 border-t border-slate-800 text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab('sop')}
            className={`py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'sop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tabSOP}
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'equipment' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tabEquip}
          </button>
          <button
            onClick={() => setActiveTab('evacuation')}
            className={`py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'evacuation' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tabEvac}
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'regulations' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tabRules}
          </button>
        </div>
      </div>

      {/* Learning Content Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Tab 1: Emergency SOP */}
        {activeTab === 'sop' && (
          <div className="space-y-3.5 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{t.modules.objectivesTitle}</span>
            </h3>

            <div className="space-y-2">
              {module.objectives.map((obj, i) => (
                <div key={obj.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 block">{i + 1}. {obj.title}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{obj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Equipment */}
        {activeTab === 'equipment' && (
          <div className="space-y-3.5 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{t.modules.precautionsTitle}</span>
            </h3>

            <div className="space-y-2">
              {module.safetyPrecautions.map((prec, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-[11px] leading-relaxed">{prec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Evacuation */}
        {activeTab === 'evacuation' && (
          <div className="space-y-3.5 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>{language === 'hi' ? 'आपातकालीन निकास मार्ग एवं सुरक्षित क्षेत्र' : language === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱟᱨ ᱥᱮᱯᱷ ᱡᱳᱱ' : 'Evacuation Route & Safe Muster Zones'}</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">
                  {language === 'hi' ? 'इनटेक एयरवे (स्वच्छ हवा की दिशा) में निकासी' : language === 'sat' ? 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱥᱮᱫ ᱛᱮ ᱫᱟᱹᱲ' : 'Upwind / Intake Airway Travel'}
                </span>
                <p className="text-[11px] text-slate-300">
                  {language === 'hi' ? 'हमेशा धुएं और गैस के विपरीत इनटेक एयरवे की दिशा में चलें जहां मुख्य पंखों द्वारा खदान में ताजा स्वच्छ हवा आ रही हो।' : language === 'sat' ? 'ᱥᱟᱨᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱫᱷᱩᱶᱟᱹ ᱟᱨ ᱵᱤᱥ ᱜᱮᱥ ᱩᱞᱴᱟᱹ ᱥᱮᱫ ᱛᱮ ᱫᱟᱹᱲ ᱢᱮ ᱡᱟᱦᱟᱸ ᱨᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ᱾' : 'Always evacuate against the smoke and gas migration direction into the Intake Airway where fresh positive-pressure air is being forced into the mine by main ventilation fans.'}
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">
                  {language === 'hi' ? 'भूमिगत सुरक्षित मस्टर चैंबर' : language === 'sat' ? 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ' : 'Underground Safe Muster Chamber'}
                </span>
                <p className="text-[11px] text-slate-300">
                  {language === 'hi' ? 'ऑक्सीजन सिलिंडर, कार्बन डाइऑक्साइड स्क्रबर और सरफेस कंट्रोल रूम से जुड़ी आपातकालीन टेलीफोन लाइनों से लैस सीलबंद सुरक्षित चैंबर।' : language === 'sat' ? 'ᱚᱠᱥᱤᱡᱮᱱ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱟᱨ ᱠᱚᱱᱴᱨᱳᱞ ᱨᱩᱢ ᱯᱷᱳᱱ ᱢᱮᱱᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ᱾' : 'Hermetically sealed chambers with compressed breathing air cylinders, carbon dioxide scrubbers, and emergency telephone lines to the pit-head surface.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: DGMS Rules */}
        {activeTab === 'regulations' && (
          <div className="space-y-3.5 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'आधिकारिक नियामक मानक' : language === 'sat' ? 'ᱥᱚᱨᱠᱟᱨᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱭᱤᱱ' : 'Official Regulatory Standards'}</span>
            </h3>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px] text-slate-300">
              <p>• <strong>{language === 'hi' ? 'खान अधिनियम 1952, धारा 22A:' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱟᱹᱭᱤᱱ ᱑᱙᱕᱒, ᱦᱟᱹᱴᱤᱧ ᱒᱒A:' : 'Mines Act 1952, Section 22A:'}</strong> {language === 'hi' ? 'भूमिगत श्रमिकों के लिए व्यावहारिक सुरक्षा दक्षता प्रमाणन अनिवार्य।' : language === 'sat' ? 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ AR ᱥᱮᱪᱮᱫ ᱡᱟᱹᱨᱩᱲ ᱜᱮᱭᱟ᱾' : 'Mandatory practical safety competency certification for underground workers.'}</p>
              <p>• <strong>{language === 'hi' ? 'कोयला खान विनियम 2017, नियम 153:' : language === 'sat' ? 'ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱟᱹᱭᱤᱱ ᱒᱐᱑᱗, ᱟᱹᱨᱤ ᱑᱕᱓:' : 'Coal Mines Regulations 2017, Reg 153:'}</strong> {language === 'hi' ? 'ज्वलनशील गैस निकासी सीमा: रिटर्न वायु में 1.25% से अधिक नहीं।' : language === 'sat' ? 'ᱡᱩᱞᱩᱜ ᱜᱮᱥ ᱥᱤᱢᱟᱹ: ᱑.᱒᱕% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜ ᱞᱟᱹᱠᱛᱤ᱾' : 'Inflammable gas withdrawal limit: 1.25% in general body of return air.'}</p>
              <p>• <strong>{language === 'hi' ? 'DGMS परिपत्र सं. 04 / 2021:' : language === 'sat' ? 'DGMS ᱟᱹᱭᱤᱱ ᱐᱔ / ᱒᱐᱒᱑:' : 'DGMS Circular No. 04 of 2021:'}</strong> {language === 'hi' ? 'गंभीर खदान खतरों के लिए ऑगमेंटेड रियलिटी और वर्चुअल सिमुलेशन का कार्यान्वयन।' : language === 'sat' ? 'ᱵᱤᱯᱚᱫᱽ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱜᱤᱫ AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱵᱮᱵᱷᱟᱨ ᱨᱮᱱᱟᱜ ᱦᱩᱠᱩᱢ᱾' : 'Implementation of Augmented Reality and Virtual Simulation for dangerous hazard training.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* AR Simulation Start Callout */}
      <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            AR
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{realEnvTitle}</h4>
            <span className="text-[10px] text-amber-300">
              {realEnvDesc}
            </span>
          </div>
        </div>

        <button
          onClick={onStartAR}
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{launchARBtn}</span>
        </button>
      </div>
    </div>
  );
};
