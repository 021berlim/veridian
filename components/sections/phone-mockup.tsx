"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const SCREENS = ["software", "suporte", "seguranca", "ia"] as const
type Screen = (typeof SCREENS)[number]

const SCREEN_INSET = {
  top: "1.72%",
  left: "4.35%",
  right: "4.35%",
  bottom: "1.72%",
  radius: "10.2%",
}

interface PhoneMockupProps {
  className?: string
}

/* -------------------------------------------------------------------------- */
/* DADOS DAS 4 TELAS (QUALITATIVOS, SEM NÚMEROS DE DESEMPENHO)                 */
/* -------------------------------------------------------------------------- */
const SCREENS_CONFIG = {
  software: {
    tag: "01 · ENGENHARIA",
    title: "Software sob medida",
    subtitle: "Aplicações web e mobile feitas para o seu negócio.",
    topBlocks: [
      { label: "FRONT-END", val: "Interface" },
      { label: "BACK-END", val: "Regras" },
      { label: "APIS", val: "Integrações" },
    ],
    progress: [
      { label: "Interface", state: "Concluído", width: "100%", active: true },
      { label: "Back-end", state: "Em andamento", width: "65%", active: true },
      { label: "Testes", state: "Planejado", width: "18%", active: false },
    ],
    bottomBlocks: [
      { label: "ESCOPO", val: "Sob medida" },
      { label: "PADRÃO", val: "Corporativo" },
      { label: "CÓDIGO", val: "Seu" },
    ],
  },
  suporte: {
    tag: "02 · SUSTENTAÇÃO",
    title: "Suporte e TI",
    subtitle: "Sustentação contínua da sua infraestrutura.",
    topBlocks: [
      { label: "INFRA", val: "Monitorada" },
      { label: "CHAMADOS", val: "Priorizados" },
      { label: "ROTINA", val: "Preventiva" },
    ],
    progress: [
      { label: "Servidores", state: "Estável", width: "100%", active: true },
      { label: "Backups", state: "Verificados", width: "100%", active: true },
      { label: "Rede", state: "Em análise", width: "50%", active: true },
    ],
    bottomBlocks: [
      { label: "ATENDIMENTO", val: "Direto" },
      { label: "SUPERVISÃO", val: "Contínua" },
      { label: "AMBIENTE", val: "Resiliente" },
    ],
  },
  seguranca: {
    tag: "03 · SEGURANÇA",
    title: "Cibersegurança",
    subtitle: "Proteção de dados e acessos em camadas.",
    topBlocks: [
      { label: "ACESSOS", val: "Revisados" },
      { label: "DADOS", val: "Protegidos" },
      { label: "ROTINA", val: "Auditada" },
    ],
    progress: [
      { label: "Diagnóstico", state: "Concluído", width: "100%", active: true },
      { label: "Correções", state: "Em andamento", width: "70%", active: true },
      { label: "Auditoria", state: "Contínua", width: "100%", active: true },
    ],
    bottomBlocks: [
      { label: "POSTURA", val: "Preventiva" },
      { label: "RESPOSTA", val: "Rápida" },
      { label: "DADOS", val: "Sob controle" },
    ],
  },
  ia: {
    tag: "04 · AUTOMAÇÃO",
    title: "Automação e IA",
    subtitle: "Agentes e fluxos integrados à operação.",
    topBlocks: [
      { label: "AGENTES", val: "Sob medida" },
      { label: "DADOS", val: "Privados" },
      { label: "FLUXOS", val: "Autônomos" },
    ],
    progress: [
      { label: "Integração", state: "Concluído", width: "100%", active: true },
      { label: "Treinamento", state: "Em andamento", width: "60%", active: true },
      { label: "Revisão", state: "Planejado", width: "20%", active: false },
    ],
    bottomBlocks: [
      { label: "OPERAÇÃO", val: "Assistida" },
      { label: "PRIVACIDADE", val: "Garantida" },
      { label: "EVOLUÇÃO", val: "Contínua" },
    ],
  },
} as const

