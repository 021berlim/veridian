export interface AppDefinition {
  id: string
  name: string
  greeting: string
  subtitle: string
  headerTitle: string
}

export const APPS: AppDefinition[] = [
  {
    id: "client-dashboard",
    name: "Painel do cliente",
    greeting: "Olá, cliente",
    subtitle: "Aqui está o resumo do seu negócio.",
    headerTitle: "ZUSE LABS",
  },
  {
    id: "student-portal",
    name: "Portal do aluno",
    greeting: "Olá, Marina",
    subtitle: "Seu desempenho neste semestre.",
    headerTitle: "Portal do Aluno",
  },
  {
    id: "finance",
    name: "Gestão financeira",
    greeting: "Olá, Carlos",
    subtitle: "Seu fluxo de caixa neste mês.",
    headerTitle: "Financeiro",
  },
  {
    id: "workshop",
    name: "Oficina mecânica",
    greeting: "Olá, Ricardo",
    subtitle: "Ordens de serviço de hoje.",
    headerTitle: "Oficina",
  },
  {
    id: "assistant",
    name: "Assistente pessoal",
    greeting: "Bom dia!",
    subtitle: "Seu dia em um só lugar.",
    headerTitle: "Assistente",
  },
]
