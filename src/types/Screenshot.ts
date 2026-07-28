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
