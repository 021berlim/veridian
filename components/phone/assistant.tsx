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

export function AssistantView() {
  const tabs = [
    { label: "Hoje" },
    { label: "Tarefas" },
    { label: "Conversa" },
  ]

  const agenda = [
    { time: "09:00", text: "Reunião de alinhamento" },
    { time: "11:30", text: "Revisão de proposta técnica" },
    { time: "15:00", text: "Treino funcional" },
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
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="font-sans text-[4.2cqw] font-bold tracking-tight text-white">Assistente</span>
            </div>
          }
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneGreeting
          greeting="Bom dia!"
          subtitle="Seu dia em um só lugar."
        />
      </div>

      <div className="mt-[2.5cqw]">
        <PhoneTabs tabs={tabs} activeTab={0} />
      </div>

      {/* Cartão Agenda de Hoje */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-[2.5cqw]"
      >
        <PhoneCard>
          <div className="flex items-center justify-between pb-[1cqw]">
            <span className="font-sans text-[3.5cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              Agenda de hoje
            </span>
            <span className="text-[3.2cqw] text-[#c72c3b]">3 compromissos</span>
          </div>

          <div className="flex flex-col gap-[1.2cqw] pt-[0.8cqw]">
            {agenda.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[2.4cqw]">
                <span className="font-mono text-[3.6cqw] font-semibold text-[#c72c3b]">{item.time}</span>
                <span className="truncate font-sans text-[3.8cqw] text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </PhoneCard>
      </motion.div>

      {/* Cartão de Tarefas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="mt-[2.5cqw]"
      >
        <PhoneCard className="p-[2.5cqw]">
          <div className="flex items-center justify-between pb-[0.8cqw]">
            <span className="font-sans text-[3.5cqw] font-normal uppercase tracking-wider text-[#a1a1a6]">
              Tarefas
            </span>
            <span className="text-[3.2cqw] text-[#a1a1a6]">1 de 3 concluídas</span>
          </div>
          <div className="flex flex-col gap-[1cqw] text-[3.6cqw]">
            <div className="flex items-center gap-[2cqw] text-[#a1a1a6] line-through">
              <span className="flex h-[3.2cqw] w-[3.2cqw] items-center justify-center rounded-[0.8cqw] bg-[#c72c3b] text-white text-[2.2cqw]">✓</span>
              <span>Aprovar escopo do projeto</span>
            </div>
            <div className="flex items-center gap-[2cqw] text-white">
              <span className="h-[3.2cqw] w-[3.2cqw] rounded-[0.8cqw] border border-white/40" />
              <span>Enviar relatório semanal</span>
            </div>
          </div>
        </PhoneCard>
      </motion.div>

      {/* Cartão de Conversa (flex-1 para expandir até a base) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="mt-[2.5cqw] flex flex-1 min-h-0 flex-col"
      >
        <PhoneCard className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-[2cqw]">
            {/* Mensagem do Usuário */}
            <div className="self-end max-w-[85%] rounded-[2.4cqw] bg-[#22242a] px-[3cqw] py-[1.8cqw] text-[3.8cqw] text-white">
              Remarque a reunião das 15h para amanhã.
            </div>

            {/* Resposta do Assistente */}
            <div className="self-start max-w-[92%] rounded-[2.4cqw] border border-[#c72c3b]/30 bg-[#0e0e10] px-[3cqw] py-[2cqw] text-[3.8cqw] leading-relaxed text-white">
              Pronto! Reagendei para amanhã às 15h e avisei os participantes.
            </div>
          </div>

          {/* Barra de Entrada */}
          <div className="flex items-center justify-between rounded-full border border-white/[0.1] bg-[#0e0e10] px-[3cqw] py-[1.5cqw]">
            <span className="text-[3.6cqw] text-[#a1a1a6]">Pergunte ou peça algo…</span>
            <span className="flex h-[4.8cqw] w-[4.8cqw] items-center justify-center rounded-full bg-[#c72c3b] text-[3cqw] text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-[2.6cqw] w-[2.6cqw]">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </span>
          </div>
        </PhoneCard>
      </motion.div>

      <PhoneHomeIndicator />
    </div>
  )
}
