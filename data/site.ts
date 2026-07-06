export const siteConfig = {
  name: "Veridian Capital",
  tagline: "Estratégia, design e tecnologia para marcas de alto valor.",
  description:
    "Agência premium de marketing digital, desenvolvimento de software, design e consultoria para marcas que buscam presença digital sofisticada e crescimento sustentável.",
  url: "https://veridiancapital.com",
  contact: {
    email: "contato@veridiancapital.com",
  },
  socialLinks: [
    {
      label: "Instagram",
      url: "https://www.instagram.com/veridiancapital",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/veridian-capital",
    },
  ],
  pages: {
    home: {
      title: "Veridian Capital | Marcas, Sistemas e Experiências Digitais",
      description:
        "Construímos marcas, sistemas e experiências digitais de alto valor com marketing, software, design e consultoria integrados para empresas que exigem excelência.",
    },
  },
} as const

export const landingContent = {
  hero: {
    headline: "Construindo marcas, sistemas e experiências digitais de alto valor.",
  },
  capabilities: {
    title: "Tudo que sua marca precisa para crescer com consistência.",
  },
  process: {
    title: "Projetos digitais pensados para escala, clareza e resultado.",
  },
  services: {
    title: "Serviços",
  },
  portfolio: {
    title: "Trabalhos selecionados",
    subtitle: "Estética, tecnologia e estratégia em cada entrega.",
  },
  testimonials: {
    title: "O que dizem sobre a Veridian",
  },
  faq: {
    title: "Perguntas frequentes",
  },
  contact: {
    title: "Vamos construir algo de alto valor?",
    description: "Conte sobre seu projeto. Retornamos com uma análise personalizada.",
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
      { label: "Clientes", href: "#clientes" },
      { label: "Capacidades", href: "#capacidades" },
    ],
  },
  {
    type: "group",
    label: "Serviços",
    href: "#servicos",
    items: [{ label: "Processo", href: "#processo" }],
  },
  {
    type: "group",
    label: "Trabalhos",
    href: "#trabalhos",
    items: [{ label: "Depoimentos", href: "#depoimentos" }],
  },
  {
    type: "group",
    label: "Contato",
    href: "#contato",
    items: [{ label: "FAQ", href: "#faq" }],
  },
]

export const navLinks: readonly NavLink[] = navItems.flatMap((item) =>
  item.type === "link"
    ? [{ label: item.label, href: item.href }]
    : [{ label: item.label, href: item.href }, ...item.items],
)

export const clientLogos = [
  { slug: "grupo-atlas", name: "Grupo Atlas", src: "/images/clients/grupo-atlas.svg" },
  { slug: "nexus-labs", name: "Nexus Labs", src: "/images/clients/nexus-labs.svg" },
  { slug: "elan-studio", name: "Élan Studio", src: "/images/clients/elan-studio.svg" },
  { slug: "vertex-capital", name: "Vertex Capital", src: "/images/clients/vertex-capital.svg" },
  { slug: "lumina-group", name: "Lumina Group", src: "/images/clients/lumina-group.svg" },
  { slug: "meridian-co", name: "Meridian & Co", src: "/images/clients/meridian-co.svg" },
  { slug: "forma-digital", name: "Forma Digital", src: "/images/clients/forma-digital.svg" },
  { slug: "orbita-tech", name: "Órbita Tech", src: "/images/clients/orbita-tech.svg" },
] as const

export const processFeatures = [
  "Estratégia antes da execução",
  "Interfaces sofisticadas",
  "Desenvolvimento escalável",
  "Performance e mensuração",
  "Automação de processos",
  "Experiência premium",
] as const

export const services = [
  {
    number: "01",
    icon: "Target",
    title: "Marketing Digital",
    summary: "Posicionamento, campanhas, funis e crescimento.",
    description:
      "Estratégias digitais, posicionamento de marca, campanhas online, funis de venda e crescimento orientado por dados.",
    capability: true,
  },
  {
    number: "02",
    icon: "Code2",
    title: "Desenvolvimento de Software",
    summary: "Sistemas web, plataformas digitais, automações e integrações.",
    description:
      "Sistemas personalizados, aplicações web, plataformas digitais, automações, integrações e produtos digitais escaláveis.",
    capability: true,
  },
  {
    number: "03",
    icon: "Palette",
    title: "Design & Experiência",
    summary: "Identidade visual, UI/UX e interfaces sofisticadas.",
    description:
      "Identidade visual, UI/UX, interfaces digitais e experiências sofisticadas para marcas de alto valor.",
    capability: true,
  },
  {
    number: "04",
    icon: "LineChart",
    title: "Consultoria Digital",
    summary: "Análise estratégica e direcionamento para crescimento sustentável.",
    description:
      "Análise estratégica, melhoria de processos, presença digital e direcionamento para crescimento sustentável.",
    capability: false,
  },
] as const

