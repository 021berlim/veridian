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
  PhoneHomeIndicator,
} from "./primitives"

export function WorkshopView() {
  const tabs = [
    { label: "Hoje" },
    { label: "Agenda" },
    { label: "Estoque" },
  ]

  const statCards = [
    {
      label: "OS abertas",
      value: "8",
      trend: "3 prioritárias",
    },
    {
      label: "Concluídas",
      value: "5",
      trend: "Meta diária OK",
    },
  ]

  const orders = [
    { id: "#1042", car: "Fiat Argo", service: "Revisão", status: "Aguardando peça", color: "text-[#a1a1a6]" },
    { id: "#1043", car: "VW Gol", service: "Freios", status: "Em andamento", color: "text-[#c72c3b]" },
    { id: "#1044", car: "Toyota Corolla", service: "Alinhamento", status: "Concluído", color: "text-white" },
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
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="font-sans text-[4.2cqw] font-bold tracking-tight text-white">Oficina</span>
            </div>
          }
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneGreeting
          greeting="Olá, Ricardo"
          subtitle="Ordens de serviço de hoje."
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      {/* Cartão Em Atendimento */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.5cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[3.5cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              Em atendimento
            </span>
            <span className="rounded-full bg-[#c72c3b]/20 px-[2.4cqw] py-[0.6cqw] text-[3.2cqw] font-medium text-[#c72c3b]">
              Em andamento
            </span>
          </div>

          <div className="mt-[1.5cqw] font-sans text-[7.2cqw] font-semibold leading-none tracking-tight text-white">
            Honda Civic 2019
          </div>

          <div className="mt-[1.2cqw] font-sans text-[3.6cqw] text-[#a1a1a6]">
            Troca de óleo e filtros gerais
          </div>

          <div className="mt-[2cqw] relative h-[1.8cqw] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ background: "linear-gradient(90deg, #5a141b 0%, #c72c3b 100%)" }}
              className="h-full rounded-full"
            />
          </div>
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

      {/* Cartão de Ordens de Serviço (flex-1 para expandir) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="mt-[2.5cqw] flex flex-1 min-h-0 flex-col"
      >
        <PhoneCard className="flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between pb-[1cqw]">
            <span className="font-sans text-[3.8cqw] font-medium text-white">
              Ordens de serviço
            </span>
            <span className="text-[3.8cqw] text-[#a1a1a6]">Filtrar →</span>
          </div>

          <div className="flex flex-1 flex-col justify-around py-[0.6cqw]">
            {orders.map((o, idx) => (
              <div key={idx} className="flex items-center justify-between py-[0.8cqw] border-b border-white/[0.04] last:border-b-0">
                <div className="flex items-center gap-[2cqw]">
                  <span className="font-mono text-[3.4cqw] text-[#a1a1a6]">{o.id}</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[3.8cqw] text-white truncate">{o.car}</span>
                    <span className="font-sans text-[3.0cqw] text-[#a1a1a6]">{o.service}</span>
                  </div>
                </div>
                <span className={`font-sans text-[3.6cqw] font-medium ${o.color}`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-[1cqw] flex items-center justify-between rounded-[2cqw] bg-[#202025] px-[2.8cqw] py-[1.2cqw] text-[3.2cqw]">
            <span className="text-[#c72c3b] font-medium">⚠️ Estoque baixo</span>
            <span className="text-white">Filtro de óleo (4 un.)</span>
          </div>
        </PhoneCard>
      </motion.div>

      <PhoneHomeIndicator />
    </div>
  )
}
