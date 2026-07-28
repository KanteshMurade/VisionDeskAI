/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      screenshots: import("./types/Screenshot").ScreenshotCaptureApi;
    };
  }
}

export {};
