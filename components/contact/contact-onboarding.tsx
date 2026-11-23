"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  Code2,
  Compass,
  Cpu,
  FileText,
  Globe,
  Layers,
  Loader2,
  Mail,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa6"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ContactContextCard } from "@/components/contact/contact-context-card"
import { SubmissionSuccess } from "@/components/contact/submission-success"
import {
  MultiDropdown,
  SingleDropdown,
  type DropdownOption,
} from "@/components/contact/contact-dropdown"
import {
  buildBriefingWhatsAppMessage,
  buildWhatsAppHref,
  setWhatsAppLeadContext,
} from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

const STEP_LABELS = [
  "Dados de contato",
  "Frentes e cenário",
  "Escala e horizonte",
  "Briefing técnico",
] as const

const SERVICE_PILLARS: readonly DropdownOption[] = [
  {
    value: "software",
    label: "Software sob medida",
    description: "Sistemas web, portais e plataformas escaláveis",
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    value: "it-support",
    label: "Suporte e Manutenção de TI",
    description: "Monitoramento ativo, servidores e sustentação",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    value: "cybersecurity",
    label: "Cibersegurança",
    description: "Auditorias, proteção de dados e compliance",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    value: "ai-automation",
    label: "Automação e Inteligência Artificial",
    description: "Agentes inteligentes e fluxos automatizados",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    value: "architecture-discovery",
    label: "Diagnóstico Arquitetural / Outro",
    description: "Mapeamento técnico para definir a melhor solução",
    icon: <Compass className="h-4 w-4" />,
  },
]

const CURRENT_SCENARIOS: readonly DropdownOption[] = [
  {
    value: "Construir plataforma do zero",
    label: "Construir plataforma do zero",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    value: "Modernizar sistema legado",
    label: "Modernizar ou refatorar sistema legado",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    value: "Sustentação contínua de TI",
    label: "Sustentação contínua e monitoramento de TI",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    value: "Auditoria de segurança",
    label: "Auditoria de segurança ou compliance",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    value: "Automatizar processos com IA",
    label: "Automatizar processos internos com IA",
    icon: <Sparkles className="h-4 w-4" />,
  },
]

const COMPANY_SIZES: readonly DropdownOption[] = [
  { value: "Até 15 pessoas", label: "Até 15 pessoas" },
  { value: "16 a 50 pessoas", label: "16 a 50 pessoas" },
  { value: "51 a 200 pessoas", label: "51 a 200 pessoas" },
  { value: "Mais de 200 pessoas", label: "Mais de 200 pessoas" },
]

const TIMELINES: readonly DropdownOption[] = [
  { value: "Imediato (próximos 15 dias)", label: "Imediato (próximos 15 dias)" },
  { value: "Curto prazo (30 a 60 dias)", label: "Curto prazo (30 a 60 dias)" },
  { value: "Planejamento trimestral", label: "Planejamento trimestral" },
  { value: "Ainda explorando possibilidades", label: "Ainda explorando possibilidades" },
]

const BUDGET_RANGES: readonly DropdownOption[] = [
  { value: "Até R$ 25 mil", label: "Até R$ 25 mil" },
  { value: "R$ 25 mil a R$ 80 mil", label: "R$ 25 mil a R$ 80 mil" },
  { value: "R$ 80 mil a R$ 200 mil", label: "R$ 80 mil a R$ 200 mil" },
  { value: "Acima de R$ 200 mil", label: "Acima de R$ 200 mil" },
  { value: "Definir junto à equipe no diagnóstico", label: "Definir junto à equipe no diagnóstico" },
]

const RETURN_CHANNELS = [
  { value: "WhatsApp", label: "WhatsApp", icon: FaWhatsapp },
  { value: "E-mail", label: "E-mail", icon: Mail },
] as const

type FormState = {
  fullName: string
  workEmail: string
  whatsapp: string
  company: string
  role: string
  servicePillars: string[]
  currentScenario: string
  companySize: string
  timeline: string
  budgetRange: string
  projectSummary: string
  referenceUrl: string
  preferredChannel: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL_STATE: FormState = {
  fullName: "",
  workEmail: "",
  whatsapp: "",
  company: "",
  role: "",
  servicePillars: [],
  currentScenario: "",
  companySize: "",
  timeline: "",
  budgetRange: "",
  projectSummary: "",
  referenceUrl: "",
  preferredChannel: "WhatsApp",
}

function formatBrPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ""
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function isValidUrlInput(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(candidate)
    return parsed.hostname.includes(".")
  } catch {
    return false
  }
}

