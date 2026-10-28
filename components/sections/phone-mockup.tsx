"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { APPS } from "@/components/phone/data"
import { ClientDashboardView } from "@/components/phone/client-dashboard"
import { StudentPortalView } from "@/components/phone/student-portal"
import { FinanceView } from "@/components/phone/finance"
import { WorkshopView } from "@/components/phone/workshop"
import { AssistantView } from "@/components/phone/assistant"

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

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0)

  useEffect(() => {
    // Ciclo de 6s por tela (≥ 5.5s conforme especificado)
    const interval = setInterval(() => {
      setActiveScreenIndex((prev) => (prev + 1) % APPS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const currentApp = APPS[activeScreenIndex]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Legenda dinâmica em texto simples (12px, cinza, sem pílula) centralizada acima do aparelho */}
      <p
        className="mb-3 text-center font-sans text-xs tracking-wide text-[#a1a1a6] select-none"
        aria-live="off"
      >
        Exemplo ilustrativo · {currentApp.name}
      </p>

      <div
        className="relative w-full"
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
                  key={currentApp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-full w-full"
                >
                  {currentApp.id === "client-dashboard" && <ClientDashboardView />}
                  {currentApp.id === "student-portal" && <StudentPortalView />}
                  {currentApp.id === "finance" && <FinanceView />}
                  {currentApp.id === "workshop" && <WorkshopView />}
                  {currentApp.id === "assistant" && <AssistantView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
