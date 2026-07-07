import {
  callVeraOpenRouter,
  VeraConfigError,
  VeraInferenceError,
  VeraValidationError,
} from "@/lib/vera/openrouter"
import { appendToHistory, parseWhatsAppHistory } from "@/lib/vera/whatsapp"

type WhatsAppRequestBody = {
  message?: string
  history?: unknown
  remoteJid?: string
  pushName?: string
  origem?: string
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.VERA_WHATSAPP_SECRET
  if (!secret) return true

  const authHeader = request.headers.get("authorization")
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  return bearer === secret
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return Response.json({ error: "Não autorizado." }, { status: 401 })
    }

    const body = (await request.json()) as WhatsAppRequestBody
    const message = body.message?.trim()

    if (!message) {
      return Response.json({ error: "Campo 'message' é obrigatório." }, { status: 400 })
    }

    const priorHistory = parseWhatsAppHistory(body.history)
    const messages = appendToHistory(priorHistory, "user", message)

    const content = await callVeraOpenRouter({
      messages,
      phase: "chat",
      lead: {},
    })

    const updatedHistory = appendToHistory(messages, "assistant", content)

    return Response.json({
      content,
      history: updatedHistory,
      meta: {
        remoteJid: body.remoteJid ?? null,
        pushName: body.pushName ?? null,
        origem: body.origem ?? "WhatsApp",
      },
    })
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

    console.error("[V.E.R.A. WhatsApp] Unexpected error:", error)
    return Response.json(
      { error: "Erro interno no processamento da solicitação." },
      { status: 500 },
    )
  }
}