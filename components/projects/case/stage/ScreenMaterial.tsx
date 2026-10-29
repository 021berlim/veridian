"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import {
  VideoTexture,
  SRGBColorSpace,
  DoubleSide,
  Texture,
  LinearFilter,
} from "three"
import type { ScreenSource } from "./types"

interface ScreenMaterialProps {
  source?: ScreenSource
  geometryAspect: number
  isActive?: boolean
}

function ImagePlane({
  url,
  geometryAspect,
}: {
  url: string
  geometryAspect: number
}) {
  const texture = useTexture(url)

  useMemo(() => {
    if (texture) {
      texture.colorSpace = SRGBColorSpace
      texture.needsUpdate = true
      const img = texture.image as HTMLImageElement | undefined
      adjustTextureCover(
        texture,
        (img?.width || 1) / (img?.height || 1),
        geometryAspect,
      )
    }
  }, [texture, geometryAspect])

  return (
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      side={DoubleSide}
    />
  )
}

function VideoPlane({
  source,
  geometryAspect,
  isActive,
}: {
  source: ScreenSource
  geometryAspect: number
  isActive: boolean
}) {
  const { gl } = useThree()
  const [texture, setTexture] = useState<Texture | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = document.createElement("video")
    video.src = source.src
    if (source.poster) video.poster = source.poster
    video.crossOrigin = "anonymous"
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true
    videoRef.current = video

    const vidTex = new VideoTexture(video)
    vidTex.colorSpace = SRGBColorSpace
    vidTex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8)
    vidTex.minFilter = LinearFilter
    vidTex.magFilter = LinearFilter

    const handleLoaded = () => {
      adjustTextureCover(vidTex, video.videoWidth / video.videoHeight, geometryAspect)
      vidTex.needsUpdate = true
      setTexture(vidTex)
      if (isActive) {
        video.play().catch(() => {})
      }
    }

    video.addEventListener("loadedmetadata", handleLoaded)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded)
      video.pause()
      video.src = ""
      video.load()
      vidTex.dispose()
    }
  }, [source.src, source.poster, geometryAspect, gl, isActive])

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive])

  if (!texture) {
    return (
      <meshBasicMaterial
        color="#111215"
        side={DoubleSide}
      />
    )
  }

  return (
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      side={DoubleSide}
    />
  )
}

export function ScreenMaterial({
  source,
  geometryAspect,
  isActive = true,
}: ScreenMaterialProps) {
  if (!source?.src) {
    return (
      <meshBasicMaterial
        color="#111215"
        side={DoubleSide}
      />
    )
  }

  if (source.type === "video") {
    return (
      <VideoPlane
        source={source}
        geometryAspect={geometryAspect}
        isActive={isActive}
      />
    )
  }

  return (
    <Suspense
      fallback={
        <meshBasicMaterial
          color="#111215"
          side={DoubleSide}
        />
      }
    >
      <ImagePlane url={source.src} geometryAspect={geometryAspect} />
    </Suspense>
  )
}

function adjustTextureCover(
  texture: Texture,
  mediaAspect: number,
  targetAspect: number,
) {
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)

  if (!mediaAspect || !targetAspect || isNaN(mediaAspect) || isNaN(targetAspect)) {
    return
  }

  if (mediaAspect > targetAspect) {
    const scale = targetAspect / mediaAspect
    texture.repeat.set(scale, 1)
    texture.offset.set((1 - scale) / 2, 0)
  } else {
    const scale = mediaAspect / targetAspect
    texture.repeat.set(1, scale)
    texture.offset.set(0, (1 - scale) / 2)
  }
}
