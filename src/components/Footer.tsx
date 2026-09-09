import React from 'react';
import { ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { Wisma46Visual } from './Wisma46Visual';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-12">
      {/* 3 Pillars & Skyline Banner matching mockup */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Col 1: BNI Logo & Tagline */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#F15A24] text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-2xs">
                46
              </div>
              <span className="font-black text-2xl text-[#005E7A] tracking-tight">
                BNI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {t.footer.tagline}
            </p>
          </div>

          {/* Col 2: 3 Value Pillars (Aman, Mudah, Cepat) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l lg:border-r border-slate-200 pt-4 lg:pt-0 lg:px-6">
            {/* Pillar 1: Aman */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#005E7A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.footer.pillar1Title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {t.footer.pillar1Desc}
                </p>
              </div>
            </div>

            {/* Pillar 2: Mudah */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#005E7A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.footer.pillar2Title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {t.footer.pillar2Desc}
                </p>
              </div>
            </div>

            {/* Pillar 3: Cepat */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#005E7A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.footer.pillar3Title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {t.footer.pillar3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Col 3: Wisma 46 Skyline Graphic */}
          <div className="lg:col-span-3 h-24 sm:h-28 relative rounded-xl overflow-hidden hidden sm:block">
            <Wisma46Visual variant="footer" className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Official Legal & OJK notice */}
      <div className="bg-slate-50 border-t border-slate-200/80 py-3.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} PT Bank Negara Indonesia (Persero) Tbk. {t.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <span>{t.footer.securityNotice}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
