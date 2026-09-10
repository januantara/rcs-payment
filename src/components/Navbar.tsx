import React from 'react';
import { Language } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import bniLogo from '../assets/icons/bni.png';

const FlagID: React.FC<{ active?: boolean }> = ({ active }) => (
  <span className={`w-3.5 h-2.5 rounded-[2px] overflow-hidden inline-flex flex-col shadow-2xs shrink-0 ${active ? 'border border-white/40' : 'border border-slate-300/80'}`}>
    <span className="w-full h-1/2 bg-[#E11D48]" />
    <span className="w-full h-1/2 bg-white" />
  </span>
);

const FlagEN: React.FC<{ active?: boolean }> = ({ active }) => (
  <span className={`w-3.5 h-2.5 rounded-[2px] overflow-hidden inline-flex shadow-2xs shrink-0 ${active ? 'border border-white/40' : 'border border-slate-300/80'}`}>
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
      <div className="w-full px-3 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Logo BNI dengan text "Retail Collection System" */}
        <div
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLogoClick?.(); }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group transition-all duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005E6A]/30 rounded-lg min-w-0"
          title={t.navbar.backToHome}
        >
          {/* Logo BNI from Assets */}
          <div className="shrink-0">
            <img
              src={bniLogo}
              alt="BNI"
              className="h-6 sm:h-8 w-auto object-contain"
            />
          </div>

          {/* Divider */}
          <div className="h-5 sm:h-7 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 shrink-0 mx-0.5" />

          {/* Text: Retail Collection System */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs sm:text-sm md:text-[15px] font-bold text-[#003853] tracking-tight leading-tight truncate">
              {t.navbar.systemName}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-normal leading-tight hidden sm:block truncate mt-0.5">
              {language === 'EN' ? 'Official BNI Payment Channel' : 'Kanal Resmi Pembayaran BNI'}
            </span>
          </div>
        </div>

        {/* Right: Segmented Pill Toggle for Change Language [ ID | EN ] */}
        <div
          className="inline-flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-100/80 border border-slate-200/80 shadow-2xs gap-0.5 sm:gap-1 shrink-0"
          role="group"
          aria-label={t.navbar.selectLanguage}
        >
          <button
            type="button"
            onClick={() => handleLangChange('ID')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:w-14 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer select-none shrink-0 ${
              language === 'ID'
                ? 'bg-[#003853] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#003853] hover:bg-white/60'
            }`}
            aria-pressed={language === 'ID'}
            title="Bahasa Indonesia"
          >
            <FlagID active={language === 'ID'} />
            <span>ID</span>
          </button>

          {/* Sekat / Divider - Perfectly Centered */}
          <div className="w-px h-3.5 sm:h-4 bg-slate-300/80 shrink-0 self-center" />

          <button
            type="button"
            onClick={() => handleLangChange('EN')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:w-14 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer select-none shrink-0 ${
              language === 'EN'
                ? 'bg-[#003853] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#003853] hover:bg-white/60'
            }`}
            aria-pressed={language === 'EN'}
            title="English"
          >
            <FlagEN active={language === 'EN'} />
            <span>EN</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
