"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { navItems } from "@/data/site"

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (href: string) => void
}

export function MobileMenu({ open, onOpenChange, onNavigate }: MobileMenuProps) {
  let animationIndex = 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-border/60 bg-background/90 backdrop-blur-xl sm:max-w-sm [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

        <div className="flex h-full flex-col pt-8">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>

          <nav className="mt-12 flex flex-col gap-8">
            <AnimatePresence>
              {open &&
                navItems.map((item) => {
                  const mainIndex = animationIndex++
                  return (
                    <div key={item.href} className="space-y-3">
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: mainIndex * 0.08, duration: 0.4 }}
                        onClick={() => onNavigate(item.href)}
                        className="text-left font-serif text-3xl text-foreground transition-opacity hover:opacity-60"
                      >
                        {item.label}
                      </motion.button>

                      {item.type === "group" && item.items.length > 0 && (
                        <div className="flex flex-col gap-2 border-l border-border/60 pl-4">
                          {item.items.map((subItem) => {
                            const subIndex = animationIndex++
                            return (
                              <motion.button
                                key={subItem.href}
                                type="button"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.08, duration: 0.4 }}
                                onClick={() => onNavigate(subItem.href)}
                                className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                              >
                                {subItem.label}
                              </motion.button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
            </AnimatePresence>
          </nav>

          <div className="mt-auto border-t border-border pt-8">
            <button
              type="button"
              onClick={() => onNavigate("#contato")}
              className="group flex w-full items-center justify-between rounded-full border border-foreground px-6 py-4 transition-colors hover:bg-foreground hover:text-primary-foreground"
            >
              <span className="text-sm font-medium">Iniciar projeto</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}