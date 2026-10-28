import { chromium } from "playwright"

async function runQA() {
  const browser = await chromium.launch()
  console.log("=== INICIANDO QA RUNTIME DOS 5 APPS DO CELULAR (G1 - G6) ===")

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

  // Medir tamanhos computados de fonte (G1) e preenchimento vertical (G2) na Tela 1
  const g1Desktop = await page.evaluate(() => {
    const targetScreen = document.querySelector("#phone-screen-container")
    const title = targetScreen.querySelector("h3")
    const subtitle = targetScreen.querySelector("p")
    const label = targetScreen.querySelector(".uppercase")
    const largeValue = targetScreen.querySelector(".font-semibold.text-white")
    const screenRect = targetScreen.getBoundingClientRect()

    const allChildren = Array.from(targetScreen.querySelectorAll("*"))
    let maxBottom = 0
    let overflowElements = 0
    allChildren.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.height > 0 && r.bottom > maxBottom) {
        maxBottom = r.bottom
      }
      if (el.scrollWidth > el.clientWidth + 1) {
        overflowElements++
      }
    })

    const fillPercent = ((maxBottom - screenRect.top) / screenRect.height) * 100

    return {
      screenWidth: Math.round(screenRect.width),
      screenHeight: Math.round(screenRect.height),
      titleSize: title ? parseFloat(window.getComputedStyle(title).fontSize) : 0,
      subtitleSize: subtitle ? parseFloat(window.getComputedStyle(subtitle).fontSize) : 0,
      labelSize: label ? parseFloat(window.getComputedStyle(label).fontSize) : 0,
      largeValueSize: largeValue ? parseFloat(window.getComputedStyle(largeValue).fontSize) : 0,
      fillPercent: fillPercent.toFixed(1) + "%",
      fillNumeric: fillPercent,
      overflowElements,
    }
  })
  console.log("G1 & G2 Resultados Desktop (Tela 1):", g1Desktop)

  // Capturar as 5 telas na ordem exata aguardando cada transição
  const appNames = [
    "Painel do cliente",
    "Portal do aluno",
    "Gestão financeira",
    "Oficina mecânica",
    "Assistente pessoal"
  ]

  for (let s = 0; s < appNames.length; s++) {
    const expectedName = appNames[s]
    console.log(`Aguardando app "${expectedName}"...`)
    await page.waitForFunction((name) => {
      const p = document.querySelector("#hero p[aria-live='off']")
      return p && p.textContent.includes(name)
    }, expectedName, { timeout: 15000 })

    await page.waitForTimeout(500) // respiro para animação de entrada concluir
    const currentCaption = await page.evaluate(() => {
      return document.querySelector("#hero p[aria-live='off']")?.textContent?.trim() || ""
    })
    console.log(`Capturando Tela ${s + 1}: ${currentCaption}`)
    await phoneLocator.screenshot({ path: `docs/app-tela-${s + 1}.png` })
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
    const title = targetScreen.querySelector("h3")
    const subtitle = targetScreen.querySelector("p")
    const label = targetScreen.querySelector(".uppercase")
    const largeValue = targetScreen.querySelector(".font-semibold.text-white")

    return {
      screenWidth: Math.round(targetScreen.getBoundingClientRect().width),
      titleSize: title ? parseFloat(window.getComputedStyle(title).fontSize) : 0,
      subtitleSize: subtitle ? parseFloat(window.getComputedStyle(subtitle).fontSize) : 0,
      labelSize: label ? parseFloat(window.getComputedStyle(label).fontSize) : 0,
      largeValueSize: largeValue ? parseFloat(window.getComputedStyle(largeValue).fontSize) : 0,
    }
  })
  console.log("G1 Resultados Mobile:", g1Mobile)
  await mobilePhone.screenshot({ path: "docs/app-tela-mobile.png" })

  // -------------------------------------------------------------------------
  // G4: Sem blur/backdrop-filter
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
  // G6: Scroll collapse check
  // -------------------------------------------------------------------------
  console.log("\nG6 Scroll collapse check...")
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
  console.log("=== QA DOS 5 APPS FINALIZADO COM SUCESSO ===")
}

runQA().catch((e) => {
  console.error("Erro no QA:", e)
  process.exit(1)
})
