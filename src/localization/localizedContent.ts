import { LanguageCode, KnowledgeQuestion, Worker, AdminUser } from '../types';

export interface LocalizedWorkerProfile {
  name: string;
  role: string;
  department: string;
  mineSite: string;
  company: string;
  shift: string;
  bloodGroup: string;
  dgmsBadge: string;
}

export const WORKER_PROFILES: Record<string, Record<LanguageCode, LocalizedWorkerProfile>> = {
  'JH-W-001': {
    en: {
      name: 'Rahul Kumar',
      role: 'Senior Underground Conveyor Operator',
      department: 'Conveyor & Electrical Safety Division',
      mineSite: 'Bokaro Colliery - Pit 03',
      company: 'Jharkhand State Mineral Development Corp (JSMDC)',
      shift: 'Shift A (06:00 - 14:00)',
      bloodGroup: 'B+ Positive',
      dgmsBadge: 'DGMS Certified Underground Miner',
    },
    hi: {
      name: 'राहुल कुमार',
      role: 'वरिष्ठ भूमिगत कन्वेयर ऑपरेटर',
      department: 'कन्वेयर एवं विद्युत सुरक्षा प्रभाग',
      mineSite: 'बोकारो कोलियरी - खदान सं. 03',
      company: 'झारखंड राज्य खनिज विकास निगम (JSMDC)',
      shift: 'पाली A (प्रातः 06:00 - दोपहर 14:00)',
      bloodGroup: 'B+ पॉजिटिव',
      dgmsBadge: 'DGMS प्रमाणित भूमिगत खनिक',
    },
    sat: {
      name: 'ᱨᱟᱦᱩᱞ ᱠᱩᱢᱟᱨ',
      role: 'ᱢᱟᱨᱟᱝ ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ',
      department: 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱟᱹᱴᱤᱧ',
      mineSite: 'ᱵᱚᱠᱟᱨᱳ ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱐᱓',
      company: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱯᱚᱱᱚᱛ ᱠᱷᱟᱫᱟᱱ ᱩᱛᱱᱟᱹᱣ ᱱᱤᱜᱚᱢ',
      shift: 'ᱥᱤᱯᱷᱴ A (ᱥᱮᱛᱟᱜ ᱐᱖:᱐᱐ - ᱛᱤᱠᱤᱱ ᱑᱔:᱐᱐)',
      bloodGroup: 'B+ ᱯᱚᱡᱤᱴᱤᱵᱷ',
      dgmsBadge: 'DGMS ᱥᱟᱹᱵᱤᱛ ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    },
  },
  'JH-W-002': {
    en: {
      name: 'Sunil Soren',
      role: 'Mine Ventilation & Toxic Gas Inspector',
      department: 'Underground Atmospheric Monitoring Cell',
      mineSite: 'Dhanbad Jharia Deep Seam Pit-07',
      company: 'Bharat Coking Coal Limited (BCCL)',
      shift: 'Shift B (14:00 - 22:00)',
      bloodGroup: 'O+ Positive',
      dgmsBadge: 'DGMS Certified Underground Miner',
    },
    hi: {
      name: 'सुनील सोरेन',
      role: 'खदान वेंटिलेशन एवं विषाक्त गैस निरीक्षक',
      department: 'भूमिगत वायुमंडलीय निगरानी प्रकोष्ठ',
      mineSite: 'धनबाद झरिया डीप सीम पिट-07',
      company: 'भारत कोकिंग कोल लिमिटेड (BCCL)',
      shift: 'पाली B (दोपहर 14:00 - रात्रि 22:00)',
      bloodGroup: 'O+ पॉजिटिव',
      dgmsBadge: 'DGMS प्रमाणित भूमिगत खनिक',
    },
    sat: {
      name: 'ᱥᱩᱱᱤᱞ ᱥᱚᱨᱮᱱ',
      role: 'ᱦᱚᱭ ᱪᱟᱞᱟᱣ ᱟᱨ ᱵᱤᱥ ᱜᱮᱥ ᱧᱮᱞᱤᱭᱟᱹ',
      department: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱦᱚᱭ ᱧᱮᱞ ᱦᱟᱹᱴᱤᱧ',
      mineSite: 'ᱫᱷᱟᱱᱵᱟᱫᱽ ᱡᱷᱟᱨᱤᱭᱟ ᱠᱷᱟᱫᱟᱱ ᱐᱗',
      company: 'ᱵᱷᱟᱨᱚᱛ ᱠᱳᱠᱤᱝ ᱠᱳᱞ ᱞᱤᱢᱤᱴᱮᱰ',
      shift: 'ᱥᱤᱯᱷᱴ B (ᱛᱤᱠᱤᱱ ᱑᱔:᱐᱐ - ᱧᱤᱫᱟᱹ ᱒᱒:᱐᱐)',
      bloodGroup: 'O+ ᱯᱚᱡᱤᱴᱤᱵᱷ',
      dgmsBadge: 'DGMS ᱥᱟᱹᱵᱤᱛ ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    },
  },
  'JH-W-003': {
    en: {
      name: 'Manoj Mahto',
      role: 'Heavy Mining Machinery & Haulage Operator',
      department: 'Continuous Mining & Drilling Wing',
      mineSite: 'Ranchi North Karanpura Colliery',
      company: 'Central Coalfields Limited (CCL)',
      shift: 'Shift C (22:00 - 06:00)',
      bloodGroup: 'A+ Positive',
      dgmsBadge: 'DGMS Certified Underground Miner',
    },
    hi: {
      name: 'मनोज महतो',
      role: 'भारी खनन मशीनरी एवं ढुलाई ऑपरेटर',
      department: 'सतत खनन एवं ड्रिलिंग स्कंध',
      mineSite: 'रांची उत्तरी कर्णपुरा कोलियरी',
      company: 'सेंट्रल कोलफील्ड्स लिमिटेड (CCL)',
      shift: 'पाली C (रात्रि 22:00 - प्रातः 06:00)',
      bloodGroup: 'A+ पॉजिटिव',
      dgmsBadge: 'DGMS प्रमाणित भूमिगत खनिक',
    },
    sat: {
      name: 'ᱢᱚᱱᱳᱡᱽ ᱢᱟᱦᱛᱳ',
      role: 'ᱢᱮᱬᱦᱮᱫ ᱜᱟᱹᱰᱤ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱢᱮᱥᱤᱱ ᱪᱟᱞᱟᱣᱤᱭᱟᱹ',
      department: 'ᱞᱮᱛᱟᱲ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱵᱷᱩᱜᱟᱹᱜ ᱦᱟᱹᱴᱤᱧ',
      mineSite: 'ᱨᱟᱺᱪᱤ ᱩᱛᱛᱚᱨ ᱠᱚᱨᱚᱱᱯᱩᱨᱟ ᱠᱷᱟᱫᱟᱱ',
      company: 'ᱥᱮᱱᱴᱨᱟᱞ ᱠᱳᱞᱯᱷᱤᱞᱰᱥ ᱞᱤᱢᱤᱴᱮᱰ',
      shift: 'ᱥᱤᱯᱷᱴ C (ᱧᱤᱫᱟᱹ ᱒᱒:᱐᱐ - ᱥᱮᱛᱟᱜ ᱐᱖:᱐᱐)',
      bloodGroup: 'A+ ᱯᱚᱡᱤᱴᱤᱵᱷ',
      dgmsBadge: 'DGMS ᱥᱟᱹᱵᱤᱛ ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    },
  },
};

export const getLocalizedWorkerProfile = (worker: Worker, lang: LanguageCode): LocalizedWorkerProfile => {
  const profile = WORKER_PROFILES[worker.id]?.[lang];
  if (profile) return profile;

  // Fallback for custom workers
  if (lang === 'hi') {
    return {
      name: worker.name,
      role: 'भारी खनन संयंत्र एवं सुरक्षा ऑपरेटर',
      department: 'भूमिगत खनन प्रचालन प्रभाग, झारखंड',
      mineSite: 'झारखंड खनन बेल्ट - साइट 04',
      company: 'झारखंड राज्य खान एवं खनिज विकास निगम',
      shift: 'पाली A (सामान्य)',
      bloodGroup: 'B+ पॉजिटिव',
      dgmsBadge: 'DGMS पंजीकृत खनिक',
    };
  }
  if (lang === 'sat') {
    return {
      name: worker.name,
      role: 'ᱠᱷᱟᱫᱟᱱ ᱢᱮᱥᱤᱱ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤᱭᱟᱹ',
      department: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱦᱟᱹᱴᱤᱧ, ᱡᱷᱟᱨᱠᱷᱚᱸᱰ',
      mineSite: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱠᱷᱟᱫᱟᱱ ᱴᱚᱴᱷᱟ ᱐᱔',
      company: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱯᱚᱱᱚᱛ ᱠᱷᱟᱫᱟᱱ ᱱᱤᱜᱚᱢ',
      shift: 'ᱥᱤᱯᱷᱴ A (ᱥᱟᱫᱷᱟᱨᱚᱱ)',
      bloodGroup: 'B+ ᱯᱚᱡᱤᱴᱤᱵᱷ',
      dgmsBadge: 'DGMS ᱨᱮᱡᱤᱥᱴᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    };
  }
  return {
    name: worker.name,
    role: worker.role || 'Heavy Mining Machinery & Safety Operator',
    department: worker.department || 'Underground Operations Division',
    mineSite: worker.mineSite || 'Jharkhand Mining Belt Site-04',
    company: worker.company || 'Govt. of Jharkhand Mining Operations',
    shift: 'Shift A (General)',
    bloodGroup: 'B+ Positive',
    dgmsBadge: 'DGMS Registered Miner',
  };
};

export const getLocalizedAdminProfile = (admin: AdminUser, lang: LanguageCode) => {
  if (lang === 'hi') {
    return {
      name: 'इं. राजेश्वर सोरेन',
      designation: 'खान सुरक्षा निदेशक (DGMS झारखंड)',
      department: 'खान सुरक्षा नियामक महानिदेशालय, रांची',
    };
  }
  if (lang === 'sat') {
    return {
      name: 'ᱤᱧᱡᱤ. ᱨᱟᱡᱮᱥᱣᱚᱨ ᱥᱚᱨᱮᱱ',
      designation: 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱭᱨᱮᱠᱴᱚᱨ (DGMS ᱡᱷᱟᱨᱠᱷᱚᱸᱰ)',
      department: 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱦᱟᱱᱤᱫᱮᱥᱟᱲᱚᱭ, ᱨᱟᱺᱪᱤ',
    };
  }
  return {
    name: admin.name,
    designation: admin.designation,
    department: 'Mines Safety Regulatory Directorate, Ranchi',
  };
};

export const getLocalizedFireQuestions = (lang: LanguageCode): KnowledgeQuestion[] => {
  if (lang === 'hi') {
    return [
      {
        id: 'kq-1',
        question: 'भूमिगत कोयला कन्वेयर मोटर की आग पर क्लास-ए पानी की धारा का उपयोग सख्त वर्जित क्यों है?',
        options: [
          'खदान के तापमान में पानी बहुत जल्दी वाष्पीकृत हो जाता है',
          'घातक बिजली का झटका (इलेक्ट्रोक्यूशन) एवं आर्क फ्लैश ब्लास्ट का गंभीर जोखिम',
          'पानी से कार्बन डाइऑक्साइड की विषाक्त मात्रा बढ़ती है',
          'पानी कन्वेयर के वल्केनाइज्ड रबर को नुकसान पहुंचाता है',
        ],
        correctIndex: 1,
        explanation: 'सक्रिय विद्युत मोटर उपकरणों पर पानी विद्युत धारा का सुचालक बन जाता है, जिससे तुरंत घातक इलेक्ट्रोक्यूशन का खतरा होता है।',
      },
      {
        id: 'kq-2',
        question: 'कन्वेयर आग निकासी के दौरान श्रमिकों को इनटेक एयरवे (ताजी हवा मार्ग) से ही क्यों निकलना चाहिए?',
        options: [
          'इनटेक एयरवे विषाक्त धुएं और कार्बन मोनोऑक्साइड से मुक्त स्वच्छ धनात्मक हवा प्रदान करता है',
          'इनटेक एयरवे में मशीनरी का घर्षण कम होता है',
          'रिटर्न एयरवे केवल डीजल इंजनों के लिए आरक्षित होता है',
          'इनटेक एयरवे में नमी अधिक होती है',
        ],
        correctIndex: 0,
        explanation: 'इनटेक एयरवे खदान के मुख्य पंखों द्वारा खींची गई ताजी वायु देता है, जिससे दम घुटने और विषैले धुएं से बचाव होता है।',
      },
      {
        id: 'kq-3',
        question: 'DGMS कोयला खान विनियम 2017 के अनुसार, आग की लपटें बुझाने के तुरंत बाद अनिवार्य कार्रवाई क्या है?',
        options: [
          'कन्वेयर बेल्ट को तुरंत पुनः चालू करना',
          'मुख्य विद्युत ब्रेकर को लॉकआउट/टैगआउट (LOTO) द्वारा बंद करना एवं कंट्रोल रूम को सूचित करना',
          'स्विचगियर आवास को तुरंत पानी से धोना',
          'स्थान को बिना किसी निगरानी के छोड़ देना',
        ],
        correctIndex: 1,
        explanation: 'लॉकआउट/टैगआउट (LOTO) यह सुनिश्चित करता है कि उपकरण में दोबारा करंट प्रवाहित न हो और सुलगती आग पुनः न भड़के।',
      },
    ];
  }

  if (lang === 'sat') {
    return [
      {
        id: 'kq-1',
        question: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱳᱴᱚᱨ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱪᱮᱫᱟᱜ ᱢᱟᱱᱟ ᱜᱮᱭᱟ?',
        options: [
          'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱫᱟᱜ ᱞᱚᱜᱚᱱ ᱵᱟᱥᱯᱚᱜ-ᱟ',
          'ᱵᱤᱡᱽᱞᱤ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱟᱨ ᱡᱤᱣᱤ ᱪᱟᱞᱟᱜ ᱨᱮᱱᱟᱜ ᱢᱟᱨᱟᱝ ᱵᱚᱛᱚᱨ',
          'ᱫᱟᱜ ᱛᱮ ᱵᱤᱥ ᱜᱮᱥ ᱰᱷᱮᱨᱚᱜ-ᱟ',
          'ᱫᱟᱜ ᱛᱮ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱟᱵᱟᱨ ᱵᱟᱹᱲᱤᱡᱚᱜ-ᱟ',
        ],
        correctIndex: 1,
        explanation: 'ᱵᱤᱡᱽᱞᱤ ᱪᱟᱹᱞᱩ ᱢᱮᱥᱤᱱ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱠᱟᱨᱮᱱᱴ ᱯᱟᱥᱱᱟᱣᱜ-ᱟ ᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱜᱚᱡ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱠᱚ᱾',
      },
      {
        id: 'kq-2',
        question: 'ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱚᱠᱛᱚ ᱨᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ (Intake Airway) ᱛᱮ ᱪᱮᱫᱟᱜ ᱫᱟᱹᱲ ᱞᱟᱹᱠᱛᱤ?',
        options: [
          'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱨᱮ ᱫᱷᱩᱶᱟᱹ ᱵᱟᱹᱱᱩᱜ-ᱟ ᱟᱨ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱦᱚᱭ ᱧᱟᱢᱚᱜ-ᱟ',
          'ᱚᱸᱰᱮ ᱢᱮᱥᱤᱱ ᱠᱚᱢ ᱛᱟᱦᱮᱸᱱᱟ',
          'ᱨᱤᱴᱟᱨᱱ ᱰᱟᱦᱟᱨ ᱫᱚ ᱠᱷᱟᱹᱞᱤ ᱜᱟᱹᱰᱤ ᱞᱟᱹᱜᱤᱫ',
          'ᱚᱸᱰᱮ ᱫᱟᱜ ᱰᱷᱮᱨ ᱛᱟᱦᱮᱸᱱᱟ',
        ],
        correctIndex: 0,
        explanation: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱨᱮ ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱱᱟᱣᱟ ᱦᱚᱭ ᱵᱚᱞᱚᱱ ᱠᱟᱱᱟ, ᱚᱱᱟᱛᱮ ᱫᱷᱩᱶᱟᱹ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱭᱩᱜ-ᱟ᱾',
      },
      {
        id: 'kq-3',
        question: 'DGMS ᱟᱹᱭᱤᱱ ᱒᱐᱑᱗ ᱞᱮᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱛᱟᱭᱚᱢ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱯᱩᱭᱞᱩ ᱠᱟᱹᱢᱤ ᱫᱚ ᱪᱮᱫ?',
        options: [
          'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱞᱚᱜᱚᱱ ᱪᱟᱹᱞᱩ ᱨᱩᱣᱟᱹᱲ',
          'ᱢᱩᱬᱩᱛ ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ (Lockout/Tagout) ᱠᱚᱱᱴᱨᱳᱞ ᱨᱩᱢ ᱨᱮ ᱠᱷᱚᱵᱚᱨ ᱮᱢ',
          'ᱢᱮᱥᱤᱱ ᱫᱟᱜ ᱛᱮ ᱟᱹᱨᱩᱵ',
          'ᱡᱟᱭᱜᱟ ᱵᱟᱹᱜᱤ ᱠᱟᱛᱮ ᱪᱟᱞᱟᱣ',
        ],
        correctIndex: 1,
        explanation: 'ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱞᱮᱠᱷᱟᱱ ᱫᱚᱦᱲᱟ ᱥᱮᱸᱜᱮᱞ ᱵᱟᱝ ᱡᱩᱞᱩᱜ-ᱟ ᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱦᱮᱸᱱᱟ᱾',
      },
    ];
  }

  return [
    {
      id: 'kq-1',
      question: 'Why is a Class A water stream strictly prohibited on underground conveyor motor fires?',
      options: [
        'Water evaporates too quickly in mine temperature',
        'High risk of lethal electrical shock & arc flash deflagration',
        'Water increases toxic carbon dioxide production',
        'Water damages the conveyor vulcanized rubber',
      ],
      correctIndex: 1,
      explanation: 'Water conducts electricity across energized conveyor motor switchgear, causing severe electrocution hazard.',
    },
    {
      id: 'kq-2',
      question: 'During mine conveyor fire evacuation, why must workers traverse via the Intake Airway?',
      options: [
        'Intake airways deliver fresh, positive-pressure air free of toxic combustion fumes',
        'Intake airways have lower mechanical friction',
        'Return airways are exclusively reserved for diesel machinery',
        'Intake airways have higher humidity',
      ],
      correctIndex: 0,
      explanation: 'Intake airway provides fresh atmospheric oxygen flowing toward the face, preventing toxic gas asphyxiation.',
    },
    {
      id: 'kq-3',
      question: 'Under DGMS Coal Mines Regulations 2017, what is the mandatory immediate action after flame suppression?',
      options: [
        'Immediately resume conveyor haulage',
        'De-energize main electrical breaker (Lockout/Tagout) and report to surface control room',
        'Wash the switchgear housing with water',
        'Leave the area unmonitored',
      ],
      correctIndex: 1,
      explanation: 'Lockout/Tagout ensures equipment cannot re-energize or cause secondary smoldering ignition.',
    },
  ];
};

export const getLocalizedGasQuestions = (lang: LanguageCode): KnowledgeQuestion[] => {
  if (lang === 'hi') {
    return [
      {
        id: 'gkq-1',
        question: 'DGMS कोयला खान विनियम 2017 (विनियम 153) के तहत, भूमिगत हवा में मीथेन गैस की अधिकतम अनुमेय सीमा क्या है जिसके बाद कार्य तुरंत रोकना अनिवार्य है?',
        options: [
          '0.50% (पंखा चलाकर कार्य जारी रहता है)',
          '1.25% (अनिवार्य तत्काल विद्युत विच्छेद एवं सभी खनिकों की सुरक्षित निकासी)',
          '3.00% (उच्च जोखिम सीमा)',
          '5.00% (विस्फोटक सीमा)',
        ],
        correctIndex: 1,
        explanation: 'DGMS CMR 2017 के तहत यदि ज्वलनशील गैस 1.25% से अधिक हो जाती है, तो मुख्य विद्युत तुरंत काटी जानी चाहिए और सभी श्रमिकों को सुरक्षित बाहर निकाला जाना चाहिए।',
      },
      {
        id: 'gkq-2',
        question: 'हाइड्रोजन सल्फाइड (H2S) और मीथेन गैस रिसाव के दौरान साधारण कपड़ा या धूल मास्क जानलेवा क्यों साबित होता है?',
        options: [
          'H2S कपड़े के फिल्टर को तुरंत जाम कर देता है',
          'H2S अत्यंत जहरीली तंत्रिका गैस है जो धूल फिल्टर से सीधे फेफड़ों में जाती है; केवल पॉजिटिव प्रेशर SCBA ही सुरक्षित ऑक्सीजन प्रदान करता है',
          'धूल मास्क नमी के संपर्क में आते ही जलने लगता है',
          'धूल मास्क संकीर्ण स्थान में बहुत भारी होता है',
        ],
        correctIndex: 1,
        explanation: 'धूल मास्क केवल ठोस धूल कणों को रोकता है। H2S एवं मीथेन जैसी गैसें सीधे फेफड़ों में जाकर सूंघने की शक्ति और श्वसन तंत्र को कुछ सेकंड में पंगु कर देती हैं।',
      },
      {
        id: 'gkq-3',
        question: 'अनियंत्रित गैस रिसाव के दौरान भूमिगत श्रमिकों को किस दिशा में आपातकालीन निकासी करनी चाहिए?',
        options: [
          'हवा के बहाव के अनुकूल मुख्य निकास वेंटिलेशन शाफ्ट की ओर',
          'हवा के बहाव के विपरीत (अपविंड) स्वच्छ इनटेक एयरवे की ओर बढ़ते हुए',
          'खदान के सबसे निचले जल निकासी गड्ढे (सम्प) में रेंगते हुए',
          'रेस्क्यू टीम के आने तक पाइपलाइन के पास स्थिर खड़े रहकर',
        ],
        correctIndex: 1,
        explanation: 'हमेशा हवा के बहाव के विपरीत (Upwind) इनटेक एयरवे की दिशा में निकलना चाहिए ताकि स्वच्छ ताजी हवा का धनात्मक दबाव विषैली गैसों को आपके मार्ग से दूर रखे।',
      },
    ];
  }

  if (lang === 'sat') {
    return [
      {
        id: 'gkq-1',
        question: 'DGMS ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱟᱹᱭᱤᱱ ᱒᱐᱑᱗ ᱞᱮᱠᱟᱛᱮ ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ ᱛᱤᱱᱟᱹᱜ ᱥᱮᱴᱮᱨ ᱞᱮᱠᱷᱟᱱ ᱠᱟᱹᱢᱤ ᱛᱷᱩᱠᱟᱹᱢ ᱠᱟᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱦᱩᱭᱩᱜ-ᱟ?',
        options: [
          '᱐.᱕᱐% (ᱯᱷᱮᱱ ᱪᱟᱹᱞᱩ ᱠᱟᱛᱮ ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜ-ᱟ)',
          '᱑.᱒᱕% (ᱞᱚᱜᱚᱱ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱟᱨ ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ)',
          '᱓.᱐᱐% (ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ)',
          '᱕.᱐᱐% (ᱵᱚᱢ ᱞᱮᱠᱟ ᱯᱷᱩᱴᱟᱹᱣ ᱥᱤᱢᱟᱹ)',
        ],
        correctIndex: 1,
        explanation: '᱑.᱒᱕% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱜᱮᱥ ᱦᱩᱭ ᱞᱮᱠᱷᱟᱱ DGMS ᱟᱹᱭᱤᱱ ᱞᱮᱠᱟᱛᱮ ᱞᱚᱜᱚᱱ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱞᱟᱹᱠᱛᱤ᱾',
      },
      {
        id: 'gkq-2',
        question: 'ᱵᱤᱥ ᱜᱮᱥ (H2S/CH4) ᱞᱤᱠ ᱚᱠᱛᱚ ᱨᱮ ᱞᱩᱜᱽᱲᱤ ᱥᱮ ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ ᱪᱮᱫᱟᱜ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ?',
        options: [
          'ᱜᱮᱥ ᱛᱮ ᱢᱟᱥᱠ ᱡᱟᱢᱚᱜ-ᱟ',
          'ᱵᱤᱥ ᱜᱮᱥ ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ ᱯᱟᱨᱚᱢ ᱠᱟᱛᱮ ᱦᱚᱲᱢᱚ ᱨᱮ ᱵᱚᱞᱚᱱᱟ; ᱠᱷᱟᱹᱞᱤ SCBA ᱜᱮ ᱥᱟᱯᱷᱟ ᱚᱠᱥᱤᱡᱮᱱ ᱮᱢᱟᱭ',
          'ᱢᱟᱥᱠ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ-ᱟ',
          'ᱢᱟᱥᱠ ᱟᱹᱰᱤ ᱦᱟᱢᱟᱞ ᱜᱮᱭᱟ',
        ],
        correctIndex: 1,
        explanation: 'ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ ᱫᱚ ᱠᱷᱟᱹᱞᱤ ᱫᱷᱩᱲᱤ ᱟᱴᱠᱟᱣᱟᱭ, ᱵᱤᱥ ᱜᱮᱥ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱦᱚᱲ ᱜᱚᱡ ᱫᱟᱲᱮᱭᱟᱭᱟ, ᱚᱱᱟᱛᱮ SCBA ᱡᱟᱹᱨᱩᱲ ᱜᱮᱭᱟ᱾',
      },
      {
        id: 'gkq-3',
        question: 'ᱜᱮᱥ ᱞᱤᱠ ᱚᱠᱛᱚ ᱨᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱚᱠᱟ ᱥᱮᱫ ᱛᱮ ᱫᱟᱹᱲ ᱞᱟᱹᱠᱛᱤ?',
        options: [
          'ᱦᱚᱭ ᱥᱮᱱᱚᱜ ᱠᱟᱱ ᱥᱮᱫ ᱛᱮ',
          'ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱥᱮᱫ (Upwind) ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱛᱮ',
          'ᱠᱷᱟᱫᱟᱱ ᱞᱟᱛᱟᱨ ᱫᱟᱜ ᱜᱟᱰᱟ ᱨᱮ',
          'ᱯᱟᱭᱤᱯ ᱴᱷᱮᱱ ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱛᱟᱺᱜᱤ',
        ],
        correctIndex: 1,
        explanation: 'ᱥᱟᱨᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱥᱮᱫ (Upwind) ᱫᱟᱹᱲ ᱢᱮ ᱡᱟᱦᱟᱸᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱧᱟᱢᱚᱜ-ᱟ ᱟᱨ ᱵᱤᱥ ᱜᱮᱥ ᱯᱟᱹᱪᱷᱞᱟᱹ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ᱾',
      },
    ];
  }

  return [
    {
      id: 'gkq-1',
      question: 'Under DGMS Coal Mines Regulations 2017 (Reg 153), what is the maximum permissible concentration of Inflammable Gas (Methane) in general body of air before work must be stopped immediately?',
      options: [
        '0.50% (Work continues with fans)',
        '1.25% (Mandatory immediate power cut-off & withdrawal of workers)',
        '3.00% (High risk threshold)',
        '5.00% (Lower explosive limit)',
      ],
      correctIndex: 1,
      explanation: 'Under DGMS Coal Mines Regulations, if inflammable gas exceeds 1.25%, electrical supply must be disconnected immediately and all personnel evacuated.',
    },
    {
      id: 'gkq-2',
      question: 'Why is an ordinary cartridge or cloth dust mask completely useless and fatal during a Hydrogen Sulfide (H2S) gas burst in an underground confined shaft?',
      options: [
        'H2S clogs the dust filter fabric immediately',
        'H2S is a lethal nerve gas that passes directly through particulate filters; only positive-pressure SCBA supplies isolated breathing oxygen',
        'Dust masks react with moisture and catch fire',
        'Cartridge filters are too heavy for confined movement',
      ],
      correctIndex: 1,
      explanation: 'Particulate and dust filters only trap physical airborne dust. Toxic gases (H2S/CO) pass straight through into lungs, causing olfactory paralysis and fatal hypoxia.',
    },
    {
      id: 'gkq-3',
      question: 'When evacuating an underground section during an uncontrolled methane or toxic gas blowout, which path must workers follow?',
      options: [
        'Downwind towards the main exhaust ventilation shaft',
        'Upwind into the fresh Intake Airway traveling against the contaminated airflow direction',
        'Crawl into the lowest drainage sump',
        'Wait stationary at the borehole header until rescue teams arrive',
      ],
      correctIndex: 1,
      explanation: 'Always evacuate upwind into the fresh Intake Airway so the positive pressure of clean air sweeps contaminants away from your escape path.',
    },
  ];
};

export const getLocalizedARText = (lang: LanguageCode) => {
  if (lang === 'hi') {
    return {
      exit: 'बाहर निकलें',
      depthOcclusion: 'गहराई अवरोधन (Depth):',
      score: 'स्कोर:',
      active: 'सक्रिय',
      surfaceReady: 'भौतिक सतह तैयार',
      scanningFloor: 'भौतिक फर्श की सतह को स्कैन किया जा रहा है...',
      tapToPlaceScenario: 'फर्श पर कैमरा केंद्रित करें और 3D आपातकालीन सिनेरियो स्थापित करने के लिए टैप करें।',
      movePhoneSlowly: 'पर्यावरण को स्कैन करने के लिए अपने फोन को धीरे-धीरे घुमाएं...',
      
      // Fire AR
      fireInitialTitle: 'औद्योगिक मशीनरी का निरीक्षण करें',
      fireInitialDesc: 'आपके कमरे में आभासी कन्वेयर मोटर स्थापित है। विद्युत विसंगति एवं चिंगारी पर ध्यान दें।',
      fireHazardTitle: 'खतरे के स्रोत का पता लगाएं और स्क्रीन पर टैप करें',
      fireHazardDesc: 'अपने कमरे में उपकरण का निरीक्षण करें। विद्युत आग को इंगित करने हेतु मोटर पर टैप करें।',
      fireSelectTitle: 'अग्निशामक रसायन का चयन करें',
      fireSelectBadge: 'निर्णय क्षमता (+15 अंक / -10 कटौती)',
      waterName: 'क्लास A जल (Water)',
      waterDesc: 'विद्युत प्रवाहित करता है · जानलेवा',
      foamName: 'AFFF फोम (Foam)',
      foamDesc: 'केवल तरल ईंधन आग के लिए',
      abcName: 'ABC ड्राई केमिकल पाउडर',
      abcDesc: 'MAP 90% · सक्रिय विद्युत हेतु सुरक्षित',
      co2Name: 'CO2 गैस',
      co2Desc: 'सीमित बहाव दूरी',
      fireDischargeTitle: 'मैनुअल अग्निशमन कार्रवाई (+25 अंक)',
      fireDischargeDesc: 'क्रॉसहेयर को आग के आधार पर केंद्रित करें। पाउडर छिड़काव हेतु बटन दबाकर रखें।',
      fireSuppressing: 'आग बुझाई जा रही है (स्वीप क्रिया)...',
      fireAimDrifted: 'निशाना भटका! क्रॉसहेयर को आग के आधार पर केंद्रित करें!',
      firePressHold: 'छिड़काव के लिए दबाकर रखें (P.A.S.S.)',
      fireEvacTitle: 'द्वितीयक खतरा: घना धुआं फैल रहा है',
      fireEvacBadge: 'आपातकालीन निकास निर्णय (+15 अंक)',
      fireEvacDesc: 'दायां गलियारा धुएं से अवरुद्ध है। कमरे को स्कैन करें और सुरक्षित निकास हेतु हरे इनटेक एयरवे पर टैप करें।',
      fireMusterTitle: 'भूमिगत सुरक्षित चैंबर में प्रवेश करें',
      fireMusterBadge: 'सुरक्षित मस्टर क्षेत्र (+20 अंक)',
      fireMusterDesc: 'स्क्रीन पर हरे बेलनाकार सेफ मस्टर स्टेशन की ओर बढ़ें और अंदर जाने के लिए टैप करें।',
      questionBadge: 'अंतिम नियामक ज्ञान मूल्यांकन (+10 अंक)',
      questionLabel: 'प्रश्न',

      // Gas AR
      gasDetectorTitle: 'गैस डिटेक्टर',
      gasAlarm: 'खतरा अलार्म',
      gasInitialTitle: 'संकीर्ण स्थान पाइपलाइन हेडर',
      gasInitialDesc: 'कमरे में आभासी गैस पाइपलाइन स्थापित है। सीटी जैसी तेज गैस रिसाव आवाज सुनें।',
      gasHazardTitle: 'फटे हुए पाइप फ्लैंज का पता लगाएं',
      gasHazardBadge: 'खतरे की पहचान (+15 अंक)',
      gasHazardDesc: 'कमरे में पाइपिंग का निरीक्षण करें। गैस रिसाव चिन्हित करने हेतु पीले गास्केट पर टैप करें।',
      gasPPETitle: 'श्वसन सुरक्षा उपकरण (PPE) चुनें',
      gasPPEBadge: 'श्वसन PPE निर्णय (+15 अंक / -10 कटौती)',
      dustMaskName: 'N95 धूल मास्क',
      dustMaskDesc: 'केवल धूल · गैस के विरुद्ध घातक',
      scbaName: 'SCBA पॉजिटिव प्रेशर',
      scbaDesc: '300 बार · पृथक सांस लेने योग्य ऑक्सीजन',
      bandanaName: 'सूती रुमाल / गमछा',
      bandanaDesc: 'तत्काल बेहोशी का खतरा',
      halfMaskName: 'हाफ-फेस कार्ट्रिज',
      halfMaskDesc: 'कम ऑक्सीजन में अप्रभावी',
      gasValveTitle: 'वाल्व आइसोलेशन (+25 अंक)',
      gasPressure: 'दबाव:',
      gasValveDesc: 'गैस आपूर्ति बंद करने हेतु आइसोलेशन पहिए को दक्षिणावर्त (Clockwise) घुमाएं। टॉर्क हेतु दबाकर रखें।',
      gasTurningValve: 'आइसोलेशन वाल्व को दक्षिणावर्त बंद किया जा रहा है...',
      gasPressHoldValve: 'वाल्व पहिया बंद करने हेतु दबाकर रखें',
      gasWindTitle: 'हवा की दिशा एवं निकास मार्ग (+15 अंक)',
      gasWindBadge: 'वायुमंडलीय हवा पूर्व दिशा में बह रही है →',
      gasWindDesc: 'विषाक्त बादल की दिशा में न जाएं! स्वच्छ इनटेक एयरवे में निकलने हेतु हरे अपविंड मार्ग (बाईं ओर) पर टैप करें।',
      gasRefugeTitle: 'खदान रिफ्यूज चैंबर में प्रवेश करें',
      gasRefugeBadge: 'सुरक्षित रिफ्यूज चैंबर (+20 अंक)',
      gasRefugeDesc: 'वायुरोधी सीलबंद हरे रिफ्यूज चैंबर की ओर बढ़ें और अंदर प्रवेश करने हेतु टैप करें।',
    };
  }

  if (lang === 'sat') {
    return {
      exit: 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
      depthOcclusion: 'ᱜᱟᱹᱦᱤᱨ ᱵᱮᱵᱷᱟᱨ:',
      score: 'ᱮᱞ:',
      active: 'ᱪᱟᱹᱞᱩ',
      surfaceReady: 'ᱚᱛ ᱥᱟᱯᱲᱟᱣ ᱮᱱᱟ',
      scanningFloor: 'ᱚᱛ ᱥᱠᱮᱱ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...',
      tapToPlaceScenario: 'ᱚᱛ ᱨᱮ ᱠᱮᱢᱮᱨᱟ ᱫᱚᱦᱚ ᱠᱟᱛᱮ 3D ᱥᱤᱱ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾',
      movePhoneSlowly: 'ᱚᱛ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱚᱱ ᱫᱚ ᱵᱟᱹᱭ-ᱵᱟᱹᱭ ᱛᱮ ᱦᱤᱞᱟᱹᱣ ᱢᱮ...',

      // Fire AR
      fireInitialTitle: 'ᱠᱷᱟᱫᱟᱱ ᱢᱮᱥᱤᱱ ᱧᱮᱞ ᱢᱮ',
      fireInitialDesc: 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱳᱴᱚᱨ ᱚᱛ ᱨᱮ ᱫᱚᱦᱚ ᱮᱱᱟ᱾ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱴᱠᱟᱹᱣ ᱧᱮᱞ ᱢᱮ᱾',
      fireHazardTitle: 'ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ',
      fireHazardDesc: 'ᱢᱳᱴᱚᱨ ᱨᱮ ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾',
      fireSelectTitle: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
      fireSelectBadge: 'ᱵᱟᱪᱷᱟᱣ ᱮᱞ (+᱑᱕ / -᱑᱐)',
      waterName: 'ᱠᱞᱟᱥ A ᱫᱟᱜ (Water)',
      waterDesc: 'ᱠᱟᱨᱮᱱᱴ ᱯᱟᱥᱱᱟᱣᱜ-ᱟ · ᱜᱚᱡ ᱵᱚᱛᱚᱨ',
      foamName: 'AFFF ᱯᱷᱳᱢ (Foam)',
      foamDesc: 'ᱠᱷᱟᱹᱞᱤ ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ',
      abcName: 'ABC ᱯᱟᱣᱰᱟᱨ (Dry Powder)',
      abcDesc: 'MAP 90% · ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱱᱟᱯᱟᱭ',
      co2Name: 'CO2 ᱜᱮᱥ',
      co2Desc: 'ᱥᱟᱺᱜᱤᱧ ᱵᱟᱝ ᱥᱮᱴᱮᱨᱚᱜ-ᱟ',
      fireDischargeTitle: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱠᱟᱹᱢᱤ (+᱒᱕ ᱮᱞ)',
      fireDischargeDesc: 'ᱱᱤᱥᱟᱱᱟ ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾ ᱯᱟᱣᱰᱟᱨ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱵᱚᱴᱚᱱ ᱞᱤᱱ ᱢᱮ᱾',
      fireSuppressing: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ...',
      fireAimDrifted: 'ᱱᱤᱥᱟᱱᱟ ᱵᱟᱹᱲᱤᱡ ᱮᱱᱟ! ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱱᱤᱥᱟᱱᱟᱭ ᱢᱮ!',
      firePressHold: 'ᱞᱤᱱ ᱠᱟᱛᱮ ᱫᱚᱦᱚᱭ ᱢᱮ (P.A.S.S.)',
      fireEvacTitle: 'ᱫᱚᱥᱟᱨ ᱵᱤᱯᱚᱫᱽ: ᱫᱷᱩᱶᱟᱹ ᱯᱟᱥᱱᱟᱣ ᱮᱱᱟ',
      fireEvacBadge: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱵᱟᱪᱷᱟᱣ (+᱑᱕ ᱮᱞ)',
      fireEvacDesc: 'ᱡᱚᱡᱚᱢ ᱥᱮᱫ ᱫᱷᱩᱶᱟᱹ ᱯᱮᱨᱮᱡ ᱮᱱᱟ᱾ ᱞᱮᱸᱜᱟ ᱥᱮᱫ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾',
      fireMusterTitle: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ',
      fireMusterBadge: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ (+᱒᱐ ᱮᱞ)',
      fireMusterDesc: 'ᱥᱠᱨᱤᱱ ᱨᱮ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱪᱮᱢᱵᱟᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾',
      questionBadge: 'ᱢᱩᱪᱟᱹᱫ ᱵᱤᱱᱤᱰ ᱠᱩᱠᱞᱤ (+᱑᱐ ᱮᱞ)',
      questionLabel: 'ᱠᱩᱠᱞᱤ',

      // Gas AR
      gasDetectorTitle: 'ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ',
      gasAlarm: 'ᱵᱤᱯᱚᱫᱽ ᱟᱞᱟᱨᱢ',
      gasInitialTitle: 'ᱠᱷᱟᱫᱟᱱ ᱯᱟᱭᱤᱯ ᱦᱮᱰᱟᱨ',
      gasInitialDesc: 'ᱚᱲᱟᱜ ᱨᱮ ᱯᱟᱭᱤᱯ ᱫᱚᱦᱚ ᱮᱱᱟ᱾ ᱜᱮᱥ ᱩᱰᱩᱠᱚᱜ ᱥᱟᱰᱮ ᱟᱸᱡᱚᱢ ᱢᱮ᱾',
      gasHazardTitle: 'ᱨᱟᱹᱯᱩᱫ ᱯᱟᱭᱤᱯ ᱡᱚᱲ ᱯᱟᱱᱛᱮᱭ ᱢᱮ',
      gasHazardBadge: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ (+᱑᱕ ᱮᱞ)',
      gasHazardDesc: 'ᱯᱟᱭᱤᱯ ᱧᱮᱞ ᱢᱮ᱾ ᱥᱟᱥᱟᱝ ᱜᱟᱥᱠᱮᱴ ᱴᱷᱮᱱ ᱴᱤᱯᱟᱹᱣ ᱠᱟᱛᱮ ᱞᱤᱠ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾',
      gasPPETitle: 'ᱥᱟᱦᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
      gasPPEBadge: 'PPE ᱵᱟᱪᱷᱟᱣ (+᱑᱕ / -᱑᱐)',
      dustMaskName: 'N95 ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ',
      dustMaskDesc: 'ᱠᱷᱟᱹᱞᱤ ᱫᱷᱩᱲᱤ · ᱜᱮᱥ ᱨᱮ ᱵᱟᱹᱲᱤᱡ',
      scbaName: 'SCBA ᱚᱠᱥᱤᱡᱮᱱ ᱥᱮᱴ',
      scbaDesc: '300 ᱵᱟᱨ · ᱥᱟᱹᱨᱤ ᱚᱠᱥᱤᱡᱮᱱ',
      bandanaName: 'ᱞᱩᱜᱽᱲᱤ ᱨᱩᱢᱟᱹᱞ',
      bandanaDesc: 'ᱜᱚᱡ ᱵᱚᱛᱚᱨ',
      halfMaskName: 'ᱦᱟᱯᱷ ᱯᱷᱮᱥ ᱢᱟᱥᱠ',
      halfMaskDesc: 'ᱠᱚᱢ ᱦᱚᱭ ᱨᱮ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ',
      gasValveTitle: 'ᱵᱷᱟᱞᱵᱷ ᱵᱚᱸᱫᱽ (+᱒᱕ ᱮᱞ)',
      gasPressure: 'ᱪᱟᱯ:',
      gasValveDesc: 'ᱜᱮᱥ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱪᱟᱠᱟ ᱟᱹᱪᱩᱨ ᱢᱮ᱾ ᱞᱤᱱ ᱠᱟᱛᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾',
      gasTurningValve: 'ᱵᱷᱟᱞᱵᱷ ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱᱟ...',
      gasPressHoldValve: 'ᱵᱷᱟᱞᱵᱷ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱞᱤᱱ ᱢᱮ',
      gasWindTitle: 'ᱦᱚᱭ ᱫᱤᱥᱟᱹ ᱟᱨ ᱫᱟᱹᱲ ᱰᱟᱦᱟᱨ (+᱑᱕ ᱮᱞ)',
      gasWindBadge: 'ᱦᱚᱭ ᱥᱟᱢᱟᱝ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ →',
      gasWindDesc: 'ᱵᱤᱥ ᱜᱮᱥ ᱥᱮᱫ ᱟᱞᱚᱢ ᱫᱟᱹᱲᱟ! ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ (ᱞᱮᱸᱜᱟ ᱥᱮᱫ) ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾',
      gasRefugeTitle: 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ',
      gasRefugeBadge: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ (+᱒᱐ ᱮᱞ)',
      gasRefugeDesc: 'ᱦᱟᱹᱨᱭᱟᱹᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ ᱥᱮᱫ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾',
    };
  }

  return {
    exit: 'Exit',
    depthOcclusion: 'Depth Occlusion:',
    score: 'SCORE:',
    active: 'Active',
    surfaceReady: 'Surface Ready',
    scanningFloor: 'Scanning Physical Floor...',
    tapToPlaceScenario: 'Point camera at floor and tap the reticle to place industrial emergency scenario.',
    movePhoneSlowly: 'Move your phone slowly to scan the environment...',

    // Fire AR
    fireInitialTitle: 'Observe Industrial Machinery',
    fireInitialDesc: 'Virtual conveyor switchgear anchored in your room. Watch for electrical anomalies.',
    fireHazardTitle: 'Locate & Tap the Hazard Source',
    fireHazardDesc: 'Inspect the equipment in your room. Tap the virtual fire at the motor bed to isolate the electrical ignition.',
    fireSelectTitle: 'Select Fire Extinguishing Agent',
    fireSelectBadge: 'DECISION MAKING (+15 PTS / -10 PENALTY)',
    waterName: 'Class A Water',
    waterDesc: 'Conducts electrical current · Lethal',
    foamName: 'AFFF Foam',
    foamDesc: 'Pool fuel fires only',
    abcName: 'ABC Dry Powder',
    abcDesc: 'MAP 90% · Live Electric Safe',
    co2Name: 'CO2 Gas',
    co2Desc: 'Limited drift reach',
    fireDischargeTitle: 'MANUAL ACTION (+25 PTS)',
    fireDischargeDesc: 'Align center crosshairs with the base of the virtual flame. Hold trigger to discharge pressurized powder.',
    fireSuppressing: 'SUPPRESSING FLAMES (SWEEP AT BASE)...',
    fireAimDrifted: 'AIM DRIFTED! ALIGN CROSSHAIR WITH FIRE BASE!',
    firePressHold: 'PRESS & HOLD TO DISCHARGE (P.A.S.S.)',
    fireEvacTitle: 'Secondary Hazard: Dense Smoke Influx',
    fireEvacBadge: 'EVACUATION DECISION (+15 PTS)',
    fireEvacDesc: 'Smoke is choking the right corridor. Scan your room and tap the illuminated Intake Airway (Left) to evacuate safely.',
    fireMusterTitle: 'Enter Underground Safe Chamber',
    fireMusterBadge: 'SAFE MUSTER ZONE (+20 PTS)',
    fireMusterDesc: 'Traverse toward the green cylindrical Safe Muster Station on your screen and tap to enter.',
    questionBadge: 'FINAL KNOWLEDGE EVALUATION (+10 PTS)',
    questionLabel: 'Question',

    // Gas AR
    gasDetectorTitle: 'GAS DETECTOR',
    gasAlarm: 'ALARM',
    gasInitialTitle: 'Confined Space Pipeline Header',
    gasInitialDesc: 'Virtual borehole pipe header anchored in your room. Listen for acoustic hissing pressure leak.',
    gasHazardTitle: 'Locate the Ruptured Pipe Flange',
    gasHazardBadge: 'HAZARD PINPOINTING (+15 PTS)',
    gasHazardDesc: 'Inspect the virtual piping in your room. Tap the leaking yellow flange gasket to pinpoint the toxic gas breach.',
    gasPPETitle: 'Select Confined Space Respiratory Gear',
    gasPPEBadge: 'RESPIRATORY PPE DECISION (+15 PTS / -10 PENALTY)',
    dustMaskName: 'N95 Dust Mask',
    dustMaskDesc: 'Dust only · Ineffective against gas',
    scbaName: 'SCBA Positive Pressure',
    scbaDesc: '300 Bar · Isolated Breathing Oxygen',
    bandanaName: 'Cloth Bandana',
    bandanaDesc: 'Fatal Inhalation Hazard',
    halfMaskName: 'Half-Face Cartridge',
    halfMaskDesc: 'Cannot supply oxygen in deficient air',
    gasValveTitle: 'VALVE ISOLATION (+25 PTS)',
    gasPressure: 'Pressure:',
    gasValveDesc: 'Turn the isolation wheel clockwise to shut off the gas supply. Hold the button to torque the high-pressure wheel.',
    gasTurningValve: 'TORQUING ISOLATION VALVE CLOCKWISE...',
    gasPressHoldValve: 'PRESS & HOLD TO CLOSE VALVE WHEEL',
    gasWindTitle: 'WIND EVACUATION ROUTE (+15 PTS)',
    gasWindBadge: 'Atmospheric Wind Blowing Eastward →',
    gasWindDesc: 'Do NOT travel downwind into the toxic cloud! Tap the Upwind Escapeway (Left) to evacuate into fresh intake airflow.',
    gasRefugeTitle: 'Enter Mine Refuge Chamber',
    gasRefugeBadge: 'REFUGE CHAMBER (+20 PTS)',
    gasRefugeDesc: 'Traverse toward the hermetically sealed green Refuge Chamber and tap to enter.',
  };
};
