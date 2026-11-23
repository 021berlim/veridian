"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { usePrefersReducedMotion } from "@/lib/motion"
import type { Project } from "@/data/projects"

interface MobilePosterDeckProps {
  projects: readonly Project[]
}

interface PosterCardSlotProps {
  project: Project
  index: number
  total: number
  scrollYProgress: MotionValue<number>
  reducedMotion: boolean
}

function PosterCardSlot({
  project,
  index,
  total,
  scrollYProgress,
  reducedMotion,
}: PosterCardSlotProps) {
  const shouldRecede = !reducedMotion && total > 1 && index < total - 1
  const segments = Math.max(1, total - 1)
  const start = shouldRecede ? index / segments : 0
  const end = shouldRecede ? (index + 1) / segments : 1

  const scale = useTransform(scrollYProgress, [start, end], shouldRecede ? [1, 0.95] : [1, 1])
  const dimOpacity = useTransform(scrollYProgress, [start, end], shouldRecede ? [0, 0.36] : [0, 0])

  const posterSrc =
    project.screens.phone?.src ??
    project.screens.laptop?.src ??
    project.media?.find((m) => m.type === "image")?.src ??
    project.media?.[0]?.poster

  return (
    <div
      className="zuse-m-poster-slot"
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <motion.div
        style={{ scale }}
        className="origin-top"
      >
        <Link
          href={`/projetos/${project.slug}`}
          className="zuse-m-poster-card group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]"
        >
          {/* Fundo (100% da superfície) */}
          {posterSrc && (
            <img
              src={posterSrc}
              alt={`Interface do sistema ${project.name}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Camada de contraste */}
          <div className="zuse-m-poster-scrim" aria-hidden="true" />

          {/* Rodapé interno sobre o degradê */}
          <div className="relative z-10 px-5 pb-5 pt-8">
            {/* Linha 1: Número + Título + Ícone */}
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <span className="font-mono text-xs text-[#c72c3b] shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-sans text-2xl font-light tracking-[-0.02em] text-white">
                  {project.name}
                </h3>
              </div>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-[#c72c3b]"
                aria-hidden="true"
              />
            </div>

            {/* Linha 2: Descrição concisa */}
            <p className="mt-2 text-[13px] leading-relaxed text-[#c9cdd4] line-clamp-3">
              {project.tagline}
            </p>

            {/* Divisor sutil */}
            <div className="my-3 h-px w-full bg-white/[0.08]" aria-hidden="true" />

            {/* Linha técnica */}
            <p className="font-mono text-[10px] tracking-wider text-[#9ca3af] truncate pr-14">
              <span className="text-[#c72c3b]">STACK // </span>
              {project.stack.slice(0, 4).join(" / ")}
            </p>
          </div>

          {/* Véu de escurecimento GPU controlado por scroll */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-[#0b0b0d]"
            style={{ opacity: dimOpacity }}
          />
        </Link>
      </motion.div>
    </div>
  )
}

export function MobilePosterDeck({ projects }: MobilePosterDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={deckRef} className="zuse-m-projects-deck">
      {projects.map((project, index) => (
        <PosterCardSlot
          key={project.slug}
          project={project}
          index={index}
          total={projects.length}
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}
