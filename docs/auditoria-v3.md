# AUDITORIA E PLANO DE TRANSIÇÃO — AJUSTE v3 (ZUSE LABS)

**Data:** 27 de Outubro de 2026  
**Status:** Fase 0 Concluída (Modo Somente Leitura)  
**Branch de Trabalho:** `zuse-v3`  
**Git Baseline v2:** `zuse-v2`  
**Referência Veridian:** `baseline-veridian` / worktree `../veridian-ref`

---

## 1. Diagnóstico do Estado Atual vs Veridian Original

| Aspecto | Estado na v2 | Veridian Original | Resolução para v3 |
| :--- | :--- | :--- | :--- |
| **(1) Cantos Arredondados (V6)** | `--radius: 0rem` global; botões retangulares, inputs só underline, header reto. | `--radius: 0.75rem`; botões em pílula (`rounded-full`), inputs com borda e raio, header `rounded-2xl`. | **Restaurar:** Regra V6 revoga a proibição. Aplicar tokens e classes do Veridian em botões, campos de formulário, FAQ e header. |
| **(2) Header / Navbar** | Barra plana de largura total fixa, reta, sem dropdowns clássicos nem animação do CTA original. | Container flutuante `rounded-2xl` com margem superior (`px-4 pt-4`), dropdowns em hover, botão pílula "Iniciar projeto →" com seta animada. | **Restaurar 1:1:** Fundo `#141416`, borda 1px branco 8% (`rgba(255,255,255,0.08)`), sem blur. Criar slot `#zuse-header-logo-slot` e expor `--header-h`. |
| **(3) Sequência de Abertura / Intro** | Atrelada ao scroll (pin de 300vh), Z pequeno (~64px), logo da navbar visível durante a descida. | Sem intro de logo no Veridian original; hero direto. | **Nova Intro Automática (2.5s):** `intro.tsx` com overlay fixo `#0b0b0d`, scroll travado; Z grande (`clamp(140px, 22vh, 240px)`), revelação do logotipo por máscara, e FLIP até o slot do header `#zuse-header-logo-slot`. |
| **(4) Hero e Offset** | Pin forçado de 300vh, `pt-28` fixo (risco de sobreposição sob o header flutuante), sem colapso fluido. | Hero sem pin, com colapso no scroll de 400px (escala do fundo, raio de 48px, marca d'água "VERIDIAN" a 5% de opacidade). | **Adaptar Hero:** Sem pin; `padding-top: calc(var(--header-h) + clamp(32px, 6vh, 72px))`; marca d'água "ZUSE LABS"; colapso idêntico de fundo; elementos com `data-intro-reveal`. |
| **(5) Celular / Phone Mockup** | 4 telas simples sem a densidade do original, área vazia inferior > 25%. | 3 zonas densas: Topo (AppHeader + 3 mini-cards), Meio (ActivityChart 12 barras + 3 journeys), Base (3 stat-cards). | **Preenchimento Integral:** 4 telas Zuse (Software, Suporte, Segurança, IA) em 3 zonas editoriais ocupando ≥ 90% da altura da tela, conforme `/docs/ref-veridian/phone-spec.md`. |

---

## 2. Contrato entre Agentes e Mapeamento de Donos

- `#zuse-header-logo-slot`: Criado no `navbar.tsx` por **A2**.
- `--header-h`: Medido por ResizeObserver no `navbar.tsx` e gravado em `:root` por **A2**.
- `data-intro-reveal`: Atributo nos elementos do hero por **A4**.
- `document.documentElement.dataset.introState = "playing" | "done"`: Controlado por **A3** em `intro.tsx`.
- `data-preloader-done="true"`: Disparado ao fim da intro para liberação da Vera por **A3**.
- Constantes em `lib/motion.ts`: `INTRO = { form: 2.5, travel: 0.8, reveal: 0.9 }` por **A3**.

### Divisão de Donos por Arquivo
- **A1 (Forma e Raios):** `app/globals.css`, `components/sections/contact-section.tsx`, `components/sections/faq-section.tsx`.
- **A2 (Header):** `components/layout/navbar.tsx`, `components/layout/mobile-menu.tsx`.
- **A3 (Intro Automática):** `components/ui/intro.tsx`, `components/layout/smooth-scroll.tsx`, `lib/motion.ts`, remoção de `preloader.tsx`.
- **A4 (Hero e Celular):** `components/sections/hero.tsx`, `components/sections/phone-mockup.tsx`.
- **A5/A6 (QA & Revisão):** `scripts/qa-v3-runtime.mjs`, validação dos gates G1 a G6.
