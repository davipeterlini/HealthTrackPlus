import * as React from "react"

import { cn } from "@/lib/utils"

// Interfaces para tipos de cards
type CardVariant = 'default' | 'small' | 'flat' | 'outline'; 
type CardSize = 'default' | 'small' | 'large';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    // Configuração de classes baseadas nas variantes
    const variantClasses = {
      default: "border bg-card text-card-foreground shadow-sm",
      small: "border bg-card text-card-foreground shadow-xs",
      flat: "bg-card/70 text-card-foreground",
      outline: "border bg-transparent text-card-foreground",
    };
    
    // Configuração de classes baseadas no tamanho
    const sizeClasses = {
      default: "responsive-card",
      small: "responsive-card-sm",
      large: "responsive-p"
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg responsive-transition responsive-border",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col responsive-gap-xs responsive-card-header", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "responsive-title-md font-semibold tracking-tight",
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
    className={cn("responsive-text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("responsive-card-content", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between responsive-mt-xs", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
