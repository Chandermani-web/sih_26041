import { Worker, AdminUser, TrainingSessionResult, CertificateData } from '../types';

const STORAGE_KEYS = {
  CURRENT_WORKER: 'arsafe_current_worker',
  CURRENT_ADMIN: 'arsafe_current_admin',
  WORKERS_DIRECTORY: 'arsafe_registered_workers',
  TRAINING_HISTORY: 'arsafe_training_history',
  CERTIFICATES: 'arsafe_certificates',
  PENDING_SYNC_QUEUE: 'arsafe_sync_queue',
  OFFLINE_MODE: 'arsafe_offline_mode',
  DOWNLOADED_MODULES: 'arsafe_downloaded_modules',
};

export const INITIAL_REGISTERED_WORKERS: Worker[] = [
  {
    id: 'JH-W-001',
    name: 'Rahul Kumar',
    role: 'Underground Conveyor Operator',
    department: 'Mining Mechanical & Haulage',
    mineSite: 'Bokaro Coal Belt Incline Mine No. 4',
    company: 'Central Coalfields Limited (Govt. of Jharkhand)',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'JH-W-002',
    name: 'Sunita Murmu',
    role: 'Drift Ventilation Inspector',
    department: 'Mine Safety & Gas Monitoring Cell',
    mineSite: 'Dhanbad Jharia Colliery Shaft 3',
    company: 'Bharat Coking Coal Limited (BCCL)',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'JH-W-003',
    name: 'Amit Hansda',
    role: 'Heavy Earth Moving Machinery Tech',
    department: 'Surface & Incline Operations',
    mineSite: 'Ranchi Mineral Quarry Site A',
    company: 'Jharkhand State Mineral Dev. Corp (JSMDC)',
    lastLogin: new Date().toISOString(),
  },
];

export const DEMO_WORKER: Worker = INITIAL_REGISTERED_WORKERS[0];

export const DEMO_ADMIN: AdminUser = {
  id: 'DGMS-ADM-01',
  name: 'Er. Rajeshwar Soren',
  designation: 'Director of Mines Safety & Training',
  department: 'Directorate General of Mines Safety (DGMS), Jharkhand',
  badgeNumber: 'JH-DGMS-2026-99',
  lastLogin: new Date().toISOString(),
};

class LocalStorageManager {
  // Registered Workers
  getRegisteredWorkers(): Worker[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WORKERS_DIRECTORY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.WORKERS_DIRECTORY, JSON.stringify(INITIAL_REGISTERED_WORKERS));
        return INITIAL_REGISTERED_WORKERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_REGISTERED_WORKERS;
    }
  }

  // Current Worker
  getCurrentWorker(): Worker | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKER);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  }

  setCurrentWorker(worker: Worker | null): void {
    if (worker) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKER, JSON.stringify(worker));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKER);
    }
  }

  // Admin Session
  getCurrentAdmin(): AdminUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  }

  setCurrentAdmin(admin: AdminUser | null): void {
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
  }

  // Real Training Sessions (NO fake initial scores!)
  getTrainingHistory(): TrainingSessionResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TRAINING_HISTORY);
      if (!raw) return [];
      const parsed: TrainingSessionResult[] = JSON.parse(raw);
      // Filter out any legacy dummy records
      return parsed.filter(p => !p.sessionId.includes('demo'));
    } catch {
      return [];
    }
  }

  saveTrainingHistory(history: TrainingSessionResult[]): void {
    localStorage.setItem(STORAGE_KEYS.TRAINING_HISTORY, JSON.stringify(history));
  }

  addTrainingSession(session: TrainingSessionResult): void {
    const list = this.getTrainingHistory();
    const updated = [session, ...list];
    this.saveTrainingHistory(updated);

    this.enqueueSyncRecord({
      type: 'REAL_TRAINING_ASSESSMENT',
      payload: session,
      timestamp: Date.now(),
    });
  }

  // Real Certificates (NO fake initial certificates!)
  getCertificates(): CertificateData[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (!raw) return [];
      const parsed: CertificateData[] = JSON.parse(raw);
      // Return all legitimate certificates stored from completed tests
      return parsed;
    } catch {
      return [];
    }
  }

  saveCertificates(certs: CertificateData[]): void {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
  }

  addCertificate(cert: CertificateData): void {
    const certs = this.getCertificates();
    const existingIndex = certs.findIndex((c) => c.certificateId === cert.certificateId);
    let updated: CertificateData[];
    if (existingIndex >= 0) {
      updated = [...certs];
      updated[existingIndex] = cert;
    } else {
      updated = [cert, ...certs];
    }
    this.saveCertificates(updated);
  }

  getCertificateById(id: string): CertificateData | undefined {
    return this.getCertificates().find((c) => c.certificateId.toLowerCase() === id.toLowerCase());
  }

  updateCertificateStatus(id: string, status: 'VALID' | 'REVOKED'): boolean {
    const certs = this.getCertificates();
    const index = certs.findIndex((c) => c.certificateId.toLowerCase() === id.toLowerCase());
    if (index >= 0) {
      certs[index] = { ...certs[index], status };
      this.saveCertificates(certs);
      return true;
    }
    return false;
  }

  // Offline Mode Toggle & Sync
  isOfflineMode(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE);
      return val === 'true';
    } catch {
      return false;
    }
  }

  setOfflineMode(offline: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, String(offline));
    } catch {
      // ignore
    }
  }

  // Downloaded modules for offline training
  getDownloadedModules(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DOWNLOADED_MODULES);
      if (!raw) {
        // default both modules downloaded and ready for offline simulation
        const initial = ['fire-explosion', 'gas-leak'];
        localStorage.setItem(STORAGE_KEYS.DOWNLOADED_MODULES, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return ['fire-explosion', 'gas-leak'];
    }
  }

  setModuleDownloaded(moduleId: string, downloaded: boolean): void {
    try {
      const current = new Set(this.getDownloadedModules());
      if (downloaded) {
        current.add(moduleId);
      } else {
        current.delete(moduleId);
      }
      localStorage.setItem(STORAGE_KEYS.DOWNLOADED_MODULES, JSON.stringify(Array.from(current)));
    } catch {
      // ignore
    }
  }

  // Sync Queue for Offline -> Central Admin Server
  getSyncQueue(): { type: string; payload: unknown; timestamp: number }[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  enqueueSyncRecord(record: { type: string; payload: unknown; timestamp: number }): void {
    const queue = this.getSyncQueue();
    queue.push(record);
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC_QUEUE, JSON.stringify(queue));
  }

  flushSyncQueue(): number {
    const queue = this.getSyncQueue();
    const count = queue.length;
    localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC_QUEUE);
    return count;
  }

  clearAllSessions(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  }

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TRAINING_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  }
}

export const localStorageManager = new LocalStorageManager();
