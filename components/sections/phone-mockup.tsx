"use client"

import { useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useIsMobile } from "@/components/ui/use-mobile"

const SCREENS = ["marketing", "design", "software", "integrado"] as const
type Screen = (typeof SCREENS)[number]

const SCREEN_META: Record<
  Screen,
  { title: string; subtitle: string }
> = {
  marketing: {
    title: "Marketing Digital",
    subtitle: "Estratégia para marcas que exigem autoridade e resultado.",
  },
  design: {
    title: "Design & UX",
    subtitle: "Identidade visual e interfaces para presença digital premium.",
  },
  software: {
    title: "Software",
    subtitle: "Tecnologia escalável para operar, integrar e crescer.",
  },
  integrado: {
    title: "Visão 360°",
    subtitle: "Operação digital integrada com padrão de excelência.",
  },
}

const BRAND = {
  bg: "#141a16",
  surface: "#1c2420",
  text: "#f0ede8",
  muted: "rgba(240, 237, 232, 0.48)",
  accent: "#4A584E",
  border: "rgba(74, 88, 78, 0.4)",
  borderSoft: "rgba(74, 88, 78, 0.2)",
  island: "#0a0d0b",
}

const CARD = {
  backgroundColor: BRAND.surface,
  border: `1px solid ${BRAND.border}`,
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

type MetricCardData = { tag: string; title: string; value: string }
type JourneyData = { label: string; pct: string; width: string }
type StatCardData = { label: string; value: string; sub: string }

const ACTIVITY_BARS = [38, 52, 44, 68, 58, 82, 72, 88, 64, 92, 76, 86]

function ActivityChart() {
  return (
    <div
      className="flex h-[3.8em] items-end gap-[0.1em] rounded-[0.34em] px-[0.36em] py-[0.3em]"
      style={CARD}
    >
      {ACTIVITY_BARS.map((height, index) => (
        <div
          key={index}
          className="flex-1 rounded-[0.1em]"
          style={{
            height: `${height}%`,
            backgroundColor: "rgba(74, 88, 78, 0.28)",
          }}
        />
      ))}
    </div>
  )
}

function AppShell({
  screen,
  metrics,
  journeys,
  stats,
}: {
  screen: Screen
  metrics: MetricCardData[]
  journeys: JourneyData[]
  stats: StatCardData[]
}) {
  const meta = SCREEN_META[screen]

  return (
    <div className="flex h-full w-full flex-col overflow-hidden px-[0.62em] pt-[3.4em] pb-[0.62em] text-[clamp(6.5px,1.95vw,9px)]">
      <div className="shrink-0 space-y-[0.42em]">
        <AppHeader screen={screen} title={meta.title} subtitle={meta.subtitle} />

        <div className="grid grid-cols-3 gap-[0.18em]">
          {metrics.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={i * 0.04} />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[0.28em] py-[0.2em]">
        <ActivityChart />
        <div className="flex flex-col gap-[0.16em]">
          {journeys.map((j, i) => (
            <JourneyRow key={j.label} {...j} delay={0.12 + i * 0.05} />
          ))}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-[0.18em]">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.28 + i * 0.04} />
        ))}
      </div>
    </div>
  )
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
    <header className="shrink-0">
      <p
        className="text-[0.42em] font-semibold uppercase tracking-[0.16em]"
        style={{ color: BRAND.muted }}
      >
        Veridian Capital
      </p>
      <div className="mt-[0.12em] flex items-center justify-between gap-[0.3em]">
        <p
          className="truncate text-[0.72em] font-semibold uppercase leading-none tracking-wide"
          style={{ color: BRAND.text }}
        >
          {title}
        </p>
        <div className="flex shrink-0 gap-[0.14em]">
          {SCREENS.map((s) => (
            <span
              key={s}
              className="size-[0.28em] rounded-full"
              style={{
                backgroundColor: BRAND.accent,
                opacity: s === screen ? 0.95 : 0.2,
              }}
            />
          ))}
        </div>
      </div>
      <p
        className="mt-[0.18em] line-clamp-2 text-[0.4em] leading-snug"
        style={{ color: BRAND.muted }}
      >
        {subtitle}
      </p>
    </header>
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
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex min-h-[2.65em] flex-col justify-between rounded-[0.34em] p-[0.3em]"
      style={CARD}
    >
      <p
        className="text-[0.38em] font-medium uppercase tracking-[0.1em]"
        style={{ color: BRAND.muted }}
      >
        {tag}
      </p>
      <p className="text-[0.5em] font-medium leading-tight" style={{ color: BRAND.text }}>
        {title}
      </p>
      <p className="text-[0.36em] leading-tight" style={{ color: BRAND.muted }}>
        {value}
      </p>
    </motion.div>
  )
}

