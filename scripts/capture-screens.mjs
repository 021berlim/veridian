import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, "..")

const TARGETS = [
  {
    slug: "erp-multiusuario",
    device: "laptop",
    width: 1920,
    height: 1200,
    dest: "public/projects/erp-multiusuario/screen-laptop.png",
  },
  {
    slug: "erp-multiusuario",
    device: "phone",
    width: 1170,
    height: 2532,
    dest: "public/projects/erp-multiusuario/screen-phone.png",
  },
  {
    slug: "e-ppgfil",
    device: "laptop",
    width: 1920,
    height: 1200,
    dest: "public/projects/e-ppgfil/screen-laptop.png",
  },
  {
    slug: "e-ppgfil",
    device: "phone",
    width: 1170,
    height: 2532,
    dest: "public/projects/e-ppgfil/screen-phone.png",
  },
  {
    slug: "fila-cadunico",
    device: "phone",
    width: 1170,
    height: 2532,
    dest: "public/projects/fila-cadunico/screen-phone.png",
  },
  {
    slug: "cortana",
    device: "laptop",
    width: 1920,
    height: 1200,
    dest: "public/projects/cortana/screen-laptop.png",
  },
  {
    slug: "cortana",
    device: "phone",
    width: 1170,
    height: 2532,
    dest: "public/projects/cortana/screen-phone.png",
  },
]

async function capture() {
  console.log("Iniciando captura de telas com Playwright...")
  const browser = await chromium.launch({ headless: true })

  for (const t of TARGETS) {
    const url = `http://localhost:3000/dev/screens/${t.slug}/${t.device}`
    const fullDest = path.join(ROOT, t.dest)
    fs.mkdirSync(path.dirname(fullDest), { recursive: true })

    const page = await browser.newPage({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: 1,
    })

    console.log(`Capturando ${t.slug} (${t.device}) -> ${t.dest}...`)
    await page.goto(url, { waitUntil: "networkidle" })
    await page.waitForTimeout(500)

    await page.screenshot({
      path: fullDest,
      type: "png",
      clip: { x: 0, y: 0, width: t.width, height: t.height },
    })

    await page.close()
  }

  await browser.close()
  console.log("Todas as telas foram capturadas com sucesso!")
}

capture().catch((err) => {
  console.error("Erro na captura de telas:", err)
  process.exit(1)
})
