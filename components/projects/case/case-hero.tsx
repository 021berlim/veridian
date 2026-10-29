"use client"

import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/motion"

interface CaseHeroProps {
  title: string
  tagline: string
}

export function CaseHero({ title, tagline }: CaseHeroProps) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="mt-10 mb-8 max-w-4xl">
      {/* Título com reveal por linha (máscara) */}
      <div className="overflow-hidden">
        <motion.h1
          initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.03em] text-white"
        >
          {title}
        </motion.h1>
      </div>

      {/* Subtítulo cinza (tagline) */}
      <div className="overflow-hidden mt-4">
        <motion.p
          initial={reducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-lg sm:text-xl md:text-2xl font-light text-[#8a8f98] leading-relaxed"
        >
          {tagline}
        </motion.p>
      </div>
    </div>
  )
}
