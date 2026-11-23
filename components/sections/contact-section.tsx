"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa6"
import { Container } from "@/components/layout/container"
import { landingContent } from "@/data/site"
import { openWhatsApp } from "@/lib/whatsapp"

const QUALIFICATION_STEPS = [
  { num: "01", label: "Dados de contato" },
  { num: "02", label: "Frentes e cenário" },
  { num: "03", label: "Escala e horizonte" },
  { num: "04", label: "Briefing técnico" },
] as const

export function ContactSection() {
  return (
    <section
      id="contato"
      className="zuse-m-contact border-b border-[#2b2d31] bg-[#0b0b0d] py-16 text-white md:py-24"
    >
      <Container>
        <div className="zuse-m-contact-grid grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Coluna Esquerda — Chamada Editorial */}
          <div className="lg:col-span-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#c72c3b]">
              DIAGNÓSTICO TÉCNICO // 4 ETAPAS
            </span>

            <h2 className="zuse-m-contact-h2 mt-4 font-sans text-3xl font-light leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
              {landingContent.contact.title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#8a8f98] md:text-lg">
              {landingContent.contact.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contato"
                className="zuse-m-contact-btn group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c72c3b] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-[#a61f2c]"
              >
                Iniciar diagnóstico do projeto
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#2b2d31] px-7 py-4 text-sm font-medium text-[#d4d7dd] transition-colors hover:border-[#c72c3b] hover:text-white"
              >
                <FaWhatsapp className="h-4 w-4 text-[#c72c3b]" />
                Falar direto no WhatsApp
              </button>
            </div>
          </div>

          {/* Coluna Direita — Preview do Funil em 4 Etapas */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#2b2d31] bg-[#121316] p-6 sm:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8a8f98]">
                COMO FUNCIONA O BRIEFING
              </span>

              <div className="mt-5 space-y-3">
                {QUALIFICATION_STEPS.map((item) => (
                  <div
                    key={item.num}
                    className="flex items-center justify-between rounded-xl border border-[#2b2d31]/80 bg-[#0b0b0d]/70 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#c72c3b]">{item.num}</span>
                      <span className="text-sm text-[#e5e7eb]">{item.label}</span>
                    </div>
                    <Check className="h-3.5 w-3.5 text-[#4b5563]" />
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-[#2b2d31] pt-4 text-xs leading-relaxed text-[#8a8f98]">
                Leva menos de 2 minutos. Seu briefing vai direto para um líder de engenharia com
                retorno em até 1 dia útil.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
