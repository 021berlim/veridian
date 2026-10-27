"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { PhoneMockup } from "@/components/sections/phone-mockup"
import { ZuseMonogram, ZuseLogotype } from "@/components/ui/zuse-logo"
import { landingContent } from "@/data/site"
import { scrollToSection } from "@/lib/scroll"
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion"

export function Hero() {
  const pinSectionRef = useRef<HTMLDivElement>(null)
  const pinTriggerRef = useRef<HTMLDivElement>(null)
  const logoStageRef = useRef<HTMLDivElement>(null)
  const monogramRef = useRef<HTMLDivElement>(null)
  const logotypeWrapperRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const titleLine1Ref = useRef<HTMLSpanElement>(null)
  const titleLine2Ref = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const phoneContainerRef = useRef<HTMLDivElement>(null)

  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    if (!pinSectionRef.current || !pinTriggerRef.current) return

    const pinSection = pinSectionRef.current
    const pinTrigger = pinTriggerRef.current
    const monogram = monogramRef.current
    const logotypeWrapper = logotypeWrapperRef.current
    const logoStage = logoStageRef.current
    const heroContent = heroContentRef.current
    const titleLine1 = titleLine1Ref.current
    const titleLine2 = titleLine2Ref.current
    const subtitle = subtitleRef.current
    const ctas = ctasRef.current
    const phoneContainer = phoneContainerRef.current

    if (!monogram || !logotypeWrapper || !logoStage || !heroContent) return

    // Contexto isolado do GSAP com limpeza garantida
    const ctx = gsap.context(() => {
      // Estado Inicial (sem flash): Conteúdo oculto até 50%
      gsap.set(heroContent, { autoAlpha: 0 })
      gsap.set([titleLine1, titleLine2], { yPercent: 100, autoAlpha: 0 })
      gsap.set([subtitle, ctas], { y: 24, autoAlpha: 0 })
      gsap.set(phoneContainer, { y: 60, autoAlpha: 0 })

      // Monograma centralizado inicialmente
      // O container de logo tem monograma à esquerda e logotipo à direita com gap
      // No início, o container está centralizado, mas o monograma está deslocado para o centro visual
      // e o logotipo está totalmente mascarado (clipPath inset)
      gsap.set(monogram, { xPercent: 55 })
      gsap.set(logotypeWrapper, {
        clipPath: "inset(0 100% 0 0)",
        autoAlpha: 0,
      })

      const isMobile = window.innerWidth < 768
      const scrollDistance = isMobile ? window.innerHeight * 2 : window.innerHeight * 3

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTrigger,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: pinSection,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 0% a 12%: Monograma Z isolado centralizado (pausa)
      // (progresso 0 a 0.12)
      tl.to({}, { duration: 0.12 })

      // 12% a 24%: Z desliza para a sua posição natural à esquerda no container
      tl.to(
        monogram,
        {
          xPercent: 0,
          duration: 0.12,
          ease: "power2.inOut",
        },
        0.12,
      )

      // 24% a 35%: SOMENTE após o Z terminar o deslocamento, o logotipo é revelado por máscara
      // A máscara abre da esquerda para a direita a partir da borda do Z
      tl.to(
        logotypeWrapper,
        {
          autoAlpha: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.11,
          ease: "power2.out",
        },
        0.24,
      )

      // 35% a 50%: A logo completa sobe até o slot compacto acima do texto
      // Permanece nenhum texto visível
      tl.to(
        logoStage,
        {
          yPercent: isMobile ? -140 : -165,
          scale: isMobile ? 0.65 : 0.72,
          duration: 0.15,
          ease: "power3.inOut",
        },
        0.35,
      )

      // 50% a 70%: Com a logo PARADA no slot, revelar título, subtítulo, CTAs e celular
      tl.set(heroContent, { autoAlpha: 1 }, 0.5)

      // Título linha a linha com máscara
      tl.to(
        [titleLine1, titleLine2],
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.1,
          stagger: 0.03,
          ease: "power3.out",
        },
        0.52,
      )

      // Subtítulo e CTAs
      tl.to(
        subtitle,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.08,
          ease: "power2.out",
        },
        0.56,
      )

      tl.to(
        ctas,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.08,
          ease: "power2.out",
        },
        0.6,
      )

      // Celular (stagger translateY)
      tl.to(
        phoneContainer,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.1,
          ease: "power3.out",
        },
        0.62,
      )

      // 70% a 100%: A logo faz transição fluida até a posição da navbar
      tl.to(
        logoStage,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.inOut",
        },
        0.75,
      )
    }, pinTriggerRef)

    return () => {
      ctx.revert()
    }
  }, [reducedMotion])

  // Fallback estático para prefers-reduced-motion ou renderização sem JS
  if (reducedMotion) {
    return (
      <section
        id="hero"
        className="relative min-h-screen bg-[#0b0b0d] px-6 pt-36 pb-20 text-white"
        aria-label="Hero"
      >
        <Container className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <ZuseMonogram className="h-8 w-8" />
              <ZuseLogotype className="h-6 w-auto" />
            </div>
          </div>
          <h1 className="font-sans text-4xl font-light tracking-[-0.03em] sm:text-6xl md:text-7xl">
            Engenharia de software com precisão cinematográfica.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal text-[#8a8f98] md:text-lg">
            {landingContent.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToSection("#contato")}
              className="border border-[#c72c3b] bg-[#c72c3b] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-white hover:bg-[#a6222f]"
            >
              {landingContent.hero.primaryCta}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#servicos")}
              className="border border-[#2b2d31] bg-transparent px-8 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-white hover:border-white"
            >
              {landingContent.hero.secondaryCta}
            </button>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="w-[280px] sm:w-[320px]">
              <PhoneMockup className="w-full" />
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <div ref={pinTriggerRef} className="relative w-full bg-[#0b0b0d]">
      <section
        ref={pinSectionRef}
        id="hero"
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0b0b0d] px-6 text-white"
        aria-label="Hero"
      >
        {/* PALCO CENTRAL DA LOGO (0% a 70%) */}
        <div
          ref={logoStageRef}
          id="hero-logo-stage"
          className="pointer-events-none absolute z-30 flex items-center justify-center will-change-transform"
          style={{ top: "45%", transform: "translateY(-50%)" }}
        >
          <div className="flex items-center gap-4">
            <div ref={monogramRef} className="h-16 w-16 sm:h-20 sm:w-20">
              <ZuseMonogram className="h-full w-full" />
            </div>
            <div
              ref={logotypeWrapperRef}
              className="h-10 w-auto overflow-hidden sm:h-12"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              <ZuseLogotype className="h-full w-auto" />
            </div>
          </div>
        </div>

        {/* Slot reservado no layout acima do bloco de texto */}
        <div id="hero-logo-slot" className="pointer-events-none absolute top-24 h-12 w-full" />

        {/* CONTEÚDO PRINCIPAL DO HERO (TÍTULO, SUBTÍTULO, CTAS, CELULAR) */}
        <Container
          ref={heroContentRef}
          id="hero-content"
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center pt-28 text-center"
          style={{ visibility: "hidden", opacity: 0 }}
        >
          {/* TÍTULO EDITORIAL */}
          <div className="overflow-hidden">
            <h1 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
              <span ref={titleLine1Ref} className="block overflow-hidden">
                Engenharia de software
              </span>
              <span ref={titleLine2Ref} className="block overflow-hidden text-[#c72c3b]">
                com precisão cinematográfica.
              </span>
            </h1>
          </div>

          {/* SUBTÍTULO */}
          <p
            ref={subtitleRef}
            className="mx-auto mt-6 max-w-2xl text-sm font-normal text-[#8a8f98] sm:text-base md:text-lg"
          >
            {landingContent.hero.subtitle}
          </p>

          {/* 2 CTAS */}
          <div
            ref={ctasRef}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToSection("#contato")}
              className="group flex items-center gap-2 border border-[#c72c3b] bg-[#c72c3b] px-7 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-all hover:bg-[#a6222f]"
            >
              <span>{landingContent.hero.primaryCta}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#servicos")}
              className="border border-[#2b2d31] bg-transparent px-7 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:border-white"
            >
              {landingContent.hero.secondaryCta}
            </button>
          </div>

          {/* CELULAR iPHONE */}
          <div ref={phoneContainerRef} className="mt-10 flex justify-center pb-8 sm:mt-12">
            <div className="w-[220px] sm:w-[260px] md:w-[300px]">
              <PhoneMockup className="w-full" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
