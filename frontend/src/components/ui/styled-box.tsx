import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface StyledBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Box variant
   * @default "default"
   */
  variant?: 'default' | 'bordered' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'subtle';
  
  /**
   * Box size
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg';
  
  /**
   * Whether to add hover effects
   * @default true
   */
  hover?: boolean;

  /**
   * Whether to use rounded corners
   * @default true
   */
  rounded?: boolean;

  /**
   * Whether to add shadow
   * @default true
   */
  shadow?: boolean;
  
  /**
   * Content alignment
   * @default "left"
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Whether the box is interactive (adds cursor:pointer)
   * @default false
   */
  interactive?: boolean;

  /**
   * Whether the box has a border
   * @default true
   */
  border?: boolean;

  /**
   * Whether the box has padding
   * @default true
   */
  padding?: boolean;

  /**
   * Children elements
   */
  children?: React.ReactNode;

  /**
   * Optional heading text
   */
  heading?: string;

  /**
   * Optional description text
   */
  description?: string;
}

/**
 * The StyledBox component provides a consistent, styled container
 * for content with various variants, sizes, and styling options.
 */
const StyledBox = forwardRef<HTMLDivElement, StyledBoxProps>(({
  className,
  variant = 'default',
  size = 'default',
  hover = true,
  rounded = true,
  shadow = true,
  align = 'left',
  interactive = false,
  border = true,
  padding = true,
  children,
  heading,
  description,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'transition-all duration-[var(--transition-normal)]';

  // Size styles
  const sizeStyles = {
    sm: 'p-[var(--spacing-sm)]',
    default: 'p-[var(--spacing-md)]',
    lg: 'p-[var(--spacing-lg)]',
  };

  // Variant styles
  const variantStyles = {
    default: 'bg-white dark:bg-[#1a2127] text-gray-900 dark:text-gray-100',
    bordered: 'bg-transparent border-[rgb(var(--border)/0.4)]',
    primary: 'bg-primary/10 text-primary-foreground border-primary/20',
    secondary: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30',
    subtle: 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800/30',
  };

  // Hover effects
  const hoverStyles = hover
    ? {
        default: 'hover:bg-gray-50 dark:hover:bg-[#20272d]',
        bordered: 'hover:border-[rgb(var(--border)/0.6)]',
        primary: 'hover:bg-primary/15',
        secondary: 'hover:bg-secondary/15',
        success: 'hover:bg-green-100 dark:hover:bg-green-900/30',
        warning: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
        danger: 'hover:bg-red-100 dark:hover:bg-red-900/30',
        info: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
        subtle: 'hover:bg-gray-100 dark:hover:bg-gray-900/40',
      }[variant]
    : '';

  // Shadow styles
  const shadowStyles = shadow ? 'shadow-[var(--box-shadow)] hover:shadow-[var(--box-hover-shadow)]' : '';

  // Border styles
  const borderStyles = border ? 'border' : '';

  // Rounded styles
  const roundedStyles = rounded ? 'rounded-[var(--box-border-radius)]' : '';

  // Interactive styles
  const interactiveStyles = interactive ? 'cursor-pointer' : '';

  // Alignment styles
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  // Padding styles
  const paddingStyles = padding ? sizeStyles[size] : '';

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        shadowStyles,
        borderStyles,
        roundedStyles,
        alignStyles,
        interactiveStyles,
        paddingStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {heading && (
        <h3 className="text-lg font-semibold mb-2">{heading}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
});

StyledBox.displayName = 'StyledBox';

export { StyledBox };