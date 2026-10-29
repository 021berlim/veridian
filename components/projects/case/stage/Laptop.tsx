"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { MathUtils, Group, Mesh } from "three"
import { ScreenMaterial } from "./ScreenMaterial"
import type { ScreenSource } from "./types"

// Constantes de proporção e calibração procedural do Notebook
export const LAPTOP_CONFIG = {
  BASE_WIDTH: 3.2,
  BASE_DEPTH: 2.15,
  BASE_HEIGHT: 0.08,
  LID_WIDTH: 3.2,
  LID_DEPTH: 2.1,
  LID_HEIGHT: 0.04,
  SCREEN_WIDTH: 2.92,
  SCREEN_HEIGHT: 1.825, // proporção 16:10
  OPEN_ANGLE_RAD: 1.8326, // ~105 graus
  METAL_COLOR: "#1c1d21",
  BEZEL_COLOR: "#0c0d0f",
  KEYBOARD_COLOR: "#121316",
  TRACKPAD_COLOR: "#16171a",
  ACCENT_RED: "#c72c3b",
} as const

interface LaptopProps {
  screen: ScreenSource
  active: boolean
  modelUrl?: string
}

export function Laptop({ screen, active, modelUrl }: LaptopProps) {
  const rootRef = useRef<Group>(null)
  const hingeRef = useRef<Group>(null)
  const screenMeshRef = useRef<Mesh>(null)

  const targetAngle = active ? LAPTOP_CONFIG.OPEN_ANGLE_RAD : 0
  const targetScale = active ? 1 : 0.001
  const targetOpacity = active ? 1 : 0

  useFrame((_, delta) => {
    if (!rootRef.current || !hingeRef.current) return

    // Anima a abertura da tampa (0° -> 105°)
    hingeRef.current.rotation.x = MathUtils.damp(
      hingeRef.current.rotation.x,
      targetAngle,
      4.5,
      delta,
    )

    // Anima transição de escala e posição geral de entrada/saída
    rootRef.current.scale.setScalar(
      MathUtils.damp(rootRef.current.scale.x, targetScale, 6, delta),
    )
  })

  // Se modelUrl for fornecido no futuro, permite carregar useGLTF
  if (modelUrl) {
    // Slot pronto para useGLTF(modelUrl)
  }

  const screenAspect = LAPTOP_CONFIG.SCREEN_WIDTH / LAPTOP_CONFIG.SCREEN_HEIGHT

  return (
    <group ref={rootRef} position={[0, -0.4, 0]}>
      {/* BASE DO NOTEBOOK */}
      <group position={[0, 0, 0]}>
        {/* Chassis inferior */}
        <RoundedBox
          args={[
            LAPTOP_CONFIG.BASE_WIDTH,
            LAPTOP_CONFIG.BASE_HEIGHT,
            LAPTOP_CONFIG.BASE_DEPTH,
          ]}
          radius={0.03}
          smoothness={4}
        >
          <meshStandardMaterial
            color={LAPTOP_CONFIG.METAL_COLOR}
            metalness={0.88}
            roughness={0.28}
          />
        </RoundedBox>

        {/* Friso vermelho frontal sutil (assinatura Zuse) */}
        <mesh position={[0, 0, LAPTOP_CONFIG.BASE_DEPTH / 2 + 0.001]}>
          <planeGeometry args={[0.5, 0.015]} />
          <meshBasicMaterial color={LAPTOP_CONFIG.ACCENT_RED} />
        </mesh>

        {/* Rebaixo do teclado */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2 + 0.001, -0.22]}
        >
          <planeGeometry args={[2.7, 1.15]} />
          <meshStandardMaterial
            color={LAPTOP_CONFIG.KEYBOARD_COLOR}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Linhas procedurais de teclas */}
        <group position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2 + 0.002, -0.22]}>
          {[-0.38, -0.19, 0, 0.19, 0.38].map((yOffset, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, yOffset]}>
              <planeGeometry args={[2.62, 0.14]} />
              <meshStandardMaterial
                color="#0f1012"
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Trackpad */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2 + 0.001, 0.62]}
        >
          <planeGeometry args={[0.95, 0.62]} />
          <meshStandardMaterial
            color={LAPTOP_CONFIG.TRACKPAD_COLOR}
            roughness={0.35}
            metalness={0.75}
          />
        </mesh>
      </group>

      {/* DOBRADIÇA E TAMPA */}
      {/* Ponto de rotação localizado na parte traseira da base */}
      <group
        ref={hingeRef}
        position={[0, LAPTOP_CONFIG.BASE_HEIGHT / 2, -LAPTOP_CONFIG.BASE_DEPTH / 2 + 0.04]}
      >
        {/* Tampa do display (centralizada em relação à dobradiça) */}
        <group position={[0, LAPTOP_CONFIG.LID_DEPTH / 2, 0]}>
          {/* Carcaça traseira da tampa */}
          <RoundedBox
            args={[
              LAPTOP_CONFIG.LID_WIDTH,
              LAPTOP_CONFIG.LID_DEPTH,
              LAPTOP_CONFIG.LID_HEIGHT,
            ]}
            radius={0.03}
            smoothness={4}
          >
            <meshStandardMaterial
              color={LAPTOP_CONFIG.METAL_COLOR}
              metalness={0.9}
              roughness={0.24}
            />
          </RoundedBox>

          {/* Moldura frontal preta (Bezel) */}
          <mesh position={[0, 0, LAPTOP_CONFIG.LID_HEIGHT / 2 + 0.001]}>
            <planeGeometry
              args={[LAPTOP_CONFIG.LID_WIDTH - 0.04, LAPTOP_CONFIG.LID_DEPTH - 0.04]}
            />
            <meshStandardMaterial
              color={LAPTOP_CONFIG.BEZEL_COLOR}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          {/* Câmera / notch pequeno */}
          <mesh position={[0, LAPTOP_CONFIG.LID_DEPTH / 2 - 0.06, LAPTOP_CONFIG.LID_HEIGHT / 2 + 0.002]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* TELA DO NOTEBOOK (ScreenMaterial) */}
          <mesh
            ref={screenMeshRef}
            position={[0, -0.01, LAPTOP_CONFIG.LID_HEIGHT / 2 + 0.002]}
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

          {/* Vidro protetor com leve reflexo estético */}
          <mesh position={[0, -0.01, LAPTOP_CONFIG.LID_HEIGHT / 2 + 0.003]}>
            <planeGeometry
              args={[LAPTOP_CONFIG.SCREEN_WIDTH, LAPTOP_CONFIG.SCREEN_HEIGHT]}
            />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.1}
              transparent={true}
              opacity={0.05}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}
