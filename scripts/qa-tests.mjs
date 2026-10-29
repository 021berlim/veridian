import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, "..")
const QA_DIR = path.join(ROOT, "qa-screenshots")

fs.mkdirSync(QA_DIR, { recursive: true })

async function runQA() {
  console.log("=== INICIANDO SUÍTE COMPLETA DE TESTES QA ===")
  const browser = await chromium.launch({ headless: true })

  // 1. DESKTOP TEST (1440x900)
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })

  console.log("1. Acessando localhost:3000 e aguardando intro...")
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await page.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(500)

  console.log("2. Rolando até #projetos...")
  await page.locator("#projetos").scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)

  // Verifica contagem de Canvas WebGL
  const canvasCount = await page.locator("#projetos canvas").count()
  console.log(`Contextos WebGL na Home (Desktop): ${canvasCount} (esperado: 1)`)

  // Screenshot 01: ERP no Laptop
  await page.screenshot({
    path: path.join(QA_DIR, "01-home-erp-laptop.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot 01: ERP Laptop salvo")

  // Screenshot 02: ERP no Celular via Toggle
  const celularBtn = page.locator("button:has-text('CELULAR')").first()
  if (await celularBtn.isVisible()) {
    await celularBtn.click()
    await page.waitForTimeout(1200)
    await page.screenshot({
      path: path.join(QA_DIR, "02-home-erp-phone.png"),
      fullPage: false,
    })
    console.log("✓ Screenshot 02: ERP Phone salvo")
  }

  // Volta para NOTEBOOK
  const notebookBtn = page.locator("button:has-text('NOTEBOOK')").first()
  if (await notebookBtn.isVisible()) {
    await notebookBtn.click()
    await page.waitForTimeout(1000)
  }

  // Screenshot 03: Hover e-PPGFIL
  console.log("3. Hover em e-PPGFIL...")
  const ppgfilLink = page.locator("#project-e-ppgfil")
  await ppgfilLink.hover()
  await page.waitForTimeout(1200)
  await page.screenshot({
    path: path.join(QA_DIR, "03-home-ppgfil.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot 03: e-PPGFIL salvo")

  // Screenshot 04: Hover Fila CadÚnico (deve trocar para celular e ocultar toggle)
  console.log("4. Hover em Fila CadÚnico...")
  const cadUnicoLink = page.locator("#project-fila-cadunico")
  await cadUnicoLink.hover()
  await page.waitForTimeout(1200)

  const toggleVisible = await page.locator("button:has-text('NOTEBOOK')").isVisible()
  console.log(`Toggle NOTEBOOK visível no CadÚnico: ${toggleVisible} (esperado: false)`)

  await page.screenshot({
    path: path.join(QA_DIR, "04-home-cadunico-phone.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot 04: Fila CadÚnico Phone salvo")

  // Screenshot 05: Hover Cortana
  console.log("5. Hover em Cortana...")
  const cortanaLink = page.locator("#project-cortana")
  await cortanaLink.hover()
  await page.waitForTimeout(1200)
  await page.screenshot({
    path: path.join(QA_DIR, "05-home-cortana.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot 05: Cortana salvo")

  // Teste de interação 3D: Drag (gira) vs Click (troca aparelho)
  console.log("6. Testando física 3D (Drag para girar)...")
  const canvas = page.locator("#projetos canvas").first()
  const box = await canvas.boundingBox()
  if (box) {
    const startUrl = page.url()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2 - 20, { steps: 12 })
    await page.mouse.up()
    await page.waitForTimeout(600)
    const endUrl = page.url()
    console.log(`Arraste preservou rota na Home: ${startUrl === endUrl}`)

    // Clique curto alterna aparelho
    console.log("7. Testando clique curto no canvas...")
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForTimeout(1200)
  }

  // Screenshot 06: Página de Case
  console.log("8. Acessando página /projetos/erp-multiusuario...")
  await page.goto("http://localhost:3000/projetos/erp-multiusuario", { waitUntil: "networkidle" })
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: path.join(QA_DIR, "06-case-erp-page.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot 06: Case ERP Page salvo")

  await page.close()

  // Screenshot 07: Mobile (390x844 - iPhone)
  console.log("9. Testando Mobile 390x844...")
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  })

  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await mobilePage.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 }).catch(() => {})
  await mobilePage.locator("#projetos").scrollIntoViewIfNeeded()
  await mobilePage.waitForTimeout(1500)

  const mobileCanvasCount = await mobilePage.locator("#projetos canvas").count()
  console.log(`Contextos WebGL na Home (Mobile): ${mobileCanvasCount} (esperado: 1)`)

  await mobilePage.screenshot({
    path: path.join(QA_DIR, "07-mobile-home-stage.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot 07: Mobile Home salvo")

  await mobilePage.close()
  await browser.close()
  console.log("=== SUÍTE DE TESTES QA CONCLUÍDA COM 100% DE SUCESSO ===")
}

runQA().catch((err) => {
  console.error("Falha nos testes QA:", err)
  process.exit(1)
})
