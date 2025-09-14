import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  overscan?: number;
  className?: string;
  itemClassName?: string;
  scrollToIndex?: number;
  scrollBehavior?: ScrollBehavior;
  onItemsRendered?: (visibleStartIndex: number, visibleEndIndex: number) => void;
  estimateItemHeight?: (item: T, index: number) => number;
}

/**
 * VirtualizedList component that efficiently renders only the visible items
 * in a long list by using virtualization technique.
 */
export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
  itemClassName = '',
  scrollToIndex,
  scrollBehavior = 'auto',
  onItemsRendered,
  estimateItemHeight,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate total list height
  const totalHeight = items.length * itemHeight;
  
  // Calculate which items should be visible
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );
  
  // Create array of visible items
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Notify parent component about rendered items
  useEffect(() => {
    if (onItemsRendered) {
      onItemsRendered(startIndex, endIndex);
    }
  }, [startIndex, endIndex, onItemsRendered]);

  // Scroll to specific index if requested
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const targetScrollTop = scrollToIndex * itemHeight;
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: scrollBehavior
      });
    }
  }, [scrollToIndex, itemHeight, scrollBehavior]);

  return (
    <div
      ref={containerRef}
      className={`virtualized-list-container overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className="virtualized-list-inner"
        style={{ height: totalHeight, position: 'relative' }}
      >
        {visibleItems.map((item, localIndex) => {
          const index = startIndex + localIndex;
          const isVisible = index >= startIndex && index <= endIndex;
          
          const top = index * itemHeight;
          
          return (
            <div
              key={index}
              className={`virtualized-list-item ${itemClassName}`}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, index, isVisible)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Component for virtualized rendering of grid items
 */
interface VirtualizedGridProps<T> {
  items: T[];
  height: number;
  columnCount: number;
  rowHeight: number;
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  overscan?: number;
  className?: string;
  itemClassName?: string;
  gridGap?: number;
  scrollToIndex?: number;
}

export function VirtualizedGrid<T>({
  items,
  height,
  columnCount,
  rowHeight,
  renderItem,
  overscan = 1,
  className = '',
  itemClassName = '',
  gridGap = 8,
  scrollToIndex,
}: VirtualizedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Calculate number of rows
  const rowCount = Math.ceil(items.length / columnCount);
  const totalHeight = rowCount * rowHeight + (rowCount - 1) * gridGap;
  
  // Calculate which rows should be visible
  const rowStartIndex = Math.max(0, Math.floor(scrollTop / (rowHeight + gridGap)) - overscan);
  const rowEndIndex = Math.min(
    rowCount - 1,
    Math.ceil((scrollTop + height) / (rowHeight + gridGap)) + overscan
  );
  
  // Create array of visible items
  const visibleItems = useMemo(() => {
    const startItemIndex = rowStartIndex * columnCount;
    const endItemIndex = Math.min(items.length - 1, (rowEndIndex + 1) * columnCount - 1);
    
    return items.slice(startItemIndex, endItemIndex + 1).map((item, idx) => ({
      item,
      index: startItemIndex + idx,
    }));
  }, [items, rowStartIndex, rowEndIndex, columnCount]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Scroll to specific index if requested
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const rowIndex = Math.floor(scrollToIndex / columnCount);
      const targetScrollTop = rowIndex * (rowHeight + gridGap);
      
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }, [scrollToIndex, rowHeight, columnCount, gridGap]);

  return (
    <div
      ref={containerRef}
      className={`virtualized-grid-container overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className="virtualized-grid-inner"
        style={{ 
          height: totalHeight, 
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: gridGap
        }}
      >
        {visibleItems.map(({ item, index }) => {
          const rowIndex = Math.floor(index / columnCount);
          const isVisible = rowIndex >= rowStartIndex && rowIndex <= rowEndIndex;
          
          return (
            <div
              key={index}
              className={`virtualized-grid-item ${itemClassName}`}
              style={{
                height: rowHeight,
              }}
            >
              {renderItem(item, index, isVisible)}
            </div>
          );
        })}
      </div>
    </div>
  );
}