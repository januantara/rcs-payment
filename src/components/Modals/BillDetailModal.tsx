import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, AlertCircle, Download, Loader2 } from 'lucide-react';
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

  const localizedDebtor = getLocalizedDebtor(debtor);

  // Close on Escape key press and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleDownloadBill = async () => {
    setIsDownloading(true);
    try {
      await generatePaymentReceiptPdf({
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
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.billModal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  <span>{t.billModal.contractNoLabel}: </span>
                  <span className="font-semibold text-slate-700 font-mono">{debtor.contractNo}</span>
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

            {/* ── Scrollable Content ── */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm">
              {/* Status Alert (DPD) */}
              {debtor.dpdDays > 0 && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block">
                      {t.billModal.dpdAlertTitle.replace('{days}', String(debtor.dpdDays))}
                    </span>
                    <p className="text-amber-800 mt-0.5 leading-relaxed">
                      {t.billModal.dpdAlertDesc.replace('{date}', localizedDebtor.dueDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Section 1: Data Debitur */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.billModal.debtorDataTitle}
                </h4>
                <div className="bg-slate-50/80 rounded-xl border border-slate-100 divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-slate-500">{t.billModal.debtorName}</span>
                    <span className="font-semibold text-slate-800">{debtor.name}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-slate-500">{t.billModal.product}</span>
                    <span className="font-semibold text-slate-800 text-right">{localizedDebtor.product}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-slate-500">{t.billModal.branch}</span>
                    <span className="font-semibold text-slate-800 text-right">{localizedDebtor.branch}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-slate-500">{t.billModal.tenor}</span>
                    <span className="font-semibold text-slate-800">{localizedDebtor.loanTenor}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-slate-500">{t.billModal.installment}</span>
                    <span className="font-semibold text-slate-800">{localizedDebtor.installmentNo}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Rincian Biaya Kewajiban */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.billModal.breakdownTitle}
                </h4>
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-2.5 text-xs shadow-2xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>{t.billModal.principal}</span>
                    <span className="font-semibold text-slate-800">{formatMoney(breakdown.pokok)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>{t.billModal.interest}</span>
                    <span className="font-semibold text-slate-800">{formatMoney(breakdown.bunga)}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-600">
                    <span>{t.billModal.penalty}</span>
                    <span className="font-semibold text-rose-600">{formatMoney(breakdown.denda)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{t.billModal.total}</span>
                    <span className="text-base sm:text-lg font-extrabold text-[#003853]">
                      {formatMoney(breakdown.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer Buttons ── */}
            <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleDownloadBill}
                disabled={isDownloading}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.success.downloading}</span>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
