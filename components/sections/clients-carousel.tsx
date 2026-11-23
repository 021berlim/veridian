"use client"

import { useEffect, useRef, useState } from "react"
import { trustedClients } from "@/data/site"
import { ClientLogoMark } from "@/components/sections/client-logos"

function duplicateItems<T>(items: readonly T[]): T[] {
  return [...items, ...items, ...items]
}

export function ClientsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const items = duplicateItems(trustedClients)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isPaused) return

    let animationFrameId: number
    let isActive = true

    const scroll = () => {
      if (!isActive || !scrollContainer) return
      const maxScroll = scrollContainer.scrollWidth / 3

      scrollContainer.scrollLeft += 0.55
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
  }, [isPaused])

  return (
    <section
      id="tecnologias"
      className="zuse-m-clients overflow-hidden border-y border-[#2b2d31] bg-[#0b0b0d] py-8 md:py-12"
      aria-label="Empresas que confiam na ZUSE"
    >
      <div className="zuse-m-clients-label mx-auto mb-7 max-w-7xl px-6 text-center md:mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8f98]">
          Empresas que confiam na ZUSE
        </span>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0b0b0d] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0b0b0d] to-transparent sm:w-24" />

        <div
          ref={scrollRef}
          className="zuse-m-clients-track flex items-center gap-14 overflow-x-hidden sm:gap-20"
          style={{ scrollBehavior: "auto" }}
        >
          {items.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="zuse-m-clients-item group flex shrink-0 select-none items-center gap-3.5 text-[#8a8f98]/85 transition-colors duration-300 hover:text-white"
            >
              <ClientLogoMark
                id={client.id}
                className="h-7 w-7 shrink-0 text-[#a1a7b3] transition-transform duration-300 group-hover:scale-105 group-hover:text-white sm:h-8 sm:w-8"
              />
              <div className="flex flex-col leading-none">
                <span className="font-sans text-sm font-semibold tracking-[0.18em] text-[#d4d7dd]/85 transition-colors duration-300 group-hover:text-white sm:text-[15px]">
                  {client.name}
                </span>
                <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.24em] text-[#6b7280] transition-colors duration-300 group-hover:text-[#9ca3af]">
                  {client.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

