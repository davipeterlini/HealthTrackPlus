import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BUTTON_SIZES, BUTTON_VARIANTS } from "@/config/components/button"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-border-radius)] text-sm font-[var(--button-font-weight)] transition-all duration-[var(--transition-normal)] ease-[var(--transition-ease)] focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[rgb(var(--focus-ring-color))] focus-visible:ring-offset-[var(--focus-ring-offset)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:translate-y-[var(--button-hover-transform)] active:translate-y-[var(--button-active-transform)]",
  {
    variants: {
      variant: {
        default: BUTTON_VARIANTS.default.base,
        destructive: BUTTON_VARIANTS.destructive.base,
        outline: BUTTON_VARIANTS.outline.base,
        secondary: BUTTON_VARIANTS.secondary.base,
        ghost: BUTTON_VARIANTS.ghost.base,
        link: BUTTON_VARIANTS.link.base,
      },
      size: {
        xs: BUTTON_SIZES.xs,
        sm: BUTTON_SIZES.sm,
        default: BUTTON_SIZES.md,
        lg: BUTTON_SIZES.lg,
        xl: BUTTON_SIZES.xl,
        icon: BUTTON_SIZES.icon,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
