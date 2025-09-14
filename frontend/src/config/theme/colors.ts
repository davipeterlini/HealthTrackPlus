/**
 * Theme color configuration
 * 
 * This file contains color definitions for light and dark themes
 */

// Theme types
export type Theme = 'light' | 'dark';

// Core colors with RGB values for opacity support
export const COLORS = {
  // Primary palette - Blue
  primary: {
    50: '239, 246, 255',   // blue-50 - Very light blue
    100: '219, 234, 254',  // blue-100 - Light blue
    200: '191, 219, 254',  // blue-200 - Light blue
    300: '147, 197, 253',  // blue-300 - Light accent blue
    400: '96, 165, 250',   // blue-400 - Medium blue
    500: '59, 130, 246',   // blue-500 - Standard blue
    600: '37, 99, 235',    // blue-600 - Primary blue
    700: '29, 78, 216',    // blue-700 - Darker blue
    800: '30, 64, 175',    // blue-800 - Dark blue
    900: '30, 58, 138',    // blue-900 - Very dark blue
    950: '23, 37, 84',     // blue-950 - Darkest blue
  },

  // Secondary palette - Emerald
  secondary: {
    50: '236, 253, 245',   // emerald-50
    100: '209, 250, 229',  // emerald-100
    200: '167, 243, 208',  // emerald-200
    300: '110, 231, 183',  // emerald-300
    400: '52, 211, 153',   // emerald-400
    500: '16, 185, 129',   // emerald-500
    600: '5, 150, 105',    // emerald-600
    700: '4, 120, 87',     // emerald-700
    800: '6, 95, 70',      // emerald-800
    900: '6, 78, 59',      // emerald-900
    950: '2, 44, 34',      // emerald-950
  },

  // Accent palette - Purple
  accent: {
    50: '245, 243, 255',    // purple-50
    100: '237, 233, 254',   // purple-100
    200: '221, 214, 254',   // purple-200
    300: '196, 181, 253',   // purple-300
    400: '167, 139, 250',   // purple-400
    500: '139, 92, 246',    // purple-500
    600: '124, 58, 237',    // purple-600
    700: '109, 40, 217',    // purple-700
    800: '91, 33, 182',     // purple-800
    900: '76, 29, 149',     // purple-900
    950: '46, 16, 101',     // purple-950
  },

  // Neutral palette - Gray
  gray: {
    50: '250, 250, 250',    // gray-50 - Lightest gray
    100: '245, 245, 245',   // gray-100 - Very light gray
    200: '229, 231, 235',   // gray-200 - Light gray
    300: '209, 213, 219',   // gray-300 - Medium light gray
    400: '156, 163, 175',   // gray-400 - Medium gray
    500: '107, 114, 128',   // gray-500 - Standard gray
    600: '75, 85, 99',      // gray-600 - Darker gray
    700: '55, 65, 81',      // gray-700 - Dark gray
    800: '31, 41, 55',      // gray-800 - Very dark gray
    900: '17, 24, 39',      // gray-900 - Almost black
    950: '3, 7, 18',        // gray-950 - Darkest gray
  },

  // Dark mode specific colors
  slate: {
    700: '51, 65, 85',      // slate-700
    800: '30, 41, 59',      // slate-800
    900: '15, 23, 42',      // slate-900
  },

  // Semantic colors
  success: {
    50: '240, 253, 244',    // green-50
    100: '220, 252, 231',   // green-100
    500: '34, 197, 94',     // green-500
    600: '22, 163, 74',     // green-600
    700: '21, 128, 61',     // green-700
  },

  warning: {
    50: '254, 252, 232',    // yellow-50
    100: '254, 249, 195',   // yellow-100
    500: '234, 179, 8',     // yellow-500
    600: '202, 138, 4',     // yellow-600
    700: '161, 98, 7',      // yellow-700
  },

  error: {
    50: '254, 242, 242',    // red-50
    100: '254, 226, 226',   // red-100
    500: '239, 68, 68',     // red-500
    600: '220, 38, 38',     // red-600
    700: '185, 28, 28',     // red-700
  },

  info: {
    50: '240, 249, 255',    // sky-50
    100: '224, 242, 254',   // sky-100
    500: '14, 165, 233',    // sky-500
    600: '2, 132, 199',     // sky-600
    700: '3, 105, 161',     // sky-700
  },
};

// Theme specific colors for light mode
export const LIGHT_THEME = {
  // Base UI colors
  background: '255, 255, 255',                  // white
  foreground: '17, 24, 39',                     // gray-900
  
  // Card and surface colors
  card: '255, 255, 255',                        // white
  cardForeground: '17, 24, 39',                // gray-900
  popover: '255, 255, 255',                    // white
  popoverForeground: '17, 24, 39',             // gray-900
  
  // UI element colors
  primary: COLORS.primary[600],                // Primary color
  primaryForeground: '255, 255, 255',          // white
  secondary: COLORS.secondary[600],            // Secondary color
  secondaryForeground: '255, 255, 255',        // white
  accent: COLORS.accent[600],                  // Accent color
  accentForeground: '255, 255, 255',           // white
  
  // Utility colors
  muted: COLORS.gray[100],                     // Muted background
  mutedForeground: COLORS.gray[500],           // Muted text
  destructive: COLORS.error[600],              // Destructive actions
  destructiveForeground: '255, 255, 255',      // White text on destructive
  
  // Border and UI element colors
  border: COLORS.gray[200],                    // Standard border
  input: COLORS.gray[200],                     // Input border
  ring: COLORS.primary[600],                   // Focus ring
};

// Theme specific colors for dark mode
export const DARK_THEME = {
  // Base UI colors
  background: COLORS.slate[900],              // Deep background
  foreground: '241, 245, 249',                // slate-100
  
  // Card and surface colors
  card: COLORS.slate[800],                    // Elevated surfaces
  cardForeground: '241, 245, 249',            // slate-100
  popover: COLORS.slate[800],                 // Popover background
  popoverForeground: '241, 245, 249',         // slate-100
  
  // UI element colors
  primary: COLORS.primary[500],               // Brighter blue in dark mode
  primaryForeground: '239, 246, 255',         // blue-50
  secondary: COLORS.secondary[500],           // Brighter green in dark mode
  secondaryForeground: '236, 253, 245',       // emerald-50
  accent: COLORS.accent[500],                 // Brighter purple in dark mode
  accentForeground: '245, 243, 255',          // purple-50
  
  // Utility colors
  muted: COLORS.slate[700],                   // Muted background
  mutedForeground: COLORS.gray[400],          // Muted text
  destructive: COLORS.error[500],             // Destructive actions
  destructiveForeground: '254, 242, 242',     // red-50
  
  // Border and UI element colors
  border: COLORS.gray[700],                   // More visible borders
  input: COLORS.gray[700],                    // Input borders
  ring: COLORS.primary[500],                  // Focus rings
};

/**
 * Get RGB color value from theme
 * 
 * @param theme - Current theme ('light' or 'dark')
 * @param colorKey - Color key to retrieve
 * @returns RGB color value as string
 */
export const getThemeColor = (theme: Theme, colorKey: keyof typeof LIGHT_THEME): string => {
  return theme === 'light' ? LIGHT_THEME[colorKey] : DARK_THEME[colorKey];
};