"use client"

import dynamic from "next/dynamic"
import type { ProjectScreens } from "@/components/projects/case/stage/types"

const DeviceStage = dynamic(
  () => import("@/components/projects/case/stage/DeviceStage"),
  {
    ssr: false,
    loading: () => <StageSkeleton />,
  },
)

function StageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando visualização 3D do projeto"
      className="relative flex h-[70vh] min-h-[480px] w-full items-center justify-center rounded-2xl border border-[#2b2d31]/50 bg-[#111215] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
      <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#8a8f98]">
        <div className="h-6 w-6 rounded-full border-2 border-[#c72c3b] border-t-transparent animate-spin" />
        <span className="tracking-widest uppercase">Carregando modelo 3D...</span>
      </div>
    </div>
  )
}

interface CaseStageWrapperProps {
  screens: ProjectScreens
  projectName: string
}

export function CaseStageWrapper({ screens }: CaseStageWrapperProps) {
  return (
    <section aria-label="Aparelho 3D interativo" className="my-10 w-full">
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0e0f12]">
        <DeviceStage screens={screens} />
      </div>

      {/* Dica de interação mono */}
      <div className="mt-4 flex items-center justify-center text-center font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]">
        <span>ARRASTE PARA GIRAR // CLIQUE PARA TROCAR</span>
      </div>
    </section>
  )
}
