"use client"

import { Container } from "@/components/layout/container"
import { landingContent } from "@/data/site"

const STEPS = [
  {
    number: "01",
    phase: "DIAGNÓSTICO",
    title: "Mapeamento rigoroso e requisitos",
    description:
      "Análise profunda de fluxos e dados. Nenhuma linha de código é escrita sem clareza sobre o problema real e a arquitetura ideal.",
  },
  {
    number: "02",
    phase: "CONSTRUÇÃO",
    title: "Desenvolvimento modular",
    description:
      "Implementação em ciclos objetivos, tipagem estrita e foco em manutenibilidade. Código preparado para a evolução contínua da empresa.",
  },
  {
    number: "03",
    phase: "HOMOLOGAÇÃO",
    title: "Testes e segurança",
    description:
      "Testes automatizados e varredura de vulnerabilidades em ambientes espelhados. Entrada em produção com previsibilidade máxima.",
  },
  {
    number: "04",
    phase: "SUSTENTAÇÃO",
    title: "Monitoramento contínuo",
    description:
      "Acompanhamento proativo de métricas reais de uso, atualizações preventivas e sustentação para estabilidade permanente dos sistemas.",
  },
] as const

export function ProcessSection() {
  return (
    <section
      id="processo"
      className="flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] py-12 md:py-16 text-white"
    >
      <Container>
        {/* Cabeçalho do Método */}
        <div className="mb-12 max-w-3xl md:mb-16">
          <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
            {landingContent.process.title}
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] md:text-lg">
            {landingContent.process.subtitle}
          </p>
        </div>

        {/* 4 Passos numerados que cabem elegantemente na tela de 100vh */}
        <div className="grid gap-6 border-t border-[#2b2d31] pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between border-b border-[#2b2d31] pb-8 lg:border-b-0 lg:border-r lg:border-[#2b2d31] lg:pr-6 last:lg:border-r-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-light text-[#c72c3b] md:text-3xl">
                    {step.number}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8a8f98]">
                    {step.phase}
                  </span>
                </div>

                <h3 className="mt-4 font-sans text-lg font-normal tracking-tight text-white md:text-xl">
                  {step.title}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-[#8a8f98] md:text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
