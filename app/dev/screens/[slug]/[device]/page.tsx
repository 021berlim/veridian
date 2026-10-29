import { notFound } from "next/navigation"

interface DevScreenPageProps {
  params: Promise<{
    slug: string
    device: string
  }>
}

export default async function DevScreenPage({ params }: DevScreenPageProps) {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  const { slug, device } = await params

  if (device !== "laptop" && device !== "phone") {
    notFound()
  }

  // Fila CadÚnico é exclusivo para celular
  if (slug === "fila-cadunico" && device === "laptop") {
    notFound()
  }

  const isLaptop = device === "laptop"

  return (
    <div
      style={{
        width: isLaptop ? 1920 : 1170,
        height: isLaptop ? 1200 : 2532,
      }}
      className="bg-[#0b0c0e] text-[#f4f5f8] font-sans antialiased overflow-hidden select-none flex flex-col"
    >
      {slug === "erp-multiusuario" && (isLaptop ? <ERPLaptop /> : <ERPPhone />)}
      {slug === "e-ppgfil" && (isLaptop ? <PPGFILLaptop /> : <PPGFILPhone />)}
      {slug === "fila-cadunico" && <CadUnicoPhone />}
      {slug === "cortana" && (isLaptop ? <CortanaLaptop /> : <CortanaPhone />)}
    </div>
  )
}

/* =========================================================================
   1. ERP MULTIUSUÁRIO (DESKTOP + MOBILE)
   ========================================================================= */

