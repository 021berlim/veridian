import { PROJECT_TYPE_OPTIONS } from "@/lib/vera/constants"
import type { WhatsAppLeadPayload } from "./types"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeWhatsAppLead(
  body: Record<string, unknown>,
): { valid: true; data: WhatsAppLeadPayload } | { valid: false; errors: string[] } {
  const errors: string[] = []

  const name = pickString(body, ["name", "nome", "Nome"])
  const email = pickString(body, ["email", "e-mail", "Email", "E-mail"])
  const company = pickString(body, ["company", "empresa", "Empresa"])
  const project = pickString(body, ["project", "projeto", "projectType", "Projeto"])
  const origem = pickString(body, ["origem", "Origem"]) ?? "WhatsApp"
  const remoteJid = pickString(body, ["remoteJid", "remote_jid"])
  const pushName = pickString(body, ["pushName", "push_name"])

  if (!name || name.length < 2) {
    errors.push("Nome inválido ou ausente (mínimo 2 caracteres).")
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.push("E-mail inválido ou ausente.")
  }

  if (!company || company.length < 1) {
    errors.push("Empresa inválida ou ausente.")
  }

  if (!project) {
    errors.push("Projeto inválido ou ausente.")
  } else {
    const match = PROJECT_TYPE_OPTIONS.find(
      (type) => type.toLowerCase() === project.toLowerCase(),
    )
    if (!match && !/outro/i.test(project)) {
      errors.push(
        `Projeto deve ser uma das opções: ${PROJECT_TYPE_OPTIONS.join(", ")}.`,
      )
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  const projectMatch =
    PROJECT_TYPE_OPTIONS.find((type) => type.toLowerCase() === project!.toLowerCase()) ??
    (/outro/i.test(project!) ? "Outro" : project!)

  return {
    valid: true,
    data: {
      name: name!.trim(),
      email: email!.trim().toLowerCase(),
      company: company!.trim(),
      project: projectMatch,
      origem,
      ...(remoteJid ? { remoteJid } : {}),
      ...(pushName ? { pushName } : {}),
    },
  }
}

function pickString(body: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = body[key]
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

export function isLeadComplete(lead: Partial<WhatsAppLeadPayload>): boolean {
  return Boolean(lead.name && lead.email && lead.company && lead.project)
}