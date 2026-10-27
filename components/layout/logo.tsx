import { cn } from "@/lib/utils"
import { ZuseFullLogo } from "@/components/ui/zuse-logo"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      role="img"
      aria-label="Zuse Labs"
      className={cn("inline-flex items-center gap-3 transition-opacity hover:opacity-80", className)}
    >
      <ZuseFullLogo className="h-6 w-auto sm:h-7" />
    </div>
  )
}
