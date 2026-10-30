"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import type { ScreenSource } from "./stage/types"

interface MediaZoomModalProps {
  isOpen: boolean
  items: ScreenSource[]
  currentIndex: number
  onClose: () => void
  onNavigate: (newIndex: number) => void
}

export function MediaZoomModal({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNavigate,
}: MediaZoomModalProps) {
  const currentItem = items[currentIndex] || items[0]

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return
    onNavigate((currentIndex - 1 + items.length) % items.length)
  }, [currentIndex, items.length, onNavigate])

  const handleNext = useCallback(() => {
    if (items.length <= 1) return
    onNavigate((currentIndex + 1) % items.length)
  }, [currentIndex, items.length, onNavigate])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") handlePrev()
      else if (e.key === "ArrowRight") handleNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose, handlePrev, handleNext])

  return (
    <AnimatePresence>
      {isOpen && currentItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/92 backdrop-blur-md select-none"
          onClick={onClose}
        >
          {/* Header Superior: Título + Botão Fechar */}
          <div
            className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm text-neutral-300">
              <span className="text-[#c72c3b] font-medium">ZOOM //</span>
              <span className="truncate max-w-[240px] sm:max-w-md">
                {currentItem.title || "Visualização em Alta Resolução"}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18191d] border border-[#2b2d31] text-neutral-300 hover:text-white hover:border-[#c72c3b] transition-colors font-mono text-xs"
              aria-label="Fechar zoom"
            >
              <span>Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Botões de Navegação Anterior/Próximo se houver múltiplos itens */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-2 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-[#18191d]/80 border border-[#2b2d31] text-white hover:border-[#c72c3b] hover:bg-[#c72c3b] transition-all"
                aria-label="Item anterior"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-2 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-[#18191d]/80 border border-[#2b2d31] text-white hover:border-[#c72c3b] hover:bg-[#c72c3b] transition-all"
                aria-label="Próximo item"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}

          {/* Mídia em Foco (Sem Sombra, Cantos Arredondados) */}
          <motion.div
            key={currentItem.src}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-6xl max-h-[82vh] w-full flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl border border-[#2b2d31]/80 bg-[#0a0a0c]"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === "video" ? (
              <video
                src={currentItem.src}
                poster={currentItem.poster}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none"
              />
            ) : (
              <Image
                src={currentItem.src}
                alt={currentItem.title || "Interface em alta resolução"}
                width={1920}
                height={1200}
                priority
                className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none"
              />
            )}
          </motion.div>

          {/* Rodapé: Contador de Posição */}
          {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 font-mono text-xs text-neutral-400 bg-[#121316]/90 border border-[#2b2d31] px-3 py-1 rounded-full">
              {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
