import { TrainingModule, LanguageCode } from '../types';

export const getLocalizedModules = (lang: LanguageCode): TrainingModule[] => {
  if (lang === 'hi') {
    return [
      {
        id: 'fire-explosion',
        code: 'MOD-FE-01',
        title: 'आग एवं विस्फोट रोकथाम (Fire & Explosion)',
        shortDesc: 'भूमिगत कोयला कन्वेयर बेल्ट और विद्युत पैनल आग आपातकालीन नियंत्रण एवं PASS अग्निशामक प्रक्रिया।',
        fullDesc: 'भूमिगत कोयला खदान गैलरी में कन्वेयर मोटर घर्षण आग का सिमुलेशन। श्रमिक तात्कालिक खतरे की पहचान, विद्युत एवं कोयला ईंधन आग के लिए ABC ड्राई केमिकल पाउडर का चयन, नोजल स्वीप तकनीक और आपातकालीन निकास का अभ्यास करते हैं।',
        durationMinutes: 15,
        dgmsStandard: 'DGMS (तकनीकी) परिपत्र सं. 04 / कोयला खान विनियम (CMR) 2017 - नियम 138 (अग्निशमन एवं धूल नियंत्रण)',
        category: 'वर्ग A/B/C खदान आपात स्थिति',
        iconName: 'Flame',
        objectives: [
          {
            id: 'fe-obj-1',
            title: 'तात्कालिक खतरे की पहचान',
            description: 'कोयला धूल विस्फोट से पूर्व कन्वेयर घर्षण ताप एवं आग का तुरंत पता लगाना।'
          },
          {
            id: 'fe-obj-2',
            title: 'अग्निशामक वर्गीकरण एवं चयन',
            description: 'जल, फोम और ABC ड्राई केमिकल पाउडर में अंतर समझना तथा विद्युत झटके से बचाव।'
          },
          {
            id: 'fe-obj-3',
            title: 'PASS अग्निशमन तकनीक',
            description: 'पुल पिन, आधार पर निशाना, लीवर दबाना और दोनों तरफ स्वीप करना।'
          },
          {
            id: 'fe-obj-4',
            title: 'धुआं मुक्त निकास मार्ग',
            description: 'विषाक्त गैसों से मुक्त प्राथमिक इनटेक एयरवे आपातकालीन मार्ग की पहचान।'
          },
          {
            id: 'fe-obj-5',
            title: 'मस्टर चैंबर सुरक्षित निकासी',
            description: 'महत्वपूर्ण 3 मिनट के भीतर भूमिगत खदान मस्टर क्षेत्र में सुरक्षित पहुंचना।'
          }
        ],
        safetyPrecautions: [
          'सक्रिय विद्युत मोटर उपकरणों पर कभी भी पानी की धारा का उपयोग न करें।',
          'आग के निकट जाने से पहले हमेशा एक बार अग्निशामक का डिस्चार्ज परीक्षण करें।',
          'आग बुझाते समय अपनी पीठ के पीछे हमेशा खुला निकास मार्ग रखें।',
          'यदि लपटें 2 मीटर से अधिक ऊंची हों, तो तत्काल निकासी शुरू करें।'
        ]
      },
      {
        id: 'gas-leak',
        code: 'MOD-GL-02',
        title: 'गैस रिसाव एवं सीमित स्थान (Gas Leak & SCBA)',
        shortDesc: 'मीथेन (CH4) और हाइड्रोजन सल्फाइड (H2S) गैस रिसाव का पता लगाना एवं SCBA द्वारा आपातकालीन निकास।',
        fullDesc: 'अहवादार इनक्लाइन ड्रिफ्ट में गैस रिसाव का सिमुलेशन। श्रमिक मल्टी-गैस डिटेक्टर रीडिंग (% LEL एवं PPM) की व्याख्या, प्रमाणित SCBA श्वास उपकरण का चयन, स्पार्क रोकने हेतु पावर आइसोलेशन और रिफ्यूज स्टेशन निकासी का अभ्यास करते हैं।',
        durationMinutes: 15,
        dgmsStandard: 'DGMS परिपत्र सं. 02 / CMR 2017 - नियम 156 (वेंटिलेशन एवं ज्वलनशील गैस सावधानियां)',
        category: 'विषाक्त एवं ज्वलनशील वायुमंडलीय खतरा',
        iconName: 'ShieldAlert',
        objectives: [
          {
            id: 'gl-obj-1',
            title: 'गैस डिटेक्टर अलार्म पहचान',
            description: 'मीथेन (% LEL) और हाइड्रोजन सल्फाइड (PPM) के डिजिटल मल्टी-गैस डिटेक्टर पाठ्यांक को समझना।'
          },
          {
            id: 'gl-obj-2',
            title: 'पॉजिटिव-प्रेशर SCBA की तैनाती',
            description: 'विषाक्त गैसों के लिए साधारण धूल मास्क के स्थान पर प्रमाणित SCBA चुनना।'
          },
          {
            id: 'gl-obj-3',
            title: 'विद्युत परिपथ सुरक्षित शटडाउन',
            description: 'मीथेन युक्त हवा में चिंगारी से बचने हेतु मुख्य विद्युत स्विच तुरंत बंद करना।'
          },
          {
            id: 'gl-obj-4',
            title: 'अंडरग्राउंड बडी-सिस्टम प्रोटोकॉल',
            description: 'निकासी शुरू करने से पहले अपने साथी श्रमिक की स्थिति और तैयारी की पुष्टि करना।'
          },
          {
            id: 'gl-obj-5',
            title: 'रिफ्यूज चैंबर की ओर सुरक्षित निकासी',
            description: 'हवा के अनुकूल दिशा में सुरक्षित सीलबंद रिफ्यूज चैंबर की ओर बढ़ना।'
          }
        ],
        safetyPrecautions: [
          'H2S गैस के लिए सूंघने की क्षमता पर भरोसा न करें; 10 PPM से ऊपर गंध क्षमता समाप्त हो जाती है।',
          'विषाक्त क्षेत्र में जाने से पूर्व SCBA सिलेंडर दबाव कम से कम 200 बार सुनिश्चित करें।',
          'गैस क्षेत्रों में गैर-सुरक्षित फोन, टॉर्च स्विच या लोहे के औजारों का उपयोग न करें।',
          'हमेशा इनटेक वेंटिलेशन एयरवे की ओर आगे बढ़ें।'
        ]
      }
    ];
  }

  if (lang === 'sat') {
    return [
      {
        id: 'fire-explosion',
        code: 'MOD-FE-01',
        title: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱥᱯᱷᱳᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ (Fire & Explosion)',
        shortDesc: 'ᱠᱷᱟᱫᱟᱱ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱟᱨ ᱠᱟᱨᱮᱱᱴ ᱵᱳᱨᱰ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱨ PASS ᱦᱚᱨᱟ᱾',
        fullDesc: 'ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱢᱳᱴᱚᱨ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ᱾ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ, ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱵᱟᱪᱷᱟᱣ, PASS ᱦᱚᱨᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱛᱮ ᱫᱟᱹᱲ ᱠᱚ ᱪᱮᱫᱚᱜ-ᱟ᱾',
        durationMinutes: 15,
        dgmsStandard: 'DGMS ᱠᱷᱟᱫᱟᱱ ᱟᱹᱭᱤᱱ (CMR) ᱒᱐᱑᱗ - ᱟᱹᱨᱤ ᱑᱓᱘ (ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱨ ᱫᱷᱩᱲᱤ ᱟᱴᱠᱟᱣ)',
        category: 'ᱛᱷᱟᱨ A/B/C ᱠᱷᱟᱫᱟᱱ ᱟᱯᱚᱛᱠᱟᱞ',
        iconName: 'Flame',
        objectives: [
          {
            id: 'fe-obj-1',
            title: 'ᱵᱤᱯᱚᱫᱽ ᱞᱚᱜᱚᱱ ᱪᱤᱱᱦᱟᱹᱣ',
            description: 'ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱥᱮᱸᱜᱮᱞᱚᱜ ᱢᱟᱬᱟᱝ ᱨᱮ ᱜᱟᱹᱰᱤ ᱞᱚᱞᱚ ᱪᱤᱱᱦᱟᱹᱣ᱾'
          },
          {
            id: 'fe-obj-2',
            title: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱡᱤᱱᱤᱥ ᱵᱟᱪᱷᱟᱣ',
            description: 'ᱫᱟᱜ, ᱯᱷᱳᱢ ᱟᱨ ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱨᱮᱱᱟᱜ ᱵᱷᱮᱜᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ᱾'
          },
          {
            id: 'fe-obj-3',
            title: 'PASS ᱦᱚᱨᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ',
            description: 'ᱯᱤᱱ ᱚᱨ, ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱱᱤᱥᱟᱱᱟ, ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ ᱟᱨ ᱯᱟᱥᱱᱟᱣ᱾'
          },
          {
            id: 'fe-obj-4',
            title: 'ᱫᱷᱩᱶᱟᱹ ᱵᱟᱹᱱᱩᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ',
            description: 'ᱵᱤᱥ ᱜᱮᱥ ᱵᱟᱹᱱᱩᱜ ᱢᱟᱨᱥᱟᱞ ᱰᱟᱦᱟᱨ ᱪᱤᱱᱦᱟᱹᱣ᱾'
          },
          {
            id: 'fe-obj-5',
            title: 'ᱢᱟᱥᱴᱟᱨ ᱪᱮᱢᱵᱟᱨ ᱛᱮ ᱫᱟᱹᱲ',
            description: '᱓ ᱴᱤᱲᱤᱡ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ ᱛᱮ ᱥᱮᱴᱮᱨᱚᱜ᱾'
          }
        ],
        safetyPrecautions: [
          'ᱠᱟᱨᱮᱱᱴ ᱢᱮᱱᱟᱜ ᱢᱳᱴᱚᱨ ᱨᱮ ᱫᱟᱜ ᱫᱚ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱫᱩᱞᱟ᱾',
          'ᱥᱮᱸᱜᱮᱞ ᱥᱩᱨ ᱪᱟᱞᱟᱜ ᱢᱟᱬᱟᱝ ᱨᱮ ᱯᱟᱣᱰᱟᱨ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱧᱮᱞ ᱢᱮ᱾',
          'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱡᱚᱠᱷᱟᱜ ᱛᱟᱭᱚᱢ ᱥᱮᱫ ᱰᱟᱦᱟᱨ ᱠᱷᱩᱞᱟᱹ ᱫᱚᱦᱚᱭ ᱢᱮ᱾',
          'ᱥᱮᱸᱜᱮᱞ ᱡᱩᱫᱤ ᱒ ᱢᱤᱴᱟᱨ ᱠᱷᱚᱱ ᱪᱮᱛᱟᱱᱚᱜ-ᱟ, ᱮᱱᱠᱷᱟᱱ ᱞᱚᱜᱚᱱ ᱫᱟᱹᱲ ᱢᱮ᱾'
        ]
      },
      {
        id: 'gas-leak',
        code: 'MOD-GL-02',
        title: 'ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ (Gas Leak & SCBA)',
        shortDesc: 'ᱢᱤᱛᱷᱮᱱ (CH4) ᱟᱨ H2S ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ SCBA ᱢᱩᱴᱷᱟᱹᱱ ᱛᱮ ᱵᱟᱧᱪᱟᱣ᱾',
        fullDesc: 'ᱚᱛ ᱞᱟᱛᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱚᱰᱚᱠᱚᱜ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ᱾ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱯᱟᱲᱦᱟᱣ, SCBA ᱢᱩᱴᱷᱟᱹᱱ ᱵᱮᱵᱷᱟᱨ, ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱟᱨ ᱨᱤᱯᱷᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱛᱮ ᱫᱟᱹᱲ ᱠᱚ ᱪᱮᱫᱚᱜ-ᱟ᱾',
        durationMinutes: 15,
        dgmsStandard: 'DGMS ᱟᱹᱭᱤᱱ ᱐᱒ / CMR ᱒᱐᱑᱗ - ᱟᱹᱨᱤ ᱑᱕᱖ (ᱦᱚᱭ ᱪᱟᱞᱟᱣ ᱟᱨ ᱡᱩᱞᱩᱜ ᱜᱮᱥ ᱥᱟᱵᱽᱫᱷᱟᱱᱤ)',
        category: 'ᱵᱤᱥ ᱟᱨ ᱡᱩᱞᱩᱜ ᱦᱚᱭ ᱵᱤᱯᱚᱫᱽ',
        iconName: 'ShieldAlert',
        objectives: [
          {
            id: 'gl-obj-1',
            title: 'ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱨᱟᱜ ᱪᱤᱱᱦᱟᱹᱣ',
            description: 'CH4 (% LEL) ᱟᱨ H2S (PPM) ᱰᱤᱡᱤᱴᱟᱞ ᱮᱞ ᱵᱩᱡᱷᱟᱹᱣ᱾'
          },
          {
            id: 'gl-obj-2',
            title: 'SCBA ᱢᱩᱴᱷᱟᱹᱱ ᱵᱮᱵᱷᱟᱨ',
            description: 'ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ SCBA ᱢᱩᱴᱷᱟᱹᱱ ᱵᱟᱪᱷᱟᱣ᱾'
          },
          {
            id: 'gl-obj-3',
            title: 'ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱪᱤᱴᱠᱟᱹᱣ ᱟᱴᱠᱟᱣ',
            description: 'ᱜᱮᱥ ᱡᱩᱞᱩᱜ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱢᱮᱱ ᱥᱣᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ᱾'
          },
          {
            id: 'gl-obj-4',
            title: 'ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ (Buddy) ᱧᱮᱞᱮ ᱢᱮ',
            description: 'ᱫᱟᱹᱲ ᱢᱟᱬᱟᱝ ᱨᱮ ᱟᱢ ᱥᱟᱶ ᱢᱮᱱᱟᱭ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱶ ᱨᱚᱯᱚᱲ ᱢᱮ᱾'
          },
          {
            id: 'gl-obj-5',
            title: 'ᱨᱤᱯᱷᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱛᱮ ᱫᱟᱹᱲ',
            description: 'ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱥᱮᱫ ᱛᱮ ᱨᱤᱯᱷᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ᱾'
          }
        ],
        safetyPrecautions: [
          'H2S ᱜᱮᱥ ᱞᱟᱹᱜᱤᱫ ᱥᱚ ᱪᱮᱛᱟᱱ ᱨᱮ ᱟᱞᱚᱢ ᱯᱟᱹᱛᱭᱟᱹᱣᱜ-ᱟ; ᱑᱐ PPM ᱪᱮᱛᱟᱱ ᱨᱮ ᱥᱚ ᱵᱟᱝ ᱵᱩᱡᱷᱟᱹᱣᱜ-ᱟ᱾',
          'ᱵᱤᱥ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱨᱮ SCBA ᱨᱮ ᱒᱐᱐ ᱵᱟᱨ ᱪᱮᱛᱟᱱ ᱦᱚᱭ ᱢᱮᱱᱟᱜ ᱥᱟᱹᱵᱤᱛ ᱢᱮ᱾',
          'ᱜᱮᱥ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱯᱷᱚᱱ ᱟᱨ ᱢᱮᱬᱦᱮᱫ ᱡᱤᱱᱤᱥ ᱟᱞᱚᱢ ᱠᱩᱴᱟᱹᱢᱟ᱾',
          'ᱥᱟᱨᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱥᱮᱫ ᱜᱮ ᱪᱟᱞᱟᱜ ᱢᱮ᱾'
        ]
      }
    ];
  }

  // English fallback
  return [
    {
      id: 'fire-explosion',
      code: 'MOD-FE-01',
      title: 'Fire & Explosion Response',
      shortDesc: 'Underground coal conveyor belt & electrical panel deflagration containment with PASS fire extinguisher protocol.',
      fullDesc: 'Simulates a critical conveyor motor friction fire in an underground coal mine gallery. Workers practice immediate hazard recognition, selection of ABC dry chemical powder extinguishers for electrical/coal fuel fires, precision nozzle sweep techniques, escapeway identification, and muster chamber evacuation under smoke conditions.',
      durationMinutes: 15,
      dgmsStandard: 'DGMS (Tech) Circular No. 04 / Coal Mines Regulations (CMR) 2017 - Regulation 138 (Fire Fighting & Dust Suppressors)',
      category: 'Class A/B/C Mine Emergency',
      iconName: 'Flame',
      objectives: [
        {
          id: 'fe-obj-1',
          title: 'Immediate Hazard Identification',
          description: 'Detect friction heat and conveyor ignition before secondary coal dust deflagration occurs.'
        },
        {
          id: 'fe-obj-2',
          title: 'Extinguisher Media Classification',
          description: 'Distinguish between water, foam, and ABC dry chemical powder, recognizing electrical shock hazards.'
        },
        {
          id: 'fe-obj-3',
          title: 'PASS Fire Suppression Technique',
          description: 'Execute Pull pin, Aim at base of fire, Squeeze handle, and Sweep side-to-side.'
        },
        {
          id: 'fe-obj-4',
          title: 'Smoke Egress & Emergency Exit Pathway',
          description: 'Identify the illuminated primary intake airway escapeway free of toxic combustion gases.'
        },
        {
          id: 'fe-obj-5',
          title: 'Muster Chamber Evacuation',
          description: 'Reach the designated underground mine muster zone within the critical 3-minute survival window.'
        }
      ],
      safetyPrecautions: [
        'Never use water stream on energized electrical motor equipment.',
        'Always test extinguisher discharge once before approaching the flame source.',
        'Maintain an unblocked escape path behind your back while extinguishing.',
        'If flames flash upward more than 2 meters, abandon direct fight and execute immediate evacuation.'
      ]
    },
    {
      id: 'gas-leak',
      code: 'MOD-GL-02',
      title: 'Gas Leak & Confined Space',
      shortDesc: 'Methane (CH4) & Hydrogen Sulfide (H2S) toxic gas pocket detection and positive-pressure SCBA emergency egress.',
      fullDesc: 'Simulates an atmospheric gas influx in an unventilated incline drift during drilling operations. Workers must interpret multi-gas detector readings (% LEL and toxic PPM thresholds), select certified Self-Contained Breathing Apparatus (SCBA), trigger intrinsic electrical lockdown to eliminate ignition sparks, confirm buddy worker safety, and withdraw upwind to the underground refuge station.',
      durationMinutes: 15,
      dgmsStandard: 'DGMS Circular No. 02 / CMR 2017 - Regulation 156 (Ventilation & Inflammable Gas Precautions)',
      category: 'Toxic & Flammable Atmospheric Hazard',
      iconName: 'ShieldAlert',
      objectives: [
        {
          id: 'gl-obj-1',
          title: 'Atmospheric Gas Alarm Recognition',
          description: 'Interpret digital multi-gas detector readouts for Methane (% LEL) and Hydrogen Sulfide (PPM).'
        },
        {
          id: 'gl-obj-2',
          title: 'Positive-Pressure SCBA Deployment',
          description: 'Reject particulate dust masks in favor of certified positive-pressure breathing apparatus.'
        },
        {
          id: 'gl-obj-3',
          title: 'Intrinsically Safe Power Isolation',
          description: 'Activate flameproof circuit isolation to eliminate sparks in methane-rich air.'
        },
        {
          id: 'gl-obj-4',
          title: 'Underground Buddy-System Protocol',
          description: 'Verify visual contact and physical readiness of paired coworker before initiating egress.'
        },
        {
          id: 'gl-obj-5',
          title: 'Upwind Evacuation to Refuge Chamber',
          description: 'Traverse upwind through intake air courses into the hermetically sealed refuge chamber.'
        }
      ],
      safetyPrecautions: [
        'Do not rely on sense of smell for Hydrogen Sulfide; olfactory fatigue occurs rapidly above 10 PPM.',
        'Ensure SCBA cylinder pressure indicates at least 200 bar before entering toxic atmosphere.',
        'Never operate unsealed cell phones, torch switches, or ferrous metal striking tools in gas zones.',
        'Always move toward intake ventilation aircourses (upwind) away from return airways.'
      ]
    }
  ];
};

export const TRAINING_MODULES = getLocalizedModules('en');
