"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  PhoneStatusBar,
  PhoneAppHeader,
  PhoneGreeting,
  PhoneTabs,
  PhoneCard,
  PhoneStatCardRow,
  PhoneAreaChart,
  PhoneHomeIndicator,
} from "./primitives"

export function FinanceView() {
  const tabs = [
    { label: "Resumo" },
    { label: "Receitas" },
    { label: "Despesas" },
  ]

  const statCards = [
    {
      label: "A receber",
      value: "R$ 18.300",
      trend: "14 faturas",
    },
    {
      label: "A pagar",
      value: "R$ 9.750",
      trend: "5 boletos",
    },
  ]

  const transactions = [
    { desc: "Recebimento de cliente", val: "+R$ 5.600,00", positive: true, date: "Hoje, 14:20" },
    { desc: "Fornecedor de servidores", val: "−R$ 2.400,00", positive: false, date: "Ontem" },
    { desc: "Assinatura de software", val: "−R$ 189,00", positive: false, date: "24 de Jun" },
  ]

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#0e0e10] px-[4.5cqw] pt-[12cqw] pb-[2cqw] text-white select-none">
      <PhoneStatusBar />

      <div className="mt-[2cqw]">
        <PhoneAppHeader
          leftNode={
            <div className="flex items-center gap-[1.8cqw]">
              <div className="flex h-[5.2cqw] w-[5.2cqw] items-center justify-center rounded-[1.2cqw] bg-[#16161a] border border-white/10 text-[#c72c3b]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[3.6cqw] w-[3.6cqw]">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
              </div>
              <span className="font-sans text-[4.2cqw] font-bold tracking-tight text-white">Financeiro</span>
            </div>
          }
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneGreeting
          greeting="Olá, Carlos"
          subtitle="Seu fluxo de caixa neste mês."
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      {/* Cartão de Saldo Atual com Gráfico de Área */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.5cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[3.5cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              Saldo atual
            </span>
            <div className="flex items-center gap-[1cqw] rounded-full border border-white/10 bg-[#202025] px-[2.4cqw] py-[0.8cqw] text-[3.2cqw] text-[#a1a1a6]">
              <span>Junho</span>
              <span className="text-[2.6cqw]">▾</span>
            </div>
          </div>

          <div className="mt-[1.5cqw] font-sans text-[7.2cqw] font-semibold leading-none tracking-tight text-white">
            R$ 48.920,00
          </div>

          <div className="mt-[1.2cqw] flex items-center gap-[1.2cqw] font-sans text-[3.4cqw]">
            <span className="font-semibold text-[#c72c3b]">↑ 6,2%</span>
            <span className="text-[#a1a1a6]">no período consolidado</span>
          </div>

          <PhoneAreaChart />
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

      {/* Cartão de Movimentações Recentes (flex-1 para expandir) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="mt-[2.5cqw] flex flex-1 min-h-0 flex-col"
      >
        <PhoneCard className="flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between pb-[1cqw]">
            <span className="font-sans text-[3.8cqw] font-medium text-white">
              Últimas movimentações
            </span>
            <span className="text-[3.8cqw] text-[#a1a1a6]">Extrato →</span>
          </div>

          <div className="flex flex-1 flex-col justify-around py-[0.6cqw]">
            {transactions.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between py-[0.8cqw] border-b border-white/[0.04] last:border-b-0">
                <div className="flex flex-col">
                  <span className="font-sans text-[3.8cqw] text-white truncate">{t.desc}</span>
                  <span className="font-sans text-[3.0cqw] text-[#a1a1a6]">{t.date}</span>
                </div>
                <span
                  className={`font-sans text-[3.8cqw] font-semibold ${
                    t.positive ? "text-white" : "text-[#c72c3b]"
                  }`}
                >
                  {t.val}
                </span>
              </div>
            ))}
          </div>
        </PhoneCard>
      </motion.div>

      <PhoneHomeIndicator />
    </div>
  )
}
