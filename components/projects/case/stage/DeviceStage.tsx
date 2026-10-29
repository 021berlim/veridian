"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, ContactShadows } from "@react-three/drei"
import { Group } from "three"
import { motion, AnimatePresence } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/motion"
import { useDeviceRotation } from "./useDeviceRotation"
import { Laptop } from "./Laptop"
import { Phone } from "./Phone"
import { Lights } from "./Lights"
import { StaticFallback } from "./StaticFallback"
import type { DeviceKind, DeviceStageProps } from "./types"
import { cn } from "@/lib/utils"

export const STAGE_CONFIG = {
  CAMERA_POS: [0, 0.28, 4.2] as [number, number, number],
  CAMERA_FOV: 42,
  DPR_MIN: 1,
  DPR_MAX: 1.75,
  FLOAT_SPEED: 1.4,
  FLOAT_ROTATION: 0.04,
  FLOAT_INTENSITY: 0.08,
  SHADOW_OPACITY: 0.45,
  SHADOW_SCALE: 7,
} as const

function StageScene({
  device,
  screens,
  stepRotation,
}: {
  device: DeviceKind
  screens: DeviceStageProps["screens"]
  stepRotation: (delta: number) => { yaw: number; pitch: number }
}) {
  const rotatingGroupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!rotatingGroupRef.current) return
    const { yaw, pitch } = stepRotation(delta)
    rotatingGroupRef.current.rotation.y = yaw
    rotatingGroupRef.current.rotation.x = pitch
  })

  return (
    <>
      <Lights />

      <Float
        speed={STAGE_CONFIG.FLOAT_SPEED}
        rotationIntensity={STAGE_CONFIG.FLOAT_ROTATION}
        floatIntensity={STAGE_CONFIG.FLOAT_INTENSITY}
      >
        <group ref={rotatingGroupRef}>
          {screens.laptop && (
            <Laptop
              screen={screens.laptop}
              active={device === "laptop"}
            />
          )}
          {screens.phone && (
            <Phone
              screen={screens.phone}
              active={device === "phone"}
            />
          )}
        </group>
      </Float>

      {/* Sombra de contato suave na base */}
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={STAGE_CONFIG.SHADOW_OPACITY}
        scale={STAGE_CONFIG.SHADOW_SCALE}
        blur={2.4}
        far={4}
        frames={1}
      />
    </>
  )
}

