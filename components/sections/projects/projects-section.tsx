"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
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

const DeviceStage = dynamic(
  () => import("@/components/projects/case/stage/DeviceStage"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[#8a8f98] uppercase tracking-widest">
        Carregando palco 3D...
      </div>
    ),
  },
)

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

  // Mobile scroll-snap tracking
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current
    if (!el || filteredProjects.length === 0) return
    const scrollLeft = el.scrollLeft
    const cardWidth = el.offsetWidth * 0.85
    const index = Math.round(scrollLeft / cardWidth)
    const boundedIndex = Math.max(0, Math.min(index, filteredProjects.length - 1))
    setMobileActiveIndex(boundedIndex)
  }

  const currentMobileProject = filteredProjects[mobileActiveIndex] || filteredProjects[0]

  return (
    <section
      ref={sectionRef}
      id="projetos"
      className="relative border-b border-[#2b2d31] bg-[#0b0b0d] text-white py-12 md:py-0 md:h-[calc(100dvh-var(--header-h,5.75rem))] md:max-h-[calc(100dvh-var(--header-h,5.75rem))] flex flex-col justify-center overflow-hidden"
      aria-label="Projetos em Produção"
    >
      {/* Custom Cursor no Desktop */}
      <CustomCursor
        containerRef={sectionRef}
        hoveredProject={isCursorHovered}
        reducedMotion={reducedMotion}
      />

      <Container className="h-full flex flex-col justify-between pt-4 md:pt-6 pb-4 md:pb-6 min-h-0">
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
              className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-[-0.03em] text-white whitespace-nowrap"
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
            {/* Topo: Palco 3D do Notebook/Celular com flex-1 dinâmico e zoom aproximado */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-visible">
              {isDesktop && activeProject && (
                <DeviceStage
                  key={activeProject.slug}
                  screens={activeProject.screens}
                  defaultDevice={activeProject.defaultDevice}
                  height="100%"
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

                    {/* Rodapé: Stack Tecnológica + CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2b2d31]/40">
                      <div className="font-mono text-xs text-[#8a8f98] leading-relaxed">
                        <span className="text-[#c72c3b] mr-2">TECH //</span>
                        <span className="text-[#8a8f98]">{activeProject.stack.join(" / ")}</span>
                      </div>

                      <Link
                        href={`/projetos/${activeProject.slug}`}
                        className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white hover:text-[#c72c3b] transition-colors"
                      >
                        <span className="underline underline-offset-4 decoration-[#2b2d31] group-hover:decoration-[#c72c3b]">
                          Ver case completo
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[#8a8f98] transition-transform duration-300 group-hover:text-[#c72c3b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CARROSSEL MOBILE (<768px): Aparelho 3D único acima do card ativo com scroll vertical livre */}
        <div className="block md:hidden">
          {/* Palco 3D Mobile Único com Área de Respiro Expandida */}
          <div className="relative w-full h-[420px] flex items-center justify-center mb-6 overflow-visible">
            {!isDesktop && currentMobileProject && (
              <DeviceStage
                screens={currentMobileProject.screens}
                defaultDevice={currentMobileProject.defaultDevice}
                height="100%"
              />
            )}
          </div>

          {/* Lista Horizontal de Cards para Navegação */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory gap-5 pb-4 scrollbar-none"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {filteredProjects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projetos/${project.slug}`}
                className="w-[85vw] min-w-[280px] shrink-0 snap-start flex flex-col rounded-2xl border border-[#2b2d31]/80 bg-[#111215] p-5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]"
              >
                {/* Info */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-[#c72c3b]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-sans text-xl font-normal text-white">
                      {project.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#8a8f98]" />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#8a8f98] line-clamp-2">
                  {project.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-[#2b2d31]/40 font-mono text-[10px] text-[#6b7280]">
                  <span className="text-[#c72c3b] mr-1.5">STACK //</span>
                  {project.stack.slice(0, 3).join(" / ")}
                  {project.stack.length > 3 ? "..." : ""}
                </div>
              </Link>
            ))}
          </div>

          {/* Indicador de progresso e contador */}
          <div className="w-full pt-4">
            <div className="flex items-center justify-between gap-6">
              <div className="relative h-[1px] w-full bg-white/10 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 w-full origin-left bg-[#c72c3b] transition-transform duration-300 ease-out"
                  style={{
                    transform: `scaleX(${
                      filteredProjects.length > 0
                        ? (mobileActiveIndex + 1) / filteredProjects.length
                        : 0
                    })`,
                  }}
                />
              </div>
              <span
                className="shrink-0 font-mono text-sm tracking-wider text-[#8a8f98] select-none"
                aria-live="off"
              >
                {String(mobileActiveIndex + 1).padStart(2, "0")} /{" "}
                {String(filteredProjects.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
