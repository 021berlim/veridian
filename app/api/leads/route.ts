import { normalizeWhatsAppLead } from "@/lib/leads/validation"
import { isConfiguredWebhookUrl } from "@/lib/leads/webhook"
import type { LeadRecord } from "@/lib/leads/types"

export async function POST(request: Request) {
  try {
    // INSERT YOUR WEBHOOK SECRET HERE → process.env.TYPEBOT_WEBHOOK_SECRET
    const webhookSecret = process.env.TYPEBOT_WEBHOOK_SECRET
    if (webhookSecret) {
      const authHeader = request.headers.get("authorization")
      const bearer = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null

      if (bearer !== webhookSecret) {
        return Response.json({ error: "Não autorizado." }, { status: 401 })
      }
    }

    const body = (await request.json()) as Record<string, unknown>
    const result = normalizeWhatsAppLead(body)

    if (!result.valid) {
      return Response.json(
        { error: "Payload inválido.", details: result.errors },
        { status: 422 },
      )
    }

    const lead = result.data

    const record: LeadRecord = {
      ...lead,
      id: crypto.randomUUID(),
      source: "whatsapp",
      submittedAt: new Date().toISOString(),
    }

    // ─── PERSISTÊNCIA EM BANCO DE DADOS ───────────────────────────────────────
    // Descomente e adapte ao seu ORM (Prisma, Drizzle, etc.):
    //
    // import { db } from "@/lib/db"
    //
    // await db.lead.create({
    //   data: {
    //     id: record.id,
    //     name: record.name,
    //     email: record.email,
    //     company: record.company,
    //     project: record.project,
    //     source: record.source,
    //     origem: record.origem ?? "WhatsApp",
    //     remoteJid: record.remoteJid,
    //     pushName: record.pushName,
    //     submittedAt: new Date(record.submittedAt),
    //   },
    // })
    // ───────────────────────────────────────────────────────────────────────────

    // INSERT YOUR CRM WEBHOOK URL HERE → process.env.LEAD_CRM_WEBHOOK_URL
    const crmWebhookUrl = process.env.LEAD_CRM_WEBHOOK_URL

    if (isConfiguredWebhookUrl(crmWebhookUrl)) {
      const crmResponse = await fetch(crmWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      })

      if (!crmResponse.ok) {
        console.error("[/api/leads] CRM webhook falhou:", await crmResponse.text())
        return Response.json(
          { error: "Falha ao encaminhar lead ao CRM." },
          { status: 502 },
        )
      }
    } else {
      console.log("[/api/leads] Lead WhatsApp recebido:", record)
    }

    return Response.json({
      success: true,
      leadId: record.id,
      message: "Lead registrado com sucesso.",
    })
  } catch (error) {
    console.error("[/api/leads] Erro:", error)
    return Response.json(
      { error: "Erro interno ao processar lead." },
      { status: 500 },
    )
  }
}