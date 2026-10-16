export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface WcagRating {
  ratio: number;
  scoreText: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  isAccessibleNormal: boolean;
  isAccessibleLarge: boolean;
}

export interface ExtractedColor {
  id: string;
  hex: string;
  rgb: RGB;
  hsl: HSL;
  percentage: number;
  wcagOnWhite: WcagRating;
  wcagOnBlack: WcagRating;
  bestTextColor: '#FFFFFF' | '#000000';
  isCustom?: boolean;
}

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic';

export interface HarmonyGroup {
  type: HarmonyType;
  title: string;
  description: string;
  colors: string[]; // hex codes
}

export interface TailwindShade {
  shade: number;
  hex: string;
}

export interface PresetImage {
  id: string;
  title: string;
  category: string;
  dataUrl: string;
}

export interface SavedPalette {
  id: string;
  name: string;
  createdAt: number;
  colors: string[];
  thumbnailUrl?: string;
}
