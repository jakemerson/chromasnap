# ChromaSnap — Extrator de Paleta de Cores de Fotos
**Projeto [Rank #138] do Desafio 12 Projetos em 12 Semanas**

---

## 🎯 Visão e Proposta de Valor
Uma aplicação web ultrarrápida, client-side (100% privada e local), para extrair paletas de cores harmônicas a partir de imagens. Desenvolvedores e designers podem arrastar ou colar uma foto, visualizar instantaneamente as 5 cores dominantes calculadas via K-Means em Canvas, verificar conformidade de acessibilidade (WCAG 2.1 AA/AAA) e copiar classes prontas para Tailwind CSS v4, variáveis CSS nativas ou baixar paletas em SVG/JSON.

## 👤 Público-Alvo
- Desenvolvedores Frontend (Tailwind, CSS-in-JS, Next.js, Vite).
- Designers UI/UX buscando paletas rápidas a partir de fotografias/moodboards.
- Criadores de conteúdo buscando consistência visual.

## 🛠️ Stack Tecnológica
- **Framework:** React 19 + TypeScript + Vite.
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite`) + Lucide React.
- **Algoritmo de Extração:** Canvas API HTML5 nativa + K-Means Clustering ponderado por saturação/luminância (zero dependências externas pesadas).
- **Acessibilidade:** Motor WCAG 2.1 para cálculo de contraste contra texto claro/escuro.
- **Persistência:** LocalStorage (histórico de até 10 paletas recentes).
- **Deploy:** Static Site (Railway / GitHub Pages / Vercel).

## 🚫 Restrições e Não-Objetivos
- Sem upload para backend ou servidores externos: processamento 100% no navegador do usuário (garantia de privacidade e custo zero de infraestrutura).
- Sem dependências de bibliotecas de imagem em C++/Wasm que quebrem em browsers legados.
- Sem auth/login: foco em utilitário de valor imediato (Ship Fast).

## ✅ Critérios de Sucesso
1. Extração de 5 cores dominantes em < 100ms para imagens comuns (1MB a 5MB).
2. Suporte completo a Drag & Drop, botão de upload e Paste do Clipboard (`Cmd+V`).
3. Geração de código de 1 clique para Tailwind v4, CSS Variables, Hex e RGB.
4. Cálculo e exibição da taxa de contraste WCAG para cada cor.
5. Build de produção limpo com zero avisos ou erros de TypeScript.
