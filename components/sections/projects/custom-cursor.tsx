"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface CustomCursorProps {
  containerRef: React.RefObject<HTMLElement | null>
  hoveredProject: boolean
  reducedMotion?: boolean
}

export function CustomCursor({
  containerRef,
  hoveredProject,
  reducedMotion = false,
}: CustomCursorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointerFine, setIsPointerFine] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { stiffness: 120, damping: 20 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return

    const pointerFineMedia = window.matchMedia("(pointer: fine)")
    setIsPointerFine(pointerFineMedia.matches)

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches)
    }
    pointerFineMedia.addEventListener("change", handlePointerChange)

    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    container.addEventListener("mousemove", handleMouseMove, { passive: true })
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      pointerFineMedia.removeEventListener("change", handlePointerChange)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [containerRef, mouseX, mouseY, isVisible, reducedMotion])

  if (reducedMotion || !isPointerFine || !isVisible) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: hoveredProject ? 96 : 14,
        height: hoveredProject ? 96 : 14,
        backgroundColor: hoveredProject ? "rgba(199, 44, 59, 0.95)" : "rgba(199, 44, 59, 1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className="pointer-events-none fixed z-40 flex items-center justify-center rounded-full text-center text-white backdrop-blur-[1px] select-none shadow-[0_10px_30px_rgba(199,44,59,0.35)]"
    >
      {hoveredProject && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white"
        >
          VER CASE
        </motion.span>
      )}
    </motion.div>
  )
}
