export type DeviceKind = 'laptop' | 'phone'
export type ScreenSource = { type: 'image' | 'video'; src: string; poster?: string }
export type ProjectScreens = { laptop: ScreenSource; phone?: ScreenSource }
export type DeviceStageProps = { screens: ProjectScreens; initialDevice?: DeviceKind; accent?: string; className?: string }
