import { useState, useEffect } from 'react';
import { breakpoints } from '../lib/utils';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useResponsive() {
  const [screenSize, setScreenSize] = useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    currentBreakpoint: BreakpointKey;
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    currentBreakpoint: 'xl',
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      let currentBreakpoint: BreakpointKey = 'xs';
      if (width >= parseInt(breakpoints['2xl'])) {
        currentBreakpoint = '2xl';
      } else if (width >= parseInt(breakpoints.xl)) {
        currentBreakpoint = 'xl';
      } else if (width >= parseInt(breakpoints.lg)) {
        currentBreakpoint = 'lg';
      } else if (width >= parseInt(breakpoints.md)) {
        currentBreakpoint = 'md';
      } else if (width >= parseInt(breakpoints.sm)) {
        currentBreakpoint = 'sm';
      }

      setScreenSize({
        isMobile: width < parseInt(breakpoints.md),
        isTablet: width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
        isDesktop: width >= parseInt(breakpoints.lg),
        currentBreakpoint,
      });
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}