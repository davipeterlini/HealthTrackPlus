import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BADGE_SIZES, BADGE_VARIANTS } from "@/config/components/badge"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--badge-border-radius)] border text-[var(--badge-font-size)] font-[var(--badge-font-weight)] transition-colors focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[rgb(var(--focus-ring-color))] focus:ring-offset-[var(--focus-ring-offset)]",
  {
    variants: {
      variant: {
        default: BADGE_VARIANTS.default.base,
        secondary: BADGE_VARIANTS.secondary.base,
        destructive: BADGE_VARIANTS.destructive.base,
        outline: BADGE_VARIANTS.outline.base,
        success: BADGE_VARIANTS.success.base,
        warning: BADGE_VARIANTS.warning.base,
        info: BADGE_VARIANTS.info.base,
      },
      size: {
        sm: BADGE_SIZES.sm,
        default: BADGE_SIZES.md,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
      size?: "sm" | "default";
    }

const Badge = React.memo(function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
})

export { Badge, badgeVariants }
