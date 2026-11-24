"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { motion, AnimatePresence, LayoutGroup, useIsPresent } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid, Plus } from "lucide-react"
import { CATEGORY_LABELS, type Project } from "@/data/projects"
import { scrollToElementCenter } from "@/lib/scroll"
import { cn } from "@/lib/utils"

export const DESKTOP_BENTO_BATCH_SIZE = 6
export type DesktopProjectsViewMode = "bento" | "carousel"

const DESKTOP_AUTOPLAY_MS = 5000

// Coreografia editorial deliberada: cards deslizam em onda suave (~0.9s + stagger até 225ms)
const CARD_EASE = [0.22, 1, 0.36, 1] as const
const CARD_LAYOUT_DURATION = 0.9
const CARD_STAGGER_STEP = 0.045
const CARD_STAGGER_MAX = 0.225
const REORGANIZE_SETTLE_MS = Math.round((CARD_LAYOUT_DURATION + CARD_STAGGER_MAX) * 1000)

// Curva suave de câmera sincronizada com o glide dos cards (evita snap brusco em 200ms)
const MORPH_CAMERA_EASING = (t: number) => 1 - Math.pow(1 - t, 3)

function getCardLayoutTransition(index: number, reducedMotion: boolean) {
  if (reducedMotion) {
    return { duration: 0.01 }
  }

  return {
    type: "tween" as const,
    duration: CARD_LAYOUT_DURATION,
    ease: CARD_EASE,
    delay: Math.min(index * CARD_STAGGER_STEP, CARD_STAGGER_MAX),
  }
}

const CYCLIC_SIX_SPANS: readonly string[] = [
  "col-span-6 row-span-2", // 0
  "col-span-6 row-span-1", // 1
  "col-span-6 row-span-1", // 2
  "col-span-4 row-span-1", // 3
  "col-span-4 row-span-1", // 4
  "col-span-4 row-span-1", // 5
] as const

/**
 * Calcula dinamicamente o col-span e row-span de cada card no grid de 12 colunas
 * com base na quantidade total de projetos visíveis, evitando lacunas ou órfãos.
 */
export function getCardSpanClass(index: number, total: number): string {
  if (total <= 1) {
    return "col-span-12 row-span-2"
  }

  if (total === 2) {
    return "col-span-6 row-span-2"
  }

  if (total === 3) {
    return index === 0 ? "col-span-7 row-span-2" : "col-span-5 row-span-1"
  }

  if (total === 4) {
    return "col-span-6 row-span-1"
  }

  if (total === 5) {
    return index === 0 ? "col-span-6 row-span-2" : "col-span-6 row-span-1"
  }

  const remainder = total % 6
  const fullBlocksEnd = total - remainder

  if (index < fullBlocksEnd) {
    return CYCLIC_SIX_SPANS[index % 6]
  }

  const remIndex = index - fullBlocksEnd

  if (remainder === 1) {
    return "col-span-12 row-span-1"
  }

  if (remainder === 2) {
    return "col-span-6 row-span-1"
  }

  if (remainder === 3) {
    return remIndex === 0 ? "col-span-7 row-span-2" : "col-span-5 row-span-1"
  }

  if (remainder === 4) {
    return "col-span-6 row-span-1"
  }

  return remIndex === 0 ? "col-span-6 row-span-2" : "col-span-6 row-span-1"
}

function resolvePreviewSrc(project: Project): string | undefined {
  return (
    project.screens.laptop?.src ??
    project.screens.phone?.src ??
    project.media?.find((m) => m.type === "image")?.src ??
    project.media?.[0]?.poster
  )
}

interface DesktopProjectCardContentProps {
  project: Project
  eager: boolean
  layoutTransition: ReturnType<typeof getCardLayoutTransition>
  reducedMotion: boolean
  onHoverStateChange?: (isHovered: boolean) => void
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  arrowAlwaysRed?: boolean
}

