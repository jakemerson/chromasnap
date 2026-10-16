import { ExtractedColor } from '../types/color';

export function generateTailwindConfig(colors: ExtractedColor[], paletteName: string = 'chroma'): string {
  const roles = ['primary', 'secondary', 'accent', 'surface', 'muted', 'highlight'];
  
  const entries = colors.map((c, i) => {
    const roleName = roles[i] || `color-${i + 1}`;
    return `        ${roleName}: '${c.hex}',`;
  }).join('\n');

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ${paletteName}: {
${entries}
        }
      }
    }
  }
};`;
}

export function generateTailwindV4Theme(colors: ExtractedColor[]): string {
  const roles = ['primary', 'secondary', 'accent', 'surface', 'muted', 'highlight'];
  const vars = colors.map((c, i) => {
    const roleName = roles[i] || `color-${i + 1}`;
    return `  --color-${roleName}: ${c.hex};`;
  }).join('\n');

  return `/* No seu arquivo principal de estilos (index.css) */
@import "tailwindcss";

@theme {
${vars}
}`;
}

export function generateTailwindClasses(colors: ExtractedColor[]): string {
  return colors.map((c, i) => {
    return `/* Cor ${i + 1}: ${c.hex} */
.bg-palette-${i + 1} { background-color: ${c.hex}; }
.text-palette-${i + 1} { color: ${c.hex}; }
.border-palette-${i + 1} { border-color: ${c.hex}; }
/* Classes utilitárias arbitrárias do Tailwind: */
bg-[${c.hex}] text-[${c.hex}] border-[${c.hex}] hover:bg-[${c.hex}]`;
  }).join('\n\n');
}

export function generateCssVariables(colors: ExtractedColor[]): string {
  const roles = ['primary', 'secondary', 'accent', 'surface', 'muted', 'highlight'];
  const lines = colors.map((c, i) => {
    const role = roles[i] || `color-${i + 1}`;
    return `  --color-${role}: ${c.hex}; /* RGB(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}) */`;
  }).join('\n');

  return `:root {
${lines}
}`;
}

export function generateHexList(colors: ExtractedColor[]): string {
  return colors.map(c => c.hex).join(', ');
}

export function generateRgbList(colors: ExtractedColor[]): string {
  return colors.map(c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`).join('\n');
}

export function generateHslList(colors: ExtractedColor[]): string {
  return colors.map(c => `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`).join('\n');
}

