/**
 * i18n configuration module
 * 
 * This file exports all i18n configuration and utility functions
 * from a single entry point to simplify imports.
 */

export * from './config';
export * from './format';

// Re-export the initialization function
import initialize from './initialize';
export { initialize };