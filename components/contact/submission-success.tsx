"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa6"
import { openWhatsApp } from "@/lib/whatsapp"

interface SubmissionSuccessProps {
  firstName: string
  companyLabel: string
  preferredChannel: string
  whatsappHref: string
}

/* Curvas oficiais do design system (lib/motion.ts) */
const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const
const EASE_DRAW_RING = [0.65, 0, 0.35, 1] as const

export function SubmissionSuccess({
  firstName,
  companyLabel,
  preferredChannel,
  whatsappHref,
}: SubmissionSuccessProps) {
  const [phase, setPhase] = useState<"check" | "details">("check")

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      setPhase("details")
      return
    }

    /* 0–420ms anel · 280–560ms check · 500–720ms assentamento · 430ms hold = 1150ms */
    const timer = window.setTimeout(() => {
      setPhase("details")
    }, 1150)

    return () => window.clearTimeout(timer)
  }, [])

  const isDetails = phase === "details"

  return (
    <div className="mx-auto flex min-h-[360px] max-w-2xl flex-col items-center justify-center text-center">
      {/* Verificado contínuo: começa em foco central e desliza (FLIP) para cima do título */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{
          opacity: 1,
          scale: isDetails ? 0.58 : 1,
          marginBottom: isDetails ? 12 : 0,
        }}
        transition={{
          layout: { duration: 0.65, ease: EASE_EDITORIAL },
          scale: { duration: 0.65, ease: EASE_EDITORIAL },
          marginBottom: { duration: 0.65, ease: EASE_EDITORIAL },
          opacity: { duration: 0.24, ease: EASE_EDITORIAL },
        }}
        className="flex items-center justify-center will-change-transform"
        aria-label="Briefing enviado com sucesso"
      >
        <motion.svg
          viewBox="0 0 84 84"
          fill="none"
          className="h-24 w-24 sm:h-28 sm:w-28"
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 0.24, delay: 0.5, ease: EASE_EDITORIAL }}
          aria-hidden="true"
        >
          {/* Preenchimento vítreo sutil */}
          <motion.circle
            cx="42"
            cy="42"
            r="36"
            fill="#c72c3b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 0.26, delay: 0.48, ease: EASE_EDITORIAL }}
          />

          {/* Círculo único contínuo — inicia às 12h sentido horário */}
          <motion.circle
            cx="42"
            cy="42"
            r="36"
            stroke="#c72c3b"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1, rotate: -90 }}
            transition={{ duration: 0.42, ease: EASE_DRAW_RING }}
            style={{ transformOrigin: "42px 42px" }}
          />

          {/* Checkmark branco puro com 33% de overlap para gesto contínuo */}
          <motion.path
            d="M27.5 43.2L37.4 53.1L57.5 32.5"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.28, delay: 0.28, ease: EASE_EDITORIAL },
              opacity: { duration: 0.06, delay: 0.27 },
            }}
          />
        </motion.svg>
      </motion.div>

      {/* Bloco de agradecimento que entra suavemente logo abaixo do verificado */}
      {isDetails && (
        <div className="w-full">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.14, ease: EASE_EDITORIAL }}
            className="font-sans text-3xl font-light tracking-[-0.03em] text-white sm:text-4xl"
          >
            Recebemos o seu briefing, {firstName}.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.22, ease: EASE_EDITORIAL }}
            className="mt-4 text-sm leading-relaxed text-[#8a8f98] sm:text-base"
          >
            Nosso time de especialistas já recebeu os detalhes{" "}
            {companyLabel ? (
              <>
                de <span className="text-white">{companyLabel}</span>
              </>
            ) : (
              "do seu projeto"
            )}{" "}
            e vai analisar o seu cenário com atenção. Em breve, faremos o primeiro contato via{" "}
            <span className="text-white">{preferredChannel}</span> para agendar a reunião de
            diagnóstico, onde vamos estruturar escopo e orçamento juntos.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.3, ease: EASE_EDITORIAL }}
            className="mt-4 text-xs leading-relaxed text-[#6b7280] sm:text-sm"
          >
            Nossa equipe entrará em contato logo. Caso prefira agilizar o contato, você pode usar o
            botão abaixo para falar direto no WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.38, ease: EASE_EDITORIAL }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => openWhatsApp(whatsappHref)}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c72c3b] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#a61f2c]"
            >
              <FaWhatsapp className="h-4 w-4" />
              Falar no WhatsApp agora
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#2b2d31] px-7 py-3 text-sm font-medium text-[#d4d7dd] transition-colors hover:border-white/30 hover:text-white"
            >
              Voltar ao início
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  )
}
