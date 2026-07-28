import type { Screenshot, ScreenshotCaptureApi } from "../types/Screenshot";

function getCaptureApi(): ScreenshotCaptureApi {
  if (!window.electronAPI) throw new Error("Screenshot capture is only available in the Electron application.");
  return window.electronAPI.screenshots;
}

export class ScreenshotService {
  captureFullScreen(): Promise<Screenshot> { return getCaptureApi().captureFullScreen(); }
  copyToClipboard(imageDataUrl: string): Promise<void> { return getCaptureApi().copyToClipboard(imageDataUrl); }
  deleteScreenshot(imagePath: string): Promise<void> { return getCaptureApi().deleteScreenshot(imagePath); }
  saveScreenshot(imageDataUrl: string): Promise<string | null> { return getCaptureApi().saveScreenshot(imageDataUrl); }
}

export const screenshotService = new ScreenshotService();
