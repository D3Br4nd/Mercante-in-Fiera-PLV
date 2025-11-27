import { ImageResolution, AgingFilter } from "../types";
import { AIProvider, ProviderConfig, ImageGenerator } from "./types";
import { GeminiGenerator } from "./providers/geminiGenerator";
import { OpenAIGenerator } from "./providers/openaiGenerator";
import { OllamaGenerator } from "./providers/ollamaGenerator";

// Helper to convert file to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Keep existing helper for backward compatibility or UI checks if needed
export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptSelectKey = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.error("AI Studio environment not detected.");
  }
};

const generators: Record<AIProvider, ImageGenerator> = {
  [AIProvider.GEMINI]: new GeminiGenerator(),
  [AIProvider.OPENAI]: new OpenAIGenerator(),
  [AIProvider.OLLAMA]: new OllamaGenerator(),
};

export const generateMercanteCard = async (
  imageBase64: string,
  cardNameIT: string,
  cardDescription: string,
  resolution: ImageResolution,
  agingFilter: AgingFilter = AgingFilter.NONE,
  config: ProviderConfig
): Promise<string> => {
  const generator = generators[config.provider];
  if (!generator) {
    throw new Error(`Provider ${config.provider} not supported`);
  }

  return await generator.generate(
    imageBase64,
    cardNameIT,
    cardDescription,
    resolution,
    agingFilter,
    config
  );
};
