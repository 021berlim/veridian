"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  PhoneStatusBar,
  PhoneAppHeader,
  ZuseLogoSmall,
  PhoneGreeting,
  PhoneTabs,
  PhoneCard,
  PhoneStatCardRow,
  PhoneBarChart,
  PhoneProgressRow,
  PhoneHomeIndicator,
  UsersIcon,
  CubeIcon,
} from "./primitives"

export function ClientDashboardView() {
  const tabs = [
    {
      label: "Visão geral",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[3.6cqw] w-[3.6cqw]">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
    },
    {
      label: "Projetos",
      icon: <CubeIcon className="h-[3.6cqw] w-[3.6cqw]" />,
    },
    {
      label: "Financeiro",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[3.6cqw] w-[3.6cqw]">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
  ]

  const bars = [
    { label: "Jan", height: 35 },
    { label: "Fev", height: 45 },
    { label: "Mar", height: 55 },
    { label: "Abr", height: 68 },
    { label: "Mai", height: 82 },
    { label: "Jun", height: 100 },
  ]

  const statCards = [
    {
      icon: <UsersIcon className="h-[4cqw] w-[4cqw]" />,
      label: "Clientes ativos",
      value: "320",
      trend: "↑ +8,3%",
    },
    {
      icon: <CubeIcon className="h-[4cqw] w-[4cqw]" />,
      label: "Projetos em andamento",
      value: "12",
      trend: "↑ +20%",
    },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      {/* Barra de Status */}
      <PhoneStatusBar />

      {/* Cabeçalho */}
      <div className="mt-[2cqw]">
        <PhoneAppHeader leftNode={<ZuseLogoSmall />} />
      </div>

      {/* Saudação */}
      <div className="mt-[2.5cqw]">
        <PhoneGreeting
          greeting="Olá, cliente"
          subtitle="Aqui está o resumo do seu negócio."
        />
      </div>

      {/* Abas segmentadas */}
      <div className="mt-[2.5cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      {/* Cartão de Receita Mensal com Gráfico de Barras */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.5cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[3.5cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              Receita mensal
            </span>
            <div className="flex items-center gap-[1cqw] rounded-full border border-white/10 bg-[#202025] px-[2.4cqw] py-[0.8cqw] text-[3.2cqw] text-[#a1a1a6]">
              <span>Mensal</span>
              <span className="text-[2.6cqw]">▾</span>
            </div>
          </div>

          <div className="mt-[1.5cqw] font-sans text-[7.2cqw] font-semibold leading-none tracking-tight text-white">
            R$ 12.430,00
          </div>

          <div className="mt-[1.2cqw] flex items-center gap-[1.2cqw] font-sans text-[3.4cqw]">
            <span className="font-semibold text-[#c72c3b]">↑ 12,5%</span>
            <span className="text-[#a1a1a6]">em relação ao mês anterior</span>
          </div>

          <PhoneBarChart bars={bars} />
        </PhoneCard>
      </motion.div>

      {/* Dois cartões lado a lado */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="mt-[2.5cqw]"
      >
        <PhoneStatCardRow cards={statCards} />
      </motion.div>

      {/* Cartão de Canais principais (flex-1 para expandir até a base) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="mt-[2.5cqw] flex flex-1 min-h-0 flex-col"
      >
        <PhoneCard className="flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between pb-[1cqw]">
            <span className="font-sans text-[3.8cqw] font-medium text-white">
              Principais canais
            </span>
            <span className="text-[3.8cqw] text-[#a1a1a6]">→</span>
          </div>

          <div className="flex flex-1 flex-col justify-around py-[0.8cqw]">
            <PhoneProgressRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[3.6cqw] w-[3.6cqw] text-[#a1a1a6]">
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              }
              label="Instagram"
              pct={42}
              pctFormatted="42%"
            />
            <PhoneProgressRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[3.6cqw] w-[3.6cqw] text-[#a1a1a6]">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" x2="22" y1="12" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
              label="Site"
              pct={28}
              pctFormatted="28%"
            />
            <PhoneProgressRow
              icon={<UsersIcon className="h-[3.6cqw] w-[3.6cqw] text-[#a1a1a6]" />}
              label="Indicação"
              pct={18}
              pctFormatted="18%"
            />
            <PhoneProgressRow
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-[3.6cqw] w-[3.6cqw] text-[#a1a1a6]">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              }
              label="Outros"
              pct={12}
              pctFormatted="12%"
            />
          </div>
        </PhoneCard>
      </motion.div>

      {/* Indicador de home */}
      <PhoneHomeIndicator />
    </div>
  )
}
