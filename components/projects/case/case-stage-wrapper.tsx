"use client"

import { ProjectMediaPreview } from "@/components/projects/case/stage/ProjectMediaPreview"
import type { ProjectScreens, DeviceKind } from "@/components/projects/case/stage/types"

interface CaseStageWrapperProps {
  screens: ProjectScreens
  defaultDevice?: DeviceKind
  projectName?: string
}

export function CaseStageWrapper({
  screens,
  projectName,
}: CaseStageWrapperProps) {
  return (
    <section aria-label="Visualização do projeto" className="my-8 w-full overflow-hidden">
      <div className="relative min-h-[420px] md:min-h-[520px] w-full flex items-center justify-center">
        <ProjectMediaPreview
          screens={screens}
          alt={projectName ? `Interface do sistema ${projectName}` : undefined}
        />
      </div>
    </section>
  )
}
