import Link from "next/link"
import { Instagram, Linkedin, Mail } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Logo } from "@/components/layout/logo"
import { siteConfig } from "@/data/site"

const socialIconMap = {
  Instagram,
  LinkedIn: Linkedin,
  Email: Mail,
} as const

const socialLinks = [
  ...siteConfig.socialLinks.map((link) => ({
    href: link.url,
    label: link.label,
    icon: socialIconMap[link.label as keyof typeof socialIconMap],
  })),
  {
    href: `mailto:${siteConfig.contact.email}`,
    label: "Email",
    icon: Mail,
  },
] as const

export function Footer() {
  return (
    <footer className="bg-background py-8 md:py-6">
      <Container>
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:gap-4">
          <Link
            href="/"
            className="flex shrink-0 justify-center transition-opacity hover:opacity-70 md:w-1/3 md:justify-start"
          >
            <Logo />
          </Link>

          <p className="text-center text-xs text-muted-foreground md:w-1/3">
            Copyright © 2020-2026, Veridian Capital. Todos os direitos reservados.
          </p>

          <div className="flex items-center justify-center gap-5 md:w-1/3 md:justify-end">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}