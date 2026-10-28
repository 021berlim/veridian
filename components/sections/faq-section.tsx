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
    <section
      id="faq"
      className="flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] py-10 md:py-14 text-white"
    >
      <Container className="max-w-4xl">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
            {landingContent.faq.title}
          </h2>
          <p className="mt-3 text-sm text-[#8a8f98] md:text-base">
            {landingContent.faq.subtitle}
          </p>
        </div>

        {/* Radix Accordion com linhas separadoras finas, sem caixas/cards */}
        <Accordion type="single" collapsible className="w-full border-t border-[#2b2d31]">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[#2b2d31] px-0 transition-colors"
            >
              <AccordionTrigger className="py-4 text-left font-sans text-lg font-light tracking-tight text-white hover:no-underline hover:text-[#c72c3b] sm:py-5 sm:text-xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 font-sans text-sm font-normal leading-relaxed text-[#8a8f98] sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
