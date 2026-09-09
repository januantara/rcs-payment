import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Landmark, QrCode } from 'lucide-react';
import { PaymentChannel } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface PaymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaNumber: string;
  channel?: PaymentChannel;
}

export const PaymentGuideModal: React.FC<PaymentGuideModalProps> = ({
  isOpen,
  onClose,
  vaNumber,
  channel = 'va',
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bni_mobile' | 'bni_atm' | 'other_banks' | 'qris'>(
    channel === 'qris' ? 'qris' : 'bni_mobile'
  );

  if (!isOpen) return null;

  const tabs = [
    { id: 'bni_mobile', label: t.guideModal.tabBniMobile, icon: Smartphone },
    { id: 'bni_atm', label: t.guideModal.tabBniAtm, icon: CreditCard },
    { id: 'other_banks', label: t.guideModal.tabOtherBanks, icon: Landmark },
    { id: 'qris', label: t.guideModal.tabQris, icon: QrCode },
  ] as const;

  const steps =
    activeTab === 'bni_mobile'
      ? channel === 'transfer'
        ? t.instructions.bniMobileTransfer
        : t.instructions.bniMobileVa
      : activeTab === 'bni_atm'
      ? t.instructions.atm
      : activeTab === 'other_banks'
      ? t.instructions.otherBanks
      : t.instructions.qrisEwallet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {channel === 'qris'
                ? t.guideModal.titleQris
                : channel === 'transfer'
                ? t.guideModal.titleTransfer
                : t.guideModal.titleVa}
            </h3>
            <p className="text-xs text-slate-500">
              {channel === 'qris'
                ? `${t.guideModal.qrisRefLabel}: ${vaNumber}`
                : channel === 'transfer'
                ? `${t.guideModal.transferRefLabel}: ${vaNumber}`
                : `${t.guideModal.vaRefLabel}: ${vaNumber}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#005E7A] border-t-2 border-t-[#F15A24] border-x border-slate-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Steps Content */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            Pastikan nama penerima tertera <strong>BNI REC - ANDI PRATAMA</strong> sebelum mengonfirmasi pembayaran.
          </div>

          <ol className="space-y-3 text-xs">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#005E7A] text-white font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#005E7A] hover:bg-[#004e66] text-white rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {t.guideModal.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
