import { I18N_CONFIG } from './config';
import type { Locale } from './config';

/**
 * i18n formatting utilities
 * 
 * This file contains formatting functions for dates, numbers, and other
 * locale-specific formatting operations.
 */

/**
 * Format a date according to locale
 * 
 * @param date - Date to format
 * @param locale - Locale to use for formatting
 * @param format - Format type ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date, 
  locale: Locale, 
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const formatPattern = I18N_CONFIG.dateFormatting[locale][format];
  
  // Use Intl API for locale-aware date formatting
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : format === 'medium' ? 'short' : 'long',
    day: '2-digit',
    weekday: format === 'full' ? 'long' : undefined,
  }).format(date);
};

/**
 * Format a time according to locale
 * 
 * @param date - Date object containing the time to format
 * @param locale - Locale to use for formatting
 * @param format - Format type ('short', 'medium', 'long')
 * @returns Formatted time string
 */
export const formatTime = (
  date: Date, 
  locale: Locale, 
  format: 'short' | 'medium' | 'long' = 'short'
): string => {
  // Use Intl API for locale-aware time formatting
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  if (format === 'medium' || format === 'long') {
    options.second = '2-digit';
  }
  
  if (format === 'long') {
    options.timeZoneName = 'short';
  }
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Format a number according to locale
 * 
 * @param number - Number to format
 * @param locale - Locale to use for formatting
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (
  number: number, 
  locale: Locale, 
  decimals = 2
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format a currency amount according to locale
 * 
 * @param amount - Amount to format
 * @param locale - Locale to use for formatting
 * @param currency - Optional override currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  locale: Locale,
  currency?: string
): string => {
  const currencyCode = currency || I18N_CONFIG.numberFormatting[locale].currency;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Format a percentage according to locale
 * 
 * @param value - Value to format (0-1)
 * @param locale - Locale to use for formatting
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (
  value: number, 
  locale: Locale, 
  decimals = 0
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a relative time according to locale
 * 
 * @param value - Time value (positive for future, negative for past)
 * @param unit - Time unit
 * @param locale - Locale to use for formatting
 * @returns Formatted relative time string (e.g., "2 days ago", "in 3 hours")
 */
export const formatRelativeTime = (
  value: number,
  unit: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second',
  locale: Locale
): string => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  return rtf.format(value, unit);
};