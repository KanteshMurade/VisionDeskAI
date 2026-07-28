import { create } from "zustand";
import type { Screenshot } from "../types/Screenshot";

interface ScreenshotState {
  currentScreenshot: Screenshot | null;
  clearScreenshot: () => void;
  setScreenshot: (screenshot: Screenshot) => void;
}

export const useScreenshotStore = create<ScreenshotState>((set) => ({
  currentScreenshot: null,
  setScreenshot: (currentScreenshot) => set({ currentScreenshot }),
  clearScreenshot: () => set({ currentScreenshot: null }),
}));
