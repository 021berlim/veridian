"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { AnimatedText } from "@/components/layout/animated-text"
import { Container } from "@/components/layout/container"
import { PhoneMockup } from "@/components/sections/phone-mockup"
import { landingContent, siteConfig } from "@/data/site"
import { scrollToSection } from "@/lib/scroll"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let rafId = 0
    let currentProgress = 0

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 400
      const targetProgress = Math.min(scrollY / maxScroll, 1)

      const smoothUpdate = () => {
        currentProgress += (targetProgress - currentProgress) * 0.1

        if (Math.abs(targetProgress - currentProgress) > 0.001) {
          setScrollProgress(currentProgress)
          rafId = requestAnimationFrame(smoothUpdate)
        } else {
          setScrollProgress(targetProgress)
        }
      }

      cancelAnimationFrame(rafId)
      smoothUpdate()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const easeOutQuad = (t: number) => t * (2 - t)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const scale = 1 - easeOutQuad(scrollProgress) * 0.15
  const borderRadius = easeOutCubic(scrollProgress) * 48
  const heightVh = 100 - easeOutQuad(scrollProgress) * 37.5

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-12"
      aria-label="Hero"
    >
      {/* Camada fixa de 100vh — fundo + watermark VERIDIAN (posição mantida) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-screen overflow-hidden">
        <div
          className="w-full overflow-hidden will-change-transform"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            height: `${heightVh}vh`,
          }}
        >
          <div className="h-full w-full bg-gradient-to-br from-[#E8E5DF] via-[#F0EDE8] to-[#D8D4CC]" />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 flex h-[38vh] items-end justify-center overflow-hidden"
          style={{
            transform: `translateY(${scrollProgress * 150}px)`,
            opacity: 1 - scrollProgress * 0.8,
          }}
        >
          <span className="block translate-y-[10%] whitespace-nowrap font-serif text-[26vw] leading-none tracking-tighter text-foreground/[0.06] select-none sm:text-[22vw] md:text-[20vw] lg:text-[18vw]">
            VERIDIAN
          </span>
        </div>
      </div>

      <Container className="relative z-10 w-full">
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              <AnimatedText
                as="span"
                text={landingContent.hero.headline}
                delay={0.2}
              />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:mt-8 md:text-lg"
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToSection("#trabalhos")}
              className="group flex items-center gap-2 rounded-full border border-foreground bg-foreground px-7 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Conheça nossos projetos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#contato")}
              className="rounded-full border border-border px-7 py-3 text-sm text-foreground transition-colors hover:border-foreground/40 hover:bg-accent/50"
            >
              Fale com a Veridian
            </button>
          </motion.div>
        </div>

        {/* Celular — mesmo posicionamento e animação do Homie */}
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div
              className={`relative w-[234px] will-change-transform transition-all duration-[1500ms] ease-out delay-500 md:w-[281px] lg:w-[351px] ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-[400px] opacity-0"
              }`}
            >
              <PhoneMockup className="w-full" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}