import { GeminiClient, GeminiError } from "../gemini/GeminiClient";
import { resolveGeminiModel } from "../gemini/GeminiModels";
import { useSettingsStore } from "../../stores/useSettingsStore";
import type { ChatMessage } from "../../types/ChatMessage";
import type { ChatResponse } from "../../types/ChatResponse";

const maxRetries = 1;

export class ChatService {
  async sendPrompt(messages: readonly ChatMessage[]): Promise<ChatResponse> {
    const provider = useSettingsStore.getState().providers.find(({ id }) => id === "gemini");
    if (!provider) throw new Error("Gemini provider settings are unavailable.");
    if (!provider.apiKey.trim()) throw new Error("Add and save a Gemini API key before sending a message.");
    const model = resolveGeminiModel(provider.model);

    const client = new GeminiClient({ apiKey: provider.apiKey });
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const content = await client.generateContent(model, messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })));
        return { content, model };
      } catch (error: unknown) {
        const canRetry = error instanceof GeminiError && (error.status === undefined || error.status >= 500);
        if (!canRetry || attempt === maxRetries) throw error;
      }
    }
    throw new Error("Chat request failed.");
  }
}

export const chatService = new ChatService();
