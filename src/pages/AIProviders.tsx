import { useState } from "react";
import { FaBrain, FaGoogle, FaRobot, FaFlask } from "react-icons/fa";
import APIKeyInput from "../components/providers/APIKeyInput";
import ModelSelector from "../components/providers/ModelSelector";
import ProviderCard from "../components/providers/ProviderCard";
import TestConnectionButton from "../components/providers/TestConnectionButton";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { AIProvider, ProviderIcon, ProviderId } from "../types/AIProvider";
import styles from "./AIProviders.module.css";

const providerIcons: Record<ProviderIcon, JSX.Element> = { gemini: <FaGoogle />, openai: <FaRobot />, ollama: <FaFlask />, claude: <FaBrain /> };
const providerModels: Record<ProviderId, readonly string[]> = {
  gemini: ["gemini-2.5-flash", "gemini-2.5-pro"], openai: ["gpt-5", "gpt-5-mini"], ollama: ["llama3", "mistral", "qwen2.5"], claude: [],
};

export default function AIProviders() {
  const savedProviders = useSettingsStore((state) => state.providers);
  const saveProviders = useSettingsStore((state) => state.saveProviders);
  const [providers, setProviders] = useState<AIProvider[]>(() => savedProviders.map((provider) => ({ ...provider })));
  const [testingId, setTestingId] = useState<ProviderId | null>(null);

  const updateProvider = (id: ProviderId, changes: Partial<Pick<AIProvider, "apiKey" | "model" | "status">>) => {
    setProviders((current) => current.map((provider) => provider.id === id ? { ...provider, ...changes } : provider));
  };
  const testConnection = (id: ProviderId) => {
    setTestingId(id);
    window.setTimeout(() => { updateProvider(id, { status: "connected" }); setTestingId(null); }, 1000);
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
                <TestConnectionButton idleLabel="Detect Models" isTesting={testingId === provider.id} onTest={() => testConnection(provider.id)} />
              </>
            ) : provider.id !== "claude" && (
              <>
                <APIKeyInput label="API Key" onChange={(apiKey) => updateProvider(provider.id, { apiKey, status: "not-configured" })} value={provider.apiKey} />
                <ModelSelector models={providerModels[provider.id]} onChange={(model) => updateProvider(provider.id, { model })} value={provider.model} />
                <TestConnectionButton isTesting={testingId === provider.id} onTest={() => testConnection(provider.id)} />
              </>
            )}
          </ProviderCard>
        ))}
      </section>
      <div className={styles.actions}><Button onClick={cancelChanges} variant="ghost">Cancel</Button><Button onClick={() => saveProviders(providers)}>Save</Button></div>
    </div>
  );
}
