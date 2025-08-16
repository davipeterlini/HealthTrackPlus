import React from 'react';
import { cn } from '../../lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string | number;
}

export function Grid({
  children,
  className,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 4,
  ...props
}: GridProps) {
  const gridGap = typeof gap === 'number' ? `${gap * 0.25}rem` : gap;
  
  return (
    <div
      className={cn(
        'grid',
        // Default grid with 1 column
        'grid-cols-1',
        // Responsive columns
        columns.sm && `sm:grid-cols-${columns.sm}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        columns.xl && `xl:grid-cols-${columns.xl}`,
        className
      )}
      style={{ gap: gridGap }}
      {...props}
    >
      {children}
    </div>
  );
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function GridItem({
  children,
  className,
  colSpan,
  ...props
}: GridItemProps) {
  return (
    <div
      className={cn(
        // Responsive column spans
        colSpan?.xs && `col-span-${colSpan.xs}`,
        colSpan?.sm && `sm:col-span-${colSpan.sm}`,
        colSpan?.md && `md:col-span-${colSpan.md}`,
        colSpan?.lg && `lg:col-span-${colSpan.lg}`,
        colSpan?.xl && `xl:col-span-${colSpan.xl}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}