import { ImageResolution, AgingFilter } from "../types";

export enum AIProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  OLLAMA = 'ollama',
}

export interface ProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string; // For Ollama or custom OpenAI proxies
  modelName?: string; // e.g., 'gpt-4o', 'llava'
}

export interface ImageGenerator {
  generate(
    imageBase64: string,
    cardName: string,
    cardDescription: string,
    resolution: ImageResolution,
    agingFilter: AgingFilter,
    config: ProviderConfig
  ): Promise<string>;
}
