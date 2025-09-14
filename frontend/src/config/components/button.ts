/**
 * Button component configuration
 * 
 * This file contains configuration for button components,
 * including sizes, variants, and styling options.
 */

export const BUTTON_CONFIG = {
  // Button heights for different sizes
  height: {
    xs: '24px',     // Extra small buttons
    sm: '32px',     // Small buttons
    md: '40px',     // Medium buttons (default)
    lg: '48px',     // Large buttons
    xl: '56px',     // Extra large buttons
  },
  
  // Button padding for different sizes
  padding: {
    xs: '0.5rem 0.75rem',    // Extra small padding
    sm: '0.5rem 1rem',       // Small padding
    md: '0.625rem 1.25rem',  // Medium padding (default)
    lg: '0.75rem 1.5rem',    // Large padding
    xl: '1rem 2rem',         // Extra large padding
  },
  
  // Button font sizes
  fontSize: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    md: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
  },
  
  // Button border radius
  borderRadius: 'var(--radius-md)',
  
  // Button font weight
  fontWeight: 'var(--font-medium)',
  
  // Button transitions
  transition: 'background-color var(--transition-normal) var(--transition-ease), border-color var(--transition-normal) var(--transition-ease), color var(--transition-normal) var(--transition-ease), transform var(--transition-fast) var(--transition-ease)',
  
  // Button hover transform effect
  hoverTransform: 'translateY(-1px)',
  
  // Button active transform effect
  activeTransform: 'translateY(0px)',
};

// Button variants and their styling
export const BUTTON_VARIANTS = {
  default: {
    base: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm hover:shadow',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  destructive: {
    base: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  outline: {
    base: 'border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/5',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  secondary: {
    base: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  ghost: {
    base: 'hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/5',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  link: {
    base: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
    disabled: 'opacity-50 cursor-not-allowed',
  },
};

// Button sizes and their styling
export const BUTTON_SIZES = {
  xs: `h-[var(--button-height-xs)] px-2.5 py-1 text-xs`,
  sm: `h-[var(--button-height-sm)] px-3 py-1.5 text-sm`,
  md: `h-[var(--button-height-md)] px-4 py-2 text-sm`,
  lg: `h-[var(--button-height-lg)] px-5 py-2.5 text-base`,
  xl: `h-[var(--button-height-xl)] px-6 py-3 text-lg`,
  icon: `h-[var(--button-height-md)] w-[var(--button-height-md)] p-2`,
};