export function ContactOnboarding() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const area = searchParams.get("area")?.toLowerCase()
    if (!area) return
    const map: Record<string, string> = {
      software: "software",
      suporte: "it-support",
      seguranca: "cybersecurity",
      ia: "ai-automation",
    }
    const pillarId = map[area]
    if (pillarId) {
      setForm((prev) =>
        prev.servicePillars.includes(pillarId)
          ? prev
          : { ...prev, servicePillars: [...prev.servicePillars, pillarId] },
      )
    }
  }, [searchParams])

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const togglePillar = (id: string) => {
    const exists = form.servicePillars.includes(id)
    const next = exists
      ? form.servicePillars.filter((item) => item !== id)
      : [...form.servicePillars, id]
    updateField("servicePillars", next)
  }

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: FormErrors = {}

    if (targetStep === 1) {
      const nameParts = form.fullName.trim().split(/\s+/).filter(Boolean)
      if (form.fullName.trim().length < 3 || nameParts.length < 2) {
        nextErrors.fullName = "Informe seu nome e sobrenome."
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.workEmail.trim())) {
        nextErrors.workEmail = "Informe um e-mail válido."
      }
      const digits = form.whatsapp.replace(/\D/g, "")
      const ddd = Number(digits.slice(0, 2))
      if (digits.length < 10 || digits.length > 11 || ddd < 11 || ddd > 99) {
        nextErrors.whatsapp = "Informe um WhatsApp válido com DDD."
      }
      if (form.company.trim().length < 2 || form.company.trim().length > 80) {
        nextErrors.company = "Informe o nome da empresa."
      }
      if (form.role.trim().length < 2 || form.role.trim().length > 80) {
        nextErrors.role = "Informe o seu cargo."
      }
    }

    if (targetStep === 2) {
      if (form.servicePillars.length === 0) {
        nextErrors.servicePillars = "Selecione ao menos uma frente de atuação."
      }
      if (!form.currentScenario) {
        nextErrors.currentScenario = "Selecione o momento atual da iniciativa."
      }
    }

    if (targetStep === 3) {
      if (!form.companySize) {
        nextErrors.companySize = "Selecione o porte da empresa."
      }
      if (!form.timeline) {
        nextErrors.timeline = "Selecione a janela desejada de início."
      }
    }

    if (targetStep === 4) {
      if (form.projectSummary.trim().length < 20) {
        nextErrors.projectSummary = "Descreva o contexto com pelo menos 20 caracteres."
      }
      if (form.referenceUrl.trim() && !isValidUrlInput(form.referenceUrl)) {
        nextErrors.referenceUrl = "Informe uma URL válida."
      }
      if (!form.preferredChannel) {
        nextErrors.preferredChannel = "Selecione o canal de retorno."
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(step)) return
    setStep((prev) => Math.min(4, prev + 1))
  }

  const handleBack = () => {
    setErrors({})
    setStep((prev) => Math.max(1, prev - 1))
  }

  const selectedPillarLabels: string[] = form.servicePillars.flatMap((id) => {
    const pillar = SERVICE_PILLARS.find((p) => p.value === id)
    return pillar ? [pillar.label] : []
  })

  // Sincroniza nome, empresa e cargo para personalizar o QR Code do WhatsApp
  useEffect(() => {
    const hasIdentity = Boolean(
      form.fullName.trim() || form.company.trim() || form.role.trim(),
    )

    if (!hasIdentity) {
      setWhatsAppLeadContext(null)
      return
    }

    setWhatsAppLeadContext({
      fullName: form.fullName,
      company: form.company,
      role: form.role,
    })
  }, [form.fullName, form.company, form.role])

  useEffect(() => {
    return () => setWhatsAppLeadContext(null)
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateStep(4)) return

    setIsSubmitting(true)

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.workEmail.trim().toLowerCase(),
          company: form.role.trim()
            ? `${form.company.trim()} — ${form.role.trim()}`
            : form.company.trim(),
          whatsapp: form.whatsapp.trim(),
          project: selectedPillarLabels[0] ?? "Outro",
          servicePillars: selectedPillarLabels,
          currentScenario: form.currentScenario,
          companySize: form.companySize,
          timeline: form.timeline,
          engagementModel: "Definir no diagnóstico",
          budgetRange: form.budgetRange || "Definir junto à equipe no diagnóstico",
          projectSummary: form.projectSummary.trim(),
          referenceUrl: form.referenceUrl.trim() || undefined,
          preferredChannel: form.preferredChannel,
          origem: "Website — Briefing 4 Etapas",
        }),
      })
    } catch (err) {
      console.error("[ContactOnboarding] Falha ao enviar lead:", err)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const firstName = form.fullName.trim().split(/\s+/)[0] || ""
  const companyLabel = form.company.trim()
  const roleLabel = form.role.trim()

  const buildWhatsAppUrl = () =>
    buildWhatsAppHref(
      buildBriefingWhatsAppMessage({
        fullName: form.fullName,
        company: companyLabel,
        role: roleLabel,
      }),
    )

  return (
    <div className="bg-[#0b0b0d] text-white">
      <Navbar />

      <section
        className="flex min-h-[100vh] min-h-[100dvh] flex-col justify-center border-b border-[#2b2d31] px-6 pb-8 sm:px-8"
        style={{ paddingTop: "calc(var(--header-h, 88px) + 16px)" }}
      >
        <div className="mx-auto w-full max-w-6xl">
          {isSubmitted ? (
            <SubmissionSuccess
              firstName={firstName}
              companyLabel={companyLabel}
              preferredChannel={form.preferredChannel}
              whatsappHref={buildWhatsAppUrl()}
            />
          ) : (
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Coluna Esquerda — Progresso + Inputs & Dropdowns limpos */}
              <div className="lg:col-span-7">
                <div>
                  <div className="mb-2.5 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs tabular-nums tracking-wider">
                        <span className="text-[#c72c3b]">0{step}</span>
                        <span className="text-[#525660]">/04</span>
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8f98]">
                        {STEP_LABELS[step - 1]}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-[#525660]">
                      {step * 25}%
                    </span>
                  </div>
                  <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      className="h-full rounded-full bg-[#c72c3b]"
                      initial={false}
                      animate={{ width: `${(step / 4) * 100}%` }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-5">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div>
                          <h1 className="font-sans text-2xl font-light tracking-[-0.03em] text-white sm:text-3xl">
                            Dados de contato
                          </h1>
                          <p className="mt-1 text-sm text-[#8a8f98]">
                            Para continuar, informe quem estará à frente desta conversa.
                          </p>
                        </div>

                        <div className="space-y-3.5 pt-1">
                          <div>
                            <label htmlFor="fullName" className="block text-xs font-medium text-[#d4d7dd]">
                              Nome completo
                            </label>
                            <div className="relative mt-1.5">
                              <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                              <input
                                id="fullName"
                                type="text"
                                autoComplete="name"
                                value={form.fullName}
                                onChange={(e) => updateField("fullName", e.target.value)}
                                placeholder="Ex.: Marina Azevedo"
                                className={cn(
                                  "w-full rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                  errors.fullName
                                    ? "border-[#c72c3b]"
                                    : "border-[#2b2d31] focus:border-white/50",
                                )}
                              />
                            </div>
                            {errors.fullName && (
                              <p className="mt-1 text-xs text-[#f87171]">{errors.fullName}</p>
                            )}
                          </div>

                          <div className="grid gap-3.5 sm:grid-cols-2">
                            <div>
                              <label htmlFor="workEmail" className="block text-xs font-medium text-[#d4d7dd]">
                                E-mail corporativo
                              </label>
                              <div className="relative mt-1.5">
                                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                                <input
                                  id="workEmail"
                                  type="email"
                                  autoComplete="email"
                                  value={form.workEmail}
                                  onChange={(e) => updateField("workEmail", e.target.value)}
                                  placeholder="marina@empresa.com.br"
                                  className={cn(
                                    "w-full rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                    errors.workEmail
                                      ? "border-[#c72c3b]"
                                      : "border-[#2b2d31] focus:border-white/50",
                                  )}
                                />
                              </div>
                              {errors.workEmail && (
                                <p className="mt-1 text-xs text-[#f87171]">{errors.workEmail}</p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="whatsapp" className="block text-xs font-medium text-[#d4d7dd]">
                                WhatsApp
                              </label>
                              <div className="relative mt-1.5">
                                <FaWhatsapp className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                                <input
                                  id="whatsapp"
                                  type="tel"
                                  autoComplete="tel"
                                  inputMode="numeric"
                                  value={form.whatsapp}
                                  onChange={(e) =>
                                    updateField("whatsapp", formatBrPhone(e.target.value))
                                  }
                                  placeholder="(21) 99999-9999"
                                  className={cn(
                                    "w-full rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                    errors.whatsapp
                                      ? "border-[#c72c3b]"
                                      : "border-[#2b2d31] focus:border-white/50",
                                  )}
                                />
                              </div>
                              {errors.whatsapp && (
                                <p className="mt-1 text-xs text-[#f87171]">{errors.whatsapp}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-3.5 sm:grid-cols-2">
                            <div>
                              <label htmlFor="company" className="block text-xs font-medium text-[#d4d7dd]">
                                Empresa
                              </label>
                              <div className="relative mt-1.5">
                                <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                                <input
                                  id="company"
                                  type="text"
                                  autoComplete="organization"
                                  value={form.company}
                                  onChange={(e) => updateField("company", e.target.value)}
                                  placeholder="Ex.: Valkora Industries"
                                  className={cn(
                                    "w-full rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                    errors.company
                                      ? "border-[#c72c3b]"
                                      : "border-[#2b2d31] focus:border-white/50",
                                  )}
                                />
                              </div>
                              {errors.company && (
                                <p className="mt-1 text-xs text-[#f87171]">{errors.company}</p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="role" className="block text-xs font-medium text-[#d4d7dd]">
                                Cargo
                              </label>
                              <div className="relative mt-1.5">
                                <Briefcase className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                                <input
                                  id="role"
                                  type="text"
                                  autoComplete="organization-title"
                                  value={form.role}
                                  onChange={(e) => updateField("role", e.target.value)}
                                  placeholder="Ex.: Head de Operações"
                                  className={cn(
                                    "w-full rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                    errors.role
                                      ? "border-[#c72c3b]"
                                      : "border-[#2b2d31] focus:border-white/50",
                                  )}
                                />
                              </div>
                              {errors.role && (
                                <p className="mt-1 text-xs text-[#f87171]">{errors.role}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div>
                          <h1 className="font-sans text-2xl font-light tracking-[-0.03em] text-white sm:text-3xl">
                            Frentes e cenário técnico
                          </h1>
                          <p className="mt-1 text-sm text-[#8a8f98]">
                            Selecione as áreas de interesse e o momento atual da sua operação.
                          </p>
                        </div>

                        <div className="space-y-4 pt-1">
                          <MultiDropdown
                            id="servicePillars"
                            label="Frentes de atuação (pode selecionar mais de uma)"
                            placeholder="Selecione uma ou mais frentes..."
                            values={form.servicePillars}
                            options={SERVICE_PILLARS}
                            leadingIcon={<Layers className="h-4 w-4" />}
                            error={errors.servicePillars}
                            onToggle={togglePillar}
                          />

                          <SingleDropdown
                            id="currentScenario"
                            label="Momento atual da iniciativa"
                            placeholder="Selecione o cenário atual..."
                            value={form.currentScenario}
                            options={CURRENT_SCENARIOS}
                            leadingIcon={<Compass className="h-4 w-4" />}
                            error={errors.currentScenario}
                            onChange={(val) => updateField("currentScenario", val)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div>
                          <h1 className="font-sans text-2xl font-light tracking-[-0.03em] text-white sm:text-3xl">
                            Escala e horizonte
                          </h1>
                          <p className="mt-1 text-sm text-[#8a8f98]">
                            O formato de atuação e o escopo são definidos pela nossa equipe junto a
                            você no diagnóstico.
                          </p>
                        </div>

                        <div className="space-y-4 pt-1">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <SingleDropdown
                              id="companySize"
                              label="Porte da empresa"
                              placeholder="Selecione o porte..."
                              value={form.companySize}
                              options={COMPANY_SIZES}
                              leadingIcon={<Building2 className="h-4 w-4" />}
                              error={errors.companySize}
                              onChange={(val) => updateField("companySize", val)}
                            />

                            <SingleDropdown
                              id="timeline"
                              label="Janela desejada de início"
                              placeholder="Selecione o prazo..."
                              value={form.timeline}
                              options={TIMELINES}
                              leadingIcon={<Clock className="h-4 w-4" />}
                              error={errors.timeline}
                              onChange={(val) => updateField("timeline", val)}
                            />
                          </div>

                          <SingleDropdown
                            id="budgetRange"
                            label="Faixa estimada de investimento"
                            optional
                            placeholder="Definir junto à equipe no diagnóstico"
                            value={form.budgetRange}
                            options={BUDGET_RANGES}
                            leadingIcon={<Wallet className="h-4 w-4" />}
                            onChange={(val) => updateField("budgetRange", val)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div>
                          <h1 className="font-sans text-2xl font-light tracking-[-0.03em] text-white sm:text-3xl">
                            Briefing técnico
                          </h1>
                          <p className="mt-1 text-sm text-[#8a8f98]">
                            Conte o essencial do desafio. Após o primeiro contato, agendaremos a
                            reunião de diagnóstico.
                          </p>
                        </div>

                        <div>
                          <label htmlFor="projectSummary" className="block text-xs font-medium text-[#d4d7dd]">
                            Objetivo e contexto operacional
                          </label>
                          <div className="relative mt-1.5">
                            <FileText className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-[#6b7280]" />
                            <textarea
                              id="projectSummary"
                              rows={4}
                              maxLength={2000}
                              value={form.projectSummary}
                              onChange={(e) => updateField("projectSummary", e.target.value)}
                              placeholder="Principais gargalos, integrações necessárias (ERP, CRM, APIs) ou metas esperadas..."
                              className={cn(
                                "w-full resize-none rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                errors.projectSummary
                                  ? "border-[#c72c3b]"
                                  : "border-[#2b2d31] focus:border-white/50",
                              )}
                            />
                          </div>
                          {errors.projectSummary && (
                            <p className="mt-1 text-xs text-[#f87171]">{errors.projectSummary}</p>
                          )}
                        </div>

                        <div className="grid gap-3.5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="referenceUrl" className="block text-xs font-medium text-[#d4d7dd]">
                              Site ou referência <span className="text-[#6b7280]">(opcional)</span>
                            </label>
                            <div className="relative mt-1.5">
                              <Globe className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                              <input
                                id="referenceUrl"
                                type="url"
                                value={form.referenceUrl}
                                onChange={(e) => updateField("referenceUrl", e.target.value)}
                                placeholder="https://suaempresa.com.br"
                                className={cn(
                                  "w-full rounded-xl border bg-[#121316] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#555a66] focus:outline-none transition-colors",
                                  errors.referenceUrl
                                    ? "border-[#c72c3b]"
                                    : "border-[#2b2d31] focus:border-white/50",
                                )}
                              />
                            </div>
                            {errors.referenceUrl && (
                              <p className="mt-1 text-xs text-[#f87171]">{errors.referenceUrl}</p>
                            )}
                          </div>

                          <div>
                            <span className="block text-xs font-medium text-[#d4d7dd]">
                              Canal de primeiro contato
                            </span>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                              {RETURN_CHANNELS.map((channel) => {
                                const Icon = channel.icon
                                const active = form.preferredChannel === channel.value
                                return (
                                  <button
                                    key={channel.value}
                                    type="button"
                                    onClick={() => updateField("preferredChannel", channel.value)}
                                    className={cn(
                                      "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-medium transition-all",
                                      active
                                        ? "border-[#c72c3b] bg-[#c72c3b]/15 text-white"
                                        : "border-[#2b2d31] bg-[#121316] text-[#9ca3af] hover:border-white/30 hover:text-white",
                                    )}
                                  >
                                    <Icon
                                      className={cn(
                                        "h-3.5 w-3.5",
                                        active ? "text-[#c72c3b]" : "text-[#8a8f98]",
                                      )}
                                    />
                                    {channel.label}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Barra de navegação */}
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#2b2d31] pt-5">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 rounded-full border border-[#2b2d31] px-5 py-2.5 text-sm font-medium text-[#c9cdd4] transition-colors hover:border-white/30 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-sm font-medium text-black transition-all hover:bg-white/90"
                      >
                        Continuar
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-full bg-[#c72c3b] px-7 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#a61f2c] disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar briefing
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Coluna Direita — Apenas texto e SVG minimalista */}
              <div className="lg:col-span-5">
                <ContactContextCard step={step} selectedPillars={form.servicePillars} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
