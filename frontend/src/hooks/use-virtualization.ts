import { useState, useCallback, useRef, useEffect } from 'react';

interface VirtualizationOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  initialScrollIndex?: number;
}

interface WindowSizes {
  startIndex: number;
  endIndex: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
}

/**
 * Custom hook to manage virtualized rendering of large lists
 * 
 * @returns Various utilities and state for implementing virtualization
 */
export function useVirtualization<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 2,
  initialScrollIndex = 0
}: VirtualizationOptions<T>) {
  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef(initialScrollIndex * itemHeight);
  
  // State
  const [scrollTop, setScrollTop] = useState(initialScrollIndex * itemHeight);
  const [windowSizes, setWindowSizes] = useState<WindowSizes>(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
    const visibleEndIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );
    const endIndex = Math.min(
      items.length - 1,
      visibleEndIndex + overscan
    );
    
    return { startIndex, endIndex, visibleStartIndex, visibleEndIndex };
  });
  
  // Calculate total list height
  const totalHeight = items.length * itemHeight;
  
  // Calculate visible range based on scroll position
  const calculateRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    scrollPositionRef.current = scrollTop;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
    const visibleEndIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );
    const endIndex = Math.min(
      items.length - 1,
      visibleEndIndex + overscan
    );
    
    setScrollTop(scrollTop);
    setWindowSizes({ startIndex, endIndex, visibleStartIndex, visibleEndIndex });
  }, [itemHeight, containerHeight, items.length, overscan]);
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    window.requestAnimationFrame(calculateRange);
  }, [calculateRange]);
  
  // Scroll to specific index
  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'auto') => {
    if (!containerRef.current) return;
    
    const targetScrollTop = index * itemHeight;
    containerRef.current.scrollTo({
      top: targetScrollTop,
      behavior
    });
  }, [itemHeight]);
  
  // Update range when dependencies change
  useEffect(() => {
    calculateRange();
  }, [items.length, containerHeight, itemHeight, calculateRange]);
  
  // Get only the visible items for rendering
  const visibleItems = items.slice(windowSizes.startIndex, windowSizes.endIndex + 1);
  
  // Calculate item styles
  const getItemStyle = (index: number) => ({
    position: 'absolute',
    top: index * itemHeight,
    left: 0,
    right: 0,
    height: itemHeight,
  } as const);
  
  // Set container ref and add event listener
  const setContainerRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      containerRef.current = element;
      element.addEventListener('scroll', handleScroll);
      // Initial calculation
      calculateRange();
      
      // Restore scroll position if we have one
      if (scrollPositionRef.current > 0) {
        element.scrollTop = scrollPositionRef.current;
      }
      
      // Scroll to initial index if provided
      if (initialScrollIndex > 0) {
        scrollToIndex(initialScrollIndex);
      }
    }
    
    // Cleanup event listener on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll, calculateRange, initialScrollIndex, scrollToIndex]);
  
  return {
    containerRef: setContainerRef,
    totalHeight,
    visibleItems,
    startIndex: windowSizes.startIndex,
    scrollToIndex,
    getItemStyle,
    scrollTop,
    isItemVisible: (index: number) => 
      index >= windowSizes.visibleStartIndex && index <= windowSizes.visibleEndIndex,
    visibleStartIndex: windowSizes.visibleStartIndex,
    visibleEndIndex: windowSizes.visibleEndIndex,
  };
}