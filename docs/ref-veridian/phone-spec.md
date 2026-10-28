# ESPECIFICAÇÃO NUMÉRICA DO CELULAR (VERIDIAN ORIGINAL)

Documento extraído de `components/sections/hero.tsx` e `components/sections/phone-mockup.tsx` do Veridian original (`baseline-veridian` / commit `efec8d9`).

---

## 1. Dimensões, Escala e Proporção da Moldura

- **Imagem da Moldura:** `/images/iphone-frame.png`
- **Sombra da Moldura:** `drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]` (Zuse: drop-shadow escuro elegante sem glow)
- **Largura do Container por Viewport:**
  - Mobile (< 768px): `w-[234px]`
  - Tablet (768px – 1024px): `md:w-[281px]` (escala 1.2x)
  - Desktop (≥ 1024px): `lg:w-[351px]` (escala 1.5x)
- **Inset da Tela no Frame:**
  - `top: 1.72%`
  - `left: 4.35%`
  - `right: 4.35%`
  - `bottom: 1.72%`
  - `borderRadius: 10.2%`
- **Dynamic Island:**
  - `top: 2.4%`
  - `left: 50%` (`-translate-x-1/2`)
  - `width: 27%`
  - `height: 2.8%` (`min-h-[10px] max-h-[15px]`)
  - `rounded-full`
  - Cor: `#000000`

---

## 2. Posição e Transforms em Função do Scroll no Hero

O Veridian original possui uma camada hero de 100vh com scroll range de 400px:
- **Range de Scroll:** `maxScroll = 400px`
- **Progresso:** `targetProgress = Math.min(scrollY / 400, 1)`
- **Fórmula de Interpolação:**
  - `currentProgress += (targetProgress - currentProgress) * 0.1` (lerp suave)
  - `easeOutQuad = (t) => t * (2 - t)`
  - `easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)`
- **Efeitos de Colapso do Fundo:**
  - `scale = 1 - easeOutQuad(scrollProgress) * 0.15` (1.00 → 0.85)
  - `borderRadius = easeOutCubic(scrollProgress) * 48` (0px → 48px)
  - `heightVh = 100 - easeOutQuad(scrollProgress) * 37.5` (100vh → 62.5vh)
- **Marca d'Água Atrás do Celular:**
  - Texto: "VERIDIAN" (para Zuse: "ZUSE LABS")
  - Escala: `text-[26vw] sm:text-[22vw] md:text-[20vw] lg:text-[18vw]`
  - Posição: `h-[38vh]` no rodapé do hero, `translateY: scrollProgress * 150px`
  - Opacidade: `(1 - scrollProgress * 0.8) * 0.05` (5% base fadeando para ~1%)
- **Entrada do Celular:**
  - Inicial: `translate-y-[400px] opacity-0`
  - Ativo: `translate-y-0 opacity-100` com `duration-[1500ms] ease-out delay-500`

---

## 3. Ciclo de Telas e Transições

- **Intervalo:**
  - Desktop: `4000ms`
  - Mobile (`useIsMobile()`): `5000ms`
- **Transição de Tela:**
  - `AnimatePresence mode="wait"`
  - `initial={{ opacity: 0 }}`
  - `animate={{ opacity: 1 }}`
  - `exit={{ opacity: 0 }}`
  - `transition={{ duration: 0.4, ease: "easeInOut" }}`

---

## 4. Estrutura Interna de Cada Tela (3 Zonas de Preenchimento)

A tela possui preenchimento total (`h-full w-full`) com `text-[clamp(6.5px,1.95vw,9px)]`:

### Zona 1: Topo (`shrink-0 space-y-[0.42em]`)
- **AppHeader:**
  - Marca: `text-[0.42em] font-semibold uppercase tracking-[0.16em]`
  - Título + Indicadores (dots): `truncate text-[0.72em] font-semibold uppercase` + 4 dots (ativo: width maior ou opacidade 1)
  - Subtítulo: `line-clamp-2 text-[0.4em] leading-snug`
- **3 Mini Cards:**
  - `grid grid-cols-3 gap-[0.18em]`
  - Cada card: `rounded-[0.34em] p-[0.3em]`, com `tag`, `title` e `value`

### Zona 2: Meio (`flex min-h-0 flex-1 flex-col justify-center gap-[0.28em] py-[0.2em]`)
- **Visual Principal (Gráfico / Editor / Inspeção):**
  - Gráfico de atividade com 12 barras verticais proporcionais (`h-[3.8em]`) ou bloco técnico equivalente
- **3 Linhas de Progresso / Jornada:**
  - `label` + barra de progresso horizontal (`pct`) + tag de status

### Zona 3: Base (`grid shrink-0 grid-cols-3 gap-[0.18em]`)
- **3 Blocos-Resumo:**
  - Cada bloco: `label`, `value`, `sub`
  - Totalmente preenchido sem espaço em branco residual (>90% de ocupação vertical útil).