function DesktopProjectCardContent({
  project,
  eager,
  layoutTransition,
  reducedMotion,
  onHoverStateChange,
  onLinkClick,
  arrowAlwaysRed = false,
}: DesktopProjectCardContentProps) {
  const previewSrc = resolvePreviewSrc(project)
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category
  const stackPills = project.stack.slice(0, 3)

  return (
    <Link
      href={`/projetos/${project.slug}`}
      aria-label={`Ver case do projeto ${project.name} (${categoryLabel})`}
      draggable={false}
      onClick={onLinkClick}
      onMouseEnter={() => onHoverStateChange?.(true)}
      onMouseLeave={() => onHoverStateChange?.(false)}
      onFocus={() => onHoverStateChange?.(false)}
      className="group relative flex h-full w-full flex-col justify-end cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c72c3b]"
    >
      {/* Preview ocupando 100% do card, totalmente limpo no topo */}
      {previewSrc ? (
        <img
          src={previewSrc}
          alt={`Interface do sistema ${project.name}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top brightness-[0.82] saturate-[0.9] transition-all duration-500 ease-out group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.03] group-focus-visible:brightness-100 group-focus-visible:saturate-100 group-focus-visible:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#18181b] to-[#0b0b0d]"
        />
      )}

      {/* Degradê inferior permanente para contraste absoluto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent"
      />

      {/* Rodapé com layout="position" sincronizado para evitar distorção de escala no morph lento */}
      <motion.div
        layout={reducedMotion ? false : "position"}
        transition={{ layout: layoutTransition }}
        className="relative z-10 p-4 lg:p-5"
      >
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-sans text-lg xl:text-xl font-semibold tracking-[-0.02em] text-white leading-snug">
            {project.name}
          </h3>
          <ArrowUpRight
            aria-hidden="true"
            className={cn(
              "h-5 w-5 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5",
              arrowAlwaysRed
                ? "text-red-500"
                : "text-white/75 group-hover:text-red-500 group-focus-visible:text-red-500",
            )}
          />
        </div>

        {/* Detalhes revelados suavemente no hover / focus */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="pt-2.5 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
              <p className="text-xs xl:text-sm leading-relaxed text-[#d1d5db] line-clamp-2">
                {project.tagline}
              </p>

              {stackPills.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {stackPills.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/80 backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

interface BentoCardItemProps {
  project: Project
  index: number
  spanClass: string
  reducedMotion: boolean
  onHoverStateChange?: (isHovered: boolean) => void
}

function BentoCardItem({
  project,
  index,
  spanClass,
  reducedMotion,
  onHoverStateChange,
}: BentoCardItemProps) {
  const isPresent = useIsPresent()
  const layoutTransition = getCardLayoutTransition(index, reducedMotion)
  const enterDelay = reducedMotion
    ? 0
    : 0.14 + Math.min(index * CARD_STAGGER_STEP, CARD_STAGGER_MAX)

  return (
    <motion.article
      role="listitem"
      layout={!reducedMotion}
      layoutId={reducedMotion ? undefined : `desktop-project-${project.slug}`}
      style={{ borderRadius: 12 }}
      initial={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 16, scale: 0.96 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reducedMotion
          ? { opacity: 0, transition: { duration: 0.01 } }
          : {
              opacity: 0,
              scale: 0.94,
              transition: { duration: 0.24, ease: CARD_EASE },
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : {
              layout: layoutTransition,
              opacity: { duration: 0.45, ease: CARD_EASE, delay: enterDelay },
              y: { duration: 0.55, ease: CARD_EASE, delay: enterDelay },
              scale: { duration: 0.55, ease: CARD_EASE, delay: enterDelay },
            }
      }
      className={cn(
        spanClass,
        isPresent ? "z-10" : "z-0 pointer-events-none",
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#111113] transition-[border-color] duration-300 hover:border-red-500/50 focus-within:border-red-500/60",
      )}
    >
      <DesktopProjectCardContent
        project={project}
        eager={index < 3}
        layoutTransition={layoutTransition}
        reducedMotion={reducedMotion}
        onHoverStateChange={onHoverStateChange}
      />
    </motion.article>
  )
}

interface DesktopProjectsCarouselProps {
  projects: readonly Project[]
  isReorganizing: boolean
  onBackToGrid: () => void
  onHoverStateChange?: (isHovered: boolean) => void
  reducedMotion: boolean
}

function DesktopProjectsCarousel({
  projects,
  isReorganizing,
  onBackToGrid,
  onHoverStateChange,
  reducedMotion,
}: DesktopProjectsCarouselProps) {
  const total = projects.length
  const canLoop = total > 1
  // startIndex = 1 mantém os slides 0, 1 e 2 nos 3 slots visíveis (+ slide 3 em peek à direita),
  // fazendo 4 dos 6 cards do Bento se reorganizarem à vista do usuário
  const initialStartIndex = total >= 3 ? 1 : 0

  const [selectedIndex, setSelectedIndex] = useState(initialStartIndex)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInViewRef = useRef(false)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const draggedRecentlyRef = useRef(false)
  const isReorganizingRef = useRef(isReorganizing)
  const prevProjectsRef = useRef(projects)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: canLoop,
    startIndex: initialStartIndex,
    dragFree: false,
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
    if (!emblaApi || !canLoop || reducedMotion || isReorganizingRef.current) return
    if (!isInViewRef.current || isHoveredRef.current || isDraggingRef.current) return
    if (typeof document !== "undefined" && document.hidden) return

    autoplayTimerRef.current = setTimeout(() => {
      autoplayTimerRef.current = null
      if (
        !emblaApi ||
        isReorganizingRef.current ||
        !isInViewRef.current ||
        isHoveredRef.current ||
        isDraggingRef.current
      ) {
        return
      }
      if (typeof document !== "undefined" && document.hidden) return
      emblaApi.scrollNext()
    }, DESKTOP_AUTOPLAY_MS)
  }, [clearAutoplay, emblaApi, canLoop, reducedMotion])

  // Mantém autoplay pausado enquanto a reorganização estiver em andamento e inicia após assentar
  useEffect(() => {
    isReorganizingRef.current = isReorganizing
    if (isReorganizing) {
      clearAutoplay()
    } else {
      scheduleAutoplay()
    }
  }, [isReorganizing, clearAutoplay, scheduleAutoplay])

  const syncSelection = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // IntersectionObserver para autoplay apenas quando visível
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
      { threshold: 0.25 },
    )

    observer.observe(root)

    const handleVisibility = () => {
      if (document.hidden) clearAutoplay()
      else scheduleAutoplay()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      clearAutoplay()
    }
  }, [scheduleAutoplay, clearAutoplay])

  // Listeners Embla (seleção, arraste e autoplay por inatividade)
  useEffect(() => {
    if (!emblaApi) return

    const handlePointerDown = () => {
      isDraggingRef.current = true
      draggedRecentlyRef.current = false
      clearAutoplay()
    }

    const handleScroll = () => {
      if (isDraggingRef.current) {
        draggedRecentlyRef.current = true
        clearAutoplay()
      }
    }

    const handlePointerUp = () => {
      isDraggingRef.current = false
      scheduleAutoplay()
      setTimeout(() => {
        draggedRecentlyRef.current = false
      }, 120)
    }

    const handleSettle = () => {
      isDraggingRef.current = false
      scheduleAutoplay()
    }

    syncSelection()
    scheduleAutoplay()

    emblaApi.on("select", syncSelection)
    emblaApi.on("reInit", syncSelection)
    emblaApi.on("pointerDown", handlePointerDown)
    emblaApi.on("scroll", handleScroll)
    emblaApi.on("pointerUp", handlePointerUp)
    emblaApi.on("settle", handleSettle)

    return () => {
      emblaApi.off("select", syncSelection)
      emblaApi.off("reInit", syncSelection)
      emblaApi.off("pointerDown", handlePointerDown)
      emblaApi.off("scroll", handleScroll)
      emblaApi.off("pointerUp", handlePointerUp)
      emblaApi.off("settle", handleSettle)
      clearAutoplay()
    }
  }, [emblaApi, syncSelection, scheduleAutoplay, clearAutoplay])

  // Re-inicializa apenas quando a lista filtrada mudar (evita reInit redundante no 1º frame do morph)
  useEffect(() => {
    if (prevProjectsRef.current === projects) return
    prevProjectsRef.current = projects

    if (!emblaApi) return
    const nextStart = projects.length >= 3 ? 1 : 0
    clearAutoplay()
    emblaApi.reInit({
      align: "center",
      loop: projects.length > 1,
      startIndex: nextStart,
      dragFree: false,
      skipSnaps: false,
    })
    emblaApi.scrollTo(nextStart, true)
    setSelectedIndex(nextStart)
    scheduleAutoplay()
  }, [emblaApi, projects, clearAutoplay, scheduleAutoplay])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi || isReorganizingRef.current) return
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      clearAutoplay()
      emblaApi.scrollPrev()
      scheduleAutoplay()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      clearAutoplay()
      emblaApi.scrollNext()
      scheduleAutoplay()
    }
  }

  const dashCount = Math.min(3, total)
  const safeIndex = Math.min(selectedIndex, Math.max(0, total - 1))

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        isHoveredRef.current = true
        clearAutoplay()
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
        scheduleAutoplay()
      }}
      className="w-full focus-visible:outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={`Carrossel de projetos em produção (${total} projetos)`}
    >
      {/* Palco full-bleed com overflow-y-visible para não cortar os cards durante o voo vertical do morph */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div
          ref={emblaRef}
          className={cn(
            "overflow-x-clip overflow-y-visible cursor-grab active:cursor-grabbing select-none",
            isReorganizing && "pointer-events-none",
          )}
        >
          <div className="flex items-stretch">
            {projects.map((project, index) => {
              const isFromInitialBento = index < DESKTOP_BENTO_BATCH_SIZE
              const layoutTransition = getCardLayoutTransition(index, reducedMotion)
              const extraIndex = Math.max(0, index - DESKTOP_BENTO_BATCH_SIZE)
              const extraDelay = reducedMotion
                ? 0
                : 0.32 + Math.min(extraIndex * 0.06, 0.24)

              return (
                <div
                  key={project.slug}
                  className="shrink-0 px-2.5 w-[30vw] min-w-[360px] max-w-[440px]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${total}: ${project.name}`}
                >
                  <motion.article
                    layout={!reducedMotion}
                    layoutId={
                      reducedMotion ? undefined : `desktop-project-${project.slug}`
                    }
                    style={{ borderRadius: 12 }}
                    initial={
                      isFromInitialBento || reducedMotion
                        ? false
                        : { opacity: 0, scale: 0.94, y: 12 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reducedMotion
                        ? { opacity: 0, transition: { duration: 0.01 } }
                        : {
                            opacity: 0,
                            scale: 0.94,
                            transition: { duration: 0.24, ease: CARD_EASE },
                          }
                    }
                    transition={
                      reducedMotion
                        ? { duration: 0.01 }
                        : {
                            layout: layoutTransition,
                            opacity: {
                              duration: 0.5,
                              delay: extraDelay,
                              ease: CARD_EASE,
                            },
                            scale: {
                              duration: 0.55,
                              delay: extraDelay,
                              ease: CARD_EASE,
                            },
                            y: {
                              duration: 0.55,
                              delay: extraDelay,
                              ease: CARD_EASE,
                            },
                          }
                    }
                    className="relative z-10 h-[380px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#111113] transition-[border-color] duration-300 hover:border-red-500/50 focus-within:border-red-500/60"
                  >
                    <DesktopProjectCardContent
                      project={project}
                      eager={index < 4}
                      layoutTransition={layoutTransition}
                      reducedMotion={reducedMotion}
                      onHoverStateChange={onHoverStateChange}
                      arrowAlwaysRed
                      onLinkClick={(e) => {
                        if (draggedRecentlyRef.current) {
                          e.preventDefault()
                        }
                      }}
                    />
                  </motion.article>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Controles inferiores centralizados entrando suavemente enquanto os cards pousam */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0.01 }
            : { duration: 0.45, delay: 0.35, ease: CARD_EASE }
        }
        className="mt-8 flex flex-col items-center gap-5"
      >
        {total > 1 && (
          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => {
                clearAutoplay()
                emblaApi?.scrollPrev()
                scheduleAutoplay()
              }}
              aria-label="Projeto anterior"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#111113] text-white/80 transition-colors duration-200 hover:border-red-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div aria-hidden="true" className="flex items-center gap-2">
              {Array.from({ length: dashCount }).map((_, dashIndex) => {
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

            <button
              type="button"
              onClick={() => {
                clearAutoplay()
                emblaApi?.scrollNext()
                scheduleAutoplay()
              }}
              aria-label="Próximo projeto"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#111113] text-white/80 transition-colors duration-200 hover:border-red-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onBackToGrid}
          className="group relative inline-flex cursor-pointer items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] py-1 pr-1 pl-5 transition-all duration-300 hover:border-[#c72c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-right scale-x-0 rounded-full bg-[#c72c3b] transition-transform duration-300 group-hover:scale-x-100"
          />
          <span className="relative z-10 pr-3 font-sans text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors duration-300">
            Voltar para grade
          </span>
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-black/20">
            <LayoutGrid className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:scale-95" />
          </span>
        </button>
      </motion.div>
    </div>
  )
}

interface DesktopBentoGridProps {
  projects: readonly Project[]
  viewMode: DesktopProjectsViewMode
  onChangeViewMode: (mode: DesktopProjectsViewMode) => void
  onHoverStateChange?: (isHovered: boolean) => void
  reducedMotion?: boolean
}

export function DesktopBentoGrid({
  projects,
  viewMode,
  onChangeViewMode,
  onHoverStateChange,
  reducedMotion = false,
}: DesktopBentoGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const shouldCenterOnModeChangeRef = useRef(false)
  const reorganizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasMountedRef = useRef(false)

  const [isReorganizing, setIsReorganizing] = useState(false)

  const hasMoreThanBatch = projects.length > DESKTOP_BENTO_BATCH_SIZE
  const effectiveMode: DesktopProjectsViewMode =
    viewMode === "carousel" && hasMoreThanBatch ? "carousel" : "bento"

  const bentoProjects = projects.slice(0, DESKTOP_BENTO_BATCH_SIZE)

  const triggerReorganizingGuard = useCallback(() => {
    if (reorganizeTimerRef.current !== null) {
      clearTimeout(reorganizeTimerRef.current)
      reorganizeTimerRef.current = null
    }
    if (reducedMotion) {
      setIsReorganizing(false)
      return
    }
    setIsReorganizing(true)
    reorganizeTimerRef.current = setTimeout(() => {
      reorganizeTimerRef.current = null
      setIsReorganizing(false)
    }, REORGANIZE_SETTLE_MS)
  }, [reducedMotion])

  useEffect(() => {
    return () => {
      if (reorganizeTimerRef.current !== null) {
        clearTimeout(reorganizeTimerRef.current)
      }
    }
  }, [])

  // Ativa proteção contra hover/clique acidental durante a reorganização de filtro ou modo
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    onHoverStateChange?.(false)
    triggerReorganizingGuard()
  }, [effectiveMode, projects, onHoverStateChange, triggerReorganizingGuard])

  const handleSwitchMode = useCallback(
    (nextMode: DesktopProjectsViewMode) => {
      onHoverStateChange?.(false)
      shouldCenterOnModeChangeRef.current = true
      onChangeViewMode(nextMode)
    },
    [onChangeViewMode, onHoverStateChange],
  )

  useEffect(() => {
    if (!shouldCenterOnModeChangeRef.current) return
    shouldCenterOnModeChangeRef.current = false

    let raf1 = 0
    let raf2 = 0

    // Aguarda 2 frames para o FLIP medir em scrollY constante e o novo layout assentar sua altura final
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        scrollToElementCenter(containerRef.current, {
          duration: 0.95,
          easing: MORPH_CAMERA_EASING,
          immediate: reducedMotion,
        })
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [effectiveMode, reducedMotion])

  return (
    <LayoutGroup id="desktop-projects-morph">
      <div ref={containerRef} id="projects-list" className="w-full">
        {effectiveMode === "bento" ? (
          <>
            <div
              role="list"
              aria-label={`Projetos em produção (${bentoProjects.length} de ${projects.length} exibidos)`}
              className={cn(
                "grid grid-cols-12 auto-rows-[220px] xl:auto-rows-[250px] gap-4 grid-flow-dense",
                isReorganizing && "pointer-events-none",
              )}
            >
              <AnimatePresence mode="popLayout">
                {bentoProjects.map((project, index) => (
                  <BentoCardItem
                    key={project.slug}
                    project={project}
                    index={index}
                    spanClass={getCardSpanClass(index, bentoProjects.length)}
                    reducedMotion={reducedMotion}
                    onHoverStateChange={onHoverStateChange}
                  />
                ))}
              </AnimatePresence>
            </div>

            {hasMoreThanBatch && (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { duration: 0.45, delay: 0.25, ease: CARD_EASE }
                }
                className="mt-8 flex justify-center"
              >
                <button
                  type="button"
                  onClick={() => handleSwitchMode("carousel")}
                  className="group relative inline-flex cursor-pointer items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] py-1 pr-1 pl-5 transition-all duration-300 hover:border-[#c72c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-right scale-x-0 rounded-full bg-[#c72c3b] transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <span className="relative z-10 pr-3 font-sans text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors duration-300">
                    Ver todos os projetos
                  </span>
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-black/20">
                    <Plus className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:rotate-90" />
                  </span>
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <DesktopProjectsCarousel
            projects={projects}
            isReorganizing={isReorganizing}
            onBackToGrid={() => handleSwitchMode("bento")}
            onHoverStateChange={onHoverStateChange}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
    </LayoutGroup>
  )
}
