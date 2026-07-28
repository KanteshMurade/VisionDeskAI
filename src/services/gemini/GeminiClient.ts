import type { GeminiContent, GeminiGenerateContentResponse, GeminiModelInfo } from "./GeminiTypes";

const baseUrl = "https://generativelanguage.googleapis.com/v1beta";
const defaultTimeoutMs = 20_000;

export class GeminiError extends Error {
  constructor(message: string, readonly status?: number) { super(message); this.name = "GeminiError"; }
}

interface GeminiClientOptions { apiKey: string; timeoutMs?: number; }

export class GeminiClient {
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor({ apiKey, timeoutMs = defaultTimeoutMs }: GeminiClientOptions) {
    this.apiKey = apiKey.trim();
    this.timeoutMs = timeoutMs;
  }

  async getModel(model: string): Promise<GeminiModelInfo> {
    return this.request<GeminiModelInfo>(model, `/models/${encodeURIComponent(model)}`, { method: "GET" });
  }

  async generateContent(model: string, contents: GeminiContent[]): Promise<string> {
    const response = await this.request<GeminiGenerateContentResponse>(model, `/models/${encodeURIComponent(model)}:generateContent`, {
      body: JSON.stringify({ contents }),
      method: "POST",
    });
    const text = response.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) throw new GeminiError("Gemini returned an empty response.");
    return text;
  }

  private async request<T>(model: string, path: string, options: RequestInit): Promise<T> {
    if (!this.apiKey) throw new GeminiError("A Gemini API key is required.");
    const requestUrl = `${baseUrl}${path}`;
    console.log("Using Gemini model:", model);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(requestUrl, {
        ...options,
        headers: { "Content-Type": "application/json", "x-goog-api-key": this.apiKey, ...options.headers },
        signal: controller.signal,
      });
      if (!response.ok) {
        const message = await this.errorMessage(response);
        console.error("Gemini request failed", { requestUrl, model, status: response.status, message });
        throw new GeminiError(message, response.status);
      }
      return await response.json() as T;
    } catch (error: unknown) {
      if (error instanceof GeminiError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error("Gemini request failed", { requestUrl, model, status: undefined, message: "Gemini request timed out." });
        throw new GeminiError("Gemini request timed out.");
      }
      console.error("Gemini request failed", { requestUrl, model, status: undefined, message: "Unable to reach Gemini." });
      throw new GeminiError("Unable to reach Gemini. Check your connection and try again.");
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  private async errorMessage(response: Response): Promise<string> {
    try {
      const body: unknown = await response.json();
      if (typeof body === "object" && body !== null) {
        const error = (body as Record<string, unknown>).error;
        if (typeof error === "object" && error !== null && typeof (error as Record<string, unknown>).message === "string") return (error as Record<string, string>).message;
      }
    } catch { /* Use a safe status-based fallback. */ }
    return response.status === 401 || response.status === 403 ? "Gemini rejected the API key." : `Gemini request failed (${response.status}).`;
  }
}
