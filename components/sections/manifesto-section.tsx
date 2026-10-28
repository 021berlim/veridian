"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/container"
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion"

const MANIFESTO_WORDS: { text: string; highlight?: boolean }[] = [
  { text: "VOCÊ", highlight: false },
  { text: "SONHA,", highlight: true },
  { text: "A", highlight: false },
  { text: "GENTE", highlight: false },
  { text: "COMPILA.", highlight: true },
  { text: "TRANSFORMAMOS", highlight: false },
  { text: "DESAFIOS", highlight: false },
  { text: "OPERACIONAIS", highlight: false },
  { text: "EM", highlight: false },
  { text: "SISTEMAS", highlight: true },
  { text: "SOB", highlight: true },
  { text: "MEDIDA.", highlight: true },
  { text: "DA", highlight: false },
  { text: "DIGITALIZAÇÃO", highlight: false },
  { text: "DE", highlight: false },
  { text: "PROCESSOS", highlight: false },
  { text: "À", highlight: false },
  { text: "RETAGUARDA", highlight: true },
  { text: "CRÍTICA,", highlight: false },
  { text: "CRIAMOS", highlight: false },
  { text: "PLATAFORMAS", highlight: false },
  { text: "QUE", highlight: false },
  { text: "ELIMINAM", highlight: false },
  { text: "RETRABALHO", highlight: false },
  { text: "E", highlight: false },
  { text: "LEVAM", highlight: false },
  { text: "SEU", highlight: false },
  { text: "NEGÓCIO", highlight: false },
  { text: "AO", highlight: false },
  { text: "PRÓXIMO", highlight: true },
  { text: "NÍVEL.", highlight: true },
]

export function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    if (!containerRef.current || !pinRef.current || !wordsContainerRef.current) return

    const container = containerRef.current
    const pin = pinRef.current
    const words = wordsContainerRef.current.querySelectorAll(".manifesto-word")

    const ctx = gsap.context(() => {
      // Pin do Manifesto em 100vh com revelação sequencial e suave
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 1.5}`,
          pin: pin,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      words.forEach((word) => {
        const isHighlight = word.getAttribute("data-highlight") === "true"
        tl.to(
          word,
          {
            opacity: 1,
            color: isHighlight ? "#c72c3b" : "#ffffff",
            duration: 0.2,
            ease: "power2.out",
          },
          ">+=0.03",
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section
        id="manifesto"
        className="flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] px-6 py-16 text-white"
        aria-label="Manifesto Zuse Labs"
      >
        <Container className="max-w-4xl text-center">
          <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-2 font-sans text-2xl font-light uppercase tracking-[-0.02em] leading-[1.35] sm:text-3xl md:text-4xl lg:text-5xl">
            {MANIFESTO_WORDS.map((w, i) => (
              <span
                key={i}
                className={w.highlight ? "text-[#c72c3b]" : "text-white"}
              >
                {w.text}
              </span>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full bg-[#0b0b0d]">
      <section
        ref={pinRef}
        id="manifesto"
        className="relative flex h-screen w-full items-center justify-center overflow-hidden border-b border-[#2b2d31] bg-[#0b0b0d] px-6 text-white"
        aria-label="Manifesto Zuse Labs"
      >
        <Container className="max-w-4xl text-center">
          {/* Tipografia editorial balanceada em 100vh com revelação por scroll */}
          <div
            ref={wordsContainerRef}
            className="flex flex-wrap justify-center gap-x-2.5 gap-y-2 font-sans text-2xl font-light uppercase tracking-[-0.02em] leading-[1.35] sm:text-3xl md:text-4xl lg:text-5xl select-none"
          >
            {MANIFESTO_WORDS.map((w, i) => (
              <span
                key={i}
                data-highlight={w.highlight ? "true" : "false"}
                className={`manifesto-word will-change-transform transition-colors duration-150 ${
                  w.highlight ? "text-[#c72c3b]/25" : "text-white/20"
                }`}
              >
                {w.text}
              </span>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
