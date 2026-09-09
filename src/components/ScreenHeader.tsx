import React, { useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { Language } from '../types';

interface ScreenHeaderProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  onLogoClick?: () => void;
  compact?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  language = 'ID',
  onLanguageChange,
  onLogoClick,
  compact = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={`w-full flex items-center justify-between border-b border-slate-100 bg-white ${compact ? 'px-4 py-2.5' : 'px-5 py-3'}`}>
      {/* Brand: BNI 46 Logo + Retail Collection System */}
      <div
        onClick={onLogoClick}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        {/* BNI 46 Icon */}
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#F15A24] text-white shadow-2xs">
          <span className="text-[10px] font-black tracking-tighter">46</span>
        </div>
        <span className="font-extrabold text-lg text-[#005E7A] tracking-tight group-hover:text-[#F15A24] transition-colors">
          BNI
        </span>
        <div className="h-4 w-px bg-slate-200 mx-0.5" />
        <span className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-tight">
          Retail Collection System
        </span>
      </div>

      {/* Language Selector: ID v */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 py-1 px-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span>{language}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showDropdown && onLanguageChange && (
          <div className="absolute right-0 mt-1 w-28 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs">
            <button
              onClick={() => {
                onLanguageChange('ID');
                setShowDropdown(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-slate-50 ${
                language === 'ID' ? 'font-bold text-[#F15A24]' : 'text-slate-700'
              }`}
            >
              <span>ID (Bahasa)</span>
              {language === 'ID' && <Check className="w-3 h-3 text-[#F15A24]" />}
            </button>
            <button
              onClick={() => {
                onLanguageChange('EN');
                setShowDropdown(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-slate-50 ${
                language === 'EN' ? 'font-bold text-[#F15A24]' : 'text-slate-700'
              }`}
            >
              <span>EN (English)</span>
              {language === 'EN' && <Check className="w-3 h-3 text-[#F15A24]" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
