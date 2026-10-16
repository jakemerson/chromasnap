import { PresetImage } from '../types/color';

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

const sunsetSvg = `
<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4a154b" />
      <stop offset="35%" stop-color="#d946ef" />
      <stop offset="60%" stop-color="#f97316" />
      <stop offset="85%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#sky)" />
  <!-- Sun -->
  <circle cx="300" cy="240" r="75" fill="url(#sunGrad)" opacity="0.95" />
  <!-- Ocean -->
  <rect y="290" width="600" height="110" fill="url(#sea)" />
  <!-- Mountain Silhouettes -->
  <path d="M0 290 L120 220 L240 290 Z" fill="#1e1b4b" opacity="0.75" />
  <path d="M180 290 L320 200 L440 290 Z" fill="#2e1065" opacity="0.65" />
  <path d="M380 290 L490 230 L600 290 Z" fill="#1e1b4b" opacity="0.75" />
  <!-- Sun reflection on water -->
  <ellipse cx="300" cy="330" rx="45" ry="12" fill="#fed7aa" opacity="0.6" />
  <ellipse cx="300" cy="360" rx="30" ry="8" fill="#ffedd5" opacity="0.4" />
</svg>`;

const cyberpunkSvg = `
<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cyberSky" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#050510" />
      <stop offset="50%" stop-color="#180c38" />
      <stop offset="100%" stop-color="#2d0a4e" />
    </linearGradient>
    <linearGradient id="neonPink" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>
    <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#cyberSky)" />
  <!-- Neon Grid Floor -->
  <path d="M0 260 L600 260 M0 290 L600 290 M0 330 L600 330 M0 380 L600 380" stroke="#06b6d4" stroke-width="1.5" opacity="0.4" />
  <path d="M300 260 L100 400 M300 260 L200 400 M300 260 L300 400 M300 260 L400 400 M300 260 L500 400" stroke="#06b6d4" stroke-width="1.5" opacity="0.4" />
  <!-- Skyscrapers -->
  <rect x="70" y="110" width="75" height="150" fill="#090514" stroke="#ec4899" stroke-width="2" />
  <rect x="180" y="80" width="90" height="180" fill="#0c071e" stroke="#06b6d4" stroke-width="2" />
  <rect x="310" y="130" width="80" height="130" fill="#090514" stroke="#a855f7" stroke-width="2" />
  <rect x="430" y="60" width="100" height="200" fill="#0d0822" stroke="#ec4899" stroke-width="2" />
  <!-- Glowing Moon -->
  <circle cx="480" cy="110" r="50" fill="url(#neonPink)" opacity="0.85" />
  <circle cx="480" cy="110" r="70" fill="#ec4899" opacity="0.2" />
</svg>`;

const forestSvg = `
<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#dcfce7" />
      <stop offset="50%" stop-color="#bbf7d0" />
      <stop offset="100%" stop-color="#86efac" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#forestSky)" />
  <!-- Misty distant hills -->
  <path d="M0 240 Q150 180 300 220 T600 230 L600 400 L0 400 Z" fill="#15803d" opacity="0.45" />
  <path d="M0 270 Q200 210 400 250 T600 260 L600 400 L0 400 Z" fill="#166534" opacity="0.7" />
  <!-- Pine trees foreground -->
  <path d="M120 400 L120 280 L100 300 L120 260 L105 275 L120 230 L135 275 L120 260 L140 300 Z" fill="#14532d" />
  <path d="M220 400 L220 250 L195 275 L220 220 L200 240 L220 180 L240 240 L220 220 L245 275 Z" fill="#052e16" />
  <path d="M380 400 L380 270 L360 290 L380 245 L365 260 L380 210 L395 260 L380 245 L400 290 Z" fill="#14532d" />
  <path d="M490 400 L490 230 L460 260 L490 200 L470 220 L490 160 L510 220 L490 200 L520 260 Z" fill="#052e16" />
  <!-- River stream -->
  <path d="M0 370 Q300 340 600 380 L600 400 L0 400 Z" fill="#0284c7" opacity="0.8" />
</svg>`;

const cozyCoffeeSvg = `
<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="warmBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#451a03" />
      <stop offset="50%" stop-color="#78350f" />
      <stop offset="100%" stop-color="#92400e" />
    </linearGradient>
    <linearGradient id="coffeeCream" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#warmBg)" />
  <!-- Wooden Table -->
  <rect y="270" width="600" height="130" fill="#291205" />
  <line x1="0" y1="270" x2="600" y2="270" stroke="#b45309" stroke-width="4" opacity="0.5" />
  <!-- Coffee Cup -->
  <ellipse cx="300" cy="270" rx="90" ry="25" fill="#fef3c7" />
  <path d="M210 270 Q215 350 300 350 Q385 350 390 270 Z" fill="#fffbeb" />
  <!-- Liquid Inside -->
  <ellipse cx="300" cy="270" rx="80" ry="20" fill="url(#coffeeCream)" />
  <!-- Latte Art Heart -->
  <path d="M300 275 C290 265 270 265 270 275 C270 282 285 288 300 295 C315 288 330 282 330 275 C330 265 310 265 300 275 Z" fill="#ffffff" opacity="0.9" />
  <!-- Steam Curves -->
  <path d="M280 230 Q270 190 285 160" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.3" fill="none" />
  <path d="M305 220 Q315 180 300 150" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.4" fill="none" />
  <path d="M325 230 Q335 190 320 160" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.3" fill="none" />
</svg>`;

export const SAMPLE_PRESETS: PresetImage[] = [
  {
    id: 'sunset-ocean',
    title: 'Sunset & Ocean',
    category: 'Natureza Vibrante',
    dataUrl: svgToDataUrl(sunsetSvg)
  },
  {
    id: 'neon-cyberpunk',
    title: 'Neon Cyberpunk',
    category: 'Vibrante & Futurista',
    dataUrl: svgToDataUrl(cyberpunkSvg)
  },
  {
    id: 'nordic-forest',
    title: 'Nordic Forest',
    category: 'Tons Terrosos & Místicos',
    dataUrl: svgToDataUrl(forestSvg)
  },
  {
    id: 'cozy-coffee',
    title: 'Cozy Warm Coffee',
    category: 'Quente & Confortável',
    dataUrl: svgToDataUrl(cozyCoffeeSvg)
  }
];
