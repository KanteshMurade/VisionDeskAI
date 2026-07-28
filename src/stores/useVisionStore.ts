import { create } from "zustand";

interface VisionState {
  analysisResult: string | null;
  isAnalyzing: boolean;
  error: string | null;
  prompt: string;
  setAnalysisResult: (result: string | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  setPrompt: (prompt: string) => void;
  clear: () => void;
}

export const useVisionStore = create<VisionState>((set) => ({
  analysisResult: null,
  isAnalyzing: false,
  error: null,
  prompt: "",
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),
  setPrompt: (prompt) => set({ prompt }),
  clear: () => set({ analysisResult: null, isAnalyzing: false, error: null, prompt: "" }),
}));
