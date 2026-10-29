"use client"

import { useState } from "react"
import Image from "next/image"
import type { DeviceKind, DeviceStageProps } from "./types"
import { cn } from "@/lib/utils"

export function StaticFallback({
  screens,
  defaultDevice,
  device: controlledDevice,
  onDeviceChange,
  className,
}: DeviceStageProps) {
  const hasLaptop = Boolean(screens.laptop)
  const hasPhone = Boolean(screens.phone)
  const initial =
    defaultDevice || (hasLaptop ? "laptop" : hasPhone ? "phone" : "laptop")

  const [uncontrolledDevice, setUncontrolledDevice] = useState<DeviceKind>(initial)
  const currentDevice = controlledDevice ?? uncontrolledDevice

  const setDevice = (d: DeviceKind) => {
    if (controlledDevice === undefined) {
      setUncontrolledDevice(d)
    }
    onDeviceChange?.(d)
  }

  const activeSource =
    currentDevice === "phone" && screens.phone
      ? screens.phone
      : screens.laptop || screens.phone

  if (!activeSource) return null

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center select-none",
        className,
      )}
    >
      {/* Botões Simples se ambos os aparelhos existirem */}
      {hasLaptop && hasPhone && (
        <div className="absolute top-4 z-20 flex items-center gap-6">
          <button
            type="button"
            onClick={() => setDevice("laptop")}
            className={cn(
              "font-mono text-xs uppercase tracking-widest transition-colors",
              currentDevice === "laptop"
                ? "text-white underline decoration-[#c72c3b] decoration-2 underline-offset-8"
                : "text-[#8a8f98] hover:text-white",
            )}
          >
            NOTEBOOK
          </button>
          <button
            type="button"
            onClick={() => setDevice("phone")}
            className={cn(
              "font-mono text-xs uppercase tracking-widest transition-colors",
              currentDevice === "phone"
                ? "text-white underline decoration-[#c72c3b] decoration-2 underline-offset-8"
                : "text-[#8a8f98] hover:text-white",
            )}
          >
            CELULAR
          </button>
        </div>
      )}

      {/* Imagem estática limpa, flutuando sem moldura */}
      <div className="flex h-full w-full items-center justify-center p-4">
        {activeSource.type === "video" ? (
          <video
            src={activeSource.src}
            poster={activeSource.poster}
            autoPlay
            muted
            loop
            playsInline
            className={cn(
              "object-contain drop-shadow-2xl",
              currentDevice === "phone" ? "max-h-[80%] max-w-[280px]" : "max-h-[85%] max-w-full",
            )}
          />
        ) : (
          <Image
            src={activeSource.src}
            alt="Pré-visualização do projeto"
            width={1200}
            height={800}
            className={cn(
              "object-contain drop-shadow-2xl",
              currentDevice === "phone" ? "max-h-[80%] max-w-[280px]" : "max-h-[85%] max-w-full",
            )}
          />
        )}
      </div>
    </div>
  )
}
