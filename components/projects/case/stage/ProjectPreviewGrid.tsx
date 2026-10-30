"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Maximize2, Play } from "lucide-react"
import type { ProjectScreens, ScreenSource } from "./types"
import { MediaZoomModal } from "@/components/projects/case/media-zoom-modal"

interface ProjectPreviewGridProps {
  screens?: ProjectScreens
  media?: ScreenSource[]
  alt?: string
  className?: string
  priority?: boolean
}

function ContinuousVideo({
  src,
  poster,
  className = "",
}: {
  src: string
  poster?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: "0px", once: false })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isInView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isInView])

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        className={`w-full h-full object-cover object-top select-none pointer-events-none ${className}`}
      />
    </div>
  )
}

export function ProjectPreviewGrid({
  screens,
  media: explicitMedia,
  alt = "Interface do projeto",
  className = "",
  priority = true,
}: ProjectPreviewGridProps) {
  // Coleta as mídias disponíveis
  const rawMedia: ScreenSource[] = useMemo(() => {
    if (explicitMedia && explicitMedia.length > 0) return explicitMedia
    const items: ScreenSource[] = []
    if (screens?.laptop) items.push(screens.laptop)
    if (screens?.phone) items.push(screens.phone)
    return items
  }, [explicitMedia, screens])

  // Regra: Se houver vídeo mesclado com imagem, o vídeo fica SEMPRE no 1º quadrado do grid
  const sortedMedia: ScreenSource[] = useMemo(() => {
    return [...rawMedia].sort((a, b) => {
      if (a.type === "video" && b.type !== "video") return -1
      if (b.type === "video" && a.type !== "video") return 1
      return 0
    })
  }, [rawMedia])

  // Limite máximo de 4 itens na prévia (1 destaque superior + até 3 na grade inferior)
  const previewItems = useMemo(() => sortedMedia.slice(0, 4), [sortedMedia])

  // Estado do Modal de Zoom
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  // O item principal exibido no quadrado superior
  const [featuredIndex, setFeaturedIndex] = useState(0)

  // Reseta para o primeiro item quando o projeto muda
  useEffect(() => {
    setFeaturedIndex(0)
  }, [rawMedia])

  if (previewItems.length === 0) return null

  const mainItem = previewItems[featuredIndex] || previewItems[0]
  const thumbnailItems = previewItems.slice(1)
  const hasMultiple = previewItems.length > 1
  const isMobileOnly = !screens?.laptop && Boolean(screens?.phone) && previewItems.length === 1

  const handleOpenZoom = (itemIndex: number) => {
    setZoomIndex(itemIndex)
  }

  return (
    <>
      <div
        className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none ${className}`}
      >
        {/* ==============================================================
            1º QUADRADO DO GRID (DESTAQUE SUPERIOR)
            Tem o mesmo tamanho exato da linha superior de ponta a ponta
            Sem sombras, cantos arredondados, clique para zoom
            ============================================================== */}
        <div
          onClick={() => handleOpenZoom(featuredIndex)}
          className={`group relative w-full flex-1 min-h-0 overflow-hidden rounded-xl md:rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in transition-colors hover:border-[#c72c3b]/80 flex items-center justify-center ${
            isMobileOnly ? "max-w-[240px] aspect-[9/19] mx-auto" : ""
          }`}
          title="Clique para ampliar em alta resolução"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mainItem.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full"
            >
              {mainItem.type === "video" ? (
                <ContinuousVideo
                  src={mainItem.src}
                  poster={mainItem.poster}
                  className="rounded-xl md:rounded-2xl"
                />
              ) : (
                <Image
                  src={mainItem.src}
                  alt={mainItem.title || alt}
                  fill
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px"
                  className="object-cover object-top select-none pointer-events-none rounded-xl md:rounded-2xl"
                />
              )}

              {/* Botão sutil de zoom no hover */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-sm p-1.5 rounded-lg border border-white/10 text-white pointer-events-none">
                <Maximize2 className="h-3.5 w-3.5" />
              </div>

              {/* Linha hairline interna superior */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/10" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ==============================================================
            GRADE INFERIOR (ATÉ 3 QUADRADOS LADO A LADO)
            Conforme o desenho de referência (Excalidraw)
            ============================================================== */}
        {hasMultiple && (
          <div
            className={`w-full mt-2 sm:mt-2.5 shrink-0 grid gap-2 sm:gap-2.5 ${
              thumbnailItems.length === 1
                ? "grid-cols-1"
                : thumbnailItems.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {thumbnailItems.map((item, idx) => {
              const actualIndex = idx + 1
              const isSelected = featuredIndex === actualIndex

              return (
                <button
                  type="button"
                  key={item.src}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenZoom(actualIndex)
                  }}
                  className="group/thumb relative h-14 sm:h-16 md:h-20 w-full overflow-hidden rounded-lg sm:rounded-xl border border-[#2b2d31]/80 hover:border-[#c72c3b] transition-all cursor-zoom-in bg-[#0c0d10]"
                  title={item.title || "Clique para ampliar em tela cheia"}
                  aria-label={item.title || `Ampliar imagem ${actualIndex + 1}`}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black/60">
                      <video
                        src={item.src}
                        poster={item.poster}
                        muted
                        playsInline
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title || `Miniatura ${actualIndex + 1}`}
                      fill
                      sizes="220px"
                      className="object-cover object-top select-none pointer-events-none"
                    />
                  )}

                  {/* Indicador de clique para zoom no canto */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenZoom(actualIndex)
                    }}
                    className="absolute bottom-1 right-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/80 p-1 rounded border border-white/20 text-white"
                    title="Ampliar em tela cheia"
                  >
                    <Maximize2 className="h-2.5 w-2.5" />
                  </button>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Lightbox de Zoom em Tela Cheia */}
      <MediaZoomModal
        isOpen={zoomIndex !== null}
        items={sortedMedia}
        currentIndex={zoomIndex ?? 0}
        onClose={() => setZoomIndex(null)}
        onNavigate={(newIdx) => setZoomIndex(newIdx)}
      />
    </>
  )
}

export default ProjectPreviewGrid
