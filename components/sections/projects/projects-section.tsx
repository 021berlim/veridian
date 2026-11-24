"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Container } from "@/components/layout/container"
import { ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion"
import {
  projects as allProjects,
  type ProjectCategory,
} from "@/data/projects"
import { FilterTabs } from "./filter-tabs"
import { CustomCursor } from "./custom-cursor"
import { MobilePosterDeck } from "./mobile-poster-deck"
import {
  DesktopBentoGrid,
  DESKTOP_BENTO_BATCH_SIZE,
} from "./desktop-bento-grid"

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isSectionInView = useInView(sectionRef, { once: false, margin: "200px" })
  const reducedMotion = usePrefersReducedMotion()

  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all")
  const [visibleCount, setVisibleCount] = useState(DESKTOP_BENTO_BATCH_SIZE)
  const [isCursorHovered, setIsCursorHovered] = useState(false)

  // Apenas categorias que possuem pelo menos 1 projeto
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<ProjectCategory>()
    allProjects.forEach((p) => categoriesSet.add(p.category))
    return Array.from(categoriesSet)
  }, [])

  // Projetos filtrados
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return allProjects
    return allProjects.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  // Ao trocar filtro, reseta o lote visível para o primeiro bloco
  const handleSelectCategory = (category: ProjectCategory | "all") => {
    setActiveCategory(category)
    setVisibleCount(DESKTOP_BENTO_BATCH_SIZE)
  }

  // Projetos visíveis no mosaico desktop (lotes equilibrados)
  const visibleDesktopProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount],
  )

  const remainingDesktopCount = Math.max(
    0,
    filteredProjects.length - visibleDesktopProjects.length,
  )

  // Recalcula ScrollTriggers abaixo (ex.: ProcessSection) sempre que a altura de #projetos mudar
  // (ex.: montagem do MobilePosterDeck após hidratação, troca de filtro, carregar mais ou resize)
  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof ResizeObserver === "undefined") return

    let lastHeight = Math.round(section.getBoundingClientRect().height)
    let rafId: number | null = null

    const scheduleRefresh = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        rafId = null
        ScrollTrigger.refresh()
      })
    }

    const observer = new ResizeObserver(() => {
      const nextHeight = Math.round(section.getBoundingClientRect().height)
      if (Math.abs(nextHeight - lastHeight) > 1) {
        lastHeight = nextHeight
        scheduleRefresh()
      }
    })

    observer.observe(section)

    return () => {
      observer.disconnect()
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projetos"
      className="zuse-m-projects relative border-b border-[#2b2d31] bg-[#0b0b0d] text-white py-12 md:pt-28 md:pb-16 lg:pb-20 flex flex-col justify-center overflow-x-clip"
      aria-label="Projetos em Produção"
    >
      {/* Custom Cursor no Desktop */}
      <CustomCursor
        containerRef={sectionRef}
        hoveredProject={isCursorHovered}
        reducedMotion={reducedMotion}
      />

      <Container className="h-auto flex flex-col justify-between pt-4 md:pt-0 pb-4 md:pb-0 min-h-0">
        {/* Cabeçalho da Seção + FilterTabs (empilhado no mobile; linha única no desktop) */}
        <div className="shrink-0 mb-2 md:mb-8 max-w-4xl md:max-w-none md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <div className="overflow-hidden py-0.5">
              <motion.h2
                initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                animate={
                  isSectionInView
                    ? { y: "0%", opacity: 1 }
                    : { y: "100%", opacity: 0 }
                }
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="zuse-m-projects-h2 font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-[-0.03em] text-white whitespace-nowrap"
              >
                Projetos que já estão em produção.
              </motion.h2>
            </div>

            <div className="overflow-hidden mt-1 py-0.5">
              <motion.p
                initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                animate={
                  isSectionInView
                    ? { y: "0%", opacity: 1 }
                    : { y: "100%", opacity: 0 }
                }
                transition={{
                  duration: 0.7,
                  delay: reducedMotion ? 0 : 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-xs sm:text-sm text-[#8a8f98] font-normal"
              >
                Sistemas reais, construídos sob medida.
              </motion.p>
            </div>
          </div>

          {/* FilterTabs: Todos / Software / Suporte / Segurança / IA */}
          <div className="mt-2 md:mt-0 md:shrink-0">
            <FilterTabs
              availableCategories={availableCategories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* MOSAICO ASSIMÉTRICO ESCALÁVEL — BENTO GRID DESKTOP (≥768px) */}
        <div className="hidden md:block">
          {isDesktop && (
            <DesktopBentoGrid
              projects={visibleDesktopProjects}
              totalCount={filteredProjects.length}
              hasMore={remainingDesktopCount > 0}
              remainingCount={remainingDesktopCount}
              onLoadMore={() =>
                setVisibleCount((prev) => prev + DESKTOP_BENTO_BATCH_SIZE)
              }
              onHoverStateChange={setIsCursorHovered}
              reducedMotion={reducedMotion}
            />
          )}
        </div>

        {/* STICKY STACKING POSTER DECK MOBILE (<768px) — INALTERADO */}
        <div className="block md:hidden">
          {!isDesktop && (
            <MobilePosterDeck key={activeCategory} projects={filteredProjects} />
          )}
        </div>
      </Container>
    </section>
  )
}
