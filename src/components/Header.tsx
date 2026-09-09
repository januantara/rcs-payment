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
          className="flex items-center gap-3 cursor-pointer group"
          title="Kembali ke Beranda"
        >
          <BniLogo className="h-8" />
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          <span className="text-xs sm:text-sm font-semibold text-slate-600 tracking-tight hidden sm:inline">
            Retail Collection System
          </span>
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
