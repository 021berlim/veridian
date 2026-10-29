"use client"

import { useState } from "react"
import Image from "next/image"
import type { DeviceKind, ProjectScreens } from "./types"
import { cn } from "@/lib/utils"

interface StaticFallbackProps {
  screens: ProjectScreens
  initialDevice?: DeviceKind
  className?: string
}

export function StaticFallback({
  screens,
  initialDevice = "laptop",
  className,
}: StaticFallbackProps) {
  const [device, setDevice] = useState<DeviceKind>(
    screens.phone && initialDevice === "phone" ? "phone" : "laptop",
  )

  const activeSource = device === "phone" && screens.phone ? screens.phone : screens.laptop

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-between p-6",
        className,
      )}
    >
      {/* Botões Acessíveis de Seleção de Aparelho */}
      <div className="z-20 flex items-center gap-3">
        <button
          type="button"
          aria-pressed={device === "laptop"}
          aria-label="Visualizar em Notebook"
          onClick={() => setDevice("laptop")}
          className={cn(
            "rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]",
            device === "laptop"
              ? "border-[#c72c3b] bg-[#c72c3b]/15 text-white"
              : "border-[#2b2d31] bg-[#141518] text-[#8a8f98] hover:border-white/30",
          )}
        >
          NOTEBOOK
        </button>

        <button
          type="button"
          aria-pressed={device === "phone"}
          aria-label="Visualizar em Celular"
          onClick={() => setDevice("phone")}
          className={cn(
            "rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]",
            device === "phone"
              ? "border-[#c72c3b] bg-[#c72c3b]/15 text-white"
              : "border-[#2b2d31] bg-[#141518] text-[#8a8f98] hover:border-white/30",
          )}
        >
          CELULAR
        </button>
      </div>

      {/* Moldura CSS Estática do Aparelho */}
      <div className="flex flex-1 items-center justify-center w-full py-4">
        {device === "laptop" ? (
          <div className="relative aspect-[16/10] w-full max-w-2xl overflow-hidden rounded-xl border border-[#2b2d31] bg-[#111215] p-2 shadow-2xl">
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#0b0b0d]">
              {activeSource.type === "video" ? (
                <video
                  src={activeSource.src}
                  poster={activeSource.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={activeSource.src}
                  alt="Visualização do projeto em notebook"
                  width={1200}
                  height={750}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="relative aspect-[9/19.5] h-[360px] max-w-[200px] overflow-hidden rounded-[2rem] border-4 border-[#2b2d31] bg-[#111215] p-1.5 shadow-2xl">
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-[#0b0b0d]">
              {activeSource.type === "video" ? (
                <video
                  src={activeSource.src}
                  poster={activeSource.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={activeSource.src}
                  alt="Visualização do projeto em celular"
                  width={600}
                  height={1300}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>

      <span className="font-mono text-[10px] text-[#8a8f98] tracking-widest uppercase">
        Modo Acessível // Visualização Estática
      </span>
    </div>
  )
}
