# 🎨 ChromaSnap — PaletaCores ExtratorFoto (Desafio 12x12 • Projeto #138)

> **"Arraste a imagem, extraia 5 cores harmônicas e copie classes prontas para Tailwind e CSS variables."**

Aplicação web moderna, responsiva e 100% client-side (sem envio de dados para servidores externos) que extrai paletas harmônicas a partir de fotos e imagens.

---

## ⚡ Funcionalidades Implementadas

1. **Upload & Drag and Drop Multiformato:**
   - Arrastar e soltar imagens (PNG, JPG, WebP, SVG, AVIF).
   - Suporte a colar direto da área de transferência (`Cmd+V` / `Ctrl+V`).
   - 4 Presets fotográficos/vetoriais embutidos para testar em 1 clique.
2. **Extração das 5 Cores Dominantes:**
   - Algoritmo K-Means ponderado por sensibilidade do olho humano em Canvas.
   - Conta-gotas interativo (Eyedropper): clique em qualquer ponto da foto para capturar a cor exata daquele pixel.
3. **Harmonias Cromáticas:**
   - Cores Complementares, Análogas, Triádicas, Monocromáticas (escala de tons Tailwind 50-900).
4. **Acessibilidade WCAG 2.1:**
   - Cálculo de luminância relativa e taxa de contraste (1:1 a 21:1) com selos AAA, AA ou Fail contra texto branco e preto.
5. **Central de Exportação (1 Clique para Copiar):**
   - `tailwind.config.js` (Tailwind v3)
   - `@theme` Tailwind v4
   - Classes utilitárias arbitrárias do Tailwind
   - Variáveis CSS nativas (`:root { --color-... }`)
   - Paleta completa em JSON
   - Download da cartela de cores em PNG
6. **Live UI Preview:**
   - Mockups de interface reais (card de produto, dashboard de métricas e banner de CTA) aplicando as cores extraídas em tempo real.

---

## 🚀 Como Rodar Localmente

```bash
# Entrar na pasta
cd 01-paletacores-extratorfoto

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra no navegador em `http://localhost:5173`.

---

## 🌐 Deploy em Produção

### Opção A: GitHub Pages (Grátis)
O projeto já está configurado com `base: './'` no `vite.config.ts`.
1. Gere a pasta de build:
   ```bash
   npm run build
   ```
2. O conteúdo da pasta `dist/` pode ser publicado diretamente no GitHub Pages via branch `gh-pages` ou GitHub Actions.

### Opção B: Railway
O projeto já conta com o arquivo `railway.json` pré-configurado:
1. Conecte seu repositório no Railway.
2. O Railway detectará o build automaticamente e subirá via `npx serve -s dist -l $PORT`.
