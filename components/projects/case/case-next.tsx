import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/data/projects"

interface CaseNextProps {
  nextProject: Project
}

export function CaseNext({ nextProject }: CaseNextProps) {
  return (
    <div className="border-t border-[#2b2d31]/60 pt-16 pb-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8a8f98] block mb-3">
            PRÓXIMO PROJETO // {nextProject.category.toUpperCase()}
          </span>
          <Link
            href={`/projetos/${nextProject.slug}`}
            className="group inline-flex items-center gap-4 text-3xl sm:text-5xl md:text-6xl font-light font-sans text-white hover:text-[#c72c3b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
          >
            <span>{nextProject.name}</span>
            <ArrowUpRight className="h-8 w-8 sm:h-12 sm:w-12 text-[#8a8f98] transition-transform duration-300 group-hover:text-[#c72c3b] group-hover:translate-x-2 group-hover:-translate-y-2" />
          </Link>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-[#8a8f98]">
            {nextProject.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}
