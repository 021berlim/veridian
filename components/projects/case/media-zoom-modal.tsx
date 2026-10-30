"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
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

  // Estado de zoom e arrasto dentro do modal
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reseta o nível de zoom ao trocar de imagem
  useEffect(() => {
    setScale(1)
  }, [currentIndex])

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return
    setScale(1)
    onNavigate((currentIndex - 1 + items.length) % items.length)
  }, [currentIndex, items.length, onNavigate])

  const handleNext = useCallback(() => {
    if (items.length <= 1) return
    setScale(1)
    onNavigate((currentIndex + 1) % items.length)
  }, [currentIndex, items.length, onNavigate])

  // Gerenciamento de eventos de teclado e bloqueio de scroll
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") handlePrev()
      else if (e.key === "ArrowRight") handleNext()
      else if (e.key === "+" || e.key === "=") {
        setScale((prev) => Math.min(prev + 0.5, 4))
      } else if (e.key === "-") {
        setScale((prev) => Math.max(prev - 0.5, 1))
      } else if (e.key === "0") {
        setScale(1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.body.setAttribute("data-zoom-open", "true")

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
      document.body.removeAttribute("data-zoom-open")
    }
  }, [isOpen, onClose, handlePrev, handleNext])

  // Zoom através da roda do mouse (Scroll Wheel) impedindo scroll na página de trás
  useEffect(() => {
    if (!isOpen) return
    const container = containerRef.current
    if (!container) return

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const delta = -e.deltaY * 0.003
      setScale((prev) => {
        const next = Math.min(Math.max(1, prev + delta), 4)
        return Number(next.toFixed(2))
      })
    }

    container.addEventListener("wheel", handleWheelNative, { passive: false })
    return () => {
      container.removeEventListener("wheel", handleWheelNative)
    }
  }, [isOpen])

  // Duplo clique alterna entre 1x e 2.2x
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setScale((prev) => (prev > 1 ? 1 : 2.2))
  }

  return (
    <AnimatePresence>
      {isOpen && currentItem && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          /* Fundo menos opaco (65%) com blur profundo (2xl) para não ficar escuro demais */
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/65 backdrop-blur-2xl select-none"
          onClick={onClose}
        >
          {/* Header Superior: Título à esquerda + X Minimalista à direita */}
          <div
            className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Título da Imagem */}
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-300">
              <span className="text-[#c72c3b] font-medium">ZOOM //</span>
              <span className="truncate max-w-[200px] sm:max-w-md">
                {currentItem.title || "Visualização em Alta Definição"}
              </span>
              {scale > 1 && (
                <span className="ml-2 font-mono text-[11px] text-[#c72c3b] bg-[#c72c3b]/10 border border-[#c72c3b]/30 px-2 py-0.5 rounded">
                  {Math.round(scale * 100)}%
                </span>
              )}
            </div>

            {/* Apenas um X Minimalista que fica vermelho no hover (sem pílula e sem texto) */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-[#c72c3b] transition-colors focus:outline-none"
              aria-label="Fechar modal de zoom"
              title="Fechar (Esc)"
            >
              <X className="h-6 w-6 sm:h-7 sm:w-7 transition-colors" strokeWidth={1.5} />
            </button>
          </div>

          {/* Chevrons Minimalistas Naked (Sem círculos e sem bordas) */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-2 sm:left-6 z-50 p-2 text-neutral-400 hover:text-[#c72c3b] transition-colors focus:outline-none"
                aria-label="Item anterior"
                title="Anterior (←)"
              >
                <ChevronLeft className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.25} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-2 sm:right-6 z-50 p-2 text-neutral-400 hover:text-[#c72c3b] transition-colors focus:outline-none"
                aria-label="Próximo item"
                title="Próximo (→)"
              >
                <ChevronRight className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.25} />
              </button>
            </>
          )}

          {/* Contêiner da Mídia com Zoom e Panning (Arrasto) */}
          <div
            className="relative max-w-6xl max-h-[82vh] w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
          >
            <motion.div
              key={currentItem.src}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{
                scale: { type: "spring", stiffness: 350, damping: 28 },
                opacity: { duration: 0.18 },
              }}
              drag={scale > 1}
              dragConstraints={{
                left: -300 * (scale - 1),
                right: 300 * (scale - 1),
                top: -200 * (scale - 1),
                bottom: 200 * (scale - 1),
              }}
              dragElastic={0.06}
              className={`relative max-w-full max-h-full flex items-center justify-center rounded-xl md:rounded-2xl border border-[#2b2d31]/80 bg-[#0a0a0c] overflow-hidden ${
                scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
              }`}
              title={scale > 1 ? "Arraste para mover / Duplo clique para redefinir" : "Scroll do mouse para zoom / Duplo clique para aproximar"}
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
                  className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none pointer-events-none"
                />
              ) : (
                <Image
                  src={currentItem.src}
                  alt={currentItem.title || "Interface em alta resolução"}
                  width={1920}
                  height={1200}
                  priority
                  className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none pointer-events-none"
                />
              )}
            </motion.div>
          </div>

          {/* Rodapé: Apenas Números Minimalistas (Sem Pílula) */}
          {items.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 font-mono text-xs text-neutral-400 tracking-widest pointer-events-none select-none">
              {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
