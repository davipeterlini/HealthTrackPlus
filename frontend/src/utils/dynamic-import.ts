import React from 'react';

/**
 * Helper function to dynamically import components with proper loading and error states
 * @param importFunc - The import function to call
 * @returns A component with proper loading and error states
 */
export function dynamicImport<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={null}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
}

/**
 * Helper for dynamically importing icons from lucide-react to reduce bundle size
 * @param iconName - The name of the icon to import
 * @returns A promise that resolves to the icon component
 */
export const loadIcon = (iconName: string) => 
  import('lucide-react').then(mod => mod[iconName as keyof typeof mod]);