export interface GeminiContent {
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
  role: "user" | "model";
}

export interface GeminiGenerateContentResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

export interface GeminiModelInfo {
  displayName?: string;
  name: string;
  supportedGenerationMethods?: string[];
}
