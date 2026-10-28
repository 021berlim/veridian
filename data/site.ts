export const siteFlags = {
  showWork: false,
  showTestimonials: false,
} as const

export const siteConfig = {
  name: "Zuse Labs",
  tagline: "Você sonha, a gente compila.",
  description:
    "Desenvolvimento de software sob medida, plataformas digitais e retaguarda tecnológica para digitalizar processos e levar empresas ao próximo nível.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zuselabs.com",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  },
  socialLinks: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/zuse-labs",
    },
    {
      label: "GitHub",
      url: "https://github.com/zuselabs",
    },
  ],
  pages: {
    home: {
      title: "Zuse Labs | Engenharia de Software, TI e Inteligência Artificial",
      description:
        "Software sob medida, suporte e segurança de TI e inteligência artificial para empresas. Engenharia com rigor e sofisticação.",
    },
  },
} as const

export const landingContent = {
  hero: {
    headline: "Você sonha, a gente compila.",
    subtitle:
      "Desenvolvimento de software sob medida e plataformas digitais para digitalizar processos, eliminar retrabalho e acelerar sua operação.",
    primaryCta: "Iniciar conversa",
    secondaryCta: "Conhecer serviços",
  },
  capabilities: {
    title: "Engenharia pensada para estabilidade, escala e longevidade.",
    description:
      "Combinamos visão arquitetural sólida e execução refinada para construir sistemas confiáveis.",
  },
  process: {
    title: "Método de engenharia transparente e orientado a resultados.",
    subtitle:
      "Da concepção técnica à sustentação em produção, cada etapa é executada com critério e transparência.",
  },
  services: {
    title: "Serviços",
    subtitle: "Atuação especializada nas camadas críticas da tecnologia empresarial.",
  },
  portfolio: {
    title: "Projetos e Sistemas",
    subtitle: "Arquitetura e desenvolvimento para operações contemporâneas.",
  },
  testimonials: {
    title: "Relatos de Engenharia",
  },
  faq: {
    title: "Perguntas Frequentes",
    subtitle: "Esclarecimentos diretos sobre nossa atuação e formato de trabalho.",
  },
  contact: {
    title: "Vamos projetar o próximo capítulo da sua tecnologia?",
    description:
      "Envie os detalhes do seu projeto ou infraestrutura. Nosso time de engenharia analisará o cenário com atenção técnica.",
  },
} as const

export type NavLink = {
  label: string
  href: string
}

export type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; href: string; items: readonly NavLink[] }

export const navItems: readonly NavItem[] = [
  { type: "link", label: "Início", href: "#hero" },
  {
    type: "group",
    label: "Sobre",
    href: "#capacidades",
    items: [
      { label: "Tecnologias", href: "#tecnologias" },
      { label: "Capacidades", href: "#capacidades" },
      { label: "Manifesto", href: "#manifesto" },
    ],
  },
  {
    type: "group",
    label: "Serviços",
    href: "#servicos",
    items: [{ label: "Método", href: "#processo" }],
  },
  { type: "link", label: "FAQ", href: "#faq" },
  { type: "link", label: "Contato", href: "#contato" },
]

export const navLinks: readonly NavLink[] = navItems.flatMap((item) =>
  item.type === "link"
    ? [{ label: item.label, href: item.href }]
    : [{ label: item.label, href: item.href }, ...item.items],
)

export const techStack = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Data & AI" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "Amazon Web Services", category: "Cloud" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Redis", category: "Cache" },
  { name: "GraphQL", category: "API" },
  { name: "Go", category: "Backend" },
] as const

export const clientLogos = [
  { slug: "grupo-atlas", name: "Next.js", src: "/images/clients/grupo-atlas.svg" },
  { slug: "nexus-labs", name: "React", src: "/images/clients/nexus-labs.svg" },
  { slug: "elan-studio", name: "TypeScript", src: "/images/clients/elan-studio.svg" },
  { slug: "vertex-capital", name: "Python", src: "/images/clients/vertex-capital.svg" },
  { slug: "lumina-group", name: "Node.js", src: "/images/clients/lumina-group.svg" },
  { slug: "meridian-co", name: "PostgreSQL", src: "/images/clients/meridian-co.svg" },
  { slug: "forma-digital", name: "Docker", src: "/images/clients/forma-digital.svg" },
  { slug: "orbita-tech", name: "AWS", src: "/images/clients/orbita-tech.svg" },
] as const

