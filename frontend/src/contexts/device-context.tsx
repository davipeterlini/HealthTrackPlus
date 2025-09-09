import React, { createContext, useContext, useEffect, useState } from 'react';
import { Device } from '@capacitor/device';

// Define device type enum
export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop'
}

// Define platform type enum
export enum PlatformType {
  Web = 'web',
  Android = 'android',
  iOS = 'ios'
}

// Define orientation type
export enum OrientationType {
  Portrait = 'portrait',
  Landscape = 'landscape'
}

// Define screen size breakpoints in pixels
export const BREAKPOINTS = {
  xxs: 360,
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Interface for device context
interface DeviceContextType {
  deviceType: DeviceType;
  platformType: PlatformType;
  orientation: OrientationType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isNative: boolean;
  isWeb: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  windowWidth: number;
  windowHeight: number;
  breakpoints: typeof BREAKPOINTS;
  matches: (breakpoint: keyof typeof BREAKPOINTS, operator: '>' | '>=' | '<' | '<=' | '==') => boolean;
}

// Create device context
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = () => {
  const context = useContext(DeviceContext);
  
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  
  return context;
};

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.Desktop);
  const [platformType, setPlatformType] = useState<PlatformType>(PlatformType.Web);
  const [orientation, setOrientation] = useState<OrientationType>(OrientationType.Portrait);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [windowHeight, setWindowHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 768);
  
  // Function to determine device type based on screen width
  const determineDeviceType = (width: number): DeviceType => {
    if (width < BREAKPOINTS.md) return DeviceType.Mobile;
    if (width < BREAKPOINTS.lg) return DeviceType.Tablet;
    return DeviceType.Desktop;
  };
  
  // Function to determine orientation
  const determineOrientation = (width: number, height: number): OrientationType => {
    return width > height ? OrientationType.Landscape : OrientationType.Portrait;
  };
  
  // Function to check if width matches a condition for a specific breakpoint
  const matches = (breakpoint: keyof typeof BREAKPOINTS, operator: '>' | '>=' | '<' | '<=' | '==') => {
    const breakpointValue = BREAKPOINTS[breakpoint];
    
    switch (operator) {
      case '>': return windowWidth > breakpointValue;
      case '>=': return windowWidth >= breakpointValue;
      case '<': return windowWidth < breakpointValue;
      case '<=': return windowWidth <= breakpointValue;
      case '==': return windowWidth === breakpointValue;
      default: return false;
    }
  };
  
  // Effect to determine device platform (web, iOS, Android)
  useEffect(() => {
    const detectPlatform = async () => {
      try {
        const info = await Device.getInfo();
        
        if (info.platform === 'ios') {
          setPlatformType(PlatformType.iOS);
        } else if (info.platform === 'android') {
          setPlatformType(PlatformType.Android);
        } else {
          setPlatformType(PlatformType.Web);
        }
      } catch (error) {
        console.warn('Error detecting device platform, assuming web:', error);
        setPlatformType(PlatformType.Web);
      }
    };
    
    detectPlatform();
  }, []);
  
  // Effect to handle window resize events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowWidth(width);
      setWindowHeight(height);
      setDeviceType(determineDeviceType(width));
      setOrientation(determineOrientation(width, height));
    };
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Handle orientation change for mobile devices
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  // Derived properties
  const isMobile = deviceType === DeviceType.Mobile;
  const isTablet = deviceType === DeviceType.Tablet;
  const isDesktop = deviceType === DeviceType.Desktop;
  
  const isWeb = platformType === PlatformType.Web;
  const isAndroid = platformType === PlatformType.Android;
  const isIOS = platformType === PlatformType.iOS;
  const isNative = isAndroid || isIOS;
  
  const isPortrait = orientation === OrientationType.Portrait;
  const isLandscape = orientation === OrientationType.Landscape;
  
  const value = {
    deviceType,
    platformType,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    isNative,
    isAndroid,
    isIOS,
    isPortrait,
    isLandscape,
    windowWidth,
    windowHeight,
    breakpoints: BREAKPOINTS,
    matches
  };
  
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};