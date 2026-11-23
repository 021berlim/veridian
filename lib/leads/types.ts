export type LeadSource = "whatsapp" | "contact-form"

export type WhatsAppLeadPayload = {
  name: string
  email: string
  company: string
  project: string
  whatsapp?: string
  servicePillars?: string[]
  currentScenario?: string
  companySize?: string
  timeline?: string
  engagementModel?: string
  budgetRange?: string
  projectSummary?: string
  referenceUrl?: string
  preferredChannel?: string
  protocolId?: string
  origem?: string
  remoteJid?: string
  pushName?: string
}

export type LeadRecord = WhatsAppLeadPayload & {
  id: string
  source: LeadSource
  submittedAt: string
}