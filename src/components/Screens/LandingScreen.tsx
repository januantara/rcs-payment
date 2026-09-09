import React from 'react';
import {
  ChevronRight,
  ShieldCheck,
  User,
  FileText,
  Home,
  MapPin,
  CalendarClock,
  RefreshCcw,
  QrCode,
  Building2,
  ArrowRightLeft,
  ArrowRight,
  Zap,
  Check,
  Sparkles,
  Landmark,
} from 'lucide-react';
import { DebtorInfo, BillBreakdown, PaymentChannel, Language } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import kprHeroSoreBerawan from '../../assets/hero/kpr-sore-berawan.jpg';
import { bniLogo, bcaLogo, mandiriLogo, briLogo } from '../BankLogos';

interface LandingScreenProps {
  debtor: DebtorInfo;
  breakdown: BillBreakdown;
  onSelectChannel: (channel: PaymentChannel) => void;
  onOpenDetailModal: () => void;
  onContinue?: () => void;
  compact?: boolean;
  language?: Language;
}

interface PaymentMethodCardProps {
  onClick: () => void;
  icon: React.ReactNode;
  name: string;
  description: string;
  badge?: {
    text: string;
    variant?: 'orange' | 'neutral';
  };
  supportingChips?: React.ReactNode;
  speedNote: {
    icon: React.ReactNode;
    text: string;
  };
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  onClick,
  icon,
  name,
  description,
  badge,
  supportingChips,
  speedNote,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative bg-white rounded-2xl p-5 sm:p-5.5 border border-slate-200 hover:border-[#003853] hover:shadow-lg transition-all duration-200 text-left flex flex-col justify-between cursor-pointer overflow-hidden h-full"
  >
    <div className="w-full">
      {/* Top row: Icon container + Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 text-[#003853] group-hover:bg-[#003853] group-hover:text-white group-hover:border-[#003853] flex items-center justify-center transition-all duration-200 shrink-0">
          {icon}
        </div>

        {badge && (
          <span
            className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full border tracking-wide shrink-0 ${
              badge.variant === 'orange'
                ? 'bg-orange-50 text-[#F15A24] border-orange-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5 mb-4">
        <h3 className="font-bold text-base text-slate-900 group-hover:text-[#003853] transition-colors leading-snug">
          {name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Supporting Partner Chips / Bank Logos */}
      {supportingChips && (
        <div className="mb-4">
          {supportingChips}
        </div>
      )}
    </div>

    {/* Bottom Footer: Speed/feature note + Arrow button */}
    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto w-full">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
        {speedNote.icon}
        <span className="truncate">{speedNote.text}</span>
      </div>

      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 group-hover:bg-[#003853] group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  </button>
);

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

      {/* ── Hero Section ── */}
      <div className="relative w-full bg-gradient-to-br from-[#cce9f9] via-[#dff1fc] to-[#f0f8ff] border-b border-sky-100/80 px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-12 pb-[340px] md:pb-36 mb-60 md:mb-48">

        {/* Background photo — full width */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
          <img
            src={kprHeroSoreBerawan}
            alt="Perumahan KPR BNI - Sore Berawan"
            className="w-full h-full object-cover object-center sm:object-right"
          />
          {/* Gradient mask: strong on left → transparent right */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#cce9f9] via-[#dff1fc]/85 sm:via-[#dff1fc]/70 md:via-[#dff1fc]/60 to-transparent" />
          {/* Subtle bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 z-10 bg-gradient-to-t from-[#eef7fd]/50 to-transparent" />
        </div>

        {/* ── Hero Content Row ── */}
        <div className="w-full relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">

            {/* Left: Greeting */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002840] tracking-tight leading-tight">
                {t.landing.greeting}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm font-medium leading-relaxed">
                {t.landing.obligationNotice}
              </p>
            </div>

            {/* Right: Transaksi Aman badge — glassmorphism */}
            <div className="shrink-0 self-start sm:self-auto bg-white/55 backdrop-blur-md border border-white/70 shadow-lg rounded-2xl px-4 py-3 flex flex-col sm:items-end gap-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-400/10" />
                </div>
                <span>{t.landing.secureBadge}</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium sm:text-right leading-tight">
                {t.landing.protectsData}
              </span>
            </div>
          </div>
        </div>

        {/* ── Two Floating Cards ── */}
        <div className="absolute left-0 right-0 w-full px-4 sm:px-6 md:px-8 -bottom-20 md:-bottom-24 z-20 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

          {/* LEFT: Informasi Debitur */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/80 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-4">
              {t.landing.debtorTitle}
            </h2>

            <div className="space-y-3 text-xs sm:text-[13px]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-slate-500">{t.landing.debtorName}</span>
                </div>
                <span className="font-bold text-slate-800 text-right truncate">{debtor.name}</span>
              </div>
              <div className="h-px bg-slate-50" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-slate-500">{t.landing.contractNo}</span>
                </div>
                <span className="font-semibold text-slate-800 font-mono text-right">{debtor.contractNo}</span>
              </div>
              <div className="h-px bg-slate-50" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <Home className="w-3.5 h-3.5" />
                  <span className="text-slate-500">{t.landing.product}</span>
                </div>
                <span className="font-semibold text-slate-800 text-right max-w-[170px] leading-snug">{localizedDebtor.product}</span>
              </div>
              <div className="h-px bg-slate-50" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-slate-500">{t.landing.branch}</span>
                </div>
                <span className="font-semibold text-slate-800 text-right">{localizedDebtor.branch}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Total Kewajiban */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/80 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">
                {t.landing.totalObligation}
              </h2>

              {/* Amount — large gradient focal point */}
              <div
                className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
                style={{
                  background: 'linear-gradient(135deg, #002840 0%, #005E7A 55%, #007298 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatMoney(breakdown.total)}
              </div>
            </div>

            {/* Bottom Group: Due Date & Footer CTA */}
            <div className="mt-5 sm:mt-6 space-y-3">
              {/* Due date — 2 baris (rata kiri tanpa space kosong) */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <CalendarClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t.landing.dueDate}</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {localizedDebtor.dueDate}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onOpenDetailModal}
                  className="group/btn flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#007298] hover:text-[#F15A24] transition-colors cursor-pointer"
                >
                  <span>{t.landing.viewDetails}</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Pilih Metode Pembayaran ── */}
      <div className="w-full px-4 sm:px-6 md:px-8 pb-16 sm:pb-20">
        {/* Section Header */}
        <div className="mb-6 sm:mb-7">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#002840] tracking-tight leading-tight">
            {t.landing.chooseMethodTitle}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {/* 1. Virtual Account */}
          <PaymentMethodCard
            onClick={() => onSelectChannel('va')}
            icon={<Building2 className="w-5 h-5" />}
            name={t.landing.vaName}
            description={t.landing.vaDesc}
            badge={{
              text: t.landing.badgePopular || 'Paling Populer',
              variant: 'orange',
            }}
            supportingChips={
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium pl-1">Bank:</span>
                <div className="flex items-center gap-1.5">
                  <img src={bniLogo} alt="BNI" className="h-3 w-auto object-contain" />
                  <img src={bcaLogo} alt="BCA" className="h-2.5 w-auto object-contain" />
                  <img src={mandiriLogo} alt="Mandiri" className="h-2.5 w-auto object-contain" />
                  <img src={briLogo} alt="BRI" className="h-2.5 w-auto object-contain" />
                </div>
              </div>
            }
            speedNote={{
              icon: <Zap className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />,
              text: t.landing.speedRealtime || 'Verifikasi Real-Time',
            }}
          />

          {/* 2. QRIS */}
          <PaymentMethodCard
            onClick={() => onSelectChannel('qris')}
            icon={<QrCode className="w-5 h-5" />}
            name={t.landing.qrisName}
            description={t.landing.qrisDesc}
            supportingChips={
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold text-[9px]">
                  QRIS / GPN
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  Semua M-Banking & E-Wallet
                </span>
              </div>
            }
            speedNote={{
              icon: <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />,
              text: t.landing.speedInstant || 'Langsung Terverifikasi',
            }}
          />

          {/* 3. Transfer Antar Bank */}
          <PaymentMethodCard
            onClick={() => onSelectChannel('transfer')}
            icon={<Landmark className="w-5 h-5" />}
            name={t.landing.transferName}
            description={t.landing.transferDesc}
            supportingChips={
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold text-[9px]">
                  BI-FAST
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  ATM Bersama • Prima • Link
                </span>
              </div>
            }
            speedNote={{
              icon: <Building2 className="w-3.5 h-3.5 text-slate-400" />,
              text: t.landing.speedNetwork || 'Jaringan Antar Bank',
            }}
          />

          {/* 4. Auto Debit */}
          <PaymentMethodCard
            onClick={() => onSelectChannel('autodebit')}
            icon={<RefreshCcw className="w-5 h-5" />}
            name={t.landing.autodebitName}
            description={t.landing.autodebitDesc}
            supportingChips={
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold text-[9px]">
                  REK BNI
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  Debet rutin bebas khawatir DPD
                </span>
              </div>
            }
            speedNote={{
              icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />,
              text: t.landing.speedAutomatic || 'Debet Otomatis',
            }}
          />
        </div>
      </div>
    </div>
  );
};
