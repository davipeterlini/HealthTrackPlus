import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to load components on demand only when they're needed
 * This helps reduce initial bundle size by deferring non-critical components
 */
export function useOnDemandComponent<T>(
  importFn: () => Promise<{ default: T }>, 
  options: { 
    eager?: boolean;
    onLoaded?: () => void;
    onError?: (err: Error) => void;
  } = {}
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { eager = false, onLoaded, onError } = options;

  const loadComponent = useCallback(() => {
    if (Component || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    importFn()
      .then(module => {
        setComponent(module.default);
        if (onLoaded) onLoaded();
      })
      .catch(err => {
        setError(err);
        if (onError) onError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [Component, isLoading, importFn, onLoaded, onError]);

  // Load component eagerly if option is set
  useEffect(() => {
    if (eager) {
      loadComponent();
    }
  }, [eager, loadComponent]);

  return {
    Component: Component as React.ComponentType | null,
    loadComponent,
    isLoading,
    error,
    isLoaded: !!Component
  };
}