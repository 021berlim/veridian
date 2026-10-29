"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { usePrefersReducedMotion } from "@/lib/motion"
import { projects as allProjects, type Project, type ProjectCategory } from "@/data/projects"
import { FilterTabs } from "./filter-tabs"
import { ProjectIndex } from "./project-index"
import { ProjectPreview } from "./project-preview"
import { CustomCursor } from "./custom-cursor"

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-10%" })
  const reducedMotion = usePrefersReducedMotion()

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

  return (
    <section
      ref={sectionRef}
      id="projetos"
      className="relative border-b border-[#2b2d31] bg-[#0b0b0d] py-16 md:py-24 text-white overflow-hidden"
      aria-label="Projetos em Produção"
    >
      {/* Custom Cursor no Desktop */}
      <CustomCursor
        containerRef={sectionRef}
        hoveredProject={isCursorHovered}
        reducedMotion={reducedMotion}
      />

      <Container>
        {/* Cabeçalho da Seção com Reveal por Linha (Máscara) */}
        <div className="mb-10 max-w-4xl">
          <div className="overflow-hidden">
            <motion.h2
              initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
              animate={
                isSectionInView
                  ? { y: "0%", opacity: 1 }
                  : { y: "100%", opacity: 0 }
              }
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white"
            >
              Projetos que já estão em produção.
            </motion.h2>
          </div>

          <div className="overflow-hidden mt-3">
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
              className="text-base sm:text-lg text-[#8a8f98] font-normal"
            >
              Sistemas reais, construídos sob medida.
            </motion.p>
          </div>
        </div>

        {/* FilterTabs: Todos / Software / Suporte / Segurança / IA */}
        <div className="mb-10">
          <FilterTabs
            availableCategories={availableCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* LAYOUT DUPLA COLUNA (DESKTOP ≥768px): Coluna Esquerda ~55% / Direita ~45% */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-12 lg:gap-16 items-start">
          {/* Coluna Esquerda (~55%): ProjectIndex */}
          <div className="md:col-span-7">
            <ProjectIndex
              projects={filteredProjects}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              onHoverStateChange={setIsCursorHovered}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Coluna Direita (~45%): ProjectPreview Sticky */}
          <div className="md:col-span-5">
            {activeProject && (
              <ProjectPreview
                project={activeProject}
                onHoverStateChange={setIsCursorHovered}
                reducedMotion={reducedMotion}
                isFirst={true}
              />
            )}
          </div>
        </div>

        {/* CARROSSEL MOBILE (<768px): Scroll-snap horizontal com indicador no padrão do Método */}
        <div className="block md:hidden">
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
                className="w-[85vw] min-w-[280px] shrink-0 snap-start flex flex-col rounded-2xl border border-[#2b2d31]/80 bg-[#111215] p-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]"
              >
                {/* Mockup */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#2b2d31]/60 bg-[#0b0b0d]">
                  <Image
                    src={project.screens.laptop.src}
                    alt={project.name}
                    width={800}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#8a8f98] bg-[#0b0b0d]/90 px-2 py-0.5 rounded border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c72c3b]" />
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 flex items-baseline justify-between">
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

                <p className="mt-2 text-xs leading-relaxed text-[#8a8f98] line-clamp-2">
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

          {/* Indicador de progresso e contador (padrão do Método) */}
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
