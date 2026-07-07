import {
  callVeraOpenRouter,
  VeraConfigError,
  VeraInferenceError,
  VeraValidationError,
} from "@/lib/vera/openrouter"
import type { ConversationPhase, PartialLead } from "@/lib/vera/types"

type ChatRequestBody = {
  messages: { role: "user" | "assistant"; content: string }[]
  phase?: ConversationPhase
  lead?: PartialLead
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody
    const { messages, phase = "chat", lead = {} } = body

    const content = await callVeraOpenRouter({ messages, phase, lead })
    return Response.json({ content })
  } catch (error) {
    if (error instanceof VeraConfigError) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    if (error instanceof VeraValidationError) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof VeraInferenceError) {
      return Response.json({ error: error.message }, { status: 502 })
    }

    console.error("[V.E.R.A.] Unexpected error:", error)
    return Response.json(
      { error: "Erro interno no processamento da solicitação." },
      { status: 500 },
    )
  }
}