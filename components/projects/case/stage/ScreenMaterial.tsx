"use client"

import { useEffect, useRef, useState } from "react"
import { useThree } from "@react-three/fiber"
import {
  TextureLoader,
  VideoTexture,
  SRGBColorSpace,
  Texture,
  LinearMipmapLinearFilter,
  LinearFilter,
} from "three"
import type { ScreenSource } from "./types"

interface ScreenMaterialProps {
  source?: ScreenSource
  geometryAspect: number
  isActive?: boolean
}

// Cache global em memória para evitar recarregar a mesma textura ao trocar de projeto
const textureCache = new Map<string, Texture>()

export function ScreenMaterial({
  source,
  geometryAspect,
  isActive = true,
}: ScreenMaterialProps) {
  const { gl } = useThree()
  const [texture, setTexture] = useState<Texture | null>(() => {
    if (source?.src && textureCache.has(source.src)) {
      return textureCache.get(source.src)!
    }
    return null
  })
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!source?.src) {
      setTexture(null)
      return
    }

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
      vidTex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8)
      vidTex.minFilter = LinearFilter
      vidTex.magFilter = LinearFilter

      video.addEventListener("loadedmetadata", () => {
        if (isDisposed) return
        adjustTextureCover(vidTex, video.videoWidth / video.videoHeight, geometryAspect)
        vidTex.needsUpdate = true
        setTexture(vidTex)
        if (isActive) {
          video.play().catch(() => {})
        }
      })

      return () => {
        isDisposed = true
        video.pause()
        video.src = ""
        video.load()
        vidTex.dispose()
      }
    }

    // Carregamento de imagem (PNG/JPG/WebP/SVG)
    if (textureCache.has(source.src)) {
      const cached = textureCache.get(source.src)!
      const img = cached.image as HTMLImageElement | undefined
      adjustTextureCover(
        cached,
        (img?.width || 1) / (img?.height || 1),
        geometryAspect,
      )
      cached.needsUpdate = true
      setTexture(cached)
      return
    }

    const loader = new TextureLoader()
    loader.load(
      source.src,
      (imgTex) => {
        if (isDisposed) {
          imgTex.dispose()
          return
        }
        imgTex.colorSpace = SRGBColorSpace
        imgTex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8)
        imgTex.minFilter = LinearMipmapLinearFilter
        imgTex.magFilter = LinearFilter
        imgTex.generateMipmaps = true

        const img = imgTex.image as HTMLImageElement | undefined
        const imgAspect = (img?.width || 1) / (img?.height || 1)
        adjustTextureCover(imgTex, imgAspect, geometryAspect)
        imgTex.needsUpdate = true

        textureCache.set(source.src, imgTex)
        setTexture(imgTex)
      },
      undefined,
      (err) => {
        console.warn(`[ScreenMaterial] Falha ao carregar textura: ${source.src}`, err)
      },
    )

    return () => {
      isDisposed = true
    }
  }, [source?.src, source?.type, geometryAspect, gl, isActive])

  // Pausa/Play do vídeo se aparelho estiver inativo
  useEffect(() => {
    if (source?.type === "video" && videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive, source?.type])

  if (!texture) {
    return (
      <meshBasicMaterial
        color="#111215"
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    )
  }

  return (
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      polygonOffset
      polygonOffsetFactor={-1}
      polygonOffsetUnits={-1}
    />
  )
}

/**
 * Ajusta texture.repeat e texture.offset para object-fit: cover sem distorção.
 */
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
    // Mídia é mais larga que o alvo: corta nas laterais
    const scale = targetAspect / mediaAspect
    texture.repeat.set(scale, 1)
    texture.offset.set((1 - scale) / 2, 0)
  } else {
    // Mídia é mais alta que o alvo: corta topo/base
    const scale = mediaAspect / targetAspect
    texture.repeat.set(1, scale)
    texture.offset.set(0, (1 - scale) / 2)
  }
}
