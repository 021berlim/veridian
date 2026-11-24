"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { CATEGORY_LABELS, type Project } from "@/data/projects"
import { cn } from "@/lib/utils"

export const DESKTOP_BENTO_BATCH_SIZE = 6

const CYCLIC_SIX_SPANS: readonly string[] = [
  "col-span-6 row-span-2", // 0
  "col-span-6 row-span-1", // 1
  "col-span-6 row-span-1", // 2
  "col-span-4 row-span-1", // 3
  "col-span-4 row-span-1", // 4
  "col-span-4 row-span-1", // 5
] as const

/**
 * Calcula dinamicamente o col-span e row-span de cada card no grid de 12 colunas
 * com base na quantidade total de projetos visíveis, evitando lacunas ou órfãos.
 */
export function getCardSpanClass(index: number, total: number): string {
  if (total <= 1) {
    return "col-span-12 row-span-2"
  }

  if (total === 2) {
    return "col-span-6 row-span-2"
  }

  if (total === 3) {
    return index === 0 ? "col-span-7 row-span-2" : "col-span-5 row-span-1"
  }

  if (total === 4) {
    return "col-span-6 row-span-1"
  }

  if (total === 5) {
    return index === 0 ? "col-span-6 row-span-2" : "col-span-6 row-span-1"
  }

  // total >= 6: blocos cíclicos de 6 + ajuste determinístico para sobra na última linha
  const remainder = total % 6
  const fullBlocksEnd = total - remainder

  if (index < fullBlocksEnd) {
    return CYCLIC_SIX_SPANS[index % 6]
  }

  const remIndex = index - fullBlocksEnd

  if (remainder === 1) {
    return "col-span-12 row-span-1"
  }

  if (remainder === 2) {
    return "col-span-6 row-span-1"
  }

  if (remainder === 3) {
    return remIndex === 0 ? "col-span-7 row-span-2" : "col-span-5 row-span-1"
  }

  if (remainder === 4) {
    return "col-span-6 row-span-1"
  }

  // remainder === 5
  return remIndex === 0 ? "col-span-6 row-span-2" : "col-span-6 row-span-1"
}

function resolvePreviewSrc(project: Project): string | undefined {
  return (
    project.screens.laptop?.src ??
    project.screens.phone?.src ??
    project.media?.find((m) => m.type === "image")?.src ??
    project.media?.[0]?.poster
  )
}

interface DesktopBentoGridProps {
  projects: readonly Project[]
  totalCount: number
  hasMore: boolean
  remainingCount: number
  onLoadMore: () => void
  onHoverStateChange?: (isHovered: boolean) => void
  reducedMotion?: boolean
}

export function DesktopBentoGrid({
  projects,
  totalCount,
  hasMore,
  remainingCount,
  onLoadMore,
  onHoverStateChange,
  reducedMotion = false,
}: DesktopBentoGridProps) {
  const visibleTotal = projects.length

  return (
    <div id="projects-list" className="w-full">
      <div
        role="list"
        aria-label={`Projetos em produção (${visibleTotal} de ${totalCount} exibidos)`}
        className="grid grid-cols-12 auto-rows-[220px] xl:auto-rows-[250px] gap-4 grid-flow-dense"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            const spanClass = getCardSpanClass(index, visibleTotal)
            const previewSrc = resolvePreviewSrc(project)
            const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category
            const stackPills = project.stack.slice(0, 3)

            return (
              <motion.article
                key={project.slug}
                role="listitem"
                layout={!reducedMotion}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: reducedMotion ? 0.15 : 0.45,
                    delay: reducedMotion
                      ? 0
                      : Math.min(index % DESKTOP_BENTO_BATCH_SIZE, 5) * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
                }
                className={cn(
                  spanClass,
                  "relative rounded-xl overflow-hidden bg-[#111113] border border-white/10 transition-[border-color,box-shadow] duration-300 hover:border-red-500/50 hover:shadow-[0_0_28px_-6px_rgba(199,44,59,0.3)] focus-within:border-red-500/60 focus-within:shadow-[0_0_28px_-6px_rgba(199,44,59,0.3)]",
                )}
              >
                <Link
                  href={`/projetos/${project.slug}`}
                  aria-label={`Ver case do projeto ${project.name} (${categoryLabel})`}
                  onMouseEnter={() => onHoverStateChange?.(true)}
                  onMouseLeave={() => onHoverStateChange?.(false)}
                  onFocus={() => onHoverStateChange?.(false)}
                  className="group relative flex h-full w-full flex-col justify-end cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c72c3b]"
                >
                  {/* Preview ocupando 100% do card, totalmente limpo no topo */}
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt={`Interface do sistema ${project.name}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top brightness-[0.82] saturate-[0.9] transition-all duration-500 ease-out group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.03] group-focus-visible:brightness-100 group-focus-visible:saturate-100 group-focus-visible:scale-[1.03]"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-[#18181b] to-[#0b0b0d]"
                    />
                  )}

                  {/* Degradê inferior permanente para contraste absoluto */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent"
                  />

                  {/* Rodapé: Estado minimalista em repouso + detalhes deslizantes no hover */}
                  <div className="relative z-10 p-4 lg:p-5">
                    <div className="flex items-end justify-between gap-3">
                      <h3 className="font-sans text-lg xl:text-xl font-semibold tracking-[-0.02em] text-white leading-snug">
                        {project.name}
                      </h3>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-white/75 transition-all duration-300 ease-out group-hover:text-[#c72c3b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:text-[#c72c3b] group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
                      />
                    </div>

                    {/* Detalhes revelados suavemente no hover / focus */}
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <div className="pt-2.5 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
                          <p className="text-xs xl:text-sm leading-relaxed text-[#d1d5db] line-clamp-2">
                            {project.tagline}
                          </p>

                          {stackPills.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              {stackPills.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/80 backdrop-blur-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Controle de volume (exibido apenas quando há mais de 6 projetos na categoria filtrada) */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="group relative inline-flex cursor-pointer items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] py-1 pr-1 pl-5 transition-all duration-300 hover:border-[#c72c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c72c3b]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-right scale-x-0 rounded-full bg-[#c72c3b] transition-transform duration-300 group-hover:scale-x-100"
            />
            <span className="relative z-10 pr-3 font-sans text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors duration-300">
              Carregar mais projetos (+{remainingCount})
            </span>
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-black/20">
              <Plus className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:rotate-90" />
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
