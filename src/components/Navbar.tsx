import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { Language } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import bniLogo from '../assets/icons/bni.png';

const FlagID: React.FC = () => (
  <span className="w-4 h-3 rounded-[2px] overflow-hidden flex flex-col border border-slate-300 shadow-2xs shrink-0 inline-block">
    <span className="w-full h-1/2 bg-[#E11D48]" />
    <span className="w-full h-1/2 bg-white" />
  </span>
);

const FlagEN: React.FC = () => (
  <span className="w-4 h-3 rounded-[2px] overflow-hidden inline-flex border border-slate-300 shadow-2xs shrink-0">
    <svg viewBox="0 0 60 30" className="w-full h-full">
      <clipPath id="uk-flag-clip-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="uk-flag-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#uk-flag-clip-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-flag-clip-t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
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

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-slate-100 shadow-2xs sticky top-0 z-50">
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
          <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">
            {t.navbar.systemName}
          </span>
        </div>

        {/* Right: Button for Change Language */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            aria-label={t.navbar.selectLanguage}
          >
            {language === 'ID' ? <FlagID /> : <FlagEN />}
            <span className="font-bold uppercase tracking-wider text-slate-800">{language}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Language Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.navbar.selectLanguage}
              </div>
              <button
                type="button"
                onClick={() => {
                  handleLangChange('ID');
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                  language === 'ID' ? 'font-bold text-[#F15A24] bg-orange-50/60' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FlagID />
                  <span>{t.navbar.indonesian}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">ID</span>
                  {language === 'ID' && <Check className="w-3.5 h-3.5 text-[#F15A24]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleLangChange('EN');
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                  language === 'EN' ? 'font-bold text-[#F15A24] bg-orange-50/60' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FlagEN />
                  <span>{t.navbar.english}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">EN</span>
                  {language === 'EN' && <Check className="w-3.5 h-3.5 text-[#F15A24]" />}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
