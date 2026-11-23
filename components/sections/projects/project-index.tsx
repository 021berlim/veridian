"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"

interface ProjectIndexProps {
  projects: readonly Project[]
  activeProject: Project
  onSelectProject: (project: Project) => void
  onHoverStateChange?: (isHovered: boolean) => void
  reducedMotion?: boolean
}

export function ProjectIndex({
  projects,
  activeProject,
  onSelectProject,
  onHoverStateChange,
  reducedMotion = false,
}: ProjectIndexProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const userHasScrolledRef = useRef(false)
  const isAnimatingPeekRef = useRef(false)

  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const hasOverflow = projects.length > 4

  const updateScrollEdges = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (!isAnimatingPeekRef.current && scrollTop > 4) {
      userHasScrolledRef.current = true
    }
    setCanScrollUp(scrollTop > 6)
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6)
  }, [])

  useEffect(() => {
    updateScrollEdges()
    const el = listRef.current
    if (!el) return

    const ro = new ResizeObserver(updateScrollEdges)
    ro.observe(el)
    return () => ro.disconnect()
  }, [projects.length, updateScrollEdges])

  // Micro-nudge ("peek") recorrente (a cada 4.5s) enquanto visível, até o usuário rolar a lista
  useEffect(() => {
    if (!hasOverflow || reducedMotion) return
    const el = listRef.current
    if (!el) return

    let rafId = 0
    let initialTimeoutId = 0
    let intervalId = 0
    let isVisible = false
    let cancelled = false

    const stopPeeks = () => {
      userHasScrolledRef.current = true
      cancelled = true
      isAnimatingPeekRef.current = false
      cancelAnimationFrame(rafId)
      window.clearTimeout(initialTimeoutId)
      window.clearInterval(intervalId)
    }

    const runPeek = () => {
      if (cancelled || userHasScrolledRef.current || !isVisible || isAnimatingPeekRef.current) {
        return
      }
      if (el.scrollTop > 2 || el.scrollHeight <= el.clientHeight + 8) return

      isAnimatingPeekRef.current = true
      const distance = Math.min(32, el.scrollHeight - el.clientHeight)
      const duration = 1000
      const start = performance.now()

      const tick = (now: number) => {
        if (cancelled || userHasScrolledRef.current) {
          isAnimatingPeekRef.current = false
          return
        }
        const t = Math.min(1, (now - start) / duration)
        const wave = Math.sin(t * Math.PI)
        const eased = wave * wave
        el.scrollTop = Math.round(distance * eased)

        if (t < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          el.scrollTop = 0
          isAnimatingPeekRef.current = false
          updateScrollEdges()
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = Boolean(entries[0]?.isIntersecting)
        if (isVisible && !userHasScrolledRef.current && !initialTimeoutId) {
          initialTimeoutId = window.setTimeout(() => {
            runPeek()
            intervalId = window.setInterval(runPeek, 4500)
          }, 800)
        }
      },
      { threshold: 0.45 },
    )

    observer.observe(el)
    el.addEventListener("wheel", stopPeeks, { passive: true })
    el.addEventListener("pointerdown", stopPeeks, { passive: true })
    el.addEventListener("touchstart", stopPeeks, { passive: true })

    return () => {
      cancelled = true
      isAnimatingPeekRef.current = false
      cancelAnimationFrame(rafId)
      window.clearTimeout(initialTimeoutId)
      window.clearInterval(intervalId)
      observer.disconnect()
      el.removeEventListener("wheel", stopPeeks)
      el.removeEventListener("pointerdown", stopPeeks)
      el.removeEventListener("touchstart", stopPeeks)
    }
  }, [hasOverflow, reducedMotion, updateScrollEdges])

  // Teclado: ↑/↓ navega entre projetos
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = (index + 1) % projects.length
      onSelectProject(projects[nextIndex])
      itemRefs.current[nextIndex]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = (index - 1 + projects.length) % projects.length
      onSelectProject(projects[prevIndex])
      itemRefs.current[prevIndex]?.focus()
    }
  }

  const handleScrollDownHint = () => {
    const el = listRef.current
    if (!el) return
    el.scrollBy({ top: Math.round(el.clientHeight * 0.45), behavior: "smooth" })
  }

  return (
    <div className="relative h-full w-full min-h-0">
      {/* Fade superior quando já houve rolagem para baixo */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[#0b0b0d] to-transparent transition-opacity duration-300",
          canScrollUp ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={listRef}
        id="projects-list"
        role="list"
        aria-label="Lista de projetos"
        onScroll={updateScrollEdges}
        data-lenis-prevent={hasOverflow ? true : undefined}
        onWheel={hasOverflow ? (e) => e.stopPropagation() : undefined}
        className={cn(
          "h-full w-full min-h-0 divide-y divide-[#2b2d31]/50 border-t border-b border-[#2b2d31]/60",
          hasOverflow
            ? "overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex flex-col overflow-hidden",
        )}
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            const isActive = project.slug === activeProject.slug
            const formattedIndex = String(index + 1).padStart(2, "0")

            return (
              <motion.div
                layout={!reducedMotion}
                key={project.slug}
                className={cn(
                  "w-full",
                  hasOverflow
                    ? "h-[22%] shrink-0 min-h-[76px]"
                    : projects.length === 4
                      ? "min-h-0 flex-1"
                      : "h-[25%] shrink-0 min-h-[80px]",
                )}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: reducedMotion ? 0.15 : 0.7,
                    delay: reducedMotion ? 0 : index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -16, transition: { duration: 0.25 } }
                }
              >
                <Link
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  href={`/projetos/${project.slug}`}
                  id={`project-${project.slug}`}
                  onMouseEnter={() => {
                    onSelectProject(project)
                    onHoverStateChange?.(true)
                  }}
                  onMouseLeave={() => {
                    onHoverStateChange?.(false)
                  }}
                  onFocus={() => onSelectProject(project)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={cn(
                    "group relative flex h-full w-full cursor-pointer items-center justify-between px-3 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b] sm:px-4",
                    isActive ? "opacity-100" : "opacity-35 hover:opacity-85",
                  )}
                >
                  {/* Indicador de foco / hover sutil na borda esquerda */}
                  <div
                    className={cn(
                      "absolute top-0 bottom-0 left-0 w-[2px] origin-top bg-[#c72c3b] transition-transform duration-300",
                      isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-75",
                    )}
                  />

                  <div className="flex items-baseline gap-4 pr-2 pl-3 sm:gap-6 sm:pl-4">
                    <span
                      className={cn(
                        "font-mono text-sm font-normal transition-colors duration-300 sm:text-base",
                        isActive ? "text-[#c72c3b]" : "text-[#4b5563] group-hover:text-[#8a8f98]",
                      )}
                    >
                      {formattedIndex}
                    </span>

                    <div className="flex flex-col items-start gap-1">
                      <h3 className="font-sans text-xl font-light tracking-[-0.02em] text-white transition-colors sm:text-2xl lg:text-3xl">
                        {project.name}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]/80 sm:text-xs">
                        / {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center pr-2 text-[#8a8f98] transition-colors group-hover:text-white">
                    <ArrowUpRight
                      className={cn(
                        "h-5 w-5 transition-transform duration-300 ease-out sm:h-6 sm:w-6",
                        isActive
                          ? "translate-x-0.5 -translate-y-0.5 text-[#c72c3b]"
                          : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white",
                      )}
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Fade inferior + seta sutil pulsante indicando mais projetos abaixo */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-14 items-end justify-center bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/80 to-transparent pb-2 transition-opacity duration-300",
          hasOverflow && canScrollDown ? "opacity-100" : "opacity-0",
        )}
      >
        <motion.button
          type="button"
          onClick={handleScrollDownHint}
          aria-label="Rolar para ver mais projetos"
          animate={reducedMotion ? undefined : { y: [0, 3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#141416]/90 text-[#8a8f98] transition-colors hover:border-[#c72c3b] hover:text-white",
            hasOverflow && canScrollDown ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </div>
  )
}
