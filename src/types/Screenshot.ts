export interface Screenshot {
  id: string;
  imageDataUrl: string;
  imagePath: string;
  timestamp: string;
}

export interface ScreenshotCaptureApi {
  captureFullScreen: () => Promise<Screenshot>;
  copyToClipboard: (imageDataUrl: string) => Promise<void>;
  deleteScreenshot: (imagePath: string) => Promise<void>;
  saveScreenshot: (imageDataUrl: string) => Promise<string | null>;
}

export interface RegionCaptureApi {
  start: () => Promise<void>;
  capture: (x: number, y: number, width: number, height: number) => Promise<Screenshot>;
  cancel: () => Promise<void>;
}
