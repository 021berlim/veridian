import { LEAD_INTENT_PATTERNS, PROJECT_TYPE_OPTIONS } from "./constants"
import type { CaptureStep } from "./types"

function stripAccents(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function detectLeadIntent(message: string): boolean {
  return LEAD_INTENT_PATTERNS.some((pattern) => pattern.test(message))
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
      const normalizedInput = stripAccents(trimmed)

      const exact = PROJECT_TYPE_OPTIONS.find(
        (type) => stripAccents(type) === normalizedInput,
      )
      if (exact) return { valid: true, normalized: exact }

      const partial = PROJECT_TYPE_OPTIONS.find((type) =>
        stripAccents(type).includes(normalizedInput),
      )
      if (partial) return { valid: true, normalized: partial }

      if (/\b(software|sistema|sistemas|app|aplicativo|plataforma|web|erp|sob medida)\b/.test(normalizedInput)) {
        return { valid: true, normalized: "Desenvolvimento de Software sob medida" }
      }
      if (/\b(suporte|manutencao|sustentacao|infraestrutura|ti|servidor|servidores)\b/.test(normalizedInput)) {
        return { valid: true, normalized: "Suporte e Manutenção de TI" }
      }
      if (/\b(ciberseguranca|seguranca|cyber|auditoria|protecao|pentest)\b/.test(normalizedInput)) {
        return { valid: true, normalized: "Cibersegurança" }
      }
      if (/\b(automacao|inteligencia artificial|ia|ai|agente|agentes|bot|chatbot)\b/.test(normalizedInput)) {
        return { valid: true, normalized: "Automação e Inteligência Artificial" }
      }

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