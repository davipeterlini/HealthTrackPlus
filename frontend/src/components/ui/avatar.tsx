import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import { OptimizedImage } from "./optimized-image"

const Avatar = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-offset-background transition-shadow",
        className
      )}
      {...props}
    />
  ))
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & { src: string }
  >(({ className, src, alt = "", ...props }, ref) => {
    // Use our optimized image for avatar if there's a src
    if (src) {
      return (
        <OptimizedImage
          src={src}
          alt={alt}
          className={cn("aspect-square h-full w-full", className)}
          objectFit="cover"
          placeholderColor="#e2e8f0"
          loading="lazy"
        />
      );
    }
    
    // Fall back to the standard Radix component if no src
    return (
      <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        src={src}
        alt={alt}
        {...props}
      />
    );
  })
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
        className
      )}
      {...props}
    />
  ))
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
