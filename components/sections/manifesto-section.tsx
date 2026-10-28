"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/container"
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion"

const MANIFESTO_WORDS: { text: string; highlight?: boolean }[] = [
  // Slogan e essência Zuse Labs
  { text: "VOCÊ", highlight: false },
  { text: "SONHA,", highlight: true },
  { text: "A", highlight: false },
  { text: "GENTE", highlight: false },
  { text: "COMPILA.", highlight: true },

  // Posicionamento real e técnico
  { text: "TRANSFORMAMOS", highlight: false },
  { text: "DESAFIOS", highlight: false },
  { text: "OPERACIONAIS", highlight: false },
  { text: "EM", highlight: false },
  { text: "SISTEMAS", highlight: true },
  { text: "SOB", highlight: true },
  { text: "MEDIDA.", highlight: true },

  // Abordagem direta (da retaguarda à eficiência)
  { text: "DA", highlight: false },
  { text: "DIGITALIZAÇÃO", highlight: false },
  { text: "À", highlight: false },
  { text: "RETAGUARDA", highlight: true },
  { text: "CRÍTICA,", highlight: false },

  // Impacto final comprovado
  { text: "CONSTRUÍMOS", highlight: false },
  { text: "PLATAFORMAS", highlight: false },
  { text: "QUE", highlight: false },
  { text: "ELIMINAM", highlight: false },
  { text: "RETRABALHO", highlight: true },
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
      // Pin do Manifesto em 100vh com efeito de iluminação progressiva das palavras no scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 1.5}`,
          pin: pin,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      words.forEach((word) => {
        const isHighlight = word.getAttribute("data-highlight") === "true"
        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            color: isHighlight ? "#c72c3b" : "#ffffff",
            duration: 0.2,
            ease: "power2.out",
          },
          ">+=0.025",
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
        style={{ paddingTop: "var(--header-h, 92px)" }}
        aria-label="Manifesto Zuse Labs"
      >
        <Container className="max-w-5xl text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-3.5 md:gap-x-6 md:gap-y-4 font-sans text-2xl font-bold uppercase tracking-tight leading-[1.2] sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.15rem]">
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
          // Centralização ótica exata: desconta a altura do header para que a distância
          // do topo do texto até o header seja RIGOROSAMENTE IGUAL à distância da base do texto até o fim da tela
          paddingTop: "var(--header-h, 92px)",
        }}
        aria-label="Manifesto Zuse Labs"
      >
        <Container className="max-w-5xl text-center">
          {/* Tipografia robusta inspirada no Lando Norris: bold, tracking tenso, escala ampla e iluminação progressiva sem colisão entre palavras */}
          <div
            ref={wordsContainerRef}
            className="flex flex-wrap justify-center gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-3.5 md:gap-x-6 md:gap-y-4 font-sans text-2xl font-bold uppercase tracking-tight leading-[1.2] sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.15rem] select-none"
          >
            {MANIFESTO_WORDS.map((w, i) => (
              <span
                key={i}
                data-highlight={w.highlight ? "true" : "false"}
                className={`manifesto-word inline-block will-change-[opacity,color] opacity-20 ${
                  w.highlight ? "text-[#c72c3b]" : "text-white"
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
