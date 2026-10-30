"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import type { ScreenSource } from "./stage/types"
import { MediaZoomModal } from "./media-zoom-modal"

interface CaseMediaGalleryProps {
  media: ScreenSource[]
  projectName: string
}

export function CaseMediaGallery({ media, projectName }: CaseMediaGalleryProps) {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  const videos = media.filter((m) => m.type === "video")
  const images = media.filter((m) => m.type !== "video")

  return (
    <div className="w-full my-12 space-y-12">
      {/* SEÇÃO DE VÍDEOS (SE HOUVER) - Conforme Print 4 */}
      {videos.length > 0 && (
        <section aria-label="Vídeos do projeto" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#c72c3b] uppercase tracking-wider">
              01 // MULTIMÍDIA
            </span>
            <h2 className="font-sans text-2xl font-light text-white tracking-tight">
              Vídeos
            </h2>
          </div>

          <div className="space-y-6">
            {videos.map((vid, idx) => {
              const fullIndex = media.findIndex((m) => m.src === vid.src)
              return (
                <div
                  key={vid.src}
                  onClick={() => setZoomIndex(fullIndex)}
                  className="group relative w-full aspect-[16/9] max-h-[640px] overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in hover:border-[#c72c3b]/80 transition-colors"
                >
                  <video
                    src={vid.src}
                    poster={vid.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    disablePictureInPicture
                    className="w-full h-full object-cover object-center select-none pointer-events-none"
                  />

                  {vid.title && (
                    <div className="absolute bottom-4 left-4 z-20 font-mono text-xs text-white/90 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10">
                      {vid.title}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* GRADE DE IMAGENS SEM LIMITE - Conforme Print 3 */}
      {images.length > 0 && (
        <section aria-label="Imagens da interface" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#c72c3b] uppercase tracking-wider">
                {videos.length > 0 ? "02 // INTERFACES" : "01 // INTERFACES"}
              </span>
              <h2 className="font-sans text-2xl font-light text-white tracking-tight">
                Telas em Produção ({images.length})
              </h2>
            </div>
            <span className="font-mono text-xs text-[#8a8f98]">
              Clique para ampliar
            </span>
          </div>

          {/* Grid de 3 colunas responsivo, exatamente como no Print 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {images.map((img) => {
              const fullIndex = media.findIndex((m) => m.src === img.src)
              return (
                <motion.div
                  key={img.src}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setZoomIndex(fullIndex)}
                  className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in hover:border-[#c72c3b] transition-all"
                >
                  <Image
                    src={img.src}
                    alt={img.title || `Tela de ${projectName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Header / Caption ao passar o mouse */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                    {img.title && (
                      <p className="font-mono text-xs text-white line-clamp-2">
                        {img.title}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Lightbox Zoom */}
      <MediaZoomModal
        isOpen={zoomIndex !== null}
        items={media}
        currentIndex={zoomIndex ?? 0}
        onClose={() => setZoomIndex(null)}
        onNavigate={(newIdx) => setZoomIndex(newIdx)}
      />
    </div>
  )
}
