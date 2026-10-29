"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox, ContactShadows } from "@react-three/drei"
import {
  MathUtils,
  Group,
  Shape,
  ShapeGeometry,
  BufferAttribute,
} from "three"
import { ScreenMaterial } from "./ScreenMaterial"
import type { ScreenSource } from "./types"

export const PHONE_CONFIG = {
  BODY_WIDTH: 1.0,
  BODY_HEIGHT: 2.1,
  BODY_DEPTH: 0.11,
  BODY_RADIUS: 0.12,
  SCREEN_WIDTH: 0.94,
  SCREEN_HEIGHT: 2.04,
  SCREEN_RADIUS: 0.08,
  ISLAND_WIDTH: 0.24,
  ISLAND_HEIGHT: 0.06,
  METAL_COLOR: "#18191c",
  BEZEL_COLOR: "#070708",
  ACCENT_RED: "#c72c3b",
} as const

interface PhoneProps {
  screen?: ScreenSource
  active: boolean
}

function createRoundedRectShape(w: number, h: number, r: number) {
  const shape = new Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

export function Phone({ screen, active }: PhoneProps) {
  const rootRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!rootRef.current) return
    const targetScale = active ? 1 : 0.0001
    const currentScale = rootRef.current.scale.x
    const newScale = MathUtils.damp(currentScale, targetScale, 6, delta)
    rootRef.current.scale.setScalar(newScale)
    rootRef.current.visible = newScale > 0.01
  })

  // Geometria da tela com cantos arredondados e UVs normalizados [0, 1]
  const screenGeometry = useMemo(() => {
    const shape = createRoundedRectShape(
      PHONE_CONFIG.SCREEN_WIDTH,
      PHONE_CONFIG.SCREEN_HEIGHT,
      PHONE_CONFIG.SCREEN_RADIUS,
    )
    const geom = new ShapeGeometry(shape, 12)
    const pos = geom.attributes.position
    const uvs = new Float32Array(pos.count * 2)
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) + PHONE_CONFIG.SCREEN_WIDTH / 2) / PHONE_CONFIG.SCREEN_WIDTH
      const v = (pos.getY(i) + PHONE_CONFIG.SCREEN_HEIGHT / 2) / PHONE_CONFIG.SCREEN_HEIGHT
      uvs[i * 2] = u
      uvs[i * 2 + 1] = v
    }
    geom.setAttribute("uv", new BufferAttribute(uvs, 2))
    return geom
  }, [])

  const screenAspect = PHONE_CONFIG.SCREEN_WIDTH / PHONE_CONFIG.SCREEN_HEIGHT

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* Sombra de contato exclusiva e proporcional ao Celular */}
      <ContactShadows
        position={[0, -PHONE_CONFIG.BODY_HEIGHT / 2 - 0.02, 0]}
        opacity={0.5}
        scale={[1.5, 0.9]}
        blur={1.8}
        far={2}
        frames={1}
      />

      {/* 1. CORPO METÁLICO ARREDONDADO */}
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

      {/* Botão Power lateral direito com acento sutil */}
      <mesh position={[PHONE_CONFIG.BODY_WIDTH / 2 + 0.004, 0.2, 0]}>
        <boxGeometry args={[0.012, 0.22, 0.035]} />
        <meshStandardMaterial
          color={PHONE_CONFIG.ACCENT_RED}
          metalness={0.8}
          roughness={0.28}
        />
      </mesh>

      {/* Botões de volume lateral esquerdo */}
      <mesh position={[-PHONE_CONFIG.BODY_WIDTH / 2 - 0.004, 0.32, 0]}>
        <boxGeometry args={[0.012, 0.16, 0.035]} />
        <meshStandardMaterial color="#222327" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-PHONE_CONFIG.BODY_WIDTH / 2 - 0.004, 0.12, 0]}>
        <boxGeometry args={[0.012, 0.16, 0.035]} />
        <meshStandardMaterial color="#222327" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 2. TELA DIGITAL (normal +Z, z = 0.056) */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.056]}>
        <ScreenMaterial
          source={screen}
          geometryAspect={screenAspect}
          isActive={active}
        />
      </mesh>

      {/* 3. ILHA DINÂMICA (z = 0.057) */}
      <group position={[0, PHONE_CONFIG.SCREEN_HEIGHT / 2 - 0.12, 0.057]}>
        <RoundedBox
          args={[PHONE_CONFIG.ISLAND_WIDTH, PHONE_CONFIG.ISLAND_HEIGHT, 0.001]}
          radius={PHONE_CONFIG.ISLAND_HEIGHT / 2}
          smoothness={4}
        >
          <meshBasicMaterial color="#000000" />
        </RoundedBox>
        {/* Sensor de câmera frontal */}
        <mesh position={[0.06, 0, 0.001]}>
          <circleGeometry args={[0.01, 16]} />
          <meshBasicMaterial color="#1a1c22" />
        </mesh>
      </group>

      {/* 4. VIDRO PROTETOR LEVEMENTE REFLEXIVO (z = 0.058) */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.058]}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.06}
          metalness={0.08}
          transparent={true}
          opacity={0.04}
        />
      </mesh>
    </group>
  )
}
