"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { APPS } from "@/components/phone/data"
import { ClientDashboardView } from "@/components/phone/client-dashboard"
import { StudentPortalView } from "@/components/phone/student-portal"
import { FinanceView } from "@/components/phone/finance"
import { WorkshopView } from "@/components/phone/workshop"
import { AssistantView } from "@/components/phone/assistant"

// Inset preciso que faz o canvas da tela cobrir perfeitamente o desenho da moldura
const SCREEN_INSET = {
  top: "1.9%",
  left: "4.7%",
  right: "4.7%",
  bottom: "1.9%",
  radius: "8.6%",
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
    <div
      className={`relative ${className}`}
      role="img"
      aria-hidden="true"
    >
      <div className="relative w-full">
        {/* Moldura original do iPhone */}
        <img
          src="/images/iphone-frame.png"
          alt=""
          aria-hidden="true"
          className="relative z-10 block h-auto w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
          draggable={false}
        />

        {/* Tela interna com alinhamento perfeito aos cantos do bezel (sem borda cinza externa) */}
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
            containerType: "inline-size",
          }}
        >
          {/* Dynamic Island realista da Apple (câmera frontal com ótica AR sapphire + sensor FaceID) */}
          <div
            className="pointer-events-none absolute top-[2.2%] left-1/2 z-30 flex h-[2.7%] min-h-[11px] max-h-[15px] w-[22%] -translate-x-1/2 items-center justify-between px-[2.2cqw] rounded-full shadow-inner select-none"
            style={{
              backgroundColor: "#000000",
              border: "0.5px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.9), inset 0 0.5px 1px rgba(255, 255, 255, 0.06)",
            }}
          >
            {/* Sensor TrueDepth / FaceID */}
            <div className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-[#08080c] ring-1 ring-white/[0.04]" />

            {/* Lente da Câmera Frontal (Abertura óptica com reflexo azul-safira) */}
            <div className="relative flex h-[1.9cqw] w-[1.9cqw] items-center justify-center rounded-full bg-[#0c0d14] ring-1 ring-white/[0.06]">
              <div className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-[#1c2242]" />
              <div className="absolute top-[0.4cqw] right-[0.4cqw] h-[0.3cqw] w-[0.3cqw] rounded-full bg-[#465a9e]/70" />
            </div>
          </div>

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
  )
}
