"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ChevronDown, X } from "lucide-react"
import { useLenis } from "lenis/react"
import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"
import { navItems } from "@/data/site"
import type { NavItem } from "@/data/site"
import { scrollToTop } from "@/lib/scroll"

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (href: string) => void
}

const menuEase = [0.22, 1, 0.36, 1] as const
const MENU_ROW_WIDTH = "w-full max-w-[17rem]"

const menuItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: menuEase },
  },
}

const menuStaggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

function MobileNavItem({
  item,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavItem
  expanded: boolean
  onToggle: () => void
  onNavigate: (href: string) => void
}) {
  const isGroup = item.type === "group" && item.items.length > 0

  if (!isGroup) {
    return (
      <div className={cn(MENU_ROW_WIDTH, "flex justify-center")}>
        <button
          type="button"
          onClick={() => onNavigate(item.href)}
          className="text-2xl font-light tracking-tight text-white transition-opacity hover:opacity-70"
        >
          {item.label}
        </button>
      </div>
    )
  }

  return (
    <div className={cn(MENU_ROW_WIDTH, "flex flex-col items-center")}>
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div aria-hidden="true" />

        <button
          type="button"
          onClick={() => onNavigate(item.href)}
          className="justify-self-center text-2xl font-light tracking-tight text-white transition-opacity hover:opacity-70"
        >
          {item.label}
        </button>

        <button
          type="button"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Recolher" : "Expandir"} ${item.label}`}
          onClick={onToggle}
          className="justify-self-end flex h-8 w-8 shrink-0 items-center justify-center border border-[#2b2d31] text-muted-foreground transition-colors hover:text-white"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-300", expanded && "rotate-180")}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: menuEase }}
            className="w-full overflow-hidden"
          >
            <div className="mt-3 w-full border-t border-[#2b2d31] pt-2">
              {item.items.map((subItem) => (
                <button
                  key={subItem.href}
                  type="button"
                  onClick={() => onNavigate(subItem.href)}
                  className="flex w-full items-center justify-center gap-2 py-2.5 text-sm tracking-wide text-muted-foreground transition-colors hover:text-white"
                >
                  {subItem.label}
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MobileMenu({ open, onOpenChange, onNavigate }: MobileMenuProps) {
  const lenis = useLenis()
  const [expandedHref, setExpandedHref] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setExpandedHref(null)
      return
    }

    const lenisFrame = requestAnimationFrame(() => lenis?.stop())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      cancelAnimationFrame(lenisFrame)
      document.removeEventListener("keydown", onKeyDown)
      lenis?.start()
    }
  }, [open, lenis, onOpenChange])

  const handleLogoClick = () => {
    onOpenChange(false)
    requestAnimationFrame(() => scrollToTop())
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: menuEase }}
          className="fixed inset-0 z-[100] bg-[#0b0b0d] md:hidden"
        >
          <div className="relative z-10 flex h-full flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar menu"
              className="absolute top-[max(1.25rem,env(safe-area-inset-top))] right-6 z-10 flex h-10 w-10 items-center justify-center border border-[#2b2d31] text-white transition-colors hover:border-white"
            >
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>

            <div className="flex min-h-0 flex-1 items-center justify-center">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuStaggerVariants}
                className="vera-scrollbar flex max-h-full w-full flex-col items-center overflow-y-auto py-6"
              >
                <motion.button
                  type="button"
                  variants={menuItemVariants}
                  onClick={handleLogoClick}
                  className="mb-10 py-1"
                  aria-label="Voltar ao início"
                >
                  <Logo />
                </motion.button>

                <motion.nav
                  aria-label="Seções"
                  variants={menuStaggerVariants}
                  className="flex w-full flex-col items-center gap-7"
                >
                  {navItems.map((item) => (
                    <motion.div
                      key={item.href}
                      variants={menuItemVariants}
                      className={cn(MENU_ROW_WIDTH, "overflow-visible")}
                    >
                      <MobileNavItem
                        item={item}
                        expanded={expandedHref === item.href}
                        onToggle={() =>
                          setExpandedHref((current) =>
                            current === item.href ? null : item.href,
                          )
                        }
                        onNavigate={onNavigate}
                      />
                    </motion.div>
                  ))}
                </motion.nav>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{
                delay: 0.1 + navItems.length * 0.08,
                duration: 0.38,
                ease: menuEase,
              }}
              className="flex shrink-0 justify-center pt-4"
            >
              <button
                type="button"
                onClick={() => onNavigate("#contato")}
                className="flex w-full max-w-xs items-center justify-center gap-2 border border-[#2b2d31] bg-[#c72c3b] py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-all hover:bg-[#a6222f]"
              >
                <span>Iniciar conversa</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
