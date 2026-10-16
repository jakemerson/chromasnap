import { RGB, HSL, TailwindShade, HarmonyGroup } from '../types/color';

export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (c: number) => clamp(c).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Gera uma escala Tailwind 50-950 a partir de um HEX base
 */
export function generateTailwindShades(baseHex: string): TailwindShade[] {
  const { h, s } = hexToHsl(baseHex);
  
  // Mapeamento de luminâncias calibradas para Tailwind
  const shadeMap: { shade: number; l: number; sFactor: number }[] = [
    { shade: 50, l: 96, sFactor: 0.35 },
    { shade: 100, l: 91, sFactor: 0.50 },
    { shade: 200, l: 82, sFactor: 0.70 },
    { shade: 300, l: 70, sFactor: 0.85 },
    { shade: 400, l: 56, sFactor: 0.95 },
    { shade: 500, l: 45, sFactor: 1.00 },
    { shade: 600, l: 36, sFactor: 0.95 },
    { shade: 700, l: 28, sFactor: 0.90 },
    { shade: 800, l: 20, sFactor: 0.85 },
    { shade: 900, l: 13, sFactor: 0.80 },
    { shade: 950, l: 8, sFactor: 0.75 },
  ];

  return shadeMap.map(item => {
    const finalS = Math.min(100, Math.round(s * item.sFactor));
    return {
      shade: item.shade,
      hex: hslToHex(h, finalS, item.l)
    };
  });
}

/**
 * Gera as harmonias clássicas da teoria das cores
 */
export function generateHarmonies(baseHex: string): HarmonyGroup[] {
  const { h, s, l } = hexToHsl(baseHex);

  const rotate = (angle: number) => (h + angle) % 360;

  const complementary = [
    baseHex,
    hslToHex(rotate(180), s, l)
  ];

  const analogous = [
    hslToHex(rotate(-30), s, l),
    baseHex,
    hslToHex(rotate(30), s, l)
  ];

  const triadic = [
    baseHex,
    hslToHex(rotate(120), s, l),
    hslToHex(rotate(240), s, l)
  ];

  const splitComplementary = [
    baseHex,
    hslToHex(rotate(150), s, l),
    hslToHex(rotate(210), s, l)
  ];

  const tetradic = [
    baseHex,
    hslToHex(rotate(90), s, l),
    hslToHex(rotate(180), s, l),
    hslToHex(rotate(270), s, l)
  ];

  const monochromatic = [
    hslToHex(h, Math.max(10, s - 20), Math.min(92, l + 35)),
    hslToHex(h, s, Math.min(80, l + 18)),
    baseHex,
    hslToHex(h, Math.min(100, s + 10), Math.max(20, l - 18)),
    hslToHex(h, Math.min(100, s + 20), Math.max(10, l - 32))
  ];

  return [
    {
      type: 'complementary',
      title: 'Complementar',
      description: 'Cores diametralmente opostas (180°). Proporciona o maior contraste visual e impacto dinâmico.',
      colors: complementary
    },
    {
      type: 'analogous',
      title: 'Análogas',
      description: 'Cores vizinhas no círculo cromático (±30°). Cria sensações naturais, serenas e harmoniosas.',
      colors: analogous
    },
    {
      type: 'triadic',
      title: 'Triádica',
      description: 'Três cores equidistantes (120°). Vibrante mesmo quando usada com tons menos saturados.',
      colors: triadic
    },
    {
      type: 'split-complementary',
      title: 'Fenda Complementar',
      description: 'Cor base e duas cores adjacentes à complementar. Alto contraste com menor tensão visual.',
      colors: splitComplementary
    },
    {
      type: 'tetradic',
      title: 'Tetrádica / Retangular',
      description: 'Quatro cores organizadas em dois pares de complementares. Rica em variações.',
      colors: tetradic
    },
    {
      type: 'monochromatic',
      title: 'Monocromática',
      description: 'Variações de brilho e saturação do mesmo matiz. Elegante, clean e muito fácil de aplicar em UI.',
      colors: monochromatic
    }
  ];
}
