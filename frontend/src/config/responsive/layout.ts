import { BREAKPOINTS } from './breakpoints';

/**
 * Layout configuration for responsive design
 * 
 * This file contains layout-related configurations for different device types,
 * ensuring consistent spacing, sizing, and structure throughout the application.
 */

// Layout configuration for different device types
export const LAYOUT_CONFIG = {
  // Spacing system for different device types
  spacing: {
    mobile: {
      container: {
        padding: 'px-3',
        margin: 'mx-auto',
      },
      content: {
        padding: 'p-3',
        gap: 'gap-2',
      },
      section: {
        margin: 'my-3',
        padding: 'py-3',
      },
    },
    tablet: {
      container: {
        padding: 'px-6',
        margin: 'mx-auto',
      },
      content: {
        padding: 'p-4',
        gap: 'gap-4',
      },
      section: {
        margin: 'my-5',
        padding: 'py-4',
      },
    },
    desktop: {
      container: {
        padding: 'px-10 xl:px-12',
        margin: 'mx-auto',
      },
      content: {
        padding: 'p-6',
        gap: 'gap-6',
      },
      section: {
        margin: 'my-8 lg:my-10',
        padding: 'py-6',
      },
    },
  },
  
  // Maximum widths for different container types
  containerWidth: {
    full: 'max-w-full',
    content: 'max-w-5xl 2xl:max-w-6xl',
    narrow: 'max-w-3xl lg:max-w-4xl',
    wide: 'max-w-7xl',
  },
  
  // Header height for different devices - used for content area calculations
  headerHeight: {
    mobile: 56, // 14 x 4 = 56px
    tablet: 64, // 16 x 4 = 64px
    desktop: 64, // 16 x 4 = 64px
  },
  
  // Bottom navigation height for mobile
  bottomNavHeight: 56,
  
  // Grid configurations
  grid: {
    mobile: {
      columns: 'grid-cols-1 xxs:grid-cols-1',
      gap: 'gap-2',
    },
    tablet: {
      columns: 'grid-cols-2',
      gap: 'gap-4',
    },
    desktop: {
      columns: 'grid-cols-3 lg:grid-cols-4',
      gap: 'gap-6',
    },
  },
  
  // Card sizes
  card: {
    mobile: {
      padding: 'p-2 xxs:p-3',
      borderRadius: 'rounded-md',
    },
    tablet: {
      padding: 'p-4',
      borderRadius: 'rounded-lg',
    },
    desktop: {
      padding: 'p-5 lg:p-6',
      borderRadius: 'rounded-lg',
    },
  },
};

/**
 * Helper function to get responsive class based on device type
 * 
 * @param device - Device type ('mobile', 'tablet', 'desktop')
 * @param category - Category in the layout config
 * @param property - Property to retrieve
 * @returns The responsive class string
 */
export const getResponsiveClass = (
  device: 'mobile' | 'tablet' | 'desktop',
  category: keyof typeof LAYOUT_CONFIG,
  property: string
): any => {
  // @ts-ignore - We know the structure but TypeScript doesn't
  if (LAYOUT_CONFIG[category] && LAYOUT_CONFIG[category][device] && LAYOUT_CONFIG[category][device][property]) {
    // @ts-ignore - We know the structure but TypeScript doesn't
    return LAYOUT_CONFIG[category][device][property];
  }
  return '';
};

/**
 * Helper function to get container class based on width type and device
 * 
 * @param widthType - Container width type
 * @param device - Device type
 * @returns Container class string with appropriate width and padding
 */
export const getContainerClass = (
  widthType: keyof typeof LAYOUT_CONFIG.containerWidth = 'content',
  device: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): string => {
  const paddingClass = getResponsiveClass(device, 'spacing', 'container');
  const widthClass = LAYOUT_CONFIG.containerWidth[widthType];
  return `${widthClass} ${paddingClass.padding} ${paddingClass.margin}`;
};

/**
 * Calculate content height adjusting for header and possibly bottom nav
 * 
 * @param device - Device type
 * @param hasBottomNav - Whether bottom navigation is present
 * @returns CSS class string for min-height
 */
export const getContentMinHeight = (
  device: 'mobile' | 'tablet' | 'desktop',
  hasBottomNav = false
): string => {
  const headerHeight = LAYOUT_CONFIG.headerHeight[device];
  const bottomNavHeight = hasBottomNav && device === 'mobile' ? LAYOUT_CONFIG.bottomNavHeight : 0;
  return `min-h-[calc(100vh-${headerHeight + bottomNavHeight}px)]`;
};