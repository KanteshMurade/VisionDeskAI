import { GeminiClient, GeminiError } from "./gemini/GeminiClient";
import { resolveGeminiModel } from "./gemini/GeminiModels";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { GeminiContent } from "./gemini/GeminiTypes";

export class VisionService {
  async analyzeScreenshot(imageDataUrl: string, ocrText: string | null, prompt: string): Promise<string> {
    const provider = useSettingsStore.getState().providers.find((provider) => provider.id === "gemini");
    if (!provider) throw new Error("Gemini provider settings are unavailable.");
    if (!provider.apiKey.trim()) throw new Error("Add and save a Gemini API key before analyzing screenshots.");
    
    const model = resolveGeminiModel(provider.model);
    const client = new GeminiClient({ apiKey: provider.apiKey });

    // Convert data URL to base64 without the prefix
    const base64Data = imageDataUrl.split(',')[1];

    // Build the analysis prompt combining OCR text and user prompt
    let analysisPrompt = prompt || "Analyze this screenshot and explain its contents.";
    
    if (ocrText && ocrText.trim()) {
      analysisPrompt = `OCR Text:\n${ocrText}\n\n${analysisPrompt}`;
    }

    const content: GeminiContent = {
      role: "user",
      parts: [
        { text: analysisPrompt },
        { 
          inlineData: {
            mimeType: "image/png",
            data: base64Data,
          },
        },
      ],
    };

    try {
      const response = await client.generateContent(model, [content]);
      return response;
    } catch (error) {
      if (error instanceof GeminiError) throw error;
      throw new Error("Vision analysis failed.");
    }
  }
}

export const visionService = new VisionService();
