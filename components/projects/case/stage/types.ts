export type DeviceKind = 'laptop' | 'phone'

export type ScreenSource = {
  type: 'image' | 'video'
  src: string
  poster?: string
}

export type ProjectScreens = {
  laptop?: ScreenSource
  phone?: ScreenSource
}

export type DeviceStageProps = {
  screens: ProjectScreens
  defaultDevice?: DeviceKind
  device?: DeviceKind
  onDeviceChange?: (d: DeviceKind) => void
  height?: string
  showToggle?: boolean
  showHint?: boolean
  paused?: boolean
  className?: string
}