function ERPLaptop() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0b] text-[#f4f5f8]">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-[#2b2d31] px-8 bg-[#101114]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold tracking-tight text-[#c72c3b]">ZUSE //</span>
            <span className="font-mono text-lg font-medium tracking-wider text-white">ERP ENTERPRISE</span>
          </div>
          <span className="rounded bg-[#1a1b20] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#8a8f98] border border-[#2b2d31]">
            v4.8 • MULTIUSUÁRIO
          </span>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f98]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SEFAZ RS/SP: ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-[#8a8f98]">
          <span>FILIAIS ATIVAS: 12/12</span>
          <span>LATÊNCIA: 18ms</span>
          <div className="flex items-center gap-3 border-l border-[#2b2d31] pl-6 text-white">
            <div className="h-8 w-8 rounded bg-[#1c1d22] flex items-center justify-center font-bold text-xs border border-[#2b2d31]">
              OP
            </div>
            <span>OPERADOR CORPORATIVO</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-[#2b2d31] bg-[#0c0d10] p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#8a8f98]">Módulos</div>
            <nav className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between rounded bg-[#c72c3b]/15 px-4 py-2.5 text-white border-l-2 border-[#c72c3b]">
                <span>Painel Fiscal [NF-e]</span>
                <span className="text-xs text-[#c72c3b] font-bold">1.482</span>
              </div>
              <div className="flex items-center justify-between rounded px-4 py-2.5 text-[#8a8f98] hover:text-white">
                <span>Central de Chamados</span>
                <span className="rounded bg-[#1f2026] px-2 py-0.5 text-xs">8</span>
              </div>
              <div className="flex items-center justify-between rounded px-4 py-2.5 text-[#8a8f98] hover:text-white">
                <span>Gestão de Filiais</span>
                <span className="text-xs">12</span>
              </div>
              <div className="flex items-center justify-between rounded px-4 py-2.5 text-[#8a8f98] hover:text-white">
                <span>Fluxo de Caixa</span>
                <span className="text-xs text-emerald-400">99.4%</span>
              </div>
              <div className="flex items-center justify-between rounded px-4 py-2.5 text-[#8a8f98] hover:text-white">
                <span>Auditoria & Logs</span>
                <span className="text-xs">SYNC</span>
              </div>
            </nav>
          </div>

          <div className="rounded border border-[#2b2d31] bg-[#121317] p-4 font-mono text-xs space-y-2">
            <div className="text-[#8a8f98]">BANCO TRANSACIONAL</div>
            <div className="text-white font-semibold">PostgreSQL Master Cluster</div>
            <div className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Sincronização contínua
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#0a0a0b]">
          {/* Header Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Notas Emitidas Hoje</div>
              <div className="text-4xl font-bold tracking-tight text-white font-mono">1.482</div>
              <div className="font-mono text-xs text-emerald-400">+18% vs média</div>
            </div>
            <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Tempo Médio Autorização</div>
              <div className="text-4xl font-bold tracking-tight text-white font-mono">420ms</div>
              <div className="font-mono text-xs text-emerald-400">-18ms otimizado</div>
            </div>
            <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Chamados Resolvidos (SLA)</div>
              <div className="text-4xl font-bold tracking-tight text-white font-mono">99.4%</div>
              <div className="font-mono text-xs text-[#8a8f98]">Meta: &gt; 98.5%</div>
            </div>
            <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Filiais Conectadas</div>
              <div className="text-4xl font-bold tracking-tight text-white font-mono">12 / 12</div>
              <div className="font-mono text-xs text-emerald-400">Tolerância a falha ativa</div>
            </div>
          </div>

          {/* Table: Lote Fiscal */}
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#2b2d31] px-6 py-4">
              <div className="font-mono text-sm font-semibold tracking-wider uppercase text-white">
                Fila de Transmissão NF-e // Em Tempo Real
              </div>
              <div className="flex gap-3 font-mono text-xs">
                <span className="rounded bg-[#1a1b20] px-3 py-1 text-[#8a8f98] border border-[#2b2d31]">AUTORIZADAS: 1.479</span>
                <span className="rounded bg-[#c72c3b]/20 px-3 py-1 text-[#c72c3b] border border-[#c72c3b]/40">PENDENTES: 3</span>
              </div>
            </div>
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-[#2b2d31] bg-[#0c0d10] text-[#8a8f98]">
                <tr>
                  <th className="py-3 px-6">DOC / NF</th>
                  <th className="py-3 px-6">DESTINATÁRIO</th>
                  <th className="py-3 px-6">FILIAL ORIGEM</th>
                  <th className="py-3 px-6">VALOR TOTAL</th>
                  <th className="py-3 px-6">TEMPO SEFAZ</th>
                  <th className="py-3 px-6">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2025] text-white">
                <tr className="hover:bg-[#14151a]">
                  <td className="py-4 px-6 font-semibold text-[#c72c3b]">NF-e 004821</td>
                  <td className="py-4 px-6">Logística Integrada Sul S/A</td>
                  <td className="py-4 px-6 text-[#8a8f98]">Filial Curitiba (02)</td>
                  <td className="py-4 px-6">R$ 148.920,00</td>
                  <td className="py-4 px-6 text-emerald-400">380ms</td>
                  <td className="py-4 px-6"><span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px]">AUTORIZADA</span></td>
                </tr>
                <tr className="hover:bg-[#14151a]">
                  <td className="py-4 px-6 font-semibold text-[#c72c3b]">NF-e 004820</td>
                  <td className="py-4 px-6">Distribuidora Alvorada Ltda</td>
                  <td className="py-4 px-6 text-[#8a8f98]">Matriz Porto Alegre</td>
                  <td className="py-4 px-6">R$ 42.150,00</td>
                  <td className="py-4 px-6 text-emerald-400">410ms</td>
                  <td className="py-4 px-6"><span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px]">AUTORIZADA</span></td>
                </tr>
                <tr className="hover:bg-[#14151a]">
                  <td className="py-4 px-6 font-semibold text-[#c72c3b]">NF-e 004819</td>
                  <td className="py-4 px-6">Indústria Metalúrgica Paulista</td>
                  <td className="py-4 px-6 text-[#8a8f98]">Filial Campinas (05)</td>
                  <td className="py-4 px-6">R$ 318.400,00</td>
                  <td className="py-4 px-6 text-emerald-400">490ms</td>
                  <td className="py-4 px-6"><span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px]">AUTORIZADA</span></td>
                </tr>
                <tr className="hover:bg-[#14151a]">
                  <td className="py-4 px-6 font-semibold text-[#c72c3b]">NF-e 004818</td>
                  <td className="py-4 px-6">Cooperativa Agrícola Central</td>
                  <td className="py-4 px-6 text-[#8a8f98]">Filial Chapecó (03)</td>
                  <td className="py-4 px-6">R$ 89.600,00</td>
                  <td className="py-4 px-6 text-amber-400">Em fila...</td>
                  <td className="py-4 px-6"><span className="rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px]">TRANSMITINDO</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

