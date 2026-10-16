# Requisitos — ChromaSnap

## v1 Requirements (MVP - Desafio 12x12)

### Entrada e Imagens (INP)
- **[REQ-INP-01]** Suporte a Drag & Drop de arquivos de imagem (.png, .jpg, .webp, .svg, .avif).
- **[REQ-INP-02]** Suporte a colagem direta via Clipboard (`Cmd+V` / `Ctrl+V`).
- **[REQ-INP-03]** Disponibilização de 4 imagens pré-definidas (presets) para demonstração instantânea sem upload.

### Motor de Extração e Cor (EXT)
- **[REQ-EXT-01]** Redimensionamento proporcional em Canvas off-screen para amostragem ultrarrápida.
- **[REQ-EXT-02]** Algoritmo K-Means com filtragem de ruído/brancos extremos e priorização de saturação.
- **[REQ-EXT-03]** Conversão precisa entre modelos de cor: HEX, RGB, HSL.
- **[REQ-EXT-04]** Geração de harmonias automáticas baseadas na cor primária (Complementar, Análoga, Triádica, Monocromática).

### Acessibilidade (ACC)
- **[REQ-ACC-01]** Cálculo do Contrast Ratio WCAG 2.1 para texto branco (#ffffff) e preto (#000000).
- **[REQ-ACC-02]** Badge visual indicativo de conformidade (Normal Text: 4.5:1 AA, 7:1 AAA; Large Text: 3:1 AA).

### Exportação e Dev Experience (EXP)
- **[REQ-EXP-01]** Cópia rápida com 1 clique de valores individuais (HEX, RGB, HSL).
- **[REQ-EXP-02]** Bloco de código Tailwind CSS v4 pronto (`@theme { --color-primary: ... }`).
- **[REQ-EXP-03]** Bloco de variáveis CSS nativas (`:root { --color-1: ... }`).
- **[REQ-EXP-04]** Download da paleta em formato JSON e SVG vetorial com visualizador de swatches.

### UX e Persistência (UX)
- **[REQ-UX-01]** Armazenamento das últimas 10 paletas extraídas em LocalStorage com visualização rápida.
- **[REQ-UX-02]** Feedback visual com toasts animados ao copiar cores/código.
- **[REQ-UX-03]** Design moderno em Dark Mode responsivo para Mobile e Desktop.

## v2 Requirements (Pós-Lançamento)
- Extrator de gradientes CSS automáticos entre duas cores da paleta.
- Exportador de paleta para formato `.ase` (Adobe Swatch Exchange) e Figma Tokens.
- Filtro para ignorar plano de fundo ou selecionar área específica (crop).