export const processFeatures = [
  "Diagnóstico e arquitetura antes de qualquer linha de código",
  "Design system e interfaces com foco em usabilidade e precisão",
  "Engenharia orientada a testes e código sustentável",
  "Observabilidade, segurança e métricas reais em produção",
  "Automação contínua de deploys e pipelines confiáveis",
  "Documentação técnica clara para autonomia da equipe",
] as const

export const services = [
  {
    number: "01",
    icon: "Code2",
    title: "Desenvolvimento de Software sob medida",
    summary: "Sistemas web de alto desempenho e plataformas escaláveis.",
    description:
      "Arquiteturas modernas projetadas com foco em longevidade técnica, interfaces responsivas e código sustentável para o ciclo de vida da empresa.",
    capability: true,
  },
  {
    number: "02",
    icon: "Cpu",
    title: "Suporte e Manutenção de TI",
    summary: "Monitoramento ativo, sustentação e resolução ágil.",
    description:
      "Acompanhamento preventivo de servidores, resolução técnica de incidentes e sustentação contínua da infraestrutura para operações sem atrito.",
    capability: true,
  },
  {
    number: "03",
    icon: "ShieldCheck",
    title: "Cibersegurança",
    summary: "Proteção ativa de dados, auditorias e blindagem operacional.",
    description:
      "Diagnósticos de segurança, implementação de políticas de proteção da informação e defesa em camadas para proteger os ativos críticos da organização.",
    capability: true,
  },
  {
    number: "04",
    icon: "Sparkles",
    title: "Automação e Inteligência Artificial",
    summary: "Agentes inteligentes e fluxos automatizados de processos.",
    description:
      "Integração de modelos de linguagem e automações inteligentes orientadas aos processos internos para reduzir retrabalho e ampliar produtividade.",
    capability: true,
  },
] as const

export const capabilities = services

export const faqs = [
  {
    question: "Como funciona o início de um projeto com a Zuse Labs?",
    answer:
      "Iniciamos com um alinhamento técnico e de negócios para compreender os desafios, requisitos e arquitetura necessária. A partir disso, estruturamos uma proposta com escopo claro e cronograma realista.",
  },
  {
    question: "Qual perfil de empresa a Zuse Labs atende?",
    answer:
      "Atendemos desde empresas consolidadas que necessitam de modernização ou sustentação de infraestrutura até operações em crescimento que demandam sistemas sob medida com padrões rigorosos de engenharia.",
  },
  {
    question: "Vocês desenvolvem sistemas do zero ou também modernizam sistemas legados?",
    answer:
      "Atuamos nas duas frentes. Criamos novas plataformas desde a concepção arquitetural e também executamos refatoração, migração e reforço de segurança em sistemas já em operação.",
  },
  {
    question: "Qual é a diferença entre suporte recorrente e projeto pontual?",
    answer:
      "Projetos pontuais concentram-se na construção e entrega de uma solução com início, meio e fim. O suporte recorrente foca em sustentação preventiva, atualizações de segurança e monitoramento contínuo.",
  },
  {
    question: "Como solicitar uma proposta ou conversar com o time de engenharia?",
    answer:
      "Basta preencher o formulário ao final da página ou acionar nossa atendente digital no canto inferior para um direcionamento ágil e contextualizado.",
  },
] as const

export const projectTypes = [...services.map((service) => service.title), "Outro"] as const

export type Project = {
  readonly slug: string
  readonly label: string
  readonly title: string
  readonly description: string
  readonly category: string
  readonly tags: readonly string[]
  readonly image: string
  readonly imageAlt: string
}

export type Testimonial = {
  readonly quote: string
  readonly author: string
  readonly role: string
  readonly initials: string
}

// Flags de exibição controlam a visibilidade (Regra E9: oculto por padrão até haver conteúdo real)
export const projects: readonly Project[] = []
export const testimonialsRow1: readonly Testimonial[] = []
export const testimonialsRow2: readonly Testimonial[] = []
