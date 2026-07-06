"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { landingContent, services } from "@/data/site"

export function ServicesSection() {
  return (
    <section id="servicos" className="py-12 md:py-16">
      <Container>
        <Reveal className="mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            {landingContent.services.title}
          </h2>
        </Reveal>

        <div className="divide-y divide-border/80">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group grid gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div className="md:col-span-2">
                <span className="font-serif text-3xl text-foreground/30 transition-colors group-hover:text-foreground/60 md:text-4xl">
                  {service.number}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-xl text-foreground md:text-2xl">{service.title}</h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {service.description}
                </p>
                <span className="mt-4 inline-block h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}