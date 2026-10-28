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
  { text: "A", highlight: false },
  { text: "VISÃO", highlight: false },
  { text: "DO", highlight: false },
  { text: "SEU", highlight: false },
  { text: "NEGÓCIO", highlight: false },
  { text: "EM", highlight: false },
  { text: "SOFTWARE", highlight: true },
  { text: "SOB", highlight: true },
  { text: "MEDIDA.", highlight: true },
  { text: "CRIAMOS", highlight: false },
  { text: "ECOSSISTEMAS", highlight: false },
  { text: "DIGITAIS", highlight: false },
  { text: "E", highlight: false },
  { text: "PLATAFORMAS", highlight: false },
  { text: "INTELIGENTES", highlight: false },
  { text: "QUE", highlight: false },
  { text: "CENTRALIZAM", highlight: false },
  { text: "OPERAÇÕES", highlight: false },
  { text: "COMPLEXAS,", highlight: false },
  { text: "ELIMINAM", highlight: false },
  { text: "RETRABALHO", highlight: true },
  { text: "E", highlight: false },
  { text: "CONSTROEM", highlight: false },
  { text: "A", highlight: false },
  { text: "RETAGUARDA", highlight: true },
  { text: "DIGITAL", highlight: true },
  { text: "QUE", highlight: false },
  { text: "SUA", highlight: false },
  { text: "EMPRESA", highlight: false },
  { text: "PRECISA", highlight: false },
  { text: "PARA", highlight: false },
  { text: "AVANÇAR", highlight: false },
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
      // Pin do Manifesto em 100vh com efeito das palavras saltando para frente ao acender
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 1.6}`,
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
            scale: 1.05,
            color: isHighlight ? "#c72c3b" : "#ffffff",
            duration: 0.25,
            ease: "back.out(1.4)",
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
        className="flex min-h-[100svh] flex-col justify-center items-center border-b border-[#2b2d31] bg-[#0b0b0d] px-6 text-white"
        style={{ paddingTop: "var(--header-h, 96px)" }}
        aria-label="Manifesto Zuse Labs"
      >
        <Container className="max-w-4xl text-center">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2.5 font-sans text-2xl font-medium uppercase tracking-tight leading-[1.3] sm:text-3xl md:text-4xl lg:text-[2.6rem]">
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
        className="relative flex h-screen w-full flex-col justify-center items-center overflow-hidden border-b border-[#2b2d31] bg-[#0b0b0d] px-6 text-white"
        style={{
          // Compensa com precisão ótica a presença do header no topo para simetria perfeita
          paddingTop: "calc(var(--header-h, 92px) * 0.08)",
        }}
        aria-label="Manifesto Zuse Labs"
      >
        <Container className="max-w-4xl text-center">
          {/* Tipografia com peso font-medium, escala proporcional e efeito de salto tridimensional */}
          <div
            ref={wordsContainerRef}
            className="flex flex-wrap justify-center gap-x-3 gap-y-2.5 font-sans text-2xl font-medium uppercase tracking-tight leading-[1.3] sm:text-3xl md:text-4xl lg:text-[2.6rem] select-none"
          >
            {MANIFESTO_WORDS.map((w, i) => (
              <span
                key={i}
                data-highlight={w.highlight ? "true" : "false"}
                className={`manifesto-word inline-block will-change-transform transition-all duration-200 origin-center scale-[0.96] ${
                  w.highlight ? "text-[#c72c3b]/30" : "text-white/20"
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
