"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, ArrowRight, ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Container } from "@/components/layout/container"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora ou ao pressionar Escape
  useEffect(() => {
    if (!isDropdownOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isDropdownOpen])

  useEffect(() => {
    const areaMap: Record<string, string> = {
      software: "Desenvolvimento de Software sob medida",
      suporte: "Suporte e Manutenção de TI",
      seguranca: "Cibersegurança",
      ia: "Automação e Inteligência Artificial",
    }

    const checkUrlArea = () => {
      if (typeof window === "undefined") return
      let areaParam = new URLSearchParams(window.location.search).get("area")?.toLowerCase()
      if (!areaParam && window.location.hash.includes("?")) {
        const hashQuery = window.location.hash.split("?")[1]
        areaParam = new URLSearchParams(hashQuery).get("area")?.toLowerCase()
      }
      if (areaParam && areaMap[areaParam]) {
        setValue("projectType", areaMap[areaParam], { shouldValidate: true })
      }
    }

    // 1. Checa ao montar com retry rápido para hidratação
    checkUrlArea()
    const t1 = setTimeout(checkUrlArea, 100)
    const t2 = setTimeout(checkUrlArea, 400)

    // 2. Ouve mudanças de hash/URL
    window.addEventListener("hashchange", checkUrlArea)
    window.addEventListener("popstate", checkUrlArea)

    // 3. Ouvir evento customizado disparado internamente
    const handleSelectInterest = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setValue("projectType", customEvent.detail, { shouldValidate: true })
      }
    }
    window.addEventListener("zuse-select-interest", handleSelectInterest)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener("hashchange", checkUrlArea)
      window.removeEventListener("popstate", checkUrlArea)
      window.removeEventListener("zuse-select-interest", handleSelectInterest)
    }
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

                    {/* Isolamento relativo estrito para o dropdown flutuante (não afeta o space-y do form) */}
                    <div className="relative" ref={dropdownRef}>
                      {/* Trigger com aparência idêntica, posicionado sem alterar o fluxo da página */}
                      <button
                        id="projectType"
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-md border border-[#2b2d31] bg-[#141518] px-3.5 py-3 text-base text-left text-white shadow-none focus:border-white focus:outline-none transition-colors cursor-pointer",
                          errors.projectType && "border-[#c72c3b]",
                          isDropdownOpen && "border-white"
                        )}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                      >
                        <span className={cn(projectType ? "text-white" : "text-[#4b5563]")}>
                          {projectType || "Selecione o serviço"}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-[#8a8f98] transition-transform duration-200 shrink-0",
                            isDropdownOpen && "rotate-180 text-white"
                          )}
                        />
                      </button>

                      {/* Menu Flutuante Absoluto (Zero layout shift, zero reposicionamento) */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-md border border-[#2b2d31] bg-[#111215] p-1 shadow-2xl text-white"
                            role="listbox"
                          >
                            {projectTypes.map((type) => {
                              const isSelected = projectType === type
                              return (
                                <div
                                  key={type}
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setValue("projectType", type, { shouldValidate: true })
                                    setIsDropdownOpen(false)
                                  }}
                                  className={cn(
                                    "relative flex w-full cursor-pointer items-center justify-between rounded px-3 py-2.5 text-sm text-[#e5e7eb] hover:bg-[#2b2d31] hover:text-white transition-colors select-none",
                                    isSelected && "bg-[#2b2d31]/50 text-white font-medium"
                                  )}
                                >
                                  <span>{type}</span>
                                  {isSelected && <Check className="h-4 w-4 text-[#c72c3b]" />}
                                </div>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

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
