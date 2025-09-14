/**
 * Theme configuration
 * 
 * This file contains theme-related configuration settings
 * such as transitions, shadows, and other visual styling parameters.
 */

export const THEME_CONFIG = {
  // Transition settings
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Shadow settings
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // Dark mode shadows (with higher contrast)
  darkShadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
  },

  // Border radius settings
  radius: {
    xs: '0.125rem',    // 2px
    sm: '0.25rem',     // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    full: '9999px',    // For pills and circular elements
  },
  
  // Z-index layers
  zIndex: {
    negative: -1,
    base: 0,
    above: 1,
    dropdown: 10,
    sticky: 100,
    fixed: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    max: 999,
  },
  
  // Chart colors
  chartColors: {
    light: [
      '37, 99, 235',    // blue-600 - Primary blue
      '5, 150, 105',    // emerald-600 - Green
      '124, 58, 237',   // purple-600 - Purple
      '239, 68, 68',    // red-500 - Red
      '245, 158, 11',   // amber-500 - Amber
      '8, 145, 178',    // cyan-600 - Cyan
    ],
    dark: [
      '96, 165, 250',   // blue-400 - Bright blue
      '74, 222, 128',   // green-400 - Bright green
      '167, 139, 250',  // purple-400 - Bright purple
      '248, 113, 113',  // red-400 - Bright red
      '251, 191, 36',   // amber-400 - Bright amber
      '45, 212, 191',   // teal-400 - Bright teal
    ],
  },
};

/**
 * Get shadow value based on theme
 * 
 * @param theme - Current theme ('light' or 'dark')
 * @param size - Shadow size ('xs', 'sm', 'md', 'lg', 'xl')
 * @returns Shadow value as string
 */
export const getThemeShadow = (
  theme: 'light' | 'dark',
  size: keyof typeof THEME_CONFIG.shadows
): string => {
  return theme === 'light' 
    ? THEME_CONFIG.shadows[size] 
    : THEME_CONFIG.darkShadows[size];
};

/**
 * Get chart colors based on theme
 * 
 * @param theme - Current theme ('light' or 'dark')
 * @returns Array of RGB color values for charts
 */
export const getChartColors = (theme: 'light' | 'dark'): string[] => {
  return theme === 'light' 
    ? THEME_CONFIG.chartColors.light 
    : THEME_CONFIG.chartColors.dark;
};