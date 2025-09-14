/**
 * Responsive utility functions and configurations
 * 
 * This file contains utility functions and classes for responsive design,
 * such as responsive spacing, typography, and component sizing.
 */

/**
 * Get responsive grid class based on column count
 * 
 * @param columns - Number of columns (1-4)
 * @returns CSS class string for responsive grid
 */
export const getResponsiveGrid = (columns: 1 | 2 | 3 | 4): string => {
  switch (columns) {
    case 1:
      return 'grid grid-cols-1 gap-2 xxs:gap-3 xs:gap-4 w-full overflow-hidden';
    case 2:
      return 'grid grid-cols-1 xxs:grid-cols-1 xs:grid-cols-2 gap-2 xxs:gap-3 xs:gap-4 w-full overflow-hidden';
    case 3:
      return 'grid grid-cols-1 xxs:grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xxs:gap-3 xs:gap-4 w-full overflow-hidden';
    case 4:
      return 'grid grid-cols-1 xxs:grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xxs:gap-3 xs:gap-4 w-full overflow-hidden';
    default:
      return 'grid grid-cols-1 gap-2 xxs:gap-3 xs:gap-4 w-full overflow-hidden';
  }
};

/**
 * Get responsive font size class
 * 
 * @param type - Type of text element
 * @returns CSS class string for responsive font size
 */
export const getResponsiveFontSize = (
  type: 'title-lg' | 'title-md' | 'title-sm' | 'text-lg' | 'text-md' | 'text-sm'
): string => {
  switch (type) {
    case 'title-lg':
      return 'text-base xxs:text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight';
    case 'title-md':
      return 'text-sm xxs:text-base xs:text-lg sm:text-xl md:text-2xl font-semibold';
    case 'title-sm':
      return 'text-xs xxs:text-sm xs:text-base sm:text-lg md:text-xl font-semibold';
    case 'text-lg':
      return 'text-sm xxs:text-base xs:text-lg md:text-xl';
    case 'text-md':
      return 'text-xs xxs:text-sm xs:text-base md:text-lg';
    case 'text-sm':
      return 'text-[11px] xxs:text-xs xs:text-sm md:text-base';
    default:
      return '';
  }
};

/**
 * Get responsive icon size class
 * 
 * @param size - Size category for the icon
 * @returns CSS class string for responsive icon size
 */
export const getResponsiveIconSize = (size: 'xs' | 'sm' | 'md' | 'lg' = 'md'): string => {
  switch (size) {
    case 'xs':
      return 'h-2.5 w-2.5 xxs:h-3 xxs:w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4';
    case 'sm':
      return 'h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5';
    case 'lg':
      return 'h-4 w-4 xxs:h-5 xxs:w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8';
    case 'md':
    default:
      return 'h-3.5 w-3.5 xxs:h-4 xxs:w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6';
  }
};

/**
 * Get responsive spacing class (margin or padding)
 * 
 * @param type - Type of spacing ('m' for margin or 'p' for padding)
 * @param direction - Direction of spacing ('x', 'y', 't', 'b', 'l', 'r', or '' for all)
 * @param size - Size category
 * @returns CSS class string for responsive spacing
 */
export const getResponsiveSpacing = (
  type: 'm' | 'p',
  direction: 'x' | 'y' | 't' | 'b' | 'l' | 'r' | '',
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md'
): string => {
  const prefix = `${type}${direction}`;
  
  switch (size) {
    case 'xs':
      return `${prefix}-1 xxs:${prefix}-1.5 xs:${prefix}-2 sm:${prefix}-2.5`;
    case 'sm':
      return `${prefix}-1.5 xxs:${prefix}-2 xs:${prefix}-2.5 sm:${prefix}-3 md:${prefix}-4`;
    case 'lg':
      return `${prefix}-3 xxs:${prefix}-4 xs:${prefix}-5 sm:${prefix}-6 md:${prefix}-8`;
    case 'md':
    default:
      return `${prefix}-2 xxs:${prefix}-3 xs:${prefix}-4 sm:${prefix}-5 md:${prefix}-6`;
  }
};

/**
 * Get responsive class for hiding/showing elements at different breakpoints
 * 
 * @param visibility - Type of visibility change
 * @returns CSS class string for responsive visibility
 */
export const getResponsiveVisibility = (
  visibility: 'hide-on-mobile' | 'show-on-mobile' | 'hide-on-tablet' | 'show-on-tablet' | 'hide-on-desktop' | 'show-on-desktop'
): string => {
  switch (visibility) {
    case 'hide-on-mobile':
      return 'hidden xs:hidden sm:block';
    case 'show-on-mobile':
      return 'block xs:block sm:hidden';
    case 'hide-on-tablet':
      return 'hidden md:block';
    case 'show-on-tablet':
      return 'hidden sm:block md:hidden';
    case 'hide-on-desktop':
      return 'block lg:hidden';
    case 'show-on-desktop':
      return 'hidden lg:block';
    default:
      return '';
  }
};