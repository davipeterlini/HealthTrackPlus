import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, I18N_CONFIG } from './config';

// Import translations
import enTranslations from '../../locales/en/translation.json';
import ptTranslations from '../../locales/pt/translation.json';

/**
 * Initialize i18n configuration for the application
 * 
 * This function sets up i18next with appropriate configuration
 * and loads all translation resources.
 */
const initialize = () => {
  i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      // Resources containing translations
      resources: {
        en: {
          translation: enTranslations
        },
        pt: {
          translation: ptTranslations
        }
      },
      
      // Default language to use if translation isn't available
      fallbackLng: DEFAULT_LANGUAGE,
      
      // Debug mode (only in development)
      debug: I18N_CONFIG.debug,
      
      // Default namespace
      defaultNS: I18N_CONFIG.defaultNS,
      
      // Key separator for nested keys
      keySeparator: I18N_CONFIG.keySeparator,
      
      // Allow namespaces with dots in keys
      nsSeparator: I18N_CONFIG.nsSeparator,
      
      // Don't escape values with HTML
      interpolation: {
        escapeValue: false
      },
      
      // React settings
      react: {
        useSuspense: true,
      },
      
      // Detection options
      detection: {
        // Order of detectors
        order: ['localStorage', 'navigator'],
        
        // Cache user language
        caches: ['localStorage'],
        
        // Look for language code in localStorage
        lookupLocalStorage: 'i18nextLng',
      },
    });
    
  return i18n;
};

export default initialize;