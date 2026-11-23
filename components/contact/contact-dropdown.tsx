"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DropdownOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface SingleDropdownProps {
  id: string
  label: string
  optional?: boolean
  placeholder: string
  value: string
  options: readonly DropdownOption[]
  leadingIcon?: React.ReactNode
  error?: string
  onChange: (value: string) => void
}

export function SingleDropdown({
  id,
  label,
  optional,
  placeholder,
  value,
  options,
  leadingIcon,
  error,
  onChange,
}: SingleDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const selected = options.find((opt) => opt.value === value)

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8f98]"
      >
        {label}
        {optional && <span className="ml-1.5 text-[#525660]">· opcional</span>}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "mt-2 flex w-full items-center justify-between gap-3 rounded-xl border bg-[#141416] px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none",
          error
            ? "border-[#c72c3b]"
            : open
              ? "border-white/25 bg-[#17171a]"
              : "border-white/[0.08] hover:border-white/20",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {(selected?.icon ?? leadingIcon) && (
            <span
              className={cn(
                "shrink-0 transition-colors",
                selected ? "text-[#c72c3b]" : "text-[#6b7280]",
              )}
            >
              {selected?.icon ?? leadingIcon}
            </span>
          )}
          <span className={cn("truncate", selected ? "text-white" : "text-[#6b7280]")}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#6b7280] transition-transform duration-200",
            open && "rotate-180 text-white",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-40 mt-2 overflow-hidden divide-y divide-white/[0.04] rounded-xl border border-white/10 bg-[#141416] shadow-2xl"
          >
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(optional && isSelected ? "" : option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-[#c72c3b]/[0.08] text-white"
                        : "text-[#c9cdd4] hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {option.icon && (
                        <span
                          className={cn(
                            "shrink-0",
                            isSelected ? "text-[#c72c3b]" : "text-[#8a8f98]",
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-normal">{option.label}</span>
                        {option.description && (
                          <span className="block truncate text-[11px] text-[#6b7280]">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#c72c3b]" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-xs text-[#f87171]">{error}</p>}
    </div>
  )
}

interface MultiDropdownProps {
  id: string
  label: string
  placeholder: string
  values: string[]
  options: readonly DropdownOption[]
  leadingIcon?: React.ReactNode
  error?: string
  onToggle: (value: string) => void
}

function formatMultiLabel(
  selected: DropdownOption[],
  total: number,
  placeholder: string,
): string {
  if (selected.length === 0) return placeholder
  if (selected.length === total) return "Todas as frentes selecionadas"
  if (selected.length <= 2) return selected.map((o) => o.label).join(", ")
  return `${selected[0].label}, ${selected[1].label} +${selected.length - 2}`
}

export function MultiDropdown({
  id,
  label,
  placeholder,
  values,
  options,
  leadingIcon,
  error,
  onToggle,
}: MultiDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const selectedOptions = options.filter((opt) => values.includes(opt.value))
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8f98]"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "mt-2 flex w-full items-center justify-between gap-3 rounded-xl border bg-[#141416] px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none",
          error
            ? "border-[#c72c3b]"
            : open
              ? "border-white/25 bg-[#17171a]"
              : "border-white/[0.08] hover:border-white/20",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {leadingIcon && (
            <span
              className={cn(
                "shrink-0 transition-colors",
                selectedOptions.length > 0 ? "text-[#c72c3b]" : "text-[#6b7280]",
              )}
            >
              {leadingIcon}
            </span>
          )}
          <span
            className={cn(
              "truncate",
              selectedOptions.length > 0 ? "text-white" : "text-[#6b7280]",
            )}
          >
            {formatMultiLabel(selectedOptions, options.length, placeholder)}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2.5">
          {selectedOptions.length > 0 && (
            <span className="inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] tabular-nums tracking-wider">
              <span className="text-[#c72c3b]">{pad(selectedOptions.length)}</span>
              <span className="text-[#525660]">/{pad(options.length)}</span>
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[#6b7280] transition-transform duration-200",
              open && "rotate-180 text-white",
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-multiselectable="true"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-40 mt-2 overflow-hidden divide-y divide-white/[0.04] rounded-xl border border-white/10 bg-[#141416] shadow-2xl"
          >
            {options.map((option) => {
              const isSelected = values.includes(option.value)
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => onToggle(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-[#c72c3b]/[0.08] text-white"
                        : "text-[#c9cdd4] hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {option.icon && (
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            isSelected ? "text-[#c72c3b]" : "text-[#8a8f98]",
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-normal">{option.label}</span>
                        {option.description && (
                          <span className="block truncate text-[11px] text-[#6b7280]">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                        isSelected
                          ? "border-[#c72c3b] bg-[#c72c3b] text-white"
                          : "border-white/15 bg-transparent",
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                    </span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-xs text-[#f87171]">{error}</p>}
    </div>
  )
}
