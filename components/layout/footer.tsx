import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Logo } from "@/components/layout/logo"
import { siteConfig } from "@/data/site"

const footerSections = [
  {
    title: "Navegação",
    links: [
      { label: "Início", href: "#hero" },
      { label: "Tecnologias", href: "#tecnologias" },
      { label: "Projetos", href: "#projetos" },
      { label: "Método", href: "#processo" },
      { label: "Serviços", href: "#servicos" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { label: "Software sob medida", href: "#servicos" },
      { label: "Suporte e Manutenção", href: "#servicos" },
      { label: "Cibersegurança", href: "#servicos" },
      { label: "Inteligência Artificial", href: "#servicos" },
    ],
  },
  {
    title: "Presença",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/zuse-labs" },
      { label: "GitHub", href: "https://github.com/zuselabs" },
      { label: "Contato", href: "#contato" },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="bg-[#0b0b0d] py-16 text-white sm:py-20">
      <Container>
        <div className="grid gap-12 border-b border-[#2b2d31] pb-16 lg:grid-cols-12 lg:gap-16">
          {/* Coluna Principal da Marca */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo />
            </Link>
            <p className="mt-6 max-w-sm text-sm font-normal leading-relaxed text-[#8a8f98]">
              {siteConfig.description}
            </p>
          </div>

          {/* Colunas de Links Textuais Limpos */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerSections.map((section) => (
              <div key={section.title}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                  {section.title}
                </span>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm font-light text-[#8a8f98] transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Linha Inferior com Copyright Limpo */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs font-mono text-[#8a8f98] sm:flex-row sm:items-center">
          <p>© 2026 Zuse Labs. Todos os direitos reservados.</p>
          <p className="text-[10px] uppercase tracking-wider text-[#4b5563]">
            Engenharia de software com precisão cinematográfica
          </p>
        </div>
      </Container>
    </footer>
  )
}
