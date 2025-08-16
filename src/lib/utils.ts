import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < parseInt(breakpoints.md);
}

export function isTablet() {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg);
}

export function isDesktop() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= parseInt(breakpoints.lg);
}