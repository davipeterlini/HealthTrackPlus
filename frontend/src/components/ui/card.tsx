import * as React from "react"

import { cn } from "@/lib/utils"
import { CARD_VARIANTS, CARD_SIZES, CARD_ELEMENTS } from "@/config/components/card"

// Interfaces para tipos de cards
type CardVariant = 'default' | 'small' | 'flat' | 'outline'; 
type CardSize = 'default' | 'small' | 'large';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
      // Configuração de classes baseadas nas variantes
      const variantClasses = {
        default: CARD_VARIANTS.default.base,
        small: CARD_VARIANTS.small.base,
        flat: CARD_VARIANTS.flat.base,
        outline: CARD_VARIANTS.outline.base,
      };
      
      // Configuração de classes baseadas no tamanho
      const sizeClasses = {
        default: CARD_SIZES.default,
        small: CARD_SIZES.small,
        large: CARD_SIZES.large
      };
      
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-[var(--card-border-radius)] transition-all duration-[var(--transition-normal)] ease-[var(--transition-ease)]",
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          {...props}
        />
      );
    }
  )
);
Card.displayName = "Card"

const CardHeader = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(CARD_ELEMENTS.header, className)}
      {...props}
    />
  ))
);
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      CARD_ELEMENTS.title,
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(CARD_ELEMENTS.description, className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div ref={ref} className={cn(CARD_ELEMENTS.content, className)} {...props} />
  ))
);
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(CARD_ELEMENTS.footer, className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
