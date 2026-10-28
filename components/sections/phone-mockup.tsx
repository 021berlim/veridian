"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useIsMobile } from "@/components/ui/use-mobile"

const SCREENS = ["software", "suporte", "seguranca", "ia"] as const
type Screen = (typeof SCREENS)[number]

type MetricCardData = { tag: string; title: string; value: string }
type JourneyData = { label: string; pct: string; width: string; status: string }
type StatCardData = { label: string; value: string; sub: string }

const SCREEN_DATA: Record<
  Screen,
  {
    title: string
    subtitle: string
    metrics: MetricCardData[]
    chartBars: number[]
    journeys: JourneyData[]
    stats: StatCardData[]
  }
> = {
  software: {
    title: "Engenharia de Software",
    subtitle: "Aplicações escaláveis com arquitetura limpa e testes contínuos.",
    metrics: [
      { tag: "STACK", title: "Arquitetura", value: "Distribuída" },
      { tag: "DEPLOY", title: "Ambiente", value: "Produção" },
      { tag: "TESTES", title: "Qualidade", value: "Aprovado" },
    ],
    chartBars: [42, 58, 48, 72, 64, 88, 76, 94, 68, 96, 82, 90],
    journeys: [
      { label: "CI/CD Pipeline", pct: "95%", width: "95%", status: "Ativo" },
      { label: "Otimização de Render", pct: "98%", width: "98%", status: "Estável" },
      { label: "Integridade de Build", pct: "100%", width: "100%", status: "Conforme" },
    ],
    stats: [
      { label: "Runtime", value: "Next / React", sub: "Isolado" },
      { label: "Métricas", value: "Tempo Real", sub: "Ativo" },
      { label: "Entrega", value: "Contínua", sub: "Sem atrito" },
    ],
  },
  suporte: {
    title: "Sustentação de TI",
    subtitle: "Monitoramento contínuo de infraestrutura e resposta especializada.",
    metrics: [
      { tag: "STATUS", title: "Infraestrutura", value: "Operacional" },
      { tag: "FLUXO", title: "Chamados", value: "Prioritário" },
      { tag: "ROTINA", title: "Sustentação", value: "Preventiva" },
    ],
    chartBars: [50, 45, 65, 60, 75, 70, 85, 80, 78, 88, 82, 92],
    journeys: [
      { label: "Monitoramento de Servidores", pct: "99%", width: "99%", status: "Ativo" },
      { label: "Rotina de Backups", pct: "100%", width: "100%", status: "Auditado" },
      { label: "Latência de Banco de Dados", pct: "96%", width: "96%", status: "Otimizado" },
    ],
    stats: [
      { label: "Sistemas", value: "Monitorados", sub: "Tempo real" },
      { label: "Atendimento", value: "Direto", sub: "Engenharia" },
      { label: "Ambiente", value: "Resiliente", sub: "Estável" },
    ],
  },
  seguranca: {
    title: "Cibersegurança",
    subtitle: "Blindagem de perímetro, conformidade e defesa em camadas.",
    metrics: [
      { tag: "DEFESA", title: "Perímetro", value: "Blindado" },
      { tag: "DADOS", title: "Criptografia", value: "Em repouso" },
      { tag: "CONTROLE", title: "Políticas", value: "Aplicadas" },
    ],
    chartBars: [60, 70, 65, 80, 75, 90, 85, 95, 88, 92, 86, 94],
    journeys: [
      { label: "Políticas de Acesso Mínimo", pct: "100%", width: "100%", status: "Aplicado" },
      { label: "Inspeção de Dependências", pct: "97%", width: "97%", status: "Conforme" },
      { label: "Proteção de Endpoints", pct: "98%", width: "98%", status: "Seguro" },
    ],
    stats: [
      { label: "Perímetro", value: "WAF Ativo", sub: "Filtragem" },
      { label: "Auditoria", value: "Rigorosa", sub: "Conforme" },
      { label: "Acessos", value: "Segregados", sub: "Protegidos" },
    ],
  },
  ia: {
    title: "Inteligência Artificial",
    subtitle: "Agentes autônomos integrados aos fluxos operacionais e de dados.",
    metrics: [
      { tag: "AGENTES", title: "Operação", value: "Autônoma" },
      { tag: "PIPELINE", title: "Sincronia", value: "Ativa" },
      { tag: "PRECISÃO", title: "Validação", value: "Auditada" },
    ],
    chartBars: [35, 55, 68, 62, 80, 74, 90, 82, 94, 88, 92, 96],
    journeys: [
      { label: "Agentes de Triagem", pct: "96%", width: "96%", status: "Online" },
      { label: "Extração de Dados", pct: "94%", width: "94%", status: "Concluído" },
      { label: "Validação Semântica", pct: "99%", width: "99%", status: "Aprovado" },
    ],
    stats: [
      { label: "Assistente", value: "Vera Ativa", sub: "Atendimento" },
      { label: "Fluxos", value: "Automatizados", sub: "Eficiência" },
      { label: "Governança", value: "Estruturada", sub: "Controle" },
    ],
  },
}

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

