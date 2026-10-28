import sharp from "sharp"
import fs from "fs"
import path from "path"

function createIcoFromPngs(pngBuffers) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngBuffers.length, 4)

  let offset = 6 + 16 * pngBuffers.length
  const dirEntries = []

  for (const { buffer, width, height } of pngBuffers) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(width >= 256 ? 0 : width, 0)
    entry.writeUInt8(height >= 256 ? 0 : height, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(buffer.length, 8)
    entry.writeUInt32LE(offset, 12)
    dirEntries.push(entry)
    offset += buffer.length
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)])
}

async function generateFavicons() {
  console.log("=== GERANDO ÍCONES ZUSE LABS (Z MONOGRAMA) ===")

  const monoSvgPath = path.resolve(process.cwd(), "public/LOGOS-ZUSELABS/zuse-monograma.svg")
  const monoSvgContent = fs.readFileSync(monoSvgPath, "utf-8")

  // Extrair o conteúdo interno do SVG do monograma
  const innerMatch = monoSvgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  const innerContent = innerMatch ? innerMatch[1] : monoSvgContent

  // 1. Criar o SVG mestre de 512x512 com fundo escuro #0b0b0d e o monograma Z perfeitamente centralizado
  // No monograma original: viewBox="0 0 1500 1500". Escala 0.26 => 390px centralizado em 512px (offset = (512 - 390)/2 = 61px)
  const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#0b0b0d"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="#2b2d31" stroke-width="4"/>
  <g transform="matrix(0.26, 0, 0, 0.26, 61, 61)">
    ${innerContent}
  </g>
</svg>`

  // Salvar SVG principal
  fs.writeFileSync("public/icon.svg", masterSvg)
  fs.writeFileSync("app/icon.svg", masterSvg)
  console.log("Criado public/icon.svg e app/icon.svg")

  const svgBuffer = Buffer.from(masterSvg)

  // 2. Gerar PNGs em múltiplos tamanhos
  const sizes = [
    { name: "public/icon-512.png", size: 512 },
    { name: "public/icon-192.png", size: 192 },
    { name: "public/apple-icon.png", size: 180 },
    { name: "public/apple-touch-icon.png", size: 180 },
    { name: "app/apple-icon.png", size: 180 },
    { name: "public/icon-dark-32x32.png", size: 32 },
    { name: "public/icon-light-32x32.png", size: 32 },
    { name: "app/icon.png", size: 32 },
  ]

  for (const { name, size } of sizes) {
    await sharp(svgBuffer).resize(size, size).png().toFile(name)
    console.log(`Gerado ${name} (${size}x${size})`)
  }

  // 3. Gerar favicon.ico multi-resolução (16x16, 32x32, 48x48)
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer()
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer()
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer()

  const icoBuffer = createIcoFromPngs([
    { buffer: p16, width: 16, height: 16 },
    { buffer: p32, width: 32, height: 32 },
    { buffer: p48, width: 48, height: 48 },
  ])

  fs.writeFileSync("public/favicon.ico", icoBuffer)
  fs.writeFileSync("app/favicon.ico", icoBuffer)
  console.log("Gerado public/favicon.ico e app/favicon.ico (16, 32, 48)")

  console.log("=== TODOS OS ÍCONES DO HTML FORAM ATUALIZADOS COM SUCESSO! ===")
}

generateFavicons().catch((err) => {
  console.error(err)
  process.exit(1)
})
