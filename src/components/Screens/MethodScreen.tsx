import React, { useState } from 'react';
import { Shield, ChevronRight, ArrowRight, Building2, QrCode, Landmark } from 'lucide-react';
import { PaymentChannel, BankId } from '../../types';
import { banksList } from '../../data/mockData';
import { BankBadge } from '../BankLogos';
import { useLanguage } from '../../i18n/LanguageContext';

interface MethodScreenProps {
  selectedChannel: PaymentChannel;
  selectedBank: BankId;
  onSelectChannel: (channel: PaymentChannel) => void;
  onSelectBank: (bank: BankId) => void;
  onContinue: () => void;
  onBack: () => void;
  compact?: boolean;
}

export const MethodScreen: React.FC<MethodScreenProps> = ({
  selectedChannel,
  selectedBank,
  onSelectChannel,
  onSelectBank,
  onContinue,
  onBack,
  compact = false,
}) => {
  const { t } = useLanguage();
  // By default, Virtual Account sub-options are expanded
  const [isVaExpanded, setIsVaExpanded] = useState<boolean>(selectedChannel === 'va' || !selectedChannel);
  const [isQrisExpanded, setIsQrisExpanded] = useState<boolean>(selectedChannel === 'qris');

  const handleToggleVa = () => {
    onSelectChannel('va');
    setIsVaExpanded((prev) => !prev);
    setIsQrisExpanded(false);
  };

  const handleToggleQris = () => {
    onSelectChannel('qris');
    setIsQrisExpanded((prev) => (selectedChannel === 'qris' ? !prev : true));
    setIsVaExpanded(false);
  };

  const handleSelectTransfer = () => {
    onSelectChannel('transfer');
    setIsVaExpanded(false);
    setIsQrisExpanded(false);
  };
  return (
    <div className={`space-y-4 sm:space-y-5 animate-in fade-in duration-300 ${compact ? 'text-xs' : ''}`}>
      {/* Title */}
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-[#003853] tracking-tight">
          {t.method.title}
        </h1>
      </div>

      {/* Security Anti-Fraud Notice Banner */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-[#eef7fc] border border-sky-200/80 flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md bg-[#005E7A] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">
            {t.method.safeTitle}
          </h2>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            {t.method.safeDesc}{' '}
            <span className="text-[#005E7A] font-semibold">
              {t.method.safeWarning}
            </span>
          </p>
        </div>
      </div>

      {/* Methods List */}
      <div className="space-y-3">
        {/* Method 1: Virtual Account */}
        <div
          onClick={handleToggleVa}
          className={`rounded-xl border transition-all p-3.5 cursor-pointer ${
            selectedChannel === 'va'
              ? 'border-[#F15A24] bg-white shadow-2xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className={`flex items-center justify-between ${isVaExpanded ? 'mb-2.5' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8f3f6] text-[#005E7A] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{t.landing.vaName}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{t.method.vaSubtitle}</p>
              </div>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                isVaExpanded ? 'rotate-90 text-[#005E7A]' : 'text-slate-400'
              }`}
            />
          </div>

          {/* 4 Bank Selection Logos in a Row */}
          {isVaExpanded && (
            <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-slate-100 animate-in fade-in duration-200">
              {banksList.map((bank) => {
                const isSelected = selectedBank === bank.id;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChannel('va');
                      onSelectBank(bank.id);
                    }}
                    className={`flex items-center justify-center h-12 sm:h-13 px-2 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer bg-white overflow-hidden ${
                      isSelected
                        ? 'border-[#F15A24] bg-orange-50/20 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <BankBadge
                      bankId={bank.id}
                      className={
                        bank.id === 'bca'
                          ? 'max-h-5 sm:max-h-6 max-w-[60px] sm:max-w-[80px] w-auto h-auto'
                          : bank.id === 'mandiri'
                          ? 'max-h-5.5 sm:max-h-6.5 max-w-[65px] sm:max-w-[85px] w-auto h-auto'
                          : 'max-h-5.5 sm:max-h-6.5 max-w-[62px] sm:max-w-[80px] w-auto h-auto'
                      }
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Method 2: QRIS */}
        <div
          onClick={handleToggleQris}
          className={`rounded-xl border transition-all p-3.5 cursor-pointer ${
            selectedChannel === 'qris'
              ? 'border-[#F15A24] bg-white shadow-2xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className={`flex items-center justify-between ${isQrisExpanded ? 'mb-2.5' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{t.landing.qrisName}</h3>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{t.method.qrisSubtitle}</p>
              </div>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                isQrisExpanded ? 'rotate-90 text-[#005E7A]' : 'text-slate-400'
              }`}
            />
          </div>

          {/* Sub-card when QRIS is expanded */}
          {isQrisExpanded && (
            <div className="pt-2.5 border-t border-slate-100 animate-in fade-in duration-200 space-y-2">
              <div className="text-[11px] font-semibold text-slate-600">
                {t.method.supportedQrisApps}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { name: 'Wondr by BNI', dot: 'bg-[#005E7A]' },
                  { name: 'BCA Mobile', dot: 'bg-blue-600' },
                  { name: 'Livin\' Mandiri', dot: 'bg-amber-500' },
                  { name: 'BRImo', dot: 'bg-sky-600' },
                  { name: 'GoPay', dot: 'bg-emerald-600' },
                  { name: 'OVO', dot: 'bg-purple-600' },
                  { name: 'DANA', dot: 'bg-sky-500' },
                  { name: 'ShopeePay', dot: 'bg-orange-600' },
                  { name: 'LinkAja', dot: 'bg-rose-600' },
                ].map((app) => (
                  <span
                    key={app.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] sm:text-[11px] font-medium border border-slate-200/80 shadow-2xs transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${app.dot}`} />
                    {app.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Method 3: Transfer Bank */}
        <div
          onClick={handleSelectTransfer}
          className={`rounded-xl border transition-all p-3.5 cursor-pointer flex items-center justify-between ${
            selectedChannel === 'transfer'
              ? 'border-[#F15A24] bg-white shadow-2xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e8f3f6] text-[#005E7A] flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">{t.landing.transferName}</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">{t.method.transferSubtitle}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Action Buttons: Kembali (outline) & Lanjutkan -> (orange) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          {t.common.back}
        </button>

        <button
          onClick={onContinue}
          className="py-2.5 px-6 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
        >
          <span>{t.common.continue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
