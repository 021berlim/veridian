import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, "..")
const QA_DIR = path.join(ROOT, "qa-screenshots")

async function verify() {
  console.log("=== VERIFICANDO MELHORIAS PREMIUM DO STAGE 3D ===")
  const browser = await chromium.launch({ headless: true })

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await page.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(500)

  await page.locator("#projetos").scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)

  // 1. Confirma que os botões textuais NOTEBOOK e CELULAR sumiram
  const hasNotebookBtn = await page.locator("#projetos button:has-text('NOTEBOOK')").count()
  const hasCelularBtn = await page.locator("#projetos button:has-text('CELULAR')").count()
  console.log(`Botões NOTEBOOK/CELULAR removidos: ${hasNotebookBtn === 0 && hasCelularBtn === 0}`)

  // 2. Screenshot do Notebook com pose inicial inclinada (3/4) e sombra dedicada
  await page.screenshot({
    path: path.join(QA_DIR, "v2-01-home-laptop-tilted.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot v2-01: Laptop inclinado 3/4 salvo")

  // 3. Clique no canvas para alternar para o Celular
  const canvas = page.locator("#projetos canvas").first()
  const box = await canvas.boundingBox()
  if (box) {
    console.log("Clicando no aparelho para alternar para Celular...")
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForTimeout(1500)

    // Screenshot do Celular inclinado com sombra dedicada estreita
    await page.screenshot({
      path: path.join(QA_DIR, "v2-02-home-phone-tilted.png"),
      fullPage: false,
    })
    console.log("✓ Screenshot v2-02: Celular inclinado 3/4 com sombra proporcional salvo")

    // 4. Teste de Scroll para Zoom
    console.log("Testando Scroll Wheel para Zoom...")
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    // Rolagem para cima (deltaY negativo => zoom in)
    await page.mouse.wheel(0, -600)
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: path.join(QA_DIR, "v2-03-home-phone-zoomed-in.png"),
      fullPage: false,
    })
    console.log("✓ Screenshot v2-03: Zoom in salvo")

    // Clique para voltar ao Notebook e dar zoom in no Notebook
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForTimeout(1500)

    await page.screenshot({
      path: path.join(QA_DIR, "v2-04-home-laptop-zoomed-in.png"),
      fullPage: false,
    })
    console.log("✓ Screenshot v2-04: Laptop com zoom in salvo")
  }

  // 5. Teste da página de Case
  console.log("Verificando página de case /projetos/erp-multiusuario...")
  await page.goto("http://localhost:3000/projetos/erp-multiusuario", { waitUntil: "networkidle" })
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: path.join(QA_DIR, "v2-05-case-page-tilted.png"),
    fullPage: false,
  })
  console.log("✓ Screenshot v2-05: Case Page com nova pose salvo")

  await page.close()
  await browser.close()
  console.log("=== VERIFICAÇÃO CONCLUÍDA COM SUCESSO ===")
}

verify().catch((err) => {
  console.error("Erro na verificação:", err)
  process.exit(1)
})
