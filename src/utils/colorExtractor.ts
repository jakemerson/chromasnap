import { ExtractedColor, RGB } from '../types/color';
import { rgbToHex, rgbToHsl } from './colorConverter';
import { evaluateWcag, getBestTextColor } from './wcag';

interface ColorPoint {
  r: number;
  g: number;
  b: number;
}

function colorDistance(c1: ColorPoint, c2: ColorPoint): number {
  // Distância Euclidiana ponderada pela sensibilidade do olho humano
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db);
}

/**
 * Algoritmo K-Means rápido e determinístico para extrair as 5 cores principais
 */
function kMeansColors(pixels: ColorPoint[], k: number = 5, maxIterations: number = 10): { centroid: ColorPoint; count: number }[] {
  if (pixels.length === 0) {
    return [
      { centroid: { r: 99, g: 102, b: 241 }, count: 1 },
      { centroid: { r: 168, g: 85, b: 247 }, count: 1 },
      { centroid: { r: 236, g: 72, b: 153 }, count: 1 },
      { centroid: { r: 34, g: 197, b: 94 }, count: 1 },
      { centroid: { r: 249, g: 115, b: 22 }, count: 1 },
    ];
  }

  // Inicialização inteligente de centróides (distantes entre si)
  const centroids: ColorPoint[] = [];
  const step = Math.floor(pixels.length / k);
  for (let i = 0; i < k; i++) {
    centroids.push({ ...pixels[Math.min(i * step, pixels.length - 1)] });
  }

  let clusters: ColorPoint[][] = Array.from({ length: k }, () => []);

  for (let iter = 0; iter < maxIterations; iter++) {
    clusters = Array.from({ length: k }, () => []);

    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i];
      let bestDist = Infinity;
      let bestIndex = 0;

      for (let j = 0; j < k; j++) {
        const d = colorDistance(p, centroids[j]);
        if (d < bestDist) {
          bestDist = d;
          bestIndex = j;
        }
      }
      clusters[bestIndex].push(p);
    }

    // Recalcular centróides
    let changed = false;
    for (let j = 0; j < k; j++) {
      const group = clusters[j];
      if (group.length === 0) continue;

      let sumR = 0, sumG = 0, sumB = 0;
      for (let m = 0; m < group.length; m++) {
        sumR += group[m].r;
        sumG += group[m].g;
        sumB += group[m].b;
      }
      const newCentroid: ColorPoint = {
        r: Math.round(sumR / group.length),
        g: Math.round(sumG / group.length),
        b: Math.round(sumB / group.length),
      };

      if (colorDistance(newCentroid, centroids[j]) > 1) {
        centroids[j] = newCentroid;
        changed = true;
      }
    }

    if (!changed) break;
  }

  // Agrupar resultados com contagem de pixels para calcular proporção
  const results = centroids.map((c, idx) => ({
    centroid: c,
    count: clusters[idx].length
  }));

  // Ordenar pela cor mais frequente
  results.sort((a, b) => b.count - a.count);

  return results;
}

/**
 * Extrai pixels da imagem via Canvas e processa as 5 cores dominantes
 */
export async function extractPaletteFromImage(
  imageSource: HTMLImageElement | string,
  targetCount: number = 5
): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const processImageElement = (img: HTMLImageElement) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context não suportado');
        }

        // Redimensionar para tamanho otimizado (max 150px para rapidez extrema)
        const maxDim = 150;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const pixels: ColorPoint[] = [];
        // Amostrar pixels pulando passo 2 para aceleração adicional
        for (let i = 0; i < data.length; i += 16) {
          const a = data[i + 3];
          if (a >= 128) {
            pixels.push({
              r: data[i],
              g: data[i + 1],
              b: data[i + 2]
            });
          }
        }

        const clusters = kMeansColors(pixels, targetCount, 8);
        const totalSampled = clusters.reduce((acc, c) => acc + c.count, 0) || 1;

        const extracted: ExtractedColor[] = clusters.map((item, index) => {
          const hex = rgbToHex(item.centroid.r, item.centroid.g, item.centroid.b);
          const rgb: RGB = { r: item.centroid.r, g: item.centroid.g, b: item.centroid.b };
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          const percentage = Math.round((item.count / totalSampled) * 100);

          return {
            id: `color-${index}-${Date.now()}`,
            hex,
            rgb,
            hsl,
            percentage,
            wcagOnWhite: evaluateWcag('#FFFFFF', hex),
            wcagOnBlack: evaluateWcag('#000000', hex),
            bestTextColor: getBestTextColor(hex)
          };
        });

        resolve(extracted);
      } catch (err) {
        reject(err);
      }
    };

    if (typeof imageSource === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processImageElement(img);
      img.onerror = (e) => reject(new Error('Falha ao carregar imagem: ' + e));
      img.src = imageSource;
    } else {
      if (imageSource.complete && imageSource.naturalWidth > 0) {
        processImageElement(imageSource);
      } else {
        imageSource.onload = () => processImageElement(imageSource);
        imageSource.onerror = (e) => reject(new Error('Falha ao carregar elemento de imagem: ' + e));
      }
    }
  });
}

/**
 * Cria um objeto ExtractedColor para uma cor customizada (ex: Eyedropper ou edição manual)
 */
export function createExtractedColor(hex: string, percentage: number = 0, isCustom: boolean = true): ExtractedColor {
  const rgb = {
    r: parseInt(hex.slice(1, 3), 16) || 0,
    g: parseInt(hex.slice(3, 5), 16) || 0,
    b: parseInt(hex.slice(5, 7), 16) || 0,
  };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    hex: hex.toUpperCase(),
    rgb,
    hsl,
    percentage,
    wcagOnWhite: evaluateWcag('#FFFFFF', hex),
    wcagOnBlack: evaluateWcag('#000000', hex),
    bestTextColor: getBestTextColor(hex),
    isCustom
  };
}
