"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
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
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])

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

  const hasOverflow = projects.length > 4

  return (
    <div
      id="projects-list"
      role="list"
      aria-label="Lista de projetos"
      className={cn(
        "w-full h-full min-h-0 divide-y divide-[#2b2d31]/50 border-t border-b border-[#2b2d31]/60",
        hasOverflow
          ? "overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#2b2d31_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2b2d31] hover:[&::-webkit-scrollbar-thumb]:bg-[#c72c3b]"
          : "overflow-hidden flex flex-col",
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
                  ? "h-[25%] shrink-0 min-h-[80px]"
                  : projects.length === 4
                    ? "flex-1 min-h-0"
                    : "h-[25%] shrink-0 min-h-[80px]",
              )}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24 }
              }
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
                  "group relative flex h-full w-full cursor-pointer items-center justify-between px-3 sm:px-4 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]",
                  isActive ? "opacity-100" : "opacity-35 hover:opacity-85",
                )}
              >
                {/* Indicador de foco / hover sutil na borda esquerda */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-[2px] bg-[#c72c3b] transition-transform duration-300 origin-top",
                    isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-75",
                  )}
                />

                <div className="flex items-baseline gap-4 sm:gap-6 pl-3 sm:pl-4 pr-2">
                  {/* Número Mono */}
                  <span
                    className={cn(
                      "font-mono text-xs sm:text-sm font-normal transition-colors duration-300",
                      isActive ? "text-[#c72c3b]" : "text-[#4b5563] group-hover:text-[#8a8f98]",
                    )}
                  >
                    {formattedIndex}
                  </span>

                  {/* Nome do Projeto + Categoria em mono */}
                  <div className="flex flex-col items-start gap-0.5">
                    <h3 className="font-sans text-lg sm:text-xl lg:text-2xl font-light tracking-[-0.02em] text-white transition-colors">
                      {project.name}
                    </h3>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8a8f98]/80">
                      / {project.category}
                    </span>
                  </div>
                </div>

                {/* Seta ↗ animada */}
                <div className="flex items-center pr-2 text-[#8a8f98] transition-colors group-hover:text-white">
                  <ArrowUpRight
                    className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ease-out",
                      isActive
                        ? "text-[#c72c3b] translate-x-0.5 -translate-y-0.5"
                        : "group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                    )}
                  />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
