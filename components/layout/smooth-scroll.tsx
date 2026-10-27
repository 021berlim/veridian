"use client"

import { useEffect } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import { registerLenis } from "@/lib/scroll"
import { gsap, ScrollTrigger } from "@/lib/motion"
import "lenis/dist/lenis.css"

function LenisSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    registerLenis(lenis)

    // Atualiza ScrollTrigger a cada scroll do Lenis
    const handleScroll = () => {
      ScrollTrigger.update()
    }
    lenis.on("scroll", handleScroll)

    // Ticker do GSAP aciona o loop do Lenis em milissegundos
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off("scroll", handleScroll)
      gsap.ticker.remove(tickerCallback)
      registerLenis(null)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      autoRaf={false}
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
      <LenisSync />
      {children}
    </ReactLenis>
  )
}
