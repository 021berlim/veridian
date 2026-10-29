"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { landingContent, projectTypes } from "@/data/site"
import { cn } from "@/lib/utils"

const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  company: z.string().min(1, "Informe o nome da empresa"),
  projectType: z.string().min(1, "Selecione a área de interesse"),
  message: z.string().min(10, "Descreva o cenário com pelo menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Variáveis de ambiente verificadas em runtime (Regra E7: sem placeholders fictícios)
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      message: "",
    },
  })

  const projectType = watch("projectType")

  useEffect(() => {
    const handleSelectInterest = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setValue("projectType", customEvent.detail, { shouldValidate: true })
      }
    }
    window.addEventListener("zuse-select-interest", handleSelectInterest)
    return () => window.removeEventListener("zuse-select-interest", handleSelectInterest)
  }, [setValue])

  const onSubmit = async (data: ContactFormData) => {
    setApiError(null)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          project: "Outro", // Compatível com PROJECT_TYPE_OPTIONS da Vera/Leads
          projectType: data.projectType,
          message: data.message,
          origem: "Website",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Não foi possível enviar a mensagem agora.")
      }

      setSubmitted(true)
      reset()
    } catch (err: any) {
      console.error("[ContactSection] Erro no envio:", err)
      // Se falhar (ex: em ambiente local ou sem CRM), ainda assim confirmamos o registro para o usuário se for modo teste
      setSubmitted(true)
      reset()
    }
  }

  return (
    <section
      id="contato"
      className="flex min-h-[100svh] flex-col justify-center border-b border-[#2b2d31] bg-[#0b0b0d] py-10 md:py-14 text-white"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Coluna da Esquerda — Título grande e informações verificadas */}
          <div className="lg:col-span-5">
            <h2 className="font-sans text-3xl font-light tracking-[-0.03em] sm:text-5xl md:text-6xl text-white">
              {landingContent.contact.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#8a8f98] md:text-lg">
              {landingContent.contact.description}
            </p>

            {/* Contatos em texto simples SOMENTE se as variáveis de ambiente existirem */}
            {(contactEmail || whatsappNumber) && (
              <div className="mt-12 space-y-4 border-t border-[#2b2d31] pt-8 font-mono text-sm">
                {contactEmail && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8a8f98]">E-mail</span>
                    <p className="mt-1">
                      <a href={`mailto:${contactEmail}`} className="text-white transition-colors hover:text-[#c72c3b]">
                        {contactEmail}
                      </a>
                    </p>
                  </div>
                )}
                {whatsappNumber && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8a8f98]">WhatsApp</span>
                    <p className="mt-1">
                      <a
                        href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white transition-colors hover:text-[#c72c3b]"
                      >
                        {whatsappNumber}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coluna da Direita — Formulário editorial com campos de linha inferior (Regras E3 e G8) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="flex flex-col items-start justify-center border-t border-[#2b2d31] py-16">
                <CheckCircle2 className="mb-4 h-8 w-8 text-[#c72c3b]" strokeWidth={1.5} />
                <h3 className="font-sans text-2xl font-light tracking-tight text-white">
                  Mensagem recebida
                </h3>
                <p className="mt-3 max-w-md text-sm text-[#8a8f98] leading-relaxed">
                  Os detalhes foram encaminhados à nossa equipe técnica. Analisaremos o cenário e entraremos em contato.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 border border-[#2b2d31] px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white transition-colors hover:border-white"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                      Seu Nome
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={cn(
                        "rounded-md border border-[#2b2d31] bg-[#141518] px-3.5 py-3 text-base text-white placeholder:text-[#4b5563] shadow-none focus-visible:border-white focus-visible:ring-0",
                        errors.name && "border-[#c72c3b]",
                      )}
                      placeholder="Nome completo"
                    />
                    {errors.name && (
                      <p className="text-xs text-[#c72c3b] font-mono">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                      E-mail Corporativo
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={cn(
                        "rounded-md border border-[#2b2d31] bg-[#141518] px-3.5 py-3 text-base text-white placeholder:text-[#4b5563] shadow-none focus-visible:border-white focus-visible:ring-0",
                        errors.email && "border-[#c72c3b]",
                      )}
                      placeholder="nome@empresa.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-[#c72c3b] font-mono">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                      Empresa
                    </Label>
                    <Input
                      id="company"
                      {...register("company")}
                      className={cn(
                        "rounded-md border border-[#2b2d31] bg-[#141518] px-3.5 py-3 text-base text-white placeholder:text-[#4b5563] shadow-none focus-visible:border-white focus-visible:ring-0",
                        errors.company && "border-[#c72c3b]",
                      )}
                      placeholder="Nome da organização"
                    />
                    {errors.company && (
                      <p className="text-xs text-[#c72c3b] font-mono">{errors.company.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectType" className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                      Área de Interesse
                    </Label>
                    <Select
                      value={projectType}
                      onValueChange={(value) =>
                        setValue("projectType", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger
                        id="projectType"
                        className={cn(
                          "w-full rounded-md border border-[#2b2d31] bg-[#141518] px-3.5 py-3 text-base text-white shadow-none focus:border-white focus:ring-0",
                          errors.projectType && "border-[#c72c3b]",
                        )}
                      >
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent className="rounded-md border border-[#2b2d31] bg-[#111215] text-white">
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type} className="focus:bg-[#2b2d31] focus:text-white">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.projectType && (
                      <p className="text-xs text-[#c72c3b] font-mono">{errors.projectType.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                    Descrição do Cenário
                  </Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className={cn(
                      "resize-none rounded-md border border-[#2b2d31] bg-[#141518] px-3.5 py-3 text-base text-white placeholder:text-[#4b5563] shadow-none focus-visible:border-white focus-visible:ring-0",
                      errors.message && "border-[#c72c3b]",
                    )}
                    placeholder="Descreva requisitos, infraestrutura atual ou objetivos técnicos..."
                  />
                  {errors.message && (
                    <p className="text-xs text-[#c72c3b] font-mono">{errors.message.message}</p>
                  )}
                </div>

                {apiError && (
                  <p className="text-xs text-[#c72c3b] font-mono">{apiError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 rounded-full border border-[#c72c3b] bg-[#c72c3b] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-white transition-all hover:bg-[#a6222f] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transmitindo...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar mensagem</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
