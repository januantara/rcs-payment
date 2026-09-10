import React, { useState } from 'react';
import { BniLogo } from './BankLogos';
import { ShieldCheck, Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onLogoClick,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div 
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLogoClick?.(); }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none transition-all duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005E6A]/30 rounded-lg min-w-0 pr-1"
          title={language === 'EN' ? 'Back to Home' : 'Kembali ke Beranda'}
        >
          {/* BNI Official Logo */}
          <div className="shrink-0">
            <BniLogo className="h-6 sm:h-8" />
          </div>

          {/* Divider */}
          <div className="h-5 sm:h-7 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 shrink-0 mx-0.5" />

          {/* Brand Identity & Portal Hierarchy */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs sm:text-sm md:text-[15px] font-bold text-[#003853] tracking-tight leading-tight truncate">
              Retail Collection System
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-normal leading-tight hidden sm:block truncate mt-0.5">
              {language === 'EN' ? 'Official BNI Payment Channel' : 'Kanal Resmi Pembayaran BNI'}
            </span>
          </div>
        </div>

        {/* Right: Security info & Language selector */}
        <div className="flex items-center gap-3">
          {/* Security badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kanal Resmi BNI</span>
          </div>

          {/* Language dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Pilih Bahasa"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onLanguageChange('ID');
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 ${
                    language === 'ID' ? 'font-bold text-[#F15A24]' : 'text-slate-700'
                  }`}
                >
                  <span>Bahasa (ID)</span>
                  {language === 'ID' && <Check className="w-3.5 h-3.5 text-[#F15A24]" />}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('EN');
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 ${
                    language === 'EN' ? 'font-bold text-[#F15A24]' : 'text-slate-700'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'EN' && <Check className="w-3.5 h-3.5 text-[#F15A24]" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
