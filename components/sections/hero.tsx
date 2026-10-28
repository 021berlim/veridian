"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { PhoneMockup } from "@/components/sections/phone-mockup"
import { landingContent } from "@/data/site"
import { scrollToSection } from "@/lib/scroll"
import { gsap, usePrefersReducedMotion } from "@/lib/motion"

export function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isPhoneVisible, setIsPhoneVisible] = useState(false)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // Listener para colapso de 100vh no scroll (idêntico ao Veridian original)
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

  // Listener para evento de revelação do hero após o término da intro
  useEffect(() => {
    const triggerReveal = () => {
      setIsPhoneVisible(true)

      if (heroContentRef.current) {
        const reveals = heroContentRef.current.querySelectorAll("[data-intro-reveal]")
        gsap.to(reveals, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        })
      }
    }

    const introState = document.documentElement.dataset.introState
    if (introState === "done" || reducedMotion) {
      triggerReveal()
      return
    }

    window.addEventListener("intro-complete", triggerReveal)
    return () => window.removeEventListener("intro-complete", triggerReveal)
  }, [reducedMotion])

  const easeOutQuad = (t: number) => t * (2 - t)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const scale = 1 - easeOutQuad(scrollProgress) * 0.15
  const borderRadius = easeOutCubic(scrollProgress) * 48
  const heightVh = 100 - easeOutQuad(scrollProgress) * 37.5

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-between overflow-hidden px-6 pb-12"
      style={{
        paddingTop: "calc(var(--header-h, 96px) + clamp(32px, 6vh, 72px))",
      }}
      aria-label="Hero"
    >
      {/* Camada fixa de 100vh — fundo colapsável + marca d'água ZUSE LABS */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-screen overflow-hidden">
        <div
          className="w-full overflow-hidden will-change-transform"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            height: `${heightVh}vh`,
          }}
        >
          <div className="h-full w-full border border-white/[0.04] bg-[#141416]/40" />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 flex h-[38vh] items-end justify-center overflow-hidden"
          style={{
            transform: `translateY(${scrollProgress * 150}px)`,
            opacity: Math.max(0, 1 - scrollProgress * 0.8),
          }}
        >
          <span className="block translate-y-[10%] whitespace-nowrap font-sans font-light text-[22vw] leading-none tracking-tighter select-none sm:text-[20vw] md:text-[18vw] lg:text-[16vw]">
            <span className="text-white/[0.06]">ZUSE </span>
            <span className="text-[#c72c3b] opacity-40">LABS</span>
          </span>
        </div>
      </div>

      <Container className="relative z-10 w-full">
        <div ref={heroContentRef} className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:max-w-5xl">
          <div
            data-intro-reveal
            className="translate-y-6 opacity-0 will-change-transform"
          >
            <h1 className="font-sans text-4xl font-light leading-[1.1] tracking-[-0.03em] text-white text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              {landingContent.hero.headline}
            </h1>
          </div>

          <div
            data-intro-reveal
            className="translate-y-6 opacity-0 will-change-transform"
          >
            <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-[#8a8f98] md:mt-8 md:text-lg">
              {landingContent.hero.subtitle}
            </p>
          </div>

          <div
            data-intro-reveal
            className="mt-8 flex flex-col items-center justify-center gap-4 translate-y-6 opacity-0 will-change-transform sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToSection("#servicos")}
              className="group flex items-center gap-2 rounded-full border border-white bg-white px-7 py-3 text-sm font-medium text-black transition-all hover:bg-white/90"
            >
              {landingContent.hero.secondaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#contato")}
              className="rounded-full border border-white/20 bg-transparent px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              {landingContent.hero.primaryCta}
            </button>
          </div>
        </div>

        {/* Celular — proporções e transição idênticas ao Veridian */}
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div
              data-intro-reveal
              className={`relative w-[234px] will-change-transform transition-all duration-[1500ms] ease-out delay-200 md:w-[281px] lg:w-[351px] ${
                isPhoneVisible ? "translate-y-0 opacity-100" : "translate-y-[400px] opacity-0"
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
