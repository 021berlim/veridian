"use client"

import dynamic from "next/dynamic"
import type { ProjectScreens, DeviceKind } from "@/components/projects/case/stage/types"

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
      className="relative flex h-[70vh] min-h-[480px] w-full items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#8a8f98]">
        <div className="h-6 w-6 rounded-full border-2 border-[#c72c3b] border-t-transparent animate-spin" />
        <span className="tracking-widest uppercase">Carregando modelo 3D...</span>
      </div>
    </div>
  )
}

interface CaseStageWrapperProps {
  screens: ProjectScreens
  defaultDevice?: DeviceKind
  projectName?: string
}

export function CaseStageWrapper({
  screens,
  defaultDevice,
}: CaseStageWrapperProps) {
  return (
    <section aria-label="Aparelho 3D interativo" className="my-8 w-full">
      <div className="relative h-[70vh] min-h-[480px] w-full flex items-center justify-center">
        <DeviceStage
          screens={screens}
          defaultDevice={defaultDevice}
          height="70vh"
        />
      </div>
    </section>
  )
}
