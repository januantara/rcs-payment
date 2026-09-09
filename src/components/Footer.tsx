import React from 'react';
import { ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import bniLogo from '../assets/icons/bni.png';
import wisma46Skyline from '../assets/footer/wisma46-skyline.jpg';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-12 relative overflow-hidden select-none">
      {/* Right: Skyline Image with Smooth Gradient Transition stretching to right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[50%] md:w-[42%] lg:w-[35%] xl:w-[30%] pointer-events-none overflow-hidden select-none">
        {/* Horizontal Gradient Mask: Seamless blend from white background into the city skyline photo */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.95) 18%, rgba(255,255,255,0.4) 52%, rgba(255,255,255,0) 85%)',
          }}
        />
        <img
          src={wisma46Skyline}
          alt="Jakarta Skyline Wisma 46"
          className="w-full h-full object-cover object-right opacity-30 sm:opacity-100 transition-opacity"
        />
      </div>

      {/* Main Full-Width Content Container */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-5 sm:py-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 items-center">
          {/* 1. BNI Brand */}
          <div className="lg:col-span-3 p-3 sm:p-4 lg:pr-6 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <img
                src={bniLogo}
                alt="BNI"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1.5 leading-tight">
              {t.footer.tagline}
            </p>
          </div>

          {/* 2. Pillar 1: Aman */}
          <div className="lg:col-span-3 p-3 sm:p-4 lg:px-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#003853] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {t.footer.pillar1Title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                {t.footer.pillar1Desc}
              </p>
            </div>
          </div>

          {/* 3. Pillar 2: Mudah */}
          <div className="lg:col-span-3 p-3 sm:p-4 lg:px-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#003853] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {t.footer.pillar2Title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                {t.footer.pillar2Desc}
              </p>
            </div>
          </div>

          {/* 4. Pillar 3: Cepat */}
          <div className="lg:col-span-3 p-3 sm:p-4 lg:px-6 flex items-center gap-3 sm:border-t lg:border-t-0 sm:border-slate-100">
            <div className="w-8 h-8 rounded-full bg-[#003853] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {t.footer.pillar3Title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                {t.footer.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Compliance Notice Bar (Full Width) */}
      <div className="w-full bg-slate-50/90 border-t border-slate-100 py-3 px-4 sm:px-6 md:px-8 lg:px-12 relative z-20">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10.5px] sm:text-[11px] text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} PT Bank Negara Indonesia (Persero) Tbk. {t.footer.copyright}</p>
          <p>{t.footer.securityNotice}</p>
        </div>
      </div>
    </footer>
  );
};
