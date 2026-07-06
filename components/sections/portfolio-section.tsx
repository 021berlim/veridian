"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { landingContent, projects } from "@/data/site"
import { cn } from "@/lib/utils"

type Project = (typeof projects)[number]

function ProjectImage({
  project,
  mouseX,
  mouseY,
}: {
  project: Project
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const imgX = useTransform(mouseX, (v) => v * 14)
  const imgY = useTransform(mouseY, (v) => v * 10)
  const scale = useTransform(mouseX, (v) => 1 + Math.abs(v) * 0.02)

  return (
    <motion.div
      className="relative aspect-[5/4] w-full overflow-hidden"
      style={{ x: imgX, y: imgY, scale }}
    >
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 560px"
        priority={project.slug === "alpha"}
      />
    </motion.div>
  )
}

function ProjectSlide({ project }: { project: Project }) {
  const slideRef = useRef<HTMLDivElement>(null)
  const mouseX = useSpring(0, { stiffness: 120, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 120, damping: 20 })

  const labelX = useTransform(mouseX, (v) => v * 4)
  const labelY = useTransform(mouseY, (v) => v * 3)
  const titleX = useTransform(mouseX, (v) => v * 8)
  const titleY = useTransform(mouseY, (v) => v * 5)
  const descX = useTransform(mouseX, (v) => v * 6)
  const descY = useTransform(mouseY, (v) => v * 4)
  const tagsX = useTransform(mouseX, (v) => v * 7)
  const tagsY = useTransform(mouseY, (v) => v * 4)
  const btnX = useTransform(mouseX, (v) => v * 4)
  const btnY = useTransform(mouseY, (v) => v * 2)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = slideRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [mouseX, mouseY],
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <div
      ref={slideRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="mx-auto grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14 lg:gap-16"
    >
      <ProjectImage project={project} mouseX={mouseX} mouseY={mouseY} />

      <div className="flex flex-col justify-center md:pl-4 lg:pl-6">
        <motion.p
          className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          style={{ x: labelX, y: labelY }}
        >
          {project.label}
        </motion.p>

        <motion.h3
          className="font-serif text-3xl leading-tight text-foreground md:text-4xl lg:text-[2.75rem]"
          style={{ x: titleX, y: titleY }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base"
          style={{ x: descX, y: descY }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5"
          style={{ x: tagsX, y: tagsY }}
        >
          {project.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-3">
              {i > 0 && <span className="text-border">·</span>}
              <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {tag}
              </span>
            </span>
          ))}
        </motion.div>

        <motion.div className="mt-8 border-t border-border/40 pt-6" style={{ x: btnX, y: btnY }}>
          <button
            type="button"
            className="group inline-flex items-center gap-3 text-sm text-foreground transition-opacity hover:opacity-70"
          >
            <span className="border-b border-foreground pb-0.5">Ver mais</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export function PortfolioSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section id="trabalhos" className="overflow-hidden py-10 md:py-14">
      <Container>
        <Reveal className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                {landingContent.portfolio.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {landingContent.portfolio.subtitle}
              </p>
            </div>
            <p className="shrink-0 font-serif text-sm text-muted-foreground">
              {String(current + 1).padStart(2, "0")}{" "}
              <span className="text-border">/</span>{" "}
              {String(projects.length).padStart(2, "0")}
            </p>
          </div>
        </Reveal>

        <div className="flex items-center gap-5 md:gap-10 lg:gap-16">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="hidden shrink-0 items-center justify-center text-foreground transition-opacity hover:opacity-50 sm:flex sm:h-10 sm:w-10 md:h-12 md:w-12"
            aria-label="Projeto anterior"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.25} />
          </button>

          <div className="min-w-0 flex-1">
            <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
              <CarouselContent className="ml-0">
                {projects.map((project) => (
                  <CarouselItem key={project.slug} className="basis-full pl-0">
                    <ProjectSlide project={project} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="mt-8 flex items-center justify-center gap-2">
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Ir para ${project.title}`}
                  aria-current={current === index ? "true" : undefined}
                  className={cn(
                    "h-px transition-all duration-500",
                    current === index
                      ? "w-8 bg-foreground"
                      : "w-3 bg-foreground/20 hover:bg-foreground/40",
                  )}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="hidden shrink-0 items-center justify-center text-foreground transition-opacity hover:opacity-50 sm:flex sm:h-10 sm:w-10 md:h-12 md:w-12"
            aria-label="Próximo projeto"
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.25} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 sm:hidden">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="flex h-10 w-10 items-center justify-center text-foreground transition-opacity hover:opacity-50"
            aria-label="Projeto anterior"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="flex h-10 w-10 items-center justify-center text-foreground transition-opacity hover:opacity-50"
            aria-label="Próximo projeto"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
      </Container>
    </section>
  )
}