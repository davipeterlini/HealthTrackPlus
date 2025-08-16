import React from 'react';
import { cn } from '../../lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padded?: boolean;
  centered?: boolean;
}

export function Container({
  children,
  className,
  maxWidth = 'xl',
  padded = true,
  centered = true,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        {
          'mx-auto': centered,
          'px-4 sm:px-6 md:px-8': padded,
          'max-w-screen-sm': maxWidth === 'sm',
          'max-w-screen-md': maxWidth === 'md',
          'max-w-screen-lg': maxWidth === 'lg',
          'max-w-screen-xl': maxWidth === 'xl',
          'max-w-screen-2xl': maxWidth === '2xl',
          'max-w-xs': maxWidth === 'xs',
          'max-w-full': maxWidth === 'full',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}