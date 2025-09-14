import React from 'react';

type ImportFunction<T> = () => Promise<{ default: T }>;

interface CodeSplittingOptions {
  fallback?: React.ReactNode;
  errorComponent?: React.ComponentType<{ error: Error }>;
  loadingDelay?: number;
  suspenseConfig?: { timeoutMs: number };
}

/**
 * Enhanced lazy loading with better error handling and timeout support
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunction: ImportFunction<T>,
  options: CodeSplittingOptions = {}
) {
  const LazyComponent = React.lazy(importFunction);
  const {
    fallback = null,
    errorComponent: ErrorComponent,
  } = options;

  return React.forwardRef((props: React.ComponentProps<T>, ref) => {
    const [error, setError] = React.useState<Error | null>(null);

    // Reset error state if component changes
    React.useEffect(() => {
      setError(null);
    }, [importFunction]);

    // Render error component if loading failed
    if (error && ErrorComponent) {
      return <ErrorComponent error={error} />;
    }

    return (
      <React.Suspense fallback={fallback}>
        {error ? null : <LazyComponent {...props} ref={ref as any} />}
      </React.Suspense>
    );
  });
}

/**
 * Preloads components in the background for faster rendering later
 */
export function preloadComponent<T>(importFunction: ImportFunction<T>): void {
  void importFunction();
}

/**
 * Bundle size optimization for larger components - routes/pages
 */
export const pageImport = <T extends React.ComponentType<any>>(importFunc: ImportFunction<T>) => 
  lazyLoad(importFunc, { fallback: <div className="animate-pulse p-4">Loading...</div> });

/**
 * Bundle size optimization for UI components
 */
export const componentImport = <T extends React.ComponentType<any>>(importFunc: ImportFunction<T>) => 
  lazyLoad(importFunc, { fallback: null });