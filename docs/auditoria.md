# AUDITORIA TÉCNICA E MATRIZ DE TRANSIÇÃO
**Projeto:** Veridian Capital → Zuse Labs  
**Data:** 27 de Outubro de 2026  
**Status da Auditoria:** Concluída (Fase 0 · Modo Somente Leitura)  
**Git Baseline Tag:** `baseline-veridian`

---

## 1. Stack Tecnológica e Dependências

### Core Runtime
- **Next.js:** `16.0.10` (App Router, Turbopack)
- **React:** `19.2.0` / **React-DOM:** `19.2.0`
- **TypeScript:** `5.9.3`
- **Node.js:** `v24.19.0`
- **Package Manager:** `pnpm` (Lockfile v9/v11)

### UI & Styling
- **Tailwind CSS:** `^4.1.9` (`@tailwindcss/postcss 4.3.1`, `@import "tailwindcss"`)
- **Animações CSS:** `tw-animate-css 1.3.3`, `tailwindcss-animate 1.0.7`
- **Primitivos UI:** Radix UI (`@radix-ui/react-accordion`, `@radix-ui/react-dialog`, etc.)
- **Formulários:** `react-hook-form 7.80.0` + `@hookform/resolvers 3.10.0` + `zod 3.25.76`
- **Ícones:** `lucide-react 0.454.0`
- **Carrossel:** `embla-carousel-react 8.5.1`

### Motion & Scroll
- **Framer Motion:** `12.41.0`
- **Lenis:** `^1.3.24` (`lenis/react`)
- **GSAP:** *Não instalado atualmente*. Será adicionado na Fase 1: `gsap`, `@gsap/react`.

### QA & Validação Runtime
- **Playwright:** `1.64.1` (com Chromium headless shell disponível)

---

## 2. Tokens e Tipografia

### Configuração Atual (Veridian)
- **Fontes:** `Inter` (`--font-inter`) e `GFS Didot` (`--font-didot`) via `next/font/google` em `app/layout.tsx`.
- **Cores / Tokens em `app/globals.css`:**
  - `--background`: `#f5f3ef` (bege claro)
  - `--foreground`: `#4a584e` (verde floresta escuro)
  - `--card`: `#faf9f7`, `--border`: `#d8d4cc`, `--primary`: `#4a584e`

### Alvo Zuse Labs (Regras E1 e Marca)
- **Tipografia:** `Space Grotesk` global em todo o site.
  - Títulos: peso `300`–`500`, tracking `-0.03em`.
  - Corpo de texto: peso `400`.
  - Remoção completa de `Inter`, `GFS Didot`, `Syne` e `JetBrains Mono` (mono permitido apenas dentro de simulação de código no celular).
- **Paleta de Cores:**
  - Fundo principal: `#0b0b0d` (preto/cinza ultra-escuro plano)
  - Superfícies/Linhas: `#2b2d31` (grafite para divisores finos de 1px)
  - Texto principal: `#ffffff`
  - Acento pontual: `#c72c3b` (vermelho Zuse — CTAs primários, estados ativos pontuais)
  - Banimento estrito de `blur`, `backdrop-filter`, `radial-gradient` vermelho e `glow`.

---

## 3. Mapeamento de Animações Existentes (Arquivo:Linha)

### Seções Ativas
- **`components/sections/hero.tsx`**:
  - `L35`: `requestAnimationFrame(smoothUpdate)` para efeito de scroll no mockup.
  - `L95, L107, L109, L118`: Elementos `motion.div` e `motion.p` com `framer-motion` (fade/slide no hero).
- **`components/sections/phone-mockup.tsx`**:
  - `L4`: Importação de `AnimatePresence` e `motion`.
  - `L183, L202, L213, L231, L246, L257, L276, L382, L391`: Ciclo das telas do mockup com transições animadas.
- **`components/sections/clients-carousel.tsx`**:
  - `L57, L60`: Loop de animação via `requestAnimationFrame` manual para scroll infinito horizontal.
