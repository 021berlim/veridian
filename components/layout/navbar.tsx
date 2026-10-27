"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/data/site"
import { scrollToSection, scrollToTop } from "@/lib/scroll"
import { Logo } from "@/components/layout/logo"
import { NavLink } from "@/components/layout/nav-link"
import { MobileMenu } from "@/components/layout/mobile-menu"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    requestAnimationFrame(() => scrollToSection(href))
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-40 w-full transition-colors duration-300",
          isScrolled
            ? "border-b border-[#2b2d31] bg-[#0b0b0d]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div id="navbar-logo-slot" className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center text-left transition-opacity hover:opacity-80"
              aria-label="Voltar ao início"
            >
              <Logo />
            </button>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={handleNavClick} />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavClick("#contato")}
              className="group hidden items-center gap-2 border border-[#2b2d31] bg-transparent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-white transition-all hover:border-[#c72c3b] hover:bg-[#c72c3b] md:inline-flex"
            >
              <span>Iniciar conversa</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-[#2b2d31] text-white transition-colors hover:border-white md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} onNavigate={handleNavClick} />
    </>
  )
}
