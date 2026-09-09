import React from 'react';
import { Language } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import bniLogo from '../assets/icons/bni.png';

const FlagID: React.FC = () => (
  <span className="w-3.5 h-2.5 rounded-[2px] overflow-hidden inline-flex flex-col border border-slate-300/80 shadow-2xs shrink-0">
    <span className="w-full h-1/2 bg-[#E11D48]" />
    <span className="w-full h-1/2 bg-white" />
  </span>
);

const FlagEN: React.FC = () => (
  <span className="w-3.5 h-2.5 rounded-[2px] overflow-hidden inline-flex border border-slate-300/80 shadow-2xs shrink-0">
    <svg viewBox="0 0 60 30" className="w-full h-full block">
      <clipPath id="uk-flag-clip"><rect width="60" height="30"/></clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  </span>
);

interface NavbarProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language: propLanguage,
  onLanguageChange: propOnLanguageChange,
  onLogoClick,
}) => {
  const { language: ctxLanguage, setLanguage: ctxSetLanguage, t } = useLanguage();
  const language = propLanguage || ctxLanguage;

  const handleLangChange = (lang: Language) => {
    if (propOnLanguageChange) propOnLanguageChange(lang);
    ctxSetLanguage(lang);
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Logo BNI dengan text "Retail Collection System" */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
          title={t.navbar.backToHome}
        >
          {/* Logo BNI from Assets */}
          <img
            src={bniLogo}
            alt="BNI"
            className="h-7 sm:h-8 w-auto object-contain group-hover:scale-105 transition-transform"
          />

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Text: Retail Collection System */}
          <span className="text-xs sm:text-sm font-bold text-[#003853] tracking-tight">
            {t.navbar.systemName}
          </span>
        </div>

        {/* Right: Segmented Pill Toggle for Change Language [ ID | EN ] */}
        <div
          className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-2xs"
          role="group"
          aria-label={t.navbar.selectLanguage}
        >
          <button
            type="button"
            onClick={() => handleLangChange('ID')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
              language === 'ID'
                ? 'bg-white text-[#005E7A] shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
            aria-pressed={language === 'ID'}
            title="Bahasa Indonesia"
          >
            <FlagID />
            <span>ID</span>
          </button>

          <button
            type="button"
            onClick={() => handleLangChange('EN')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
              language === 'EN'
                ? 'bg-white text-[#005E7A] shadow-xs ring-1 ring-slate-900/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
            aria-pressed={language === 'EN'}
            title="English"
          >
            <FlagEN />
            <span>EN</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