- **`components/sections/testimonials-section.tsx`**:
  - `L77, L80`: Loop de animação via `requestAnimationFrame` para carrossel infinito de depoimentos.
- **`components/sections/portfolio-section.tsx`**:
  - `L6, L29-31, L55-64`: Hook `useSpring` e `useTransform` para parallax 3D no mouse hover.
- **`components/layout/mobile-menu.tsx`**:
  - `L4, L96, L156, L168, L182, L199, L205, L226`: Drawer mobile com `AnimatePresence` e stagger de links.
  - `L133, L150`: Chamadas `requestAnimationFrame` para parar Lenis e executar scroll to top.
- **`components/layout/navbar.tsx`**:
  - `L25`: Chamada `requestAnimationFrame` para scroll suave.
- **`components/layout/reveal.tsx`**:
  - `L3, L22, L30`: Wrapper de reveal usando `framer-motion` variants.
- **`components/layout/animated-text.tsx`**:
  - `L3, L24, L36`: Split de palavras/letras com `motion.span`.
- **`components/layout/smooth-scroll.tsx`**:
  - `ReactLenis` com rAF nativo descolado do ticker do GSAP.

### Componentes Órfãos
- `components/animated-revenue-chart.tsx`: `L4, L51, L68, L119, L142, L163` (`framer-motion`).
- `components/features-section.tsx`: `L5, L41, L62, L89, L106` (`requestAnimationFrame` + `motion`).
- `components/pricing-section.tsx`: `L109, L112` (`requestAnimationFrame`).
- `components/realtime-property-card.tsx`: `L4, L83, L106, L186` (`framer-motion`).
- `components/stats-section.tsx`: `L22, L26` (`requestAnimationFrame`).

---

## 4. Componentes e Estrutura de Conteúdo

### Fontes de Dados
- **Atualmente:** Existe apenas `data/site.ts` no projeto ativo (não há `content/site.ts`).
- **Ação:** Manter estritamente `data/site.ts` como fonte única de verdade (Regra E11).

### Componentes de Seção Atuais (`components/sections/`)
1. `hero.tsx`
2. `clients-carousel.tsx`
3. `capabilities-section.tsx`
4. `process-section.tsx`
5. `services-section.tsx`
6. `portfolio-section.tsx`
7. `testimonials-section.tsx`
8. `faq-section.tsx`
9. `contact-section.tsx`
10. `phone-mockup.tsx`
11. `dashboard-mockup.tsx` (não utilizado na página)

---

## 5. Assets Existentes

- **Public Branding Veridian (`public/images/brand/`):**
  - `banner.svg`, `logotipo.svg`, `monograma.svg` (antigos da Veridian, com paleta verde).
- **Public Clientes Fictícios (`public/images/clients/`):**
  - 8 SVGs de empresas fictícias (`elan-studio`, `forma-digital`, etc.).
- **Public Projetos Fictícios (`public/images/projects/`):**
  - 4 SVGs (`alpha`, `lumina`, `nova`, `vertex`).
- **Assets Zuse Labs Identificados em Downloads:**
  - `/home/joaomotta/Downloads/LOGO NEGATIVA.svg` (Logotipo Zuse Labs em vetor oficial: vermelho `#c72c3b` e branco `#ffffff`).
  - `/home/joaomotta/Downloads/ZUSE MONOGRAMA.svg` (Monograma 'Z' oficial).
  - `/home/joaomotta/Downloads/LOGO.png` e `LOGO NEGATIVA.png`.
- **Ação Fase 1:** Copiar e padronizar em `public/LOGOS-ZUSELABS/` com nomes kebab-case (`zuse-monograma.svg`, `zuse-logotipo-negativo.svg`) e criar componentes inline React.

---

## 6. Mapeamento de Menções a "Veridian" (Fora da Vera)

