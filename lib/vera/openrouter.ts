import { sanitizeVeraResponse } from "./format-response"
import { buildVeraSystemPrompt } from "./system-prompt"
import { VERA_MODEL } from "./constants"
import type { ConversationPhase, PartialLead } from "./types"

export type VeraChatMessage = {
  role: "user" | "assistant"
  content: string
}

type VeraChatOptions = {
  messages: VeraChatMessage[]
  phase?: ConversationPhase
  lead?: PartialLead
}

export async function callVeraOpenRouter({
  messages,
  phase = "chat",
  lead = {},
}: VeraChatOptions): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new VeraConfigError("OPENROUTER_API_KEY não configurada no ambiente.")
  }

  if (!messages.length) {
    throw new VeraValidationError("Histórico de mensagens vazio.")
  }

  const systemPrompt = buildVeraSystemPrompt(phase, lead)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://veridian-pi.vercel.app"

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-Title": "Veridian Capital - V.E.R.A.",
    },
    body: JSON.stringify({
      model: VERA_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.6,
      max_tokens: 600,
    }),
  })

  if (!response.ok) {
    const errorPayload = await response.text()
    console.error("[V.E.R.A.] OpenRouter error:", errorPayload)
    throw new VeraInferenceError("Falha na comunicação com o núcleo de inferência.")
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new VeraInferenceError("Resposta vazia do modelo.")
  }

  return sanitizeVeraResponse(content)
}

export class VeraConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "VeraConfigError"
  }
}

export class VeraValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "VeraValidationError"
  }
}

export class VeraInferenceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "VeraInferenceError"
  }
}