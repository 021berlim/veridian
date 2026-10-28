import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const BASE_URL = "http://localhost:3001"
const OUTPUT_DIR = path.resolve("docs/ref-veridian")

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function capture() {
  console.log("=== CAPTURANDO REFERÊNCIA VISUAL DO VERIDIAN ORIGINAL ===")
  const browser = await chromium.launch({ headless: true })

  // 1. Header Desktop (topo, após scroll, dropdown aberto)
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await desktop.goto(BASE_URL, { waitUntil: "networkidle" })
  await desktop.waitForTimeout(1000)

  // Header no topo
  await desktop.screenshot({
    path: path.join(OUTPUT_DIR, "header-desktop-top.png"),
    clip: { x: 0, y: 0, width: 1440, height: 160 },
  })

  // Dropdown aberto (Sobre)
  const sobreNav = await desktop.$("nav > div:first-child button[aria-haspopup='true']")
  if (sobreNav) {
    await sobreNav.click()
    await desktop.waitForTimeout(300)
    await desktop.screenshot({
      path: path.join(OUTPUT_DIR, "header-dropdown-open.png"),
      clip: { x: 450, y: 0, width: 540, height: 300 },
    })
    await desktop.mouse.click(10, 10)
  }

  // Header após scroll
  await desktop.evaluate(() => window.scrollTo(0, 150))
  await desktop.waitForTimeout(400)
  await desktop.screenshot({
    path: path.join(OUTPUT_DIR, "header-desktop-scrolled.png"),
    clip: { x: 0, y: 0, width: 1440, height: 160 },
  })

  // 2. Hero em 0%, 10%, 25%, 50%, 75%, 100% do scroll (maxScroll = 400)
  const scrollSteps = [
    { pct: "0", scrollY: 0 },
    { pct: "10", scrollY: 40 },
    { pct: "25", scrollY: 100 },
    { pct: "50", scrollY: 200 },
    { pct: "75", scrollY: 300 },
    { pct: "100", scrollY: 400 },
  ]

  for (const step of scrollSteps) {
    await desktop.evaluate((y) => window.scrollTo(0, y), step.scrollY)
    await desktop.waitForTimeout(400)
    await desktop.screenshot({
      path: path.join(OUTPUT_DIR, `hero-scroll-${step.pct}pct.png`),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    })
  }

  // 3. Telas do ciclo do celular (esperar cada transição)
  await desktop.evaluate(() => window.scrollTo(0, 0))
  await desktop.waitForTimeout(500)
  const phoneEl = await desktop.$("[role='img'][aria-label*='App Veridian Capital']")

  if (phoneEl) {
    for (let i = 0; i < 4; i++) {
      const activeTitle = await desktop.evaluate(() => {
        const header = document.querySelector("header .truncate")
        return header ? header.textContent?.trim() : `tela-${i}`
      })
      await phoneEl.screenshot({
        path: path.join(OUTPUT_DIR, `phone-screen-${i + 1}-${activeTitle?.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`),
      })
      await desktop.waitForTimeout(4200)
    }
  }

  // 4. Mobile Header e Menu (375x812)
  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } })
  await mobile.goto(BASE_URL, { waitUntil: "networkidle" })
  await mobile.waitForTimeout(600)

  await mobile.screenshot({
    path: path.join(OUTPUT_DIR, "header-mobile-top.png"),
    clip: { x: 0, y: 0, width: 375, height: 140 },
  })

  // Abrir menu mobile
  const menuBtn = await mobile.$("button[aria-label='Abrir menu']")
  if (menuBtn) {
    await menuBtn.click()
    await mobile.waitForTimeout(500)
    await mobile.screenshot({
      path: path.join(OUTPUT_DIR, "menu-mobile-open.png"),
    })
  }

  await browser.close()
  console.log("=== CAPTURA DE REFERÊNCIA VERIDIAN CONCLUÍDA ===")
}

capture().catch((e) => {
  console.error("ERRO NA CAPTURA:", e)
  process.exit(1)
})
