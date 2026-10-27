import React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  as?: "div" | "section"
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, as: Tag = "div", ...props }, ref) => {
    return (
      <Tag ref={ref} className={cn("mx-auto w-full max-w-7xl px-6", className)} {...props}>
        {children}
      </Tag>
    )
  },
)

Container.displayName = "Container"
