import { RGB, WcagRating } from '../types/color';
import { hexToRgb } from './colorConverter';

/**
 * Calcula a luminância relativa conforme WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getRelativeLuminance(rgb: RGB): number {
  const normalize = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = normalize(rgb.r);
  const g = normalize(rgb.g);
  const b = normalize(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calcula a taxa de contraste entre duas cores (entre 1:1 e 21:1)
 */
export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Number(ratio.toFixed(2));
}

export function evaluateWcag(foregroundHex: string, backgroundHex: string): WcagRating {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);
  const ratio = getContrastRatio(fg, bg);

  let scoreText: 'AAA' | 'AA' | 'AA Large' | 'Fail' = 'Fail';
  const isAccessibleNormal = ratio >= 4.5;
  const isAccessibleLarge = ratio >= 3.0;

  if (ratio >= 7.0) {
    scoreText = 'AAA';
  } else if (ratio >= 4.5) {
    scoreText = 'AA';
  } else if (ratio >= 3.0) {
    scoreText = 'AA Large';
  } else {
    scoreText = 'Fail';
  }

  return {
    ratio,
    scoreText,
    isAccessibleNormal,
    isAccessibleLarge
  };
}

/**
 * Determina se a cor de texto branca ou preta oferece maior contraste para um fundo
 */
export function getBestTextColor(bgHex: string): '#FFFFFF' | '#000000' {
  const bg = hexToRgb(bgHex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const ratioWhite = getContrastRatio(white, bg);
  const ratioBlack = getContrastRatio(black, bg);

  return ratioWhite >= ratioBlack ? '#FFFFFF' : '#000000';
}
