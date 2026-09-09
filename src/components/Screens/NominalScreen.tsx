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
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
          {t.nominal.subtitle}
        </p>
      </div>

      {/* Rincian Tagihan Card */}
      <div className="bg-[#f0f8fc]/50 rounded-2xl p-4 sm:p-5 border border-sky-100/70">
        <div className="flex items-center justify-between pb-3">
          <span className="text-xs sm:text-sm font-bold text-[#002840]">
            {t.nominal.summaryTitle}
          </span>
          <button
            type="button"
            onClick={onOpenDetailModal}
            className="text-xs font-medium text-[#007298] hover:text-[#F15A24] transition-colors cursor-pointer"
          >
            {t.nominal.viewDetails}
          </button>
        </div>

        <div className="space-y-2 text-xs sm:text-[13px]">
          <div className="flex justify-between text-slate-600">
            <span>{language === 'EN' ? 'Principal' : 'Pokok'}</span>
            <span className="font-semibold text-slate-800">{formatMoney(breakdown.pokok)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{language === 'EN' ? 'Interest' : 'Bunga'}</span>
            <span className="font-semibold text-slate-800">{formatMoney(breakdown.bunga)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{language === 'EN' ? 'Penalty' : 'Denda'}</span>
            <span className="font-semibold text-slate-800">{formatMoney(breakdown.denda)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 font-bold">
            <span className="text-slate-800 text-xs sm:text-sm">{t.nominal.totalObligation}</span>
            <span className="text-sm sm:text-base font-bold text-[#002840] tracking-tight">
              {formatMoney(breakdown.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Radio Group Container (Matching Reference Image) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-2xs">
        {/* Option 1: Bayar Minimum */}
        <div
          onClick={() => handleSelectOption('minimum')}
          className={`p-4 sm:p-4.5 flex items-center justify-between cursor-pointer transition-colors ${
            selectedType === 'minimum'
              ? 'bg-[#FFF6EF]'
              : 'hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                selectedType === 'minimum'
                  ? 'border-2 border-[#F15A24] bg-white'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'minimum' && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#F15A24]" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#002840]">
                {t.nominal.minPaymentTitle}
              </div>
              {t.nominal.minPaymentDesc && (
                <div className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5">
                  {t.nominal.minPaymentDesc}
                </div>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-xs sm:text-sm text-[#002840] tracking-tight">
              {formatMoney(minimumAmount)}
            </span>
          </div>
        </div>

        {/* Option 2: Bayar Angsuran */}
        <div
          onClick={() => handleSelectOption('angsuran')}
          className={`p-4 sm:p-4.5 flex items-center justify-between cursor-pointer transition-colors ${
            selectedType === 'angsuran'
              ? 'bg-[#FFF6EF]'
              : 'hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                selectedType === 'angsuran'
                  ? 'border-2 border-[#F15A24] bg-white'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'angsuran' && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#F15A24]" />
              )}
            </div>
            <div className="font-bold text-xs sm:text-sm text-[#002840]">
              {t.nominal.oneMonthTitle}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-xs sm:text-sm text-[#002840] tracking-tight">
              {formatMoney(angsuranAmount)}
            </span>
          </div>
        </div>

        {/* Option 3: Bayar Lunas */}
        <div
          onClick={() => handleSelectOption('lunas')}
          className={`p-4 sm:p-4.5 flex items-center justify-between cursor-pointer transition-colors ${
            selectedType === 'lunas'
              ? 'bg-[#FFF6EF]'
              : 'hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                selectedType === 'lunas'
                  ? 'border-2 border-[#F15A24] bg-white'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {selectedType === 'lunas' && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#F15A24]" />
              )}
            </div>
            <div className="font-bold text-xs sm:text-sm text-[#002840]">
              {t.nominal.fullPaymentTitle}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-xs sm:text-sm text-[#002840] tracking-tight">
              {formatMoney(lunasAmount)}
            </span>
          </div>
        </div>

        {/* Option 4: Nominal Lain */}
        <div
          onClick={handleNominalLainClick}
          className={`p-4 sm:p-4.5 cursor-pointer transition-colors ${
            selectedType === 'custom'
              ? 'bg-[#FFF6EF]'
              : 'hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  selectedType === 'custom'
                    ? 'border-2 border-[#F15A24] bg-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'custom' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F15A24]" />
                )}
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#002840]">
                {t.nominal.customTitle}
              </span>
            </div>

            {/* Input Box with Rp prefix badge */}
            <div className="w-full max-w-[200px] sm:max-w-[240px]">
              <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-[#F15A24] focus-within:ring-1 focus-within:ring-[#F15A24]/30 transition-all">
                <span className="px-2.5 py-1.5 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-500 select-none">
                  {language === 'EN' ? 'IDR' : 'Rp'}
                </span>
                <input
                  ref={customInputRef}
                  type="text"
                  placeholder={t.nominal.customInputPlaceholder}
                  value={customInputValue}
                  onChange={handleCustomInputChange}
                  onFocus={() => handleSelectOption('custom')}
                  className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-transparent placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {selectedType === 'custom' && customError && (
            <p className="text-xs text-rose-600 mt-2 pl-8 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{customError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Action Button: Single full-width orange Lanjutkan button (no back button for step 1) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 px-5 rounded-xl bg-[#F15A24] hover:bg-[#d94815] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
        >
          <span>{t.nominal.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
