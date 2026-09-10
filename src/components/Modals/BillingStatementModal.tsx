import React, { useState } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Loader2,
  Clock,
} from 'lucide-react';
import { DebtorInfo, BillBreakdown } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { generatePaymentReceiptPdf } from '../../utils/pdfGenerator';
import { formatTerbilang } from '../../utils/formatters';
import bniLogo from '../../assets/icons/bni.png';

interface BillingStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtor: DebtorInfo;
  breakdown: BillBreakdown;
  referenceNo?: string;
  dateTime?: string;
  amount?: number;
  paymentMethod?: string;
  vaNumber?: string;
  isPaid?: boolean;
}

export const BillingStatementModal: React.FC<BillingStatementModalProps> = ({
  isOpen,
  onClose,
  debtor,
  breakdown,
  referenceNo = 'BNI20260910103200123',
  dateTime = '10 September 2026 | 10:32 WIB',
  amount,
  paymentMethod = 'Virtual Account (BNI)',
  vaNumber = '9888 1234 5678 9012',
  isPaid = true,
}) => {
  const { t, formatMoney } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const totalAmount = amount ?? breakdown.total;
  const isFullyPaid = totalAmount >= breakdown.total;
  const billingNo = `BILL-${referenceNo.replace(/[^0-9]/g, '').slice(-10) || '2026091001'}`;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generatePaymentReceiptPdf({
        referenceNo,
        dateTime,
        totalAmount,
        paymentMethod,
        status: isPaid
          ? isFullyPaid
            ? t.success.statusPaid
            : 'ANGSURAN DITERIMA'
          : 'MENUNGGU PEMBAYARAN',
        debtor,
        vaNumber,
        breakdown,
        billingNo,
        isPaid,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Simple Clean Header */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#005E7A] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Lembar Billing & Pelunasan
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Pratinjau Resmi • PT Bank Negara Indonesia (Persero) Tbk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 space-y-4">
          {/* Main Statement Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Top BNI Brand Line */}
            <div className="h-1 bg-[#F15A24] w-full" />

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Header: Logo & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={bniLogo} alt="BNI" className="h-7 w-auto object-contain" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      PT Bank Negara Indonesia (Persero) Tbk
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Divisi Retail Collection & Recovery
                    </div>
                  </div>
                </div>

                <div>
                  {isPaid ? (
                    isFullyPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        LUNAS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-[#005E7A] border border-sky-200 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#005E7A]" />
                        ANGSURAN DITERIMA
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      MENUNGGU PEMBAYARAN
                    </span>
                  )}
                </div>
              </div>

              {/* Debtor & Billing Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs">
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-500 sm:w-28 shrink-0">Nama Debitur:</span>
                  <span className="font-bold text-slate-900">{debtor.name}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-500 sm:w-28 shrink-0">No. Billing:</span>
                  <span className="font-mono font-bold text-[#003853]">{billingNo}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-500 sm:w-28 shrink-0">No. Kontrak:</span>
                  <span className="font-mono font-bold text-slate-900">{debtor.contractNo}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-500 sm:w-28 shrink-0">Tanggal:</span>
                  <span className="font-medium text-slate-800">{dateTime.split('|')[0].trim()}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-500 sm:w-28 shrink-0">Produk Pinjaman:</span>
                  <span className="font-medium text-slate-800">{debtor.product}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-500 sm:w-28 shrink-0">Kanal Pembayaran:</span>
                  <span className="font-medium text-slate-800">{paymentMethod}</span>
                </div>
              </div>

              {/* Simple Table Breakdown */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Rincian Pembayaran
                </div>
                <div className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between items-center px-3.5 py-2.5 bg-white">
                    <span className="text-slate-600">Angsuran Pokok Pinjaman</span>
                    <span className="font-semibold text-slate-800">{formatMoney(breakdown.pokok)}</span>
                  </div>
                  <div className="flex justify-between items-center px-3.5 py-2.5 bg-white">
                    <span className="text-slate-600">Bunga Fasilitas Kredit</span>
                    <span className="font-semibold text-slate-800">{formatMoney(breakdown.bunga)}</span>
                  </div>
                  <div className="flex justify-between items-center px-3.5 py-2.5 bg-white">
                    <span className="text-slate-600">Denda Keterlambatan ({debtor.dpdDays} Hari DPD)</span>
                    <span className="font-semibold text-rose-600">{formatMoney(breakdown.denda)}</span>
                  </div>
                  <div className="flex justify-between items-center px-3.5 py-2.5 bg-white">
                    <span className="text-slate-600">Biaya Administrasi Transaksi</span>
                    <span className="font-semibold text-emerald-600">Rp 0 (Bebas Biaya)</span>
                  </div>

                  {/* Calculations */}
                  <div className="p-3.5 bg-slate-50 space-y-1.5 border-t border-slate-200">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Total Tagihan:</span>
                      <span className="font-semibold text-slate-900">{formatMoney(breakdown.total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-700 font-bold">
                      <span>Total Pembayaran Diterima:</span>
                      <span className="text-sm font-extrabold">{formatMoney(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 font-bold">
                      <span className="text-slate-700">Sisa Kewajiban Tagihan:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${
                        isFullyPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-[#F15A24]'
                      }`}>
                        {isFullyPaid ? 'Rp 0 (LUNAS)' : formatMoney(Math.max(0, breakdown.total - totalAmount))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terbilang Note */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Terbilang:</span>
                <span className="font-semibold text-slate-800 italic">
                  # {formatTerbilang(totalAmount).toUpperCase()} #
                </span>
              </div>

              {/* Settlement & Verification Note */}
              <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/60 flex items-start gap-2.5 text-xs text-teal-950">
                <ShieldCheck className="w-4 h-4 text-[#005E7A] shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px] leading-relaxed">
                  <div className="font-bold text-[#003853]">Tervalidasi Resmi Host Core Banking BNI</div>
                  <div className="text-slate-500">
                    No. Referensi: <strong className="font-mono text-slate-700">{referenceNo}</strong> • Dokumen sah sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="py-2.5 px-6 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengunduh...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
