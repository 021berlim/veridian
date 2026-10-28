"use client"

import { useEffect, useRef } from "react"
import { Container } from "@/components/layout/container"
import { landingContent } from "@/data/site"
import { gsap, ScrollTrigger, usePrefersReducedMotion, PROCESS_SNAP } from "@/lib/motion"

const STEPS = [
  {
    number: "01",
    phase: "DIAGNÓSTICO",
    title: "Mapeamento rigoroso e requisitos",
    description:
      "Análise profunda de fluxos e dados. Nenhuma linha de código é escrita sem clareza sobre o problema real e a arquitetura ideal.",
  },
  {
    number: "02",
    phase: "CONSTRUÇÃO",
    title: "Desenvolvimento modular",
    description:
      "Implementação em ciclos objetivos, tipagem estrita e foco em manutenibilidade. Código preparado para a evolução contínua da empresa.",
  },
  {
    number: "03",
    phase: "HOMOLOGAÇÃO",
    title: "Testes e segurança",
    description:
      "Testes automatizados e varredura de vulnerabilidades em ambientes espelhados. Entrada em produção com previsibilidade máxima.",
  },
  {
    number: "04",
    phase: "SUSTENTAÇÃO",
    title: "Monitoramento contínuo",
    description:
      "Acompanhamento proativo de métricas reais de uso, atualizações preventivas e sustentação para estabilidade permanente dos sistemas.",
  },
] as const

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])
  const numeralsRef = useRef<HTMLSpanElement[]>([])
  const detailsRef = useRef<HTMLDivElement[]>([])
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    if (!containerRef.current || !pinRef.current || !trackRef.current || !contentWrapperRef.current) return

    let ctx: gsap.Context | null = null

    const initScrollTrigger = () => {
      if (ctx) ctx.revert()

      const container = containerRef.current
      const pin = pinRef.current
      const track = trackRef.current
      const contentWrapper = contentWrapperRef.current
      if (!container || !pin || !track || !contentWrapper) return

      ctx = gsap.context(() => {
        // Distância que a trilha precisa percorrer para que o último item alinhe à borda direita do container
        const getDistance = () => {
          const trackWidth = track.scrollWidth
          const wrapperWidth = contentWrapper.clientWidth
          return Math.max(0, trackWidth - wrapperWidth)
        }

        const distance = getDistance()
        if (distance <= 0) return

        // Setters otimizados para evitar re-render do React
        const stepElements = stepsRef.current.filter(Boolean)
        const numeralElements = numeralsRef.current.filter(Boolean)
        const detailElements = detailsRef.current.filter(Boolean)
        const progressLine = progressLineRef.current
        const counter = counterRef.current

        let currentActiveIdx = -1

        const updateActiveStep = (progress: number) => {
          // Atualiza barra de progresso e contador
          if (progressLine) {
            progressLine.style.transform = `scaleX(${progress})`
          }

          const activeIdx = Math.min(STEPS.length - 1, Math.max(0, Math.round(progress * (STEPS.length - 1))))

          if (counter && activeIdx !== currentActiveIdx) {
            counter.textContent = `0${activeIdx + 1} / 0${STEPS.length}`
          }

          if (activeIdx !== currentActiveIdx) {
            currentActiveIdx = activeIdx

            stepElements.forEach((stepEl, i) => {
              const isActive = i === activeIdx
              const numeralEl = numeralElements[i]
              const detailEl = detailElements[i]

              // Transição de opacidade do item (1 para ativo, 0.4 para inativo)
              stepEl.style.opacity = isActive ? "1" : "0.4"
              stepEl.setAttribute("data-active", isActive ? "true" : "false")

              // Numeral: preenchimento em vermelho #c72c3b quando ativo; só contorno quando inativo
              if (numeralEl) {
                if (isActive) {
                  numeralEl.style.webkitTextStroke = "1px #c72c3b"
                  numeralEl.style.color = "#c72c3b"
                } else {
                  numeralEl.style.webkitTextStroke = "1px rgba(255, 255, 255, 0.28)"
                  numeralEl.style.color = "transparent"
                }
              }

              // Revelação sutil de título e descrição por translateY
              if (detailEl) {
                detailEl.style.transform = isActive ? "translateY(0)" : "translateY(6px)"
                detailEl.style.opacity = isActive ? "1" : "0.65"
              }
            })
          }
        }

        // Timeline do carrossel horizontal
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${getDistance() + window.innerHeight * 0.3}`,
            pin: pin,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: PROCESS_SNAP
              ? {
                  snapTo: 1 / (STEPS.length - 1),
                  duration: { min: 0.2, max: 0.6 },
                  ease: "power2.inOut",
                  delay: 0.05,
                }
              : undefined,
            onUpdate: (self) => {
              updateActiveStep(self.progress)
            },
          },
        })

        // Movimento da trilha em translateX
        tl.to(track, {
          x: () => -getDistance(),
          ease: "none",
          duration: 1,
        })

        // Respiro de ~0.3 viewport segurando o final antes de liberar o pin
        tl.to({}, { duration: 0.25 })

        // Estado inicial
        updateActiveStep(0)
      }, containerRef)
    }

    // Inicialização só após introState === "done"
    const introState = document.documentElement.dataset.introState
    if (introState === "done") {
      initScrollTrigger()
    } else {
      const handleIntroDone = () => {
        initScrollTrigger()
      }
      window.addEventListener("intro-complete", handleIntroDone)
      return () => {
        window.removeEventListener("intro-complete", handleIntroDone)
        if (ctx) ctx.revert()
      }
    }

    // Refresh ao carregar fontes
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => {
      if (ctx) ctx.revert()
    }
  }, [reducedMotion])

  // Versão acessível para prefers-reduced-motion e sem JS
  if (reducedMotion) {
    return (
      <section
        id="processo"
        className="flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] py-16 text-white"
        style={{ paddingTop: "calc(var(--header-h, 92px) + 2rem)" }}
        aria-label="Método de Engenharia"
      >
        <Container>
          <div className="mb-12 max-w-3xl">
            <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
              {landingContent.process.title}
            </h2>
            <p className="mt-4 text-base text-[#8a8f98] md:text-lg">
              {landingContent.process.subtitle}
            </p>
          </div>

          <div
            role="list"
            className="flex w-full overflow-x-auto snap-x snap-mandatory pb-6"
          >
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                role="listitem"
                tabIndex={0}
                className={`w-[80vw] min-w-[320px] shrink-0 snap-start bg-transparent p-6 sm:w-[44vw] ${
                  i > 0 ? "border-l border-white/10" : ""
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-sans text-6xl font-light leading-none"
                    style={{
                      WebkitTextStroke: "1px rgba(255, 255, 255, 0.28)",
                      color: "transparent",
                    }}
                  >
                    {step.number}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
                    {step.phase}
                  </span>
                </div>
                <h3 className="mt-6 font-sans text-xl font-normal text-white md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8f98] md:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full bg-[#0b0b0d]">
      <section
        ref={pinRef}
        id="processo"
        className="relative flex h-screen w-full flex-col justify-between overflow-x-clip border-b border-[#2b2d31] bg-[#0b0b0d] px-6 py-8 md:px-12 text-white"
        style={{
          paddingTop: "calc(var(--header-h, 92px) + 1.5rem)",
          paddingBottom: "2.5rem",
        }}
        aria-label="Método de Engenharia"
      >
        <Container className="w-full flex-1 flex flex-col justify-between">
          {/* Cabeçalho do Método: Título e Subtítulo */}
          <div className="max-w-3xl">
            <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-4xl md:text-5xl text-white">
              {landingContent.process.title}
            </h2>
            <p className="mt-3 text-sm text-[#8a8f98] md:text-base max-w-2xl">
              {landingContent.process.subtitle}
            </p>
          </div>

          {/* Trilha horizontal sem cards */}
          <div ref={contentWrapperRef} className="relative w-full my-auto overflow-visible py-4">
            <div
              ref={trackRef}
              role="list"
              className="flex will-change-transform items-start"
            >
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    if (el) stepsRef.current[i] = el
                  }}
                  role="listitem"
                  tabIndex={0}
                  className={`relative flex flex-col justify-start shrink-0 w-[80vw] min-w-[280px] sm:w-[44vw] sm:min-w-[380px] bg-transparent transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b] ${
                    i === 0 ? "pl-0 pr-8 md:pr-14" : "border-l border-white/10 px-8 md:px-14"
                  }`}
                  style={{
                    opacity: i === 0 ? 1 : 0.4,
                  }}
                >
                  {/* Numeral gigante (stroke 1px branco 28%, vermelho quando ativo) e Rótulo */}
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span
                      ref={(el) => {
                        if (el) numeralsRef.current[i] = el
                      }}
                      className="step-numeral block font-sans font-light select-none text-[clamp(5.5rem,10.5vw,9.5rem)] leading-none will-change-transform transition-colors duration-300"
                      style={{
                        WebkitTextStroke: i === 0 ? "1px #c72c3b" : "1px rgba(255, 255, 255, 0.28)",
                        color: i === 0 ? "#c72c3b" : "transparent",
                      }}
                    >
                      {step.number}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#8a8f98] select-none">
                      {step.phase}
                    </span>
                  </div>

                  {/* Título e Descrição com reveal suave */}
                  <div
                    ref={(el) => {
                      if (el) detailsRef.current[i] = el
                    }}
                    className="mt-4 md:mt-6 transition-all duration-300 will-change-transform"
                    style={{
                      transform: i === 0 ? "translateY(0)" : "translateY(6px)",
                      opacity: i === 0 ? 1 : 0.65,
                    }}
                  >
                    <h3 className="font-sans text-[clamp(1.5rem,2.2vw,2.25rem)] font-normal tracking-tight text-white leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm md:text-base leading-relaxed text-[#8a8f98] max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicador mínimo de progresso e contador */}
          <div className="w-full pt-4">
            <div className="flex items-center justify-between gap-6">
              <div className="relative h-[1px] w-full bg-white/10 overflow-hidden">
                <div
                  ref={progressLineRef}
                  className="absolute inset-y-0 left-0 w-full origin-left bg-[#c72c3b] will-change-transform"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <span
                ref={counterRef}
                className="shrink-0 font-mono text-sm tracking-wider text-[#8a8f98] select-none"
                aria-live="off"
              >
                01 / 04
              </span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
