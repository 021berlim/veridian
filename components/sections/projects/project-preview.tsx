"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import type { Project } from "@/data/projects"

interface ProjectPreviewProps {
  project: Project
  onHoverStateChange?: (isHovered: boolean) => void
  reducedMotion?: boolean
  isFirst?: boolean
}

export function ProjectPreview({
  project,
  onHoverStateChange,
  reducedMotion = false,
  isFirst = false,
}: ProjectPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax leve seguindo o ponteiro (translate/scale ≤ 4%)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 120, damping: 20 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const translateX = useTransform(smoothX, [-0.5, 0.5], ["-3%", "3%"])
  const translateY = useTransform(smoothY, [-0.5, 0.5], ["-3%", "3%"])

  useEffect(() => {
    if (reducedMotion) return
    const el = containerRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouseX.set(x)
      mouseY.set(y)
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
      onHoverStateChange?.(false)
    }

    const handleMouseEnter = () => {
      onHoverStateChange?.(true)
    }

    el.addEventListener("mousemove", handleMouseMove, { passive: true })
    el.addEventListener("mouseleave", handleMouseLeave)
    el.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
      el.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [mouseX, mouseY, onHoverStateChange, reducedMotion])

  return (
    <div
      ref={containerRef}
      className="sticky top-28 hidden md:flex flex-col justify-between w-full"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Mockup Interativo com transição de clip-path e parallax */}
      <Link
        href={`/projetos/${project.slug}`}
        className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#111215] shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
      >
        <motion.div
          style={{
            x: reducedMotion ? 0 : translateX,
            y: reducedMotion ? 0 : translateY,
          }}
          className="relative h-full w-full"
        >
          {/* Barra de controle / browser mockup */}
          <div className="absolute top-0 left-0 right-0 z-20 flex h-9 items-center justify-between border-b border-white/5 bg-[#141518]/90 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2b2d31]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2b2d31]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2b2d31]" />
            </div>

            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
              {project.category} // {project.year || "2025"}
            </span>

            <div className="w-10" />
          </div>

          {/* Troca de projeto com clip-path inset(0 0 100% 0) -> inset(0) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { clipPath: "inset(0 0 100% 0)", opacity: 0.8 }
              }
              animate={
                reducedMotion
                  ? { opacity: 1, transition: { duration: 0.15 } }
                  : {
                      clipPath: "inset(0 0 0% 0)",
                      opacity: 1,
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    }
              }
              exit={
                reducedMotion
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : {
                      clipPath: "inset(100% 0 0% 0)",
                      opacity: 0.4,
                      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    }
              }
              className="absolute inset-0 h-full w-full"
            >
              <Image
                src={project.screens.laptop.src}
                alt={`Interface do projeto ${project.name}`}
                width={1200}
                height={800}
                priority={isFirst}
                loading={isFirst ? "eager" : "lazy"}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Link>

      {/* Descrição e Stack abaixo do Mockup */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Reveal por linha da tagline */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={project.slug}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { y: "100%", opacity: 0 }
              }
              animate={
                reducedMotion
                  ? { opacity: 1, transition: { duration: 0.15 } }
                  : {
                      y: "0%",
                      opacity: 1,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    }
              }
              exit={
                reducedMotion
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : {
                      y: "-100%",
                      opacity: 0,
                      transition: { duration: 0.3 },
                    }
              }
              className="text-sm font-normal leading-relaxed text-[#8a8f98]"
            >
              {project.tagline}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Stack em texto mono separada por "/" (sem pílulas) */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-xs text-[#6b7280]"
            >
              <span className="text-[#c72c3b] mr-2">TECH //</span>
              <span>{project.stack.join(" / ")}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
