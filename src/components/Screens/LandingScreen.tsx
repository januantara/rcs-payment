import React from 'react';
import { ChevronRight, Building2, QrCode, ArrowRightLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { DebtorInfo, BillBreakdown, PaymentChannel, Language } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface LandingScreenProps {
  debtor: DebtorInfo;
  breakdown: BillBreakdown;
  onSelectChannel: (channel: PaymentChannel) => void;
  onOpenDetailModal: () => void;
  onContinue?: () => void;
  compact?: boolean;
  language?: Language;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  debtor,
  breakdown,
  onSelectChannel,
  onOpenDetailModal,
}) => {
  const { t, formatMoney, getLocalizedDebtor } = useLanguage();
  const localizedDebtor = getLocalizedDebtor(debtor);

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Hero Section - Full Width, flush with Navbar (no margin-top) */}
      <div className="relative w-full bg-gradient-to-r from-[#dcf0fb] via-[#e5f4fd] to-[#f4faff] border-b border-sky-100/80 px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-10 pb-[330px] md:pb-32 mb-24 md:mb-28 shadow-2xs">
        {/* Modern Residential Housing Cluster Background Image (KPR) - edge to edge */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] md:w-[50%] pointer-events-none overflow-hidden select-none">
          {/* Soft gradient mask to blend image smoothly into the blue sky on the left */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#e5f4fd] via-[#e5f4fd]/50 to-transparent" />
          <img
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80"
            alt="Perumahan KPR"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right opacity-90"
          />
        </div>

        {/* Inner Container for Header Row - Full width matching navbar */}
        <div className="w-full">
          {/* Top Header Row inside Hero */}
          <div className="relative z-20 flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003853] tracking-tight">
                {t.landing.greeting}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-md font-medium leading-relaxed">
                {t.landing.obligationNotice}
              </p>
            </div>

            {/* Transaksi Aman Badge with Backdrop Blur */}
            <div className="shrink-0 self-start sm:self-auto bg-white/40 backdrop-blur-md border border-white/50 shadow-2xs rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex flex-col sm:items-end">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-400/20 shrink-0" />
                <span>{t.landing.secureBadge}</span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-700 font-medium mt-0.5 sm:text-right">
                {t.landing.protectsData}
              </span>
            </div>
          </div>
        </div>

        {/* Two Floating White Information Cards - Full width matching navbar, 32px gap from hero content */}
        <div className="absolute left-0 right-0 w-full px-4 sm:px-6 md:px-8 -bottom-16 md:-bottom-20 z-20 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Left Card: Informasi Debitur */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-md">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-4">
              {t.landing.debtorTitle}
            </h2>
            <div className="space-y-2.5 text-xs sm:text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.landing.debtorName}</span>
                <span className="font-bold text-slate-800">{debtor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.landing.contractNo}</span>
                <span className="font-semibold text-slate-800">{debtor.contractNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.landing.product}</span>
                <span className="font-semibold text-slate-800">{localizedDebtor.product}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.landing.branch}</span>
                <span className="font-semibold text-slate-800">{localizedDebtor.branch}</span>
              </div>
            </div>
          </div>

          {/* Right Card: Total Kewajiban */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                {t.landing.totalObligation}
              </h2>
              <div className="text-2xl sm:text-3xl font-black text-[#003853] tracking-tight my-2">
                {formatMoney(breakdown.total)}
              </div>
              <div className="mt-1">
                <div className="text-xs text-slate-400 font-medium">
                  {t.landing.dueDate}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {localizedDebtor.dueDate}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={onOpenDetailModal}
                className="text-xs sm:text-sm font-semibold text-[#007298] hover:text-[#F15A24] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{t.landing.viewDetails}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Pilih cara pembayaran yang paling nyaman untuk Anda */}
      <div className="w-full px-4 sm:px-6 md:px-8 pb-10">
        <h2 className="text-sm sm:text-base font-bold text-[#005E7A] mb-3.5 sm:mb-4">
          {t.landing.chooseMethodTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
          {/* 1. Virtual Account */}
          <button
            onClick={() => onSelectChannel('va')}
            className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-[#005E7A]/40 transition-all text-left flex flex-col items-start cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-3.5 shadow-2xs group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#005E7A] transition-colors mb-1">
              {t.landing.vaName}
            </span>
            <span className="text-xs text-slate-500 leading-relaxed">
              {t.landing.vaDesc}
            </span>
          </button>

          {/* 2. QRIS */}
          <button
            onClick={() => onSelectChannel('qris')}
            className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-[#005E7A]/40 transition-all text-left flex flex-col items-start cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-3.5 shadow-2xs group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#005E7A] transition-colors mb-1">
              {t.landing.qrisName}
            </span>
            <span className="text-xs text-slate-500 leading-relaxed">
              {t.landing.qrisDesc}
            </span>
          </button>

          {/* 3. Transfer Bank */}
          <button
            onClick={() => onSelectChannel('transfer')}
            className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-[#005E7A]/40 transition-all text-left flex flex-col items-start cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-3.5 shadow-2xs group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#005E7A] transition-colors mb-1">
              {t.landing.transferName}
            </span>
            <span className="text-xs text-slate-500 leading-relaxed">
              {t.landing.transferDesc}
            </span>
          </button>

          {/* 4. Auto Debit */}
          <button
            onClick={() => onSelectChannel('autodebit')}
            className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-[#005E7A]/40 transition-all text-left flex flex-col items-start cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-3.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#005E7A] transition-colors mb-1">
              {t.landing.autodebitName}
            </span>
            <span className="text-xs text-slate-500 leading-relaxed">
              {t.landing.autodebitDesc}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