export default function DeviceStage({
  screens,
  defaultDevice,
  device: controlledDevice,
  onDeviceChange,
  height,
  showToggle = true,
  showHint = true,
  paused = false,
  className,
}: DeviceStageProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  const hasLaptop = Boolean(screens.laptop)
  const hasPhone = Boolean(screens.phone)

  // Dispositivo inicial baseado nas propriedades e disponibilidade de telas
  const resolvedInitialDevice: DeviceKind = useMemo(() => {
    if (defaultDevice && screens[defaultDevice]) return defaultDevice
    if (hasLaptop) return "laptop"
    if (hasPhone) return "phone"
    return "laptop"
  }, [defaultDevice, hasLaptop, hasPhone, screens])

  const [uncontrolledDevice, setUncontrolledDevice] = useState<DeviceKind>(resolvedInitialDevice)
  const currentDevice = controlledDevice ?? uncontrolledDevice

  // Se o dispositivo atual não existir no novo screens, ajusta automaticamente
  useEffect(() => {
    if (currentDevice === "laptop" && !hasLaptop && hasPhone) {
      if (controlledDevice === undefined) setUncontrolledDevice("phone")
      onDeviceChange?.("phone")
    } else if (currentDevice === "phone" && !hasPhone && hasLaptop) {
      if (controlledDevice === undefined) setUncontrolledDevice("laptop")
      onDeviceChange?.("laptop")
    }
  }, [hasLaptop, hasPhone, currentDevice, controlledDevice, onDeviceChange])

  const setDevice = useCallback(
    (next: DeviceKind) => {
      if (controlledDevice === undefined) {
        setUncontrolledDevice(next)
      }
      onDeviceChange?.(next)
    },
    [controlledDevice, onDeviceChange],
  )

  const toggleDevice = useCallback(() => {
    if (hasLaptop && hasPhone) {
      const next = currentDevice === "laptop" ? "phone" : "laptop"
      setDevice(next)
    }
  }, [hasLaptop, hasPhone, currentDevice, setDevice])

  const [hintVisible, setHintVisible] = useState(showHint)
  const [isIntersecting, setIsIntersecting] = useState(true)
  const [isTabHidden, setIsTabHidden] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Suporte a WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
      setHasWebGL(Boolean(gl))
    } catch {
      setHasWebGL(false)
    }
  }, [])

  // IntersectionObserver para pausar WebGL fora da viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { rootMargin: "300px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ResizeObserver para garantir redimensionamento perfeito do buffer WebGL
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const ro = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Visibilidade de aba
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden")
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    stepRotation,
    rotateBy,
  } = useDeviceRotation(toggleDevice)

  const handlePointerDownWithHint = useCallback(
    (e: React.PointerEvent) => {
      if (hintVisible) setHintVisible(false)
      onPointerDown(e)
    },
    [hintVisible, onPointerDown],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        rotateBy(-0.15)
        if (hintVisible) setHintVisible(false)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        rotateBy(0.15)
        if (hintVisible) setHintVisible(false)
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        toggleDevice()
        if (hintVisible) setHintVisible(false)
      }
    },
    [rotateBy, toggleDevice, hintVisible],
  )

  // Fallback se sem WebGL ou reduced motion
  if (hasWebGL === false || reducedMotion) {
    return (
      <StaticFallback
        screens={screens}
        defaultDevice={defaultDevice}
        device={currentDevice}
        onDeviceChange={setDevice}
        className={className}
      />
    )
  }

  const frameloop = !paused && !isTabHidden ? "always" : "never"
  const canToggle = showToggle && hasLaptop && hasPhone

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Aparelho 3D interativo do projeto. Arraste para girar, clique para alternar aparelho."
      onKeyDown={handleKeyDown}
      style={{ height: height || "100%" }}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center select-none outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]/50",
        className,
      )}
    >
      {/* 1. Toggle NOTEBOOK / CELULAR: tipografia mono pura com sublinhado vermelho animado */}
      {canToggle && (
        <div className="absolute top-2 z-20 flex items-center gap-6">
          <button
            type="button"
            aria-pressed={currentDevice === "laptop"}
            onClick={() => {
              setDevice("laptop")
              if (hintVisible) setHintVisible(false)
            }}
            className={cn(
              "relative pb-1 font-mono text-[11px] uppercase tracking-widest transition-colors",
              currentDevice === "laptop"
                ? "text-white"
                : "text-[#8a8f98] hover:text-white",
            )}
          >
            NOTEBOOK
            {currentDevice === "laptop" && (
              <motion.div
                layoutId="deviceToggleUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c72c3b]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            type="button"
            aria-pressed={currentDevice === "phone"}
            onClick={() => {
              setDevice("phone")
              if (hintVisible) setHintVisible(false)
            }}
            className={cn(
              "relative pb-1 font-mono text-[11px] uppercase tracking-widest transition-colors",
              currentDevice === "phone"
                ? "text-white"
                : "text-[#8a8f98] hover:text-white",
            )}
          >
            CELULAR
            {currentDevice === "phone" && (
              <motion.div
                layoutId="deviceToggleUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c72c3b]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>
      )}

      {/* Região acessível para leitores de tela */}
      <span className="sr-only" aria-live="polite">
        {currentDevice === "laptop"
          ? "Visualizando interface no Notebook 3D"
          : "Visualizando interface no Celular 3D"}
      </span>

      {/* 2. Canvas 3D Transparente (Frameless) */}
      <div
        className="relative h-full w-full flex-1 cursor-grab active:cursor-grabbing min-h-[300px] [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:!block"
        onPointerDown={handlePointerDownWithHint}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Canvas
          className="h-full w-full"
          dpr={[STAGE_CONFIG.DPR_MIN, STAGE_CONFIG.DPR_MAX]}
          camera={{
            position: STAGE_CONFIG.CAMERA_POS,
            fov: STAGE_CONFIG.CAMERA_FOV,
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          frameloop={frameloop}
          style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
        >
          <StageScene
            device={currentDevice}
            screens={screens}
            stepRotation={stepRotation}
          />
        </Canvas>
      </div>

      {/* 3. Dica de Interação sutil */}
      <AnimatePresence>
        {hintVisible && showHint && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute bottom-2 z-20 flex items-center justify-center font-mono text-[10px] tracking-widest text-[#8a8f98]"
          >
            <span>ARRASTE PARA GIRAR // CLIQUE PARA TROCAR</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
