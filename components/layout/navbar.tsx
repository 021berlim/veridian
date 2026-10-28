"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/data/site"
import { scrollToSection, scrollToTop } from "@/lib/scroll"
import { Logo } from "@/components/layout/logo"
import { NavLink } from "@/components/layout/nav-link"
import { MobileMenu } from "@/components/layout/mobile-menu"

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasLogoInSlot, setHasLogoInSlot] = useState(false)

  // Medição com ResizeObserver de --header-h em :root
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateHeight = () => {
      const rect = header.getBoundingClientRect()
      const totalH = Math.round(rect.bottom)
      document.documentElement.style.setProperty("--header-h", `${totalH}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    window.addEventListener("resize", updateHeight, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  // Listener para estado de scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Listener para saber se o logo pousou no slot vindo da intro
  useEffect(() => {
    const handleIntroComplete = () => {
      setHasLogoInSlot(true)
    }

    const introState = document.documentElement.dataset.introState
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (introState === "done" || prefersReduced) {
      setHasLogoInSlot(true)
    }

    window.addEventListener("intro-complete", handleIntroComplete)

    return () => {
      window.removeEventListener("intro-complete", handleIntroComplete)
    }
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    requestAnimationFrame(() => scrollToSection(href))
  }

  return (
    <>
      <header
        ref={headerRef}
        id="zuse-main-header"
        className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 sm:px-6 transition-all duration-300"
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-2xl border px-6 py-3.5 transition-all duration-300 sm:px-10 sm:py-4",
            isScrolled
              ? "border-white/[0.08] bg-[#141416] shadow-2xl"
              : "border-transparent bg-transparent shadow-none",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Slot de destino da Logo no Header (Contrato A2/A3) */}
            <div
              id="zuse-header-logo-slot"
              className="flex h-9 w-auto min-w-[140px] shrink-0 items-center py-0.5 sm:min-w-[170px]"
            >
              {hasLogoInSlot && (
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="group flex items-center transition-opacity hover:opacity-80"
                  aria-label="Voltar ao início"
                >
                  <Logo />
                </button>
              )}
            </div>

            {/* Links Centrais com Dropdowns */}
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex lg:gap-8">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} onNavigate={handleNavClick} />
              ))}
            </nav>

            {/* Ações à Direita: CTA Pílula e Botão Mobile */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavClick("#contato")}
                className="group relative hidden items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] py-1 pr-1 pl-5 transition-all duration-300 hover:border-[#c72c3b] md:flex"
              >
                <span className="absolute inset-0 origin-right scale-x-0 rounded-full bg-[#c72c3b] transition-transform duration-300 group-hover:scale-x-100" />
                <span className="relative z-10 pr-3 font-sans text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors duration-300">
                  Iniciar projeto
                </span>
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-black/20">
                  <ArrowRight className="h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white hover:bg-white/5 md:hidden"
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
