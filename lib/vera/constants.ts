import { projectTypes } from "@/data/site"

export const VERA_MODEL = "google/gemini-2.5-flash"

export const CAPTURE_THRESHOLD = 3

export const PROJECT_TYPE_OPTIONS = [...projectTypes]

export const LEAD_INTENT_PATTERNS = [
  /or[cç]amento/i,
  /proposta/i,
  /contrat(ar|o)/i,
  /quanto custa/i,
  /pre[cç]o/i,
  /valor/i,
  /iniciar projeto/i,
  /come[cç]ar projeto/i,
  /quero (trabalhar|contratar|iniciar)/i,
  /preciso de/i,
  /solicitar/i,
  /falar com (a equipe|algu[eé]m|voc[eê]s)/i,
  /entrar em contato/i,
  /validar.*estrat[eé]gia/i,
  /enviar mensagem/i,
] as const

export const CAPTURE_PROMPTS: Record<
  "name" | "email" | "company" | "projectType" | "message",
  string
> = {
  name: "Pra começar, qual é o seu nome completo?",
  email: "Obrigada, qual e-mail a gente usa pra te retornar?",
  company: "E qual empresa você representa?",
  projectType: `Certo, que tipo de projeto você tem em mente? As opções são ${PROJECT_TYPE_OPTIONS.join(", ")}.`,
  message:
    "Por último, me conta um pouco do que você precisa, pode falar de objetivo, prazo ou qualquer detalhe que ajude a entender melhor.",
}

export const CAPTURE_ACKNOWLEDGMENTS: Record<
  "name" | "email" | "company" | "projectType",
  string
> = {
  name: "",
  email: "",
  company: "",
  projectType: "",
}