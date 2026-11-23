"use client"

import React from "react"
import { PhoneStatusBar, PhoneHomeIndicator } from "./primitives"

/* 11. LANDING PAGE INSTITUCIONAL (EXEMPLO DE ALTA CONVERSÃO) */
export function LandingPageView() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.8cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />

      {/* Mini Header da Landing Page */}
      <div className="mt-[2cqw] flex items-center justify-between border-b border-white/[0.06] pb-[2.2cqw]">
        <div className="flex items-center gap-[1.8cqw]">
          <div className="flex h-[5cqw] w-[5cqw] items-center justify-center rounded-[1.2cqw] bg-[#c72c3b] font-sans text-[3cqw] font-bold text-white">
            V
          </div>
          <span className="font-sans text-[3.8cqw] font-semibold tracking-[0.16em] text-white">
            VALKORA
          </span>
        </div>
        <span className="rounded-full border border-white/15 px-[2.6cqw] py-[0.8cqw] font-mono text-[2.6cqw] uppercase tracking-wider text-white">
          Contato
        </span>
      </div>

      {/* Hero Editorial da Landing Page */}
      <div className="mt-[4cqw] text-center">
        <span className="inline-block rounded-full border border-[#c72c3b]/40 bg-[#c72c3b]/10 px-[3cqw] py-[0.8cqw] font-mono text-[2.6cqw] uppercase tracking-[0.18em] text-[#f3a6ad]">
          Plataforma Industrial
        </span>

        <h2 className="mt-[2.8cqw] font-sans text-[7.8cqw] font-light leading-[1.08] tracking-[-0.03em] text-white">
          Operação em tempo <span className="text-[#c72c3b]">real.</span>
        </h2>

        <p className="mx-auto mt-[2.2cqw] max-w-[85%] font-sans text-[3.4cqw] leading-relaxed text-[#8a8f98]">
          Telemetria, controle de ativos e automação crítica em uma única interface sob medida.
        </p>

        <div className="mt-[3.6cqw] flex items-center justify-center gap-[2cqw]">
          <span className="rounded-full bg-[#c72c3b] px-[4.4cqw] py-[2cqw] font-sans text-[3.2cqw] font-medium text-white">
            Agendar demo
          </span>
          <span className="rounded-full border border-white/15 px-[4cqw] py-[2cqw] font-sans text-[3.2cqw] font-medium text-[#d4d7dd]">
            Ver cases
          </span>
        </div>
      </div>

      {/* Preview Visual / Métricas */}
      <div className="mt-[4cqw] rounded-[3.5cqw] border border-white/[0.08] bg-[#16161a] p-[3.6cqw]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[2.7cqw] uppercase tracking-wider text-[#8a8f98]">
            Performance global
          </span>
          <span className="font-mono text-[3cqw] font-medium text-emerald-400">
            +99.98% uptime
          </span>
        </div>

        <svg viewBox="0 0 220 52" className="mt-[2.2cqw] h-[14cqw] w-full" fill="none">
          <path
            d="M4 44 L36 36 L70 39 L106 24 L142 26 L178 14 L216 8"
            stroke="#c72c3b"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M4 44 L36 36 L70 39 L106 24 L142 26 L178 14 L216 8 L216 50 L4 50 Z"
            fill="#c72c3b"
            fillOpacity="0.14"
          />
        </svg>

        <div className="mt-[2.4cqw] grid grid-cols-3 gap-[2cqw] border-t border-white/[0.06] pt-[2.4cqw] text-center">
          <div>
            <div className="font-sans text-[4.6cqw] font-semibold text-white">42+</div>
            <div className="font-mono text-[2.5cqw] uppercase text-[#8a8f98]">Plantas</div>
          </div>
          <div>
            <div className="font-sans text-[4.6cqw] font-semibold text-white">0.4s</div>
            <div className="font-mono text-[2.5cqw] uppercase text-[#8a8f98]">Latência</div>
          </div>
          <div>
            <div className="font-sans text-[4.6cqw] font-semibold text-[#c72c3b]">24/7</div>
            <div className="font-mono text-[2.5cqw] uppercase text-[#8a8f98]">Suporte</div>
          </div>
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}
