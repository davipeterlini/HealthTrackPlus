/**
 * Form components configuration
 * 
 * This file contains configuration for form-related components,
 * including inputs, selects, checkboxes, etc.
 */

export const INPUT_CONFIG = {
  // Input heights for different sizes
  height: {
    xs: '24px',     // Extra small inputs
    sm: '32px',     // Small inputs
    md: '40px',     // Medium inputs (default)
    lg: '48px',     // Large inputs
    xl: '56px',     // Extra large inputs
  },
  
  // Input border radius
  borderRadius: 'var(--radius-md)',
  
  // Input border width
  borderWidth: '1px',
  
  // Input border color
  borderColor: 'var(--input)',
  
  // Input focus ring width
  focusRingWidth: '2px',
  
  // Input focus ring offset
  focusRingOffset: '1px',
  
  // Input padding sizes
  padding: {
    xs: '0.25rem 0.5rem',    // Extra small padding
    sm: '0.5rem 0.75rem',    // Small padding
    md: '0.625rem 1rem',     // Medium padding (default)
    lg: '0.75rem 1.25rem',   // Large padding
    xl: '1rem 1.5rem',       // Extra large padding
  },
  
  // Input transition
  transition: 'all var(--transition-normal) var(--transition-ease)',
};

// Form label configuration
export const LABEL_CONFIG = {
  // Label font sizes
  fontSize: {
    sm: 'var(--text-xs)',
    md: 'var(--text-sm)',
    lg: 'var(--text-base)',
  },
  
  // Label font weight
  fontWeight: 'var(--font-medium)',
  
  // Label margin bottom
  marginBottom: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
};

// Checkbox and radio configuration
export const CHECKBOX_CONFIG = {
  // Checkbox sizes
  size: {
    sm: '16px',
    md: '18px',
    lg: '20px',
  },
  
  // Checkbox border radius
  borderRadius: '4px',
  
  // Radio border radius (always round)
  radioBorderRadius: '50%',
  
  // Checkmark size ratio (to checkbox size)
  checkmarkRatio: 0.6,
};

// Select component configuration
export const SELECT_CONFIG = {
  // Select heights (same as inputs)
  height: INPUT_CONFIG.height,
  
  // Select border radius
  borderRadius: INPUT_CONFIG.borderRadius,
  
  // Select padding
  padding: INPUT_CONFIG.padding,
  
  // Select indicator width (dropdown arrow)
  indicatorWidth: '1.5rem',
};

// Form group configuration
export const FORM_GROUP_CONFIG = {
  // Spacing between form groups
  spacing: {
    sm: 'var(--spacing-xs)',
    md: 'var(--spacing-sm)',
    lg: 'var(--spacing-md)',
  },
  
  // Form group margin bottom
  marginBottom: {
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
  },
};

// Helper text configuration
export const HELPER_TEXT_CONFIG = {
  // Helper text font sizes
  fontSize: {
    sm: 'var(--text-xs)',
    md: 'var(--text-sm)',
  },
  
  // Helper text margin top
  marginTop: {
    sm: '0.25rem',
    md: '0.375rem',
  },
  
  // Helper text colors
  colors: {
    default: 'text-muted-foreground',
    error: 'text-destructive',
    success: 'text-[rgb(var(--color-success-600))]',
  },
};