Total de 45+ menções identificadas fora dos arquivos protegidos da Vera:
- `lib/seo.ts` (metadados Open Graph, descrições, alt)
- `data/site.ts` (nome, URLs, emails, títulos, depoimentos, FAQs)
- `.env.example` (URLs e instâncias)
- `package.json` (campo `name: "veridian-capital"`)
- `components/sections/phone-mockup.tsx` (títulos e labels do app)
- `components/sections/clients-carousel.tsx` (heading "Empresas que confiam na Veridian")
- `components/sections/hero.tsx` (watermark de fundo "VERIDIAN", botão "Fale com a Veridian")
- `components/layout/footer.tsx` (copyright Veridian Capital)
- `components/layout/logo.tsx` (marca Veridian)
- `public/site.webmanifest`, `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`
- `scripts/` (`setup-evolution-typebot.mjs`, `generate-brand-assets.mjs`)

*Nota Inviolável (V1):* Arquivos da Vera (`components/vera/vera-chat.tsx`, `lib/vera/*`, `app/api/vera/*`, `app/api/leads/*`, `lib/leads/*`) permanecem rigorosamente intocados.

---

## 7. Riscos Técnicos e Conformidade (Regra E12)

| Risco / Problema | Situação Atual | Resolução Obrigatória |
| :--- | :--- | :--- |
| **`overflow-x` quebra scroll e sticky** | Usado `overflow-x: hidden` no `html`, `body` e `main` | Substituir por `overflow-x: clip` |
| **Lenis vs GSAP ScrollTrigger ticker** | `ReactLenis` rodando com RAF próprio desvinculado | Configurar `autoRaf={false}` + `gsap.ticker.add` + `ScrollTrigger.update` + `lagSmoothing(0)` |
| **Conflito de interpolação GSAP x Framer** | Mesmos elementos usando `motion.*` e animações de scroll | Elementos controlados por GSAP (Hero Pin, SplitText) serão DOM padrão |
| **Arquivos SVG com espaços** | Arquivos na pasta de download com espaços e maiúsculas | Padronizar kebab-case em `public/LOGOS-ZUSELABS/` e usar SVG inline |
| **Next.js 16 + React 19 Ref Error** | Arquivos órfãos chamando `useRef<number>()` sem valor inicial | Remover arquivos órfãos não utilizados |

---

## 8. Arquivos Órfãos do Template Antigo

Os seguintes arquivos são resquícios do template anterior e não participam do fluxo da aplicação:
- `styles/globals.css` (duplicado, não importado)
- `terminals/` (arquivos `.next-id` e `1.txt`)
- `components/animated-revenue-chart.tsx`
- `components/animated-text.tsx`
- `components/blog-section.tsx`
- `components/cta-section.tsx`
- `components/faq-section.tsx`
- `components/features-section.tsx`
- `components/footer.tsx`
- `components/header.tsx`
- `components/hero-section.tsx`
- `components/pricing-section.tsx`
- `components/property-booking-card.tsx`
- `components/realtime-property-card.tsx`
- `components/revenue-breakdown-chart-card.tsx`
- `components/services-section.tsx`
- `components/stats-section.tsx`
- `components/testimonials-section.tsx`
- `components/theme-provider.tsx`
- `components/sections/dashboard-mockup.tsx`
- `public/images/property-*.jpg`

---

## 9. Matriz Veridian → Zuse por Seção

