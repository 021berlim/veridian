import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import pngToIco from "png-to-ico"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const LOGO_DIR = "C:/Users/Administrator/Downloads/Logos Veridian"
const MONOGRAM = path.join(LOGO_DIR, "Monograma Veridian Capital.svg")
const LOGOTIPO = path.join(LOGO_DIR, "Logotipo Veridian Capital.svg")
const BANNER = path.join(LOGO_DIR, "banner-veridian.svg")
const PUBLIC = path.join(ROOT, "public")
const APP = path.join(ROOT, "app")
const BRAND_DIR = path.join(PUBLIC, "images", "brand")

const BRAND_BG = { r: 245, g: 243, b: 239, alpha: 1 }

const FAVICON_OPTIONS = {
  transparent: true,
  paddingRatio: 0.02,
  color: "#ffffff",
}

async function ensureDirs() {
  await fs.mkdir(BRAND_DIR, { recursive: true })
}

async function copyLogos() {
  await fs.copyFile(MONOGRAM, path.join(BRAND_DIR, "monograma.svg"))
  await fs.copyFile(LOGOTIPO, path.join(BRAND_DIR, "logotipo.svg"))
  await fs.copyFile(BANNER, path.join(BRAND_DIR, "banner.svg"))
}

async function loadMonogramBuffer({ color } = {}) {
  if (!color) {
    return MONOGRAM
  }

  const svg = await fs.readFile(MONOGRAM, "utf-8")
  const tinted = svg.replace(/fill="#[^"]+"/g, `fill="${color}"`)
  return Buffer.from(tinted)
}

async function renderMonogram(size, { paddingRatio = 0.18, color } = {}) {
  const padding = Math.round(size * paddingRatio)
  const logoSize = size - padding * 2
  const monogram = await loadMonogramBuffer({ color })

  return sharp(monogram)
    .resize(logoSize * 4, logoSize * 4, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .trim()
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}

async function renderIcon(size, { transparent = false, paddingRatio = 0.18, color } = {}) {
  const logo = await renderMonogram(size, { paddingRatio, color })

  if (transparent) {
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: logo, gravity: "center" }])
      .png()
      .toBuffer()
  }

  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .png()
    .toBuffer()

  return sharp(background).composite([{ input: logo, gravity: "center" }]).png().toBuffer()
}

async function writeIcon(size, publicName, appName, options) {
  const buffer = await renderIcon(size, options)
  if (publicName) {
    await fs.writeFile(path.join(PUBLIC, publicName), buffer)
  }
  if (appName) {
    await fs.writeFile(path.join(APP, appName), buffer)
  }
}

async function generateFavicon() {
  const tempDir = path.join(ROOT, ".tmp-icons")
  await fs.mkdir(tempDir, { recursive: true })

  const sizes = [16, 32, 48]
  const pngPaths = []

  for (const size of sizes) {
    const filePath = path.join(tempDir, `favicon-${size}.png`)
    await fs.writeFile(filePath, await renderIcon(size, FAVICON_OPTIONS))
    pngPaths.push(filePath)
  }

  const ico = await pngToIco(pngPaths)
  await fs.writeFile(path.join(PUBLIC, "favicon.ico"), ico)
  await fs.writeFile(path.join(APP, "favicon.ico"), ico)
  await fs.rm(tempDir, { recursive: true, force: true })
}

async function generateOgImage() {
  const width = 1200
  const height = 630

  const og = await sharp(BANNER)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
      background: BRAND_BG,
    })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer()

  await fs.writeFile(path.join(PUBLIC, "og-image.png"), og)
  await fs.writeFile(path.join(APP, "opengraph-image.png"), og)
  await fs.writeFile(path.join(APP, "twitter-image.png"), og)
}

async function main() {
  await ensureDirs()
  await copyLogos()
  await generateFavicon()
  await writeIcon(32, null, "icon.png", FAVICON_OPTIONS)
  await writeIcon(180, "apple-touch-icon.png", "apple-icon.png")
  await writeIcon(192, "icon-192.png", null)
  await writeIcon(512, "icon-512.png", null)
  await generateOgImage()
  console.log("Brand assets generated successfully.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})