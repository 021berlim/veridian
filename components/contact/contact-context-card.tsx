"use client"

import { motion, AnimatePresence } from "framer-motion"

interface ContactContextCardProps {
  step: number
  selectedPillars: string[]
}

const STEP_CONTEXTS = [
  {
    title: "Seu projeto começa aqui.",
    description:
      "Conte quem está à frente da conversa para iniciarmos o diagnóstico da sua operação.",
  },
  {
    title: "Engenharia sob medida.",
    description:
      "Software, infraestrutura, segurança e inteligência artificial integrados ao seu cenário.",
  },
  {
    title: "Escala e ritmo ideais.",
    description:
      "Calibramos equipe, arquitetura e cronograma de acordo com a realidade da sua empresa.",
  },
  {
    title: "Pronto para compilar.",
    description:
      "Com o contexto em mãos, nosso time revisa o cenário antes da primeira conversa.",
  },
] as const

function StepIllustration({
  step,
  selectedPillars,
}: {
  step: number
  selectedPillars: string[]
}) {
  if (step === 1) {
    return (
      <svg viewBox="0 0 280 160" fill="none" className="mx-auto h-40 w-full max-w-[280px]" aria-hidden="true">
        <g stroke="#2b2d31" strokeWidth="1">
          <line x1="36" y1="32" x2="140" y2="80" />
          <line x1="36" y1="128" x2="140" y2="80" />
          <line x1="244" y1="32" x2="140" y2="80" />
          <line x1="244" y1="128" x2="140" y2="80" />
          <line x1="140" y1="16" x2="140" y2="144" strokeDasharray="3 5" />
          <line x1="60" y1="80" x2="220" y2="80" strokeDasharray="3 5" />
        </g>
        <polygon
          points="140,34 202,80 140,126 78,80"
          stroke="#2b2d31"
          strokeWidth="1"
          fill="#121316"
          fillOpacity="0.45"
        />
        <polygon
          points="140,54 176,80 140,106 104,80"
          stroke="#c72c3b"
          strokeOpacity="0.6"
          strokeWidth="1.2"
          fill="#c72c3b"
          fillOpacity="0.08"
        />
        <circle cx="36" cy="32" r="3" fill="#2b2d31" stroke="#8a8f98" strokeWidth="1" />
        <circle cx="36" cy="128" r="3" fill="#2b2d31" stroke="#8a8f98" strokeWidth="1" />
        <circle cx="244" cy="32" r="3" fill="#2b2d31" stroke="#8a8f98" strokeWidth="1" />
        <circle cx="244" cy="128" r="3" fill="#2b2d31" stroke="#8a8f98" strokeWidth="1" />
        <circle cx="140" cy="80" r="6.5" fill="#c72c3b" />
        <circle cx="140" cy="80" r="13" stroke="#c72c3b" strokeOpacity="0.3" strokeWidth="1" />
      </svg>
    )
  }

  if (step === 2) {
    const layers = [
      { id: "ai-automation", label: "AI LAYER", y: 22 },
      { id: "cybersecurity", label: "SECURITY", y: 52 },
      { id: "software", label: "SOFTWARE", y: 82 },
      { id: "it-support", label: "INFRA & TI", y: 112 },
    ]
    const anySelected = selectedPillars.length > 0
    return (
      <svg viewBox="0 0 280 160" fill="none" className="mx-auto h-40 w-full max-w-[280px]" aria-hidden="true">
        {layers.map((layer) => {
          const active =
            selectedPillars.includes(layer.id) ||
            selectedPillars.includes("architecture-discovery") ||
            (!anySelected && layer.id === "software")
          return (
            <g key={layer.id}>
              <rect
                x="40"
                y={layer.y}
                width="200"
                height="22"
                rx="5"
                fill={active ? "#c72c3b" : "#121316"}
                fillOpacity={active ? 0.14 : 0.7}
                stroke={active ? "#c72c3b" : "#2b2d31"}
                strokeWidth={active ? 1.25 : 1}
              />
              <circle
                cx="56"
                cy={layer.y + 11}
                r="2.5"
                fill={active ? "#c72c3b" : "#4b5563"}
              />
              <text
                x="68"
                y={layer.y + 14}
                fill={active ? "#ffffff" : "#8a8f98"}
                fontSize="8.5"
                fontFamily="monospace"
                letterSpacing="1.6"
              >
                {layer.label}
              </text>
              <line
                x1="186"
                y1={layer.y + 11}
                x2="224"
                y2={layer.y + 11}
                stroke={active ? "#c72c3b" : "#2b2d31"}
                strokeWidth="1.2"
                strokeOpacity={active ? 0.8 : 0.6}
              />
            </g>
          )
        })}
      </svg>
    )
  }

  if (step === 3) {
    const nodes = [
      { x: 40, label: "DISC" },
      { x: 106, label: "ARCH" },
      { x: 174, label: "BUILD" },
      { x: 240, label: "PROD" },
    ]
    return (
      <svg viewBox="0 0 280 160" fill="none" className="mx-auto h-40 w-full max-w-[280px]" aria-hidden="true">
        <line x1="40" y1="74" x2="240" y2="74" stroke="#2b2d31" strokeWidth="1.5" />
        <line x1="40" y1="74" x2="174" y2="74" stroke="#c72c3b" strokeWidth="1.8" />
        {nodes.map((node, idx) => {
          const active = idx <= 2
          return (
            <g key={node.label}>
              <circle
                cx={node.x}
                cy="74"
                r={idx === 2 ? 6.5 : 4.5}
                fill={active ? "#c72c3b" : "#0b0b0d"}
                stroke={active ? "#c72c3b" : "#4b5563"}
                strokeWidth="1.5"
              />
              {idx === 2 && (
                <circle
                  cx={node.x}
                  cy="74"
                  r="12"
                  stroke="#c72c3b"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              )}
              <text
                x={node.x}
                y="104"
                textAnchor="middle"
                fill={active ? "#d4d7dd" : "#6b7280"}
                fontSize="8.5"
                fontFamily="monospace"
                letterSpacing="1.4"
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 280 160" fill="none" className="mx-auto h-40 w-full max-w-[280px]" aria-hidden="true">
      <rect
        x="76"
        y="24"
        width="108"
        height="112"
        rx="8"
        fill="#121316"
        fillOpacity="0.6"
        stroke="#2b2d31"
        strokeWidth="1.2"
      />
      <line x1="94" y1="48" x2="150" y2="48" stroke="#8a8f98" strokeWidth="1.6" />
      <line x1="94" y1="64" x2="164" y2="64" stroke="#3b3e45" strokeWidth="1.4" />
      <line x1="94" y1="78" x2="156" y2="78" stroke="#3b3e45" strokeWidth="1.4" />
      <line x1="94" y1="92" x2="140" y2="92" stroke="#3b3e45" strokeWidth="1.4" />
      <line x1="94" y1="112" x2="128" y2="112" stroke="#c72c3b" strokeWidth="1.6" />

      <g transform="translate(154, 66)">
        <path
          d="M24 2L44 10V25C44 37 35.5 46.5 24 51C12.5 46.5 4 37 4 25V10L24 2Z"
          fill="#0b0b0d"
          stroke="#c72c3b"
          strokeWidth="1.6"
        />
        <path
          d="M16 26L21.5 31.5L33 20"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function ContactContextCard({ step, selectedPillars }: ContactContextCardProps) {
  const ctx = STEP_CONTEXTS[step - 1] ?? STEP_CONTEXTS[0]

  return (
    <aside className="hidden flex-col items-center justify-center text-center lg:flex">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-sm flex-col items-center"
        >
          <h2 className="font-sans text-2xl font-light tracking-[-0.02em] text-white">
            {ctx.title}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#8a8f98]">
            {ctx.description}
          </p>
          <div className="mt-8 w-full">
            <StepIllustration step={step} selectedPillars={selectedPillars} />
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  )
}
