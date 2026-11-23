import { Suspense } from "react"
import type { Metadata } from "next"
import { ContactOnboarding } from "@/components/contact/contact-onboarding"

export const metadata: Metadata = {
  title: "Iniciar Projeto | Zuse Labs",
  description:
    "Preencha o briefing técnico em 4 etapas para iniciar o diagnóstico da sua operação com a engenharia da Zuse Labs.",
}

export default function ContatoPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#0b0b0d]" />}>
      <ContactOnboarding />
    </Suspense>
  )
}
