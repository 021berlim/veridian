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
  top: "1.52%",
  left: "3.47%",
  right: "3.47%",
  bottom: "1.52%",
  radius: "9.35%",
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
        {/* Moldura de Titânio do iPhone 17 Pro Max com botões e Camera Control */}
        <img
          src="/images/iphone-17-pro-max-frame.svg"
          alt="iPhone 17 Pro Max Mockup"
          aria-hidden="true"
          className="relative z-10 block h-auto w-full select-none"
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
            border: "1px solid #1a1a1e",
            containerType: "inline-size",
          }}
        >
          {/* Dynamic Island compacta do iPhone 17 Pro Max (19% de largura com sensores ópticos) */}
          <div
            className="pointer-events-none absolute top-[2.1%] left-1/2 z-30 flex h-[2.5%] min-h-[10px] max-h-[16px] w-[19%] -translate-x-1/2 items-center justify-between px-[1.8cqw] rounded-full"
            style={{
              backgroundColor: "#000000",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Lente da câmera frontal com glint antirreflexo */}
            <div className="flex h-[1.8cqw] w-[1.8cqw] items-center justify-center rounded-full bg-[#0a0a14]">
              <div className="h-[0.8cqw] w-[0.8cqw] rounded-full bg-[#20223d]" />
            </div>
            {/* Sensor FaceID / TrueDepth */}
            <div className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-[#07070a]" />
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
