import type { Screenshot, ScreenshotCaptureApi, RegionCaptureApi } from "../types/Screenshot";

function getCaptureApi(): ScreenshotCaptureApi {
  if (!window.electronAPI) throw new Error("Screenshot capture is only available in the Electron application.");
  return window.electronAPI.screenshots;
}

function getRegionCaptureApi(): RegionCaptureApi {
  if (!window.electronAPI) throw new Error("Region capture is only available in the Electron application.");
  return window.electronAPI.regionCapture;
}

export class ScreenshotService {
  captureFullScreen(): Promise<Screenshot> { return getCaptureApi().captureFullScreen(); }
  copyToClipboard(imageDataUrl: string): Promise<void> { return getCaptureApi().copyToClipboard(imageDataUrl); }
  deleteScreenshot(imagePath: string): Promise<void> { return getCaptureApi().deleteScreenshot(imagePath); }
  saveScreenshot(imageDataUrl: string): Promise<string | null> { return getCaptureApi().saveScreenshot(imageDataUrl); }
  
  startRegionCapture(): Promise<void> { return getRegionCaptureApi().start(); }
  captureRegion(x: number, y: number, width: number, height: number): Promise<Screenshot> {
    return getRegionCaptureApi().capture(x, y, width, height);
  }
  cancelRegionCapture(): Promise<void> { return getRegionCaptureApi().cancel(); }
}

export const screenshotService = new ScreenshotService();