function JourneyRow({
  label,
  pct,
  width,
  delay = 0,
}: JourneyData & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-[0.28em] rounded-[0.34em] px-[0.32em] py-[0.26em]"
      style={CARD}
    >
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-[0.36em] font-medium uppercase tracking-[0.08em]"
          style={{ color: BRAND.muted }}
        >
          {label}
        </p>
        <div
          className="mt-[0.2em] h-[0.22em] overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(74, 88, 78, 0.18)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ delay: delay + 0.15, duration: 0.6 }}
            className="h-full rounded-full"
            style={{ backgroundColor: BRAND.accent, opacity: 0.65 }}
          />
        </div>
      </div>
      <p
        className="shrink-0 text-[0.48em] font-semibold tabular-nums"
        style={{ color: BRAND.text }}
      >
        {pct}
      </p>
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
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex min-h-[2.55em] flex-col justify-between rounded-[0.34em] p-[0.3em]"
      style={CARD}
    >
      <p
        className="text-[0.36em] font-medium uppercase tracking-[0.08em]"
        style={{ color: BRAND.muted }}
      >
        {label}
      </p>
      <p className="text-[0.5em] font-semibold leading-none" style={{ color: BRAND.text }}>
        {value}
      </p>
      <p className="text-[0.34em] leading-tight" style={{ color: BRAND.muted }}>
        {sub}
      </p>
    </motion.div>
  )
}

function MarketingScreen({ reduced }: { reduced: boolean }) {
  return (
    <AppShell
      screen="marketing"
      metrics={[
        { tag: "Marca", title: "Posicionamento", value: "Autoridade" },
        { tag: "Funil", title: "Conversão", value: "Leads qualif." },
        { tag: "Dados", title: "Performance", value: "ROI mensurável" },
      ]}
      journeys={[
        { label: "Jornada · Descoberta", pct: "100%", width: "100%" },
        { label: "Jornada · Consideração", pct: "68%", width: "72%" },
        { label: "Jornada · Conversão", pct: "30%", width: "48%" },
      ]}
      stats={[
        { label: "Campanhas", value: "Always-on", sub: "Mídia + conteúdo" },
        { label: "Crescimento", value: reduced ? "+84%" : "+127%", sub: "vs. trim. ant." },
        { label: "Mensuração", value: "Contínua", sub: "KPIs + ROI" },
      ]}
    />
  )
}

function DesignScreen() {
  return (
    <AppShell
      screen="design"
      metrics={[
        { tag: "Marca", title: "Identidade", value: "Sistema visual" },
        { tag: "UI", title: "Interfaces", value: "Experiência" },
        { tag: "UX", title: "Jornadas", value: "Clareza" },
      ]}
      journeys={[
        { label: "Entrega · Tipografia", pct: "100%", width: "100%" },
        { label: "Entrega · Componentes", pct: "76%", width: "80%" },
        { label: "Entrega · Wireframes", pct: "52%", width: "58%" },
      ]}
      stats={[
        { label: "Páginas", value: "4 telas", sub: "Home · Produto" },
        { label: "Padrão", value: "Premium", sub: "Alto valor" },
        { label: "Coerência", value: "Unificada", sub: "Marca + produto" },
      ]}
    />
  )
}

