export type MessageRole = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  timestamp: number
}

export type CaptureStep =
  | "name"
  | "email"
  | "company"
  | "projectType"
  | "message"
  | "complete"

export type ConversationPhase = "chat" | "capture" | "complete"

export type LeadPayload = {
  name: string
  email: string
  company: string
  projectType: string
  message: string
}

export type PartialLead = Partial<LeadPayload>