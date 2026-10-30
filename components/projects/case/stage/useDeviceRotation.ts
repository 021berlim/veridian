"use client"

import { useRef, useCallback } from "react"
import { MathUtils } from "three"

// Constantes de calibração da física de rotação (inclinado estilo 3/4 showcase premium)
export const ROTATION_CONFIG = {
  REST_YAW: -0.12, // ~-7° inclinação frontal sutil para legibilidade máxima da tela
  REST_PITCH: 0.05, // ~+3° foco frontal na tela
  YAW_RANGE: Math.PI / 3.2, // ~±56° de rotação interativa (garante que a tela fica sempre voltada ao usuário)
  PITCH_MIN: -0.15, // ~-8.5° limite inferior (evita inclinar a ponto de esconder a tela)
  PITCH_MAX: 0.28, // ~+16° limite superior (evita inclinar demais para trás)
  SENSITIVITY_X: 0.005,
  SENSITIVITY_Y: 0.005,
  INERTIA_DAMPING: 0.92,
  RETURN_DELAY_MS: 3000,
  RETURN_SPEED: 2.2,
  CLICK_DELTA_PX: 4,
} as const

export interface RotationState {
  yaw: number
  pitch: number
  targetYaw: number
  targetPitch: number
  velocityX: number
  velocityY: number
  isDragging: boolean
  lastInteractionTime: number
}

export function useDeviceRotation(onToggleDevice?: () => void) {
  const state = useRef<RotationState>({
    yaw: ROTATION_CONFIG.REST_YAW,
    pitch: ROTATION_CONFIG.REST_PITCH,
    targetYaw: ROTATION_CONFIG.REST_YAW,
    targetPitch: ROTATION_CONFIG.REST_PITCH,
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
    lastInteractionTime: Date.now(),
  })

  const pointerStart = useRef({ x: 0, y: 0, time: 0 })
  const hasInteractedRef = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return

    const s = state.current
    s.isDragging = true
    s.velocityX = 0
    s.velocityY = 0
    s.lastInteractionTime = Date.now()
    hasInteractedRef.current = true

    pointerStart.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Ignorar falha se não suportado
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = state.current
    if (!s.isDragging) return

    const deltaX = e.movementX ?? (e.clientX - pointerStart.current.x)
    const deltaY = e.movementY ?? (e.clientY - pointerStart.current.y)

    const rotDeltaX = deltaX * ROTATION_CONFIG.SENSITIVITY_X
    const rotDeltaY = deltaY * ROTATION_CONFIG.SENSITIVITY_Y

    s.targetYaw = MathUtils.clamp(
      s.targetYaw + rotDeltaX,
      ROTATION_CONFIG.REST_YAW - ROTATION_CONFIG.YAW_RANGE,
      ROTATION_CONFIG.REST_YAW + ROTATION_CONFIG.YAW_RANGE,
    )
    s.targetPitch = MathUtils.clamp(
      s.targetPitch + rotDeltaY,
      ROTATION_CONFIG.PITCH_MIN,
      ROTATION_CONFIG.PITCH_MAX,
    )

    s.velocityX = rotDeltaX
    s.velocityY = rotDeltaY
    s.lastInteractionTime = Date.now()
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const s = state.current
    if (!s.isDragging) return
    s.isDragging = false

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignorar se já liberado
    }

    const totalDist = Math.hypot(
      e.clientX - pointerStart.current.x,
      e.clientY - pointerStart.current.y,
    )

    // Se moveu menos que 4px, é clique para alternar aparelho
    if (totalDist < ROTATION_CONFIG.CLICK_DELTA_PX) {
      onToggleDevice?.()
    }
  }, [onToggleDevice])

  const stepRotation = useCallback((delta: number) => {
    const s = state.current
    const now = Date.now()

    if (!s.isDragging) {
      // Aplica inércia respeitando os limites da vitrine
      s.targetYaw = MathUtils.clamp(
        s.targetYaw + s.velocityX,
        ROTATION_CONFIG.REST_YAW - ROTATION_CONFIG.YAW_RANGE,
        ROTATION_CONFIG.REST_YAW + ROTATION_CONFIG.YAW_RANGE,
      )
      s.targetPitch = MathUtils.clamp(
        s.targetPitch + s.velocityY,
        ROTATION_CONFIG.PITCH_MIN,
        ROTATION_CONFIG.PITCH_MAX,
      )

      s.velocityX *= ROTATION_CONFIG.INERTIA_DAMPING
      s.velocityY *= ROTATION_CONFIG.INERTIA_DAMPING

      // Retorno suave à pose inicial inclinada (estilo 3/4 showcase) após tempo idle
      if (now - s.lastInteractionTime > ROTATION_CONFIG.RETURN_DELAY_MS) {
        s.targetYaw = MathUtils.damp(
          s.targetYaw,
          ROTATION_CONFIG.REST_YAW,
          ROTATION_CONFIG.RETURN_SPEED,
          delta,
        )
        s.targetPitch = MathUtils.damp(
          s.targetPitch,
          ROTATION_CONFIG.REST_PITCH,
          ROTATION_CONFIG.RETURN_SPEED,
          delta,
        )
      }
    }

    // Amortecimento suave da pose atual para a alvo
    s.yaw = MathUtils.damp(s.yaw, s.targetYaw, 12, delta)
    s.pitch = MathUtils.damp(s.pitch, s.targetPitch, 12, delta)

    return { yaw: s.yaw, pitch: s.pitch }
  }, [])

  const rotateBy = useCallback((deltaYaw: number, deltaPitch = 0) => {
    const s = state.current
    s.targetYaw = MathUtils.clamp(
      s.targetYaw + deltaYaw,
      ROTATION_CONFIG.REST_YAW - ROTATION_CONFIG.YAW_RANGE,
      ROTATION_CONFIG.REST_YAW + ROTATION_CONFIG.YAW_RANGE,
    )
    s.targetPitch = MathUtils.clamp(
      s.targetPitch + deltaPitch,
      ROTATION_CONFIG.PITCH_MIN,
      ROTATION_CONFIG.PITCH_MAX,
    )
    s.lastInteractionTime = Date.now()
  }, [])

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    stepRotation,
    rotateBy,
    hasInteracted: hasInteractedRef,
  }
}
