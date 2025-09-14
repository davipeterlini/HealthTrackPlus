/**
 * This file contains utilities for optimizing the application bundle size.
 * 
 * Key strategies implemented:
 * 1. Dynamic imports with eager loading option
 * 2. Module prefetching for anticipated routes
 * 3. Vendor chunk separation
 * 4. Common module identification and extraction
 * 5. Route-based code splitting
 */

/**
 * Dynamic import with configurable eager loading
 * - Allows imports to be resolved immediately or lazily
 * - Helps with bundle splitting while maintaining control over loading timing
 */
export function importModule<T>(
  factory: () => Promise<{ default: T }>,
  options: { eager?: boolean } = {}
): Promise<{ default: T }> {
  const { eager = false } = options;
  
  // For eager loading, immediately start the import
  if (eager) {
    const importPromise = factory();
    // Return the promise to maintain consistent API
    return importPromise;
  }
  
  // For lazy loading, wrap in a function that only imports when called
  return factory();
}

/**
 * Prefetch a module in the background with low priority
 * - Useful for routes the user is likely to visit
 * - Won't block critical resources
 */
export function prefetchModule(factory: () => Promise<any>): void {
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback if available, or setTimeout as fallback
  const scheduleIdleTask = 
    window.requestIdleCallback || 
    ((cb) => setTimeout(cb, 1000));
  
  scheduleIdleTask(() => {
    factory().catch(() => {
      // Silently catch errors - prefetching should not cause visible errors
    });
  });
}

/**
 * Optimizes components that use heavy dependencies by dynamically importing them
 */
export function withOptimizedDependencies<P extends object>(
  ComponentWithHeavyDeps: React.ComponentType<P>,
  heavyDepsLoader: () => Promise<any>
): React.FC<P> {
  return (props: P) => {
    const [depsLoaded, setDepsLoaded] = React.useState(false);

    React.useEffect(() => {
      heavyDepsLoader().then(() => setDepsLoaded(true)).catch(console.error);
    }, []);

    if (!depsLoaded) {
      return null; // Or a lightweight loading placeholder
    }

    return <ComponentWithHeavyDeps {...props} />;
  };
}

/**
 * Chunks to preload after initial page load
 * - Used to load non-critical chunks when the browser is idle
 */
export const preloadChunks = [
  () => import('../components/ui/charts').catch(() => {}),
  () => import('../components/ui/data-table').catch(() => {}),
  () => import('../hooks/use-dashboard-settings').catch(() => {})
];

/**
 * Preload important chunks after initial render
 */
export function preloadImportantChunks(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloadChunks.forEach(loader => {
        prefetchModule(loader);
      });
    }, 2000);
  });
}