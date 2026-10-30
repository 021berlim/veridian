"use client"

import { ProjectMediaPreview } from "./ProjectMediaPreview"
import type { DeviceStageProps } from "./types"

export { ProjectMediaPreview }
export default function DeviceStage(props: DeviceStageProps) {
  return <ProjectMediaPreview screens={props.screens} className={props.className} />
}
