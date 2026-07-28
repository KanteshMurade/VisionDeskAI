import { create } from "zustand";

export interface OCRProgress {
  status: string;
  progress: number;
}

interface OCRState {
  extractedText: string | null;
  isProcessing: boolean;
  error: string | null;
  progress: OCRProgress | null;
  setExtractedText: (text: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: OCRProgress | null) => void;
  clear: () => void;
}

export const useOCRStore = create<OCRState>((set) => ({
  extractedText: null,
  isProcessing: false,
  error: null,
  progress: null,
  setExtractedText: (extractedText) => set({ extractedText }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  setProgress: (progress) => set({ progress }),
  clear: () => set({ extractedText: null, isProcessing: false, error: null, progress: null }),
}));
