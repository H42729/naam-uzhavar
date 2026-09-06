/**
 * Language Context for Naam Uzhavar Platform
 * Supports English ('en') and Tamil ('ta') with persistence in localStorage.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en';
import ta from '../translations/ta';
import apiClient from '../services/apiClient';

const LanguageContext = createContext(null);

const translations = {
  en,
  ta
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const savedUser = localStorage.getItem('naam_uzhavar_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.preferredLanguage) return parsed.preferredLanguage;
      }
      const saved = localStorage.getItem('preferred_language');
      return saved === 'ta' ? 'ta' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = (newLang) => {
    const validLang = newLang === 'ta' ? 'ta' : 'en';
    setLanguageState(validLang);
    try {
      localStorage.setItem('preferred_language', validLang);
      const savedUser = localStorage.getItem('naam_uzhavar_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.preferredLanguage = validLang;
        localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn('Unable to persist language choice to localStorage:', e);
    }

    // Sync language change to backend API
    apiClient
      .post('/translations/preference', { language: validLang })
      .catch(() => {});
    apiClient
      .patch('/auth/me/language', { preferredLanguage: validLang })
      .catch(() => {});
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  /**
   * Helper translation function t()
   * @param {string} key - Dictionary key (e.g. 'dashboard')
   * @param {string} [fallback] - Optional fallback string if key is not found
   */
  const t = (key, fallback = '') => {
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    // Fallback to English if Tamil key is missing
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isTamil: language === 'ta',
        isEnglish: language === 'en'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
