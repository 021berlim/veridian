import { chromium } from "playwright"
import path from "path"

const BASE_URL = "http://localhost:3000"
const OUTPUT_DIR = path.resolve(process.cwd(), "docs/ref-zuse")

async function verify() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  console.log("Navegando...")
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" })
  await page.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 })

  // 1. Hero watermark check
  console.log("1. Verificando Watermark do Hero...")
  const watermarkCheck = await page.evaluate(() => {
    const watermarkSpan = document.querySelector("#hero .pointer-events-none span.block")
    const labsSpan = watermarkSpan?.querySelector("span:last-child")
    const style = labsSpan ? window.getComputedStyle(labsSpan) : null
    return {
      text: watermarkSpan?.textContent?.trim().replace(/\s+/g, " "),
      labsColor: style?.color,
      labsOpacity: style?.opacity,
    }
  })
  console.log("Hero Watermark:", watermarkCheck)
  await page.screenshot({ path: path.join(OUTPUT_DIR, "hero-watermark-labs-red.png") })

  // 2. Manifesto check
  console.log("2. Verificando Manifesto...")
  const manifesto = page.locator("#manifesto")
  await manifesto.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUTPUT_DIR, "manifesto-start.png") })

  // Scroll manifesto halfway
  await page.evaluate(() => {
    const el = document.getElementById("manifesto")
    if (el) window.scrollTo(0, el.offsetTop + 400)
  })
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUTPUT_DIR, "manifesto-mid-scroll.png") })

  // 3. Sections heights check
  console.log("3. Verificando alturas das seções (100vh)...")
  const sectionsHeights = await page.evaluate(() => {
    const ids = ["capacidades", "manifesto", "processo", "servicos", "faq", "contato"]
    return ids.map((id) => {
      const el = document.getElementById(id)
      return {
        id,
        height: el ? Math.round(el.getBoundingClientRect().height) : null,
        viewportH: window.innerHeight,
      }
    })
  })
  console.log("Seções avaliadas:", sectionsHeights)

  // Capturar cada seção
  for (const item of ["capacidades", "processo", "servicos", "faq", "contato"]) {
    const el = page.locator(`#${item}`)
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(OUTPUT_DIR, `section-100vh-${item}.png`) })
  }

  await browser.close()
  console.log("Verificação concluída com sucesso!")
}

verify().catch((err) => {
  console.error(err)
  process.exit(1)
})
