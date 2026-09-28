export type LanguageCode = 'en' | 'hi' | 'sat';

export interface Worker {
  id: string;
  name: string;
  role: string;
  department: string;
  mineSite: string;
  company: string;
  avatarUrl?: string;
  lastLogin: string;
}

export interface AdminUser {
  id: string;
  name: string;
  designation: string;
  department: string;
  badgeNumber: string;
  lastLogin: string;
}

export type ModuleId = 'fire-explosion' | 'gas-leak';

export interface TrainingObjective {
  id: string;
  title: string;
  description: string;
}

export interface TrainingModule {
  id: ModuleId;
  code: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  durationMinutes: number;
  dgmsStandard: string;
  category: string;
  iconName: string;
  objectives: TrainingObjective[];
  safetyPrecautions: string[];
}

export type ARTrackingState = 'uninitialized' | 'requesting_permission' | 'scanning_surface' | 'surface_detected' | 'placed' | 'active' | 'paused' | 'error';

export type FireLevel =
  | 'FIRE_LEVEL_0'
  | 'SPARK'
  | 'SMALL_FIRE'
  | 'MEDIUM_FIRE'
  | 'LARGE_FIRE'
  | 'CONTROLLED'
  | 'EXTINGUISHED';

export type ScenarioState =
  | 'SCAN_ENVIRONMENT'
  | 'INITIAL_INCIDENT'
  | 'IDENTIFY_HAZARD'
  | 'SELECT_EXTINGUISHER'
  | 'USE_EXTINGUISHER'
  | 'EMERGENCY_ESCALATION'
  | 'REACH_SAFE_ZONE'
  | 'KNOWLEDGE_ASSESSMENT';

export type GasScenarioState =
  | 'SCAN_ENVIRONMENT'
  | 'INITIAL_INCIDENT'
  | 'DETECT_GAS_ALARM'
  | 'SELECT_PPE'
  | 'ISOLATE_SPARK'
  | 'VERIFY_BUDDY'
  | 'REACH_REFUGE_CHAMBER'
  | 'KNOWLEDGE_ASSESSMENT';

export interface KnowledgeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type FireExtinguisherType = 'water' | 'foam' | 'abc_dry_powder' | 'co2';

export type PPESelection = 'dust_mask' | 'scba_apparatus' | 'cloth_bandana' | 'cartridge_half_mask';

export interface ScoringAction {
  id: string;
  stepNumber: number;
  stepTitle: string;
  actionTaken: string;
  maxPoints: number;
  awardedPoints: number;
  isCorrect: boolean;
  feedback: string;
  timestamp: number;
}

export interface TrainingSessionResult {
  sessionId: string;
  workerId: string;
  workerName: string;
  moduleId: ModuleId;
  moduleTitle: string;
  moduleCode: string;
  totalScore: number;
  passingScore: number;
  isPassed: boolean;
  completedAt: string;
  actions: ScoringAction[];
  durationSeconds: number;
  certificateId?: string;
  weakAreas: string[];
  strongAreas: string[];
}

export interface CertificateData {
  certificateId: string;
  workerId: string;
  workerName: string;
  moduleCode: string;
  moduleTitle: string;
  score: number;
  completedAt: string;
  expiryDate: string;
  issuer: string;
  directorate: string;
  verificationUrl: string;
  qrCodeDataUrl?: string;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
}
