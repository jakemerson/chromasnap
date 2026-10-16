import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ExtractedColor, HarmonyGroup } from './types/color';
import { extractPaletteFromImage, createExtractedColor } from './utils/colorExtractor';
import { generateHarmonies, generateTailwindShades } from './utils/colorConverter';
import {
  generateTailwindConfig,
  generateTailwindV4Theme,
  generateTailwindClasses,
  generateCssVariables,
  generateJsonExport,
    downloadPalettePng
} from './utils/exportFormats';
import {
  Copy,
  Check,
  Pipette,
  Download,
  Sparkles,
  Layers,
  Code,
  FileJson,
  Palette,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState<string>('Minha Imagem');
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'palette' | 'harmonies' | 'export' | 'preview'>('palette');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [exportFormat, setExportFormat] = useState<'tailwind' | 'tailwindV4' | 'classes' | 'cssVars' | 'json'>('tailwind');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Carregar paleta quando a imagem mudar
  const handleImageSelected = async (dataUrl: string, title?: string) => {
    setImageSrc(dataUrl);
    if (title) setImageTitle(title);
    setIsLoading(true);

    try {
      const extracted = await extractPaletteFromImage(dataUrl, 5);
      setColors(extracted);
      setSelectedColorIndex(0);
    } catch (err) {
      console.error('Erro ao extrair cores:', err);
      alert('Não foi possível extrair cores desta imagem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setColors([]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.8 },
      colors: colors.map(c => c.hex)
    });
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Eyedropper API nativa do navegador (se suportada) ou clique no canvas
  const handleNativeEyedropper = async () => {
    // @ts-ignore
    if (window.EyeDropper) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          const newColor = createExtractedColor(result.sRGBHex, 0, true);
          setColors(prev => [newColor, ...prev.slice(0, 4)]);
          setSelectedColorIndex(0);
        }
      } catch (e) {
        console.log('Eyedropper cancelado');
      }
    } else {
      alert('Clique diretamente sobre a imagem para capturar a cor desejada.');
    }
  };

  // Clique na imagem para pegar pixel exato via Canvas
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;

    const newColor = createExtractedColor(hex, 0, true);
    setColors(prev => [newColor, ...prev.slice(0, 4)]);
    setSelectedColorIndex(0);
    copyToClipboard(hex, 'eyedropper-click');
  };

  const selectedColor = colors[selectedColorIndex] || colors[0];
  const harmonies: HarmonyGroup[] = selectedColor ? generateHarmonies(selectedColor.hex) : [];
  const shades = selectedColor ? generateTailwindShades(selectedColor.hex) : [];

  const getExportCode = () => {
    if (colors.length === 0) return '';
    switch (exportFormat) {
      case 'tailwind':
        return generateTailwindConfig(colors);
      case 'tailwindV4':
        return generateTailwindV4Theme(colors);
      case 'classes':
        return generateTailwindClasses(colors);
      case 'cssVars':
        return generateCssVariables(colors);
      case 'json':
        return generateJsonExport(colors, { title: imageTitle });
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header onReset={handleReset} hasImage={!!imageSrc} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {!imageSrc ? (
          <div className="flex-1 flex flex-col justify-center items-center py-12">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Desafio 12 Projetos em 12 Semanas • #138
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Extraia Cores Perfeitas de Qualquer Imagem
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">
                Arraste uma foto, descubra as 5 cores dominantes harmônicas e copie o código pronto para Tailwind CSS, variáveis CSS e JSON em 1 clique.
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Barra de Navegação de Visualizações */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('palette')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                    activeTab === 'palette'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" /> Paleta Dominante
                </button>
                <button
                  onClick={() => setActiveTab('harmonies')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                    activeTab === 'harmonies'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Harmonias & Tons
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> UI Preview Ao Vivo
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                    activeTab === 'export'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> Código & Exportação
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNativeEyedropper}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition flex items-center gap-1.5"
                  title="Capturar cor com conta-gotas da tela"
                >
                  <Pipette className="w-3.5 h-3.5" /> Conta-Gotas
                </button>
                <button
                  onClick={() => downloadPalettePng(colors, imageTitle)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Baixar Cartela PNG
                </button>
              </div>
            </div>

            {/* Imagem + Cores Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Imagem com suporte a clique */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center max-h-[380px]">
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt={imageTitle}
                    onClick={handleImageClick}
                    className="w-full h-full object-contain cursor-crosshair select-none"
                    title="Clique em qualquer ponto da foto para capturar a cor!"
                  />
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition">
                    <span className="flex items-center gap-1.5">
                      <Pipette className="w-3 h-3 text-indigo-400" /> Clique na imagem para selecionar cor
                    </span>
                    <span className="text-[10px] text-slate-400">{imageTitle}</span>
                  </div>
                </div>
              </div>

              {/* Faixas de Cores Principais (Paleta 5 Cores) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="grid grid-cols-5 gap-2 sm:gap-3 h-32 sm:h-44">
                  {colors.map((color, idx) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColorIndex(idx)}
                      style={{ backgroundColor: color.hex }}
                      className={`relative rounded-xl flex flex-col justify-between p-2 sm:p-3 text-left transition-all duration-200 transform group hover:-translate-y-1 ${
                        selectedColorIndex === idx
                          ? 'ring-4 ring-indigo-500 shadow-lg shadow-indigo-500/25 scale-[1.02]'
                          : 'border border-black/10'
                      }`}
                    >
                      <span
                        style={{ color: color.bestTextColor }}
                        className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90"
                      >
                        {color.percentage > 0 ? `${color.percentage}%` : 'Pick'}
                      </span>
                      <div>
                        <span
                          style={{ color: color.bestTextColor }}
                          className="font-mono text-xs sm:text-sm font-bold block"
                        >
                          {color.hex}
                        </span>
                        <span
                          style={{ color: color.bestTextColor }}
                          className="text-[9px] opacity-75 hidden sm:block"
                        >
                          R{color.rgb.r} G{color.rgb.g} B{color.rgb.b}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Detalhes da Cor Selecionada */}
                {selectedColor && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        style={{ backgroundColor: selectedColor.hex }}
                        className="w-12 h-12 rounded-xl border border-white/10 shadow-inner flex items-center justify-center font-mono font-bold text-xs"
                      >
                        <span style={{ color: selectedColor.bestTextColor }}>★</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-extrabold text-white">
                            {selectedColor.hex}
                          </span>
                          <button
                            onClick={() => copyToClipboard(selectedColor.hex, `hex-${selectedColor.hex}`)}
                            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
                            title="Copiar Hex"
                          >
                            {copiedId === `hex-${selectedColor.hex}` ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          rgb({selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}) • hsl({selectedColor.hsl.h}°, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%)
                        </p>
                      </div>
                    </div>

                    {/* WCAG Badges */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                          Contraste WCAG 2.1
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              selectedColor.wcagOnWhite.scoreText !== 'Fail'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            Branco: {selectedColor.wcagOnWhite.ratio}:1 ({selectedColor.wcagOnWhite.scoreText})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              selectedColor.wcagOnBlack.scoreText !== 'Fail'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            Preto: {selectedColor.wcagOnBlack.ratio}:1 ({selectedColor.wcagOnBlack.scoreText})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONTEÚDO DAS ABAS */}

            {/* ABA 1: PALETA DOMINANTE & TONS */}
            {activeTab === 'palette' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" /> Escala Monocromática (Tons Tailwind 50-900)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                    {shades.map((shade) => (
                      <div
                        key={shade.shade}
                        onClick={() => copyToClipboard(shade.hex, `shade-${shade.shade}`)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col hover:border-slate-700 transition"
                      >
                        <div style={{ backgroundColor: shade.hex }} className="h-16 w-full relative">
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                            {copiedId === `shade-${shade.shade}` ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Copy className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="p-2 text-center">
                          <span className="text-[10px] text-slate-400 font-bold block">{shade.shade}</span>
                          <span className="font-mono text-[11px] text-white font-semibold block">{shade.hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: HARMONIAS CROMÁTICAS */}
            {activeTab === 'harmonies' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Harmonias Cromáticas com Base em {selectedColor?.hex}
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Relações geométricas no círculo cromático baseadas na teoria das cores. Clique em qualquer cor para copiar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {harmonies.map((harmony) => (
                    <div
                      key={harmony.type}
                      className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-sm text-white">{harmony.title}</h4>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {harmony.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">{harmony.description}</p>
                      </div>

                      <div className="grid grid-flow-col auto-cols-fr gap-2 h-16 rounded-xl overflow-hidden">
                        {harmony.colors.map((hex, i) => (
                          <button
                            key={i}
                            onClick={() => copyToClipboard(hex, `harm-${harmony.type}-${i}`)}
                            style={{ backgroundColor: hex }}
                            className="group relative flex items-end justify-center p-1.5 transition hover:opacity-90"
                            title={`Copiar ${hex}`}
                          >
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm opacity-90 group-hover:scale-105 transition">
                              {copiedId === `harm-${harmony.type}-${i}` ? '✓' : hex}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA 3: UI PREVIEW AO VIVO */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" /> Preview de Interface em Tempo Real
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Veja como as cores extraídas se comportam aplicadas em componentes reais de interface.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1: Produto / E-commerce */}
                  <div
                    style={{ backgroundColor: colors[3]?.hex || '#0f172a' }}
                    className="rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      <span
                        style={{
                          backgroundColor: colors[0]?.hex || '#6366f1',
                          color: colors[0]?.bestTextColor || '#fff'
                        }}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block"
                      >
                        Novo Lançamento
                      </span>
                      <h4
                        style={{ color: colors[3]?.bestTextColor || '#fff' }}
                        className="text-xl font-extrabold mb-2"
                      >
                        Design System Harmônico
                      </h4>
                      <p
                        style={{ color: colors[3]?.bestTextColor || '#cbd5e1' }}
                        className="text-xs opacity-80 mb-6 leading-relaxed"
                      >
                        Extraia paletas diretamente da sua identidade visual fotográfica e padronize seu design sem retrabalho.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <span
                          style={{ color: colors[3]?.bestTextColor || '#94a3b8' }}
                          className="text-[10px] block opacity-75"
                        >
                          Licença Vitalícia
                        </span>
                        <span
                          style={{ color: colors[3]?.bestTextColor || '#fff' }}
                          className="text-lg font-mono font-bold"
                        >
                          R$ 29,00
                        </span>
                      </div>
                      <button
                        style={{
                          backgroundColor: colors[1]?.hex || '#a855f7',
                          color: colors[1]?.bestTextColor || '#fff'
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition"
                      >
                        Comprar Agora
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Estatísticas / Dashboard */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400">Taxa de Conversão</span>
                        <span
                          style={{
                            backgroundColor: colors[0]?.hex + '22',
                            color: colors[0]?.hex
                          }}
                          className="px-2 py-0.5 rounded text-[11px] font-bold"
                        >
                          +34.2%
                        </span>
                      </div>
                      <span className="text-3xl font-black text-white font-mono block mb-1">
                        98.4%
                      </span>
                      <p className="text-xs text-slate-400">
                        Usuários retidos pela estética visual da paleta.
                      </p>
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Harmonia Visual</span>
                        <span style={{ color: colors[0]?.hex }} className="font-bold">Aprovado AAA</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div style={{ backgroundColor: colors[0]?.hex, width: '40%' }} className="h-full" />
                        <div style={{ backgroundColor: colors[1]?.hex, width: '30%' }} className="h-full" />
                        <div style={{ backgroundColor: colors[2]?.hex, width: '20%' }} className="h-full" />
                        <div style={{ backgroundColor: colors[4]?.hex, width: '10%' }} className="h-full" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Call to Action / Banner */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]?.hex || '#4f46e5'}, ${colors[1]?.hex || '#9333ea'})`
                    }}
                    className="rounded-2xl p-6 shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm mb-4 inline-block">
                        Projetos 12x12
                      </span>
                      <h4 className="text-2xl font-black text-white mb-2 leading-tight">
                        Pronto para o Próximo MVP?
                      </h4>
                      <p className="text-white/80 text-xs leading-relaxed">
                        Construído com velocidade máxima, Tailwind CSS, TypeScript e algoritmos client-side eficientes.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('export')}
                      className="mt-6 w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-1.5"
                    >
                      Copiar Código da Paleta <Code className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: CÓDIGO & EXPORTAÇÃO */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-400" /> Exportação Direta para o Código
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Selecione o formato desejado e copie com 1 clique para colar direto no seu projeto.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                  <button
                    onClick={() => setExportFormat('tailwind')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      exportFormat === 'tailwind'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    tailwind.config.js (v3)
                  </button>
                  <button
                    onClick={() => setExportFormat('tailwindV4')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      exportFormat === 'tailwindV4'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    @theme Tailwind v4
                  </button>
                  <button
                    onClick={() => setExportFormat('classes')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      exportFormat === 'classes'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Classes Utilitárias
                  </button>
                  <button
                    onClick={() => setExportFormat('cssVars')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      exportFormat === 'cssVars'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    CSS Variables (:root)
                  </button>
                  <button
                    onClick={() => setExportFormat('json')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      exportFormat === 'json'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    JSON Palette
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
                    <span className="text-xs font-mono text-slate-400">
                      {exportFormat === 'tailwind' && 'tailwind.config.js'}
                      {exportFormat === 'tailwindV4' && 'index.css (@theme)'}
                      {exportFormat === 'classes' && 'Utility Classes'}
                      {exportFormat === 'cssVars' && 'variables.css'}
                      {exportFormat === 'json' && 'palette.json'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(getExportCode(), 'export-code')}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {copiedId === 'export-code' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copiar Código
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto max-h-[350px]">
                    <code>{getExportCode()}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          ChromaSnap • Desafio 12 Projetos em 12 Semanas — Construído com Vite, React, TypeScript e Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}

export default App;
