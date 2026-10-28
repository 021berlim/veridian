"use client"

import React from "react"
import { motion } from "framer-motion"

/* -------------------------------------------------------------------------- */
/* ÍCONES SVG INLINE ESCALÁVEIS EM CQW                                        */
/* -------------------------------------------------------------------------- */
export function SearchIcon({ className = "w-[4.2cqw] h-[4.2cqw]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function BellIcon({ className = "w-[4.2cqw] h-[4.2cqw]" }: { className?: string }) {
  return (
    <div className="relative inline-flex items-center justify-center p-[0.3cqw]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      <span className="absolute top-0 right-0 h-[1.6cqw] w-[1.6cqw] rounded-full bg-[#c72c3b]" />
    </div>
  )
}

export function UsersIcon({ className = "w-[4.2cqw] h-[4.2cqw]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function CubeIcon({ className = "w-[4.2cqw] h-[4.2cqw]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
      <path d="m3.27 6.96 8.73 4.88 8.73-4.88" />
      <path d="M12 22.08V12" />
    </svg>
  )
}

export function ZuseLogoSmall() {
  return (
    <div className="flex items-center gap-[1.8cqw]">
      <div className="flex h-[5.2cqw] w-[5.2cqw] items-center justify-center rounded-[1.2cqw] bg-[#16161a] p-[0.6cqw] border border-white/10">
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          <path d="M4 6h16l-10 12h10" stroke="#c72c3b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-sans text-[3.8cqw] font-bold tracking-tight text-white">ZUSE</span>
        <span className="font-sans text-[2.6cqw] font-semibold tracking-widest text-[#c72c3b]">LABS</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* BARRA DE STATUS DO IPHONE (9:41, WIFI, BATERIA)                            */
/* -------------------------------------------------------------------------- */
export function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between px-[2cqw] text-[3.6cqw] font-medium text-white select-none">
      <span className="font-sans tracking-tight">9:41</span>
      <div className="flex items-center gap-[1.6cqw]">
        {/* Ícone Wifi */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-[3.6cqw] w-[3.6cqw]">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
        {/* Ícone Bateria */}
        <div className="flex items-center gap-[0.4cqw]">
          <div className="h-[3.2cqw] w-[5.8cqw] rounded-[1cqw] border border-white/80 p-[0.4cqw]">
            <div className="h-full w-full rounded-[0.5cqw] bg-white" />
          </div>
          <div className="h-[1.4cqw] w-[0.6cqw] rounded-r-full bg-white/60" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CABEÇALHO DO APLICATIVO                                                    */
/* -------------------------------------------------------------------------- */
export function PhoneAppHeader({
  leftNode,
  title,
}: {
  leftNode?: React.ReactNode
  title?: string
}) {
  return (
    <div className="flex items-center justify-between py-[1cqw] text-[#ffffff] select-none">
      <div className="flex items-center gap-[1.8cqw]">
        {leftNode || (
          <span className="font-sans text-[4.6cqw] font-bold tracking-tight text-white">
            {title}
          </span>
        )}
      </div>
      <div className="flex items-center gap-[3.2cqw] text-[#a1a1a6]">
        <SearchIcon />
        <BellIcon />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SAUDAÇÃO E SUBTÍTULO                                                       */
/* -------------------------------------------------------------------------- */
export function PhoneGreeting({
  greeting,
  subtitle,
}: {
  greeting: string
  subtitle: string
}) {
  return (
    <div className="select-none">
      <h3 className="font-sans text-[7.4cqw] font-semibold leading-tight tracking-tight text-white">
        {greeting}
      </h3>
      <p className="mt-[0.6cqw] font-sans text-[4.1cqw] leading-snug text-[#a1a1a6]">
        {subtitle}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ABAS SEGMENTADAS (Pílula vermelha na ativa)                                */
/* -------------------------------------------------------------------------- */
export function PhoneTabs({
  tabs,
  activeTab = 0,
}: {
  tabs: { label: string; icon?: React.ReactNode }[]
  activeTab?: number
}) {
  return (
    <div className="flex w-full items-center rounded-[3cqw] border border-white/[0.08] bg-[#121215] p-[0.8cqw] select-none">
      {tabs.map((tab, idx) => {
        const isActive = idx === activeTab
        return (
          <div
            key={tab.label}
            className={`flex flex-1 items-center justify-center gap-[1.2cqw] rounded-[2.4cqw] py-[1.4cqw] text-[3.6cqw] transition-colors ${
              isActive
                ? "bg-[#c72c3b] font-medium text-white shadow-sm"
                : "font-normal text-[#a1a1a6] hover:text-white"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CARTÃO PRINCIPAL                                                           */
/* -------------------------------------------------------------------------- */
export function PhoneCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[4cqw] border border-white/[0.08] bg-[#17171a] p-[3.2cqw] ${className}`}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DOIS CARTÕES DE ESTATÍSTICA (Lado a Lado)                                   */
/* -------------------------------------------------------------------------- */
export function PhoneStatCardRow({
  cards,
}: {
  cards: {
    icon?: React.ReactNode
    label: string
    value: string
    trend?: string
  }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-[2.4cqw] select-none">
      {cards.map((c, i) => (
        <PhoneCard key={i} className="flex flex-col justify-between p-[3cqw] overflow-hidden">
          <div className="flex items-center gap-[1.6cqw] text-[#a1a1a6] min-w-0">
            <span className="shrink-0">{c.icon}</span>
            <span className="block min-w-0 truncate font-sans text-[3.4cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              {c.label}
            </span>
          </div>
          <div className="mt-[1.8cqw]">
            <div className="font-sans text-[6.8cqw] font-semibold leading-none tracking-tight text-white">
              {c.value}
            </div>
            {c.trend && (
              <div className="mt-[1.2cqw] font-sans text-[3.4cqw] font-medium text-[#c72c3b]">
                {c.trend}
              </div>
            )}
          </div>
        </PhoneCard>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* GRÁFICO DE BARRAS VERTICAIS COM GRADIENTE VERMELHO                         */
/* -------------------------------------------------------------------------- */
export function PhoneBarChart({
  bars,
}: {
  bars: { label: string; height: number }[]
}) {
  return (
    <div className="mt-[2cqw] flex h-[16cqw] items-end justify-between gap-[2cqw] px-[1cqw]">
      {bars.map((b, i) => (
        <div key={b.label} className="flex flex-1 flex-col items-center gap-[1.2cqw] h-full justify-end">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: "easeOut" }}
            style={{
              height: `${b.height}%`,
              originY: 1,
              background: "linear-gradient(180deg, #c72c3b 0%, #5a141b 100%)",
            }}
            className="w-full rounded-t-[1.4cqw] will-change-transform"
          />
          <span className="font-sans text-[3.2cqw] text-[#a1a1a6] select-none">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* GRÁFICO DE ÁREA SUAVE (SVG COM GRADIENTE VERMELHO)                         */
/* -------------------------------------------------------------------------- */
export function PhoneAreaChart() {
  return (
    <div className="mt-[2cqw] h-[16cqw] w-full overflow-hidden">
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c72c3b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#5a141b" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          d="M 0,80 Q 50,70 100,45 T 200,30 T 300,10 L 300,100 L 0,100 Z"
          fill="url(#areaGrad)"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          d="M 0,80 Q 50,70 100,45 T 200,30 T 300,10"
          fill="none"
          stroke="#c72c3b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* BARRA DE PROGRESSO HORIZONTAL (CANAIS / DISCIPLINAS)                        */
/* -------------------------------------------------------------------------- */
export function PhoneProgressRow({
  icon,
  label,
  pct,
  pctFormatted,
}: {
  icon?: React.ReactNode
  label: string
  pct: number
  pctFormatted: string
}) {
  return (
    <div className="flex items-center justify-between gap-[2.4cqw] py-[1cqw] select-none">
      <div className="flex items-center gap-[2cqw] w-[32%] shrink-0">
        {icon}
        <span className="truncate font-sans text-[3.8cqw] text-white">{label}</span>
      </div>
      <div className="relative h-[1.8cqw] flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, #5a141b 0%, #c72c3b 100%)" }}
          className="h-full rounded-full"
        />
      </div>
      <span className="w-[12%] text-right font-sans text-[3.6cqw] font-medium text-[#a1a1a6]">
        {pctFormatted}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INDICADOR HOME DO IPHONE                                                   */
/* -------------------------------------------------------------------------- */
export function PhoneHomeIndicator() {
  return (
    <div className="shrink-0 pt-[2cqw] pb-[1cqw] select-none">
      <div className="mx-auto h-[1.1cqw] w-[32cqw] rounded-full bg-white/25" />
    </div>
  )
}
