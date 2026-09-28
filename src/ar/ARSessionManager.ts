export interface DeviceARCapabilities {
  hasCamera: boolean;
  hasGyroscope: boolean;
  hasWebXR: boolean;
  isARCoreSupported: boolean;
  trackingQuality: 'optimal' | 'moderate' | 'low';
}

export class ARSessionManager {
  private videoElement: HTMLVideoElement | null = null;
  private mediaStream: MediaStream | null = null;
  private orientationListener: ((e: DeviceOrientationEvent) => void) | null = null;
  private currentPitch: number = 0;
  private currentRoll: number = 0;

  async checkCapabilities(): Promise<DeviceARCapabilities> {
    const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasGyroscope = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
    
    // Check for WebXR AR support
    let hasWebXR = false;
    let isARCoreSupported = false;
    if (typeof navigator !== 'undefined' && 'xr' in navigator && (navigator as unknown as { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }).xr?.isSessionSupported) {
      try {
        const xr = (navigator as unknown as { xr: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr;
        hasWebXR = await xr.isSessionSupported('immersive-ar');
        isARCoreSupported = hasWebXR;
      } catch {
        hasWebXR = false;
      }
    }

    // Android User-Agent check for ARCore compatibility
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isAndroid = /Android/i.test(ua);
    if (isAndroid) {
      isARCoreSupported = true;
    }

    return {
      hasCamera,
      hasGyroscope,
      hasWebXR,
      isARCoreSupported,
      trackingQuality: 'optimal',
    };
  }

  async startCamera(videoElement: HTMLVideoElement): Promise<{ success: boolean; error?: string }> {
    this.videoElement = videoElement;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { success: false, error: 'MediaDevices API not supported on this browser' };
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;
      this.videoElement.srcObject = stream;
      await this.videoElement.play();

      this.initOrientationTracking();

      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Camera permission denied or camera not available';
      console.warn('Camera initialization notice:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  private initOrientationTracking(): void {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      this.orientationListener = (e: DeviceOrientationEvent) => {
        if (e.beta !== null) this.currentPitch = e.beta;
        if (e.gamma !== null) this.currentRoll = e.gamma;
      };
      window.addEventListener('deviceorientation', this.orientationListener, true);
    }
  }

  getOrientation(): { pitch: number; roll: number } {
    return { pitch: this.currentPitch, roll: this.currentRoll };
  }

  stop(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    if (this.orientationListener && typeof window !== 'undefined') {
      window.removeEventListener('deviceorientation', this.orientationListener, true);
      this.orientationListener = null;
    }
  }
}
