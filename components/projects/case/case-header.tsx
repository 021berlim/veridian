"use client"

import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { scrollToSection } from "@/lib/scroll"

export function CaseHeader() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        scrollToSection("#projetos")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex items-center justify-between border-b border-[#2b2d31]/60 pb-5 pt-3 font-mono text-xs uppercase tracking-wider">
      <button
        type="button"
        onClick={() => scrollToSection("#projetos")}
        className="group inline-flex items-center gap-2.5 text-white transition-colors hover:text-[#c72c3b] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c72c3b]"
      >
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#16171b] border border-[#2b2d31] transition-transform duration-200 group-hover:-translate-x-1 group-hover:border-[#c72c3b]">
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
        <span className="font-medium tracking-widest text-[#e5e7eb] group-hover:text-[#c72c3b]">
          Voltar aos projetos
        </span>
        <span className="hidden sm:inline-block ml-1.5 rounded border border-[#2b2d31] bg-[#141518] px-1.5 py-0.5 text-[10px] text-[#8a8f98]">
          ESC
        </span>
      </button>
    </div>
  )
}

export default CaseHeader
