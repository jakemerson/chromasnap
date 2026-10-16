import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Clipboard, ArrowRight } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/sampleImages';
import { PresetImage } from '../types/color';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string, title?: string) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP, SVG, AVIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  // Listener para Ctrl+V / Cmd+V
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Extração Instantânea com IA & Canvas</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Transforme qualquer foto em <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            paletas de design profissionais
          </span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Arraste uma foto, extraia 5 cores dominantes, analise contraste WCAG e copie classes prontas para Tailwind CSS e CSS Variables em 1 clique.
        </p>
      </div>

      {/* Dropzone Principal */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-10 h-10 animate-pulse" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Arraste e solte sua foto aqui
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Ou clique para procurar em seu computador. Suporta PNG, JPG, WebP, SVG ou AVIF.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950/60 py-1.5 px-4 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 text-slate-300">
              <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
              Dica:
            </span>
            <span>Você também pode colar direto com</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">
              Ctrl+V
            </kbd>
            <span>/</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] border border-slate-700">
              Cmd+V
            </kbd>
          </div>
        </div>
      </div>

      {/* Seção de Presets / Imagens de Exemplo */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Sem foto agora? Teste com um clique:
            </h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Exemplos calibrados</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SAMPLE_PRESETS.map((preset: PresetImage) => (
            <button
              key={preset.id}
              onClick={() => onImageSelected(preset.dataUrl, preset.title)}
              disabled={isLoading}
              className="group relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all text-left flex flex-col focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="w-full aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={preset.dataUrl}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 bg-slate-900/80 flex items-center justify-between w-full">
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {preset.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {preset.category}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
