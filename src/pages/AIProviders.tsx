import { useState } from "react";
import { FaBrain, FaGoogle, FaRobot, FaFlask } from "react-icons/fa";
import APIKeyInput from "../components/providers/APIKeyInput";
import ModelSelector from "../components/providers/ModelSelector";
import ProviderCard from "../components/providers/ProviderCard";
import TestConnectionButton from "../components/providers/TestConnectionButton";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import { useSettingsStore } from "../stores/useSettingsStore";
import { GeminiClient } from "../services/gemini/GeminiClient";
import { defaultGeminiModels, resolveGeminiModel } from "../services/gemini/GeminiModels";
import type { AIProvider, ProviderIcon, ProviderId } from "../types/AIProvider";
import styles from "./AIProviders.module.css";

const providerIcons: Record<ProviderIcon, JSX.Element> = { gemini: <FaGoogle />, openai: <FaRobot />, ollama: <FaFlask />, claude: <FaBrain /> };
const providerModels: Record<ProviderId, readonly string[]> = {
  gemini: defaultGeminiModels, openai: ["gpt-5", "gpt-5-mini"], ollama: ["llama3", "mistral", "qwen2.5"], claude: [],
};

export default function AIProviders() {
  const savedProviders = useSettingsStore((state) => state.providers);
  const saveProviders = useSettingsStore((state) => state.saveProviders);
  const [providers, setProviders] = useState<AIProvider[]>(() => savedProviders.map((provider) => ({ ...provider })));
  const [testingId, setTestingId] = useState<ProviderId | null>(null);
  const [testErrors, setTestErrors] = useState<Partial<Record<ProviderId, string>>>({});

  const updateProvider = (id: ProviderId, changes: Partial<Pick<AIProvider, "apiKey" | "model" | "status">>) => {
    setProviders((current) => current.map((provider) => provider.id === id ? { ...provider, ...changes } : provider));
  };
  const testConnection = async (provider: AIProvider) => {
    if (provider.id !== "gemini") return;
    const { id } = provider;
    setTestingId(id);
    setTestErrors((current) => ({ ...current, [id]: "" }));
    try {
      await new GeminiClient({ apiKey: provider.apiKey }).getModel(resolveGeminiModel(provider.model));
      updateProvider(id, { status: "connected" });
    } catch (error: unknown) {
      updateProvider(id, { status: "failed" });
      setTestErrors((current) => ({ ...current, [id]: error instanceof Error ? error.message : "Unable to connect to Gemini." }));
    } finally { setTestingId(null); }
  };
  const cancelChanges = () => setProviders(savedProviders.map((provider) => ({ ...provider })));

  return (
    <div className={styles.page}>
      <Header title="AI Providers" subtitle="Manage all AI services used by VisionDesk AI." />
      <section aria-label="AI provider configuration" className={styles.grid}>
        {providers.map((provider) => (
          <ProviderCard icon={providerIcons[provider.icon]} key={provider.id} provider={provider}>
            {provider.id === "ollama" ? (
              <>
                <APIKeyInput label="Endpoint" onChange={(apiKey) => updateProvider(provider.id, { apiKey })} value={provider.apiKey} />
                <ModelSelector models={providerModels.ollama} onChange={(model) => updateProvider(provider.id, { model })} value={provider.model} />
                <TestConnectionButton idleLabel="Detect Models" isTesting={testingId === provider.id} onTest={() => testConnection(provider)} />
              </>
            ) : provider.id !== "claude" && (
              <>
                <APIKeyInput label="API Key" onChange={(apiKey) => updateProvider(provider.id, { apiKey, status: "not-configured" })} value={provider.apiKey} />
                <ModelSelector models={providerModels[provider.id]} onChange={(model) => updateProvider(provider.id, { model })} value={provider.model} />
                {provider.id === "gemini" && <TestConnectionButton isTesting={testingId === provider.id} onTest={() => testConnection(provider)} />}
                {testErrors[provider.id] && <p className={styles.testError} role="alert">{testErrors[provider.id]}</p>}
              </>
            )}
          </ProviderCard>
        ))}
      </section>
      <div className={styles.actions}><Button onClick={cancelChanges} variant="ghost">Cancel</Button><Button onClick={() => saveProviders(providers)}>Save</Button></div>
    </div>
  );
}
