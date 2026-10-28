import { chromium } from "playwright"

async function runQA() {
  const browser = await chromium.launch()
  console.log("=== INICIANDO QA RUNTIME DO MÉTODO (G1 - G7) ===")

  // ----------------------------------------------------
  // TESTE 1: DESKTOP (1440x900)
  // ----------------------------------------------------
  console.log("\n--- TESTE DESKTOP (1440x900) ---")
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const consoleErrors = []
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text())
  })

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await page.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 })
  await page.waitForTimeout(500)

  // G5: Sem overflow horizontal da página
  const overflowCheck = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      noOverflow: document.documentElement.scrollWidth === document.documentElement.clientWidth,
    }
  })
  console.log("G5 Overflow check:", overflowCheck)

  // Localiza seção do processo
  const processSection = page.locator("#processo")
  const processBox = await processSection.boundingBox()
  console.log("Processo initial box:", processBox)

  // Scrolla até o início da seção do processo
  await page.evaluate((targetY) => {
    window.scrollTo({ top: targetY, behavior: "instant" })
  }, processBox.y)
  await page.waitForTimeout(600)

  // G5: Topo respeita header-h
  const g5Top = await page.evaluate(() => {
    const header = document.querySelector("header")
    const headerBottom = header ? header.getBoundingClientRect().bottom : 92
    const section = document.querySelector("#processo")
    const title = section ? section.querySelector("h2") : null
    const titleTop = title ? title.getBoundingClientRect().top : 0
    return {
      headerBottom: Math.round(headerBottom),
      titleTop: Math.round(titleTop),
      respectsHeader: titleTop >= headerBottom,
    }
  })
  console.log("G5 Topo vs Header:", g5Top)

  // G2: No progresso 0, a 1ª etapa alinha com a borda esquerda do título (±2px)
  const g2Start = await page.evaluate(() => {
    const title = document.querySelector("#processo h2")
    const firstStep = document.querySelector('#processo [role="listitem"]')
    const titleLeft = title.getBoundingClientRect().left
    const firstStepLeft = firstStep.getBoundingClientRect().left
    return {
      titleLeft: Math.round(titleLeft),
      firstStepLeft: Math.round(firstStepLeft),
      diff: Math.abs(Math.round(titleLeft) - Math.round(firstStepLeft)),
      aligned: Math.abs(Math.round(titleLeft) - Math.round(firstStepLeft)) <= 2,
    }
  })
  console.log("G2 Progresso 0 (alinhamento título):", g2Start)

  // G3: SEM CARDS (background transparente, border-radius 0, sem box-shadow)
  const g3Cards = await page.evaluate(() => {
    const steps = Array.from(document.querySelectorAll('#processo [role="listitem"]'))
    return steps.map((el, i) => {
      const cs = window.getComputedStyle(el)
      return {
        step: i + 1,
        bg: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        borderLeft: cs.borderLeftWidth,
        borderRight: cs.borderRightWidth,
        borderTop: cs.borderTopWidth,
        borderBottom: cs.borderBottomWidth,
        isClean:
          (cs.backgroundColor === "rgba(0, 0, 0, 0)" || cs.backgroundColor === "transparent") &&
          (cs.borderRadius === "0px" || cs.borderRadius === "") &&
          (cs.boxShadow === "none" || cs.boxShadow === "") &&
          cs.borderRightWidth === "0px" &&
          cs.borderTopWidth === "0px" &&
          cs.borderBottomWidth === "0px",
      }
    })
  })
  console.log("G3 Sem cards check:", g3Cards)

  // G4: Estado ativo no progresso 0
  const g4Start = await page.evaluate(() => {
    const steps = Array.from(document.querySelectorAll('#processo [role="listitem"]'))
    const activeSteps = steps.filter((s) => s.getAttribute("data-active") === "true")
    const activeOpacity = activeSteps.map((s) => window.getComputedStyle(s).opacity)
    const numeralColor = activeSteps[0]?.querySelector(".step-numeral")?.style.color
    return {
      activeCount: activeSteps.length,
      activeOpacity,
      numeralColor,
      isCorrect: activeSteps.length === 1 && activeOpacity[0] === "1",
    }
  })
  console.log("G4 Ativo inicial (Step 1):", g4Start)

  // G1: Scrollando para frente
  console.log("Scrollando pela trilha...");
  const trackPositions = []
  for (let i = 0; i <= 6; i++) {
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(250)
    const info = await page.evaluate(() => {
      const track = document.querySelector('#processo [role="list"]')
      const matrix = window.getComputedStyle(track).transform
      const activeEl = document.querySelector('#processo [role="listitem"][data-active="true"]')
      const activeIdx = activeEl ? Array.from(activeEl.parentElement.children).indexOf(activeEl) : -1
      return {
        scrollY: window.scrollY,
        transform: matrix,
        activeIdx: activeIdx + 1,
      }
    })
    trackPositions.push(info)
  }
  console.log("G1 Posições da trilha ao longo do scroll:", trackPositions)

  // Scrollar até o final do processo
  await page.mouse.wheel(0, 1500)
  await page.waitForTimeout(500)

  // G2 no fim: 4ª etapa alinhada à borda direita do container
  const g2End = await page.evaluate(() => {
    const container = document.querySelector("#processo .w-full.flex-1")
    const steps = document.querySelectorAll('#processo [role="listitem"]')
    const lastStep = steps[steps.length - 1]
    const containerRight = container.getBoundingClientRect().right
    const lastStepRight = lastStep.getBoundingClientRect().right
    return {
      containerRight: Math.round(containerRight),
      lastStepRight: Math.round(lastStepRight),
      diff: Math.abs(Math.round(containerRight) - Math.round(lastStepRight)),
      inViewport: lastStep.getBoundingClientRect().left < window.innerWidth && lastStep.getBoundingClientRect().right <= window.innerWidth + 4,
    }
  })
  console.log("G2 Progresso 100% (4ª etapa na viewport):", g2End)

  // Captura screenshots desktop
  await page.screenshot({ path: "docs/qa-metodo-desktop-end.png" })

  // ----------------------------------------------------
  // TESTE 2: MOBILE (375x812)
  // ----------------------------------------------------
  console.log("\n--- TESTE MOBILE (375x812) ---")
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } })
  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await mobilePage.waitForFunction(() => document.documentElement.dataset.introState === "done", { timeout: 10000 })
  await mobilePage.waitForTimeout(500)

  const mobileProcess = mobilePage.locator("#processo")
  const mBox = await mobileProcess.boundingBox()
  await mobilePage.evaluate((targetY) => {
    window.scrollTo({ top: targetY, behavior: "instant" })
  }, mBox.y)
  await mobilePage.waitForTimeout(500)

  const mobileCheck = await mobilePage.evaluate(() => {
    const firstStep = document.querySelector('#processo [role="listitem"]')
    const rect = firstStep ? firstStep.getBoundingClientRect() : null
    return {
      firstStepWidth: rect ? Math.round(rect.width) : 0,
      viewportWidth: window.innerWidth,
      ratio: rect ? (rect.width / window.innerWidth).toFixed(2) : 0,
    }
  })
  console.log("G6 Mobile layout:", mobileCheck)
  await mobilePage.screenshot({ path: "docs/qa-metodo-mobile.png" })

  // ----------------------------------------------------
  // TESTE 3: PREFERS-REDUCED-MOTION
  // ----------------------------------------------------
  console.log("\n--- TESTE PREFERS-REDUCED-MOTION ---")
  const prmPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: {},
  })
  await prmPage.emulateMedia({ reducedMotion: "reduce" })
  await prmPage.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await prmPage.waitForTimeout(600)

  const prmCheck = await prmPage.evaluate(() => {
    const list = document.querySelector('#processo [role="list"]')
    const cs = window.getComputedStyle(list)
    return {
      overflowX: cs.overflowX,
      scrollSnapType: cs.scrollSnapType,
      isNativeCarousel: cs.overflowX === "auto" || cs.overflowX === "scroll",
    }
  })
  console.log("G6 Reduced Motion check:", prmCheck)

  // Console errors check
  console.log("\nConsole errors:", consoleErrors)

  await browser.close()
  console.log("\n=== QA RUNTIME FINALIZADO COM SUCESSO ===")
}

runQA().catch((err) => {
  console.error("Erro no QA:", err)
  process.exit(1)
})
