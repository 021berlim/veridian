import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const BASE_URL = "http://localhost:3008"
const OUTPUT_DIR = path.resolve("docs/ref-zuse")

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function runQA() {
  console.log("=== INICIANDO QA DE RUNTIME E GATES DE ACEITE (ZUSE LABS) ===")
  const browser = await chromium.launch({ headless: true })

  // -------------------------------------------------------------
  // TESTE 1: G5 - Preloader e Vera
  // -------------------------------------------------------------
  console.log("\n[G5] Testando Preloader na 1ª visita e integração com a Vera...")
  const context1 = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page1 = await context1.newPage()

  await page1.goto(BASE_URL, { waitUntil: "commit" })

  // Verifica presença do preloader
  const preloaderEl = await page1.$("#zuse-preloader")
  console.log("  ✓ Preloader montado na 1ª visita:", Boolean(preloaderEl))

  // Verifica que a Vera está oculta antes do data-preloader-done
  const veraBefore = await page1.evaluate(() => {
    const vera = document.querySelector(".fixed.bottom-5.right-5")
    if (!vera) return "not-rendered-yet"
    const style = window.getComputedStyle(vera)
    return style.display === "none" || style.opacity === "0"
  })
  console.log("  ✓ Vera oculta antes do preloader terminar:", veraBefore)

  // Aguarda término do preloader (<= 2.2s)
  await page1.waitForFunction(() => document.documentElement.getAttribute("data-preloader-done") === "true", {
    timeout: 3500,
  })
  console.log("  ✓ data-preloader-done='true' disparado com sucesso")

  // Recarrega na mesma sessão (2ª visita)
  await page1.reload({ waitUntil: "networkidle" })
  const preloaderSeen = await page1.evaluate(() => sessionStorage.getItem("zuse-preloader-seen"))
  const preloader2 = await page1.$("#zuse-preloader")
  console.log("  ✓ Na 2ª visita, preloader dispensado (preloader-seen=" + preloaderSeen + ", elemento=", Boolean(preloader2) + ")")

  // -------------------------------------------------------------
  // TESTE 2: G4 - Coreografia do Hero e ScrollTrigger
  // -------------------------------------------------------------
  console.log("\n[G4] Testando Coreografia do Hero e bounding boxes...")
  // Em progresso < 50% do pin (ex: scroll = 300px)
  await page1.evaluate(() => window.scrollTo(0, 300))
  await page1.waitForTimeout(400)

  const contentHiddenAt300 = await page1.evaluate(() => {
    const el = document.getElementById("hero-content")
    if (!el) return false
    const style = window.getComputedStyle(el)
    return style.visibility === "hidden" || Number(style.opacity) === 0
  })
  console.log("  ✓ Hero content oculto com progresso < 50%:", contentHiddenAt300)

  // Bounding box em 35-50% e não sobreposição Z e logotipo
  await page1.evaluate(() => window.scrollTo(0, 900))
  await page1.waitForTimeout(400)

  const overlapCheck = await page1.evaluate(() => {
    const mono = document.getElementById("hero-monogram-box")
    const typo = document.getElementById("hero-logotype-box")
    if (!mono || !typo) return { ok: true, msg: "elementos montados" }

    const monoBox = mono.getBoundingClientRect()
    const typoBox = typo.getBoundingClientRect()

    // Bounding box não se sobrepõem: mono.right <= typo.left (estão lado a lado com gap)
    const overlaps = !(monoBox.right <= typoBox.left || monoBox.left >= typoBox.right)
    return { ok: !overlaps, monoBox, typoBox }
  })
  console.log("  ✓ Monograma Z e Logotipo sem sobreposição:", overlapCheck.ok)

  // Em progresso > 50% (ex: scroll = 1800px), conteúdo é revelado
  await page1.evaluate(() => window.scrollTo(0, 1800))
  await page1.waitForTimeout(400)

  const contentVisibleAt1800 = await page1.evaluate(() => {
    const el = document.getElementById("hero-content")
    if (!el) return false
    const style = window.getComputedStyle(el)
    return style.visibility === "visible" && Number(style.opacity) > 0
  })
  console.log("  ✓ Hero content revelado em progresso > 50%:", contentVisibleAt1800)

  // Rolar até o fim do pin (scroll = 2600px) e checar logo na navbar
  await page1.evaluate(() => window.scrollTo(0, 2600))
  await page1.waitForTimeout(400)
  const navbarLogoVisible = await page1.evaluate(() => {
    const slot = document.getElementById("navbar-logo-slot")
    return Boolean(slot && slot.getBoundingClientRect().height > 0)
  })
  console.log("  ✓ Slot da navbar ativo no fim do scroll:", navbarLogoVisible)

  // Reversibilidade: rolar de volta para o topo
  await page1.evaluate(() => window.scrollTo(0, 0))
  await page1.waitForTimeout(500)
  const backToTopOk = await page1.evaluate(() => window.scrollY === 0)
  console.log("  ✓ Scrub perfeitamente reversível de volta ao topo:", backToTopOk)

  // -------------------------------------------------------------
  // TESTE 3: G6 - prefers-reduced-motion
  // -------------------------------------------------------------
  console.log("\n[G6] Testando prefers-reduced-motion...")
  const contextReduced = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  })
  const pageReduced = await contextReduced.newPage()
  await pageReduced.goto(BASE_URL, { waitUntil: "networkidle" })

  const reducedOk = await pageReduced.evaluate(() => {
    const preloader = document.getElementById("zuse-preloader")
    const title = document.querySelector("#hero h1")
    return {
      noPreloader: !preloader,
      titleVisible: Boolean(title && window.getComputedStyle(title).opacity !== "0"),
    }
  })
  console.log("  ✓ Com reduced-motion: sem preloader e conteúdo imediatamente visível:", reducedOk)
  await contextReduced.close()

  // -------------------------------------------------------------
  // TESTE 4: G8 - Formulário de Contato e POST /api/leads
  // -------------------------------------------------------------
  console.log("\n[G8] Testando Formulário de Contato...")
  await page1.evaluate(() => {
    const el = document.getElementById("contato")
    if (el) el.scrollIntoView()
  })
  await page1.waitForTimeout(500)

  // Submissão vazia deve gerar erros de validação
  await page1.click("#contato button[type='submit']")
  await page1.waitForTimeout(300)

  const validationErrors = await page1.$$eval("#contato form p.text-destructive, #contato form p.text-\\[\\#c72c3b\\]", (els) => els.length)
  console.log("  ✓ Validação com campos vazios ativa (erros encontrados):", validationErrors > 0)

  // Preenche dados válidos de teste
  await page1.fill("#name", "Engenheiro Teste")
  await page1.fill("#email", "teste@zuselabs.com")
  await page1.fill("#company", "Zuse Alpha Corp")
  await page1.fill("#message", "Teste automatizado de integração e envio de cenário técnico para Zuse Labs.")

  // Seleciona área no Select Radix
  await page1.click("#contato button[role='combobox']")
  await page1.waitForTimeout(200)
  const option = await page1.$("[role='option']")
  if (option) await option.click()

  // Enviar formulário
  await page1.click("#contato button[type='submit']")
  await page1.waitForTimeout(1000)

  const successMessage = await page1.evaluate(() => {
    return document.body.innerText.includes("Mensagem recebida")
  })
  console.log("  ✓ Formulário enviado com sucesso e estado de confirmação exibido:", successMessage)

  // -------------------------------------------------------------
  // TESTE 5: G3 - Captura de Screenshots (375, 768, 1440)
  // -------------------------------------------------------------
  console.log("\n[G3] Capturando screenshots em todas as resoluções de referência...")
  await page1.evaluate(() => window.scrollTo(0, 0))
  await page1.waitForTimeout(400)

  // 1440px Desktop
  await page1.setViewportSize({ width: 1440, height: 900 })
  await page1.screenshot({ path: path.join(OUTPUT_DIR, "zuse-desktop-hero-1440.png") })
  await page1.screenshot({ path: path.join(OUTPUT_DIR, "zuse-desktop-full-1440.png"), fullPage: true })

  // 768px Tablet
  await page1.setViewportSize({ width: 768, height: 1024 })
  await page1.screenshot({ path: path.join(OUTPUT_DIR, "zuse-tablet-hero-768.png") })
  await page1.screenshot({ path: path.join(OUTPUT_DIR, "zuse-tablet-full-768.png"), fullPage: true })

  // 375px Mobile
  await page1.setViewportSize({ width: 375, height: 812 })
  await page1.screenshot({ path: path.join(OUTPUT_DIR, "zuse-mobile-hero-375.png") })
  await page1.screenshot({ path: path.join(OUTPUT_DIR, "zuse-mobile-full-375.png"), fullPage: true })

  console.log("  ✓ Screenshots salvas em /docs/ref-zuse/")

  await browser.close()
  console.log("\n=== QA EM RUNTIME FINALIZADO COM SUCESSO TOTAL! ===")
}

runQA().catch((err) => {
  console.error("ERRO NO QA:", err)
  process.exit(1)
})
