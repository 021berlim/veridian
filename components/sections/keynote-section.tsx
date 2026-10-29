"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/container"
import { gsap, usePrefersReducedMotion } from "@/lib/motion"

const WORDS = [
  {
    title: "Software.",
    desc: "Aplicações sob medida com arquitetura moderna e escalabilidade real.",
  },
  {
    title: "Suporte.",
    desc: "Sustentação contínua de TI e monitoramento preventivo da sua infraestrutura.",
  },
  {
    title: "Segurança.",
    desc: "Cibersegurança e proteção de dados críticos em múltiplas camadas.",
  },
  {
    title: "IA.",
    desc: "Automação e agentes inteligentes integrados às operações diárias da sua empresa.",
  },
] as const

export function KeynoteSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement[]>([])
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    if (!containerRef.current || !pinRef.current) return

    const container = containerRef.current
    const pin = pinRef.current
    const words = wordsRef.current

    const ctx = gsap.context(() => {
      // Pin da cena keynote
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 2.2}`,
          pin: pin,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      words.forEach((wordEl, i) => {
        if (!wordEl) return
        if (i === 0) {
          // Primeira palavra começa visível e sai no avanço
          tl.to(wordEl, { opacity: 0, y: -40, duration: 0.5 }, "+=0.3")
        } else {
          // Palavras seguintes entram e saem
          tl.fromTo(
            wordEl,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          )
          if (i < words.length - 1) {
            tl.to(wordEl, { opacity: 0, y: -40, duration: 0.5, ease: "power2.in" }, "+=0.3")
          }
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section className="border-b border-[#2b2d31] bg-[#0b0b0d] py-24 text-white">
        <Container>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {WORDS.map((item) => (
              <div key={item.title} className="border-t border-[#2b2d31] pt-6">
                <span className="font-sans text-5xl font-light tracking-[-0.03em] text-[#c72c3b]">
                  {item.title}
                </span>
                <p className="mt-4 text-sm text-[#8a8f98]">{item.desc}</p>
              </div>
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
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden border-b border-[#2b2d31] bg-[#0b0b0d] px-6 text-white"
        style={{
          paddingTop: "var(--header-h, 92px)",
        }}
        aria-label="Pilares de Atuação"
      >
        <div className="relative mx-auto flex h-72 w-full max-w-5xl flex-col items-center justify-center text-center">
          {WORDS.map((item, index) => (
            <div
              key={item.title}
              ref={(el) => {
                if (el) wordsRef.current[index] = el
              }}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center ${
                index === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="block text-center font-sans text-6xl font-light tracking-[-0.04em] text-[#c72c3b] sm:text-8xl md:text-9xl">
                {item.title}
              </span>
              <p className="mx-auto mt-6 max-w-xl text-center text-sm font-normal text-[#8a8f98] sm:text-base md:text-lg">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
