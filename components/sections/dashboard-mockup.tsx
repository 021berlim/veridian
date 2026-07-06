"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-none"
    >
      <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Performance</p>
          <p className="font-serif text-lg text-foreground">Painel de campanhas</p>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/30" />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { icon: TrendingUp, label: "Conversão", value: "4.8%" },
          { icon: Users, label: "Leads", value: "1.2K" },
          { icon: BarChart3, label: "ROI", value: "312%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/50 bg-background/60 p-3">
            <stat.icon className="mb-2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className="font-serif text-lg text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex h-24 items-end gap-1.5 px-1">
          {[40, 55, 45, 70, 60, 85, 75, 90, 68, 95, 80, 88].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-foreground/10 transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Jan</span>
          <span>Jun</span>
          <span>Dez</span>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-border/60 pt-4">
        {[
          { name: "Campanha Brand", status: "Ativa", progress: 78 },
          { name: "Funil de vendas", status: "Otimizando", progress: 62 },
          { name: "Automação CRM", status: "Em escala", progress: 91 },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{item.name}</span>
                <span className="text-muted-foreground">{item.status}</span>
              </div>
              <div className="mt-1.5 h-px w-full bg-border">
                <div
                  className="h-px bg-foreground/40 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}