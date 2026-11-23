import { cn } from "@/lib/utils"
import { ZuseMonogram } from "@/components/ui/zuse-logo"

interface LogoProps {
  className?: string
  size?: "default" | "lg"
  showText?: boolean
}

export function Logo({ className, size = "default", showText = true }: LogoProps) {
  const isLarge = size === "lg"

  return (
    <div
      role="img"
      aria-label="Zuse Labs"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-85",
        isLarge ? "gap-3 sm:gap-3.5" : "gap-2.5 sm:gap-3",
        className,
      )}
    >
      <ZuseMonogram
        className={cn(
          "zuse-m-logo-svg w-auto shrink-0",
          isLarge ? "h-9 sm:h-10" : "h-8 sm:h-9",
        )}
      />
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span
            className={cn(
              "font-sans font-bold uppercase leading-[0.95] tracking-[0.12em] text-white antialiased",
              isLarge ? "text-[17px] sm:text-[19px]" : "text-[15px] sm:text-[17px]",
            )}
          >
            ZUSE
          </span>
          <span
            className={cn(
              "mt-[1px] text-right font-sans font-semibold uppercase leading-[0.95] tracking-[0.26em] text-[#c72c3b] antialiased",
              isLarge ? "text-[10.5px] sm:text-[11.5px]" : "text-[9.5px] sm:text-[10.5px]",
            )}
          >
            LABS
          </span>
        </div>
      )}
    </div>
  )
}
