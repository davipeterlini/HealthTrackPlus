import { COLORS, LIGHT_THEME, DARK_THEME } from './colors';
import { THEME_CONFIG } from './themeConfig';

/**
 * Theme utility functions
 * 
 * This file contains utility functions for theme styling,
 * such as CSS variable generators and helper functions.
 */

/**
 * Generates CSS color with optional opacity
 * 
 * @param colorKey - Color key or RGB value
 * @param opacity - Optional opacity (0-100)
 * @returns CSS color string with rgb() or rgba() format
 */
export const cssColor = (colorKey: string, opacity?: number): string => {
  // If opacity is provided, use rgba format
  if (opacity !== undefined) {
    return `rgba(${colorKey}, ${opacity / 100})`;
  }
  // Otherwise use rgb format
  return `rgb(${colorKey})`;
};

/**
 * Get appropriate text color based on background brightness
 * 
 * @param backgroundColor - Background color in RGB format
 * @param theme - Current theme
 * @returns Appropriate text color for contrast
 */
export const getTextColorForBackground = (
  backgroundColor: string,
  theme: 'light' | 'dark'
): string => {
  // For dark theme, use a different approach since backgrounds are generally darker
  if (theme === 'dark') {
    // For primary/secondary/accent colors, use their foreground colors
    if (backgroundColor === DARK_THEME.primary) {
      return cssColor(DARK_THEME.primaryForeground);
    }
    if (backgroundColor === DARK_THEME.secondary) {
      return cssColor(DARK_THEME.secondaryForeground);
    }
    if (backgroundColor === DARK_THEME.accent) {
      return cssColor(DARK_THEME.accentForeground);
    }
    
    // Default light text for dark theme
    return cssColor(DARK_THEME.foreground);
  }
  
  // For light theme
  if (backgroundColor === LIGHT_THEME.primary) {
    return cssColor(LIGHT_THEME.primaryForeground);
  }
  if (backgroundColor === LIGHT_THEME.secondary) {
    return cssColor(LIGHT_THEME.secondaryForeground);
  }
  if (backgroundColor === LIGHT_THEME.accent) {
    return cssColor(LIGHT_THEME.accentForeground);
  }
  
  // Default dark text for light theme
  return cssColor(LIGHT_THEME.foreground);
};

/**
 * Generate CSS transition value
 * 
 * @param properties - CSS properties to transition
 * @param duration - Transition duration ('fast', 'normal', 'slow')
 * @returns CSS transition string
 */
export const cssTransition = (
  properties: string | string[],
  duration: keyof typeof THEME_CONFIG.transitions = 'normal'
): string => {
  const durationValue = THEME_CONFIG.transitions[duration];
  const easeValue = THEME_CONFIG.transitions.ease;
  
  if (Array.isArray(properties)) {
    return properties
      .map(prop => `${prop} ${durationValue} ${easeValue}`)
      .join(', ');
  }
  
  return `${properties} ${durationValue} ${easeValue}`;
};

/**
 * Get CSS shadow with optional theme awareness
 * 
 * @param size - Shadow size ('xs', 'sm', 'md', 'lg', 'xl')
 * @param theme - Current theme
 * @returns CSS shadow value
 */
export const cssShadow = (
  size: keyof typeof THEME_CONFIG.shadows,
  theme: 'light' | 'dark' = 'light'
): string => {
  return getThemeShadow(theme, size);
};

/**
 * Helper function to get shadow value based on theme
 */
function getThemeShadow(
  theme: 'light' | 'dark',
  size: keyof typeof THEME_CONFIG.shadows
): string {
  return theme === 'light' 
    ? THEME_CONFIG.shadows[size] 
    : THEME_CONFIG.darkShadows[size];
};