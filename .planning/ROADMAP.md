# Roadmap — ChromaSnap

## Fases de Execução

### Fase 1: Fundação & Motor de Extração (Core Engine)
- **Objetivo:** O usuário pode fornecer uma imagem (upload, drag-drop, paste ou preset) e o sistema extrai 5 cores dominantes em tempo real.
- **Requisitos Cobertos:** REQ-INP-01, REQ-INP-02, REQ-INP-03, REQ-EXT-01, REQ-EXT-02, REQ-EXT-03.
- **Critérios de Sucesso:**
  1. Imagem carregada é processada em Canvas sem travar a interface.
  2. K-Means agrupa pixels e retorna 5 cores dominantes ordenadas por relevância visual.
  3. Conversão HEX, RGB e HSL exata para cada swatch.

### Fase 2: Harmonias de Cores & Análise de Contraste WCAG
- **Objetivo:** Adicionar rigor de design e acessibilidade a cada cor extraída.
- **Requisitos Cobertos:** REQ-EXT-04, REQ-ACC-01, REQ-ACC-02.
- **Critérios de Sucesso:**
  1. Cada cor exibe a taxa de contraste calculada contra texto branco e preto.
  2. Badges AA / AAA mostram claramente se a cor atende requisitos de legibilidade.
  3. Geração de harmonias complementares, análogas e triádicas a partir da cor líder.

### Fase 3: Formatos de Exportação Dev & UI Interativa
- **Objetivo:** Entregar utilidade imediata para o desenvolvedor com cópia de código em múltiplos formatos.
- **Requisitos Cobertos:** REQ-EXP-01, REQ-EXP-02, REQ-EXP-03, REQ-EXP-04, REQ-UX-02, REQ-UX-03.
- **Critérios de Sucesso:**
  1. Toque/clique em qualquer swatch copia o valor HEX/RGB/HSL com toast de feedback.
  2. Abas de exportação geram blocos formatados para Tailwind v4 e CSS Variables.
  3. Botão de download gera arquivo SVG vetorial e JSON estruturado.

### Fase 4: Persistência de Histórico & Empacotamento para Deploy
- **Objetivo:** Manter histórico local e garantir empacotamento estático otimizado para deploy imediato.
- **Requisitos Cobertos:** REQ-UX-01, Railway/Pages Ready.
- **Critérios de Sucesso:**
  1. Paletas salvas persistem no LocalStorage e podem ser recarregadas com 1 clique.
  2. `npm run build` compila sem nenhum erro TypeScript e gera bundle em `dist/`.
  3. Configuração de deploy pronta (`railway.json` e documentação de deploy estático).