/* -------------------------------------------------------------------------- */
/* CONTEÚDOS VISUAIS CENTRAIS ESPECÍFICOS DE CADA TELA                         */
/* -------------------------------------------------------------------------- */

// Tela 01: Editor de código limpo com 9-10 linhas legíveis
function CodeEditorVisual() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.8cqw] border border-white/[0.08] bg-[#16161a] p-[2.5cqw]">
      {/* Barra de título do arquivo */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-[1.8cqw]">
        <div className="flex items-center gap-[1.5cqw]">
          <span className="h-[2cqw] w-[2cqw] rounded-full bg-[#c72c3b]" />
          <span className="font-mono text-[3.8cqw] font-medium text-white/90">engine.ts</span>
        </div>
        <span className="font-mono text-[3.4cqw] uppercase tracking-wider text-[#a1a1a6]">TypeScript</span>
      </div>

      {/* Linhas de código legíveis */}
      <div className="flex flex-1 flex-col justify-between pt-[2cqw] font-mono text-[4.0cqw] leading-[1.3] text-[#a1a1a6] select-none">
        <div><span className="text-[#c72c3b]">export async function</span> <span className="text-white">buildSystem</span>() &#123;</div>
        <div className="pl-[3cqw]"><span className="text-[#a1a1a6]/60">const</span> runtime = <span className="text-[#c72c3b]">await</span> initCore()</div>
        <div className="pl-[3cqw]"><span className="text-[#a1a1a6]/60">const</span> api = createEndpoints(runtime)</div>
        <div className="pl-[3cqw]"><span className="text-[#a1a1a6]/60">const</span> db = connectDatabase()</div>
        <div className="pl-[3cqw]">applySecurityLayers(api)</div>
        <div className="pl-[3cqw]"><span className="text-[#c72c3b]">await</span> verifyIntegrity(db)</div>
        <div className="pl-[3cqw]"><span className="text-[#c72c3b]">return</span> &#123;</div>
        <div className="pl-[6cqw]">status: <span className="text-white">&quot;ready&quot;</span>,</div>
        <div className="pl-[6cqw]">deploy: <span className="text-white">&quot;production&quot;</span></div>
        <div className="pl-[3cqw]">&#125;</div>
        <div>&#125;</div>
      </div>
    </div>
  )
}

