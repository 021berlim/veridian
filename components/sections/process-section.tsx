"use client"

import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { DashboardMockup } from "@/components/sections/dashboard-mockup"
import { landingContent, processFeatures } from "@/data/site"

export function ProcessSection() {
  return (
    <section id="processo" className="relative overflow-hidden py-12 md:py-16">
      <div className="pointer-events-none absolute top-1/2 left-0 right-0 -translate-y-1/2">
        <span className="block text-center font-serif text-[14vw] leading-none tracking-tighter text-foreground/[0.03] select-none">
          TECNOLOGIA
        </span>
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <DashboardMockup />
          </Reveal>

          <div className="space-y-8">
            <Reveal delay={0.1}>
              <h2 className="font-serif text-3xl leading-tight text-balance md:text-4xl lg:text-5xl">
                {landingContent.process.title}
              </h2>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-2">
              {processFeatures.map((feature, index) => (
                <Reveal key={feature} delay={0.15 + index * 0.05}>
                  <div className="flex items-start gap-3 py-2">
                    <span className="mt-2 h-px w-4 shrink-0 bg-foreground/30" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}