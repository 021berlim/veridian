import { chromium } from "playwright"

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  console.log("Acessando http://localhost:3000...")
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" })

  // 1. Verificar favicon tags
  const iconHrefs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel*="icon"]'))
    return links.map(l => ({ rel: l.getAttribute("rel"), href: l.getAttribute("href"), type: l.getAttribute("type") }))
  })
  console.log("Icon links no <head>:", JSON.stringify(iconHrefs, null, 2))

  // Aguardar intro terminar
  await page.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 })

  // 2. Localizar Manifesto
  const manifesto = page.locator("#manifesto")
  await manifesto.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  // 3. Medir distâncias
  const metrics = await page.evaluate(() => {
    const header = document.querySelector("header")
    const wordsContainer = document.querySelector("#manifesto .max-w-5xl > div")
    const headerRect = header ? header.getBoundingClientRect() : { bottom: 0 }
    const wordsRect = wordsContainer ? wordsContainer.getBoundingClientRect() : { top: 0, bottom: 0 }
    const viewportHeight = window.innerHeight

    const distFromHeader = wordsRect.top - headerRect.bottom
    const distToBottom = viewportHeight - wordsRect.bottom

    return {
      headerBottom: headerRect.bottom,
      wordsTop: wordsRect.top,
      wordsBottom: wordsRect.bottom,
      viewportHeight,
      distFromHeader: Math.round(distFromHeader),
      distToBottom: Math.round(distToBottom),
      diff: Math.abs(Math.round(distFromHeader) - Math.round(distToBottom))
    }
  })
  console.log("Métricas de centralização do Manifesto:", metrics)

  // Screenshot do Manifesto no estado inicial (pin ativo)
  await page.screenshot({ path: "docs/manifesto-initial.png" })

  // Scrollar um pouco dentro do pin do manifesto para acender palavras
  await page.mouse.wheel(0, 450)
  await page.waitForTimeout(500)
  await page.screenshot({ path: "docs/manifesto-scrolling-1.png" })

  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(500)
  await page.screenshot({ path: "docs/manifesto-scrolling-2.png" })

  console.log("Screenshots capturadas com sucesso em docs/manifesto-*!")
  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
