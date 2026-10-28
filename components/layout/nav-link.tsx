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
        "group relative shrink-0 whitespace-nowrap font-sans text-xs font-medium uppercase tracking-[0.06em] text-[#8a8f98] transition-colors hover:text-white",
        className,
      )}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#c72c3b] transition-all duration-300 group-hover:w-full" />
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
          "flex h-5 w-5 items-center justify-center text-[#8a8f98] transition-colors hover:text-white",
          open && "text-white",
        )}
      >
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 z-50 min-w-[12rem] -translate-x-1/2 pt-3">
          <div
            role="menu"
            className="overflow-hidden rounded-xl border border-white/10 bg-[#141416] py-1 shadow-2xl"
          >
            {item.items.map((subItem) => (
              <button
                key={subItem.href}
                type="button"
                role="menuitem"
                onClick={() => {
                  onNavigate(subItem.href)
                  setOpen(false)
                }}
                className="group relative block w-full px-4 py-2.5 text-left font-sans text-xs tracking-wide text-[#8a8f98] transition-colors hover:bg-white/5 hover:text-white"
              >
                {subItem.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
