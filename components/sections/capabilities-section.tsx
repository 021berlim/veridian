"use client"

import { Target, Code2, Palette } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { capabilities, landingContent } from "@/data/site"

const iconMap = {
  Target,
  Code2,
  Palette,
} as const

export function CapabilitiesSection() {
  return (
    <section id="capacidades" className="py-12 md:py-16">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <h2 className="font-serif text-3xl leading-tight text-balance md:text-4xl lg:text-5xl">
            {landingContent.capabilities.title}
          </h2>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-3">
          {capabilities.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            return (
              <Reveal
                key={item.title}
                delay={index * 0.1}
                className={`group px-6 py-10 transition-colors hover:bg-accent/30 md:py-12 ${
                  index < capabilities.length - 1 ? "md:border-r md:border-border/60" : ""
                } ${index > 0 ? "border-t border-border/60 md:border-t-0" : ""}`}
              >
                <Icon className="mb-6 h-8 w-8 text-foreground/70" strokeWidth={1.25} />
                <h3 className="mb-3 font-serif text-xl text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                <span className="mt-6 inline-block h-px w-0 bg-foreground transition-all duration-500 group-hover:w-8" />
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}