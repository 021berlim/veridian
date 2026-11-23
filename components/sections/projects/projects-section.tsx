"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Container } from "@/components/layout/container"
import { usePrefersReducedMotion } from "@/lib/motion"
import {
  projects as allProjects,
  type Project,
  type ProjectCategory,
  CATEGORY_LABELS,
} from "@/data/projects"
import { FilterTabs } from "./filter-tabs"
import { ProjectIndex } from "./project-index"
import { CustomCursor } from "./custom-cursor"
import { MobilePosterDeck } from "./mobile-poster-deck"

import { ProjectPreviewGrid } from "@/components/projects/case/stage/ProjectPreviewGrid"

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

  // Projeto ativo para preview (desktop)
  const [activeProject, setActiveProject] = useState<Project>(filteredProjects[0] || allProjects[0])

  // Quando o filtro muda, reseta o projeto ativo para o primeiro da lista
  useEffect(() => {
    if (filteredProjects.length > 0) {
      setActiveProject(filteredProjects[0])
    }
  }, [filteredProjects])

  return (
    <section
      ref={sectionRef}
      id="projetos"
      className="zuse-m-projects relative border-b border-[#2b2d31] bg-[#0b0b0d] text-white py-12 md:py-0 md:h-[calc(100dvh-var(--header-h,5.75rem))] md:max-h-[calc(100dvh-var(--header-h,5.75rem))] flex flex-col justify-center overflow-x-clip md:overflow-hidden"
      aria-label="Projetos em Produção"
    >
      {/* Custom Cursor no Desktop */}
      <CustomCursor
        containerRef={sectionRef}
        hoveredProject={isCursorHovered}
        reducedMotion={reducedMotion}
      />

      <Container className="h-auto md:h-full flex flex-col justify-between pt-4 md:pt-6 pb-4 md:pb-6 min-h-0">
        {/* Cabeçalho da Seção + FilterTabs */}
        <div className="shrink-0 mb-2 md:mb-3 max-w-4xl">
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

          {/* FilterTabs: Todos / Software / Suporte / Segurança / IA */}
          <div className="mt-2 md:mt-2.5">
            <FilterTabs
              availableCategories={availableCategories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>
        </div>

        {/* LAYOUT DUPLA COLUNA EQUILIBRADA 50/50 (DESKTOP ≥768px):
            Coluna 1 (50% - md:col-span-6): ProjectIndex com títulos grandes e visibilidade de 4 projetos
            Coluna 2 (50% - md:col-span-6): Palco 3D com zoom aproximado + Descrição técnica ampliada
        */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8 lg:gap-12 items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Coluna 1 (50% / col-span-6): ProjectIndex (Lista com altura flexível correspondendo a 4 projetos) */}
          <div className="md:col-span-6 h-full min-h-0 flex flex-col justify-start">
            <ProjectIndex
              projects={filteredProjects}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              onHoverStateChange={setIsCursorHovered}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Coluna 2 (50% / col-span-6): Sem cards, sem sombras - Mesma altura (h-full) de ponta a ponta */}
          <div className="md:col-span-6 h-full min-h-0 flex flex-col justify-between border-t border-b border-[#2b2d31]/60">
            {/* Topo: Grade de Mídia (1 destaque superior + até 3 na grade inferior) com a MESMA LARGURA da linha acima */}
            <div className="relative w-full flex-1 min-h-0 py-2 sm:py-2.5 flex flex-col justify-between overflow-hidden">
              {isDesktop && activeProject && (
                <ProjectPreviewGrid
                  key={activeProject.slug}
                  screens={activeProject.screens}
                  media={activeProject.media}
                  alt={`Interface do sistema ${activeProject.name}`}
                />
              )}
            </div>

            {/* Base: Descrição Técnica e Metadados do Projeto Alinhados */}
            <div className="border-t border-[#2b2d31]/50 pt-2.5 pb-1 flex flex-col justify-between shrink-0 min-h-[145px] lg:min-h-[155px]">
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={activeProject.slug}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between h-full"
                  >
                    {/* Header de Telemetria: Categoria + Ano */}
                    <div className="flex items-center justify-between font-mono text-xs text-[#8a8f98]">
                      <span className="text-[#c72c3b] uppercase tracking-wider font-medium">
                        PROJECT // {CATEGORY_LABELS[activeProject.category]}
                      </span>
                      <span>{activeProject.year || "2025"}</span>
                    </div>

                    {/* Título + Tagline + Solução/Contexto */}
                    <div className="space-y-0.5">
                      <h3 className="font-sans text-xl lg:text-2xl font-light tracking-[-0.02em] text-white">
                        {activeProject.name}
                      </h3>
                      <p className="text-sm text-[#e5e7eb] font-normal leading-relaxed line-clamp-1">
                        {activeProject.tagline}
                      </p>
                      {(activeProject.solution || activeProject.context) && (
                        <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed line-clamp-2">
                          {activeProject.solution || activeProject.context}
                        </p>
                      )}
                    </div>

                    {/* Rodapé: Stack Tecnológica (Sem o botão "Ver case completo") */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2b2d31]/40">
                      <div className="font-mono text-xs text-[#8a8f98] leading-relaxed">
                        <span className="text-[#c72c3b] mr-2">TECH //</span>
                        <span className="text-[#8a8f98]">{activeProject.stack.join(" / ")}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* STICKY STACKING POSTER DECK MOBILE (<768px) */}
        <div className="block md:hidden">
          {!isDesktop && (
            <MobilePosterDeck key={activeCategory} projects={filteredProjects} />
          )}
        </div>
      </Container>
    </section>
  )
}
