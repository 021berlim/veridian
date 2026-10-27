"use client"

import { Container } from "@/components/layout/container"
import { landingContent } from "@/data/site"

const columns = [
  {
    number: "01",
    tag: "DESENVOLVIMENTO",
    title: "Software sob medida",
    description:
      "Construção de aplicações web robustas, portais empresariais e plataformas escaláveis. Foco em código limpo, arquitetura desacoplada e longevidade técnica sem acúmulo de débito operacional.",
    details:
      "Projetamos cada sistema com tipagem estrita, testes automatizados e pipelines contínuos de entrega, garantindo estabilidade e facilidade de manutenção para equipes internas.",
  },
  {
    number: "02",
    tag: "SUSTENTAÇÃO",
    title: "Suporte e Manutenção de TI",
    description:
      "Monitoramento ativo de infraestrutura, prevenção de incidentes e sustentação técnica contínua. Sua operação respaldada por engenheiros prontos para atuar com rapidez e clareza.",
    details:
      "Acompanhamento de disponibilidade, otimização de consultas a bancos de dados, backups consistentes e atualização rigorosa de ambientes em nuvem e servidores dedicados.",
  },
  {
    number: "03",
    tag: "SEGURANÇA & INTELIGÊNCIA",
    title: "Cibersegurança e IA",
    description:
      "Proteção em camadas para blindar dados corporativos e integração pragmática de modelos de inteligência artificial. Tecnologia aplicada para eliminar gargalos e fortalecer a governança.",
    details:
      "Auditorias contínuas de vulnerabilidades, conformidade com padrões de privacidade e agentes de automação integrados a fluxos reais para ganho imediato de eficiência.",
  },
] as const

export function CapabilitiesSection() {
  return (
    <section id="capacidades" className="border-b border-[#2b2d31] bg-[#0b0b0d] py-20 md:py-28 text-white">
      <Container>
        {/* Cabeçalho Editorial — Título grande direto sem pílulas */}
        <div className="mb-16 max-w-4xl md:mb-20">
          <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
            {landingContent.capabilities.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base text-[#8a8f98] md:text-lg">
            {landingContent.capabilities.description}
          </p>
        </div>

        {/* 3 Colunas estruturadas puramente por tipografia e linhas finas verticais (Regras E2 e E3) */}
        <div className="grid gap-0 md:grid-cols-3 border-t border-[#2b2d31]">
          {columns.map((col, index) => (
            <div
              key={col.number}
              className={`flex flex-col justify-between py-12 md:px-8 first:md:pl-0 last:md:pr-0 ${
                index < columns.length - 1 ? "md:border-r md:border-[#2b2d31]" : ""
              } ${index > 0 ? "border-t border-[#2b2d31] md:border-t-0" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#8a8f98]">
                  <span>{col.number}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#c72c3b]">{col.tag}</span>
                </div>
                <h3 className="mt-6 font-sans text-xl font-normal tracking-tight text-white sm:text-2xl">
                  {col.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#8a8f98]">
                  {col.description}
                </p>
              </div>

              <div className="mt-8 border-t border-[#2b2d31] pt-6">
                <p className="text-xs leading-relaxed text-[#6b7280]">
                  {col.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
