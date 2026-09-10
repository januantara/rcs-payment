import React from 'react';
import { ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import bniLogo from '../assets/icons/bni.png';
import wisma46Skyline from '../assets/footer/wisma46-skyline.jpg';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-slate-100 mt-12 select-none">
      {/* ── Main Single-Bar Footer Container ── */}
      <div className="relative w-full overflow-hidden bg-white border-b border-slate-100">
        {/* Right: Skyline Image with Smooth Horizontal Gradient Fade */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[26%] xl:w-[28%] pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.2) 42%, rgba(255,255,255,0) 75%)',
            }}
          />
          <img
            src={wisma46Skyline}
            alt="Jakarta Skyline Wisma 46"
            className="w-full h-full object-cover object-right"
          />
        </div>

        {/* Content Row: Logo | Aman | Mudah | Cepat */}
        <div className="w-full px-4 sm:px-6 md:px-8 py-5 sm:py-6 relative z-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-start gap-4 sm:gap-6 lg:gap-0 lg:max-w-[74%] xl:max-w-[72%]">
            {/* 1. BNI Brand — strictly left-aligned */}
            <div className="flex flex-col items-start justify-center shrink-0 pb-3.5 sm:pb-4 lg:pb-0 border-b border-slate-100 lg:border-b-0">
              <img
                src={bniLogo}
                alt="BNI"
                className="h-8 sm:h-9 w-auto object-contain object-left"
              />
              <p className="text-[11px] sm:text-xs text-[#005E7A] font-semibold mt-1.5 leading-tight tracking-tight text-left">
                {t.footer.tagline}
              </p>
            </div>

            {/* Vertical Divider 1 (Desktop) */}
            <div className="hidden lg:block w-px h-10 bg-slate-200/80 shrink-0 mx-6 xl:mx-8" />

            {/* Container for 3 Pillars on Mobile & Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-row lg:items-center gap-3.5 sm:gap-4 lg:gap-0 divide-y sm:divide-y-0 divide-slate-100 lg:divide-none">
              {/* 2. Pillar 1: Aman */}
              <div className="flex items-center gap-3 pt-2.5 sm:pt-0 lg:pr-4 shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#e8f3f8] text-[#003853] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#003853]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-[#002840] leading-tight">
                    {t.footer.pillar1Title}
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 max-w-[240px] sm:max-w-[155px]">
                    {t.footer.pillar1Desc}
                  </p>
                </div>
              </div>

              {/* Vertical Divider 2 (Desktop) */}
              <div className="hidden lg:block w-px h-10 bg-slate-200/80 shrink-0 mx-6 xl:mx-8" />

              {/* 3. Pillar 2: Mudah */}
              <div className="flex items-center gap-3 pt-2.5 sm:pt-0 lg:pr-4 shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#e8f3f8] text-[#003853] flex items-center justify-center shrink-0">
                  <CreditCard className="w-4.5 h-4.5 text-[#003853]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-[#002840] leading-tight">
                    {t.footer.pillar2Title}
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 max-w-[240px] sm:max-w-[155px]">
                    {t.footer.pillar2Desc}
                  </p>
                </div>
              </div>

              {/* Vertical Divider 3 (Desktop) */}
              <div className="hidden lg:block w-px h-10 bg-slate-200/80 shrink-0 mx-6 xl:mx-8" />

              {/* 4. Pillar 3: Cepat */}
              <div className="flex items-center gap-3 pt-2.5 sm:pt-0 shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#e8f3f8] text-[#003853] flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5 text-[#003853]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-[#002840] leading-tight">
                    {t.footer.pillar3Title}
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 max-w-[240px] sm:max-w-[160px]">
                    {t.footer.pillar3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Legal & Compliance Notice Bar ── */}
      <div className="w-full bg-white py-3.5 px-4 sm:px-6 md:px-8 relative z-20">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10.5px] sm:text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-slate-500">PT Bank Negara Indonesia (Persero) Tbk.</span> Hak Cipta Dilindungi.</p>
          <p className="text-slate-400">{t.footer.securityNotice}</p>
        </div>
      </div>
    </footer>
  );
};
