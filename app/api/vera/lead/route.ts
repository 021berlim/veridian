import type { LeadPayload } from "@/lib/vera/types"
import { isConfiguredWebhookUrl } from "@/lib/leads/webhook"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload

    const { name, email, company, projectType, message } = body

    if (!name || !email || !company || !projectType || !message) {
      return Response.json(
        { error: "Payload incompleto. Todos os campos são obrigatórios." },
        { status: 400 },
      )
    }

    // INSERT YOUR LEAD WEBHOOK URL HERE → process.env.VERA_LEAD_WEBHOOK_URL
    const webhookUrl = process.env.VERA_LEAD_WEBHOOK_URL

    if (isConfiguredWebhookUrl(webhookUrl)) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "vera-chat",
          submittedAt: new Date().toISOString(),
          lead: { name, email, company, projectType, message },
        }),
      })

      if (!webhookResponse.ok) {
        console.error("[V.E.R.A.] Webhook falhou:", await webhookResponse.text())
        return Response.json(
          { error: "Falha ao registrar lead no sistema externo." },
          { status: 502 },
        )
      }
    } else {
      console.log("[V.E.R.A.] Lead capturado (webhook não configurado):", body)
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[V.E.R.A.] Lead submission error:", error)
    return Response.json(
      { error: "Erro interno ao processar o lead." },
      { status: 500 },
    )
  }
}