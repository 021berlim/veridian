export interface PhoneScreenItem {
  id: string
  name: string
  avif: string
  webp: string
}

export const PHONE_SCREENS: readonly PhoneScreenItem[] = [
  {
    id: "landing-page",
    name: "Fernanda Talavera — Landing Page Imobiliária",
    avif: "/images/phone-screens/landing-page.avif",
    webp: "/images/phone-screens/landing-page.webp",
  },
  {
    id: "workshop",
    name: "Oficina Mecânica — Gestão de O.S.",
    avif: "/images/phone-screens/workshop.avif",
    webp: "/images/phone-screens/workshop.webp",
  },
  {
    id: "law-firm",
    name: "Zuse Advogados — Assessoria Jurídica",
    avif: "/images/phone-screens/law-firm.avif",
    webp: "/images/phone-screens/law-firm.webp",
  },
  {
    id: "it-ops",
    name: "Zuse TI — Infraestrutura e Chamados",
    avif: "/images/phone-screens/it-ops.avif",
    webp: "/images/phone-screens/it-ops.webp",
  },
  {
    id: "real-estate",
    name: "Zuse Imóveis — Busca e Venda",
    avif: "/images/phone-screens/real-estate.avif",
    webp: "/images/phone-screens/real-estate.webp",
  },
  {
    id: "real-estate-sales",
    name: "Zuse Vendas — CRM Imobiliário",
    avif: "/images/phone-screens/real-estate-sales.avif",
    webp: "/images/phone-screens/real-estate-sales.webp",
  },
  {
    id: "finance",
    name: "Zuse Labs Finanças — Dashboard Corporativo",
    avif: "/images/phone-screens/finance.avif",
    webp: "/images/phone-screens/finance.webp",
  },
  {
    id: "crm-b2b",
    name: "Zuse CRM — Vendas B2B",
    avif: "/images/phone-screens/crm-b2b.avif",
    webp: "/images/phone-screens/crm-b2b.webp",
  },
  {
    id: "health",
    name: "Zuse Saúde — Consultório e Prontuários",
    avif: "/images/phone-screens/health.avif",
    webp: "/images/phone-screens/health.webp",
  },
  {
    id: "logistics",
    name: "Zuse Log — Logística e Entregas",
    avif: "/images/phone-screens/logistics.avif",
    webp: "/images/phone-screens/logistics.webp",
  },
  {
    id: "assistant",
    name: "Assistente Inteligente",
    avif: "/images/phone-screens/assistant.avif",
    webp: "/images/phone-screens/assistant.webp",
  },
] as const
