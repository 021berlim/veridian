"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/data/site"

interface NavLinkProps {
  item: NavItem
  onNavigate: (href: string) => void
}

function NavLinkButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative shrink-0 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
    </button>
  )
}

export function NavLink({ item, onNavigate }: NavLinkProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  if (item.type === "link") {
    return <NavLinkButton label={item.label} onClick={() => onNavigate(item.href)} />
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-0.5"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLinkButton label={item.label} onClick={() => onNavigate(item.href)} />
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Mais opções em ${item.label}`}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-5 w-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
          open && "text-foreground",
        )}
      >
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 z-50 min-w-[10rem] -translate-x-1/2 pt-3">
          <div role="menu" className="border-y border-border/60 bg-background">
            {item.items.map((subItem) => (
              <button
                key={subItem.href}
                type="button"
                role="menuitem"
                onClick={() => {
                  onNavigate(subItem.href)
                  setOpen(false)
                }}
                className="group relative block w-full border-t border-border/60 px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors first:border-t-0 hover:text-foreground"
              >
                {subItem.label}
                <span className="absolute bottom-1.5 left-4 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}