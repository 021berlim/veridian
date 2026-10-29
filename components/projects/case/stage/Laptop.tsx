"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { MathUtils, Group } from "three"
import { ScreenMaterial } from "./ScreenMaterial"
import type { ScreenSource } from "./types"

export const LAPTOP_CONFIG = {
  BASE_WIDTH: 3.2,
  BASE_HEIGHT: 0.12,
  BASE_DEPTH: 2.2,
  LID_WIDTH: 3.2,
  LID_HEIGHT: 0.08,
  LID_DEPTH: 2.1,
  SCREEN_WIDTH: 3.0,
  SCREEN_HEIGHT: 1.875, // 16:10
  OPEN_ANGLE_RAD: 1.8326, // ~105°
  METAL_COLOR: "#1c1d21",
  BEZEL_COLOR: "#0a0b0d",
  KEYBOARD_COLOR: "#121316",
  TRACKPAD_COLOR: "#16171a",
  ACCENT_RED: "#c72c3b",
} as const

interface LaptopProps {
  screen?: ScreenSource
  active: boolean
}

export function Laptop({ screen, active }: LaptopProps) {
  const rootRef = useRef<Group>(null)
  const hingeRef = useRef<Group>(null)
  const lidAngleRef = useRef(active ? LAPTOP_CONFIG.OPEN_ANGLE_RAD : 0)

  useFrame((_, delta) => {
    if (!rootRef.current || !hingeRef.current) return

    const targetAngle = active ? LAPTOP_CONFIG.OPEN_ANGLE_RAD : 0
    const targetScale = active ? 1 : 0.0001

    // Amortecimento do ângulo da tampa
    lidAngleRef.current = MathUtils.damp(
      lidAngleRef.current,
      targetAngle,
      5,
      delta,
    )
    hingeRef.current.rotation.x = -lidAngleRef.current

    // Amortecimento de escala e visibilidade
    const currentScale = rootRef.current.scale.x
    const newScale = MathUtils.damp(currentScale, targetScale, 6, delta)
    rootRef.current.scale.setScalar(newScale)
    rootRef.current.visible = newScale > 0.01
  })

  const screenAspect = LAPTOP_CONFIG.SCREEN_WIDTH / LAPTOP_CONFIG.SCREEN_HEIGHT

  return (
    <group ref={rootRef} position={[0, -0.4, 0]}>
      {/* 1. BASE DO NOTEBOOK (em y = 0) */}
      <group position={[0, 0, 0]}>
        {/* Chassis inferior de alumínio usinado */}
        <RoundedBox
          args={[
            LAPTOP_CONFIG.BASE_WIDTH,
            LAPTOP_CONFIG.BASE_HEIGHT,
            LAPTOP_CONFIG.BASE_DEPTH,
          ]}
          radius={0.04}
          smoothness={4}
        >
          <meshStandardMaterial
            color={LAPTOP_CONFIG.METAL_COLOR}
            metalness={0.88}
            roughness={0.25}
          />
        </RoundedBox>

        {/* Friso frontal vermelho Zuse */}
        <mesh position={[0, 0, LAPTOP_CONFIG.BASE_DEPTH / 2 + 0.001]}>
          <planeGeometry args={[0.5, 0.016]} />
          <meshBasicMaterial color={LAPTOP_CONFIG.ACCENT_RED} />
        </mesh>

        {/* Cavidade do teclado (na face superior da base: y = 0.06) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2 + 0.001, -0.25]}
        >
          <planeGeometry args={[2.7, 1.15]} />
          <meshStandardMaterial
            color={LAPTOP_CONFIG.KEYBOARD_COLOR}
            roughness={0.82}
            metalness={0.18}
          />
        </mesh>

        {/* Linhas procedurais de teclas */}
        <group position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2 + 0.002, -0.25]}>
          {[-0.38, -0.19, 0, 0.19, 0.38].map((offsetZ, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, offsetZ]}>
              <planeGeometry args={[2.62, 0.14]} />
              <meshStandardMaterial
                color="#0c0d10"
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Trackpad */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2 + 0.001, 0.58]}
        >
          <planeGeometry args={[0.95, 0.62]} />
          <meshStandardMaterial
            color={LAPTOP_CONFIG.TRACKPAD_COLOR}
            roughness={0.35}
            metalness={0.75}
          />
        </mesh>
      </group>

      {/* 2. DOBRADIÇA NA ARESTA TRASEIRA (y = 0.06, z = -1.1) */}
      <group
        ref={hingeRef}
        position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2, -LAPTOP_CONFIG.BASE_DEPTH / 2]}
      >
        {/* Carcaça da tampa: quando lidAngle=0, estende-se sobre a base em +Z */}
        <RoundedBox
          args={[
            LAPTOP_CONFIG.LID_WIDTH,
            LAPTOP_CONFIG.LID_HEIGHT,
            LAPTOP_CONFIG.LID_DEPTH,
          ]}
          position={[0, LAPTOP_CONFIG.LID_HEIGHT / 2, LAPTOP_CONFIG.LID_DEPTH / 2]}
          radius={0.04}
          smoothness={4}
        >
          <meshStandardMaterial
            color={LAPTOP_CONFIG.METAL_COLOR}
            metalness={0.9}
            roughness={0.22}
          />
        </RoundedBox>

        {/* Bezel / Moldura preta interna */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -0.0405, LAPTOP_CONFIG.LID_DEPTH / 2]}
        >
          <planeGeometry
            args={[
              LAPTOP_CONFIG.LID_WIDTH - 0.08,
              LAPTOP_CONFIG.LID_DEPTH - 0.06,
            ]}
          />
          <meshBasicMaterial color={LAPTOP_CONFIG.BEZEL_COLOR} />
        </mesh>

        {/* TELA DO NOTEBOOK (ScreenMaterial) */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -0.041, LAPTOP_CONFIG.LID_DEPTH / 2]}
        >
          <planeGeometry
            args={[LAPTOP_CONFIG.SCREEN_WIDTH, LAPTOP_CONFIG.SCREEN_HEIGHT]}
          />
          <ScreenMaterial
            source={screen}
            geometryAspect={screenAspect}
            isActive={active}
          />
        </mesh>

        {/* Câmera discreta na moldura superior interna */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[
            0,
            -0.0412,
            LAPTOP_CONFIG.LID_DEPTH - 0.025,
          ]}
        >
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Vidro protetor com leve reflexo translúcido */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -0.0415, LAPTOP_CONFIG.LID_DEPTH / 2]}
        >
          <planeGeometry
            args={[LAPTOP_CONFIG.SCREEN_WIDTH, LAPTOP_CONFIG.SCREEN_HEIGHT]}
          />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.1}
            transparent={true}
            opacity={0.04}
          />
        </mesh>
      </group>
    </group>
  )
}
