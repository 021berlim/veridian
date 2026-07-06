import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Logotipo Veridian Capital"
      className={cn(
        "inline-flex flex-col items-center text-center font-serif text-[11px] font-normal uppercase leading-none tracking-[0.2em] text-foreground sm:text-[13px] sm:tracking-[0.22em]",
        className,
      )}
    >
      <span>Veridian</span>
      <span className="mt-[4px] text-[10px] tracking-[0.18em] sm:text-[11px] sm:tracking-[0.2em]">
        Capital
      </span>
    </span>
  )
}