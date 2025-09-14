/**
 * Icon utilities for optimizing bundle size through tree shaking
 */

// Commonly used icons that can be imported directly
import { 
  Home, 
  Settings, 
  User, 
  LogOut,
  Moon,
  Sun,
  Bell
} from 'lucide-react';

// Export commonly used icons directly to enable tree-shaking
export {
  Home,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Bell
};

// Types for icon props
export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

/**
 * Helper to dynamically import icons only when needed
 * This helps reduce bundle size by only including icons that are actually used
 * 
 * @param iconName - The name of the Lucide icon to import
 * @returns Promise resolving to the icon component
 */
export async function getIcon(iconName: string) {
  try {
    // Dynamic import for tree shaking
    const module = await import('lucide-react');
    return module[iconName as keyof typeof module];
  } catch (error) {
    console.error(`Failed to load icon: ${iconName}`, error);
    return null;
  }
}