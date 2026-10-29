import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { ClientsCarousel } from "@/components/sections/clients-carousel"
import { KeynoteSection } from "@/components/sections/keynote-section"
import { ManifestoSection } from "@/components/sections/manifesto-section"
import { ProjectsSection } from "@/components/sections/projects/projects-section"
import { ProcessSection } from "@/components/sections/process-section"
import { ServicesSection } from "@/components/sections/services-section"
import { FAQSection } from "@/components/sections/faq-section"
import { ContactSection } from "@/components/sections/contact-section"
import { JsonLd } from "@/components/seo/json-ld"
import { getHomeStructuredData } from "@/lib/seo"

export default function Home() {
  return (
    <>
      <JsonLd data={getHomeStructuredData()} />
      <main className="min-h-screen overflow-x-clip bg-[#0b0b0d]">
        <Navbar />
        <Hero />
        <ClientsCarousel />
        <KeynoteSection />
        <ManifestoSection />
        <ProjectsSection />
        <ProcessSection />
        <ServicesSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
