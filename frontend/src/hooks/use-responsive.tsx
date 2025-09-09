import { useDevice, DeviceType } from '@/contexts/device-context';
import { 
  LAYOUT_CONFIG, 
  getResponsiveClass, 
  getContainerClass,
  getContentMinHeight 
} from '@/config/layout-config';

// Hook for responsive layout utilities
export function useResponsive() {
  const {
    deviceType,
    platformType,
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    isNative,
    isPortrait,
    isLandscape,
    windowWidth,
    windowHeight,
    matches
  } = useDevice();

  // Convert device type enum to string for layout config
  const deviceCategory = deviceType.toLowerCase() as 'mobile' | 'tablet' | 'desktop';

  // Get spacing classes based on current device
  const getSpacing = (type: 'container' | 'content' | 'section', property: 'padding' | 'margin' | 'gap') => {
    return getResponsiveClass(deviceCategory, 'spacing', type)[property] || '';
  };

  // Get container class with the appropriate width and padding
  const getContainer = (widthType: keyof typeof LAYOUT_CONFIG.containerWidth = 'content') => {
    return getContainerClass(widthType, deviceCategory);
  };

  // Get responsive grid class based on column count
  const getGrid = (columns: 1 | 2 | 3 | 4) => {
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

  // Get appropriate card class based on device
  const getCard = (size: 'sm' | 'md' | 'lg' = 'md') => {
    let base = 'border border-opacity-30 bg-white dark:bg-gray-800 shadow-sm';
    
    switch (size) {
      case 'sm':
        return `${base} ${deviceCategory === 'mobile' ? 'p-2 rounded' : 'p-3 rounded-md'}`;
      case 'lg':
        return `${base} ${deviceCategory === 'mobile' ? 'p-3 rounded-md' : 'p-5 lg:p-6 rounded-lg'}`;
      case 'md':
      default:
        return `${base} ${LAYOUT_CONFIG.card[deviceCategory].padding} ${LAYOUT_CONFIG.card[deviceCategory].borderRadius}`;
    }
  };

  // Get content height adjusted for header and navigation
  const getContentHeight = (hasBottomNav = true) => {
    return getContentMinHeight(deviceCategory, hasBottomNav);
  };

  // Get font size class based on device
  const getFontSize = (type: 'title-lg' | 'title-md' | 'title-sm' | 'text-lg' | 'text-md' | 'text-sm') => {
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

  // Get icon size class based on device
  const getIconSize = (size: 'xs' | 'sm' | 'md' | 'lg' = 'md') => {
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

  // Get spacing for margin or padding
  const getSpacingClass = (type: 'm' | 'p', direction: 'x' | 'y' | 't' | 'b' | 'l' | 'r' | '', size: 'xs' | 'sm' | 'md' | 'lg' = 'md') => {
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

  return {
    deviceType,
    deviceCategory,
    platformType,
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    isNative,
    isPortrait,
    isLandscape,
    windowWidth,
    windowHeight,
    matches,
    getSpacing,
    getContainer,
    getGrid,
    getCard,
    getContentHeight,
    getFontSize,
    getIconSize,
    getSpacingClass,
  };
}