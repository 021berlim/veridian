"use client"

import { useEffect, useRef, useState } from "react"
import { techStack } from "@/data/site"

type Tech = (typeof techStack)[number]

function duplicateItems<T>(items: readonly T[]): T[] {
  return [...items, ...items, ...items]
}

export function ClientsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const items = duplicateItems(techStack)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isPaused) return

    let animationFrameId: number
    let isActive = true

    const scroll = () => {
      if (!isActive || !scrollContainer) return
      const maxScroll = scrollContainer.scrollWidth / 3

      scrollContainer.scrollLeft += 0.6
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
      className="overflow-hidden border-y border-[#2b2d31] bg-[#0b0b0d] py-8 md:py-10"
      aria-label="Tecnologias e Arquitetura"
    >
      <div className="mx-auto mb-6 max-w-7xl px-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8f98]">
          TECNOLOGIAS E ECOSSISTEMA TÉCNICO
        </span>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className="flex items-center gap-12 overflow-x-hidden sm:gap-16"
          style={{ scrollBehavior: "auto" }}
        >
          {items.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="flex shrink-0 items-center gap-3 transition-colors hover:text-white"
            >
              <span className="font-sans text-sm font-medium tracking-tight text-[#8a8f98] transition-colors hover:text-white sm:text-base">
                {tech.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#4b5563]">
                / {tech.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
