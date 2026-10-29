"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { usePrefersReducedMotion } from "@/lib/motion"
import type { Project } from "@/data/projects"
import { CATEGORY_SERVICE_MAP } from "@/data/projects"

interface CaseContentProps {
  project: Project
}

export function CaseContent({ project }: CaseContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-10%" })
  const reducedMotion = usePrefersReducedMotion()

  const serviceName = CATEGORY_SERVICE_MAP[project.category] || project.category

  const handleCtaClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("zuse-select-interest", { detail: serviceName }),
      )
    }
  }

  const sections = [
    { title: "01 // CONTEXTO", text: project.context },
    { title: "02 // DESAFIO", text: project.challenge },
    { title: "03 // SOLUÇÃO TÉCNICA", text: project.solution },
    ...(project.result
      ? [{ title: "04 // RESULTADOS OBTIDOS", text: project.result }]
      : []),
  ]

  return (
    <div ref={containerRef} className="my-16 md:my-24">
      {/* Linha Fina Superior */}
      <div className="relative mb-14 h-[1px] w-full bg-[#2b2d31]/40 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-gradient-to-r from-[#c72c3b] via-[#2b2d31] to-transparent origin-left"
        />
      </div>

      {/* Grid de 2 Colunas Editorial */}
      <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-16">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 24 }
            }
            transition={{
              duration: reducedMotion ? 0.15 : 0.7,
              delay: reducedMotion ? 0 : idx * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[#c72c3b] block mb-3">
              {section.title}
            </span>
            <p className="font-sans text-base sm:text-lg leading-relaxed text-[#c4c7cc] font-light">
              {section.text}
            </p>
          </motion.div>
        ))}

        {/* Stack Tecnológica */}
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 24 }
          }
          transition={{
            duration: reducedMotion ? 0.15 : 0.7,
            delay: reducedMotion ? 0 : sections.length * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col md:col-span-2 pt-6 border-t border-[#2b2d31]/50"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-[#c72c3b] block mb-3">
            05 // STACK & ARQUITETURA
          </span>
          <p className="font-mono text-sm sm:text-base tracking-wide text-[#8a8f98] leading-loose">
            {project.stack.join(" / ")}
          </p>
        </motion.div>
      </div>

      {/* CTA: Quero algo assim */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
        }
        transition={{
          duration: reducedMotion ? 0.15 : 0.7,
          delay: reducedMotion ? 0 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-16 pt-12 border-t border-[#2b2d31]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div>
          <h3 className="font-sans text-2xl sm:text-3xl font-light text-white">
            Precisa de uma solução sob medida?
          </h3>
          <p className="mt-2 text-sm text-[#8a8f98]">
            Projetamos e compilamos sistemas robustos para o seu modelo operacional.
          </p>
        </div>

        <Link
          href={`/#contato?area=${project.category}`}
          onClick={handleCtaClick}
          className="group inline-flex items-center gap-3 border border-white/20 bg-white px-7 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
        >
          <span>Quero algo assim</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </div>
  )
}
