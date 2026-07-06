import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { ClientsCarousel } from "@/components/sections/clients-carousel"
import { CapabilitiesSection } from "@/components/sections/capabilities-section"
import { ProcessSection } from "@/components/sections/process-section"
import { ServicesSection } from "@/components/sections/services-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { FAQSection } from "@/components/sections/faq-section"
import { ContactSection } from "@/components/sections/contact-section"
import { JsonLd } from "@/components/seo/json-ld"
import { getHomeStructuredData } from "@/lib/seo"

export default function Home() {
  return (
    <>
      <JsonLd data={getHomeStructuredData()} />
      <main className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <ClientsCarousel />
      <CapabilitiesSection />
      <ProcessSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
    </>
  )
}