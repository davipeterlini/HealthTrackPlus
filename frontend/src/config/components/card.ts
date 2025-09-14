/**
 * Card component configuration
 * 
 * This file contains configuration for card components,
 * including variants, sizes, and styling options.
 */

export const CARD_CONFIG = {
  // Card border radius
  borderRadius: 'var(--radius-xl)',
  
  // Card shadow
  shadow: 'var(--shadow-md)',
  
  // Card border width
  borderWidth: '1px',
  
  // Card border color
  borderColor: 'rgb(var(--border) / 0.2)',
  
  // Card hover shadow
  hoverShadow: 'var(--shadow-lg)',
  
  // Card padding sizes
  padding: {
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
  },
  
  // Card transition
  transition: 'all var(--transition-normal) var(--transition-ease)',
};

// Card variants and their styling
export const CARD_VARIANTS = {
  default: {
    base: 'border border-[var(--card-border-color)] bg-card text-card-foreground shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-shadow duration-[var(--transition-normal)]',
  },
  small: {
    base: 'border border-[var(--card-border-color)] bg-card text-card-foreground shadow-sm hover:shadow transition-shadow duration-[var(--transition-normal)]',
  },
  flat: {
    base: 'bg-card/70 text-card-foreground hover:bg-card/80 transition-colors duration-[var(--transition-normal)]',
  },
  outline: {
    base: 'border border-[var(--card-border-color)] bg-transparent text-card-foreground hover:border-[rgb(var(--border)/0.3)] transition-colors duration-[var(--transition-normal)]',
  },
};

// Card sizes and their styling
export const CARD_SIZES = {
  default: 'p-[var(--card-padding-md)]',
  small: 'p-[var(--card-padding-sm)]',
  large: 'p-[var(--card-padding-lg)]',
};

// Card component elements
export const CARD_ELEMENTS = {
  header: 'flex flex-col gap-[var(--spacing-xs)] mb-[var(--spacing-xs)] px-[var(--spacing-xs)]',
  title: 'text-[var(--text-lg)] md:text-[var(--text-xl)] font-[var(--font-semibold)] tracking-tight text-[rgb(var(--color-text-high-contrast))]',
  description: 'text-[var(--text-sm)] text-[rgb(var(--color-text-medium-contrast))] text-muted-foreground',
  content: 'py-[var(--spacing-xs)] px-[var(--spacing-xs)]',
  footer: 'flex items-center justify-between mt-[var(--spacing-xs)] px-[var(--spacing-xs)] pt-[var(--spacing-xs)] border-t border-[rgb(var(--border)/0.1)]',
};