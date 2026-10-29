import { chromium } from "playwright"
import fs from "fs"
import path from "path"

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  console.log("Acessando http://localhost:3000...")
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" })

  // Aguardar intro se estiver ativa
  try {
    await page.waitForFunction(
      () => document.documentElement.dataset.introState === "done",
      { timeout: 8000 }
    )
  } catch (e) {
    console.log("Intro já concluída ou pulada.")
  }

  // 1. Verificar remoção da seção Capacidades ("Engenharia pensada...")
  const capabilitiesExist = await page.evaluate(() => {
    return !!document.getElementById("capacidades") ||
      document.body.innerText.includes("Engenharia pensada para estabilidade")
  })
  console.log("Seção Capacidades ainda existe?", capabilitiesExist ? "SIM (ERRO)" : "NÃO (CORRETO: REMOVIDA)")

  // 2. Verificar ordem de seções no DOM
  const sectionIds = await page.evaluate(() => {
    const main = document.querySelector("main")
    if (!main) return []
    const sections = Array.from(main.children).filter(el => el.tagName === "SECTION" || el.id || el.getAttribute("aria-label"))
    return sections.map(el => el.id || el.getAttribute("aria-label") || el.tagName)
  })
  console.log("Estrutura sequencial de seções no main:", sectionIds)

  // 3. Verificar links de navegação
  const navLinks = await page.evaluate(() => {
    const headerLinks = Array.from(document.querySelectorAll("#zuse-main-header a, #zuse-main-header button")).map(el => ({
      text: el.textContent?.trim(),
      href: el.getAttribute("href")
    }))
    const footerLinks = Array.from(document.querySelectorAll("footer a")).map(el => ({
      text: el.textContent?.trim(),
      href: el.getAttribute("href")
    }))
    return { headerLinks, footerLinks }
  })
  console.log("Projetos no Header?", navLinks.headerLinks.some(l => l.href === "#projetos" || l.text?.includes("Projetos")))
  console.log("Capacidades no Header?", navLinks.headerLinks.some(l => l.href === "#capacidades" || l.text?.includes("Capacidades")))
  console.log("Projetos no Footer?", navLinks.footerLinks.some(l => l.href === "#projetos" || l.text?.includes("Projetos")))
  console.log("Capacidades no Footer?", navLinks.footerLinks.some(l => l.href === "#capacidades" || l.text?.includes("Capacidades")))

  // 4. Medir altura da página em pixels e em vh
  const pageHeight = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      totalVh: Math.round(document.documentElement.scrollHeight / window.innerHeight * 100) / 100
    }
  })
  console.log(`Altura total da página: ${pageHeight.scrollHeight}px (${pageHeight.totalVh} vh)`)

  // 5. Testar Seção de Projetos
  const projectsSection = page.locator("#projetos")
  await projectsSection.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  // Screenshot desktop da seção de projetos
  await page.screenshot({ path: "docs/projetos-desktop-initial.png" })
  console.log("Salvo docs/projetos-desktop-initial.png")

  // Testar hover/seleção no segundo projeto
  const secondProjectTab = page.locator("#tab-e-ppgfil")
  if (await secondProjectTab.count() > 0) {
    await secondProjectTab.hover()
    await page.waitForTimeout(400)
    await page.screenshot({ path: "docs/projetos-desktop-hover-second.png" })
    console.log("Salvo docs/projetos-desktop-hover-second.png")

    // Clicar para abrir o CaseDrawer
    await secondProjectTab.click()
    await page.waitForTimeout(600)

    // Verificar se CaseDrawer abriu
    const drawerOpened = await page.evaluate(() => {
      return !!document.querySelector('[role="dialog"]')
    })
    console.log("CaseDrawer abriu com sucesso?", drawerOpened ? "SIM (OK)" : "NÃO (FALHA)")

    await page.screenshot({ path: "docs/projetos-case-drawer-open.png" })
    console.log("Salvo docs/projetos-case-drawer-open.png")

    // Testar botão CTA "Quero algo assim"
    const ctaBtn = page.locator('button:has-text("Quero algo assim")')
    if (await ctaBtn.count() > 0) {
      await ctaBtn.click()
      await page.waitForTimeout(1000)

      // Verificar se rolou até o contato e pré-selecionou
      const selectedInterest = await page.evaluate(() => {
        const trigger = document.getElementById("projectType")
        return trigger ? trigger.textContent?.trim() : null
      })
      console.log("Área de interesse pré-selecionada no formulário de contato:", selectedInterest)
    }
  }

  // 6. Teste Mobile (375x812)
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } })
  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" })
  await mobilePage.waitForTimeout(1500)

  const mobileProjects = mobilePage.locator("#projetos")
  await mobileProjects.scrollIntoViewIfNeeded()
  await mobilePage.waitForTimeout(600)

  await mobilePage.screenshot({ path: "docs/projetos-mobile-initial.png" })
  console.log("Salvo docs/projetos-mobile-initial.png")

  // Testar clique em card mobile
  const mobileFirstCard = mobilePage.locator('#projetos [class*="snap-start"]').first()
  await mobileFirstCard.click()
  await mobilePage.waitForTimeout(600)
  await mobilePage.screenshot({ path: "docs/projetos-mobile-drawer.png" })
  console.log("Salvo docs/projetos-mobile-drawer.png")

  await browser.close()
  console.log("=== QA CONCLUÍDO COM SUCESSO ===")
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
