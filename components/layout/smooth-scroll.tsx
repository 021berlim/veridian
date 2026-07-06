"use client"

import { useEffect } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import { registerLenis } from "@/lib/scroll"
import "lenis/dist/lenis.css"

function LenisRegister() {
  const lenis = useLenis()

  useEffect(() => {
    registerLenis(lenis ?? null)
    return () => registerLenis(null)
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
        syncTouch: true,
      }}
    >
      <LenisRegister />
      {children}
    </ReactLenis>
  )
}