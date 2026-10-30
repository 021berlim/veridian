import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/layout/container"
import { CaseHeader } from "@/components/projects/case/case-header"
import { CaseHero } from "@/components/projects/case/case-hero"
import { CaseMediaGallery } from "@/components/projects/case/case-media-gallery"
import { CaseContent } from "@/components/projects/case/case-content"
import { CaseNext } from "@/components/projects/case/case-next"
import { projects, getProjectMedia } from "@/data/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  const title = `${project.name} | Zuse Labs`
  const description = project.tagline

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  if (currentIndex === -1) notFound()

  const project = projects[currentIndex]
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const media = getProjectMedia(project)

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <Navbar />

      <main className="pt-28 pb-16">
        <Container>
          {/* Cabeçalho mono com categoria, ano e links */}
          <CaseHeader category={project.category} year={project.year} />

          {/* Título com reveal e subtítulo tagline */}
          <CaseHero title={project.name} tagline={project.tagline} />

          {/* Galeria Completa de Telas e Vídeos (Quantas o usuário quiser - Prints 3 e 4) */}
          <CaseMediaGallery
            media={media}
            projectName={project.name}
          />

          {/* Conteúdo editorial: Contexto, Desafio, Solução, Resultado, Stack e CTA */}
          <CaseContent project={project} />

          {/* Navegação circular para o próximo case */}
          <CaseNext nextProject={nextProject} />
        </Container>
      </main>

      <Footer />
    </div>
  )
}
