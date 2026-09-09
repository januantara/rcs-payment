import React, { useState } from 'react';
import { Clock, Copy, Check, ChevronLeft, Sparkles, RefreshCw, CreditCard, FileCheck, Loader2, QrCode } from 'lucide-react';
import { PaymentChannel } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface WaitingScreenProps {
  channel?: PaymentChannel;
  vaNumber: string;
  amount: number;
  expiryDateTime: string;
  onPaymentSuccess: () => void;
  onBackToHome: () => void;
  compact?: boolean;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  channel = 'va',
  vaNumber,
  amount,
  expiryDateTime,
  onPaymentSuccess,
  onBackToHome,
  compact = false,
}) => {
  const { t, formatMoney, formatDateLocalized } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [activeLoadingStep, setActiveLoadingStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showQrPreview, setShowQrPreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveLoadingStep(2);

    setTimeout(() => {
      setCompletedSteps([1, 2]);
      setActiveLoadingStep(3);
    }, 1300);

    setTimeout(() => {
      setCompletedSteps([1, 2, 3]);
      setActiveLoadingStep(4);
    }, 2500);

    setTimeout(() => {
      setCompletedSteps([1, 2, 3, 4]);
      setActiveLoadingStep(null);
    }, 3600);

    setTimeout(() => {
      onPaymentSuccess();
    }, 4200);
  };

  const getProgressLineWidth = () => {
    if (completedSteps.includes(4)) return '75%';
    if (completedSteps.includes(3) || activeLoadingStep === 4) return '75%';
    if (completedSteps.includes(2) || activeLoadingStep === 3) return '50%';
    if (activeLoadingStep === 2) return '25%';
    return '0%';
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-300 ${compact ? 'text-xs' : ''}`}>
      {/* Central Waiting Icon & Status */}
      <div className="flex flex-col items-center text-center pt-1 pb-2">
        {/* Yellow Clock Circle Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-100/70 border border-amber-300 text-amber-500 flex items-center justify-center mb-3 shadow-2xs">
          <Clock className="w-7 h-7 stroke-[2.2]" />
        </div>

        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {t.waiting.title}
        </h1>
        <p className="mt-1 text-xs text-slate-500 max-w-sm font-medium leading-relaxed">
          {t.waiting.desc}
        </p>
      </div>

      {/* Transaction Details Box matching mockup */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5 text-left">
        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
            {channel === 'qris'
              ? t.waiting.refQris
              : channel === 'transfer'
              ? t.waiting.targetAcc
              : t.waiting.vaNumber}
          </div>
          <div className="flex items-center justify-between gap-3 mt-0.5">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#003853] tracking-wide select-all">
              {vaNumber}
            </span>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white border-sky-300 text-sky-700 hover:bg-sky-50 shadow-2xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sky-600" />}
              <span>{copied ? t.waiting.copied : t.waiting.copy}</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.waiting.totalPayment}</div>
          <div className="text-lg sm:text-xl font-black text-[#003853] mt-0.5">
            {formatMoney(amount)}
          </div>
        </div>

        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.waiting.validUntil}</div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {formatDateLocalized(expiryDateTime)}
          </div>
        </div>

        {/* QR Code toggle if QRIS */}
        {channel === 'qris' && (
          <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowQrPreview(!showQrPreview)}
              className="text-xs font-semibold text-[#005E7A] hover:underline inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQrPreview ? t.waiting.hideQrAgain : t.waiting.showQrAgain}</span>
            </button>
            {showQrPreview && (
              <div className="mt-2.5 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center animate-in fade-in duration-200">
                <div className="w-36 h-36 bg-white flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900 select-none">
                    <rect x="0" y="0" width="28" height="28" rx="3" fill="#0f172a" />
                    <rect x="5" y="5" width="18" height="18" rx="2" fill="white" />
                    <rect x="9" y="9" width="10" height="10" rx="1" fill="#F15A24" />
                    <rect x="72" y="0" width="28" height="28" rx="3" fill="#0f172a" />
                    <rect x="77" y="5" width="18" height="18" rx="2" fill="white" />
                    <rect x="81" y="9" width="10" height="10" rx="1" fill="#005E7A" />
                    <rect x="0" y="72" width="28" height="28" rx="3" fill="#0f172a" />
                    <rect x="5" y="77" width="18" height="18" rx="2" fill="white" />
                    <rect x="9" y="81" width="10" height="10" rx="1" fill="#0f172a" />
                    <rect x="36" y="6" width="6" height="6" />
                    <rect x="48" y="10" width="8" height="6" />
                    <rect x="60" y="6" width="6" height="6" />
                    <rect x="36" y="24" width="6" height="6" />
                    <rect x="48" y="22" width="6" height="6" />
                    <rect x="12" y="36" width="8" height="6" />
                    <rect x="24" y="42" width="6" height="6" />
                    <rect x="36" y="36" width="6" height="8" />
                    <rect x="46" y="46" width="8" height="8" fill="#F15A24" />
                    <rect x="58" y="36" width="6" height="8" />
                    <rect x="70" y="42" width="6" height="6" />
                    <rect x="84" y="36" width="8" height="6" />
                    <rect x="36" y="64" width="6" height="6" />
                    <rect x="48" y="58" width="6" height="6" />
                    <rect x="60" y="64" width="6" height="6" />
                    <rect x="36" y="76" width="8" height="6" />
                    <rect x="50" y="76" width="6" height="6" />
                    <rect x="62" y="72" width="6" height="8" />
                    <rect x="76" y="76" width="6" height="6" />
                    <rect x="88" y="76" width="6" height="6" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-medium">{t.va.scanQrDesc}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4-Step Progress Tracker matching mockup */}
      <div className="py-4 px-1 sm:px-2">
        <div className="grid grid-cols-4 relative items-start">
          {/* Horizontal Connector Line Behind */}
          <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-[1.5px] bg-slate-200 z-0" />
          
          {/* Active Connector Line Fill */}
          <div
            className="absolute top-[18px] left-[12.5%] h-[1.5px] bg-[#10b981] transition-all duration-500 z-0"
            style={{
              width: getProgressLineWidth(),
            }}
          />

          {/* Node 1: Tagihan / QRIS / VA Dibuat */}
          <div className="flex flex-col items-center text-center z-10 px-0.5">
            <div className="w-9 h-9 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-xs ring-4 ring-white mb-2">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-[#003853] leading-tight">
              {channel === 'qris'
                ? t.waiting.step1Qris
                : channel === 'transfer'
                ? t.waiting.step1Transfer
                : t.waiting.step1Va}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 leading-tight">10 Sep 2026</span>
            <span className="text-[10px] text-slate-400 leading-tight">09:12</span>
          </div>

          {/* Node 2: Pembayaran Diterima */}
          <div className="flex flex-col items-center text-center z-10 px-0.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all ${
                completedSteps.includes(2)
                  ? 'bg-[#10b981] text-white shadow-xs ring-4 ring-white'
                  : activeLoadingStep === 2
                  ? 'bg-sky-50 border-2 border-[#005E7A] text-[#005E7A] shadow-sm ring-4 ring-sky-100/80'
                  : 'bg-white border border-slate-200 text-slate-400 shadow-2xs ring-4 ring-white'
              }`}
            >
              {completedSteps.includes(2) ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : activeLoadingStep === 2 ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#005E7A]" />
              ) : (
                <CreditCard className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <span
              className={`text-xs leading-tight transition-colors ${
                completedSteps.includes(2) || activeLoadingStep === 2
                  ? 'font-bold text-[#003853]'
                  : 'font-medium text-slate-500'
              }`}
            >
              {t.waiting.step2.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx === 0 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>

          {/* Node 3: Diproses */}
          <div className="flex flex-col items-center text-center z-10 px-0.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all ${
                completedSteps.includes(3)
                  ? 'bg-[#10b981] text-white shadow-xs ring-4 ring-white'
                  : activeLoadingStep === 3
                  ? 'bg-sky-50 border-2 border-[#005E7A] text-[#005E7A] shadow-sm ring-4 ring-sky-100/80'
                  : 'bg-white border border-slate-200 text-slate-400 shadow-2xs ring-4 ring-white'
              }`}
            >
              {completedSteps.includes(3) ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : activeLoadingStep === 3 ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#005E7A]" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <span
              className={`text-xs leading-tight transition-colors ${
                completedSteps.includes(3) || activeLoadingStep === 3
                  ? 'font-bold text-[#003853]'
                  : 'font-medium text-slate-500'
              }`}
            >
              {t.waiting.step3}
            </span>
          </div>

          {/* Node 4: Kewajiban Diperbarui */}
          <div className="flex flex-col items-center text-center z-10 px-0.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all ${
                completedSteps.includes(4)
                  ? 'bg-[#10b981] text-white shadow-xs ring-4 ring-white'
                  : activeLoadingStep === 4
                  ? 'bg-sky-50 border-2 border-[#005E7A] text-[#005E7A] shadow-sm ring-4 ring-sky-100/80'
                  : 'bg-white border border-slate-200 text-slate-400 shadow-2xs ring-4 ring-white'
              }`}
            >
              {completedSteps.includes(4) ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : activeLoadingStep === 4 ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#005E7A]" />
              ) : (
                <FileCheck className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <span
              className={`text-xs leading-tight transition-colors ${
                completedSteps.includes(4) || activeLoadingStep === 4
                  ? 'font-bold text-[#003853]'
                  : 'font-medium text-slate-500'
              }`}
            >
              {t.waiting.step4.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx === 0 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Simulator trigger */}
      <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200/80 text-center">
        <button
          onClick={handleSimulatePayment}
          disabled={isSimulating}
          className="w-full py-2 px-3 bg-[#F15A24] hover:bg-[#d94b1a] disabled:bg-orange-300 text-white rounded-lg text-xs font-bold transition-all shadow-2xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{t.waiting.processing}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.waiting.simulateBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Button: < Kembali ke Beranda */}
      <div className="flex justify-start pt-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{t.waiting.backHome}</span>
        </button>
      </div>
    </div>
  );
};