export const capabilities = services.filter((service) => service.capability)

export const projects = [
  {
    slug: "alpha",
    label: "Software Empresarial",
    title: "Projeto Alpha",
    description:
      "Sistema empresarial desenvolvido para otimização de processos, automação e clareza operacional em escala.",
    category: "Software",
    tags: ["Automação", "Dashboard", "API", "Escalável"],
    image: "/images/projects/alpha.svg",
    imageAlt: "Interface do Projeto Alpha — sistema empresarial",
  },
  {
    slug: "nova",
    label: "Identidade Digital",
    title: "Projeto Nova",
    description:
      "Identidade digital e plataforma web criadas para posicionamento premium e presença online sofisticada.",
    category: "Branding",
    tags: ["Branding", "UI/UX", "Web", "Posicionamento"],
    image: "/images/projects/nova.svg",
    imageAlt: "Interface do Projeto Nova — identidade digital",
  },
  {
    slug: "vertex",
    label: "Plataforma SaaS",
    title: "Projeto Vertex",
    description:
      "Solução SaaS personalizada com foco em escala, performance e experiência do usuário de alto padrão.",
    category: "SaaS",
    tags: ["SaaS", "Cloud", "Performance", "Integrações"],
    image: "/images/projects/vertex.svg",
    imageAlt: "Interface do Projeto Vertex — plataforma SaaS",
  },
  {
    slug: "lumina",
    label: "Estratégia Digital",
    title: "Projeto Lumina",
    description:
      "Estratégia digital e presença online para marca de alto valor, unindo campanhas, funis e mensuração.",
    category: "Marketing",
    tags: ["Campanhas", "Funis", "Analytics", "Crescimento"],
    image: "/images/projects/lumina.svg",
    imageAlt: "Interface do Projeto Lumina — estratégia digital",
  },
] as const

export const testimonialsRow1 = [
  {
    quote:
      "A Veridian traduziu nossa visão em uma presença digital muito mais sofisticada e estratégica.",
    author: "Carolina Mendes",
    role: "Diretora de Marca",
    initials: "CM",
  },
  {
    quote:
      "O projeto elevou a percepção da nossa marca e trouxe clareza para nossa comunicação.",
    author: "Rafael Torres",
    role: "CEO, Grupo Atlas",
    initials: "RT",
  },
  {
    quote:
      "Uniram design, tecnologia e estratégia com um nível de cuidado difícil de encontrar.",
    author: "Isabela Costa",
    role: "Head de Operações",
    initials: "IC",
  },
] as const

export const testimonialsRow2 = [
  {
    quote:
      "A entrega do sistema superou expectativas — escalável, elegante e alinhado ao nosso posicionamento.",
    author: "Lucas Ferreira",
    role: "CTO, Nexus Labs",
    initials: "LF",
  },
  {
    quote:
      "Finalmente uma agência que pensa estratégia antes de executar. O resultado foi imediato.",
    author: "Marina Alves",
    role: "Fundadora, Élan Studio",
    initials: "MA",
  },
  {
    quote:
      "Profissionalismo, estética refinada e tecnologia de ponta. Parceria que recomendo sem hesitar.",
    author: "Pedro Santana",
    role: "Diretor Comercial",
    initials: "PS",
  },
] as const

export const faqs = [
  {
    question: "Como funciona o início de um projeto?",
    answer:
      "A primeira etapa é uma análise estratégica para entender o negócio, os objetivos, o público e as oportunidades digitais.",
  },
  {
    question: "A Veridian trabalha apenas com marketing?",
    answer: "Não. Atuamos de forma integrada em toda a operação digital.",
  },
  {
    question: "Vocês desenvolvem sistemas personalizados?",
    answer: "Sim. Criamos sistemas web, plataformas e aplicações sob medida.",
  },
  {
    question: "A Veridian atende empresas iniciantes?",
    answer:
      "Sim, desde que o projeto tenha clareza de objetivo e potencial de crescimento.",
  },
  {
    question: "Como solicitar uma proposta?",
    answer:
      'Basta entrar em contato pelo formulário ou pelo botão "Iniciar projeto".',
  },
] as const

export const projectTypes = [...services.map((service) => service.title), "Outro"] as const