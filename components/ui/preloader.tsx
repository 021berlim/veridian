"use client"

import { useEffect, useState } from "react"
import { ZuseMonogram } from "@/components/ui/zuse-logo"

export function Preloader() {
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Verificar se já foi exibido nesta sessão
    const hasSeen = sessionStorage.getItem("zuse-preloader-seen")
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (hasSeen || prefersReduced) {
      document.documentElement.setAttribute("data-preloader-done", "true")
      return
    }

    setActive(true)
    document.documentElement.setAttribute("data-preloader-done", "false")

    const duration = 1800 // 1.8s (≤ 2.2s exigido por A7)
    const startTime = performance.now()

    const update = (now: number) => {
      const elapsed = now - startTime
      const p = Math.min(elapsed / duration, 1)
      setProgress(Math.round(p * 100))

      if (p < 1) {
        requestAnimationFrame(update)
      } else {
        setFadeOut(true)
        setTimeout(() => {
          setActive(false)
          sessionStorage.setItem("zuse-preloader-seen", "true")
          document.documentElement.setAttribute("data-preloader-done", "true")
          // Notificar liberação
          window.dispatchEvent(new Event("preloader-complete"))
        }, 300)
      }
    }

    const frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [])

  if (!active) return null

  return (
    <div
      id="zuse-preloader"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0b0b0d] transition-opacity duration-300 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center">
        {/* Monograma Z centralizado exatamente na mesma posição do hero */}
        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <ZuseMonogram className="h-full w-full drop-shadow-md" />
        </div>

        {/* Contador suave minimalista editorial */}
        <div className="mt-8 flex flex-col items-center gap-1 font-mono">
          <span className="text-xs tracking-widest text-[#8a8f98]">
            INICIALIZANDO {progress.toString().padStart(3, "0")}%
          </span>
          <div className="h-[1px] w-32 bg-[#2b2d31]">
            <div
              className="h-full bg-[#c72c3b] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
