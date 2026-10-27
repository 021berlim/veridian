"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/layout/container"
import { faqs, landingContent } from "@/data/site"

export function FAQSection() {
  return (
    <section id="faq" className="border-b border-[#2b2d31] bg-[#0b0b0d] py-20 md:py-28 text-white">
      <Container className="max-w-4xl">
        <div className="mb-14 text-center md:mb-16">
          <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
            {landingContent.faq.title}
          </h2>
          <p className="mt-4 text-sm text-[#8a8f98] md:text-base">
            {landingContent.faq.subtitle}
          </p>
        </div>

        {/* Radix Accordion com linhas separadoras finas, sem caixas/cards (Regras E2 e E3) */}
        <Accordion type="single" collapsible className="w-full border-t border-[#2b2d31]">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[#2b2d31] px-0 transition-colors"
            >
              <AccordionTrigger className="py-7 text-left font-sans text-lg font-light tracking-tight text-white hover:no-underline hover:text-[#c72c3b] sm:text-xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-8 font-sans text-sm font-normal leading-relaxed text-[#8a8f98] sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
