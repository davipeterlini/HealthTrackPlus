/**
 * Navigation components configuration
 * 
 * This file contains configuration for navigation-related components,
 * including headers, nav links, menus, etc.
 */

export const HEADER_CONFIG = {
  // Header heights for different sizes
  height: {
    xs: '48px',    // Extra small header
    sm: '56px',    // Small header
    md: '64px',    // Medium header (default)
    lg: '72px',    // Large header
    xl: '80px',    // Extra large header
  },
  
  // Header z-index
  zIndex: 'var(--z-sticky)',
  
  // Header padding
  padding: {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  },
  
  // Header shadow
  shadow: 'shadow-sm',
  
  // Header border
  border: 'border-b border-[rgb(var(--border)/0.2)]',
};

// Navigation item configuration
export const NAV_ITEM_CONFIG = {
  // Nav item border radius
  borderRadius: 'var(--radius-md)',
  
  // Nav item padding
  padding: {
    x: 'var(--spacing-sm)',
    y: 'var(--spacing-xs)',
  },
  
  // Nav item active background
  activeBg: 'rgb(var(--primary) / 0.1)',
  
  // Nav item hover background
  hoverBg: 'rgb(var(--primary) / 0.05)',
  
  // Nav item gap between icon and text
  gap: 'var(--spacing-xs)',
  
  // Nav item transition
  transition: 'all var(--transition-normal) var(--transition-ease)',
};

// Mobile navigation configuration
export const MOBILE_NAV_CONFIG = {
  // Bottom navigation height
  bottomNavHeight: '56px',
  
  // Bottom navigation z-index
  zIndex: 'var(--z-fixed)',
  
  // Mobile menu width
  menuWidth: {
    xxs: '90vw',
    xs: '85vw',
    sm: '75vw',
    md: '60vw',
    max: '360px',
  },
  
  // Mobile menu animation
  animation: {
    duration: 'var(--transition-normal)',
    ease: 'var(--transition-ease)',
  },
};

// Dropdown menu configuration
export const DROPDOWN_CONFIG = {
  // Dropdown border radius
  borderRadius: 'var(--radius-md)',
  
  // Dropdown shadow
  shadow: 'var(--shadow-md)',
  
  // Dropdown z-index
  zIndex: 'var(--z-dropdown)',
  
  // Dropdown border
  border: 'border border-[rgb(var(--border)/0.2)]',
  
  // Dropdown item padding
  itemPadding: 'px-2 py-1.5',
  
  // Dropdown item hover background
  itemHoverBg: 'rgb(var(--accent)/0.1)',
  
  // Dropdown animation
  animation: {
    duration: '150ms',
    ease: 'ease-out',
  },
};