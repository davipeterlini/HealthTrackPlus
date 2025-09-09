import React from 'react';
import { DeviceProvider as DeviceContextProvider } from '@/contexts/device-context';

interface DeviceProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the application with the device context
 * This allows all components to access device information using the useDevice hook
 */
export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  return <DeviceContextProvider>{children}</DeviceContextProvider>;
};