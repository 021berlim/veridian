"use client"

import { useEffect, useRef, useState } from "react"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { landingContent, testimonialsRow1, testimonialsRow2 } from "@/data/site"

type Testimonial = (typeof testimonialsRow1)[number]

function duplicateItems<T>(items: readonly T[]): T[] {
  return [...items, ...items, ...items]
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-full shrink-0 border border-border/60 px-8 py-6 sm:w-[420px]">
      <blockquote className="font-serif text-lg leading-relaxed text-foreground">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-4 border-t border-border/60 pt-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground">
          {item.initials}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{item.author}</p>
          <p className="text-xs text-muted-foreground">{item.role}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialCarousel({
  items,
  direction,
  isPaused,
  isInitialized,
  startFromEnd = false,
}: {
  items: Testimonial[]
  direction: "left" | "right"
  isPaused: boolean
  isInitialized: boolean
  startFromEnd?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startFromEnd || !scrollRef.current) return
    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3
  }, [startFromEnd, items])

  useEffect(() => {
    if (isPaused || !isInitialized || !scrollRef.current) return

    const scrollContainer = scrollRef.current
    let animationFrameId: number
    let isActive = true

    const scroll = () => {
      if (!isActive || !scrollContainer) return

      const maxScroll = scrollContainer.scrollWidth / 3

      if (direction === "left") {
        scrollContainer.scrollLeft += 0.6
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0
        }
      } else {
        scrollContainer.scrollLeft -= 0.6
        if (scrollContainer.scrollLeft <= 0) {
          scrollContainer.scrollLeft = maxScroll
        }
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      isActive = false
      cancelAnimationFrame(animationFrameId)
    }
  }, [direction, isPaused, isInitialized])

  return (
    <div className="relative">
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        style={{ scrollBehavior: "auto" }}
      >
        {items.map((item, index) => (
          <TestimonialCard key={`${item.author}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const row1 = duplicateItems(testimonialsRow1)
  const row2 = duplicateItems(testimonialsRow2)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="depoimentos" className="overflow-hidden py-12 md:py-16">
      <Container>
        <Reveal className="mb-10 text-center md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            {landingContent.testimonials.title}
          </h2>
        </Reveal>
      </Container>

      <div
        className="space-y-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <TestimonialCarousel
          items={row1}
          direction="left"
          isPaused={isPaused}
          isInitialized={isInitialized}
        />

        <TestimonialCarousel
          items={row2}
          direction="right"
          isPaused={isPaused}
          isInitialized={isInitialized}
          startFromEnd
        />
      </div>
    </section>
  )
}