| Seção | Ação | Decisão e Especificação de Implementação |
| :--- | :---: | :--- |
| **Preloader** | **NOVO** | Stroke-draw do monograma Z + contador suave (≤ 2.2s, 1ª visita via cookie/sessionStorage). Ao finalizar, emite evento que aciona `data-preloader-done="true"` (liberando a Vera). |
| **Navbar** | **ADAPTAR** | Barra plana de largura total (sem pílula/container arredondado/glass). Fundo transparente no topo, `#0b0b0d` com linha fina grafite `1px` após o scroll. Recebe a logo via FLIP no final do scrub do Hero. |
| **Hero Pinado** | **ADAPTAR / REFINAR** | Coreografia cinematográfica GSAP ScrollTrigger (pin ~300vh desktop / 200vh mobile):<br>• **0–12%:** Monograma Z isolado centralizado (recebido suave do preloader).<br>• **12–35%:** Z desliza à esquerda; após parar, o logotipo surge por máscara a partir da borda do Z. Container flex com gap fixo (sem sobreposição).<br>• **35–50%:** Logo completa sobe até slot reservado acima do bloco de texto.<br>• **50–70%:** Com logo parada, revelação linha a linha da headline ("Engenharia de software com precisão cinematográfica."), subtítulo, CTAs e celular iPhone.<br>• **70–100%:** Logo faz FLIP até o slot definitivo da navbar; navbar assume; pin é liberado.<br>• *Fallback:* Redução de movimento ou sem JS exibe layout estático limpo sem pin. |
| **Celular (iPhone Mockup)** | **ADAPTAR** | Mantida a estrutura e animação de collapse do iPhone original (Regra E6). 4 telas editoriais Zuse em ciclo: 01 Software (código e UI), 02 Suporte (tickets e status resolvido), 03 Cibersegurança (escudo/verificação), 04 IA (conversa). Sem métricas falsas, sem glow. |
| **Marquee de Tecnologias** | **SUBSTITUIR** | Substitui carrossel de clientes fictícios. Wordmarks reais da stack moderna (Next.js, React, TypeScript, Python, Node, PostgreSQL, Docker, AWS, Tailwind) em linhas editoriais finas, sem caixas. Velocidade sutil atrelada ao scroll. |
| **Capacidades** | **ADAPTAR** | Título grande direto + 3 colunas de texto separadas por linhas verticais finas de 1px (Software · Suporte e Manutenção de TI · Cibersegurança e IA). Sem caixas, sem ícones decorativos em cards, sem chips. |
| **Cena Keynote Pinada** | **NOVA** | Cena minimalista editorial com transição pinada de palavras-chave gigantes ("Software. / Suporte. / Segurança. / IA.") + 1 frase direta descritiva. Sem barras de progresso ou caixas. |
| **Processo / Método** | **ADAPTAR** | Passos numerados em coluna com linhas finas divisórias + manifesto editorial com palavras acendendo suavemente no scroll. Sem telemetria ou números inventados. |
| **Serviços (01–04)** | **ADAPTAR** | Lista editorial em linhas finas com número, título grande, descrição curta (1-2 frases) e seta indicativa. Efeito hover com deslocamento e linha sutil; sem cards ou carrosséis fechados. |
| **Portfólio** | **MANTER (OCULTO)** | Componente preservado com flag `showWork = false`. Oculto na UI, navegação, sitemap e JSON-LD até termos cases reais confirmados (Regra E9). |
| **Depoimentos** | **MANTER (OCULTO)** | Componente preservado com flag `showTestimonials = false`. Oculto até haver avaliações reais. |
| **FAQ** | **ADAPTAR** | Radix Accordion mantido. 5 perguntas diretas e realistas sobre software sob medida, TI, segurança e IA. Separadores por linhas finas de 1px (branco 10%), sem caixas ou fundos cinzas. |
| **Contato** | **ADAPTAR** | Título grande à esquerda. Formulário RHF + Zod com campos de linha inferior (underline minimalista). Dados de contato em texto simples apenas se as variáveis de ambiente existirem. Sem badges de SLA/NDA. |
| **Footer** | **ADAPTAR** | Logo Zuse inline, colunas de links limpos em texto simples, direitos autorais "© 2026 Zuse Labs". Sem caixas ou selos falsos. |
| **Vera (Assistente Digital)** | **MANTER INTOCADA** | Regra V1: Nenhuma linha de código alterada em `components/vera/vera-chat.tsx` e `lib/vera/*`. Apenas integração passiva via z-index e atributo `data-preloader-done`. |

---

## 10. Screenshots de Referência Capturados

Os screenshots de baseline foram registrados em runtime na porta 3005 com Playwright:
- `/docs/ref-veridian/veridian-desktop-1440.png` (Viewport Desktop 1440x900)
- `/docs/ref-veridian/veridian-desktop-full-1440.png` (Full Page Desktop)
- `/docs/ref-veridian/veridian-mobile-375.png` (Viewport Mobile 375x812)
- `/docs/ref-veridian/veridian-mobile-full-375.png` (Full Page Mobile)
