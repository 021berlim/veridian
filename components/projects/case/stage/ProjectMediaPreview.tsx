"use client"

import React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { ProjectScreens, ScreenSource } from "./types"

interface ProjectMediaPreviewProps {
  screens: ProjectScreens
  alt?: string
  className?: string
  priority?: boolean
}

export function ProjectMediaPreview({
  screens,
  alt = "Interface do projeto em produção",
  className = "",
  priority = true,
}: ProjectMediaPreviewProps) {
  // Prioriza laptop para visão desktop ampla; fallback para phone (ex: apps mobile)
  const isMobileOnly = !screens.laptop && Boolean(screens.phone)
  const mediaSource: ScreenSource | undefined = screens.laptop || screens.phone

  if (!mediaSource) return null

  const isVideo = mediaSource.type === "video"

  return (
    <div className={`relative w-full h-full flex items-center justify-center p-1 sm:p-2 overflow-hidden ${className}`}>
      {/* Moldura pura de mídia com cantos arredondados, borda hairline técnica e sem carcaça de mockup */}
      <div
        className={`relative h-full max-h-full overflow-hidden rounded-xl md:rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] shadow-2xl flex items-center justify-center ${
          isMobileOnly ? "aspect-[9/19]" : "w-full aspect-[16/10] max-w-full"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mediaSource.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full overflow-hidden"
          >
            {isVideo ? (
              <video
                src={mediaSource.src}
                poster={mediaSource.poster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            ) : (
              <Image
                src={mediaSource.src}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                className="object-cover object-top select-none pointer-events-none"
              />
            )}

            {/* Linha de brilho hairline sutil na borda superior interna */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/10" />

            {/* Vignette sutil para integração harmônica com o tema dark (#0b0b0d) */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProjectMediaPreview
