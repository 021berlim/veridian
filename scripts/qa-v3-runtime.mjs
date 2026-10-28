import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const BASE_URL = "http://localhost:3000"
const OUTPUT_DIR = path.resolve(process.cwd(), "docs/ref-zuse")

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function runQA() {
  console.log("=== INICIANDO QA RUNTIME ZUSE LABS v3 ===")
  const browser = await chromium.launch({ headless: true })

  try {
    // ----------------------------------------------------
    // TESTE 1: Intro Automática e Gates G1 / G3
    // ----------------------------------------------------
    console.log("\n[1/6] Testando Intro Automática...")
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    })
    const page = await context.newPage()

    // Carregar página
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" })

    // Capturar frames da intro
    console.log("Capturando frames da intro...")
    await page.screenshot({ path: path.join(OUTPUT_DIR, "intro-0.0s.png") })

    await page.waitForTimeout(1000) // ~1.0s
    await page.screenshot({ path: path.join(OUTPUT_DIR, "intro-1.0s.png") })

    await page.waitForTimeout(1500) // ~2.5s (início do FLIP)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "intro-2.5s.png") })

    await page.waitForTimeout(1000) // ~3.5s (chegada ao slot e reveal)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "intro-3.5s.png") })

    // Aguardar conclusão formal do ciclo (4.2s da timeline master + tempo de hidratação)
    await page.waitForFunction(
      () => document.documentElement.dataset.introState === "done",
      { timeout: 10000 }
    )
    await page.screenshot({ path: path.join(OUTPUT_DIR, "intro-done.png") })

    // Verificar estados após a intro
    const introState = await page.evaluate(() => document.documentElement.dataset.introState)
    const preloaderDone = await page.evaluate(() => document.documentElement.getAttribute("data-preloader-done"))
    console.log(`Estado da intro ao concluir: introState=${introState}, preloaderDone=${preloaderDone}`)

    if (introState !== "done" || preloaderDone !== "true") {
      throw new Error(`Falha no G1: introState=${introState}, preloaderDone=${preloaderDone}`)
    }

    // Verificar se a Vera agora está visível
    const veraVisible = await page.evaluate(() => {
      const veraTrigger = document.querySelector(".fixed.bottom-5.right-5")
      if (!veraTrigger) return false
      const style = window.getComputedStyle(veraTrigger)
      return style.display !== "none" && style.opacity !== "0"
    })
    console.log(`Gate G1 (Vera liberada após intro): ${veraVisible ? "OK" : "FALHA"}`)

    // ----------------------------------------------------
    // TESTE 2: Header Flutuante, Slot e Dropdowns (G2)
    // ----------------------------------------------------
    console.log("\n[2/6] Testando Header e Navegação (G2)...")
    await page.screenshot({ path: path.join(OUTPUT_DIR, "header-desktop-top.png") })

    // Verificar medição de --header-h
    const headerH = await page.evaluate(() => {
      return document.documentElement.style.getPropertyValue("--header-h")
    })
    console.log(`--header-h medido: ${headerH}`)

    // Verificar slot da logo preenchido
    const logoSlotHasSvg = await page.evaluate(() => {
      const slot = document.getElementById("zuse-header-logo-slot")
      return slot ? slot.querySelector("svg") !== null : false
    })
    console.log(`Slot #zuse-header-logo-slot preenchido com logo: ${logoSlotHasSvg ? "OK" : "FALHA"}`)

    // Testar abertura de dropdown "Sobre"
    console.log("Abrindo dropdown 'Sobre'...")
    const sobreButton = page.locator("button:has-text('Sobre')").first()
    if (await sobreButton.isVisible()) {
      await sobreButton.click()
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(OUTPUT_DIR, "header-dropdown-sobre.png") })
      // Fechar dropdown
      await page.keyboard.press("Escape")
      await page.waitForTimeout(200)
    }

    // Scroll para testar header fixo com fundo sólido
    console.log("Testando scroll do header...")
    await page.evaluate(() => window.scrollTo(0, 300))
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "header-desktop-scrolled.png") })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)

    // ----------------------------------------------------
    // TESTE 3: Hero e Distância vs Header (G3)
    // ----------------------------------------------------
    console.log("\n[3/6] Testando Hero e Colapso (G3)...")
    const headerBottom = await page.evaluate(() => {
      const header = document.getElementById("zuse-main-header")
      return header ? header.getBoundingClientRect().bottom : 0
    })
    const h1Top = await page.evaluate(() => {
      const h1 = document.querySelector("#hero h1")
      return h1 ? h1.getBoundingClientRect().top : 0
    })
    const gap = h1Top - headerBottom
    console.log(`Header bottom: ${headerBottom}px | H1 top: ${h1Top}px | Gap: ${gap}px`)
    if (gap <= 0) {
      console.warn(`AVISO: H1 sobreposto pelo header! gap = ${gap}`)
    } else {
      console.log(`Gate G3 (Header nunca sobrepõe h1): OK (gap = ${Math.round(gap)}px)`)
    }

    // Scroll progress no Hero: 0%, 25%, 50%, 100% (range de 400px)
    console.log("Capturando estágios do colapso no hero...")
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "hero-scroll-000.png") })

    await page.evaluate(() => window.scrollTo(0, 100))
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "hero-scroll-025.png") })

    await page.evaluate(() => window.scrollTo(0, 200))
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "hero-scroll-050.png") })

    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "hero-scroll-100.png") })

    // Voltar ao topo para captura do celular
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)

    // ----------------------------------------------------
    // TESTE 4: Celular e Ciclo de Telas (G4)
    // ----------------------------------------------------
    console.log("\n[4/6] Testando Celular e Telas (G4)...")
    const phoneElement = page.locator("#hero [role='img'][aria-label*='Interface mobile']").first()
    await phoneElement.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Capturar telas do ciclo
    console.log("Capturando 4 telas do celular...")
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(4200)
      const currentTitle = await page.evaluate(() => {
        const titleEl = document.querySelector("#hero [role='img'] header p.truncate")
        return titleEl ? titleEl.textContent?.trim() : "desconhecido"
      })
      console.log(`Tela celular ${i + 1}: "${currentTitle}"`)
      await phoneElement.screenshot({
        path: path.join(OUTPUT_DIR, `phone-screen-${i + 1}-${currentTitle?.toLowerCase().replace(/\s+/g, "-")}.png`),
      })
    }

    // ----------------------------------------------------
    // TESTE 5: Menu Mobile (G2) e Viewport 375px
    // ----------------------------------------------------
    console.log("\n[5/6] Testando Menu Mobile (375px)...")
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
    })
    const mobilePage = await mobileContext.newPage()
    await mobilePage.goto(BASE_URL, { waitUntil: "domcontentloaded" })
    await mobilePage.waitForTimeout(4500) // Aguardar intro

    await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "mobile-375-hero.png") })

    // Abrir menu mobile
    const menuButton = mobilePage.locator("button[aria-label='Abrir menu']").first()
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await mobilePage.waitForTimeout(400)
      await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "mobile-375-menu-open.png") })
      // Fechar
      const closeButton = mobilePage.locator("button[aria-label='Fechar menu']").first()
      if (await closeButton.isVisible()) {
        await closeButton.click()
      }
    }

    // ----------------------------------------------------
    // TESTE 6: Prefers-Reduced-Motion & Âncora Direta (G1)
    // ----------------------------------------------------
    console.log("\n[6/6] Testando Reduced Motion e Âncora Direta...")
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    })
    const rmPage = await reducedMotionContext.newPage()
    await rmPage.goto(BASE_URL, { waitUntil: "domcontentloaded" })
    await rmPage.waitForTimeout(300)
    const rmState = await rmPage.evaluate(() => document.documentElement.dataset.introState)
    console.log(`Reduced motion pula intro: ${rmState === "done" ? "OK" : "FALHA"}`)

    // Âncora direta
    const anchorContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    })
    const anchorPage = await anchorContext.newPage()
    await anchorPage.goto(`${BASE_URL}/#contato`, { waitUntil: "domcontentloaded" })
    await anchorPage.waitForTimeout(300)
    const anchorState = await anchorPage.evaluate(() => document.documentElement.dataset.introState)
    console.log(`Acesso via âncora direta pula intro: ${anchorState === "done" ? "OK" : "FALHA"}`)

    console.log("\n=== QA RUNTIME CONCLUÍDO COM SUCESSO! ===")
  } catch (err) {
    console.error("ERRO DURANTE O QA:", err)
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

runQA()
