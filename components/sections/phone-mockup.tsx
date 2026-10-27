"use client"

import { useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Shield, Terminal, MessageSquare, ArrowUpRight } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"

const SCREENS = ["software", "suporte", "seguranca", "ia"] as const
type Screen = (typeof SCREENS)[number]

const SCREEN_META: Record<
  Screen,
  { title: string; subtitle: string; tag: string }
> = {
  software: {
    tag: "01 · ENGENHARIA",
    title: "Software sob medida",
    subtitle: "Aplicações de alto desempenho e arquitetura resiliente.",
  },
  suporte: {
    tag: "02 · OPERAÇÃO",
    title: "Sustentação de TI",
    subtitle: "Monitoramento ativo e resolução técnica sem atrito.",
  },
  seguranca: {
    tag: "03 · DEFESA",
    title: "Cibersegurança",
    subtitle: "Defesa em camadas e integridade contínua de dados.",
  },
  ia: {
    tag: "04 · AUTOMAÇÃO",
    title: "Inteligência Artificial",
    subtitle: "Agentes autônomos integrados aos fluxos operacionais.",
  },
}

const BRAND = {
  bg: "#0b0b0d",
  surface: "#141518",
  surfaceMuted: "#18191d",
  text: "#ffffff",
  muted: "#8a8f98",
  accent: "#c72c3b",
  border: "#2b2d31",
  island: "#000000",
}

const SCREEN_INSET = {
  top: "1.72%",
  left: "4.35%",
  right: "4.35%",
  bottom: "1.72%",
  radius: "10.2%",
}

interface PhoneMockupProps {
  className?: string
}

function PhoneHeader({ screen }: { screen: Screen }) {
  const meta = SCREEN_META[screen]
  return (
    <div className="shrink-0 border-b border-[#2b2d31] pb-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-wider text-[#c72c3b]">
          {meta.tag}
        </span>
        <div className="flex items-center gap-1">
          {SCREENS.map((s) => (
            <span
              key={s}
              className={`h-1 transition-all duration-300 ${
                s === screen ? "w-3 bg-[#c72c3b]" : "w-1 bg-[#2b2d31]"
              }`}
            />
          ))}
        </div>
      </div>
      <h4 className="mt-1 font-sans text-xs font-medium tracking-tight text-white">
        {meta.title}
      </h4>
      <p className="line-clamp-1 text-[9px] text-[#8a8f98]">{meta.subtitle}</p>
    </div>
  )
}

