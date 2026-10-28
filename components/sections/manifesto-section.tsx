"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/container"
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion"

const MANIFESTO_WORDS: { text: string; highlight?: boolean }[] = [
  { text: "ACREDITAMOS", highlight: false },
  { text: "QUE", highlight: false },
  { text: "CÓDIGO", highlight: false },
  { text: "BEM", highlight: false },
  { text: "ESCRITO", highlight: false },
  { text: "É", highlight: false },
  { text: "UM", highlight: false },
  { text: "ATIVO", highlight: true },
  { text: "ESTRATÉGICO.", highlight: true },
  { text: "REJEITAMOS", highlight: false },
  { text: "SOLUÇÕES", highlight: false },
  { text: "IMPROVISADAS,", highlight: false },
  { text: "COMPLEXIDADE", highlight: false },
  { text: "DESNECESSÁRIA", highlight: false },
  { text: "E", highlight: false },
  { text: "PROMESSAS", highlight: false },
  { text: "VAZIAS.", highlight: false },
  { text: "NOSSA", highlight: false },
  { text: "ENGENHARIA", highlight: false },
  { text: "OPERA", highlight: false },
  { text: "COM", highlight: false },
  { text: "MÉTODO,", highlight: true },
  { text: "DISCRIÇÃO", highlight: false },
  { text: "E", highlight: false },
  { text: "PRECISÃO", highlight: true },
  { text: "PARA", highlight: false },
  { text: "QUE", highlight: false },
  { text: "SUA", highlight: false },
  { text: "TECNOLOGIA", highlight: false },
  { text: "OPERE", highlight: false },
  { text: "DE", highlight: false },
  { text: "FORMA", highlight: false },
  { text: "ININTERRUPTA,", highlight: true },
  { text: "SEGURA", highlight: false },
  { text: "E", highlight: false },
  { text: "LONGEVA.", highlight: true },
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
      // Pin do Manifesto em 100vh com iluminação sequencial por scroll (estilo Lando Norris)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 1.8}`,
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
            duration: 0.25,
            ease: "power2.out",
          },
          ">+=0.04",
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section
        id="manifesto"
        className="flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] px-6 py-20 text-white"
        aria-label="Manifesto de Engenharia"
      >
        <Container className="max-w-6xl">
          <div className="flex flex-wrap gap-x-4 gap-y-3 font-sans text-3xl font-light uppercase tracking-[-0.03em] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
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
        aria-label="Manifesto de Engenharia"
      >
        <Container className="max-w-6xl">
          {/* Tipografia monumental estilo Lando Norris — pura, sem caixas/cards ou dados de sistema */}
          <div
            ref={wordsContainerRef}
            className="flex flex-wrap gap-x-3.5 gap-y-2.5 font-sans text-3xl font-light uppercase tracking-[-0.03em] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl select-none"
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
