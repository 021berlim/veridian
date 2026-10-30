import type {
  ProjectScreens,
  ScreenSource,
  DeviceKind,
} from "@/components/projects/case/stage/types"

export type { ScreenSource }

export type ProjectCategory = "software" | "suporte" | "seguranca" | "ia"

export interface EditorialStat {
  value: string
  label: string
  description?: string
}

export interface EditorialSection {
  title: string
  kicker?: string
  paragraphs: string[]
  quote?: string
  figure?: ScreenSource
}

export interface EditorialData {
  summary: string[]
  stats?: EditorialStat[]
  sections: EditorialSection[]
}

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
  media?: ScreenSource[]
  editorial?: EditorialData
  defaultDevice?: DeviceKind
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

export function getProjectMedia(project: Project): ScreenSource[] {
  if (project.media && project.media.length > 0) {
    return project.media
  }
  const items: ScreenSource[] = []
  if (project.screens?.laptop) items.push(project.screens.laptop)
  if (project.screens?.phone) items.push(project.screens.phone)
  return items
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
    defaultDevice: "laptop",
    year: "2025",
    screens: {
      laptop: {
        type: "image",
        src: "/projects/erp-multiusuario/screen-laptop.png",
      },
      phone: {
        type: "image",
        src: "/projects/erp-multiusuario/screen-phone.png",
      },
    },
    media: [
      {
        type: "image",
        src: "/projects/erp-multiusuario/screen-laptop.png",
        title: "Painel Fiscal SEFAZ e SLAs em tempo real",
      },
      {
        type: "image",
        src: "/projects/erp-multiusuario/screen-phone.png",
        title: "Versão Mobile para Gestores de Filial",
      },
      {
        type: "image",
        src: "/projects/e-ppgfil/screen-laptop.png",
        title: "Módulo de Gestão de Pedidos e Faturamento Central",
      },
      {
        type: "image",
        src: "/projects/cortana/screen-laptop.png",
        title: "Auditoria Contábil e Telemetria em Lote",
      },
      {
        type: "image",
        src: "/projects/cortana/screen-phone.png",
        title: "App de Notificações Críticas em Campo",
      },
    ],
    editorial: {
      summary: [
        "Desenvolvido sob medida para uma holding corporativa com 12 filiais industriais e logísticas no sul do país, o ERP Multiusuário substituiu um mosaico caótico de sistemas legados em Delphi e planilhas descentralizadas. A nova infraestrutura unifica o ciclo fiscal completo, estoque dinâmico e suporte técnico interno em uma plataforma com disponibilidade ininterrupta.",
        "A aplicação opera nativamente em desktop via Electron com motor em Node.js e banco de dados PostgreSQL replicado, oferecendo tolerância ativa a quedas temporárias de conectividade nas unidades remotas através de uma fila local de mensageria com sincronização transacional atômica.",
      ],
      stats: [
        { value: "420ms", label: "Tempo Médio SEFAZ", description: "Autorização de notas fiscais em lote com validação assíncrona." },
        { value: "12", label: "Filiais Conectadas", description: "Sincronização bidirecional de inventário em tempo real." },
        { value: "99.4%", label: "SLA Operacional", description: "Disponibilidade com fallback local tolerante a falhas de rede." },
        { value: "1.482", label: "NF-e Emitidas/Dia", description: "Volume médio processado com auditoria fiscal completa." },
      ],
      sections: [
        {
          kicker: "01 // O CENÁRIO E A FRAGMENTAÇÃO",
          title: "O Custo Operacional da Descentralização",
          paragraphs: [
            "Antes da intervenção da Zuse Labs, cada uma das 12 filiais operava com versões divergentes de banco de dados locais. O fechamento contábil mensal exigia semanas de reconciliação manual de planilhas de transporte e relatórios fiscais, gerando inconsistências frequentes com a Secretaria da Fazenda (SEFAZ) e travamentos em horários de pico comercial.",
            "A equipe de campo precisava de uma interface ágil e sem atrito visual, capaz de validar certificados digitais A1/A3, emitir notas em lote com feedback visual de telemetria e abrir chamados de assistência técnica diretamente vinculados ao lote de entrega com rastreamento de SLA.",
          ],
          quote: "A sincronização em background eliminou os travamentos de caixa e transformou o fechamento contábil mensal de 14 dias em um relatório automatizado emitido em 3 minutos.",
        },
        {
          kicker: "02 // ENGENHARIA DE SOFTWARE",
          title: "Arquitetura com Fila Local e Sincronização Transacional",
          paragraphs: [
            "Para garantir que nenhuma venda ou expedição fosse interrompida por instabilidades de conexão de internet nas unidades fabris, implementamos uma arquitetura modular com banco SQLite embarcado atuando como buffer local sincronizado via WebSockets seguros com o cluster central de PostgreSQL.",
            "Toda transmissão de NF-e passa por um pipeline de mensageria que assina os arquivos XML no próprio cliente, valida as regras tributárias regionais e despacha requisições concorrentes aos webservices estaduais com retry exponencial e failover automático.",
          ],
          figure: {
            type: "image",
            src: "/projects/erp-multiusuario/screen-phone.png",
            title: "Visão Mobile Executiva: Gestores acompanham faturamento e SLAs em tempo real.",
          },
        },
        {
          kicker: "03 // AUDITORIA E TELEMETRIA",
          title: "Central de Chamados e Painel de Telemetria Integrado",
          paragraphs: [
            "Além do módulo contábil, o sistema incorpora um módulo de ITSM (Service Desk) corporativo. Quando um operador sinaliza uma divergência de estoque ou falha de impressora térmica, o sistema anexa automaticamente o log técnico, identificador da filial e status da máquina, reduzindo o tempo de triagem do suporte de TI em 65%.",
            "O dashboard gerencial expõe métricas de latência da SEFAZ por estado, tempo médio de autorização e volume financeiro consolidado, permitindo que a diretoria visualize o pulso da operação a qualquer momento.",
          ],
        },
      ],
    },
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
    defaultDevice: "laptop",
    year: "2024",
    screens: {
      laptop: {
        type: "image",
        src: "/projects/e-ppgfil/screen-laptop.png",
      },
      phone: {
        type: "image",
        src: "/projects/e-ppgfil/screen-phone.png",
      },
    },
    media: [
      {
        type: "image",
        src: "/projects/e-ppgfil/screen-laptop.png",
        title: "Painel de Tramitação de Defesas e Pareceres",
      },
      {
        type: "image",
        src: "/projects/e-ppgfil/screen-phone.png",
        title: "Visão Mobile de Notificações para Discentes",
      },
      {
        type: "image",
        src: "/projects/erp-multiusuario/screen-laptop.png",
        title: "Fluxo de Assinaturas Digitais em Lote",
      },
    ],
    editorial: {
      summary: [
        "Desenvolvido para atender um dos maiores programas de pós-graduação em Filosofia do país, o e-PPGFIL transformou processos acadêmicos burocráticos e dependentes de formulários em papel em um ecossistema digital 100% auditável.",
        "A plataforma gerencia desde a qualificação de dissertações e teses até a convocação de bancas avaliadoras com pareceristas externos, incluindo cálculo automático de prazos regimentais e assinaturas digitais com hash imutável.",
      ],
      stats: [
        { value: "-70%", label: "Redução de Prazos", description: "Tempo entre requerimento inicial e homologação da banca." },
        { value: "100%", label: "Digital e Sem Papel", description: "Zero tramitação física de atas, pareceres e certificados." },
        { value: "0", label: "Extravios Regimentais", description: "Notificações automáticas por e-mail e alerta de prazos." },
        { value: "+400", label: "Protocolos Auditados", description: "Histórico completo com trilha forense por processo." },
      ],
      sections: [
        {
          kicker: "01 // O DESAFIO BUROCRÁTICO",
          title: "Da Pasta Suspensa ao Fluxo Imutável",
          paragraphs: [
            "A rotina de uma pós-graduação stricto sensu envolve dezenas de prazos regulatórios estritos estabelecidos pela CAPES e pelo regimento interno da universidade. Qualquer atraso no parecer de um membro externo da banca de mestrado ou perda de comprovação de créditos podia comprometer a avaliação do programa.",
            "Criamos uma máquina de estados finitos que modela com rigor cada fase do protocolo acadêmico. Professores e alunos acompanham visualmente a etapa atual com transparência absoluta e responsabilidade definida.",
          ],
          quote: "O e-PPGFIL eliminou completamente o risco de perda de prazos regimentais e simplificou a coleta de assinaturas de avaliadores de outras universidades.",
        },
        {
          kicker: "02 // ARQUITETURA E ASSINATURA ELETRÔNICA",
          title: "Assinaturas Verificáveis e Geração Dinâmica de Atas",
          paragraphs: [
            "A solução utiliza Next.js no App Router com banco relacional PostgreSQL gerido por Prisma ORM. Documentos como atas de defesa e pareceres são gerados dinamicamente em PDF/A a partir de templates auditados e assinados eletronicamente com carimbo de data/hora.",
            "Membros externos de bancas recebem links autenticados com verificação de dois fatores (2FA) temporária, permitindo emitir parecer e assinar a ata oficial em qualquer navegador sem necessidade de cadastro complexo.",
          ],
          figure: {
            type: "image",
            src: "/projects/e-ppgfil/screen-phone.png",
            title: "Interface Mobile: Discentes e docentes acompanham o status de protocolos em tempo real.",
          },
        },
      ],
    },
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
    defaultDevice: "phone",
    year: "2024",
    screens: {
      phone: {
        type: "image",
        src: "/projects/fila-cadunico/screen-phone.png",
      },
    },
    media: [
      {
        type: "image",
        src: "/projects/fila-cadunico/screen-phone.png",
        title: "Totem de Senhas Digitais e Chamadas Sonoras",
      },
      {
        type: "image",
        src: "/projects/erp-multiusuario/screen-laptop.png",
        title: "Painel Web Administrativo da Secretaria Municipal",
      },
    ],
    editorial: {
      summary: [
        "Criado para modernizar o atendimento das unidades do CRAS em uma gestão municipal, o Fila CadÚnico organiza a fila presencial de famílias em vulnerabilidade social, garantindo atendimento prioritário humanizado e controle estatístico de capacidade por assistente social.",
        "O sistema funciona em totens de atendimento e smartphones de baixo custo distribuídos nas salas de espera, emitindo senhas digitais com chamadas por síntese de voz (TTS) e exibição síncrona em telões de monitoramento.",
      ],
      stats: [
        { value: "-45%", label: "Tempo Percebido de Espera", description: "Estimativa clara de tempo e triagem rápida de prioridades." },
        { value: "3.200+", label: "Atendimentos/Mês", description: "Fluxo médio organizado nas unidades municipais do CRAS." },
        { value: "100%", label: "Acessibilidade Sonora", description: "Chamada por voz para idosos e pessoas com deficiência visual." },
        { value: "0", label: "Filas na Calçada", description: "Distribuição inteligente de senhas com teto de capacidade." },
      ],
      sections: [
        {
          kicker: "01 // IMPACTO SOCIAL E HUMANIZAÇÃO",
          title: "Organização do Atendimento ao Cidadão",
          paragraphs: [
            "A inscrição no Cadastro Único é a porta de entrada para programas como Bolsa Família e Tarifa Social de Energia. Anteriormente, cidadãos enfrentavam filas físicas na madrugada para conseguir uma ficha de atendimento.",
            "O aplicativo estabeleceu uma fila virtual transparente. Ao retirar a senha no totem ou no balcão de acolhimento, o usuário sabe exatamente quantas pessoas estão à sua frente e a previsão de atendimento por tipo de serviço.",
          ],
          quote: "A chamada sonora e o telão central deram dignidade ao processo de acolhimento social das famílias.",
        },
        {
          kicker: "02 // ENGENHARIA DE BAIXO CONSUMO",
          title: "Resiliência em Dispositivos Populares e Cache em Redis",
          paragraphs: [
            "O frontend foi construído em React Native com design de alto contraste e tipografia ampliada, garantindo legibilidade em totens táteis e celulares populares. A mensageria em tempo real é sustentada por Redis Pub/Sub e WebSockets, assegurando atualização instantânea em milissegundos nos telões da sala de espera.",
          ],
          figure: {
            type: "image",
            src: "/projects/fila-cadunico/screen-phone.png",
            title: "Interface do Usuário: Telas claras de senha e estimativa de chamada.",
          },
        },
      ],
    },
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
    defaultDevice: "laptop",
    year: "2025",
    screens: {
      laptop: {
        type: "image",
        src: "/projects/cortana/screen-laptop.png",
      },
      phone: {
        type: "image",
        src: "/projects/cortana/screen-phone.png",
      },
    },
    media: [
      {
        type: "image",
        src: "/projects/cortana/screen-laptop.png",
        title: "Workspace de Pesquisa com Citação de Fontes",
      },
      {
        type: "image",
        src: "/projects/cortana/screen-phone.png",
        title: "Interface Conversacional Mobile",
      },
      {
        type: "image",
        src: "/projects/erp-multiusuario/screen-laptop.png",
        title: "Sintetizador Automatizado de Relatórios",
      },
    ],
    editorial: {
      summary: [
        "A Cortana é um agente autônomo de inteligência artificial voltado para análise regulatória, auditoria de normas técnicas e compilação de inteligência de mercado para setores industriais de alta complexidade.",
        "Diferente de assistentes generativos convencionais propensos a alucinações, a Cortana implementa uma arquitetura de pesquisa em árvore com busca vetorial híbrida e verificação cruzada de fontes primárias, gerando relatórios com índice de confiança auditável.",
      ],
      stats: [
        { value: "10x", label: "Aceleração de Pesquisa", description: "Compilação de dossiês analíticos em minutos em vez de dias." },
        { value: "100%", label: "Citação Rastreável", description: "Cada parágrafo gerado possui link auditado para a fonte original." },
        { value: "0", label: "Alucinações Críticas", description: "Pós-processador com checagem de fatos por múltiplos modelos." },
        { value: "50k+", label: "Vetores Indexados", description: "Base de conhecimento em Qdrant com busca semântica contínua." },
      ],
      sections: [
        {
          kicker: "01 // O PROBLEMA DA ALUCINAÇÃO EM IA",
          title: "Inteligência Artificial que Responde por Fatos, Não por Probabilidades",
          paragraphs: [
            "Para advogados corporativos e engenheiros de normas regulatórias, um dado falso em um parecer técnico pode acarretar multas milionárias ou cancelamento de projetos. Chatbots tradicionais de linguagem não foram construídos para auditoria factual rígida.",
            "Desenvolvemos a Cortana para trabalhar como um analista investigativo: ela divide uma pergunta complexa em sub-perguntas, pesquisa ativamente na web em bases públicas e privadas, sintetiza os achados e referencia numericamente cada afirmação no documento final.",
          ],
          quote: "A precisão matemática na citação de fontes permitiu adotar IA generativa em processos de auditoria que antes eram 100% manuais.",
        },
        {
          kicker: "02 // ENGENHARIA DE AGENTES COGNITIVOS",
          title: "Pipeline RAG Híbrido com Orquestração em FastAPI",
          paragraphs: [
            "O backend é construído em Python com FastAPI assíncrono conectado a um banco vetorial Qdrant de baixa latência. Documentos técnicos são divididos em chunks semânticos com embeddings densos e esparsos (BM25 + Dense Vectors) para garantir máxima recuperação de termos técnicos exatos.",
          ],
          figure: {
            type: "image",
            src: "/projects/cortana/screen-laptop.png",
            title: "Painel de Análise: Rastreamento detalhado de cada fonte citada e árvore de raciocínio.",
          },
        },
      ],
    },
  },
]
