"use client"

import { useEffect, useRef, useState } from "react"
import { useThree } from "@react-three/fiber"
import {
  TextureLoader,
  VideoTexture,
  SRGBColorSpace,
  Texture,
  MeshBasicMaterial,
} from "three"
import type { ScreenSource } from "./types"

interface ScreenMaterialProps {
  source: ScreenSource
  geometryAspect: number // width / height da tela no modelo
  isActive?: boolean
}

export function ScreenMaterial({
  source,
  geometryAspect,
  isActive = true,
}: ScreenMaterialProps) {
  const { gl } = useThree()
  const [texture, setTexture] = useState<Texture | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    let currentTexture: Texture | null = null
    let isDisposed = false

    if (source.type === "video") {
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
      vidTex.anisotropy = gl.capabilities.getMaxAnisotropy()
      currentTexture = vidTex

      video.addEventListener("loadedmetadata", () => {
        if (isDisposed) return
        adjustTextureCover(vidTex, video.videoWidth / video.videoHeight, geometryAspect)
        setTexture(vidTex)
        if (isActive) {
          video.play().catch(() => {})
        }
      })
    } else {
      const loader = new TextureLoader()
      loader.load(source.src, (imgTex) => {
        if (isDisposed) {
          imgTex.dispose()
          return
        }
        imgTex.colorSpace = SRGBColorSpace
        imgTex.anisotropy = gl.capabilities.getMaxAnisotropy()
        const imageAspect = (imgTex.image?.width || 1) / (imgTex.image?.height || 1)
        adjustTextureCover(imgTex, imageAspect, geometryAspect)
        currentTexture = imgTex
        setTexture(imgTex)
      })
    }

    return () => {
      isDisposed = true
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ""
        videoRef.current.load()
        videoRef.current = null
      }
      if (currentTexture) {
        currentTexture.dispose()
      }
      setTexture(null)
    }
  }, [source, geometryAspect, gl])

  // Pausa/Play do vídeo se aparelho estiver inativo
  useEffect(() => {
    if (source.type === "video" && videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive, source.type])

  if (!texture) {
    return <meshBasicMaterial color="#0e0f12" />
  }

  return (
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      transparent={false}
    />
  )
}

/**
 * Ajusta texture.repeat e texture.offset para object-fit: cover sem distorção.
 */
function adjustTextureCover(texture: Texture, mediaAspect: number, targetAspect: number) {
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)

  if (!mediaAspect || !targetAspect) return

  if (mediaAspect > targetAspect) {
    // Mídia é mais larga que o alvo => corta as laterais
    const scale = targetAspect / mediaAspect
    texture.repeat.set(scale, 1)
    texture.offset.set((1 - scale) / 2, 0)
  } else {
    // Mídia é mais alta que o alvo => corta topo e base
    const scale = mediaAspect / targetAspect
    texture.repeat.set(1, scale)
    texture.offset.set(0, (1 - scale) / 2)
  }

  texture.needsUpdate = true
}