// Tela 02: Lista de 5 chamados com estado e ícones
function TicketsListVisual() {
  const tickets = [
    { text: "Cluster principal sincronizado", status: "Resolvido", done: true },
    { text: "Atualização de segurança aplicada", status: "Resolvido", done: true },
    { text: "Rotina diária de backup validada", status: "Resolvido", done: true },
    { text: "Túnel VPN e rotas inspecionadas", status: "Resolvido", done: true },
    { text: "Auditoria preventiva de logs", status: "Em análise", done: false },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[2.8cqw] border border-white/[0.08] bg-[#16161a] p-[2.5cqw]">
      {tickets.map((t, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-[2cqw] border-b border-white/[0.04] py-[1.2cqw] last:border-b-0"
        >
          <div className="flex items-center gap-[2cqw] min-w-0">
            <span
              className={`flex h-[3.8cqw] w-[3.8cqw] shrink-0 items-center justify-center rounded-full text-[2.6cqw] font-bold ${
                t.done ? "bg-[#c72c3b] text-white" : "border border-[#c72c3b] text-[#c72c3b]"
              }`}
            >
              {t.done ? "✓" : "•"}
            </span>
            <span className="truncate text-[4.4cqw] font-normal text-white">{t.text}</span>
          </div>
          <span
            className={`shrink-0 text-[3.8cqw] font-medium ${
              t.done ? "text-[#a1a1a6]" : "text-[#c72c3b]"
            }`}
          >
            {t.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// Tela 03: Escudo de segurança grande com itens auditados
function SecurityVisual() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between rounded-[2.8cqw] border border-white/[0.08] bg-[#16161a] p-[2.5cqw]">
      {/* Escudo SVG grande */}
      <div className="flex items-center justify-center py-[1cqw]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[22cqw] w-[22cqw] text-white/90"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#0e0e10" />
          <path d="M9 12l2 2 4-4" stroke="#c72c3b" strokeWidth="2.2" />
        </svg>
      </div>

      {/* 4 Itens verificados */}
      <div className="grid w-full grid-cols-2 gap-[1.5cqw] pt-[1cqw] border-t border-white/[0.06]">
        <div className="flex items-center gap-[1.2cqw] text-[4.2cqw] text-white">
          <span className="text-[#c72c3b] font-bold">✓</span>
          <span className="truncate">Permissões OK</span>
        </div>
        <div className="flex items-center gap-[1.2cqw] text-[4.2cqw] text-white">
          <span className="text-[#c72c3b] font-bold">✓</span>
          <span className="truncate">Backups OK</span>
        </div>
        <div className="flex items-center gap-[1.2cqw] text-[4.2cqw] text-white">
          <span className="text-[#c72c3b] font-bold">✓</span>
          <span className="truncate">Atualizações OK</span>
        </div>
        <div className="flex items-center gap-[1.2cqw] text-[4.2cqw] text-white">
          <span className="text-[#c72c3b] font-bold">✓</span>
          <span className="truncate">Políticas OK</span>
        </div>
      </div>
    </div>
  )
}

// Tela 04: Chat de assistência e agentes autônomos
function ChatVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[2.8cqw] border border-white/[0.08] bg-[#16161a] p-[2.5cqw]">
      <div className="flex flex-col gap-[2cqw]">
        {/* Pergunta do usuário (direita) */}
        <div className="self-end max-w-[85%] rounded-[2.4cqw] bg-[#22242a] px-[3cqw] py-[1.8cqw] text-[4.2cqw] text-white">
          Resuma os chamados abertos desta semana.
        </div>

        {/* Resposta do agente (esquerda) */}
        <div className="self-start max-w-[92%] rounded-[2.4cqw] border border-[#c72c3b]/30 bg-[#0e0e10] px-[3cqw] py-[2cqw] text-[4.2cqw] leading-relaxed text-white">
          Todos os sistemas operam com estabilidade. Rotinas preventivas concluídas e sem incidentes pendentes.
        </div>
      </div>

      {/* Barra de entrada simulada */}
      <div className="flex items-center justify-between rounded-full border border-white/[0.1] bg-[#0e0e10] px-[3cqw] py-[1.5cqw]">
        <span className="text-[3.9cqw] text-[#a1a1a6]">Instrução para a IA...</span>
        <span className="flex h-[4.5cqw] w-[4.5cqw] items-center justify-center rounded-full bg-[#c72c3b] text-[3cqw] text-white">
          ↑
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CASCA DA TELA (LAYOUT VERTICAL 100% PREENCHIDO)                            */
/* -------------------------------------------------------------------------- */
function ScreenView({ screen }: { screen: Screen }) {
  const cfg = SCREENS_CONFIG[screen]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden px-[5cqw] pt-[12cqw] pb-[4cqw] text-[#ffffff] select-none">
      {/* 1. TOPO: Etapa, Título, Subtítulo e 3 Mini Blocos */}
      <div className="flex shrink-0 flex-col gap-[2cqw]">
        <div>
          <span className="font-mono text-[3.7cqw] font-semibold uppercase tracking-[0.14em] text-[#a1a1a6]">
            {cfg.tag}
          </span>
          <h4 className="mt-[0.6cqw] font-sans text-[8.2cqw] font-semibold leading-tight tracking-tight text-white">
            {cfg.title}
          </h4>
          <p className="mt-[0.8cqw] font-sans text-[4.3cqw] leading-snug text-[#a1a1a6]">
            {cfg.subtitle}
          </p>
        </div>

        {/* 3 Mini Blocos */}
        <div className="grid grid-cols-3 gap-[2cqw]">
          {cfg.topBlocks.map((b, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-[2.5cqw] border border-white/[0.08] bg-[#16161a] p-[2.2cqw]"
            >
              <span className="font-mono text-[3.6cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
                {b.label}
              </span>
              <span className="mt-[0.8cqw] truncate font-sans text-[4.4cqw] font-medium text-white">
                {b.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MEIO: Visual principal ocupando TODO o espaço restante */}
      <div className="my-[2.5cqw] flex flex-1 min-h-0 flex-col">
        {screen === "software" && <CodeEditorVisual />}
        {screen === "suporte" && <TicketsListVisual />}
        {screen === "seguranca" && <SecurityVisual />}
        {screen === "ia" && <ChatVisual />}
      </div>

      {/* 3. LINHAS DE PROGRESSO: 3 linhas (rótulo, barra de 1.2cqw, estado) */}
      <div className="flex shrink-0 flex-col gap-[1.5cqw]">
        {cfg.progress.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-[2.5cqw] rounded-[2cqw] border border-white/[0.05] bg-[#16161a]/80 px-[2.8cqw] py-[1.4cqw]"
          >
            <span className="font-sans text-[4.2cqw] text-[#a1a1a6]">{p.label}</span>
            <div className="flex flex-1 items-center gap-[2cqw]">
              <div className="h-[1.2cqw] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[#c72c3b] transition-all duration-500"
                  style={{ width: p.width }}
                />
              </div>
            </div>
            <span
              className={`shrink-0 font-sans text-[4.0cqw] font-medium ${
                p.active ? "text-white" : "text-[#a1a1a6]"
              }`}
            >
              {p.state}
            </span>
          </div>
        ))}
      </div>

      {/* 4. BASE: 3 Blocos-resumo acima do indicador de home */}
      <div className="mt-[2.5cqw] grid shrink-0 grid-cols-3 gap-[2cqw]">
        {cfg.bottomBlocks.map((b, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-[2.5cqw] border border-white/[0.08] bg-[#16161a] p-[2.2cqw]"
          >
            <span className="font-mono text-[3.6cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
              {b.label}
            </span>
            <span className="mt-[0.8cqw] truncate font-sans text-[4.4cqw] font-medium text-white">
              {b.val}
            </span>
          </div>
        ))}
      </div>

      {/* 5. INDICADOR DE HOME */}
      <div className="shrink-0 pt-[2cqw]">
        <div className="mx-auto h-[1.1cqw] w-[34cqw] rounded-full bg-white/20" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL DO MOCKUP (MOLDURA ORIGINAL PRESERVADA)               */
/* -------------------------------------------------------------------------- */
export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  const [activeScreen, setActiveScreen] = useState<Screen>("software")

  useEffect(() => {
    // Ciclo de 6s por tela (≥ 5.5s conforme especificado)
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        const idx = SCREENS.indexOf(prev)
        return SCREENS[(idx + 1) % SCREENS.length]
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-hidden="true"
    >
      <div className="relative w-full">
        {/* Moldura original do iPhone (inalterada) */}
        <img
          src="/images/iphone-frame.png"
          alt=""
          aria-hidden="true"
          className="relative z-10 block h-auto w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
          draggable={false}
        />

        {/* Tela interna com inset exato e container query para escala em cqw */}
        <div
          id="phone-screen-container"
          className="absolute z-20 overflow-hidden"
          style={{
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            right: SCREEN_INSET.right,
            bottom: SCREEN_INSET.bottom,
            borderRadius: SCREEN_INSET.radius,
            backgroundColor: "#0e0e10",
            border: "1px solid #2b2d31",
            containerType: "inline-size",
          }}
        >
          {/* Dynamic Island original */}
          <div
            className="pointer-events-none absolute top-[2.4%] left-1/2 z-30 h-[2.8%] min-h-[10px] max-h-[15px] w-[27%] -translate-x-1/2 rounded-full"
            style={{
              backgroundColor: "#000000",
              border: "1px solid #1a1a1e",
            }}
          />

          {/* Conteúdo da Tela com AnimatePresence e transição de translateY 12px */}
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="h-full w-full"
              >
                <ScreenView screen={activeScreen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
