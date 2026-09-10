import React, { useEffect, useState } from 'react';
import {
  Check,
  Download,
  Shield,
  Loader2,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DebtorInfo, BankId, PaymentChannel, BillBreakdown } from '../../types';
import { generatePaymentReceiptPdf } from '../../utils/pdfGenerator';
import { useLanguage } from '../../i18n/LanguageContext';
import { BillingStatementModal } from '../Modals/BillingStatementModal';
import { BankBadge, bniLogo } from '../BankLogos';

interface SuccessScreenProps {
  channel?: PaymentChannel;
  referenceNo: string;
  dateTime: string;
  amount: number;
  bankId: BankId;
  vaNumber: string;
  debtor: DebtorInfo;
  breakdown?: BillBreakdown;
  onBackToBilling: () => void;
  compact?: boolean;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  channel = 'va',
  referenceNo,
  dateTime,
  amount,
  bankId,
  vaNumber,
  debtor,
  breakdown = {
    pokok: 8000000,
    bunga: 500000,
    denda: 250000,
    total: 8750000,
  },
  onBackToBilling,
  compact = false,
}) => {
  const { t, formatMoney, formatDateLocalized } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const billingNo = `BILL-${referenceNo.replace(/[^0-9]/g, '').slice(-10) || '2026091001'}`;

  const paymentMethodLabel =
    channel === 'transfer'
      ? t.success.channelTransfer
      : channel === 'qris'
      ? t.success.channelQris
      : t.success.channelVa(bankId.toUpperCase());

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.45 },
        colors: ['#F15A24', '#005E7A', '#10B981', '#F59E0B'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      await generatePaymentReceiptPdf({
        referenceNo,
        dateTime,
        totalAmount: amount,
        paymentMethod: paymentMethodLabel,
        status: t.success.statusPaid,
        debtor,
        vaNumber,
        breakdown,
        billingNo,
        isPaid: true,
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
    <div className={`space-y-5 sm:space-y-6 animate-in fade-in duration-300 ${compact ? 'text-xs' : ''}`}>
      {/* Green Checkmark Circle and Title */}
      <div className="flex flex-col items-center text-center pt-2 sm:pt-4 pb-1 sm:pb-2">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 ring-8 ring-emerald-500/10 mb-3.5 sm:mb-4">
          <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3.5]" />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.success.title}
        </h1>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 max-w-sm font-medium leading-relaxed">
          {t.success.desc}
        </p>
      </div>

      {/* Official Billing Statement Document Card UI */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Top BNI Brand Stripe */}
        <div className="h-1 bg-[#F15A24] w-full" />
        <div className="h-0.5 bg-[#003853] w-full" />

        <div className="p-4.5 sm:p-6 space-y-4 sm:space-y-5">
          {/* Document Header Row */}
          <div className="flex items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src={bniLogo} alt="BNI" className="h-6 sm:h-7.5 w-auto object-contain" />
              <div>
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-900 uppercase tracking-wide">
                  Lembar Tagihan & Pelunasan Resmi
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Retail Loan Billing & Settlement</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] sm:text-[11px] tracking-wider shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              {t.success.statusPaid}
            </span>
          </div>

          {/* Statement Identifiers & Debtor Info */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="space-y-1">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Nama Debitur / Nasabah</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">{debtor.name}</span>
              <span className="text-slate-500 text-[10px] sm:text-[11px] font-mono block">{debtor.contractNo}</span>
            </div>
            <div className="text-right space-y-1">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">No. Lembar Billing</span>
              <span className="font-mono font-bold text-[#003853] text-xs sm:text-sm block">{billingNo}</span>
              <span className="text-slate-500 text-[10px] sm:text-[11px] block">{debtor.installmentNo}</span>
            </div>
          </div>

          {/* Itemized Billing Breakdown Rows */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#005E7A] uppercase tracking-wider">
              Rincian Komponen Tagihan (Billing Breakdown)
            </div>

            <div className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 text-xs sm:text-[13px]">
              <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white">
                <span className="text-slate-600">Angsuran Pokok Pinjaman</span>
                <span className="font-semibold text-slate-800">{formatMoney(breakdown.pokok)}</span>
              </div>
              <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white">
                <span className="text-slate-600">Bunga Fasilitas Kredit</span>
                <span className="font-semibold text-slate-800">{formatMoney(breakdown.bunga)}</span>
              </div>
              <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white text-rose-600">
                <span className="flex items-center gap-1.5">
                  Denda Keterlambatan ({debtor.dpdDays} Hari DPD)
                </span>
                <span className="font-semibold">{formatMoney(breakdown.denda)}</span>
              </div>
              <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white text-emerald-600">
                <span>Biaya Administrasi Transaksi</span>
                <span className="font-semibold">Rp 0 (Bebas Biaya)</span>
              </div>

              {/* Total Tagihan vs Pembayaran */}
              <div className="p-3.5 sm:p-4 bg-slate-50 space-y-2 border-t border-slate-200 text-xs sm:text-[13px]">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Kewajiban Tagihan:</span>
                  <span className="font-semibold">{formatMoney(breakdown.total)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-emerald-700">
                  <span>Total Pembayaran Diterima:</span>
                  <span className="text-sm sm:text-base font-extrabold">{formatMoney(amount)}</span>
                </div>
                <div className="flex justify-between items-center font-extrabold text-[#F15A24] pt-2.5 mt-1 border-t border-slate-200/80">
                  <span className="text-xs sm:text-[13px]">Sisa Kewajiban Tagihan:</span>
                  <span className="text-xs font-bold bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/80">
                    Rp 0 (LUNAS)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Audit Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-3.5 text-xs pt-3.5 sm:pt-4 border-t border-slate-100">
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">No. Referensi Jurnal BNI</span>
              <span className="font-mono font-bold text-slate-800 text-xs sm:text-[13px]">{referenceNo}</span>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Waktu Transaksi</span>
              <span className="font-medium text-slate-800 text-xs sm:text-[13px]">{formatDateLocalized(dateTime)}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Kanal Pembayaran</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {channel === 'va' && <BankBadge bankId={bankId} className="h-4 w-auto object-contain inline-block" />}
                <span className="font-medium text-slate-800 text-xs sm:text-[13px]">{paymentMethodLabel}</span>
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">Akun / Rekening Tujuan</span>
              <span className="font-mono font-semibold text-[#005E7A] text-xs sm:text-[13px]">{vaNumber}</span>
            </div>
          </div>

          {/* Digital Stamp Validation Note */}
          <div className="flex items-center p-3 sm:p-3.5 rounded-xl bg-teal-50/50 border border-teal-200/60 text-xs text-teal-950 gap-2.5">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#005E7A] shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#003853] block text-xs sm:text-[13px]">Tervalidasi Host Core Banking BNI</span>
              <span className="text-slate-500 text-[10px] sm:text-[11px] block">
                Dokumen sah sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download Lembar Billing (Orange), Pratinjau (Outline), Kembali (Outline) */}
      <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
        <button
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="w-full py-3 sm:py-3.5 px-5 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.success.downloading}</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-white" />
              <span>{t.success.downloaded}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{t.success.downloadPdfBtn}</span>
            </>
          )}
        </button>

        <button
          onClick={onBackToBilling}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-xs sm:text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer bg-white"
        >
          {t.success.backToBilling}
        </button>
      </div>

      {/* Anti-Fraud Security Notice Banner at bottom matching mockup */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#eef7fc] border border-sky-200/80 flex items-start gap-3 text-xs text-blue-950">
        <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#005E7A] shrink-0 mt-0.5" />
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
          {t.success.securityNotice}{' '}
          <span className="text-[#005E7A] font-semibold">
            {t.success.securityWarning}
          </span>
        </p>
      </div>

      {/* Full Billing Statement Document Modal */}
      <BillingStatementModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        debtor={debtor}
        breakdown={breakdown}
        referenceNo={referenceNo}
        dateTime={dateTime}
        amount={amount}
        paymentMethod={paymentMethodLabel}
        vaNumber={vaNumber}
        isPaid={true}
      />
    </div>
  );
};
