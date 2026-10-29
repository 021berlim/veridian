import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { projects } from "@/data/projects"

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
  return {
    title: `${project.name} | Zuse Labs`,
    description: project.tagline,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="min-h-screen bg-[#0b0b0d] px-6 py-24 text-white">
      <Link href="/#projetos" className="text-sm font-mono text-[#c72c3b]">
        ← PROJETOS
      </Link>
      <h1 className="mt-8 font-sans text-4xl text-white">{project.name}</h1>
      <p className="mt-4 text-[#8a8f98]">{project.tagline}</p>
      <p className="mt-8 font-mono text-xs uppercase text-[#8a8f98]">Em construção</p>
    </div>
  )
}