function SoftwareScreen() {
  return (
    <div className="flex h-full flex-col justify-between p-3 font-mono text-[9px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[#8a8f98]">
          <span className="flex items-center gap-1">
            <Terminal className="h-3 w-3 text-[#c72c3b]" /> main · release-v2.6
          </span>
          <span className="text-[#c72c3b]">DEPLOY ATIVO</span>
        </div>
        <div className="border border-[#2b2d31] bg-[#141518] p-2 text-[#8a8f98]">
          <p className="text-white">
            <span className="text-[#c72c3b]">const</span> system = createPipeline(&#123;
          </p>
          <p className="pl-2">arch: <span className="text-white">"distributed"</span>,</p>
          <p className="pl-2">runtime: <span className="text-white">"next-engine"</span>,</p>
          <p className="pl-2">observability: <span className="text-[#c72c3b]">true</span></p>
          <p>&#125;)</p>
        </div>
        <div className="space-y-1 text-[8px]">
          <div className="flex items-center justify-between border-b border-[#2b2d31] py-1">
            <span className="text-[#8a8f98]">Compilação</span>
            <span className="text-white">Concluída</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#2b2d31] py-1">
            <span className="text-[#8a8f98]">Testes E2E</span>
            <span className="text-white">Aprovados</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#8a8f98]">Status</span>
            <span className="text-[#c72c3b]">Operacional</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuporteScreen() {
  const tickets = [
    { id: "T-804", desc: "Balanceamento de cluster web", status: "Resolvido" },
    { id: "T-803", desc: "Otimização de consulta PostgreSQL", status: "Resolvido" },
    { id: "T-802", desc: "Renovação automática de certificados", status: "Resolvido" },
    { id: "T-801", desc: "Patch de sustentação de kernel", status: "Resolvido" },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-3 text-[9px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-[#2b2d31] pb-1 text-[#8a8f98]">
          <span className="uppercase tracking-wider">Chamados de Infraestrutura</span>
          <span className="text-white">Sustentação Ativa</span>
        </div>
        <div className="space-y-1.5">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border-b border-[#2b2d31] py-1"
            >
              <div>
                <span className="font-mono text-[8px] text-[#c72c3b]">{t.id}</span>
                <p className="line-clamp-1 text-[9px] text-white">{t.desc}</p>
              </div>
              <span className="flex items-center gap-1 font-mono text-[8px] text-white">
                <CheckCircle2 className="h-2.5 w-2.5 text-[#c72c3b]" />
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-[#2b2d31] bg-[#141518] p-1.5 text-center font-mono text-[8px] text-[#8a8f98]">
        Ambiente monitorado em tempo real
      </div>
    </div>
  )
}

function SegurancaScreen() {
  const checks = [
    { name: "Criptografia em trânsito e repouso", status: "Ativo" },
    { name: "Auditoria de dependências e CVEs", status: "Conforme" },
    { name: "Políticas de privilégio mínimo", status: "Aplicado" },
    { name: "Defesa em camadas e WAF", status: "Blindado" },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-3 text-[9px]">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 border-b border-[#2b2d31] pb-1 text-white">
          <Shield className="h-3.5 w-3.5 text-[#c72c3b]" />
          <span className="font-mono text-[8px] uppercase tracking-wider">
            Painel de Cibersegurança
          </span>
        </div>
        <div className="space-y-1.5">
          {checks.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between border-b border-[#2b2d31] py-1"
            >
              <span className="text-[9px] text-[#8a8f98]">{c.name}</span>
              <span className="font-mono text-[8px] text-white">{c.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#2b2d31] pt-1 text-[8px] text-[#8a8f98]">
        <span>Perímetro</span>
        <span className="font-mono text-[#c72c3b]">Protegido</span>
      </div>
    </div>
  )
}

function IaScreen() {
  return (
    <div className="flex h-full flex-col justify-between p-3 text-[9px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-[#2b2d31] pb-1 text-[#8a8f98]">
          <span className="flex items-center gap-1 uppercase tracking-wider">
            <MessageSquare className="h-3 w-3 text-[#c72c3b]" />
            Agente Operacional
          </span>
          <span className="font-mono text-[8px] text-[#c72c3b]">ONLINE</span>
        </div>
        <div className="space-y-2 text-[8px]">
          <div className="border border-[#2b2d31] bg-[#141518] p-2 text-[#8a8f98]">
            <p className="font-mono text-[7px] text-[#c72c3b]">USUÁRIO</p>
            <p className="text-white">Qual o status das integrações de dados?</p>
          </div>
          <div className="border-l-2 border-[#c72c3b] pl-2 text-white">
            <p className="font-mono text-[7px] text-[#8a8f98]">AGENTE ZUSE</p>
            <p className="leading-relaxed text-[#8a8f98]">
              Todas as filas de sincronização operando sem latência. Dados consistentes.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#2b2d31] pt-1 text-[8px] text-[#8a8f98]">
        <span>Fluxo automatizado</span>
        <ArrowUpRight className="h-3 w-3 text-[#c72c3b]" />
      </div>
    </div>
  )
}

function PhoneScreenContent({ screen }: { screen: Screen }) {
  const screens: Record<Screen, ReactNode> = {
    software: <SoftwareScreen />,
    suporte: <SuporteScreen />,
    seguranca: <SegurancaScreen />,
    ia: <IaScreen />,
  }

  return (
    <div className="flex h-full flex-col justify-between pt-7">
      <PhoneHeader screen={screen} />
      <div className="flex-1 overflow-hidden py-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="h-full w-full"
          >
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  const isMobile = useIsMobile()
  const [activeScreen, setActiveScreen] = useState<Screen>("software")

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        const idx = SCREENS.indexOf(prev)
        return SCREENS[(idx + 1) % SCREENS.length]
      })
    }, isMobile ? 5000 : 4200)
    return () => clearInterval(interval)
  }, [isMobile])

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="Interface mobile demonstrando sistemas, sustentação e inteligência Zuse Labs"
    >
      <div className="relative w-full">
        {/* Moldura original do iPhone */}
        <img
          src="/images/iphone-frame.png"
          alt=""
          aria-hidden
          className="relative z-10 block h-auto w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
          draggable={false}
        />

        {/* Tela interna com inset exato */}
        <div
          className="absolute z-20 overflow-hidden"
          style={{
            top: SCREEN_INSET.top,
            left: SCREEN_INSET.left,
            right: SCREEN_INSET.right,
            bottom: SCREEN_INSET.bottom,
            borderRadius: SCREEN_INSET.radius,
            backgroundColor: BRAND.bg,
            border: "1px solid #2b2d31",
          }}
        >
          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute top-[2.4%] left-1/2 z-30 h-[2.8%] min-h-[10px] max-h-[15px] w-[27%] -translate-x-1/2 rounded-full"
            style={{
              backgroundColor: BRAND.island,
              border: "1px solid #1a1a1e",
            }}
          />

          {/* Conteúdo da Tela */}
          <div className="relative h-full w-full overflow-hidden">
            <PhoneScreenContent screen={activeScreen} />
          </div>
        </div>
      </div>
    </div>
  )
}
