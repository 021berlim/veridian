"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/container"
import { landingContent } from "@/data/site"
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion"

const STEPS = [
  {
    number: "01",
    phase: "DIAGNÓSTICO ARQUITETURAL",
    title: "Mapeamento rigoroso e requisitos",
    description:
      "Análise profunda dos fluxos operacionais, requisitos de carga e ecossistema de dados. Nenhuma linha de código é escrita sem clareza sobre o problema real e a arquitetura ideal.",
  },
  {
    number: "02",
    phase: "ENGENHARIA E CONSTRUÇÃO",
    title: "Desenvolvimento modular sob medida",
    description:
      "Implementação em ciclos objetivos, com tipagem estrita, separação de responsabilidades e foco em manutenibilidade. Código documentado e preparado para a evolução da empresa.",
  },
  {
    number: "03",
    phase: "VERIFICAÇÃO E HOMOLOGAÇÃO",
    title: "Testes automatizados e segurança",
    description:
      "Testes de integração, varredura de vulnerabilidades e testes de carga em ambientes espelhados. A entrada em produção ocorre com risco operacional minimizado e previsibilidade.",
  },
  {
    number: "04",
    phase: "SUSTENTAÇÃO E EVOLUÇÃO",
    title: "Monitoramento contínuo e suporte",
    description:
      "Acompanhamento proativo de métricas reais de uso, aplicação de atualizações preventivas e sustentação técnica contínua para garantir que os sistemas permaneçam sempre estáveis.",
  },
] as const

const MANIFESTO_WORDS = [
  "Acreditamos", "que", "código", "bem", "escrito", "é", "um", "ativo", "estratégico.",
  "Rejeitamos", "soluções", "improvisadas,", "complexidade", "desnecessária", "e", "promessas",
  "vazias.", "Nossa", "engenharia", "opera", "com", "método,", "discrição", "e", "precisão",
  "para", "garantir", "que", "a", "tecnologia", "da", "sua", "empresa", "funcione",
  "de", "forma", "ininterrupta,", "segura", "e", "longeva."
]

export function ProcessSection() {
  const manifestoRef = useRef<HTMLDivElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    if (!manifestoRef.current || !wordsContainerRef.current) return

    const words = wordsContainerRef.current.querySelectorAll(".manifesto-word")

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      )
    }, manifestoRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section id="processo" className="border-b border-[#2b2d31] bg-[#0b0b0d] py-20 md:py-28 text-white">
      <Container>
        {/* Cabeçalho */}
        <div className="mb-16 max-w-3xl md:mb-20">
          <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
            {landingContent.process.title}
          </h2>
          <p className="mt-6 text-base text-[#8a8f98] md:text-lg">
            {landingContent.process.subtitle}
          </p>
        </div>

        {/* Passos numerados em coluna com linhas finas divisórias */}
        <div className="border-t border-[#2b2d31]">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="grid gap-6 border-b border-[#2b2d31] py-10 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div className="md:col-span-2">
                <span className="font-mono text-2xl font-light text-[#c72c3b] md:text-3xl">
                  {step.number}
                </span>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#8a8f98]">
                  {step.phase}
                </p>
              </div>

              <div className="md:col-span-4">
                <h3 className="font-sans text-xl font-normal tracking-tight text-white md:text-2xl">
                  {step.title}
                </h3>
              </div>

              <div className="md:col-span-6">
                <p className="text-sm leading-relaxed text-[#8a8f98] md:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Manifesto com palavras acendendo suavemente no scroll */}
        <div ref={manifestoRef} className="mt-24 border-t border-[#2b2d31] pt-16 md:mt-32 md:pt-24">
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c72c3b]">
              MANIFESTO
            </span>
          </div>

          <div
            ref={wordsContainerRef}
            className="flex flex-wrap gap-x-3 gap-y-2 font-sans text-2xl font-light leading-relaxed tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {MANIFESTO_WORDS.map((word, i) => (
              <span
                key={i}
                className={`manifesto-word transition-colors duration-150 ${
                  reducedMotion ? "opacity-100" : "opacity-20"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
