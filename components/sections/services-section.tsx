"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { landingContent, services } from "@/data/site"

const SERVICE_AREA_MAP: Record<string, string> = {
  "01": "software",
  "02": "suporte",
  "03": "seguranca",
  "04": "ia",
}

export function ServicesSection() {
  return (
    <section
      id="servicos"
      className="zuse-m-services flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] py-10 md:py-14 text-white"
    >
      <Container>
        {/* Cabeçalho */}
        <div className="zuse-m-services-header mb-10 max-w-3xl md:mb-12">
          <h2 className="zuse-m-services-h2 font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
            {landingContent.services.title}
          </h2>
          <p className="mt-3 text-base text-[#8a8f98] md:text-lg">
            {landingContent.services.subtitle}
          </p>
        </div>

        {/* Lista editorial de serviços 01–04 */}
        <div className="border-t border-[#2b2d31]">
          {services.map((service) => {
            const area = SERVICE_AREA_MAP[service.number]
            const href = area ? `/contato?area=${area}` : "/contato"
            return (
              <Link
                key={service.number}
                href={href}
                className="zuse-m-services-item group block cursor-pointer border-b border-[#2b2d31] py-6 transition-colors duration-300 hover:bg-[#121316] md:py-7"
              >
                <div className="grid items-start gap-4 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-2">
                    <span className="font-mono text-2xl font-light text-[#8a8f98] transition-colors duration-300 group-hover:text-[#c72c3b] md:text-3xl">
                      {service.number}
                    </span>
                  </div>

                  <div className="md:col-span-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="zuse-m-services-h3 font-sans text-xl font-normal tracking-tight text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                        {service.title}
                      </h3>
                      <ArrowUpRight className="h-5 w-5 text-[#8a8f98] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#c72c3b] md:hidden" />
                    </div>
                    <p className="mt-1 text-xs font-mono uppercase tracking-wider text-[#8a8f98]">
                      {service.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-6 md:col-span-5">
                    <p className="text-sm leading-relaxed text-[#8a8f98] transition-colors duration-300 group-hover:text-white sm:text-base">
                      {service.description}
                    </p>
                    <ArrowUpRight className="hidden h-6 w-6 shrink-0 text-[#8a8f98] transition-all duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:text-[#c72c3b] md:block" />
                  </div>
                </div>

                {/* Linha fina expansível no hover */}
                <div className="mt-5 h-[1px] w-0 bg-[#c72c3b] transition-all duration-500 ease-out group-hover:w-full" />
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
