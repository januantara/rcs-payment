import React, { useState, useRef } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { BillBreakdown, NominalSelectionType } from '../../types';
import { formatNumberOnly, parseRupiahInput } from '../../utils/formatters';
import { useLanguage } from '../../i18n/LanguageContext';

interface NominalScreenProps {
  breakdown: BillBreakdown;
  selectedType: NominalSelectionType;
  customAmount: number;
  onSelectNominal: (type: NominalSelectionType, amount: number) => void;
  onContinue: () => void;
  onBack?: () => void;
  onOpenDetailModal: () => void;
  compact?: boolean;
}

export const NominalScreen: React.FC<NominalScreenProps> = ({
  breakdown,
  selectedType,
  customAmount,
  onSelectNominal,
  onContinue,
  onBack,
  onOpenDetailModal,
  compact = false,
}) => {
  const { t, formatMoney, language } = useLanguage();
  const customInputRef = useRef<HTMLInputElement>(null);
  const [customInputValue, setCustomInputValue] = useState(
    customAmount > 0 ? formatNumberOnly(customAmount) : ''
  );
  const [customError, setCustomError] = useState<string | null>(null);

  // Preset values matching the PRD and mockup
  const minimumAmount = 1500000;
  const angsuranAmount = 2750000;
  const lunasAmount = breakdown.total; // 8750000

  const handleSelectOption = (type: NominalSelectionType) => {
    let amount = 0;
    if (type === 'minimum') amount = minimumAmount;
    else if (type === 'angsuran') amount = angsuranAmount;
    else if (type === 'lunas') amount = lunasAmount;
    else if (type === 'custom') {
      amount = parseRupiahInput(customInputValue);
    }
    onSelectNominal(type, amount);
  };

  const handleNominalLainClick = () => {
    handleSelectOption('custom');
    setTimeout(() => {
      customInputRef.current?.focus();
    }, 0);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseRupiahInput(raw);
    setCustomInputValue(num > 0 ? formatNumberOnly(num) : '');

    if (num < 100000 && num > 0) {
      setCustomError(t.nominal.minError);
    } else if (num > breakdown.total) {
      setCustomError(`${t.nominal.maxError} (${formatMoney(breakdown.total)})`);
    } else {
      setCustomError(null);
    }

    onSelectNominal('custom', num);
  };

  return (
    <div className={`space-y-4 sm:space-y-5 animate-in fade-in duration-300 ${compact ? 'text-xs' : ''}`}>
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-[#003853] tracking-tight">
          {t.nominal.title}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          {t.nominal.subtitle}
        </p>
      </div>

      {/* Rincian Tagihan Box */}
      <div className="bg-slate-50/90 rounded-xl p-3.5 sm:p-4 border border-slate-200/80">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70">
          <span className="text-xs font-bold text-slate-800">
            {t.nominal.summaryTitle}
          </span>
          <button
            onClick={onOpenDetailModal}
            className="text-[11px] font-semibold text-[#005E7A] hover:text-[#F15A24] transition-colors cursor-pointer"
          >
            {t.nominal.viewDetails}
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t.billModal.principal}</span>
            <span className="font-semibold text-slate-800">{formatMoney(breakdown.pokok)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t.billModal.interest}</span>
            <span className="font-semibold text-slate-800">{formatMoney(breakdown.bunga)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t.billModal.penalty}</span>
            <span className="font-semibold text-slate-800">{formatMoney(breakdown.denda)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold">
            <span className="text-slate-900 text-xs">{t.nominal.totalObligation}</span>
            <span className="text-sm font-extrabold text-slate-900">
              {formatMoney(breakdown.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Nominal Options Unified Radio Group matching design mockup */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
        {/* Option 1: Bayar Minimum (Tanpa denda) */}
        <div
          onClick={() => handleSelectOption('minimum')}
          className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 cursor-pointer transition-colors ${
            selectedType === 'minimum'
              ? 'bg-[#FFF6EF]'
              : 'bg-white hover:bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                selectedType === 'minimum'
                  ? 'bg-[#F15A24]'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'minimum' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#003853]">
                {t.nominal.minPaymentTitle}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight">
                {t.nominal.minPaymentDesc}
              </div>
            </div>
          </div>
          <span className="font-bold text-xs sm:text-sm text-[#003853] tracking-tight">
            {formatMoney(minimumAmount)}
          </span>
        </div>

        {/* Option 2: Bayar Angsuran */}
        <div
          onClick={() => handleSelectOption('angsuran')}
          className={`flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 cursor-pointer transition-colors ${
            selectedType === 'angsuran'
              ? 'bg-[#FFF6EF]'
              : 'bg-white hover:bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                selectedType === 'angsuran'
                  ? 'bg-[#F15A24]'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'angsuran' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#003853]">
                {t.nominal.oneMonthTitle}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight">
                {t.nominal.oneMonthDesc}
              </div>
            </div>
          </div>
          <span className="font-bold text-xs sm:text-sm text-[#003853] tracking-tight">
            {formatMoney(angsuranAmount)}
          </span>
        </div>

        {/* Option 3: Bayar Lunas */}
        <div
          onClick={() => handleSelectOption('lunas')}
          className={`flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 cursor-pointer transition-colors ${
            selectedType === 'lunas'
              ? 'bg-[#FFF6EF]'
              : 'bg-white hover:bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                selectedType === 'lunas'
                  ? 'bg-[#F15A24]'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'lunas' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-[#003853]">
                  {t.nominal.fullPaymentTitle}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {t.nominal.recommendedBadge}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight">
                {t.nominal.fullPaymentDesc}
              </div>
            </div>
          </div>
          <span className="font-bold text-xs sm:text-sm text-[#003853] tracking-tight">
            {formatMoney(lunasAmount)}
          </span>
        </div>

        {/* Option 4: Nominal Lain */}
        <div
          onClick={handleNominalLainClick}
          className={`px-4 py-3 sm:px-5 sm:py-3.5 cursor-pointer transition-colors ${
            selectedType === 'custom'
              ? 'bg-[#FFF6EF]'
              : 'bg-white hover:bg-slate-50/70'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  selectedType === 'custom'
                    ? 'bg-[#F15A24]'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'custom' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-[#003853] block">
                  {t.nominal.customTitle}
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {t.nominal.customDesc}
                </span>
              </div>
            </div>

            {/* Input field matching mockup */}
            <div className="flex-1 max-w-[220px] sm:max-w-xs ml-2">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-[#F15A24] transition-all px-2.5 py-1.5">
                <span className="text-xs font-bold text-slate-400 select-none mr-2">
                  {language === 'EN' ? 'IDR' : 'Rp'}
                </span>
                <input
                  ref={customInputRef}
                  type="text"
                  placeholder={t.nominal.customInputPlaceholder}
                  value={customInputValue}
                  onChange={handleCustomInputChange}
                  onFocus={() => handleSelectOption('custom')}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {selectedType === 'custom' && customError && (
            <p className="text-[11px] text-rose-600 mt-2 ml-8 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>{customError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Action Button: Kembali and Lanjutkan buttons */}
      <div className="flex items-center gap-2.5 pt-2">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            {t.common.back}
          </button>
        )}
        <button
          onClick={onContinue}
          className={`${
            onBack ? 'flex-2' : 'w-full'
          } py-3 px-4 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer`}
        >
          <span>{t.nominal.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
