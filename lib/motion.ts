"use client"

import { useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export const INTRO = {
  form: 2.5,
  travel: 0.8,
  reveal: 0.9,
} as const

export const PROCESS_SNAP = true

// Registrar plugins apenas no client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Curvas de aceleração cinematográficas (expo e power4)
 */
export const MOTION = {
  ease: {
    expoOut: "expo.out",
    expoInOut: "expo.inOut",
    power3Out: "power3.out",
    power4Out: "power4.out",
    power4InOut: "power4.inOut",
    editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  duration: {
    instant: 0.2,
    fast: 0.4,
    normal: 0.8,
    cinematic: 1.4,
    keynote: 2.0,
  },
  stagger: {
    tight: 0.04,
    normal: 0.08,
    relaxed: 0.14,
  },
} as const

/**
 * Hook para detectar prefers-reduced-motion
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return reducedMotion
}

/**
 * Helper para forçar refresh do ScrollTrigger após montagem e carregamento de fontes
 */
export function refreshScrollTrigger(delayMs = 150) {
  if (typeof window === "undefined") return
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, delayMs)
}

export { gsap, ScrollTrigger }
