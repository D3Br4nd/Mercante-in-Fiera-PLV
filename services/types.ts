import { ImageResolution, AgingFilter } from "../types";

export enum AIProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  OLLAMA = 'ollama',
  ANTHROPIC = 'anthropic',
  OPENROUTER = 'openrouter',
}

export interface ProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string; // For Ollama or custom OpenAI proxies
  modelName?: string; // e.g., 'gpt-4o', 'llava', 'claude-3-5-sonnet'
  imageModelName?: string; // e.g., 'dall-e-3'
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
