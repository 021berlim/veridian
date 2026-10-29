"use client"

import { motion } from "framer-motion"
import type { ProjectCategory } from "@/data/projects"
import { CATEGORY_LABELS } from "@/data/projects"
import { cn } from "@/lib/utils"

interface FilterTabsProps {
  availableCategories: ProjectCategory[]
  activeCategory: ProjectCategory | "all"
  onSelectCategory: (category: ProjectCategory | "all") => void
  reducedMotion?: boolean
}

export function FilterTabs({
  availableCategories,
  activeCategory,
  onSelectCategory,
  reducedMotion = false,
}: FilterTabsProps) {
  const tabs: Array<{ id: ProjectCategory | "all"; label: string }> = [
    { id: "all", label: "Todos" },
    ...availableCategories.map((cat) => ({
      id: cat,
      label: CATEGORY_LABELS[cat] || cat,
    })),
  ]

  return (
    <div
      role="tablist"
      aria-label="Filtrar projetos por categoria"
      className="flex flex-wrap items-center gap-6 sm:gap-8 border-b border-[#2b2d31]/60 pb-3"
    >
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="projects-list"
            onClick={() => onSelectCategory(tab.id)}
            className={cn(
              "group relative pb-2 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:text-white",
              isActive ? "text-white" : "text-[#8a8f98] hover:text-white",
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId={reducedMotion ? undefined : "project-filter-underline"}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c72c3b]"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
