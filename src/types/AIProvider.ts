import type { ProviderStatus } from "./ProviderStatus";

export type ProviderId = "gemini" | "openai" | "ollama" | "claude";
export type ProviderIcon = "gemini" | "openai" | "ollama" | "claude";

export interface AIProvider {
  apiKey: string;
  icon: ProviderIcon;
  id: ProviderId;
  model: string;
  name: string;
  status: ProviderStatus;
}
