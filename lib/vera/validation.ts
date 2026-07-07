import { PROJECT_TYPE_OPTIONS } from "./constants"
import type { CaptureStep } from "./types"

export function detectLeadIntent(message: string): boolean {
  const patterns = [
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
  ]
  return patterns.some((pattern) => pattern.test(message))
}

export function validateCaptureInput(
  step: CaptureStep,
  value: string,
): { valid: boolean; error?: string; normalized?: string } {
  const trimmed = value.trim()

  switch (step) {
    case "name":
      if (trimmed.length < 2) {
        return { valid: false, error: "Pode me passar seu nome? Precisa ter pelo menos 2 letras." }
      }
      return { valid: true, normalized: trimmed }

    case "email": {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(trimmed)) {
        return { valid: false, error: "Esse e-mail não parece certo. Pode conferir e mandar de novo?" }
      }
      return { valid: true, normalized: trimmed.toLowerCase() }
    }

    case "company":
      if (trimmed.length < 1) {
        return { valid: false, error: "Qual o nome da empresa?" }
      }
      return { valid: true, normalized: trimmed }

    case "projectType": {
      const exact = PROJECT_TYPE_OPTIONS.find(
        (type) => type.toLowerCase() === trimmed.toLowerCase(),
      )
      if (exact) return { valid: true, normalized: exact }

      const partial = PROJECT_TYPE_OPTIONS.find((type) =>
        type.toLowerCase().includes(trimmed.toLowerCase()),
      )
      if (partial) return { valid: true, normalized: partial }

      if (/outro/i.test(trimmed)) return { valid: true, normalized: "Outro" }

      return {
        valid: false,
        error: `Escolhe uma dessas opções: ${PROJECT_TYPE_OPTIONS.join(", ")}.`,
      }
    }

    case "message":
      if (trimmed.length < 10) {
        return {
          valid: false,
          error: "Me conta um pouco mais? Uns 10 caracteres já ajudam pra eu entender melhor.",
        }
      }
      return { valid: true, normalized: trimmed }

    default:
      return { valid: true, normalized: trimmed }
  }
}

export function getNextCaptureStep(
  lead: Partial<Record<CaptureStep, string>>,
): CaptureStep | null {
  if (!lead.name) return "name"
  if (!lead.email) return "email"
  if (!lead.company) return "company"
  if (!lead.projectType) return "projectType"
  if (!lead.message) return "message"
  return null
}