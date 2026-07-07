export type LeadSource = "whatsapp" | "vera-chat" | "contact-form"

export type WhatsAppLeadPayload = {
  name: string
  email: string
  company: string
  project: string
  origem?: string
  remoteJid?: string
  pushName?: string
}

export type LeadRecord = WhatsAppLeadPayload & {
  id: string
  source: LeadSource
  submittedAt: string
}