function AppHeader({
  screen,
  title,
  subtitle,
}: {
  screen: Screen
  title: string
  subtitle: string
}) {
  return (
    <header className="shrink-0 space-y-[0.14em]">
      <p className="text-[0.44em] font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">
        Zuse Labs
      </p>
      <div className="flex items-center justify-between gap-[0.3em]">
        <p className="truncate text-[0.74em] font-semibold uppercase leading-none tracking-wide text-white">
          {title}
        </p>
        <div className="flex shrink-0 gap-[0.16em]">
          {SCREENS.map((s) => (
            <span
              key={s}
              className={`h-[0.3em] rounded-full transition-all duration-300 ${
                s === screen ? "w-[0.9em] bg-[#c72c3b]" : "w-[0.3em] bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="line-clamp-2 text-[0.42em] leading-snug text-[#8a8f98]">
        {subtitle}
      </p>
    </header>
  )
}

function ActivityChart({ bars }: { bars: number[] }) {
  return (
    <div className="flex h-[3.8em] items-end gap-[0.14em] rounded-[0.34em] border border-white/[0.08] bg-[#141518] px-[0.36em] py-[0.3em]">
      {bars.map((height, index) => (
        <div
          key={index}
          className="flex-1 rounded-[0.1em] transition-all duration-500"
          style={{
            height: `${height}%`,
            backgroundColor: index === 9 || index === 11 ? "#c72c3b" : "rgba(255, 255, 255, 0.16)",
          }}
        />
      ))}
    </div>
  )
}

function JourneyRow({
  label,
  pct,
  width,
  status,
  delay = 0,
}: JourneyData & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center justify-between gap-[0.3em] rounded-[0.24em] border border-white/[0.04] bg-[#141518]/70 px-[0.32em] py-[0.22em]"
    >
      <span className="truncate text-[0.42em] text-[#8a8f98]">{label}</span>
      <div className="flex items-center gap-[0.3em]">
        <div className="h-[0.22em] w-[4.5em] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-[#c72c3b] transition-all duration-500"
            style={{ width }}
          />
        </div>
        <span className="font-mono text-[0.38em] text-white/90">{pct}</span>
      </div>
    </motion.div>
  )
}

function MetricCard({
  tag,
  title,
  value,
  delay = 0,
}: MetricCardData & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col justify-between rounded-[0.34em] border border-white/[0.08] bg-[#141518] p-[0.3em]"
    >
      <span className="text-[0.36em] font-semibold uppercase tracking-wider text-[#c72c3b]">
        {tag}
      </span>
      <span className="mt-[0.15em] truncate text-[0.44em] text-[#8a8f98]">{title}</span>
      <span className="mt-[0.1em] truncate text-[0.52em] font-medium text-white">{value}</span>
    </motion.div>
  )
}

function StatCard({
  label,
  value,
  sub,
  delay = 0,
}: StatCardData & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col justify-between rounded-[0.34em] border border-white/[0.08] bg-[#141518] p-[0.3em]"
    >
      <span className="text-[0.36em] font-semibold uppercase tracking-wider text-[#8a8f98]">
        {label}
      </span>
      <span className="mt-[0.12em] truncate text-[0.54em] font-medium text-white">{value}</span>
      <span className="mt-[0.08em] truncate text-[0.36em] text-white/40">{sub}</span>
    </motion.div>
  )
}

function AppShell({ screen }: { screen: Screen }) {
  const data = SCREEN_DATA[screen]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden px-[0.62em] pt-[3.4em] pb-[0.62em] text-[clamp(6.5px,1.95vw,9px)] select-none">
      {/* Zona 1: Topo (AppHeader + 3 Mini Cards) */}
      <div className="shrink-0 space-y-[0.42em]">
        <AppHeader screen={screen} title={data.title} subtitle={data.subtitle} />

        <div className="grid grid-cols-3 gap-[0.18em]">
          {data.metrics.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={i * 0.04} />
          ))}
        </div>
      </div>

      {/* Zona 2: Meio (Visual Principal + 3 Linhas de Progresso) */}
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[0.28em] py-[0.2em]">
        <ActivityChart bars={data.chartBars} />
        <div className="flex flex-col gap-[0.16em]">
          {data.journeys.map((j, i) => (
            <JourneyRow key={j.label} {...j} delay={0.1 + i * 0.04} />
          ))}
        </div>
      </div>

      {/* Zona 3: Base (3 Blocos-Resumo) */}
      <div className="grid shrink-0 grid-cols-3 gap-[0.18em]">
        {data.stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.24 + i * 0.04} />
        ))}
      </div>
    </div>
  )
}

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  const isMobile = useIsMobile()
  const [activeScreen, setActiveScreen] = useState<Screen>("software")

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        const idx = SCREENS.indexOf(prev)
        return SCREENS[(idx + 1) % SCREENS.length]
      })
    }, isMobile ? 5000 : 4000)
    return () => clearInterval(interval)
  }, [isMobile])

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="Interface mobile demonstrando sistemas, sustentação e inteligência Zuse Labs"
    >
      <div className="relative w-full">
        {/* Moldura original do iPhone */}
        <img
          src="/images/iphone-frame.png"
          alt=""
          aria-hidden
          className="relative z-10 block h-auto w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
          draggable={false}
        />

        {/* Tela interna com inset exato */}
        <div
          className="absolute z-20 overflow-hidden"
          style={{
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            right: SCREEN_INSET.right,
            bottom: SCREEN_INSET.bottom,
            borderRadius: SCREEN_INSET.radius,
            backgroundColor: "#0b0b0d",
            border: "1px solid #2b2d31",
          }}
        >
          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute top-[2.4%] left-1/2 z-30 h-[2.8%] min-h-[10px] max-h-[15px] w-[27%] -translate-x-1/2 rounded-full"
            style={{
              backgroundColor: "#000000",
              border: "1px solid #1a1a1e",
            }}
          />

          {/* Conteúdo da Tela com AnimatePresence */}
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full w-full"
              >
                <AppShell screen={activeScreen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
