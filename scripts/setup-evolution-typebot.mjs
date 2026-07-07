#!/usr/bin/env node

/**
 * Configura Evolution API + Typebot para o canal WhatsApp da V.E.R.A.
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const PLACEHOLDER_PATTERNS = [
  /^sua-evolution-api/i,
  /^sua-chave$/i,
  /^nome-da-instancia$/i,
  /^seu-typebot/i,
  /^your-/i,
  /^changeme$/i,
  /placeholder/i,
  /example\.com$/i,
]

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env")
  if (!existsSync(envPath)) return {}

  const vars = {}
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx === -1) continue
    vars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1)
  }
  return vars
}

function isPlaceholder(value) {
  if (!value?.trim()) return true
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value.trim()))
}

function formatFetchError(error, url) {
  const cause = error.cause
  if (cause?.code === "ENOTFOUND" || cause?.code === "EAI_AGAIN") {
    return [
      `Não foi possível resolver o host: ${cause.hostname ?? url}`,
      "Verifique se EVOLUTION_API_URL aponta para seu servidor Evolution real.",
      "Exemplo: https://evolution.seudominio.com",
    ].join("\n")
  }
  if (cause?.code === "ECONNREFUSED") {
    return [
      `Conexão recusada em: ${url}`,
      "A Evolution API está offline ou a URL/porta está incorreta.",
    ].join("\n")
  }
  return error.message
}

const env = { ...loadEnv(), ...process.env }

const required = [
  "EVOLUTION_API_URL",
  "EVOLUTION_API_KEY",
  "EVOLUTION_INSTANCE",
  "TYPEBOT_URL",
  "TYPEBOT_PUBLIC_ID",
]

const missing = required.filter((key) => !env[key]?.trim())
if (missing.length) {
  console.error("Variáveis ausentes no .env:", missing.join(", "))
  console.error("\nCopie .env.example → .env e preencha com dados reais.")
  process.exit(1)
}

const placeholders = required.filter((key) => isPlaceholder(env[key]))
if (placeholders.length) {
  console.error("\n❌ O .env ainda contém valores de exemplo (não funcionam):\n")
  for (const key of placeholders) {
    console.error(`   ${key}=${env[key]}`)
  }
  console.error("\nPreencha com seus dados reais antes de rodar setup:whatsapp:\n")
  console.error("   EVOLUTION_API_URL  → URL onde sua Evolution API está hospedada")
  console.error("   EVOLUTION_API_KEY  → API key gerada no painel da Evolution")
  console.error("   EVOLUTION_INSTANCE → Nome da instância WhatsApp (ex: veridian)")
  console.error("   TYPEBOT_URL        → URL do Typebot (cloud: https://typebot.io)")
  console.error("   TYPEBOT_PUBLIC_ID  → Public ID do fluxo no Typebot\n")
  console.error("Você já tem a Evolution API rodando em algum servidor (VPS, Railway, etc.)?")
  process.exit(1)
}

const baseUrl = env.EVOLUTION_API_URL.replace(/\/$/, "")
const instance = env.EVOLUTION_INSTANCE
const headers = {
  "Content-Type": "application/json",
  apikey: env.EVOLUTION_API_KEY,
}

const createPayload = {
  enabled: true,
  description: "V.E.R.A. - WhatsApp Veridian Capital",
  url: env.TYPEBOT_URL.replace(/\/$/, ""),
  typebot: env.TYPEBOT_PUBLIC_ID,
  triggerType: "all",
  listeningFromMe: false,
  stopBotFromMe: false,
  keepOpen: true,
  expire: 1440,
  keywordFinish: "#SAIR",
  delayMessage: 1200,
  unknownMessage: "Entrada não reconhecida. Reformule ou digite #SAIR para encerrar.",
  debounceTime: 3,
  splitMessages: true,
  timePerChar: 15,
}

const settingsPayload = {
  expire: 1440,
  keywordFinish: "#SAIR",
  delayMessage: 1200,
  unknownMessage: "Entrada não reconhecida.",
  listeningFromMe: false,
  stopBotFromMe: false,
  keepOpen: true,
  debounceTime: 3,
  splitMessages: true,
  timePerChar: 15,
  ignoreJids: [],
  typebotIdFallback: env.TYPEBOT_PUBLIC_ID,
}

async function post(path, body) {
  const url = `${baseUrl}${path}`

  let response
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw new Error(formatFetchError(error, new URL(url).origin))
  }

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }

  if (!response.ok) {
    throw new Error(`${path} → HTTP ${response.status}: ${JSON.stringify(data)}`)
  }

  return data
}

const siteUrl = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://veridian-pi.vercel.app"
const whatsappApiUrl = `${siteUrl}/api/vera/whatsapp`

console.log("\n=== Configurando Evolution API ===")
console.log(`Servidor: ${baseUrl}`)
console.log(`Instância: ${instance}\n`)

try {
  const created = await post(`/typebot/create/${instance}`, createPayload)
  console.log("Bot criado:", created?.id ?? "ok")

  await post(`/typebot/settings/${instance}`, settingsPayload)
  console.log("Settings aplicadas: ok")
} catch (error) {
  console.error("\nErro na Evolution API:")
  console.error(error.message)
  console.error("\nDicas:")
  console.error("- Confirme que a Evolution está online e acessível no navegador")
  console.error("- Teste: GET " + baseUrl + "/ (ou documentação da sua versão)")
  console.error("- Verifique se EVOLUTION_API_KEY está correta")
  console.error("- Se o bot já existir, delete no painel Evolution e rode novamente")
  process.exit(1)
}

console.log("\n=== Typebot: configure o fluxo HTTP ===\n")
console.log("1. Variáveis de sessão no Typebot:")
console.log("   origem (default: WhatsApp) | vera_history (default: []) | userMessage")
console.log("\n2. Webhook HTTP POST:")
console.log(`   URL: ${whatsappApiUrl}`)
console.log("   Body: integrations/typebot/webhook-body.json")
console.log("\n3. Mapear resposta → exibir content, salvar history, jump ao input")
console.log("\n=== Pronto. Envie uma mensagem no WhatsApp para testar. ===\n")