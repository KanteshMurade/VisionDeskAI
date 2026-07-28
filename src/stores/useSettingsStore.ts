import { create } from "zustand";
import { aiProviderService } from "../services/AIProviderService";
import type { AIProvider } from "../types/AIProvider";

interface SettingsState {
  providers: AIProvider[];
  saveProviders: (providers: readonly AIProvider[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  providers: aiProviderService.loadProviders(),
  saveProviders: (providers) => {
    const nextProviders = providers.map((provider) => ({ ...provider }));
    aiProviderService.saveProviders(nextProviders);
    set({ providers: nextProviders });
  },
}));