function ERPPhone() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0b] text-[#f4f5f8] p-8 space-y-8">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2b2d31] pb-6 pt-12">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#c72c3b]">ZUSE ERP // GESTOR</div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">Painel Executivo</div>
        </div>
        <div className="rounded bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-mono text-xs text-emerald-400">
          SEFAZ OK
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-4 font-mono">
        <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-1">
          <div className="text-xs text-[#8a8f98]">NOTAS HOJE</div>
          <div className="text-3xl font-bold text-white">1.482</div>
          <div className="text-[11px] text-emerald-400">+18%</div>
        </div>
        <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-1">
          <div className="text-xs text-[#8a8f98]">AUTORIZAÇÃO</div>
          <div className="text-3xl font-bold text-white">420ms</div>
          <div className="text-[11px] text-emerald-400">SLA 99.4%</div>
        </div>
      </div>

      {/* Chamados Urgentes */}
      <div className="space-y-4">
        <div className="font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
          Central de Chamados // 8 Pendentes
        </div>
        <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#c72c3b]">#CH-1094</span>
            <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-400">ALTA PRIORIDADE</span>
          </div>
          <div className="text-sm font-sans text-white">Validação de certificado A1 da filial Chapecó</div>
          <div className="text-xs text-[#8a8f98] flex justify-between">
            <span>Filial Chapecó (03)</span>
            <span>Há 2 min</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#c72c3b]">#CH-1093</span>
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400">EM RESOLUÇÃO</span>
          </div>
          <div className="text-sm font-sans text-white">Reemissão de lote rejeitado por duplicidade</div>
          <div className="text-xs text-[#8a8f98] flex justify-between">
            <span>Filial Curitiba (02)</span>
            <span>Há 14 min</span>
          </div>
        </div>
      </div>

      {/* Status Filiais */}
      <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-4 font-mono">
        <div className="text-xs uppercase tracking-wider text-[#8a8f98]">Filiais Sincronizadas</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white">12 de 12 online</span>
          <span className="text-emerald-400">Cluster 100%</span>
        </div>
        <div className="h-2 w-full rounded bg-[#1e2025] overflow-hidden">
          <div className="h-full w-full bg-emerald-500" />
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   2. e-PPGFIL (SISTEMA DE PROTOCOLOS ACADÊMICOS)
   ========================================================================= */

function PPGFILLaptop() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0b] text-[#f4f5f8]">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-[#2b2d31] px-8 bg-[#101114]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold tracking-tight text-[#c72c3b]">e-PPGFIL //</span>
            <span className="font-mono text-lg font-medium tracking-wider text-white">SISTEMA ELETRÔNICO DE PROTOCOLOS</span>
          </div>
          <span className="rounded bg-[#1a1b20] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#8a8f98] border border-[#2b2d31]">
            PÓS-GRADUAÇÃO EM FILOSOFIA • ANO LETIVO 2024/2025
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-[#8a8f98]">
          <span>ASSINATURA DIGITAL ICP-BRASIL: HABILITADA</span>
          <div className="flex items-center gap-3 border-l border-[#2b2d31] pl-6 text-white">
            <div className="h-8 w-8 rounded bg-[#1c1d22] flex items-center justify-center font-bold text-xs border border-[#2b2d31]">
              SEC
            </div>
            <span>COORDENAÇÃO ACADÊMICA</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-8 bg-[#0a0a0b] overflow-y-auto">
        <div className="grid grid-cols-4 gap-6">
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Processos Digitalizados</div>
            <div className="text-4xl font-bold font-mono text-white">842</div>
            <div className="font-mono text-xs text-emerald-400">100% sem papel</div>
          </div>
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Tempo Médio de Parecer</div>
            <div className="text-4xl font-bold font-mono text-white">3,2 dias</div>
            <div className="font-mono text-xs text-emerald-400">-76% vs processo físico</div>
          </div>
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Bancas Homologadas</div>
            <div className="text-4xl font-bold font-mono text-white">68</div>
            <div className="font-mono text-xs text-[#8a8f98]">Mestrado & Doutorado</div>
          </div>
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-[#8a8f98]">Conformidade CAPES</div>
            <div className="text-4xl font-bold font-mono text-white">100%</div>
            <div className="font-mono text-xs text-emerald-400">Rastreabilidade integral</div>
          </div>
        </div>

        {/* Trâmites Recentes */}
        <div className="rounded-lg border border-[#2b2d31] bg-[#101114] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2b2d31] px-6 py-4">
            <div className="font-mono text-sm font-semibold tracking-wider uppercase text-white">
              Fluxo de Protocolos e Trâmites Acadêmicos
            </div>
            <div className="font-mono text-xs text-[#8a8f98]">FILTRO: PROTOCOLOS ATIVOS</div>
          </div>
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-[#2b2d31] bg-[#0c0d10] text-[#8a8f98]">
              <tr>
                <th className="py-3 px-6">PROTOCOLO</th>
                <th className="py-3 px-6">TIPO DE SOLICITAÇÃO</th>
                <th className="py-3 px-6">PESQUISADOR / DISCENTE</th>
                <th className="py-3 px-6">ETAPA ATUAL</th>
                <th className="py-3 px-6">SITUAÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2025] text-white">
              <tr className="hover:bg-[#14151a]">
                <td className="py-4 px-6 font-semibold text-[#c72c3b]">#2024-0412</td>
                <td className="py-4 px-6">Homologação de Banca de Doutorado</td>
                <td className="py-4 px-6">Dra. Letícia Ramos Albuquerque</td>
                <td className="py-4 px-6 text-[#8a8f98]">Assinatura da Coordenação</td>
                <td className="py-4 px-6"><span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px]">DEFERIDO</span></td>
              </tr>
              <tr className="hover:bg-[#14151a]">
                <td className="py-4 px-6 font-semibold text-[#c72c3b]">#2024-0411</td>
                <td className="py-4 px-6">Aproveitamento de Créditos Externos</td>
                <td className="py-4 px-6">Me. Gabriel Castanho Ribeiro</td>
                <td className="py-4 px-6 text-[#8a8f98]">Parecer da Comissão</td>
                <td className="py-4 px-6"><span className="rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px]">EM ANÁLISE</span></td>
              </tr>
              <tr className="hover:bg-[#14151a]">
                <td className="py-4 px-6 font-semibold text-[#c72c3b]">#2024-0410</td>
                <td className="py-4 px-6">Qualificação de Dissertação</td>
                <td className="py-4 px-6">Beatriz Fonseca Monteiro</td>
                <td className="py-4 px-6 text-[#8a8f98]">Validação de Documentos</td>
                <td className="py-4 px-6"><span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px]">HOMOLOGADO</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function PPGFILPhone() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0b] text-[#f4f5f8] p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-[#2b2d31] pb-6 pt-12">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#c72c3b]">e-PPGFIL // MOBILE</div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">Consulta de Processo</div>
        </div>
        <div className="rounded bg-[#1a1b20] border border-[#2b2d31] px-3 py-1 font-mono text-xs text-[#8a8f98]">
          2024/2025
        </div>
      </div>

      <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-4 font-mono">
        <div className="text-xs text-[#8a8f98]">PROTOCOLO ATIVO</div>
        <div className="text-3xl font-bold text-white text-[#c72c3b]">#2024-0412</div>
        <div className="text-sm font-sans text-white">Homologação de Banca de Doutorado</div>
        <div className="flex items-center justify-between pt-2 border-t border-[#2b2d31] text-xs">
          <span className="text-[#8a8f98]">Status</span>
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-emerald-400">DEFERIDO</span>
        </div>
      </div>

      <div className="space-y-4 font-mono">
        <div className="text-xs uppercase tracking-widest text-[#8a8f98]">Linha do Tempo do Trâmite</div>
        <div className="space-y-3">
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-4 text-xs space-y-1">
            <div className="text-emerald-400 font-semibold">✓ Assinatura da Coordenação</div>
            <div className="text-[#8a8f98]">Certificado Digital ICP-Brasil aplicado com sucesso</div>
          </div>
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-4 text-xs space-y-1">
            <div className="text-emerald-400 font-semibold">✓ Parecer da Comissão de Pós-Graduação</div>
            <div className="text-[#8a8f98]">Aprovado por unanimidade</div>
          </div>
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-4 text-xs space-y-1">
            <div className="text-emerald-400 font-semibold">✓ Protocolo Registrado</div>
            <div className="text-[#8a8f98]">Documentação completa conferida pela secretaria</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   3. FILA CADÚNICO (APP ANDROID / MATERIAL 3 PREFEITURA)
   ========================================================================= */

function CadUnicoPhone() {
  return (
    <div className="flex h-full w-full flex-col bg-[#07080a] text-[#f4f5f8] p-8 space-y-8">
      {/* Top Status */}
      <div className="flex items-center justify-between border-b border-[#2b2d31] pb-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#c72c3b] flex items-center justify-center font-bold text-white text-lg font-mono">
            CU
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#c72c3b]">PREFEITURA MUNICIPAL</div>
            <div className="text-xl font-bold font-mono tracking-tight text-white">Fila Digital CadÚnico</div>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
          CONECTADO
        </span>
      </div>

      {/* Main Ticket Card */}
      <div className="rounded-2xl border-2 border-[#c72c3b]/40 bg-[#121318] p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c72c3b] to-transparent" />
        <div className="font-mono text-xs uppercase tracking-widest text-[#8a8f98]">SUA SENHA DE ATENDIMENTO</div>
        <div className="text-6xl font-black font-mono tracking-tight text-white">C-042</div>
        <div className="inline-block rounded-full bg-[#c72c3b]/15 px-4 py-1 font-mono text-xs text-[#c72c3b] border border-[#c72c3b]/30">
          PRIORITÁRIO // ATUALIZAÇÃO CADASTRAL
        </div>
      </div>

      {/* Realtime Queue Stats */}
      <div className="grid grid-cols-2 gap-4 font-mono">
        <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 text-center space-y-1">
          <div className="text-xs text-[#8a8f98]">POSIÇÃO NA FILA</div>
          <div className="text-4xl font-bold text-white">3ª</div>
          <div className="text-[11px] text-[#8a8f98]">2 pessoas à frente</div>
        </div>
        <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 text-center space-y-1">
          <div className="text-xs text-[#8a8f98]">TEMPO ESTIMADO</div>
          <div className="text-4xl font-bold text-emerald-400">~14 min</div>
          <div className="text-[11px] text-[#8a8f98]">Média por guichê</div>
        </div>
      </div>

      {/* Active Counter Call */}
      <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#8a8f98]">CHAMADA ATUAL DO PAINEL</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">SENHA C-039</span>
          <span className="rounded bg-[#1c1d22] border border-[#2b2d31] px-3 py-1 text-sm font-semibold text-white">
            GUICHÊ 04
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-[#2b2d31] bg-[#0c0d10] p-6 font-mono text-xs space-y-2 text-[#8a8f98]">
        <div className="text-white font-semibold flex items-center gap-2">
          <span>ℹ</span> Documentos Obrigatórios
        </div>
        <div>• Documento de identificação com foto de todos os membros</div>
        <div>• Comprovante de residência atualizado (últimos 90 dias)</div>
        <div>• Carteira de trabalho ou holerite recente</div>
      </div>
    </div>
  )
}

/* =========================================================================
   4. CORTANA (ASSISTENTE DE INTELIGÊNCIA ARTIFICIAL TÉCNICA)
   ========================================================================= */

function CortanaLaptop() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0b] text-[#f4f5f8]">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-[#2b2d31] px-8 bg-[#101114]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold tracking-tight text-[#c72c3b]">CORTANA //</span>
            <span className="font-mono text-lg font-medium tracking-wider text-white">TECHNICAL RAG ASSISTANT</span>
          </div>
          <span className="rounded bg-[#1a1b20] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#8a8f98] border border-[#2b2d31]">
            WEB SEARCH + LOCAL KNOWLEDGE BASE
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-[#8a8f98]">
          <span>PIPELINE: HYBRID BM25 + VECTOR</span>
          <span>LATÊNCIA: 240ms</span>
          <div className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-emerald-400">
            INDEX HEALTH: 100%
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Console */}
        <div className="flex-1 p-10 space-y-6 overflow-y-auto">
          {/* Query Bar */}
          <div className="rounded-lg border border-[#2b2d31] bg-[#121317] p-4 flex items-center gap-4 font-mono">
            <span className="text-[#c72c3b] font-bold">&gt;</span>
            <span className="text-white text-sm">
              Analise os benchmarks de throughput de leitura do PostgreSQL 16 com partições hash vs range
            </span>
          </div>

          {/* AI Response Card */}
          <div className="rounded-lg border border-[#2b2d31] bg-[#101114] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b2d31] pb-3 font-mono text-xs">
              <span className="text-[#c72c3b] font-semibold">SÍNTESE EXECUTIVA // 3 FONTES VALIDADAS</span>
              <span className="text-[#8a8f98]">TEMPO DE RESPOSTA: 380ms</span>
            </div>
            <div className="text-sm font-sans leading-relaxed text-[#d4d6dd] space-y-3">
              <p>
                Em cargas concorrentes com mais de 10 milhões de tuplas por mês, o particionamento por Hash apresenta
                uma distribuição uniforme de I/O em discos NVMe, reduzindo contenção de locks em índices primários em
                até <strong>34%</strong> quando comparado ao particionamento linear por data (Range).
              </p>
              <p>
                Entretanto, para consultas analíticas agregadas por intervalo de faturamento, a poda de partições
                (<em>partition pruning</em>) do planejador do PostgreSQL 16 é significativamente mais eficiente em
                esquemas Range.
              </p>
            </div>
            {/* Citations */}
            <div className="flex gap-3 font-mono text-xs pt-2">
              <span className="rounded bg-[#1a1b20] border border-[#2b2d31] px-3 py-1 text-[#8a8f98]">
                [1] PostgreSQL Documentation v16.2
              </span>
              <span className="rounded bg-[#1a1b20] border border-[#2b2d31] px-3 py-1 text-[#8a8f98]">
                [2] Benchmark Journal: NVMe I/O Patterns
              </span>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex gap-4 font-mono text-xs">
            <button className="rounded bg-[#c72c3b] text-white px-4 py-2 font-semibold">
              EXPORTAR RELATÓRIO PDF
            </button>
            <button className="rounded bg-[#1a1b20] text-[#8a8f98] border border-[#2b2d31] px-4 py-2">
              COPIAR MARKDOWN
            </button>
          </div>
        </div>

        {/* Right Stats Sidebar */}
        <aside className="w-80 border-l border-[#2b2d31] bg-[#0c0d10] p-6 space-y-6 font-mono text-xs">
          <div className="text-[#8a8f98] uppercase tracking-wider">Métricas de Recuperação</div>
          <div className="space-y-4">
            <div className="rounded border border-[#2b2d31] bg-[#121317] p-4 space-y-1">
              <div className="text-[#8a8f98]">PRECISÃO (TOP-K)</div>
              <div className="text-2xl font-bold text-white">0.962</div>
              <div className="text-emerald-400 text-[11px]">Reranking ativo</div>
            </div>
            <div className="rounded border border-[#2b2d31] bg-[#121317] p-4 space-y-1">
              <div className="text-[#8a8f98]">TOKENS PROCESSADOS</div>
              <div className="text-2xl font-bold text-white">4.820</div>
              <div className="text-[#8a8f98] text-[11px]">Context Window: 32k</div>
            </div>
            <div className="rounded border border-[#2b2d31] bg-[#121317] p-4 space-y-1">
              <div className="text-[#8a8f98]">FONTES PESQUISADAS</div>
              <div className="text-2xl font-bold text-white">18 artigos</div>
              <div className="text-[#8a8f98] text-[11px]">Web + Repositório Interno</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function CortanaPhone() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0b] text-[#f4f5f8] p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-[#2b2d31] pb-6 pt-12">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#c72c3b]">CORTANA // MOBILE</div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">Assistente Técnico</div>
        </div>
        <div className="rounded bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-mono text-xs text-emerald-400">
          RAG ATIVO
        </div>
      </div>

      <div className="space-y-4 font-mono text-xs">
        <div className="text-[#8a8f98]">CONSULTA TÉCNICA</div>
        <div className="rounded-xl border border-[#2b2d31] bg-[#121317] p-4 text-white">
          &gt; Throughput PostgreSQL 16: Partições hash vs range
        </div>
      </div>

      <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-4">
        <div className="font-mono text-xs text-[#c72c3b] font-semibold border-b border-[#2b2d31] pb-2">
          RESPOSTA SINTETIZADA
        </div>
        <p className="text-sm font-sans text-[#d4d6dd] leading-relaxed">
          O particionamento por Hash atenua gargalos de escrita e lock em 34%. Para consultas analíticas com filtro de
          data, particionamento Range oferece maior eficiência de poda.
        </p>
        <div className="font-mono text-[11px] text-[#8a8f98] pt-2 border-t border-[#2b2d31] flex justify-between">
          <span>2 fontes citadas</span>
          <span className="text-emerald-400">Latência: 380ms</span>
        </div>
      </div>

      <div className="rounded-xl border border-[#2b2d31] bg-[#101114] p-6 space-y-3 font-mono text-xs">
        <div className="text-[#8a8f98] uppercase">Ações Rápidas</div>
        <div className="flex gap-3">
          <button className="flex-1 rounded bg-[#c72c3b] py-3 text-center text-white font-semibold">
            EXPORTAR PDF
          </button>
          <button className="flex-1 rounded bg-[#1a1b20] py-3 text-center text-[#8a8f98] border border-[#2b2d31]">
            COMPARTILHAR
          </button>
        </div>
      </div>
    </div>
  )
}
