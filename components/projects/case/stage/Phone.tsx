"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { MathUtils, Group } from "three"
import { ScreenMaterial } from "./ScreenMaterial"
import type { ScreenSource } from "./types"

// Constantes de proporção e calibração procedural do Celular
export const PHONE_CONFIG = {
  BODY_WIDTH: 1.24,
  BODY_HEIGHT: 2.58,
  BODY_DEPTH: 0.09,
  BODY_RADIUS: 0.12,
  SCREEN_WIDTH: 1.16,
  SCREEN_HEIGHT: 2.5, // proporção aproximada de 19.5:9
  ISLAND_WIDTH: 0.32,
  ISLAND_HEIGHT: 0.07,
  METAL_COLOR: "#18191c",
  BEZEL_COLOR: "#070708",
  ACCENT_RED: "#c72c3b",
} as const

interface PhoneProps {
  screen: ScreenSource
  active: boolean
  modelUrl?: string
}

export function Phone({ screen, active, modelUrl }: PhoneProps) {
  const rootRef = useRef<Group>(null)

  const targetScale = active ? 1 : 0.001

  useFrame((_, delta) => {
    if (!rootRef.current) return

    // Animação de entrada e saída por escala e posição
    rootRef.current.scale.setScalar(
      MathUtils.damp(rootRef.current.scale.x, targetScale, 6, delta),
    )
  })

  // Se modelUrl for fornecido no futuro, permite useGLTF
  if (modelUrl) {
    // Slot pronto para useGLTF
  }

  const screenAspect = PHONE_CONFIG.SCREEN_WIDTH / PHONE_CONFIG.SCREEN_HEIGHT

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* CORPO DO CELULAR (CHASSIS METÁLICO ARREDONDADO) */}
      <RoundedBox
        args={[
          PHONE_CONFIG.BODY_WIDTH,
          PHONE_CONFIG.BODY_HEIGHT,
          PHONE_CONFIG.BODY_DEPTH,
        ]}
        radius={PHONE_CONFIG.BODY_RADIUS}
        smoothness={6}
      >
        <meshStandardMaterial
          color={PHONE_CONFIG.METAL_COLOR}
          metalness={0.92}
          roughness={0.22}
        />
      </RoundedBox>

      {/* Friso lateral sutil de antena / botão vermelho */}
      <mesh position={[PHONE_CONFIG.BODY_WIDTH / 2 + 0.005, 0.4, 0]}>
        <boxGeometry args={[0.015, 0.22, 0.04]} />
        <meshStandardMaterial
          color={PHONE_CONFIG.ACCENT_RED}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Botões de volume do outro lado */}
      <mesh position={[-PHONE_CONFIG.BODY_WIDTH / 2 - 0.005, 0.5, 0]}>
        <boxGeometry args={[0.015, 0.18, 0.04]} />
        <meshStandardMaterial color="#222327" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-PHONE_CONFIG.BODY_WIDTH / 2 - 0.005, 0.26, 0]}>
        <boxGeometry args={[0.015, 0.18, 0.04]} />
        <meshStandardMaterial color="#222327" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* MOLDURA FRONTAL DA TELA (BEZEL) */}
      <group position={[0, 0, PHONE_CONFIG.BODY_DEPTH / 2 + 0.001]}>
        {/* Fundo preto da tela com cantos suaves */}
        <RoundedBox
          args={[PHONE_CONFIG.SCREEN_WIDTH + 0.02, PHONE_CONFIG.SCREEN_HEIGHT + 0.02, 0.002]}
          radius={PHONE_CONFIG.BODY_RADIUS - 0.02}
          smoothness={4}
        >
          <meshBasicMaterial color={PHONE_CONFIG.BEZEL_COLOR} />
        </RoundedBox>

        {/* TELA DIGITAL (ScreenMaterial) */}
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry
            args={[PHONE_CONFIG.SCREEN_WIDTH, PHONE_CONFIG.SCREEN_HEIGHT]}
          />
          <ScreenMaterial
            source={screen}
            geometryAspect={screenAspect}
            isActive={active}
          />
        </mesh>

        {/* ILHA DINÂMICA / NOTCH */}
        <mesh position={[0, PHONE_CONFIG.SCREEN_HEIGHT / 2 - 0.14, 0.003]}>
          <planeGeometry
            args={[PHONE_CONFIG.ISLAND_WIDTH, PHONE_CONFIG.ISLAND_HEIGHT]}
          />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Câmera selfie dentro da ilha */}
        <mesh position={[0.09, PHONE_CONFIG.SCREEN_HEIGHT / 2 - 0.14, 0.004]}>
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial color="#1a1c22" />
        </mesh>

        {/* Vidro protetor com leve reflexo estético */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry
            args={[PHONE_CONFIG.SCREEN_WIDTH, PHONE_CONFIG.SCREEN_HEIGHT]}
          />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.05}
            transparent={true}
            opacity={0.06}
          />
        </mesh>
      </group>
    </group>
  )
}
