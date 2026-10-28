import { chromium } from "playwright"

async function runPhoneQA() {
  const browser = await chromium.launch()
  console.log("=== INICIANDO QA RUNTIME DA TELA DO CELULAR (G1 - G5) ===")

  // -------------------------------------------------------------------------
  // TESTE 1: DESKTOP (1440x900)
  // -------------------------------------------------------------------------
  console.log("\n--- TESTE 1: DESKTOP 1440x900 ---")
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const consoleErrors = []
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text())
  })

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await page.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 })
  await page.waitForTimeout(1000)

  // Localizar o mockup do celular
  const phoneLocator = page.locator("#hero [role='img'][aria-hidden='true']")
  await phoneLocator.waitFor({ state: "visible" })
  const phoneBox = await phoneLocator.boundingBox()
  console.log("Phone bounding box:", phoneBox)

  // Medir tamanhos computados de fonte (G1) e preenchimento vertical (G2)
  const g1Desktop = await page.evaluate(() => {
    const targetScreen = document.querySelector("#phone-screen-container")
    const title = targetScreen.querySelector("h4")
    const subtitle = targetScreen.querySelector("p")
    const label = targetScreen.querySelector(".font-mono.uppercase")
    const value = targetScreen.querySelector(".font-medium.text-white")
    const code = targetScreen.querySelector(".font-mono")

    const screenRect = targetScreen.getBoundingClientRect()

    const allChildren = Array.from(targetScreen.querySelectorAll("*"))
    let maxBottom = 0
    allChildren.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.height > 0 && r.bottom > maxBottom) {
        maxBottom = r.bottom
      }
    })

    const fillPercent = ((maxBottom - screenRect.top) / screenRect.height) * 100

    return {
      screenWidth: Math.round(screenRect.width),
      screenHeight: Math.round(screenRect.height),
      titleSize: parseFloat(window.getComputedStyle(title).fontSize),
      subtitleSize: parseFloat(window.getComputedStyle(subtitle).fontSize),
      labelSize: parseFloat(window.getComputedStyle(label).fontSize),
      valueSize: parseFloat(window.getComputedStyle(value).fontSize),
      codeSize: code ? parseFloat(window.getComputedStyle(code).fontSize) : null,
      fillPercent: fillPercent.toFixed(1) + "%",
      fillNumeric: fillPercent,
    }
  })
  console.log("G1 & G2 Resultados Desktop:", g1Desktop)

  // Capturar as 4 telas recortadas do aparelho (G3)
  console.log("Capturando as 4 telas do celular...")
  for (let s = 1; s <= 4; s++) {
    await phoneLocator.screenshot({ path: `docs/phone-tela-${s}.png` })
    console.log(`Capturada docs/phone-tela-${s}.png`)
    if (s < 4) {
      await page.waitForTimeout(6200)
    }
  }

  // -------------------------------------------------------------------------
  // TESTE 2: MOBILE (375x812)
  // -------------------------------------------------------------------------
  console.log("\n--- TESTE 2: MOBILE 375x812 ---")
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } })
  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await mobilePage.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 })
  await mobilePage.waitForTimeout(1000)

  const mobilePhone = mobilePage.locator("#hero [role='img'][aria-hidden='true']")
  const g1Mobile = await mobilePage.evaluate(() => {
    const targetScreen = document.querySelector("#phone-screen-container")
    const title = targetScreen.querySelector("h4")
    const subtitle = targetScreen.querySelector("p")
    const label = targetScreen.querySelector(".font-mono.uppercase")
    const value = targetScreen.querySelector(".font-medium.text-white")

    return {
      screenWidth: Math.round(targetScreen.getBoundingClientRect().width),
      titleSize: parseFloat(window.getComputedStyle(title).fontSize),
      subtitleSize: parseFloat(window.getComputedStyle(subtitle).fontSize),
      labelSize: parseFloat(window.getComputedStyle(label).fontSize),
      valueSize: parseFloat(window.getComputedStyle(value).fontSize),
    }
  })
  console.log("G1 Resultados Mobile:", g1Mobile)
  await mobilePhone.screenshot({ path: "docs/phone-tela-mobile.png" })

  // -------------------------------------------------------------------------
  // G4: Sem blur/backdrop
  // -------------------------------------------------------------------------
  const g4Check = await page.evaluate(() => {
    const mockup = document.querySelector("#hero [role='img'][aria-hidden='true']")
    const all = Array.from(mockup.querySelectorAll("*"))
    const blurElements = all.filter((el) => {
      const cs = window.getComputedStyle(el)
      return (
        cs.backdropFilter.includes("blur") ||
        cs.filter.includes("blur")
      )
    })
    return {
      hasBlur: blurElements.length > 0,
      count: blurElements.length,
    }
  })
  console.log("\nG4 Blur check:", g4Check)

  // -------------------------------------------------------------------------
  // G5: Interação com scroll do Hero
  // -------------------------------------------------------------------------
  console.log("\nG5 Scroll collapse check...")
  const initialBox = await phoneLocator.boundingBox()
  await page.mouse.wheel(0, 200)
  await page.waitForTimeout(400)
  const scrolledBox = await phoneLocator.boundingBox()
  console.log("Scroll 0px vs 200px box:", {
    initial: initialBox,
    scrolled: scrolledBox,
    collapsed: scrolledBox.y !== initialBox.y,
  })

  console.log("\nConsole errors:", consoleErrors)
  await browser.close()
  console.log("=== QA PHONE TELA FINALIZADO COM SUCESSO ===")
}

runPhoneQA().catch((e) => {
  console.error("Erro no QA:", e)
  process.exit(1)
})
