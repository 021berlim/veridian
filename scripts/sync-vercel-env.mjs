import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const envFile = readFileSync(resolve(root, ".env"), "utf8")

function readVar(name) {
  const match = envFile.match(new RegExp(`^${name}=(.+)$`, "m"))
  return match?.[1]?.trim()
}

const vars = [
  { name: "OPENROUTER_API_KEY", sensitiveEnvs: new Set(["production", "preview"]) },
  { name: "NEXT_PUBLIC_SITE_URL", sensitiveEnvs: new Set() },
]

const environments = ["production", "preview", "development"]

for (const { name, sensitiveEnvs } of vars) {
  const value = readVar(name)

  if (!value) {
    console.error(`Variável ausente no .env: ${name}`)
    process.exit(1)
  }

  for (const environment of environments) {
    const sensitiveFlag = sensitiveEnvs.has(environment)
      ? "--sensitive"
      : "--no-sensitive"

    console.log(`Adicionando ${name} em ${environment}...`)

    execSync(
      `npx vercel env add ${name} ${environment} --yes --force ${sensitiveFlag} --non-interactive`,
      {
        cwd: root,
        input: value,
        stdio: ["pipe", "inherit", "inherit"],
      },
    )
  }
}

console.log("\nVariáveis sincronizadas com a Vercel.")