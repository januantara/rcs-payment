import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, DebtorInfo } from '../types';
import { translations, TranslationSchema } from './translations';
import { formatRupiah } from '../utils/formatters';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  formatMoney: (amount: number) => string;
  formatDateLocalized: (dateString: string) => string;
  getLocalizedDebtor: (debtor: DebtorInfo) => {
    product: string;
    loanTenor: string;
    installmentNo: string;
    dueDate: string;
    branch: string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'bni_app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === 'ID' || saved === 'EN') return saved;
    }
    return 'ID';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang.toLowerCase();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language.toLowerCase();
    }
  }, [language]);

  const t = translations[language];

  // Format currency respecting language
  const formatMoney = (amount: number): string => {
    if (language === 'EN') {
      return `IDR ${new Intl.NumberFormat('en-US').format(amount)}`;
    }
    return formatRupiah(amount);
  };

  // Localize date string (e.g. "10 September 2026" vs "September 10, 2026")
  const formatDateLocalized = (dateString: string): string => {
    if (language === 'EN') {
      // Map Indonesian months to English if present
      const mapped = dateString
        .replace('Januari', 'January')
        .replace('Februari', 'February')
        .replace('Maret', 'March')
        .replace('Mei', 'May')
        .replace('Juni', 'June')
        .replace('Juli', 'July')
        .replace('Agustus', 'August')
        .replace('Oktober', 'October')
        .replace('Desember', 'December');

      // Convert "10 September 2026 | 10:32 WIB" -> "September 10, 2026 | 10:32 GMT+7"
      return mapped
        .replace(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/, '$2 $1, $3')
        .replace('WIB', 'GMT+7');
    }
    return dateString;
  };

  // Localize debtor specific attributes
  const getLocalizedDebtor = (debtor: DebtorInfo) => {
    if (language === 'EN') {
      return {
        product: 'Home Ownership Loan (KPR)',
        loanTenor: '180 Months (15 Years)',
        installmentNo: '36th of 180',
        dueDate: formatDateLocalized(debtor.dueDate),
        branch: debtor.branch.replace('BNI KC', 'BNI Main Branch'),
      };
    }
    return {
      product: debtor.product,
      loanTenor: debtor.loanTenor,
      installmentNo: debtor.installmentNo,
      dueDate: debtor.dueDate,
      branch: debtor.branch,
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatMoney,
        formatDateLocalized,
        getLocalizedDebtor,
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
