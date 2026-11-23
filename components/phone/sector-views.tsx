"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  PhoneStatusBar,
  PhoneAppHeader,
  PhoneGreeting,
  PhoneTabs,
  PhoneCard,
  PhoneHomeIndicator,
} from "./primitives"

function BrandBadge({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-[1.8cqw]">
      <div className="flex h-[5.2cqw] w-[5.2cqw] items-center justify-center rounded-[1.2cqw] bg-[#c72c3b] font-sans text-[3.2cqw] font-bold text-white">
        Z
      </div>
      <span className="font-sans text-[4.1cqw] font-bold tracking-tight text-white">
        {title}
      </span>
    </div>
  )
}

/* 2. ADVOCACIA E ASSESSORIA JURÍDICA */
export function LawFirmView() {
  const tabs = [{ label: "Processos" }, { label: "Prazos" }, { label: "Audiências" }]
  const deadlines = [
    { time: "09:00", title: "Contestação #318", tag: "Urgente", accent: "text-[#c72c3b]" },
    { time: "11:30", title: "Petição inicial #409", tag: "Prazos", accent: "text-white" },
    { time: "15:00", title: "Audiência cível", tag: "Confirmada", accent: "text-[#a1a1a6]" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse Advogados" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Dra. Beatriz" subtitle="Prazos e movimentações do dia." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[3.2cqw] uppercase tracking-wider text-[#a1a1a6]">
              Próximo prazo
            </span>
            <span className="rounded-full bg-[#c72c3b]/20 px-[2.4cqw] py-[0.5cqw] text-[3cqw] font-medium text-[#c72c3b]">
              Urgente
            </span>
          </div>
          <div className="mt-[1.4cqw] font-sans text-[6.4cqw] font-semibold leading-tight text-white">
            Recurso — Caso #402
          </div>
          <div className="mt-[1cqw] font-sans text-[3.4cqw] text-[#a1a1a6]">
            TJ-RJ · 4ª Câmara Cível · Hoje às 17:00
          </div>
        </PhoneCard>
      </motion.div>

      <div className="mt-[2.4cqw] flex-1">
        <div className="mb-[1.6cqw] font-sans text-[3.3cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
          Agenda & Histórico
        </div>
        <div className="space-y-[1.8cqw]">
          {deadlines.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
            >
              <div>
                <div className="font-sans text-[3.7cqw] font-medium text-white">{item.title}</div>
                <div className="font-mono text-[3cqw] text-[#8a8f98]">{item.time}</div>
              </div>
              <span className={`font-sans text-[3.2cqw] font-medium ${item.accent}`}>
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}

/* 3. CONSULTORIA DE TI E INFRAESTRUTURA */
export function ItOpsView() {
  const tabs = [{ label: "Chamados" }, { label: "Servidores" }, { label: "Alertas" }]
  const tickets = [
    { id: "#891", title: "Deploy cluster AWS", status: "Em andamento", color: "text-[#c72c3b]" },
    { id: "#889", title: "Firewall filial SP", status: "Resolvido", color: "text-emerald-400" },
    { id: "#885", title: "Backup banco ERP", status: "Resolvido", color: "text-emerald-400" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse TI" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Equipe" subtitle="Monitoramento e chamados ativos." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[3.2cqw] uppercase tracking-wider text-[#a1a1a6]">
              Status do sistema
            </span>
            <span className="font-mono text-[3.4cqw] font-semibold text-emerald-400">
              99.8% OK
            </span>
          </div>
          <svg viewBox="0 0 220 58" className="mt-[2cqw] h-[16cqw] w-full" fill="none">
            <path
              d="M4 46 L34 38 L62 42 L92 26 L124 30 L156 16 L186 22 L216 10"
              stroke="#c72c3b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 46 L34 38 L62 42 L92 26 L124 30 L156 16 L186 22 L216 10 L216 56 L4 56 Z"
              fill="#c72c3b"
              fillOpacity="0.12"
            />
          </svg>
        </PhoneCard>
      </motion.div>

      <div className="mt-[2.4cqw] flex-1">
        <div className="mb-[1.6cqw] font-sans text-[3.3cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
          Chamados de suporte
        </div>
        <div className="space-y-[1.8cqw]">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
            >
              <div>
                <div className="font-sans text-[3.7cqw] font-medium text-white">{t.title}</div>
                <div className="font-mono text-[3cqw] text-[#8a8f98]">{t.id}</div>
              </div>
              <span className={`font-sans text-[3.1cqw] font-medium ${t.color}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}

/* 4. IMOBILIÁRIA (BUSCA E VENDA) */
export function RealEstateView() {
  const tabs = [{ label: "Comprar" }, { label: "Alugar" }, { label: "Favoritos" }]
  const listings = [
    { name: "Residencial Jardins", specs: "2 quartos · 74m²", price: "R$ 380.000" },
    { name: "Cobertura Atlântica", specs: "4 quartos · 162m²", price: "R$ 890.000" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse Imóveis" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Thiago" subtitle="Encontre seu próximo imóvel." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <PhoneCard>
          <div className="relative h-[24cqw] w-full overflow-hidden rounded-[2.4cqw] bg-gradient-to-br from-[#23252c] via-[#17181d] to-[#0f1014] p-[2.4cqw]">
            <span className="inline-block rounded-full bg-[#c72c3b] px-[2.4cqw] py-[0.5cqw] font-mono text-[2.7cqw] uppercase tracking-wider text-white">
              Lançamento
            </span>
            <svg
              viewBox="0 0 180 60"
              className="absolute right-[2cqw] bottom-0 h-[16cqw] w-[42cqw] opacity-40"
              fill="none"
            >
              <rect x="20" y="16" width="52" height="44" stroke="#ffffff" strokeWidth="1.4" />
              <rect x="84" y="6" width="76" height="54" stroke="#c72c3b" strokeWidth="1.4" />
              <line x1="96" y1="22" x2="148" y2="22" stroke="#ffffff" strokeWidth="1" />
              <line x1="96" y1="36" x2="148" y2="36" stroke="#ffffff" strokeWidth="1" />
            </svg>
          </div>
          <div className="mt-[2.2cqw] flex items-end justify-between">
            <div>
              <div className="font-sans text-[5.8cqw] font-semibold leading-none text-white">
                R$ 450.000
              </div>
              <div className="mt-[1cqw] font-sans text-[3.2cqw] text-[#a1a1a6]">
                3 quartos · 98m² · Barra
              </div>
            </div>
            <span className="rounded-full bg-[#c72c3b] px-[3cqw] py-[1.2cqw] font-sans text-[3cqw] font-medium text-white">
              Agendar visita
            </span>
          </div>
        </PhoneCard>
      </motion.div>

      <div className="mt-[2.2cqw] flex-1 space-y-[1.8cqw]">
        {listings.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
          >
            <div>
              <div className="font-sans text-[3.7cqw] font-medium text-white">{item.name}</div>
              <div className="font-sans text-[3cqw] text-[#8a8f98]">{item.specs}</div>
            </div>
            <span className="font-mono text-[3.4cqw] font-medium text-white">{item.price}</span>
          </div>
        ))}
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}

/* 5. CONSULTOR DE VENDAS IMOBILIÁRIAS (CRM VENDAS) */
export function RealEstateSalesView() {
  const tabs = [{ label: "Pipeline" }, { label: "Contatos" }, { label: "Metas" }]
  const leads = [
    { name: "Fernanda Costa", stage: "Proposta enviada", color: "text-[#c72c3b]" },
    { name: "Lucas Mendes", stage: "Visita agendada", color: "text-white" },
    { name: "Rafael Moura", stage: "Aguardando", color: "text-[#a1a1a6]" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse Vendas" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Amanda" subtitle="Desempenho comercial do mês." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <PhoneCard>
          <span className="font-sans text-[3.2cqw] uppercase tracking-wider text-[#a1a1a6]">
            Vendas do mês
          </span>
          <div className="mt-[1.4cqw] font-sans text-[8cqw] font-semibold leading-none tracking-tight text-white">
            R$ 1,2M
          </div>
          <div className="mt-[2.2cqw] h-[1.8cqw] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "82%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-[#c72c3b]"
            />
          </div>
          <div className="mt-[1.2cqw] font-mono text-[3cqw] text-[#8a8f98]">
            82% da meta mensal atingida
          </div>
        </PhoneCard>
      </motion.div>

      <div className="mt-[2.4cqw] flex-1">
        <div className="mb-[1.6cqw] font-sans text-[3.3cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
          Leads recentes
        </div>
        <div className="space-y-[1.8cqw]">
          {leads.map((l) => (
            <div
              key={l.name}
              className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
            >
              <span className="font-sans text-[3.7cqw] font-medium text-white">{l.name}</span>
              <span className={`font-sans text-[3.1cqw] font-medium ${l.color}`}>{l.stage}</span>
            </div>
          ))}
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}

/* 7. CRM DE VENDAS B2B */
export function CrmB2bView() {
  const tabs = [{ label: "Funil" }, { label: "Clientes" }, { label: "Negócios" }]
  const accounts = [
    { name: "Valkora Industries", value: "R$ 180k", stage: "Fechamento", color: "text-[#c72c3b]" },
    { name: "Kronos Capital", value: "R$ 95k", stage: "Proposta", color: "text-white" },
    { name: "Solaris Grid", value: "R$ 140k", stage: "Diagnóstico", color: "text-[#a1a1a6]" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse CRM" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Carlos" subtitle="Pipeline corporativo ativo." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <PhoneCard>
          <span className="font-sans text-[3.1cqw] uppercase tracking-wider text-[#a1a1a6]">
            Oportunidades em negociação
          </span>
          <div className="mt-[1.4cqw] flex items-baseline justify-between">
            <span className="font-sans text-[7.6cqw] font-semibold leading-none text-white">
              R$ 415k
            </span>
            <span className="font-mono text-[3.2cqw] text-[#c72c3b]">12 contas</span>
          </div>
        </PhoneCard>
      </motion.div>

      <div className="mt-[2.4cqw] flex-1">
        <div className="mb-[1.6cqw] font-sans text-[3.3cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
          Contas corporativas
        </div>
        <div className="space-y-[1.8cqw]">
          {accounts.map((acc) => (
            <div
              key={acc.name}
              className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
            >
              <div>
                <div className="font-sans text-[3.7cqw] font-medium text-white">{acc.name}</div>
                <div className={`font-sans text-[3cqw] ${acc.color}`}>{acc.stage}</div>
              </div>
              <span className="font-mono text-[3.5cqw] font-medium text-white">{acc.value}</span>
            </div>
          ))}
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}

/* 8. CONSULTÓRIO MÉDICO E PRONTUÁRIOS (SAÚDE) */
export function HealthView() {
  const tabs = [{ label: "Pacientes" }, { label: "Prontuários" }, { label: "Prescrições" }]
  const appointments = [
    { time: "14:00", patient: "Aline Silva", status: "Na recepção", color: "text-[#c72c3b]" },
    { time: "15:00", patient: "Pedro Henrique", status: "Confirmado", color: "text-emerald-400" },
    { time: "16:30", patient: "Juliana Rocha", status: "Confirmado", color: "text-[#a1a1a6]" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse Saúde" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Dr. Gabriel" subtitle="Agenda clínica de hoje." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <div className="rounded-[3.5cqw] bg-[#c72c3b] p-[4cqw] text-white">
          <span className="font-mono text-[3cqw] uppercase tracking-wider text-white/80">
            Próxima consulta
          </span>
          <div className="mt-[1.2cqw] font-sans text-[6cqw] font-semibold leading-tight">
            Aline Silva — 14:00
          </div>
          <div className="mt-[0.8cqw] font-sans text-[3.3cqw] text-white/85">
            Retorno clínico · Sala 03
          </div>
        </div>
      </motion.div>

      <div className="mt-[2.4cqw] flex-1">
        <div className="mb-[1.6cqw] font-sans text-[3.3cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
          Consultas do dia
        </div>
        <div className="space-y-[1.8cqw]">
          {appointments.map((item) => (
            <div
              key={item.time}
              className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
            >
              <div>
                <div className="font-sans text-[3.7cqw] font-medium text-white">{item.patient}</div>
                <div className="font-mono text-[3cqw] text-[#8a8f98]">{item.time}</div>
              </div>
              <span className={`font-sans text-[3.1cqw] font-medium ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}

/* 9. LOGÍSTICA E ENTREGAS (ZUSE LOG) */
export function LogisticsView() {
  const tabs = [{ label: "Rotas" }, { label: "Entregas" }, { label: "Veículos" }]
  const packages = [
    { id: "ZL-904", dest: "Av. Paulista, 1420", status: "Em trânsito", color: "text-[#c72c3b]" },
    { id: "ZL-908", dest: "Rua Oscar Freire, 810", status: "Pendente", color: "text-[#a1a1a6]" },
    { id: "ZL-911", dest: "Av. Faria Lima, 3200", status: "Pendente", color: "text-[#a1a1a6]" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<BrandBadge title="Zuse Log" />} />
      </div>
      <div className="mt-[2.4cqw]">
        <PhoneGreeting greeting="Olá, Motorista" subtitle="Rota ativa · 12 entregas hoje." />
      </div>
      <div className="mt-[2.2cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.4cqw]"
      >
        <PhoneCard>
          <span className="font-sans text-[3.2cqw] uppercase tracking-wider text-[#a1a1a6]">
            Próxima entrega
          </span>
          <div className="mt-[1.2cqw] font-sans text-[5.4cqw] font-semibold leading-tight text-white">
            Av. Paulista, 1420
          </div>
          <div className="mt-[2cqw] h-[1.8cqw] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-[#c72c3b]"
            />
          </div>
          <div className="mt-[1cqw] font-mono text-[3cqw] text-[#8a8f98]">
            Chegada estimada: 14 min
          </div>
        </PhoneCard>
      </motion.div>

      <div className="mt-[2.4cqw] flex-1">
        <div className="mb-[1.6cqw] font-sans text-[3.3cqw] font-medium uppercase tracking-wider text-[#a1a1a6]">
          Pacotes na rota
        </div>
        <div className="space-y-[1.8cqw]">
          {packages.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-[2.6cqw] border border-white/[0.06] bg-[#16161a] px-[3.2cqw] py-[2.2cqw]"
            >
              <div>
                <div className="font-sans text-[3.6cqw] font-medium text-white">{p.dest}</div>
                <div className="font-mono text-[3cqw] text-[#8a8f98]">{p.id}</div>
              </div>
              <span className={`font-sans text-[3.1cqw] font-medium ${p.color}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      <PhoneHomeIndicator />
    </div>
  )
}
