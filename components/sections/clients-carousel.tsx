"use client"

import { useEffect, useRef, useState } from "react"
import { clientLogos } from "@/data/site"

type ClientLogo = (typeof clientLogos)[number]

function duplicateItems<T>(items: readonly T[]): T[] {
  return [...items, ...items, ...items]
}

function LogoItem({ logo }: { logo: ClientLogo }) {
  return (
    <div className="flex h-14 w-44 shrink-0 items-center justify-center px-6 sm:h-16 sm:w-52 sm:px-8">
      <img
        src={logo.src}
        alt={logo.name}
        width={180}
        height={48}
        className="h-8 w-auto max-w-full object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0 sm:h-9"
        loading="lazy"
        draggable={false}
      />
    </div>
  )
}

export function ClientsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const logos = duplicateItems(clientLogos)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 150)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isPaused || !isInitialized || !scrollRef.current) return

    const scrollContainer = scrollRef.current
    let animationFrameId: number
    let isActive = true

    const scroll = () => {
      if (!isActive || !scrollContainer) return

      const maxScroll = scrollContainer.scrollWidth / 3

      scrollContainer.scrollLeft += 0.5
      if (scrollContainer.scrollLeft >= maxScroll) {
        scrollContainer.scrollLeft = 0
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      isActive = false
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused, isInitialized])

  return (
    <section
      id="clientes"
      className="overflow-hidden border-t border-border/40 bg-background py-8 md:py-10"
      aria-label="Empresas parceiras"
    >
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Empresas que confiam na Veridian
      </p>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden sm:gap-8"
          style={{ scrollBehavior: "auto" }}
        >
          {logos.map((logo, index) => (
            <LogoItem key={`${logo.slug}-${index}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  )
}