import React, { useEffect, useState } from 'react';
import {
  Check,
  Download,
  Shield,
  Loader2,
  CheckCircle,
  FileText,
  Eye,
  ShieldCheck,
  Building2,
  Receipt,
  QrCode,
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
    <div className={`space-y-4 animate-in fade-in duration-300 ${compact ? 'text-xs' : ''}`}>
      {/* Green Checkmark Circle and Title */}
      <div className="flex flex-col items-center text-center pt-1 pb-1">
        <div className="w-13 h-13 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md shadow-emerald-600/20 mb-2.5">
          <Check className="w-7 h-7 stroke-[3.5]" />
        </div>

        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {t.success.title}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 max-w-sm font-medium leading-relaxed">
          {t.success.desc}
        </p>
      </div>

      {/* Official Billing Statement Document Card UI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
        {/* Top BNI Brand Stripe */}
        <div className="h-1 bg-[#F15A24] w-full" />
        <div className="h-0.5 bg-[#003853] w-full" />

        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Document Header Row */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img src={bniLogo} alt="BNI" className="h-6 sm:h-7 w-auto object-contain" />
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide">
                  Lembar Tagihan & Pelunasan Resmi
                </div>
                <div className="text-[10px] text-slate-500">Retail Loan Billing & Settlement</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] tracking-wider shrink-0">
              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              {t.success.statusPaid}
            </span>
          </div>

          {/* Statement Identifiers & Debtor Info */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Nama Debitur / Nasabah</span>
              <span className="font-bold text-slate-900 truncate block">{debtor.name}</span>
              <span className="text-slate-500 text-[10px] font-mono">{debtor.contractNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">No. Lembar Billing</span>
              <span className="font-mono font-bold text-[#003853] block">{billingNo}</span>
              <span className="text-slate-500 text-[10px]">{debtor.installmentNo}</span>
            </div>
          </div>

          {/* Itemized Billing Breakdown Rows */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-[#005E7A] uppercase tracking-wider">
              Rincian Komponen Tagihan (Billing Breakdown)
            </div>

            <div className="rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 text-[11px]">
              <div className="flex justify-between items-center px-3 py-1.5 bg-white">
                <span className="text-slate-600">Angsuran Pokok Pinjaman</span>
                <span className="font-semibold text-slate-800">{formatMoney(breakdown.pokok)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 bg-white">
                <span className="text-slate-600">Bunga Fasilitas Kredit</span>
                <span className="font-semibold text-slate-800">{formatMoney(breakdown.bunga)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 bg-white text-rose-600">
                <span className="flex items-center gap-1">
                  Denda Keterlambatan ({debtor.dpdDays} Hari DPD)
                </span>
                <span className="font-semibold">{formatMoney(breakdown.denda)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 bg-white text-emerald-600">
                <span>Biaya Administrasi Transaksi</span>
                <span className="font-semibold">Rp 0 (Bebas Biaya)</span>
              </div>

              {/* Total Tagihan vs Pembayaran */}
              <div className="p-3 bg-slate-50 space-y-1.5 border-t border-slate-200 text-xs">
                <div className="flex justify-between items-center text-slate-600 text-[11px]">
                  <span>Total Kewajiban Tagihan:</span>
                  <span className="font-semibold">{formatMoney(breakdown.total)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-emerald-700">
                  <span>Total Pembayaran Diterima:</span>
                  <span className="text-sm">{formatMoney(amount)}</span>
                </div>
                <div className="flex justify-between items-center font-extrabold text-[#F15A24] pt-0.5 border-t border-slate-200/80">
                  <span className="text-[11px]">Sisa Kewajiban Tagihan:</span>
                  <span className="text-xs bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    Rp 0 (LUNAS)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Audit Info */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block">No. Referensi Jurnal BNI</span>
              <span className="font-mono font-bold text-slate-800">{referenceNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Waktu Transaksi</span>
              <span className="font-medium text-slate-800">{formatDateLocalized(dateTime)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Kanal Pembayaran</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {channel === 'va' && <BankBadge bankId={bankId} className="h-4 w-auto object-contain inline-block" />}
                <span className="font-medium text-slate-800">{paymentMethodLabel}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Akun / Rekening Tujuan</span>
              <span className="font-mono font-semibold text-[#005E7A]">{vaNumber}</span>
            </div>
          </div>

          {/* Digital Stamp Validation Note */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/50 border border-teal-200/60 text-[10px] text-teal-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#005E7A] shrink-0" />
              <div>
                <span className="font-bold text-[#003853] block">Tervalidasi Host Core Banking BNI</span>
                <span className="text-slate-500 text-[9px]">
                  Dokumen sah sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="text-[#005E7A] hover:text-[#003853] font-bold underline flex items-center gap-1 shrink-0 cursor-pointer text-[10px]"
            >
              <Eye className="w-3 h-3" />
              <span>Pratinjau Penuh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download Lembar Billing (Orange), Pratinjau (Outline), Kembali (Outline) */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.success.downloading}</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-white" />
              <span>{t.success.downloaded}</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>{t.success.downloadPdfBtn}</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.success.previewBillingBtn}</span>
          </button>

          <button
            onClick={onBackToBilling}
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer bg-white"
          >
            {t.success.backToBilling}
          </button>
        </div>
      </div>

      {/* Anti-Fraud Security Notice Banner at bottom matching mockup */}
      <div className="p-3 rounded-xl bg-[#eef7fc] border border-sky-200/80 flex items-start gap-2 text-xs text-blue-950">
        <Shield className="w-4 h-4 text-[#005E7A] shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
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
