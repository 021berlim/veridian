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
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    scrollToSection(href)
    setMobileOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 sm:px-6">
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-2xl border px-8 py-4 transition-all duration-300 sm:px-10 sm:py-5",
            isScrolled
              ? "border-border/80 bg-background/75 shadow-sm backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex shrink-0 items-center py-0.5 pl-0.5 pr-2 sm:pr-3"
            >
              <Logo />
            </button>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex lg:gap-8">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} onNavigate={handleNavClick} />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavClick("#contato")}
                className="group relative hidden items-center gap-0 overflow-hidden rounded-full border border-border py-1 pr-1 pl-5 transition-all duration-300 md:flex"
              >
                <span className="absolute inset-0 origin-right scale-x-0 rounded-full bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
                <span className="relative z-10 pr-3 text-sm transition-colors duration-300 group-hover:text-primary-foreground">
                  Iniciar projeto
                </span>
                <span className="relative z-10 flex h-8 w-8 items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} onNavigate={handleNavClick} />
    </>
  )
}