"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowUpRight } from "lucide-react"
import { CATEGORY_LABELS, type Project } from "@/data/projects"
import { usePrefersReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

const AUTOPLAY_INACTIVITY_MS = 4500

interface MobileProjectsCarouselProps {
  projects: readonly Project[]
}

function resolveMobilePreviewSrc(project: Project): string | undefined {
  return (
    project.screens.phone?.src ??
    project.screens.laptop?.src ??
    project.media?.find((m) => m.type === "image")?.src ??
    project.media?.[0]?.poster
  )
}

export function MobileProjectsCarousel({ projects }: MobileProjectsCarouselProps) {
  const reducedMotion = usePrefersReducedMotion()
  const total = projects.length
  const canLoop = total > 1

  const [selectedIndex, setSelectedIndex] = useState(0)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const parallaxRefs = useRef<Array<HTMLImageElement | null>>([])

  const rafIdRef = useRef<number | null>(null)
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInViewRef = useRef(false)
  const isInteractingRef = useRef(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    dragFree: false,
    loop: canLoop,
    skipSnaps: false,
  })

  const clearAutoplay = useCallback(() => {
    if (autoplayTimerRef.current !== null) {
      clearTimeout(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }, [])

  const scheduleAutoplay = useCallback(() => {
    clearAutoplay()
    if (!emblaApi || !canLoop || reducedMotion) return
    if (!isInViewRef.current || isInteractingRef.current) return
    if (typeof document !== "undefined" && document.hidden) return

    autoplayTimerRef.current = setTimeout(() => {
      autoplayTimerRef.current = null
      if (!emblaApi || !isInViewRef.current || isInteractingRef.current) return
      if (typeof document !== "undefined" && document.hidden) return
      emblaApi.scrollNext()
    }, AUTOPLAY_INACTIVITY_MS)
  }, [clearAutoplay, emblaApi, canLoop, reducedMotion])

  const getLoopAwareDiff = useCallback(
    (snap: number, snapIndex: number, scrollProgress: number) => {
      if (!emblaApi) return 0
      const engine = emblaApi.internalEngine()
      let diffToTarget = snap - scrollProgress

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target()
          if (snapIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target)
            if (sign === -1) diffToTarget = snap - (1 + scrollProgress)
            if (sign === 1) diffToTarget = snap + (1 - scrollProgress)
          }
        })
      }

      return diffToTarget
    },
    [emblaApi],
  )

  const applyScrollEffects = useCallback(() => {
    if (!emblaApi) return

    const snapList = emblaApi.scrollSnapList()
    const scrollProgress = emblaApi.scrollProgress()
    const step =
      snapList.length > 1
        ? Math.abs(snapList[1] - snapList[0]) || 1 / snapList.length
        : 1

    snapList.forEach((snap, index) => {
      const cardEl = cardRefs.current[index]
      const imgEl = parallaxRefs.current[index]

      const diffToTarget = getLoopAwareDiff(snap, index, scrollProgress)
      const normalizedDiff = snapList.length > 1 ? diffToTarget / step : 0
      const clampedDiff = Math.max(-1.25, Math.min(1.25, normalizedDiff))
      const absDist = Math.min(1, Math.abs(clampedDiff))

      if (cardEl) {
        if (reducedMotion) {
          cardEl.style.transform = "translate3d(0, 0, 0) scale(1)"
          cardEl.style.opacity = absDist < 0.5 ? "1" : "0.42"
        } else {
          const scale = 1 - absDist * 0.09 // 1.0 -> 0.91
          const opacity = 1 - absDist * 0.58 // 1.0 -> 0.42
          cardEl.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(4)})`
          cardEl.style.opacity = opacity.toFixed(4)
        }
      }

      if (imgEl) {
        if (reducedMotion) {
          imgEl.style.transform = "translate3d(0, 0, 0) scale(1)"
        } else {
          const shiftX = Math.max(-1, Math.min(1, normalizedDiff)) * -9
          imgEl.style.transform = `translate3d(${shiftX.toFixed(3)}%, 0, 0) scale(1.12)`
        }
      }
    })
  }, [emblaApi, getLoopAwareDiff, reducedMotion])

  const scheduleEffects = useCallback(() => {
    if (rafIdRef.current !== null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      applyScrollEffects()
    })
  }, [applyScrollEffects])

  const syncSelection = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // IntersectionObserver: ativa autoplay apenas quando o carrossel está visível na viewport
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false
        isInViewRef.current = visible
        if (visible) {
          scheduleAutoplay()
        } else {
          clearAutoplay()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(root)

    const handleVisibility = () => {
      if (document.hidden) {
        clearAutoplay()
      } else {
        scheduleAutoplay()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      clearAutoplay()
    }
  }, [scheduleAutoplay, clearAutoplay])

  // Eventos do Embla: efeitos GPU 60fps + pausa/reset imediato de autoplay em interações
  useEffect(() => {
    if (!emblaApi) return

    const handlePointerDown = () => {
      isInteractingRef.current = true
      clearAutoplay()
    }

    const handlePointerUp = () => {
      isInteractingRef.current = false
      scheduleAutoplay()
    }

    const handleSettle = () => {
      isInteractingRef.current = false
      applyScrollEffects()
      scheduleAutoplay()
    }

    const handleScroll = () => {
      if (isInteractingRef.current) {
        clearAutoplay()
      }
      scheduleEffects()
    }

    syncSelection()
    applyScrollEffects()
    scheduleAutoplay()

    emblaApi.on("select", syncSelection)
    emblaApi.on("reInit", syncSelection)
    emblaApi.on("reInit", applyScrollEffects)
    emblaApi.on("scroll", handleScroll)
    emblaApi.on("pointerDown", handlePointerDown)
    emblaApi.on("pointerUp", handlePointerUp)
    emblaApi.on("settle", handleSettle)

    return () => {
      emblaApi.off("select", syncSelection)
      emblaApi.off("reInit", syncSelection)
      emblaApi.off("reInit", applyScrollEffects)
      emblaApi.off("scroll", handleScroll)
      emblaApi.off("pointerDown", handlePointerDown)
      emblaApi.off("pointerUp", handlePointerUp)
      emblaApi.off("settle", handleSettle)
      clearAutoplay()
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [
    emblaApi,
    syncSelection,
    applyScrollEffects,
    scheduleEffects,
    scheduleAutoplay,
    clearAutoplay,
  ])

  // Ao trocar filtro, pausa autoplay, reseta suavemente para o slide 0 e reinicia a contagem
  useEffect(() => {
    cardRefs.current.length = projects.length
    parallaxRefs.current.length = projects.length
    clearAutoplay()
    if (!emblaApi) return

    emblaApi.reInit({
      align: "center",
      containScroll: false,
      dragFree: false,
      loop: projects.length > 1,
      skipSnaps: false,
    })
    emblaApi.scrollTo(0, false)
    setSelectedIndex(0)
    applyScrollEffects()
    scheduleAutoplay()
  }, [emblaApi, projects, applyScrollEffects, clearAutoplay, scheduleAutoplay])

  const safeIndex = Math.min(selectedIndex, Math.max(0, total - 1))

  if (total === 0) return null

  return (
    <div ref={rootRef} className="relative mt-5 pb-16">
      {/* Palco full-bleed (100vw) para exibir ~9% de peek nas bordas, sem shadow/glow */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div
          ref={emblaRef}
          onTouchStart={() => {
            isInteractingRef.current = true
            clearAutoplay()
          }}
          className="overflow-hidden touch-pan-y"
          role="region"
          aria-roledescription="carousel"
          aria-label="Projetos em produção"
        >
          <div className="flex items-center">
            {projects.map((project, index) => {
              const isActive = index === safeIndex
              const previewSrc = resolveMobilePreviewSrc(project)
              const categoryLabel =
                CATEGORY_LABELS[project.category] ?? project.category

              return (
                <div
                  key={project.slug}
                  className="min-w-0 flex-[0_0_82%] px-1.5"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${total}: ${project.name}`}
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[index] = el
                    }}
                    className={cn(
                      "relative h-[460px] w-full overflow-hidden rounded-2xl border bg-[#111113] will-change-transform transition-[border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive ? "border-red-500/50" : "border-white/10",
                    )}
                    style={{
                      transform:
                        index === 0
                          ? "translate3d(0, 0, 0) scale(1)"
                          : "translate3d(0, 0, 0) scale(0.91)",
                      opacity: index === 0 ? 1 : 0.42,
                    }}
                  >
                    <Link
                      href={`/projetos/${project.slug}`}
                      aria-label={`Ver case do projeto ${project.name} (${categoryLabel})`}
                      onClick={(e) => {
                        if (!isActive && emblaApi) {
                          e.preventDefault()
                          clearAutoplay()
                          emblaApi.scrollTo(index)
                        }
                      }}
                      className="relative flex h-full w-full flex-col justify-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c72c3b]"
                    >
                      {/* Imagem com parallax interno (overscan scale-[1.12]) */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {previewSrc ? (
                          <img
                            ref={(el) => {
                              parallaxRefs.current[index] = el
                            }}
                            src={previewSrc}
                            alt={`Interface do sistema ${project.name}`}
                            loading={index < 3 ? "eager" : "lazy"}
                            decoding="async"
                            className="h-full w-full object-cover object-top will-change-transform"
                            style={{
                              transform: reducedMotion
                                ? "translate3d(0, 0, 0) scale(1)"
                                : "translate3d(0, 0, 0) scale(1.12)",
                            }}
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="h-full w-full bg-gradient-to-br from-[#18181b] to-[#0b0b0d]"
                          />
                        )}
                      </div>

                      {/* Degradê escuro suave na base do card */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"
                      />

                      {/* Coreografia tipográfica exclusiva do card ativo + seta limpa igual ao desktop */}
                      <div
                        className={cn(
                          "relative z-10 p-5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none translate-y-3 opacity-0",
                        )}
                      >
                        <div className="flex items-end justify-between gap-3">
                          <h3 className="font-sans text-xl font-semibold leading-snug tracking-[-0.02em] text-white">
                            {project.name}
                          </h3>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-5 w-5 shrink-0 text-red-500"
                          />
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#c9cdd4]">
                          {project.tagline}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Indicador minimalista de 3 traços com posição ativa dinâmica (ciclo 0 -> 1 -> 2) */}
      {total > 1 && (
        <div
          aria-hidden="true"
          className="mt-6 flex items-center justify-center gap-2"
        >
          {Array.from({ length: Math.min(3, total) }).map((_, dashIndex) => {
            const dashCount = Math.min(3, total)
            const isDashActive = safeIndex % dashCount === dashIndex
            return (
              <span
                key={dashIndex}
                className={cn(
                  "h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isDashActive ? "w-8 bg-red-500" : "w-3 bg-white/20",
                )}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
