/**
 * Badge component configuration
 * 
 * This file contains configuration for badge components,
 * including variants, sizes, and styling options.
 */

export const BADGE_CONFIG = {
  // Badge border radius - pill shaped by default
  borderRadius: 'var(--radius-full)',
  
  // Badge font size
  fontSize: 'var(--text-xs)',
  
  // Badge font weight
  fontWeight: 'var(--font-medium)',
  
  // Badge padding sizes
  padding: {
    sm: '0.125rem 0.5rem',   // Small badge padding
    md: '0.25rem 0.625rem',  // Medium badge padding
  },
  
  // Badge transition
  transition: 'all var(--transition-normal) var(--transition-ease)',
};

// Badge variants and their styling
export const BADGE_VARIANTS = {
  default: {
    base: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  },
  secondary: {
    base: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  },
  destructive: {
    base: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  },
  outline: {
    base: 'text-foreground border-current',
  },
  success: {
    base: 'border-transparent bg-[rgb(var(--color-success-500))] text-white hover:bg-[rgb(var(--color-success-600))]',
  },
  warning: {
    base: 'border-transparent bg-[rgb(var(--color-warning-500))] text-white hover:bg-[rgb(var(--color-warning-600))]',
  },
  info: {
    base: 'border-transparent bg-[rgb(var(--color-info-500))] text-white hover:bg-[rgb(var(--color-info-600))]',
  },
};

// Badge sizes and their styling
export const BADGE_SIZES = {
  sm: 'px-[var(--badge-padding-sm)] py-0.5 text-xs',
  md: 'px-[var(--badge-padding-md)] py-1 text-xs',
};