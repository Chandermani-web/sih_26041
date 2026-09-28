import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  login: {
    title: string;
    subtitle: string;
    workerIdLabel: string;
    workerIdPlaceholder: string;
    pinLabel: string;
    pinPlaceholder: string;
    rememberMe: string;
    submitButton: string;
    demoWorkerButton: string;
    offlineIndicator: string;
    invalidCredentials: string;
    jharkhandGovt: string;
    sihTag: string;
  };
  home: {
    greeting: string;
    department: string;
    site: string;
    progressTitle: string;
    completedModules: string;
    activeCertificates: string;
    complianceScore: string;
    startTrainingCTA: string;
    trainingModulesTitle: string;
    trainingHistoryTitle: string;
    offlineReadyBadge: string;
    dgmsCompliance: string;
  };
  modules: {
    fireTitle: string;
    fireShortDesc: string;
    gasTitle: string;
    gasShortDesc: string;
    durationMinutes: string;
    startModule: string;
    startARSimulation: string;
    objectivesTitle: string;
    precautionsTitle: string;
    safetyStandard: string;
    backToList: string;
  };
  ar: {
    scanningNotice: string;
    moveSlowly: string;
    surfaceDetected: string;
    tapToPlace: string;
    scenarioPlaced: string;
    stepIndicator: string;
    scoreLabel: string;
    pauseSimulation: string;
    resumeSimulation: string;
    exitAR: string;
    confirmExit: string;
    trackingQuality: string;
    qualityGood: string;
    qualityPoor: string;
    cameraError: string;
    retryCamera: string;
    useSimulatedCamera: string;
    cameraPermissionDenied: string;
  };
  fireSteps: {
    step1Title: string;
    step1Instruction: string;
    step1Action: string;
    step1Success: string;
    
    step2Title: string;
    step2Instruction: string;
    extinguisherWater: string;
    extinguisherFoam: string;
    extinguisherDryPowder: string;
    extinguisherCO2: string;
    step2Success: string;
    step2Penalty: string;

    step3Title: string;
    step3Instruction: string;
    step3AimAtBase: string;
    step3Extinguishing: string;
    step3Success: string;

    step4Title: string;
    step4Instruction: string;
    step4Action: string;
    step4Success: string;

    step5Title: string;
    step5Instruction: string;
    step5Evacuate: string;
    step5Success: string;
  };
  gasSteps: {
    step1Title: string;
    step1Instruction: string;
    step1Action: string;
    step1Success: string;

    step2Title: string;
    step2Instruction: string;
    ppeDustMask: string;
    ppeSCBA: string;
    ppeClothMask: string;
    ppeHalfMask: string;
    step2Success: string;
    step2Penalty: string;

    step3Title: string;
    step3Instruction: string;
    step3Action: string;
    step3Success: string;

    step4Title: string;
    step4Instruction: string;
    step4Action: string;
    step4Success: string;

    step5Title: string;
    step5Instruction: string;
    step5Evacuate: string;
    step5Success: string;
  };
  scoring: {
    resultTitle: string;
    passedBadge: string;
    failedBadge: string;
    finalScore: string;
    passingScore: string;
    performanceBreakdown: string;
    retryButton: string;
    viewCertificateButton: string;
    returnHome: string;
    weakAreasTitle: string;
    strongAreasTitle: string;
  };
  certificate: {
    header: string;
    subHeader: string;
    stateName: string;
    directorate: string;
    title: string;
    certifiesThat: string;
    workerId: string;
    hasCompleted: string;
    scoreAchieved: string;
    issuedOn: string;
    certificateId: string;
    validity: string;
    authorizedSignatory: string;
    qrInstruction: string;
    downloadBtn: string;
    printBtn: string;
    backBtn: string;
  };
  history: {
    title: string;
    emptyText: string;
    score: string;
    date: string;
    status: string;
    actions: string;
    viewCert: string;
    clearRecords: string;
  };
  androidDev: {
    title: string;
    subtitle: string;
    fileTree: string;
    architectureOverview: string;
    gradleNotice: string;
    codeViewerTitle: string;
  };
  nav: {
    portals: string;
    workerApp: string;
    adminDashboard: string;
    publicVerification: string;
    clearLogins: string;
    deviceFrame: string;
    fullScreen: string;
  };
  portalGate: {
    sihTag: string;
    heroTitle: string;
    heroSubtitle: string;
    regionLabel: string;
    standardLabel: string;
    passingGradeLabel: string;
    executionLabel: string;
    portalsTitle: string;
    portalsSubtitle: string;
    signOutAll: string;
    workerPortalTag: string;
    workerPortalTitle: string;
    workerPortalDesc: string;
    workerBtn: string;
    workerContinueBtn: string;
    adminPortalTag: string;
    adminPortalTitle: string;
    adminPortalDesc: string;
    adminBtn: string;
    adminContinueBtn: string;
    publicCertTitle: string;
    publicCertDesc: string;
    verifyBtn: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: "AR-SAFE",
    appSubtitle: "Jharkhand Industrial Safety Training Simulator",
    login: {
      title: "Worker Safety Portal",
      subtitle: "Augmented Reality Training & Certification System",
      workerIdLabel: "Worker Identification Number",
      workerIdPlaceholder: "e.g. JH-W-001",
      pinLabel: "Security PIN / Passcode",
      pinPlaceholder: "Enter 4-digit PIN",
      rememberMe: "Remember my login on this device",
      submitButton: "Authenticate & Enter",
      demoWorkerButton: "Demo Worker: Rahul Kumar (JH-W-001)",
      offlineIndicator: "Local Offline Storage Mode Enabled",
      invalidCredentials: "Enter valid Worker ID (e.g. JH-W-001) and PIN (1234)",
      jharkhandGovt: "Dept. of Mines & Geology, Govt. of Jharkhand",
      sihTag: "Smart India Hackathon 2026 Prototype"
    },
    home: {
      greeting: "Welcome, Sh.",
      department: "Mining Operations & Conveyor Systems",
      site: "Bokaro Steel & Coal Belt Mine Site-04",
      progressTitle: "Safety Readiness & Competency",
      completedModules: "Completed Modules",
      activeCertificates: "Digital Certificates",
      complianceScore: "DGMS Compliance Rating",
      startTrainingCTA: "Launch AR Simulation",
      trainingModulesTitle: "Mandatory Safety Modules",
      trainingHistoryTitle: "Training Logs & Evaluation",
      offlineReadyBadge: "100% Offline Capable",
      dgmsCompliance: "DGMS Standard: Circular No. 04 / 2026 Compliant"
    },
    modules: {
      fireTitle: "Fire & Explosion Response",
      fireShortDesc: "Underground Conveyor & Electrical Panel Deflagration drill with PASS extinguisher interaction.",
      gasTitle: "Gas Leak & Confined Space",
      gasShortDesc: "Methane (CH4) & Hydrogen Sulfide (H2S) toxic gas leak protocol and SCBA emergency evacuation.",
      durationMinutes: "12 - 15 Mins",
      startModule: "Module Overview",
      startARSimulation: "Start AR Simulator",
      objectivesTitle: "Core Safety Objectives",
      precautionsTitle: "Standard Operating Procedures (SOP)",
      safetyStandard: "DGMS / Mines Act 1952 Safety Protocol",
      backToList: "Return to Modules"
    },
    ar: {
      scanningNotice: "Surface Scanner Initialized",
      moveSlowly: "Move your phone slowly to scan the floor surface...",
      surfaceDetected: "Horizontal Plane Detected. Ready for 3D placement.",
      tapToPlace: "Tap anywhere on the reticle to place scenario",
      scenarioPlaced: "Hazard Scenario Anchored in 3D Space",
      stepIndicator: "Scenario Step",
      scoreLabel: "Safety Score",
      pauseSimulation: "Pause",
      resumeSimulation: "Resume",
      exitAR: "Exit AR",
      confirmExit: "Are you sure you want to abort the AR simulation? Progress in this session will not be saved.",
      trackingQuality: "ARCore Tracking",
      qualityGood: "Optimal (Spatial Mesh Locked)",
      qualityPoor: "Low Lighting / Re-scan Surface",
      cameraError: "Unable to access rear camera device.",
      retryCamera: "Retry Camera Access",
      useSimulatedCamera: "Use High-Precision Synthetic Feed",
      cameraPermissionDenied: "Camera permission is required for AR spatial tracking."
    },
    fireSteps: {
      step1Title: "STEP 1: Hazard Identification",
      step1Instruction: "Locate the ignition source on the coal conveyor belt and tap the hazard marker to alert the shift supervisor.",
      step1Action: "Identify Fire Hazard",
      step1Success: "Hazard identified! Electric conveyor motor fire isolated (+20 pts).",
      
      step2Title: "STEP 2: Select Extinguisher",
      step2Instruction: "Select the appropriate fire extinguisher for electrical and Class A/B coal fires.",
      extinguisherWater: "Class A Water Extinguisher",
      extinguisherFoam: "AFFF Foam Extinguisher",
      extinguisherDryPowder: "ABC Dry Chemical Powder (MAP 90%)",
      extinguisherCO2: "Carbon Dioxide (CO2) Gas",
      step2Success: "Correct! ABC Dry Chemical Powder prevents electrical shock & re-flash (+20 pts).",
      step2Penalty: "Incorrect extinguisher for live electrical mine conveyor! Severe shock risk (-10 pts).",

      step3Title: "STEP 3: PASS Fire Suppression",
      step3Instruction: "Point the discharge nozzle at the base of the virtual fire and trigger the sweep lever.",
      step3AimAtBase: "Sweep at base of flames",
      step3Extinguishing: "Discharging ABC agent...",
      step3Success: "Flames fully suppressed with correct sweep technique (+30 pts).",

      step4Title: "STEP 4: Emergency Exit Navigation",
      step4Instruction: "Identify the primary intake airway emergency exit illuminated marker.",
      step4Action: "Select Emergency Exit Route",
      step4Success: "Primary intake escapeway verified clear of smoke (+20 pts).",

      step5Title: "STEP 5: Safe Zone Evacuation",
      step5Instruction: "Navigate along the illuminated escape pathway to the designated Safe Muster Point.",
      step5Evacuate: "Enter Safe Muster Zone",
      step5Success: "Safely reached Mine Muster Chamber! Evacuation complete (+20 pts)."
    },
    gasSteps: {
      step1Title: "STEP 1: Gas Hazard Detection",
      step1Instruction: "Multi-gas detector alarm triggered! Read the atmospheric levels (CH4 & H2S) and acknowledge danger.",
      step1Action: "Acknowledge Hazardous Gas Alarm",
      step1Success: "Gas danger acknowledged: CH4 at 2.4% LEL, H2S at 18 PPM (+20 pts).",

      step2Title: "STEP 2: Critical PPE Selection",
      step2Instruction: "Select the mandatory respiratory personal protective equipment for toxic gas concentration.",
      ppeDustMask: "N95 Particulate Dust Mask",
      ppeSCBA: "Self-Contained Breathing Apparatus (SCBA Positive Pressure)",
      ppeClothMask: "Cotton Face Covering",
      ppeHalfMask: "Single Cartridge Organic Half Mask",
      step2Success: "Correct! Positive-pressure SCBA prevents toxic H2S asphyxiation (+20 pts).",
      step2Penalty: "Unsafe PPE! Dust masks offer zero protection against toxic mine gases (-10 pts).",

      step3Title: "STEP 3: Atmospheric Isolation & Spark Lockdown",
      step3Instruction: "Deploy the intrinsic safety lockdown protocol to de-energize potential spark sources.",
      step3Action: "Trigger Intrinsically Safe Power Cutoff",
      step3Success: "Electrical circuits de-energized; anti-spark ventilation engaged (+20 pts).",

      step4Title: "STEP 4: Buddy System & Muster Alert",
      step4Instruction: "Confirm your assigned buddy worker's headcount and signal the surface control room.",
      step4Action: "Confirm Buddy System Status",
      step4Success: "Buddy worker secured and communication relayed (+20 pts).",

      step5Title: "STEP 5: Safe Zone Evacuation",
      step5Instruction: "Evacuate upwind through the sealed drift tunnel to the underground refuge chamber.",
      step5Evacuate: "Enter Underground Refuge Chamber",
      step5Success: "Refuge chamber safely sealed. Air scrubber operational (+20 pts)."
    },
    scoring: {
      resultTitle: "Training Assessment Report",
      passedBadge: "CERTIFIED / PASSED",
      failedBadge: "RE-TRAINING REQUIRED / FAILED",
      finalScore: "Total Score",
      passingScore: "Passing Benchmark",
      performanceBreakdown: "Rule-Based Competency Breakdown",
      retryButton: "Retry AR Simulation",
      viewCertificateButton: "View Official Digital Certificate",
      returnHome: "Return to Dashboard",
      weakAreasTitle: "Identified Hazard Gaps",
      strongAreasTitle: "Validated Safety Competencies"
    },
    certificate: {
      header: "GOVERNMENT OF JHARKHAND",
      subHeader: "DIRECTORATE GENERAL OF MINES & INDUSTRIAL SAFETY",
      stateName: "State Safety Training Council · Ranchi",
      directorate: "Mining & Heavy Manufacturing Division",
      title: "DIGITAL SAFETY COMPETENCY CERTIFICATE",
      certifiesThat: "This is to officially certify that",
      workerId: "Worker Identification No.",
      hasCompleted: "has successfully demonstrated practical competency in simulated Augmented Reality under DGMS safety norms for:",
      scoreAchieved: "Evaluation Score",
      issuedOn: "Date of Certification",
      certificateId: "Certificate ID",
      validity: "Validity: 12 Months",
      authorizedSignatory: "Director of Mines Safety, Jharkhand",
      qrInstruction: "Scan QR code to verify validity on the State Mining Safety Registry",
      downloadBtn: "Download Certificate (PNG)",
      printBtn: "Print Certificate",
      backBtn: "Back to Home"
    },
    history: {
      title: "Worker Training History",
      emptyText: "No training simulations completed yet. Complete a module to earn a certificate.",
      score: "Score",
      date: "Date Completed",
      status: "Result",
      actions: "Action",
      viewCert: "Certificate",
      clearRecords: "Reset History"
    },
    androidDev: {
      title: "Android Native Architecture & Gradle Project",
      subtitle: "Production Jetpack Compose + ARCore SDK Codebase (com.arsafe.jharkhand)",
      fileTree: "Android Project Tree",
      architectureOverview: "Clean Architecture: UI → ViewModels → Use Cases → ARCore Layer → Room DB",
      gradleNotice: "Ready to open in Android Studio Hedgehog / Iguana / Jellyfish with Kotlin 2.0 & AGP 8.5",
      codeViewerTitle: "Native Kotlin Source Code"
    },
    nav: {
      portals: "Portals",
      workerApp: "Worker App",
      adminDashboard: "Admin Dashboard",
      publicVerification: "Public Verification",
      clearLogins: "Clear Logins",
      deviceFrame: "Device Frame",
      fullScreen: "Full Screen"
    },
    portalGate: {
      sihTag: "Smart India Hackathon 2026 · Problem Statement: SIH26041",
      heroTitle: "AR-SAFE INDUSTRIAL SAFETY SIMULATOR",
      heroSubtitle: "Vocational Training & Rule-Based Competency System for Underground Coal Mines, Incline Shafts, and Heavy Manufacturing Plants in Jharkhand.",
      regionLabel: "Bokaro • Dhanbad • Ranchi",
      standardLabel: "DGMS CMR 2017",
      passingGradeLabel: "80 / 100 Strictly",
      executionLabel: "100% Offline Capable",
      portalsTitle: "Select Authorized Portal",
      portalsSubtitle: "Isolated user sessions for miners and state safety inspectors.",
      signOutAll: "Sign out of all sessions",
      workerPortalTag: "VOCATIONAL TRAINING & AR ASSESSMENT",
      workerPortalTitle: "WORKER MOBILE AR APPLICATION",
      workerPortalDesc: "Real-time device camera spatial AR simulation. Workers perform hands-on hazard identification, PPE selection, P.A.S.S. fire suppression, toxic methane gas valve isolation, and instant DGMS competency scoring.",
      workerBtn: "Enter Worker Portal",
      workerContinueBtn: "Open Worker Training Area",
      adminPortalTag: "DGMS REGULATORY COMPLIANCE SYSTEM",
      adminPortalTitle: "ADMIN INSPECTORATE DASHBOARD",
      adminPortalDesc: "Designed for DGMS Safety Directors & Mine Supervisors. Real-time audit logs, state-wide pass-fail analytics, worker registry database, and on-demand certificate validation or revocation.",
      adminBtn: "Inspector Login",
      adminContinueBtn: "Enter Admin Dashboard",
      publicCertTitle: "DGMS Competency Certificate Verification",
      publicCertDesc: "Mining employers, labor contractors, and site safety engineers can verify authentic certificates instantly by Certificate ID or QR scan without requiring an account.",
      verifyBtn: "Verify Certificate ID / QR"
    }
  },
  hi: {
    appName: "AR-SAFE",
    appSubtitle: "झारखंड औद्योगिक सुरक्षा प्रशिक्षण सिम्युलेटर",
    login: {
      title: "श्रमिक सुरक्षा पोर्टल",
      subtitle: "ऑगमेंटेड रियलिटी (AR) सुरक्षा प्रशिक्षण एवं प्रमाणन प्रणाली",
      workerIdLabel: "श्रमिक पहचान संख्या (Worker ID)",
      workerIdPlaceholder: "उदा. JH-W-001",
      pinLabel: "सुरक्षा पिन / पासवर्ड",
      pinPlaceholder: "4-अंकों का पिन दर्ज करें",
      rememberMe: "इस डिवाइस पर मुझे याद रखें",
      submitButton: "प्रवेश करें",
      demoWorkerButton: "डेमो श्रमिक: राहुल कुमार (JH-W-001)",
      offlineIndicator: "लोकल ऑफलाइन मोड सक्रिय (इंटरनेट की आवश्यकता नहीं)",
      invalidCredentials: "कृपया सही Worker ID (उदा. JH-W-001) और पिन (1234) दर्ज करें",
      jharkhandGovt: "खान एवं भूतत्व विभाग, झारखंड सरकार",
      sihTag: "स्मार्ट इंडिया हैकथॉन 2026 प्रोटोटाइप"
    },
    home: {
      greeting: "नमस्ते, श्री",
      department: "खनन संचालन एवं कन्वेयर सिस्टम",
      site: "बोकारो स्टील एवं कोल बेल्ट खदान क्षेत्र-04",
      progressTitle: "सुरक्षा तत्परता एवं दक्षता",
      completedModules: "पूर्ण मॉड्यूल",
      activeCertificates: "डिजिटल प्रमाणपत्र",
      complianceScore: "DGMS सुरक्षा रेटिंग",
      startTrainingCTA: "AR प्रशिक्षण प्रारंभ करें",
      trainingModulesTitle: "अनिवार्य सुरक्षा मॉड्यूल",
      trainingHistoryTitle: "प्रशिक्षण रिकॉर्ड एवं मूल्यांकन",
      offlineReadyBadge: "100% ऑफलाइन सक्षम",
      dgmsCompliance: "DGMS मानक: परिपत्र संख्या 04 / 2026 अनुपालन"
    },
    modules: {
      fireTitle: "आग एवं विस्फोट रोकथाम",
      fireShortDesc: "भूमिगत कन्वेयर और इलेक्ट्रिकल पैनल आग आपातकालीन प्रतिक्रिया ड्रिल (PASS विधि)।",
      gasTitle: "गैस रिसाव एवं सीमित स्थान",
      gasShortDesc: "मीथेन (CH4) और हाइड्रोजन सल्फाइड (H2S) गैस रिसाव एवं SCBA आपातकालीन निकासी।",
      durationMinutes: "12 - 15 मिनट",
      startModule: "मॉड्यूल विवरण",
      startARSimulation: "AR सिमुलेशन शुरू करें",
      objectivesTitle: "प्रमुख सुरक्षा उद्देश्य",
      precautionsTitle: "मानक संचालन प्रक्रियाएं (SOP)",
      safetyStandard: "DGMS / खान अधिनियम 1952 सुरक्षा मानक",
      backToList: "मॉड्यूल सूची पर वापस जाएं"
    },
    ar: {
      scanningNotice: "सतह स्कैनर प्रारंभ",
      moveSlowly: "फर्श की सतह को स्कैन करने के लिए फोन को धीरे-धीरे घुमाएं...",
      surfaceDetected: "समतल सतह का पता चला। 3D सिमुलेशन स्थापित करने के लिए तैयार।",
      tapToPlace: "सिनेरियो स्थापित करने के लिए स्क्रीन पर टैप करें",
      scenarioPlaced: "खतरा सिनेरियो 3D स्पेस में स्थापित किया गया",
      stepIndicator: "सिनेरियो चरण",
      scoreLabel: "सुरक्षा स्कोर",
      pauseSimulation: "रोकें",
      resumeSimulation: "जारी रखें",
      exitAR: "AR से बाहर निकलें",
      confirmExit: "क्या आप AR सिमुलेशन छोड़ना चाहते हैं? इस सत्र की प्रगति सहेजी नहीं जाएगी।",
      trackingQuality: "ARCore ट्रैकिंग",
      qualityGood: "उत्कृष्ट (स्थानिक ट्रैकिंग लॉक)",
      qualityPoor: "कम रोशनी / पुनः स्कैन करें",
      cameraError: "कैमरा डिवाइस प्रारंभ करने में असमर्थ।",
      retryCamera: "कैमरा पुनः प्रयास करें",
      useSimulatedCamera: "सिंथेटिक कैमरा फ़ीड का उपयोग करें",
      cameraPermissionDenied: "AR ट्रैकिंग के लिए कैमरा अनुमति अनिवार्य है।"
    },
    fireSteps: {
      step1Title: "चरण 1: खतरे की पहचान",
      step1Instruction: "कोयला कन्वेयर बेल्ट पर आग के स्रोत का पता लगाएं और खतरे के मार्कर पर टैप करें।",
      step1Action: "आग के खतरे को चिह्नित करें",
      step1Success: "खतरे की पहचान की गई! इलेक्ट्रिकल मोटर आग सुरक्षित रूप से चिह्नित (+20 अंक)।",
      
      step2Title: "चरण 2: अग्निशामक यंत्र का चयन",
      step2Instruction: "इलेक्ट्रिकल और कोयला आग के लिए उपयुक्त अग्निशामक यंत्र चुनें।",
      extinguisherWater: "वर्ग 'A' जल अग्निशामक",
      extinguisherFoam: "AFFF फोम अग्निशामक",
      extinguisherDryPowder: "ABC ड्राई केमिकल पाउडर (MAP 90%)",
      extinguisherCO2: "कार्बन डाइऑक्साइड (CO2) गैस",
      step2Success: "सटीक! ABC ड्राई पाउडर बिजली के झटके और पुनः आग लगने से बचाता है (+20 अंक)।",
      step2Penalty: "गलत अग्निशामक! लाइव बिजली पर पानी/गलत यंत्र से झटका लगने का गंभीर जोखिम (-10 अंक)।",

      step3Title: "चरण 3: PASS अग्निशामक क्रिया",
      step3Instruction: "नोजल को आग के आधार पर केंद्रित करें और स्वीप लीवर दबाकर आग बुझाएं।",
      step3AimAtBase: "आग के आधार पर छिड़काव करें",
      step3Extinguishing: "ड्राई पाउडर का छिड़काव जारी है...",
      step3Success: "सही तकनीक द्वारा आग पर पूरी तरह काबू पा लिया गया (+30 अंक)।",

      step4Title: "चरण 4: आपातकालीन निकास मार्ग",
      step4Instruction: "धुएं से मुक्त प्राथमिक वायु सेवन आपातकालीन निकास मार्कर की पहचान करें।",
      step4Action: "आपातकालीन निकास मार्ग चुनें",
      step4Success: "प्राथमिक निकास मार्ग सुरक्षित पाया गया (+20 अंक)।",

      step5Title: "चरण 5: सुरक्षित क्षेत्र में निकासी",
      step5Instruction: "प्रकाशित मार्ग का अनुसरण करते हुए निर्धारित सुरक्षित मस्टर पॉइंट तक पहुंचें।",
      step5Evacuate: "सुरक्षित मस्टर क्षेत्र में प्रवेश करें",
      step5Success: "सुरक्षित आश्रय स्थल तक सफलतापूर्वक पहुंचे! निकासी पूर्ण (+20 अंक)।"
    },
    gasSteps: {
      step1Title: "चरण 1: गैस रिसाव का पता लगाना",
      step1Instruction: "गैस डिटेक्टर अलार्म बज उठा! वायुमंडलीय स्तर (CH4 और H2S) की जांच करें और खतरे की पुष्टि करें।",
      step1Action: "खतरनाक गैस अलार्म की पुष्टि करें",
      step1Success: "गैस खतरे की पुष्टि: CH4 2.4% LEL, H2S 18 PPM (+20 अंक)।",

      step2Title: "चरण 2: अनिवार्य PPE का चयन",
      step2Instruction: "विषाक्त गैस वातावरण के लिए उचित श्वसन सुरक्षा उपकरण (PPE) चुनें।",
      ppeDustMask: "N95 धूल मास्क",
      ppeSCBA: "सेल्फ-कंटेंड ब्रीदिंग एपरेटस (SCBA सकारात्मक दबाव)",
      ppeClothMask: "सूती कपड़े का मास्क",
      ppeHalfMask: "साधारण आधा मास्क",
      step2Success: "सही चयन! SCBA जहरीली H2S गैस से पूर्ण सुरक्षा प्रदान करता है (+20 अंक)।",
      step2Penalty: "असुरक्षित PPE! धूल मास्क जहरीली खदान गैसों से सुरक्षा नहीं देता (-10 अंक)।",

      step3Title: "चरण 3: विद्युत कटऑफ एवं वायु संचालन",
      step3Instruction: "संभावित चिंगारी को रोकने के लिए आपातकालीन विद्युत आपूर्ति तुरंत बंद करें।",
      step3Action: "आपातकालीन पावर कटऑफ सक्रिय करें",
      step3Success: "विद्युत आपूर्ति बंद; गैर-चिंगारीदार वेंटिलेशन चालू (+20 अंक)।",

      step4Title: "चरण 4: बडी सिस्टम (साथी श्रमिक) जांच",
      step4Instruction: "अपने साथी श्रमिक की उपस्थिति सुनिश्चित करें और नियंत्रण कक्ष को सूचित करें।",
      step4Action: "बडी सिस्टम स्थिति की पुष्टि करें",
      step4Success: "साथी श्रमिक सुरक्षित; नियंत्रण कक्ष को सूचना प्रेषित (+20 अंक)।",

      step5Title: "चरण 5: सुरक्षित आश्रय स्थल में निकासी",
      step5Instruction: "हवा की विपरीत दिशा में भूमिगत रिफ्यूज चैंबर (सुरक्षित आश्रय) में प्रवेश करें।",
      step5Evacuate: "भूमिगत रिफ्यूज चैंबर में प्रवेश करें",
      step5Success: "रिफ्यूज चैंबर सुरक्षित रूप से सील। एयर स्क्रबर सक्रिय (+20 अंक)।"
    },
    scoring: {
      resultTitle: "प्रशिक्षण मूल्यांकन रिपोर्ट",
      passedBadge: "प्रमाणित / उत्तीर्ण (PASSED)",
      failedBadge: "पुनः प्रशिक्षण आवश्यक / अनुत्तीर्ण (FAILED)",
      finalScore: "कुल प्राप्त अंक",
      passingScore: "उत्तीर्णता मानक",
      performanceBreakdown: "नियम-आधारित क्षमता विश्लेषण",
      retryButton: "AR सिमुलेशन पुनः प्रयास करें",
      viewCertificateButton: "आधिकारिक डिजिटल प्रमाणपत्र देखें",
      returnHome: "डैशबोर्ड पर वापस जाएं",
      weakAreasTitle: "सुधार हेतु चिन्हित क्षेत्र",
      strongAreasTitle: "सफलतापूर्वक प्रमाणित दक्षताएं"
    },
    certificate: {
      header: "झारखंड सरकार",
      subHeader: "खान एवं औद्योगिक सुरक्षा महानिदेशालय",
      stateName: "राज्य सुरक्षा प्रशिक्षण परिषद · रांची",
      directorate: "खनन एवं भारी विनिर्माण प्रभाग",
      title: "डिजिटल सुरक्षा सक्षमता प्रमाणपत्र",
      certifiesThat: "प्रमाणित किया जाता है कि",
      workerId: "श्रमिक पहचान संख्या",
      hasCompleted: "ने DGMS सुरक्षा नियमों के अंतर्गत निम्नलिखित विषय में ऑगमेंटेड रियलिटी में व्यावहारिक दक्षता प्राप्त की है:",
      scoreAchieved: "मूल्यांकन प्राप्तांक",
      issuedOn: "जारी करने की तिथि",
      certificateId: "प्रमाणपत्र संख्या",
      validity: "वैधता: 12 माह",
      authorizedSignatory: "खान सुरक्षा निदेशक, झारखंड",
      qrInstruction: "राज्य खनन सुरक्षा रजिस्टर पर सत्यापन हेतु QR कोड स्कैन करें",
      downloadBtn: "प्रमाणपत्र डाउनलोड करें (PNG)",
      printBtn: "प्रमाणपत्र प्रिंट करें",
      backBtn: "होम पर वापस जाएं"
    },
    history: {
      title: "श्रमिक प्रशिक्षण इतिहास",
      emptyText: "अभी तक कोई सिमुलेशन पूरा नहीं हुआ है। प्रमाणपत्र अर्जित करने के लिए प्रशिक्षण शुरू करें।",
      score: "अंक",
      date: "पूर्ण करने की तिथि",
      status: "परिणाम",
      actions: "कार्रवाई",
      viewCert: "प्रमाणपत्र",
      clearRecords: "इतिहास रीसेट करें"
    },
    androidDev: {
      title: "एंड्रॉइड नेटिव आर्किटेक्चर एवं ग्रेडल प्रोजेक्ट",
      subtitle: "प्रोडक्शन जेटपैक कंपोज़ + ARCore SDK कोडबेस (com.arsafe.jharkhand)",
      fileTree: "एंड्रॉइड प्रोजेक्ट डायरेक्टरी",
      architectureOverview: "क्लीन आर्किटेक्चर: UI → ViewModels → Use Cases → ARCore Layer → Room DB",
      gradleNotice: "Android Studio में सीधे खोलने योग्य (Kotlin 2.0 और AGP 8.5)",
      codeViewerTitle: "नेटिव कोटलिन सोर्स कोड"
    },
    nav: {
      portals: "पोर्टल चयन",
      workerApp: "श्रमिक ऐप",
      adminDashboard: "प्रशासक डैशबोर्ड",
      publicVerification: "सार्वजनिक सत्यापन",
      clearLogins: "लॉगिन रीसेट",
      deviceFrame: "डिवाइस फ्रेम",
      fullScreen: "फुल स्क्रीन"
    },
    portalGate: {
      sihTag: "स्मार्ट इंडिया हैकथॉन 2026 · समस्या विवरण: SIH26041",
      heroTitle: "AR-SAFE औद्योगिक सुरक्षा सिम्युलेटर",
      heroSubtitle: "झारखंड के भूमिगत कोयला खदानों, इनक्लाइन शाफ्ट और भारी विनिर्माण संयंत्रों के लिए व्यावसायिक प्रशिक्षण एवं नियम-आधारित सक्षमता प्रणाली।",
      regionLabel: "बोकारो • धनबाद • रांची",
      standardLabel: "DGMS CMR 2017",
      passingGradeLabel: "न्यूनतम 80 / 100 अंक",
      executionLabel: "100% ऑफलाइन सक्षम",
      portalsTitle: "अधिकृत पोर्टल का चयन करें",
      portalsSubtitle: "खनिकों एवं राज्य सुरक्षा निरीक्षकों के लिए पृथक उपयोगकर्ता सत्र।",
      signOutAll: "सभी सत्रों से लॉग आउट करें",
      workerPortalTag: "व्यावसायिक प्रशिक्षण एवं AR मूल्यांकन",
      workerPortalTitle: "श्रमिक मोबाइल AR एप्लिकेशन",
      workerPortalDesc: "डिवाइस कैमरे द्वारा रियल-टाइम स्थानिक AR सिमुलेशन। श्रमिक व्यावहारिक खतरा पहचान, PPE चयन, PASS अग्निशमन, जहरीली मीथेन गैस वाल्व नियंत्रण और त्वरित DGMS सक्षमता स्कोरिंग सीखते हैं।",
      workerBtn: "श्रमिक पोर्टल में प्रवेश करें",
      workerContinueBtn: "प्रशिक्षण क्षेत्र खोलें",
      adminPortalTag: "DGMS नियामक अनुपालन प्रणाली",
      adminPortalTitle: "प्रशासक निरीक्षणालय डैशबोर्ड",
      adminPortalDesc: "DGMS सुरक्षा निदेशकों एवं खदान पर्यवेक्षकों हेतु। रीयल-टाइम ऑडिट लॉग, राज्यव्यापी पास-फेल विश्लेषण, श्रमिक रजिस्टर डेटाबेस और मांग पर प्रमाणपत्र सत्यापन अथवा रद्दीकरण।",
      adminBtn: "निरीक्षक लॉगिन",
      adminContinueBtn: "प्रशासक डैशबोर्ड खोलें",
      publicCertTitle: "DGMS सक्षमता प्रमाणपत्र सत्यापन",
      publicCertDesc: "खदान मालिक, ठेकेदार एवं साइट सुरक्षा इंजीनियर बिना लॉगिन किए प्रमाणपत्र संख्या अथवा QR कोड स्कैन द्वारा वास्तविक प्रमाणपत्र की पुष्टि कर सकते हैं।",
      verifyBtn: "प्रमाणपत्र ID / QR सत्यापित करें"
    }
  },
  sat: {
    appName: "AR-SAFE",
    appSubtitle: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ (AR-SAFE)",
    login: {
      title: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱚᱨᱴᱟᱞ (Worker Safety)",
      subtitle: "AR ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱵᱚᱥᱛᱷᱟ",
      workerIdLabel: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ ᱮᱞ (Worker ID)",
      workerIdPlaceholder: "ᱡᱮᱞᱮᱠᱟ: JH-W-001",
      pinLabel: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱤᱱ (PIN)",
      pinPlaceholder: "᱔-ᱮᱞ ᱨᱮᱱᱟᱜ ᱯᱤᱱ ᱮᱢ ᱢᱮ",
      rememberMe: "ᱱᱚᱶᱟ ᱯᱷᱚᱱ ᱨᱮ ᱤᱧᱟᱜ ᱩᱯᱨᱩᱢ ᱫᱚᱦᱚᱭ ᱢᱮ",
      submitButton: "ᱵᱚᱞᱚᱱ ᱢᱮ (Enter)",
      demoWorkerButton: "ᱰᱮᱢᱳ ᱠᱟᱹᱢᱤᱭᱟᱹ: ᱨᱟᱦᱩᱞ ᱠᱩᱢᱟᱨ (JH-W-001)",
      offlineIndicator: "ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱤᱛ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ",
      invalidCredentials: "ᱥᱟᱹᱨᱤ Worker ID ᱟᱨ PIN ᱮᱢ ᱢᱮ",
      jharkhandGovt: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ · ᱠᱷᱟᱫᱟᱱ ᱵᱤᱵᱷᱟᱜᱽ",
      sihTag: "SIH 2026 ᱯᱨᱚᱴᱳᱴᱟᱭᱤᱯ"
    },
    home: {
      greeting: "ᱡᱚᱦᱟᱨ, ᱢᱟᱹᱱ",
      department: "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱠᱟᱹᱢᱤ ᱦᱟᱹᱴᱤᱧ",
      site: "ᱵᱚᱠᱟᱨᱳ ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱮᱞ-᱐᱔",
      progressTitle: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱛᱷᱟᱨ",
      completedModules: "ᱥᱟᱹᱛ ᱟᱠᱟᱱ ᱥᱮᱪᱮᱫ",
      activeCertificates: "ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ",
      complianceScore: "DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱠᱳᱨ",
      startTrainingCTA: "AR ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ ᱢᱮ",
      trainingModulesTitle: "ᱡᱟᱹᱨᱩᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱰᱭᱩᱞ",
      trainingHistoryTitle: "ᱥᱮᱪᱮᱫ ᱨᱮᱠᱚᱨᱰ",
      offlineReadyBadge: "᱑᱐᱐% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱪᱟᱞᱟᱜ-ᱟ",
      dgmsCompliance: "DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱭᱤᱱ ᱞᱮᱠᱟᱛᱮ"
    },
    modules: {
      fireTitle: "ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱚᱢ ᱵᱤᱥᱯᱷᱳᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ",
      fireShortDesc: "ᱠᱷᱟᱫᱟᱱ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱟᱨ ᱠᱟᱨᱮᱱᱴ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (PASS ᱦᱚᱨᱟ)᱾",
      gasTitle: "ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ",
      gasShortDesc: "ᱢᱤᱛᱷᱮᱱ (CH4) ᱟᱨ H2S ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱟᱨ SCBA ᱵᱮᱵᱷᱟᱨ᱾",
      durationMinutes: "᱑᱒ - ᱑᱕ ᱴᱤᱲᱤᱡ",
      startModule: "ᱢᱚᱰᱭᱩᱞ ᱧᱮᱞ ᱢᱮ",
      startARSimulation: "AR ᱥᱤᱢᱩᱞᱮᱴᱚᱨ ᱮᱦᱚᱵ ᱢᱮ",
      objectivesTitle: "ᱢᱩᱬᱩᱛ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱚᱥ",
      precautionsTitle: "ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱨᱤ (SOP)",
      safetyStandard: "DGMS ᱠᱷᱟᱫᱟᱱ ᱟᱹᱭᱤᱱ ᱑᱙᱕᱒ ᱞᱮᱠᱟᱛᱮ",
      backToList: "ᱢᱚᱰᱭᱩᱞ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ"
    },
    ar: {
      scanningNotice: "ᱚᱛ ᱥᱠᱮᱱ ᱮᱦᱚᱵ ᱮᱱᱟ",
      moveSlowly: "ᱚᱛ ᱥᱠᱮᱱ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱚᱱ ᱫᱚ ᱵᱟᱹᱭ-ᱵᱟᱹᱭ ᱛᱮ ᱦᱤᱞᱟᱹᱣ ᱢᱮ...",
      surfaceDetected: "ᱥᱚᱢᱟᱱ ᱚᱛ ᱧᱟᱢ ᱮᱱᱟ᱾ 3D ᱥᱤᱱ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ᱾",
      tapToPlace: "ᱥᱤᱱ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱚᱛ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ",
      scenarioPlaced: "ᱵᱤᱯᱚᱫᱽ ᱥᱤᱱ ᱚᱛ ᱨᱮ ᱛᱷᱟᱯᱚᱱ ᱮᱱᱟ",
      stepIndicator: "ᱥᱮᱪᱮᱫ ᱛᱷᱟᱨ",
      scoreLabel: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱠᱳᱨ",
      pauseSimulation: "ᱛᱷᱟᱢᱵᱷᱟᱣ",
      resumeSimulation: "ᱪᱟᱹᱞᱩ",
      exitAR: "AR ᱠᱷᱚᱱ ᱚᱰᱚᱠ",
      confirmExit: "ᱪᱮᱫ ᱟᱢ AR ᱵᱟᱹᱜᱤ ᱥᱟᱱᱟᱭᱮᱫ ᱢᱮᱭᱟ?",
      trackingQuality: "ARCore ᱴᱨᱮᱠᱤᱝ",
      qualityGood: "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ",
      qualityPoor: "ᱢᱟᱨᱥᱟᱞ ᱠᱚᱢ ᱜᱮᱭᱟ / ᱟᱨᱦᱚᱸ ᱥᱠᱮᱱ ᱢᱮ",
      cameraError: "ᱠᱮᱢᱮᱨᱟ ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ",
      retryCamera: "ᱟᱨᱦᱚᱸ ᱠᱮᱢᱮᱨᱟ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱢᱮ",
      useSimulatedCamera: "ᱥᱤᱢᱩᱞᱮᱴ ᱠᱮᱢᱮᱨᱟ ᱵᱮᱵᱷᱟᱨ ᱢᱮ",
      cameraPermissionDenied: "AR ᱞᱟᱹᱜᱤᱫ ᱠᱮᱢᱮᱨᱟ ᱦᱩᱠᱩᱢ ᱞᱟᱹᱠᱛᱤ ᱜᱮᱭᱟ"
    },
    fireSteps: {
      step1Title: "ᱛᱷᱟᱨ ᱑: ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱯ",
      step1Instruction: "ᱠᱩᱭᱞᱟᱹ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱧᱟᱢ ᱢᱮ ᱟᱨ ᱢᱟᱨᱠᱟᱨ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾",
      step1Action: "ᱥᱮᱸᱜᱮᱞ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ",
      step1Success: "ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ ᱮᱱᱟ! (+᱒᱐ ᱮᱞ)᱾",

      step2Title: "ᱛᱷᱟᱨ ᱒: ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱡᱤᱱᱤᱥ ᱵᱟᱪᱷᱟᱣ",
      step2Instruction: "ᱠᱟᱨᱮᱱᱴ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱴᱷᱤᱠ ᱤᱬᱤᱡ ᱡᱤᱱᱤᱥ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾",
      extinguisherWater: "ᱫᱟᱜ ᱤᱬᱤᱡ ᱡᱤᱱᱤᱥ (Class A)",
      extinguisherFoam: "ᱯᱷᱳᱢ ᱤᱬᱤᱡ ᱡᱤᱱᱤᱥ",
      extinguisherDryPowder: "ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ (MAP 90%)",
      extinguisherCO2: "CO2 ᱜᱮᱥ ᱤᱬᱤᱡ ᱡᱤᱱᱤᱥ",
      step2Success: "ᱥᱟᱹᱨᱤ! ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱠᱟᱨᱮᱱᱴ ᱠᱷᱚᱱ ᱮ ᱵᱟᱧᱪᱟᱣᱟ (+᱒᱐ ᱮᱞ)᱾",
      step2Penalty: "ᱵᱷᱩᱞ ᱵᱟᱪᱷᱟᱣ! ᱠᱟᱨᱮᱱᱴ ᱨᱮ ᱫᱟᱜ ᱵᱮᱵᱷᱟᱨ ᱞᱮᱠᱷᱟᱱ ᱥᱚᱠ ᱞᱟᱜᱟᱣᱜ-ᱟ (-᱑᱐ ᱮᱞ)᱾",

      step3Title: "ᱛᱷᱟᱨ ᱓: PASS ᱦᱚᱨᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ",
      step3Instruction: "ᱱᱚᱡᱚᱞ ᱫᱚ ᱥᱮᱸᱜᱮᱞ ᱵᱩᱴᱟᱹ ᱥᱮᱫ ᱥᱟᱢᱟᱝ ᱢᱮ ᱟᱨ ᱞᱤᱵᱷᱟᱨ ᱚᱛᱟ ᱠᱟᱛᱮ ᱤᱬᱤᱡ ᱢᱮ᱾",
      step3AimAtBase: "ᱥᱮᱸᱜᱮᱞ ᱵᱩᱴᱟᱹ ᱨᱮ ᱤᱬᱤᱡ ᱢᱮ",
      step3Extinguishing: "ᱯᱟᱣᱰᱟᱨ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...",
      step3Success: "ᱥᱮᱸᱜᱮᱞ ᱯᱩᱨᱟᱹ ᱤᱬᱤᱡ ᱮᱱᱟ (+᱓᱐ ᱮᱞ)᱾",

      step4Title: "ᱛᱷᱟᱨ ᱔: ᱚᱰᱚᱠᱚᱜ ᱰᱟᱦᱟᱨ ᱪᱤᱱᱦᱟᱹᱣ",
      step4Instruction: "ᱫᱷᱩᱶᱟᱹ ᱵᱟᱹᱱᱩᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠᱚᱜ ᱰᱟᱦᱟᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾",
      step4Action: "ᱚᱰᱚᱠᱚᱜ ᱰᱟᱦᱟᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
      step4Success: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱧᱟᱢ ᱮᱱᱟ (+᱒᱐ ᱮᱞ)᱾",

      step5Title: "ᱛᱷᱟᱨ ᱕: ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ ᱛᱮ ᱪᱟᱞᱟᱜ",
      step5Instruction: "ᱢᱟᱨᱥᱟᱞ ᱰᱟᱦᱟᱨ ᱛᱮ ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ (Safe Zone) ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ᱾",
      step5Evacuate: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ",
      step5Success: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ ᱛᱮ ᱥᱮᱴᱮᱨ ᱮᱱᱟ! (+᱒᱐ ᱮᱞ)᱾"
    },
    gasSteps: {
      step1Title: "ᱛᱷᱟᱨ ᱑: ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ",
      step1Instruction: "ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱨᱟᱜ ᱮᱱᱟ! CH4 ᱟᱨ H2S ᱞᱮᱵᱷᱮᱞ ᱧᱮᱞ ᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾",
      step1Action: "ᱜᱮᱥ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ",
      step1Success: "ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ ᱮᱱᱟ: CH4 2.4% LEL, H2S 18 PPM (+᱒᱐ ᱮᱞ)᱾",

      step2Title: "ᱛᱷᱟᱨ ᱒: ᱡᱟᱹᱨᱩᱲ PPE ᱵᱟᱪᱷᱟᱣ",
      step2Instruction: "ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ PPE ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾",
      ppeDustMask: "N95 ᱫᱷᱩᱲᱤ ᱢᱩᱴᱷᱟᱹᱱ (Dust Mask)",
      ppeSCBA: "SCBA ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱢᱩᱴᱷᱟᱹᱱ (Positive Pressure)",
      ppeClothMask: "ᱠᱤᱪᱨᱤᱡ ᱢᱩᱴᱷᱟᱹᱱ",
      ppeHalfMask: "ᱦᱟᱯᱷ ᱢᱟᱥᱠ",
      step2Success: "ᱴᱷᱤᱠ! SCBA ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱮ ᱵᱟᱧᱪᱟᱣᱟ (+᱒᱐ ᱮᱞ)᱾",
      step2Penalty: "ᱵᱟᱹᱲᱤᱡ PPE! ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ ᱫᱚ ᱵᱤᱥ ᱜᱮᱥ ᱵᱟᱭ ᱟᱴᱠᱟᱣᱟ (-᱑᱐ ᱮᱞ)᱾",

      step3Title: "ᱛᱷᱟᱨ ᱓: ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱟᱨ ᱦᱚᱭ ᱪᱟᱞᱟᱣ",
      step3Instruction: "ᱥᱮᱸᱜᱮᱞ ᱪᱤᱴᱠᱟᱹᱣ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱢᱮᱱ ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱢᱮ᱾",
      step3Action: "ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱢᱮ",
      step3Success: "ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱮᱱᱟ; ᱵᱤᱯᱚᱫᱽ ᱠᱚᱢ ᱮᱱᱟ (+᱒᱐ ᱮᱞ)᱾",

      step4Title: "ᱛᱷᱟᱨ ᱔: ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ (Buddy) ᱧᱮᱞ ᱢᱮ",
      step4Instruction: "ᱟᱢ ᱥᱟᱶ ᱢᱮᱱᱟᱭ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱮᱞᱮ ᱢᱮ ᱟᱨ ᱠᱚᱱᱴᱨᱳᱞ ᱨᱩᱢ ᱠᱷᱚᱵᱚᱨ ᱮᱢ ᱢᱮ᱾",
      step4Action: "ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱮᱞ ᱢᱮ",
      step4Success: "ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱶ ᱨᱚᱯᱚᱲ ᱦᱩᱭ ᱮᱱᱟ (+᱒᱐ ᱮᱞ)᱾",

      step5Title: "ᱛᱷᱟᱨ ᱕: ᱚᱛ ᱞᱟᱛᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱟᱨ",
      step5Instruction: "ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱥᱮᱫ ᱛᱮ ᱨᱤᱯᱷᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ (Refuge Chamber) ᱛᱮ ᱫᱟᱹᱲ ᱢᱮ᱾",
      step5Evacuate: "ᱨᱤᱯᱷᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ",
      step5Success: "ᱨᱤᱯᱷᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱵᱚᱞᱚ ᱮᱱᱟ! (+᱒᱐ ᱮᱞ)᱾"
    },
    scoring: {
      resultTitle: "ᱥᱮᱪᱮᱫ ᱵᱤᱱᱤᱰ ᱨᱮᱠᱚᱨᱰ",
      passedBadge: "ᱯᱟᱥ ᱮᱱᱟ (PASSED)",
      failedBadge: "ᱟᱨᱦᱚᱸ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱠᱛᱤ (FAILED)",
      finalScore: "ᱡᱚᱛᱚ ᱛᱮ ᱮᱞ",
      passingScore: "ᱯᱟᱥ ᱮᱞ",
      performanceBreakdown: "ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱵᱤᱪᱟᱹᱨ",
      retryButton: "ᱟᱨᱦᱚᱸ AR ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ ᱢᱮ",
      viewCertificateButton: "ᱥᱚᱨᱠᱟᱨᱤ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ ᱢᱮ",
      returnHome: "ᱢᱩᱬᱩᱛ ᱥᱟᱦᱴᱟ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ",
      weakAreasTitle: "ᱠᱚᱢᱡᱳᱨ ᱴᱷᱟᱶ",
      strongAreasTitle: "ᱱᱟᱯᱟᱭ ᱠᱟᱹᱢᱤ"
    },
    certificate: {
      header: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ",
      subHeader: "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱦᱟᱱᱤᱫᱮᱥᱟᱲᱚᱭ",
      stateName: "ᱯᱚᱱᱚᱛ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱵᱟᱹᱭᱥᱤ · ᱨᱟᱺᱪᱤ",
      directorate: "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱦᱟᱹᱴᱤᱧ",
      title: "ᱰᱤᱡᱤᱴᱟᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱹᱵᱤᱛ ᱥᱟᱠᱟᱢ (CERTIFICATE)",
      certifiesThat: "ᱱᱚᱶᱟ ᱫᱚ ᱥᱟᱹᱵᱤᱛᱚᱜ ᱠᱟᱱᱟ ᱡᱮ",
      workerId: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ ᱮᱞ",
      hasCompleted: "DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱭᱤᱱ ᱞᱮᱠᱟᱛᱮ AR ᱥᱤᱢᱩᱞᱮᱴᱚᱨ ᱨᱮ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱟᱥ ᱟᱠᱟᱱᱟᱭ:",
      scoreAchieved: "ᱧᱟᱢ ᱟᱠᱟᱱ ᱮᱞ",
      issuedOn: "ᱢᱟᱹᱦᱤᱛ",
      certificateId: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱞ",
      validity: "ᱢᱤᱫ ᱥᱮᱨᱢᱟ ᱦᱟᱹᱵᱤᱡ",
      authorizedSignatory: "ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱭᱨᱮᱠᱴᱚᱨ, ᱡᱷᱟᱨᱠᱷᱚᱸᱰ",
      qrInstruction: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱨᱤ ᱪᱮ ᱵᱟᱝ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ QR ᱠᱳᱰ ᱥᱠᱮᱱ ᱢᱮ",
      downloadBtn: "ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ (PNG)",
      printBtn: "ᱯᱨᱤᱱᱴ ᱢᱮ",
      backBtn: "ᱨᱩᱣᱟᱹᱲ ᱢᱮ"
    },
    history: {
      title: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱱᱟᱜᱟᱢ",
      emptyText: "ᱱᱤᱛᱚᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱪᱮᱫ ᱥᱮᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾",
      score: "ᱮᱞ",
      date: "ᱢᱟᱹᱦᱤᱛ",
      status: "ᱚᱨᱡᱚ",
      actions: "ᱠᱟᱹᱢᱤ",
      viewCert: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ",
      clearRecords: "ᱨᱮᱠᱚᱨᱰ ᱢᱮᱴᱟᱣ ᱢᱮ"
    },
    androidDev: {
      title: "ᱮᱱᱰᱨᱚᱭᱤᱰ ᱠᱳᱰ ᱟᱨ ᱜᱽᱨᱮᱰᱚᱞ ᱯᱨᱚᱡᱮᱠᱴ",
      subtitle: "Jetpack Compose + ARCore SDK Codebase (com.arsafe.jharkhand)",
      fileTree: "ᱯᱨᱚᱡᱮᱠᱴ ᱫᱟᱨᱮ (File Tree)",
      architectureOverview: "Clean Architecture: UI → ViewModels → Use Cases → ARCore Layer → Room DB",
      gradleNotice: "Android Studio ᱨᱮ ᱥᱚᱡᱷᱮ ᱪᱟᱞᱟᱜ-ᱟ",
      codeViewerTitle: "ᱠᱳᱴᱞᱤᱱ ᱥᱳᱨᱥ ᱠᱳᱰ"
    },
    nav: {
      portals: "ᱯᱚᱨᱴᱟᱞ ᱵᱟᱪᱷᱟᱣ",
      workerApp: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱮᱯ",
      adminDashboard: "ᱪᱟᱪᱞᱟᱣᱤᱭᱟᱹ ᱰᱮᱥᱵᱳᱨᱰ",
      publicVerification: "ᱫᱤᱥᱣᱟᱹ ᱥᱟᱹᱵᱤᱛ",
      clearLogins: "ᱞᱚᱜᱤᱱ ᱢᱮᱴᱟᱣ",
      deviceFrame: "ᱯᱷᱚᱱ ᱯᱷᱨᱮᱢ",
      fullScreen: "ᱯᱩᱨᱟᱹ ᱥᱠᱨᱤᱱ"
    },
    portalGate: {
      sihTag: "SIH 2026 · ᱥᱚᱢᱚᱥᱭᱟ ᱮᱞ: SIH26041",
      heroTitle: "AR-SAFE ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ",
      heroSubtitle: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ AR ᱥᱮᱪᱮᱫ ᱟᱨ DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱵᱚᱥᱛᱷᱟ᱾",
      regionLabel: "ᱵᱚᱠᱟᱨᱳ • ᱫᱷᱟᱱᱵᱟᱫᱽ • ᱨᱟᱺᱪᱤ",
      standardLabel: "DGMS CMR 2017",
      passingGradeLabel: "ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱘᱐ / ᱑᱐᱐",
      executionLabel: "᱑᱐᱐% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱪᱟᱞᱟᱜ-ᱟ",
      portalsTitle: "ᱯᱚᱨᱴᱟᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
      portalsSubtitle: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱨ ᱥᱚᱨᱠᱟᱨᱤ ᱤᱱᱥᱯᱮᱠᱴᱚᱨ ᱞᱟᱹᱜᱤᱫ ᱵᱷᱮᱜᱟᱨ ᱵᱷᱮᱜᱟᱨ ᱞᱚᱜᱤᱱ᱾",
      signOutAll: "ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱢᱮ",
      workerPortalTag: "ᱠᱟᱹᱢᱤ ᱥᱮᱪᱮᱫ ᱟᱨ AR ᱵᱤᱱᱤᱰ",
      workerPortalTitle: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱢᱳᱵᱟᱭᱤᱞ AR ᱮᱯᱞᱤᱠᱮᱥᱚᱱ",
      workerPortalDesc: "ᱯᱷᱚᱱ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱥᱟᱹᱨᱤ ᱞᱮᱠᱟ AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ᱾ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ, ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱟᱨ DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱚ ᱧᱟᱢᱟ᱾",
      workerBtn: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱚᱨᱴᱟᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ",
      workerContinueBtn: "ᱥᱮᱪᱮᱫ ᱴᱷᱟᱶ ᱠᱷᱩᱞᱟᱹᱭ ᱢᱮ",
      adminPortalTag: "DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱮᱵᱚᱥᱛᱷᱟ",
      adminPortalTitle: "ᱪᱟᱪᱞᱟᱣᱤᱭᱟᱹ ᱤᱱᱥᱯᱮᱠᱴᱚᱨ ᱰᱮᱥᱵᱳᱨᱰ",
      adminPortalDesc: "DGMS ᱥᱮᱯᱷᱴᱤ ᱰᱟᱭᱨᱮᱠᱴᱚᱨ ᱞᱟᱹᱜᱤᱫ᱾ ᱯᱚᱱᱚᱛ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱨᱮᱠᱚᱨᱰ, ᱚᱰᱤᱴ ᱞᱚᱜᱽ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ ᱵᱟᱲᱟᱭ ᱞᱟᱹᱜᱤᱫ᱾",
      adminBtn: "ᱤᱱᱥᱯᱮᱠᱴᱚᱨ ᱞᱚᱜᱤᱱ",
      adminContinueBtn: "ᱰᱮᱥᱵᱳᱨᱰ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ",
      publicCertTitle: "DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱵᱤᱛ ᱧᱮᱞ",
      publicCertDesc: "ᱠᱷᱟᱫᱟᱱ ᱢᱟᱹᱞᱤᱠ ᱟᱨ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨ ᱠᱚ ᱵᱤᱱᱟᱹ ᱞᱚᱜᱤᱱ ᱛᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ID ᱥᱮ QR ᱠᱳᱰ ᱛᱮ ᱥᱟᱹᱨᱤ ᱪᱮ ᱵᱟᱝ ᱧᱮᱞ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾",
      verifyBtn: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱹᱵᱤᱛ ᱧᱮᱞ ᱢᱮ"
    }
  }
};
