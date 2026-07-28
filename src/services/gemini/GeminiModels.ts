export const defaultGeminiModels = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-flash-latest",
] as const;

export type GeminiModel = (typeof defaultGeminiModels)[number] | string;

export function resolveGeminiModel(model: string | undefined): GeminiModel {
  return model?.trim() || "gemini-flash-latest";
}
