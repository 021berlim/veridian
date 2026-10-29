import type { ProjectScreens } from "@/components/projects/case/stage/types"

export type ProjectCategory = "software" | "suporte" | "seguranca" | "ia"

export interface Project {
  slug: string
  name: string
  category: ProjectCategory
  tagline: string
  context: string
  challenge: string
  solution: string
  result?: string
  stack: string[]
  screens: ProjectScreens
  year?: string
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  software: "Software",
  suporte: "Suporte",
  seguranca: "Segurança",
  ia: "IA",
}

export const CATEGORY_SERVICE_MAP: Record<ProjectCategory, string> = {
  software: "Desenvolvimento de Software sob medida",
  suporte: "Suporte e Manutenção de TI",
  seguranca: "Cibersegurança",
  ia: "Automação e Inteligência Artificial",
}

export const projects: readonly Project[] = [
  {
    slug: "erp-multiusuario",
    name: "ERP multiusuário",
    category: "software",
    tagline: "Aplicativo desktop multiplataforma com emissão de notas fiscais e central de chamados.",
    context:
      "Operação corporativa com 12 filiais distribuídas necessitando de controle unificado de faturamento, estoque compartilhado e abertura de chamados técnicos internos.",
    challenge:
      "Substituir sistemas legados instáveis e planilhas desconexas por uma aplicação segura, rápida e tolerante a oscilações de rede nas filiais.",
    solution:
      "Desenvolvimento em arquitetura modular com sincronização de dados em background, mensageria transacional, integração direta à SEFAZ para NF-e em lote e painel com SLA em tempo real.",
    result:
      "Tempo médio de autorização de notas reduzido para menos de 500ms e centralização integral das filiais em uma base única auditável.",
    stack: ["TypeScript", "Electron", "Node.js", "PostgreSQL", "Tailwind CSS"],
    screens: {
      laptop: {
        type: "image",
        src: "/projects/erp-multiusuario.svg",
      },
    },
    year: "2025",
  },
  {
    slug: "e-ppgfil",
    name: "e-PPGFIL",
    category: "software",
    tagline: "Gestão eletrônica de protocolos, trâmites e defesas acadêmicas para pós-graduação.",
    context:
      "Programa de pós-graduação acadêmica com alto volume de solicitações formais, submissão de artigos, composição de bancas de mestrado/doutorado e pareceres institucionais.",
    challenge:
      "Eliminar a tramitação física de papéis, extravios e lentidão nos despachos entre coordenação, docentes, discentes e secretaria geral.",
    solution:
      "Plataforma web com fluxo auditável de etapas, controle rigoroso de prazos regimentais, geração de pareceres e assinaturas digitais com trilha de auditoria completa.",
    result:
      "Eliminação total do uso de papel e redução de mais de 70% no tempo decorrido entre submissão e homologação de defesas.",
    stack: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
    screens: {
      laptop: {
        type: "image",
        src: "/projects/e-ppgfil.svg",
      },
    },
    year: "2024",
  },
  {
    slug: "fila-cadunico",
    name: "Fila CadÚnico",
    category: "software",
    tagline: "Aplicativo Android de fila de atendimento e triagem social para gestão municipal.",
    context:
      "Secretaria de Assistência Social municipal atendendo diariamente centenas de famílias para atualização e inclusão no Cadastro Único em postos descentralizados.",
    challenge:
      "Organizar o fluxo presencial de atendimento em postos públicos com interface acessível para públicos diversos e painel de controle em tempo real para os agentes.",
    solution:
      "Aplicativo Android otimizado para celulares populares e totens, com emissão de senhas digitais, chamadas sonoras, estimativa de tempo e painel web administrativo.",
    result:
      "Redução expressiva no tempo percebido de espera e controle transparente da capacidade diária de cada unidade de atendimento.",
    stack: ["React Native", "Android", "Node.js", "Redis", "Docker"],
    screens: {
      laptop: {
        type: "image",
        src: "/projects/fila-cadunico.svg",
      },
    },
    year: "2024",
  },
  {
    slug: "cortana",
    name: "Cortana",
    category: "ia",
    tagline: "Assistente inteligente com busca web profunda e geração automatizada de relatórios técnicos.",
    context:
      "Equipes de engenharia e inteligência operacional que demandavam consolidação analítica de normas técnicas, mercado setorial e auditoria de fontes públicas.",
    challenge:
      "Superar os limites de chatbots convencionais, garantindo raciocínio em múltiplos passos, busca ativa em tempo real na web e zero tolerância a alucinações críticas.",
    solution:
      "Agente cognitivo com busca vetorial híbrida (RAG), orquestração de sub-tarefas de pesquisa, citação auditável de fontes e sintetizador de relatórios técnicos prontos para exportação.",
    result:
      "Automação de relatórios de mercado que antes demandavam dias de compilação manual, agora gerados em minutos com rastreabilidade total.",
    stack: ["Python", "FastAPI", "OpenAI / OpenRouter", "Qdrant", "Next.js"],
    screens: {
      laptop: {
        type: "image",
        src: "/projects/cortana.svg",
      },
    },
    year: "2025",
  },
]
