#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

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

const env = { ...loadEnv(), ...process.env }
const base = env.TEST_BASE_URL ?? "http://localhost:3000"

async function testChat() {
  const response = await fetch(`${base}/api/vera/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "O que a Veridian Capital faz?" }],
      phase: "chat",
    }),
  })

  const data = await response.json()
  console.log("POST /api/vera/chat →", response.status)
  console.log(data.content ? `Resposta: ${data.content.slice(0, 120)}...` : data)
  return response.ok
}

async function testWhatsApp() {
  const response = await fetch(`${base}/api/vera/whatsapp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Olá, quem é você?",
      history: [],
      remoteJid: "5511999999999@s.whatsapp.net",
      origem: "WhatsApp",
    }),
  })

  const data = await response.json()
  console.log("\nPOST /api/vera/whatsapp →", response.status)
  console.log(data.content ? `Resposta: ${data.content.slice(0, 120)}...` : data)
  console.log("History length:", data.history?.length ?? 0)
  return response.ok
}

console.log(`Testando V.E.R.A. em ${base}\n`)

const chatOk = await testChat()
const waOk = await testWhatsApp()

if (!chatOk || !waOk) process.exit(1)
console.log("\nAmbos os fluxos responderam com sucesso.")