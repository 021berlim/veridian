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
  PhoneProgressRow,
  PhoneHomeIndicator,
} from "./primitives"

export function StudentPortalView() {
  const tabs = [
    { label: "Início" },
    { label: "Notas" },
    { label: "Agenda" },
  ]

  const statCards = [
    {
      label: "Frequência",
      value: "94%",
      trend: "↑ Regular",
    },
    {
      label: "Tarefas",
      value: "3",
      trend: "2 para hoje",
    },
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
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span className="font-sans text-[4.2cqw] font-bold tracking-tight text-white">Portal do Aluno</span>
            </div>
          }
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneGreeting
          greeting="Olá, Marina"
          subtitle="Seu desempenho neste semestre."
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      {/* Cartão Próxima Aula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.5cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[3.5cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              Próxima aula
            </span>
            <span className="rounded-full bg-[#c72c3b]/20 px-[2.4cqw] py-[0.6cqw] text-[3.2cqw] font-medium text-[#c72c3b]">
              19h30
            </span>
          </div>

          <div className="mt-[1.5cqw] font-sans text-[7.2cqw] font-semibold leading-none tracking-tight text-white">
            Cálculo II
          </div>

          <div className="mt-[1.4cqw] flex items-center justify-between font-sans text-[3.6cqw] text-[#a1a1a6]">
            <span>Sala 204 · Bloco B</span>
            <span className="text-white/80">Prof. Henrique</span>
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

      {/* Cartão Notas Recentes (flex-1 para expandir) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="mt-[2.5cqw] flex flex-1 min-h-0 flex-col"
      >
        <PhoneCard className="flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between pb-[1cqw]">
            <span className="font-sans text-[3.8cqw] font-medium text-white">
              Notas recentes
            </span>
            <span className="text-[3.8cqw] text-[#a1a1a6]">Semestre 2026.1</span>
          </div>

          <div className="flex flex-1 flex-col justify-around py-[0.8cqw]">
            <PhoneProgressRow
              label="Algoritmos"
              pct={90}
              pctFormatted="9,0"
            />
            <PhoneProgressRow
              label="Banco de Dados"
              pct={85}
              pctFormatted="8,5"
            />
            <PhoneProgressRow
              label="Redes"
              pct={80}
              pctFormatted="8,0"
            />
          </div>
        </PhoneCard>
      </motion.div>

      <PhoneHomeIndicator />
    </div>
  )
}
