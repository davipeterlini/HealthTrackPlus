/**
 * i18n configuration
 * 
 * This file contains configuration for the internationalization system,
 * including available languages and formatting settings.
 */

export type Locale = 'en' | 'pt';

// Define available languages
export const AVAILABLE_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr', // left-to-right
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    dir: 'ltr', // left-to-right
  },
];

// Default language if none is specified
export const DEFAULT_LANGUAGE = 'en';

// i18n configuration settings
export const I18N_CONFIG = {
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Default namespace
  defaultNS: 'translation',
  
  // Key separator for nested keys
  keySeparator: '.',
  
  // Allow namespaces with dots in keys
  nsSeparator: ':',
  
  // Plurals configuration
  plurals: {
    en: {
      pluralRules: {
        0: 'zero',
        1: 'one',
        other: 'other',
      },
    },
    pt: {
      pluralRules: {
        0: 'zero',
        1: 'one',
        other: 'other',
      },
    },
  },
  
  // Date formatting options
  dateFormatting: {
    en: {
      short: 'MM/DD/YYYY',
      medium: 'MMM D, YYYY',
      long: 'MMMM D, YYYY',
      full: 'dddd, MMMM D, YYYY',
    },
    pt: {
      short: 'DD/MM/YYYY',
      medium: 'D MMM, YYYY',
      long: 'D MMMM, YYYY',
      full: 'dddd, D MMMM, YYYY',
    },
  },
  
  // Number formatting options
  numberFormatting: {
    en: {
      currency: 'USD',
      currencySymbol: '$',
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    pt: {
      currency: 'BRL',
      currencySymbol: 'R$',
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
  },
  
  // Time formatting options
  timeFormatting: {
    en: {
      short: 'h:mm a',
      medium: 'h:mm:ss a',
      long: 'h:mm:ss a z',
    },
    pt: {
      short: 'HH:mm',
      medium: 'HH:mm:ss',
      long: 'HH:mm:ss z',
    },
  },
};

/**
 * Get available languages
 * 
 * @returns Array of available languages
 */
export const getAvailableLanguages = () => AVAILABLE_LANGUAGES;

/**
 * Check if language is supported
 * 
 * @param code - Language code to check
 * @returns True if language is supported, false otherwise
 */
export const isLanguageSupported = (code: string): boolean => {
  return AVAILABLE_LANGUAGES.some(lang => lang.code === code);
};

/**
 * Get language details by code
 * 
 * @param code - Language code
 * @returns Language details or undefined if not found
 */
export const getLanguageByCode = (code: string) => {
  return AVAILABLE_LANGUAGES.find(lang => lang.code === code);
};