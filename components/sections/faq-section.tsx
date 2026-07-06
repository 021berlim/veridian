"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { faqs, landingContent } from "@/data/site"

export function FAQSection() {
  return (
    <section id="faq" className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <Reveal className="mb-8 text-center md:mb-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            {landingContent.faq.title}
          </h2>
        </Reveal>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-border/80 px-0 data-[state=open]:border-foreground/20"
            >
              <AccordionTrigger className="py-6 text-left font-serif text-base text-foreground hover:no-underline md:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}