function SoftwareScreen() {
  return (
    <AppShell
      screen="software"
      metrics={[
        { tag: "01", title: "Plataformas", value: "Web + SaaS" },
        { tag: "02", title: "Automações", value: "Workflows" },
        { tag: "03", title: "Integrações", value: "APIs" },
      ]}
      journeys={[
        { label: "Stack · Frontend", pct: "100%", width: "100%" },
        { label: "Stack · API", pct: "82%", width: "86%" },
        { label: "Stack · Cloud", pct: "64%", width: "70%" },
      ]}
      stats={[
        { label: "Deploy", value: "Contínuo", sub: "CI/CD + escala" },
        { label: "Produto", value: "Modular", sub: "API-first" },
        { label: "Uptime", value: "99.9%", sub: "Alta disponib." },
      ]}
    />
  )
}

function IntegradoScreen() {
  return (
    <AppShell
      screen="integrado"
      metrics={[
        { tag: "01", title: "Marketing", value: "Posicionamento" },
        { tag: "02", title: "Software", value: "Plataformas" },
        { tag: "03", title: "Design", value: "Experiência" },
      ]}
      journeys={[
        { label: "Processo · Estratégia", pct: "100%", width: "100%" },
        { label: "Processo · Execução", pct: "74%", width: "78%" },
        { label: "Processo · Mensuração", pct: "58%", width: "62%" },
      ]}
      stats={[
        { label: "Abordagem", value: "360°", sub: "Serviços integrados" },
        { label: "Consultoria", value: "Ativa", sub: "Direcionamento" },
        { label: "Entrega", value: "Premium", sub: "Alto padrão" },
      ]}
    />
  )
}

function PhoneScreen({ screen, reduced }: { screen: Screen; reduced: boolean }) {
  const screens: Record<Screen, ReactNode> = {
    marketing: <MarketingScreen reduced={reduced} />,
    design: <DesignScreen />,
    software: <SoftwareScreen />,
    integrado: <IntegradoScreen />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-full w-full"
      >
        {screens[screen]}
      </motion.div>
    </AnimatePresence>
  )
}

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  const isMobile = useIsMobile()
  const [activeScreen, setActiveScreen] = useState<Screen>("marketing")
  const reduced = isMobile

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        const idx = SCREENS.indexOf(prev)
        return SCREENS[(idx + 1) % SCREENS.length]
      })
    }, reduced ? 5000 : 4000)
    return () => clearInterval(interval)
  }, [reduced])

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="App Veridian Capital — marketing, design, software e visão integrada"
    >
      <div className="relative w-full">
        <img
          src="/images/iphone-frame.png"
          alt=""
          aria-hidden
          className="relative z-10 block h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
          draggable={false}
        />

        <div
          className="absolute z-20 overflow-hidden"
          style={{
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            right: SCREEN_INSET.right,
            bottom: SCREEN_INSET.bottom,
            borderRadius: SCREEN_INSET.radius,
            backgroundColor: BRAND.bg,
            boxShadow: "inset 0 0 0 1px rgba(74, 88, 78, 0.12)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(74, 88, 78, 0.1) 0%, transparent 70%)",
            }}
          />

          <div
            className="pointer-events-none absolute top-[2.4%] left-1/2 z-10 h-[2.8%] min-h-[10px] max-h-[15px] w-[27%] -translate-x-1/2 rounded-full"
            style={{
              backgroundColor: BRAND.island,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.45)",
            }}
          />

          <div
            className="relative h-full w-full overflow-hidden"
            style={{ borderRadius: "inherit" }}
          >
            <PhoneScreen screen={activeScreen} reduced={reduced} />
          </div>
        </div>
      </div>
    </div>
  )
}