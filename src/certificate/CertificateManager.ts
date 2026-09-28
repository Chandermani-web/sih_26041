import QRCode from 'qrcode';
import { CertificateData, ModuleId } from '../types';
import { localStorageManager } from '../storage/LocalStorageManager';

export class CertificateManager {
  static getDeterministicId(moduleId: ModuleId, sequence: number = 1): string {
    const pad = String(sequence).padStart(6, '0');
    const year = new Date().getFullYear();
    if (moduleId === 'fire-explosion') {
      return `JH-FIRE-${year}-${pad}`;
    }
    return `JH-GAS-${year}-${pad}`;
  }

  static getVerificationUrl(certificateId: string): string {
    if (typeof window !== 'undefined') {
      const base = window.location.href.split('#')[0].split('?')[0];
      return `${base}#verify/${certificateId}`;
    }
    return `https://arsafe-jharkhand.gov.in/#verify/${certificateId}`;
  }

  static async generateCertificate(
    workerId: string,
    workerName: string,
    moduleId: ModuleId,
    moduleTitle: string,
    moduleCode: string,
    score: number
  ): Promise<CertificateData> {
    const existing = localStorageManager.getCertificates();
    const sequence = existing.length + 1;
    const certificateId = this.getDeterministicId(moduleId, sequence);
    const verificationUrl = this.getVerificationUrl(certificateId);

    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 256,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }

    const completedAt = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    return {
      certificateId,
      workerId,
      workerName,
      moduleCode,
      moduleTitle,
      score,
      completedAt,
      expiryDate,
      issuer: 'Directorate General of Mines Safety (DGMS)',
      directorate: 'Industrial & Mining Safety Training Cell, Govt. of Jharkhand',
      verificationUrl,
      qrCodeDataUrl,
      status: 'VALID',
    };
  }
}

