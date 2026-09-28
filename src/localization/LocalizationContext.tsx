import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { translations, Translations } from './translations';

interface LocalizationContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: { code: LanguageCode; label: string; nativeName: string }[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'arsafe_selected_language';

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return (saved === 'hi' || saved === 'sat' || saved === 'en') ? (saved as LanguageCode) : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const languages = [
    { code: 'en' as LanguageCode, label: 'English', nativeName: 'English' },
    { code: 'hi' as LanguageCode, label: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'sat' as LanguageCode, label: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  ];

  const value: LocalizationContextType = {
    language,
    setLanguage,
    t: translations[language],
    languages,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
