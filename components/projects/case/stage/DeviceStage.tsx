"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, ContactShadows } from "@react-three/drei"
import { Group } from "three"
import { usePrefersReducedMotion } from "@/lib/motion"
import { useDeviceRotation } from "./useDeviceRotation"
import { Laptop } from "./Laptop"
import { Phone } from "./Phone"
import { Lights } from "./Lights"
import { StaticFallback } from "./StaticFallback"
import type { DeviceKind, DeviceStageProps } from "./types"
import { cn } from "@/lib/utils"

// Constantes de calibração do Palco 3D (ajustáveis)
export const STAGE_CONFIG = {
  CAMERA_POS: [0, 0, 4.4] as [number, number, number],
  CAMERA_FOV: 42,
  DPR_MIN: 1,
  DPR_MAX: 1.75,
  FLOAT_SPEED: 1.4,
  FLOAT_ROTATION: 0.05,
  FLOAT_INTENSITY: 0.08,
  SHADOW_OPACITY: 0.55,
  SHADOW_SCALE: 8,
} as const

// Componente interno da cena 3D (dentro do Canvas)
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

  // Se phone não estiver definido, reutiliza laptop screen com cover
  const phoneScreen = screens.phone || screens.laptop

  return (
    <>
      <Lights />

      <Float
        speed={STAGE_CONFIG.FLOAT_SPEED}
        rotationIntensity={STAGE_CONFIG.FLOAT_ROTATION}
        floatIntensity={STAGE_CONFIG.FLOAT_INTENSITY}
      >
        <group ref={rotatingGroupRef}>
          <Laptop
            screen={screens.laptop}
            active={device === "laptop"}
          />
          <Phone
            screen={phoneScreen}
            active={device === "phone"}
          />
        </group>
      </Float>

      {/* Sombra de contato estática leve */}
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
  initialDevice = "laptop",
  className,
}: DeviceStageProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)
  const [device, setDevice] = useState<DeviceKind>(initialDevice)
  const [showHint, setShowHint] = useState(true)
  const [isIntersecting, setIsIntersecting] = useState(true)
  const [isTabHidden, setIsTabHidden] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Checagem de suporte WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
      setHasWebGL(Boolean(gl))
    } catch {
      setHasWebGL(false)
    }
  }, [])

  // IntersectionObserver: pausa renderização se fora da tela
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Pausa renderização se a aba do navegador estiver oculta
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === "hidden")
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  // Alternância entre laptop e phone
  const toggleDevice = useCallback(() => {
    setDevice((prev) => (prev === "laptop" ? "phone" : "laptop"))
    setShowHint(false)
  }, [])

  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    stepRotation,
    rotateBy,
  } = useDeviceRotation(toggleDevice)

  // Tratamento de teclado acessível (←/→ gira, Enter/Space alterna)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        rotateBy(-0.15)
        setShowHint(false)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        rotateBy(0.15)
        setShowHint(false)
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        toggleDevice()
      }
    },
    [rotateBy, toggleDevice],
  )

  const handlePointerDownWithHint = useCallback(
    (e: React.PointerEvent) => {
      setShowHint(false)
      onPointerDown(e)
    },
    [onPointerDown],
  )

  // Fallback caso WebGL indisponível ou reduced motion ativo
  if (hasWebGL === false || reducedMotion) {
    return (
      <StaticFallback
        screens={screens}
        initialDevice={device}
        className={className}
      />
    )
  }

  const frameloop = isIntersecting && !isTabHidden ? "always" : "never"

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Visualizador 3D do Projeto. Use as setas para girar e Enter para trocar o aparelho."
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-between overflow-hidden select-none outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]",
        className,
      )}
    >
      {/* Botões Acessíveis no Topo do Palco */}
      <div className="absolute top-4 z-20 flex items-center gap-3">
        <button
          type="button"
          aria-pressed={device === "laptop"}
          aria-label="Visualizar em Notebook"
          onClick={() => {
            setDevice("laptop")
            setShowHint(false)
          }}
          className={cn(
            "rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]",
            device === "laptop"
              ? "border-[#c72c3b] bg-[#c72c3b]/15 text-white"
              : "border-[#2b2d31] bg-[#141518] text-[#8a8f98] hover:border-white/30",
          )}
        >
          NOTEBOOK
        </button>

        <button
          type="button"
          aria-pressed={device === "phone"}
          aria-label="Visualizar em Celular"
          onClick={() => {
            setDevice("phone")
            setShowHint(false)
          }}
          className={cn(
            "rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]",
            device === "phone"
              ? "border-[#c72c3b] bg-[#c72c3b]/15 text-white"
              : "border-[#2b2d31] bg-[#141518] text-[#8a8f98] hover:border-white/30",
          )}
        >
          CELULAR
        </button>
      </div>

      {/* Região ao vivo para leitores de tela */}
      <span className="sr-only" aria-live="polite">
        {device === "laptop"
          ? "Visualizando interface no Notebook 3D"
          : "Visualizando interface no Celular 3D"}
      </span>

      {/* Canvas 3D R3F */}
      <div
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDownWithHint}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Canvas
          dpr={[STAGE_CONFIG.DPR_MIN, STAGE_CONFIG.DPR_MAX]}
          camera={{
            position: STAGE_CONFIG.CAMERA_POS,
            fov: STAGE_CONFIG.CAMERA_FOV,
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
          frameloop={frameloop}
          style={{ touchAction: "pan-y" }}
        >
          <StageScene
            device={device}
            screens={screens}
            stepRotation={stepRotation}
          />
        </Canvas>
      </div>

      {/* Dica de Interação sutil que desaparece na primeira interação */}
      {showHint && (
        <div className="pointer-events-none absolute bottom-4 z-20 flex items-center justify-center font-mono text-[10px] tracking-widest text-[#8a8f98] bg-[#0b0b0d]/75 px-3 py-1 rounded border border-white/5 animate-pulse">
          <span>ARRASTE PARA GIRAR // CLIQUE PARA TROCAR</span>
        </div>
      )}
    </div>
  )
}
