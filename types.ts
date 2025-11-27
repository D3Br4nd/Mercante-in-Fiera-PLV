

export interface CardArchetype {
  id: string;
  nameIT: string; // Italian name for the prompt/display
  nameEN: string; // English description
  description: string;
  category: 'human' | 'animal' | 'object';
  icon: string; // Emoji or SVG path identifier
}

export enum ImageResolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K',
}

export enum AgingFilter {
  NONE = 'Originale',
  SEPIA = 'Seppia',
  FADED = 'Sbiadito',
  BW = 'Bianco e Nero',
  WARM = 'Caldo'
}

// Window interface extension for AI Studio key selection
// Using augmentation to avoid conflicts
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey(): Promise<boolean>;
      openSelectKey(): Promise<void>;
    };
  }
}

export interface GenerationState {
  isLoading: boolean;
  generatedImageUri: string | null;
  error: string | null;
}