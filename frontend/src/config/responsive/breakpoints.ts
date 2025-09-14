/**
 * Responsive breakpoints configuration
 * 
 * This file contains all screen size breakpoints used throughout the application
 * to ensure consistent responsive behavior.
 */

// Screen size breakpoints in pixels
export const BREAKPOINTS = {
  xxs: 360,  // Extra extra small devices (small phones)
  xs: 480,   // Extra small devices (mobile phones)
  sm: 640,   // Small devices (large phones/small tablets)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktops)
  xl: 1280,  // Extra large devices (large desktops)
  '2xl': 1536 // 2x extra large devices (very large screens)
};

// Device type definitions
export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop'
}

// Platform type definitions
export enum PlatformType {
  Web = 'web',
  Android = 'android',
  iOS = 'ios'
}

// Orientation type definitions
export enum OrientationType {
  Portrait = 'portrait',
  Landscape = 'landscape'
}

/**
 * Get device type from screen width
 * 
 * @param width - Current screen width in pixels
 * @returns Device type string ('mobile', 'tablet', or 'desktop')
 */
export const getDeviceTypeFromWidth = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
};