"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CATEGORY_LABELS, type ProjectCategory } from "@/data/projects"

interface CaseHeaderProps {
  category: ProjectCategory
  year?: string
}

export function CaseHeader({ category, year }: CaseHeaderProps) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/#projetos")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  const categoryLabel = (CATEGORY_LABELS[category] || category).toUpperCase()
  const displayYear = year || "2025"

  return (
    <div className="flex items-center justify-between border-b border-[#2b2d31]/60 pb-6 pt-2 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
      {/* Esquerda: ponto vermelho + metadados */}
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-[#c72c3b] animate-pulse" />
        <span>
          CASE STUDY // <span className="text-white">{categoryLabel}</span> • {displayYear}
        </span>
      </div>

      {/* Direita: voltar + atalho ESC */}
      <div className="flex items-center gap-4">
        <Link
          href="/#projetos"
          className="group flex items-center gap-1.5 text-white transition-colors hover:text-[#c72c3b] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          <span>PROJETOS</span>
        </Link>
        <span className="hidden sm:inline-block rounded border border-[#2b2d31] bg-[#141518] px-2 py-0.5 text-[10px] text-[#8a8f98]">
          ESC
        </span>
      </div>
    </div>
  )
}
