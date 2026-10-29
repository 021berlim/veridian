"use client"

import { Environment, Lightformer } from "@react-three/drei"

export function Lights() {
  return (
    <>
      {/* Luz ambiente suave para leitura dos volumes escuros */}
      <ambientLight intensity={0.55} color="#ffffff" />

      {/* Key light direcional principal */}
      <directionalLight
        position={[4, 5, 4]}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Fill light oposta fria */}
      <directionalLight
        position={[-4, 2, -2]}
        intensity={0.4}
        color="#8a8f98"
      />

      {/* Assinatura Zuse: Rim light vermelha sutil vinda de baixo/trás */}
      <directionalLight
        position={[0, -3, -2]}
        intensity={0.6}
        color="#c72c3b"
      />

      {/* Environment com Lightformers procedurais (sem downloads externos de HDR) */}
      <Environment resolution={256}>
        {/* Softbox superior */}
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[0, 5, -2]}
          scale={[10, 5, 1]}
          target={[0, 0, 0]}
        />

        {/* Linha de reflexo lateral */}
        <Lightformer
          form="rect"
          intensity={2}
          position={[-5, 1, 2]}
          scale={[0.5, 8, 1]}
          color="#ffffff"
        />

        {/* Reflexo direito metálico */}
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[5, 1, 2]}
          scale={[0.5, 8, 1]}
          color="#8a8f98"
        />

        {/* Sutil acento vermelho refletido nos chanfros */}
        <Lightformer
          form="ring"
          intensity={0.8}
          position={[0, -2, 1]}
          scale={3}
          color="#c72c3b"
        />
      </Environment>
    </>
  )
}
