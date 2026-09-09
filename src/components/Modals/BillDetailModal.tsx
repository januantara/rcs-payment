import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Download, Loader2 } from 'lucide-react';
import { DebtorInfo, BillBreakdown } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { generatePaymentReceiptPdf } from '../../utils/pdfGenerator';

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtor: DebtorInfo;
  breakdown: BillBreakdown;
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({
  isOpen,
  onClose,
  debtor,
  breakdown,
}) => {
  const { t, formatMoney, getLocalizedDebtor } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const localizedDebtor = getLocalizedDebtor(debtor);

  const handleDownloadBill = () => {
    setIsDownloading(true);
    setTimeout(() => {
      generatePaymentReceiptPdf({
        referenceNo: 'BNI20260910103200123',
        dateTime: '10 September 2026 | 10:32 WIB',
        totalAmount: breakdown.total,
        paymentMethod: 'Virtual Account (BNI)',
        status: 'MENUNGGU PEMBAYARAN',
        debtor,
        vaNumber: '9888 1234 5678 9012',
        breakdown,
        isPaid: false,
      });
      setIsDownloading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.billModal.title}</h3>
            <p className="text-xs text-slate-500">{t.billModal.contractNoLabel}: {debtor.contractNo}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm">
          {/* Status Alert */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{t.billModal.dpdAlertTitle.replace('{days}', String(debtor.dpdDays))}</span>
              <p className="text-amber-800 mt-0.5">
                {t.billModal.dpdAlertDesc.replace('{date}', localizedDebtor.dueDate)}
              </p>
            </div>
          </div>

          {/* Facility info */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.billModal.debtorName}</span>
              <span className="font-semibold text-slate-800">{debtor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.billModal.product}</span>
              <span className="font-semibold text-slate-800">{localizedDebtor.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.billModal.branch}</span>
              <span className="font-semibold text-slate-800">{localizedDebtor.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.billModal.installment}</span>
              <span className="font-semibold text-slate-800">{localizedDebtor.installmentNo}</span>
            </div>
          </div>

          {/* Cost items breakdown */}
          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between items-center text-slate-600">
              <span>{t.billModal.principal}</span>
              <span className="font-medium">{formatMoney(breakdown.pokok)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>{t.billModal.interest}</span>
              <span className="font-medium">{formatMoney(breakdown.bunga)}</span>
            </div>
            <div className="flex justify-between items-center text-rose-600">
              <span className="flex items-center gap-1">
                {t.billModal.penalty.replace('{days}', String(debtor.dpdDays))}
              </span>
              <span className="font-medium">{formatMoney(breakdown.denda)}</span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline font-bold text-slate-900">
              <span>{t.billModal.total}</span>
              <span className="text-base text-[#F15A24]">{formatMoney(breakdown.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Data per 9 September 2026 • Real-time dari Core Loan BNI</span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={handleDownloadBill}
            disabled={isDownloading}
            className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyiapkan PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.billModal.downloadBillPdf}</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#005E7A] hover:bg-[#004e66] text-white rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {t.billModal.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