export function generateJsonExport(colors: ExtractedColor[], metadata?: { title?: string }): string {
  const data = {
    title: metadata?.title || 'ChromaSnap Palette',
    extractedAt: new Date().toISOString(),
    totalColors: colors.length,
    colors: colors.map((c, i) => ({
      index: i + 1,
      hex: c.hex,
      rgb: c.rgb,
      hsl: c.hsl,
      percentage: c.percentage,
      wcag: {
        contrastOnWhite: `${c.wcagOnWhite.ratio}:1 (${c.wcagOnWhite.scoreText})`,
        contrastOnBlack: `${c.wcagOnBlack.ratio}:1 (${c.wcagOnBlack.scoreText})`,
        bestTextColor: c.bestTextColor
      }
    }))
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Gera o arquivo SVG com a cartela de cores formatada
 */
export function generatePaletteSvg(colors: ExtractedColor[], title: string = 'ChromaSnap Palette'): string {
  const width = 800;
  const height = 450;
  const swatchWidth = 130;
  const swatchHeight = 220;
  const startX = 65;
  const startY = 130;
  const gap = 15;

  const swatchesSvg = colors.slice(0, 5).map((c, i) => {
    const x = startX + i * (swatchWidth + gap);
    const textColor = c.bestTextColor;
    return `
    <g transform="translate(${x}, ${startY})">
      <rect width="${swatchWidth}" height="${swatchHeight}" rx="16" fill="${c.hex}" filter="url(#shadow)" />
      <rect y="${swatchHeight - 65}" width="${swatchWidth}" height="65" rx="16" fill="#0f172a" fill-opacity="0.85" />
      <text x="${swatchWidth / 2}" y="${swatchHeight - 38}" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="16" text-anchor="middle">${c.hex}</text>
      <text x="${swatchWidth / 2}" y="${swatchHeight - 16}" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="500" font-size="12" text-anchor="middle">${c.percentage}% presença</text>
      <circle cx="${swatchWidth / 2}" cy="40" r="14" fill="${textColor}" fill-opacity="0.25" />
      <text x="${swatchWidth / 2}" y="45" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="bold" font-size="13" text-anchor="middle">#${i + 1}</text>
    </g>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-5%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <rect width="${width}" height="${height}" rx="24" fill="url(#bg)" />
  
  <!-- Header -->
  <text x="65" y="65" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="800">${title}</text>
  <text x="65" y="92" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14">Extração inteligente de cores harmônicas • ChromaSnap</text>

  <!-- Swatches -->
  ${swatchesSvg}

  <!-- Footer -->
  <text x="735" y="405" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" text-anchor="end">Exportado via ChromaSnap • Desafio 12x12</text>
</svg>`;
}

/**
 * Desenha em um Canvas e faz download de uma imagem PNG de alta resolução da paleta
 */
export function downloadPalettePng(colors: ExtractedColor[], filename: string = 'chromasnap-palette.png'): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1200;
  const height = 675; // Proporção 16:9
  canvas.width = width;
  canvas.height = height;

  // Fundo gradiente moderno
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0b0f19');
  gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Título e Subtítulo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('ChromaSnap • Paleta de Cores', 80, 85);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('Cores dominantes extraídas com métricas e contraste WCAG', 80, 120);

  // Swatches
  const swatchWidth = 190;
  const swatchHeight = 360;
  const startX = 80;
  const startY = 170;
  const gap = 22;

  colors.slice(0, 5).forEach((c, i) => {
    const x = startX + i * (swatchWidth + gap);
    
    // Desenhar retângulo arredondado do swatch
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    // Path arredondado
    const r = 20;
    ctx.beginPath();
    ctx.moveTo(x + r, startY);
    ctx.lineTo(x + swatchWidth - r, startY);
    ctx.quadraticCurveTo(x + swatchWidth, startY, x + swatchWidth, startY + r);
    ctx.lineTo(x + swatchWidth, startY + swatchHeight - r);
    ctx.quadraticCurveTo(x + swatchWidth, startY + swatchHeight, x + swatchWidth - r, startY + swatchHeight);
    ctx.lineTo(x + r, startY + swatchHeight);
    ctx.quadraticCurveTo(x, startY + swatchHeight, x, startY + swatchHeight - r);
    ctx.lineTo(x, startY + r);
    ctx.quadraticCurveTo(x, startY, x + r, startY);
    ctx.closePath();
    ctx.fillStyle = c.hex;
    ctx.fill();
    ctx.restore();

    // Faixa escura inferior com dados
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(x, startY + swatchHeight - 95, swatchWidth, 95, [0, 0, 20, 20]);
    ctx.fill();

    // Textos
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.hex, x + swatchWidth / 2, startY + swatchHeight - 55);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`RGB(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`, x + swatchWidth / 2, startY + swatchHeight - 30);
    ctx.fillText(`${c.percentage}% presença`, x + swatchWidth / 2, startY + swatchHeight - 10);

    // Badge de número no topo
    ctx.fillStyle = c.bestTextColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(x + swatchWidth / 2, startY + 45, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.bestTextColor;
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${i + 1}`, x + swatchWidth / 2, startY + 51);

    ctx.restore();
  });

  // Rodapé
  ctx.fillStyle = '#64748b';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Gerado por ChromaSnap • Desafio 12x12', width - 80, height - 30);

  // Baixar
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
