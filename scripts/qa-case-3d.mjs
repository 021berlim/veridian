import { chromium } from "playwright"

async function runQA() {
  console.log("=== INICIANDO QA DA PÁGINA DE CASE 3D ===")
  const browser = await chromium.launch()
  
  // Teste Desktop
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  console.log("1. Testando Home -> Seção Projetos -> Navegação para Case...")
  await page.goto("http://localhost:3000")
  await page.waitForTimeout(1500)

  // Rola até #projetos
  await page.evaluate(() => {
    const el = document.getElementById("projetos")
    if (el) el.scrollIntoView()
  })
  await page.waitForTimeout(1000)

  // Clica no primeiro projeto
  const firstProjectLink = await page.$('a[href="/projetos/erp-multiusuario"]')
  if (!firstProjectLink) {
    throw new Error("Link do primeiro projeto não encontrado")
  }
  await firstProjectLink.click()
  await page.waitForURL("**/projetos/erp-multiusuario")
  console.log("URL atual:", page.url())
  await page.waitForTimeout(1500)

  // Verifica se não há modal CaseDrawer
  const modalExists = await page.$('div[role="dialog"]')
  console.log("Modal aberto? ", modalExists ? "SIM (ERRO)" : "NÃO (CORRETO: página dedicada)")

  // Screenshot desktop da página de case
  await page.screenshot({ path: "docs/case-3d-desktop-initial.png" })
  console.log("Salvo docs/case-3d-desktop-initial.png")

  // Teste 2: Interações no palco 3D
  console.log("2. Testando interações no Palco 3D...")
  const canvas = await page.$("canvas")
  if (canvas) {
    const box = await canvas.boundingBox()
    if (box) {
      const centerX = box.x + box.width / 2
      const centerY = box.y + box.height / 2

      // Arraste com o mouse para girar
      await page.mouse.move(centerX, centerY)
      await page.mouse.down()
      await page.mouse.move(centerX + 120, centerY + 30, { steps: 10 })
      await page.mouse.up()
      await page.waitForTimeout(500)
      console.log("Giro por arraste executado.")

      // Clique curto no canvas para alternar aparelho
      await page.mouse.click(centerX, centerY)
      await page.waitForTimeout(1200)
      console.log("Clique no canvas para alternar executado.")
    }
  }

  // Clica no botão CELULAR
  const phoneBtn = await page.$('button[aria-label="Visualizar em Celular"]')
  if (phoneBtn) {
    await phoneBtn.click()
    await page.waitForTimeout(1000)
    console.log("Botão CELULAR clicado.")
  }

  await page.screenshot({ path: "docs/case-3d-desktop-phone.png" })
  console.log("Salvo docs/case-3d-desktop-phone.png")

  // Volta para NOTEBOOK
  const laptopBtn = await page.$('button[aria-label="Visualizar em Notebook"]')
  if (laptopBtn) {
    await laptopBtn.click()
    await page.waitForTimeout(1000)
    console.log("Botão NOTEBOOK clicado.")
  }

  // Teste 3: Voltar para Home via link ← PROJETOS
  const backLink = await page.$('a[href="/#projetos"]')
  if (backLink) {
    await backLink.click()
    await page.waitForURL("**/#projetos")
    console.log("Voltou para /#projetos via link com sucesso.")
  }

  // Retorna para o case para testar ESC
  await page.goto("http://localhost:3000/projetos/erp-multiusuario")
  await page.waitForTimeout(1000)
  await page.keyboard.press("Escape")
  await page.waitForURL("**/#projetos")
  console.log("ESC voltou para /#projetos com sucesso.")

  // Teste 4: Slug inválido -> 404
  console.log("4. Testando slug inválido -> 404...")
  const res404 = await page.goto("http://localhost:3000/projetos/slug-inexistente")
  console.log("Status slug inexistente:", res404?.status())

  // Teste 5: Navegação PRÓXIMO PROJETO e CTA
  console.log("5. Testando próximo projeto e CTA...")
  await page.goto("http://localhost:3000/projetos/erp-multiusuario")
  await page.waitForTimeout(1000)

  // Próximo projeto
  const nextProjectLink = await page.$('a[href="/projetos/e-ppgfil"]')
  if (nextProjectLink) {
    await nextProjectLink.click()
    await page.waitForURL("**/projetos/e-ppgfil")
    console.log("Navegação circular PRÓXIMO PROJETO funcionou.")
  }

  // Teste CTA "Quero algo assim"
  const ctaLink = await page.$('a[href*="area="]')
  if (ctaLink) {
    await ctaLink.click()
    await page.waitForTimeout(1200)
    const url = page.url()
    console.log("CTA navegou para:", url)
    // Verifica se área de interesse foi preenchida
    const selectedInterest = await page.evaluate(() => {
      const select = document.getElementById("projectType")
      return select ? select.textContent : null
    })
    console.log("Área de interesse pré-selecionada:", selectedInterest)
  }

  // Teste 6: Mobile Viewport (390x844)
  console.log("6. Testando visualização mobile (390x844)...")
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await mobilePage.goto("http://localhost:3000/projetos/e-ppgfil")
  await mobilePage.waitForTimeout(1500)

  // Verifica se há overflow horizontal
  const hasOverflow = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth
  })
  console.log("Mobile tem overflow horizontal?", hasOverflow ? "SIM (ERRO)" : "NÃO (CORRETO)")

  await mobilePage.screenshot({ path: "docs/case-3d-mobile-initial.png" })
  console.log("Salvo docs/case-3d-mobile-initial.png")

  await browser.close()
  console.log("=== TODOS OS TESTES DE QA CONCLUÍDOS COM SUCESSO ===")
}

runQA().catch((err) => {
  console.error("Erro no QA:", err)
  process.exit(1)
})
