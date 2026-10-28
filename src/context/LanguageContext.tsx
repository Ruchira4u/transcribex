import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageOption } from '../utils/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'transcribex_global_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
    } catch {
      // Ignore localStorage read error
    }
    return 'en';
  });

  const setLanguage = (code: LanguageCode) => {
    if (TRANSLATIONS[code]) {
      setLanguageState(code);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      } catch {
        // Ignore localStorage write error
      }
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary if key is missing in active language
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageOption
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
