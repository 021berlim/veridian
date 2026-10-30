"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Maximize2, Layers } from "lucide-react"
import type { Project, ScreenSource } from "@/data/projects"
import { getProjectMedia, CATEGORY_LABELS } from "@/data/projects"
import { MediaZoomModal } from "./media-zoom-modal"

interface CaseArticleProps {
  project: Project
}

export function CaseArticle({ project }: CaseArticleProps) {
  const mediaList = getProjectMedia(project)
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  // A primeira mídia é o destaque de abertura do artigo
  const heroMedia = mediaList[0]
  // As imagens que irão para a Galeria inferior (todas as telas cadastradas)
  const galleryImages = mediaList.filter((m) => m.type !== "video")
  const videoItems = mediaList.filter((m) => m.type === "video")

  const editorial = project.editorial

  const handleOpenZoom = (mediaSrc: string) => {
    const idx = mediaList.findIndex((m) => m.src === mediaSrc)
    setZoomIndex(idx >= 0 ? idx : 0)
  }

  return (
    <article className="w-full text-white pb-16">
      {/* ==============================================================
          1. CABEÇALHO DO ARTIGO / HEADLINE & METADADOS (Estilo Jornalístico)
          Conforme imagem 2 de referência (joaomotta.app/projects/france)
          ============================================================== */}
      <header className="mt-8 mb-10 max-w-4xl space-y-5">
        {/* Título Principal em Tipografia Limpa e Forte */}
        <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.03em] text-white">
          {project.name}
        </h1>

        {/* Subtítulo / Resumo Executivo da Matéria */}
        <p className="font-sans text-lg sm:text-xl md:text-2xl font-light text-[#a1a7b4] leading-relaxed">
          {project.tagline}
        </p>

        {/* Badges de Stack Tecnológica + Categoria + Ano */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#16171b] border border-[#2b2d31] text-[#e5e7eb] shadow-sm"
            >
              {tech}
            </span>
          ))}

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#c72c3b]/10 border border-[#c72c3b]/40 text-[#c72c3b] ml-auto">
            {CATEGORY_LABELS[project.category] || project.category} // {project.year || "2025"}
          </span>
        </div>
      </header>

      {/* ==============================================================
          2. IMAGEM DE ABERTURA EDITORIAL (FIGURA HERO)
          Com cantos arredondados, borda hairline, sem carcaça de mockup e clique para zoom
          ============================================================== */}
      {heroMedia && (
        <section aria-label="Imagem de destaque do artigo" className="mb-14">
          <div
            onClick={() => handleOpenZoom(heroMedia.src)}
            className="group relative w-full aspect-[16/10] max-h-[640px] overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in hover:border-[#c72c3b]/80 transition-colors"
          >
            {heroMedia.type === "video" ? (
              <video
                src={heroMedia.src}
                poster={heroMedia.poster}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            ) : (
              <Image
                src={heroMedia.src}
                alt={heroMedia.title || project.name}
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1200px"
                className="object-cover object-top select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.01]"
              />
            )}

            {/* Ícone de zoom */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white">
              <Maximize2 className="h-4 w-4" />
            </div>
          </div>

          {/* Legenda de Jornal (Caption) abaixo da imagem */}
          <div className="mt-2.5 flex items-center justify-between font-mono text-xs text-[#8a8f98] px-1">
            <span>Fig. 01 — {heroMedia.title || `Interface principal do sistema ${project.name}.`}</span>
            <span className="text-[#c72c3b]">CLIQUE PARA AMPLIAR ↗</span>
          </div>
        </section>
      )}

      {/* ==============================================================
          3. CORPO DO ARTIGO: NARRATIVA DILUÍDA E SEÇÕES EDITORIAIS
          Mescla texto de alta densidade técnica com citações e figuras
          ============================================================== */}
      <div className="space-y-14">
        {/* Lead da Matéria / Parágrafos Introdutórios */}
        {editorial?.summary && (
          <div className="max-w-4xl space-y-5 text-base sm:text-lg text-neutral-300 font-normal leading-relaxed border-b border-[#2b2d31]/50 pb-10">
            {editorial.summary.map((paragraph, i) => (
              <p key={i} className="tracking-wide">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Placar de Resultados / Métricas de Impacto */}
        {editorial?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[#2b2d31]/60">
            {editorial.stats.map((st) => (
              <div key={st.label} className="p-4 rounded-xl bg-[#121316]/70 border border-[#2b2d31]/50 space-y-1">
                <div className="font-mono text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {st.value}
                </div>
                <div className="font-mono text-xs text-[#c72c3b] uppercase tracking-wider">
                  {st.label}
                </div>
                {st.description && (
                  <p className="text-xs text-[#8a8f98] leading-normal pt-1">
                    {st.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Seções Narrativas Intercaladas com Imagens e Citações */}
        {editorial?.sections?.map((sec, idx) => (
          <section key={sec.title} className="space-y-6 max-w-4xl">
            {/* Kicker Editorial */}
            {sec.kicker && (
              <div className="font-mono text-xs text-[#c72c3b] uppercase tracking-widest font-medium">
                {sec.kicker}
              </div>
            )}

            {/* Título da Seção */}
            <h2 className="font-sans text-2xl sm:text-3xl font-light text-white tracking-tight">
              {sec.title}
            </h2>

            {/* Parágrafos da Seção */}
            <div className="space-y-4 text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            {/* Citação Editorial (Pull-Quote com destaque vermelho) */}
            {sec.quote && (
              <blockquote className="my-8 border-l-2 border-[#c72c3b] pl-6 py-2 italic font-sans text-xl sm:text-2xl text-white font-light leading-snug">
                “{sec.quote}”
              </blockquote>
            )}

            {/* Figura Intercalada no Texto (com cantos arredondados e zoom) */}
            {sec.figure && (
              <div className="my-8 space-y-2">
                <div
                  onClick={() => handleOpenZoom(sec.figure!.src)}
                  className="group relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in hover:border-[#c72c3b] transition-colors"
                >
                  <Image
                    src={sec.figure.src}
                    alt={sec.figure.title || sec.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover object-top select-none pointer-events-none"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 p-2 rounded-lg border border-white/10 text-white">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                {sec.figure.title && (
                  <p className="font-mono text-xs text-[#8a8f98] px-1">
                    Fig. 0{idx + 2} — {sec.figure.title}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}

        {/* Seção de Vídeos Dedicada (se houver vídeos cadastrados) */}
        {videoItems.length > 0 && (
          <section aria-label="Vídeos do projeto" className="space-y-6 pt-6 border-t border-[#2b2d31]/50">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#c72c3b] uppercase tracking-wider">
                MULTIMÍDIA //
              </span>
              <h2 className="font-sans text-2xl font-light text-white tracking-tight">
                Vídeos
              </h2>
            </div>

            {videoItems.map((vid) => (
              <div
                key={vid.src}
                onClick={() => handleOpenZoom(vid.src)}
                className="group relative w-full aspect-[16/9] max-h-[640px] overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in"
              >
                <video
                  src={vid.src}
                  poster={vid.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            ))}
          </section>
        )}

        {/* ==============================================================
            4. GALERIA DE TELAS (CONFORME 3ª IMAGEM DE REFERÊNCIA)
            Quantas imagens o usuário quiser, em grade de 3 colunas
            ============================================================== */}
        <section aria-label="Galeria de telas" className="pt-10 border-t border-[#2b2d31]/60 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-[#c72c3b]" />
              <h2 className="font-sans text-2xl sm:text-3xl font-light text-white tracking-tight">
                Galeria ({galleryImages.length})
              </h2>
            </div>
            <span className="font-mono text-xs text-[#8a8f98]">
              Clique para ampliar em tela cheia
            </span>
          </div>

          {/* Grade de 3 Colunas com Cantos Arredondados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {galleryImages.map((img) => (
              <motion.div
                key={img.src}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleOpenZoom(img.src)}
                className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#2b2d31]/80 bg-[#0c0d10] cursor-zoom-in hover:border-[#c72c3b] transition-all"
              >
                <Image
                  src={img.src}
                  alt={img.title || project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                  <div className="flex justify-end">
                    <div className="bg-black/60 backdrop-blur-sm p-1.5 rounded-lg border border-white/10 text-white">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  {img.title && (
                    <p className="font-mono text-xs text-white line-clamp-2">
                      {img.title}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox Zoom Modal em Tela Cheia */}
      <MediaZoomModal
        isOpen={zoomIndex !== null}
        items={mediaList}
        currentIndex={zoomIndex ?? 0}
        onClose={() => setZoomIndex(null)}
        onNavigate={(newIdx) => setZoomIndex(newIdx)}
      />
    </article>
  )
}

export default CaseArticle
