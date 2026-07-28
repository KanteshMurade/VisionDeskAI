import type { AIProvider, ProviderId } from "../types/AIProvider";
import type { ProviderStatus } from "../types/ProviderStatus";

const storageKey = "visiondesk-ai.providers";

const defaultProviders: readonly AIProvider[] = [
  { id: "gemini", name: "Gemini", icon: "gemini", apiKey: "", model: "gemini-2.5-flash", status: "not-configured" },
  { id: "openai", name: "OpenAI", icon: "openai", apiKey: "", model: "gpt-5", status: "not-configured" },
  { id: "ollama", name: "Ollama", icon: "ollama", apiKey: "http://localhost:11434", model: "llama3", status: "not-configured" },
  { id: "claude", name: "Claude", icon: "claude", apiKey: "", model: "", status: "disabled" },
];

function isProviderId(value: unknown): value is ProviderId {
  return value === "gemini" || value === "openai" || value === "ollama" || value === "claude";
}

function isProviderStatus(value: unknown): value is ProviderStatus {
  return value === "connected" || value === "failed" || value === "not-configured" || value === "disabled";
}

function cloneDefaults(): AIProvider[] {
  return defaultProviders.map((provider) => ({ ...provider }));
}

export class AIProviderService {
  loadProviders(): AIProvider[] {
    const storedProviders = this.readStoredProviders();
    if (storedProviders === null) return cloneDefaults();

    return cloneDefaults().map((provider) => {
      const stored = storedProviders.find(({ id }) => id === provider.id);
      return stored ? { ...provider, ...stored, id: provider.id, icon: provider.icon, name: provider.name } : provider;
    });
  }

  saveProviders(providers: readonly AIProvider[]): void {
    if (!this.validateSettings(providers)) throw new Error("Invalid AI provider settings.");
    localStorage.setItem(storageKey, JSON.stringify(providers));
  }

  validateSettings(providers: readonly AIProvider[]): boolean {
    return providers.length === defaultProviders.length && providers.every((provider) =>
      isProviderId(provider.id)
      && typeof provider.apiKey === "string"
      && typeof provider.model === "string"
      && typeof provider.name === "string",
    );
  }

  private readStoredProviders(): AIProvider[] | null {
    try {
      const rawValue = localStorage.getItem(storageKey);
      if (!rawValue) return null;
      const parsed: unknown = JSON.parse(rawValue);
      if (!Array.isArray(parsed)) return null;
      return parsed.filter(this.isStoredProvider);
    } catch {
      return null;
    }
  }

  private isStoredProvider(value: unknown): value is AIProvider {
    if (typeof value !== "object" || value === null) return false;
    const provider = value as Record<string, unknown>;
    return isProviderId(provider.id)
      && typeof provider.apiKey === "string"
      && typeof provider.model === "string"
      && isProviderStatus(provider.status);
  }
}

export const aiProviderService = new AIProviderService();
