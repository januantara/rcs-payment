import React, { useState } from 'react';
import { X, Download, CheckCircle2, ShieldCheck, QrCode, Building2, FileText, Loader2 } from 'lucide-react';
import { DebtorInfo, BillBreakdown, PaymentChannel, BankId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { generatePaymentReceiptPdf } from '../../utils/pdfGenerator';

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
  const { t, formatMoney, formatDateLocalized } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const totalAmount = amount ?? breakdown.total;
  const billingNo = `BILL-${referenceNo.replace(/[^0-9]/g, '').slice(-10) || '2026091001'}`;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      generatePaymentReceiptPdf({
        referenceNo,
        dateTime,
        totalAmount,
        paymentMethod,
        status: isPaid ? t.success.statusPaid : 'MENUNGGU PEMBAYARAN',
        debtor,
        vaNumber,
        breakdown,
        billingNo,
        isPaid,
      });
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Toolbar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#005E7A] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Pratinjau Lembar Billing Resmi</h2>
              <p className="text-[11px] text-slate-400">Retail Loan Billing & Settlement Statement</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F15A24] hover:bg-[#d94b1a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable A4 Document Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden text-slate-800 text-xs">
            {/* Top BNI Brand Stripe */}
            <div className="h-1.5 bg-[#F15A24] w-full" />
            <div className="h-0.5 bg-[#003853] w-full" />

            <div className="p-5 sm:p-6 space-y-5">
              {/* Document Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-black tracking-tight text-[#003853]">BNI</div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-tight">
                      PT BANK NEGARA INDONESIA (PERSERO) TBK
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">Divisi Retail Collection & Recovery</p>
                    <p className="text-[10px] text-slate-400">
                      Gedung Grha BNI, Jl. Jend. Sudirman Kav. 1, Jakarta Pusat 10220
                    </p>
                    <p className="text-[10px] text-[#005E7A] font-semibold mt-0.5">
                      BNI Call 1500046 • www.bni.co.id
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block font-extrabold text-xs text-[#003853] uppercase tracking-wide">
                    Lembar Tagihan & Bukti Pelunasan
                  </span>
                  <p className="text-[10px] text-slate-400 italic">
                    RETAIL LOAN BILLING & SETTLEMENT STATEMENT
                  </p>
                  <div className="mt-2">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        STATUS: LUNAS / PAID
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] tracking-wider">
                        STATUS: MENUNGGU PEMBAYARAN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Statement Metadata & Debtor Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-[11px]">
                {/* Left: Debtor Data */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-[#005E7A] uppercase tracking-wider">
                    Data Nasabah & Fasilitas Kredit
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-500">Nama Debitur:</span>
                    <span className="font-bold text-slate-900">{debtor.name}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-500">No. Kontrak / Fasilitas:</span>
                    <span className="font-mono font-bold text-slate-900">{debtor.contractNo}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-500">Produk Pinjaman:</span>
                    <span className="font-medium text-slate-800">{debtor.product}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Cabang Pengelola:</span>
                    <span className="font-medium text-slate-800">{debtor.branch}</span>
                  </div>
                </div>

                {/* Right: Billing Identifiers */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-[#005E7A] uppercase tracking-wider">
                    Identitas Lembar Billing
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-500">Nomor Billing:</span>
                    <span className="font-mono font-bold text-[#003853]">{billingNo}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-500">Tanggal Cetak:</span>
                    <span className="font-medium text-slate-800">{dateTime}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-500">Tanggal Jatuh Tempo:</span>
                    <span className="font-medium text-slate-800">{debtor.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Periode Angsuran:</span>
                    <span className="font-medium text-slate-800">
                      {debtor.installmentNo} ({debtor.loanTenor})
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Billing Breakdown Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#003853] uppercase tracking-wider">
                    Rincian Komponen Tagihan & Pembayaran
                  </span>
                  <span className="text-[10px] text-slate-400">Mata Uang: IDR (Rupiah)</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#003853] text-white text-[10px] font-bold">
                        <th className="py-2 px-3 w-10 text-center">NO</th>
                        <th className="py-2 px-3">KOMPONEN TAGIHAN</th>
                        <th className="py-2 px-3 hidden sm:table-cell">KETERANGAN</th>
                        <th className="py-2 px-3 text-right">JUMLAH (IDR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-500 font-medium">1</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">Angsuran Pokok Pinjaman</td>
                        <td className="py-2 px-3 text-slate-500 text-[10px] hidden sm:table-cell">
                          Kewajiban pokok fasilitas pinjaman berjalan
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-800">
                          {formatMoney(breakdown.pokok)}
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50 hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-500 font-medium">2</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">Bunga Fasilitas Kredit</td>
                        <td className="py-2 px-3 text-slate-500 text-[10px] hidden sm:table-cell">
                          Bunga berjalan fasilitas kredit retail
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-800">
                          {formatMoney(breakdown.bunga)}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-500 font-medium">3</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">Denda Keterlambatan</td>
                        <td className="py-2 px-3 text-slate-500 text-[10px] hidden sm:table-cell">
                          Denda akumulatif ({debtor.dpdDays} Hari DPD)
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-rose-600">
                          {formatMoney(breakdown.denda)}
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50 hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-500 font-medium">4</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          Biaya Administrasi & Transaksi
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[10px] hidden sm:table-cell">
                          Layanan digital Core Banking BNI
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-emerald-600">Rp 0 (Gratis)</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Summary Rows */}
                  <div className="bg-slate-50 p-3.5 border-t border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                      <span>Subtotal Kewajiban Tagihan:</span>
                      <span className="font-semibold">{formatMoney(breakdown.total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                      <span>Penyesuaian / Diskon Denda:</span>
                      <span className="font-semibold text-emerald-600">Rp 0</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center font-bold text-slate-900">
                      <span>TOTAL TAGIHAN KREDIT:</span>
                      <span className="text-sm text-[#003853]">{formatMoney(breakdown.total)}</span>
                    </div>

                    {isPaid ? (
                      <>
                        <div className="flex justify-between items-center font-bold text-emerald-700">
                          <span>TOTAL PEMBAYARAN DITERIMA:</span>
                          <span className="text-sm">{formatMoney(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center font-extrabold text-[#F15A24] pt-0.5">
                          <span>SISA KEWAJIBAN / SALDO TERHUTANG:</span>
                          <span className="text-xs bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            Rp 0 (LUNAS / ZERO BALANCE)
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center font-extrabold text-[#F15A24]">
                        <span>SISA KEWAJIBAN HARUS DIBAYAR:</span>
                        <span className="text-sm">{formatMoney(totalAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Settlement Audit Trail */}
              {isPaid && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="text-[10px] font-bold text-[#005E7A] uppercase tracking-wider">
                    Data Transaksi & Jurnal Pelunasan
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">No. Referensi Jurnal:</span>
                      <span className="font-mono font-bold text-slate-900">{referenceNo}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Waktu Pembayaran:</span>
                      <span className="font-semibold text-slate-800">{dateTime}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Metode Pembayaran:</span>
                      <span className="font-semibold text-slate-800">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Rekening / VA:</span>
                      <span className="font-mono font-bold text-[#005E7A]">{vaNumber}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Status Host Kliring:</span>
                      <span className="font-bold text-emerald-700">TERVALIDASI REAL-TIME</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Kode Otorisasi:</span>
                      <span className="font-mono font-bold text-slate-800">
                        AUTH-BNI-{referenceNo.slice(-6)}-OK
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Official Electronic Bank Stamp & QR Verification Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60">
                {/* Official Electronic Seal */}
                <div className="p-2.5 rounded-lg border-2 border-dashed border-[#005E7A]/40 bg-teal-50/30 flex flex-col items-center justify-center text-center space-y-1">
                  <ShieldCheck className="w-5 h-5 text-[#005E7A]" />
                  <div className="font-black text-[9px] text-[#003853] tracking-wider uppercase">
                    PT BANK NEGARA INDONESIA (PERSERO) TBK
                  </div>
                  <div className="text-[8px] font-bold text-slate-600">DIVISI RETAIL COLLECTION & RECOVERY</div>
                  <div className="px-2 py-0.5 rounded bg-[#F15A24] text-white font-bold text-[8px] tracking-wider uppercase">
                    {isPaid ? 'TERVALIDASI ELEKTRONIK • SAH' : 'BILLING RESMI TERBIT'}
                  </div>
                  <div className="text-[7.5px] font-mono text-slate-400">
                    ID SEAL: BNI-SEC-{referenceNo.slice(-8)}
                  </div>
                </div>

                {/* QR Verification Info */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200">
                  <div className="w-14 h-14 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <QrCode className="w-9 h-9" />
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="font-bold text-slate-900 leading-tight">Verifikasi Keaslian Dokumen</div>
                    <p className="text-slate-500 leading-tight text-[9px]">
                      Pindai QR ini atau kunjungi portal verifikasi resmi Bank BNI.
                    </p>
                    <span className="font-mono font-bold text-[#005E7A] text-[9px] block truncate">
                      verify.bni.co.id/billing/{referenceNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal Notes */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-[10px] text-slate-500 space-y-0.5">
                <div className="font-bold text-slate-700">Catatan Penting Billing Resmi:</div>
                <p>
                  1. Lembar ini merupakan bukti penagihan dan rekonsiliasi pelunasan resmi yang diterbitkan komputerisasi oleh Bank BNI.
                </p>
                <p>
                  2. Dokumen elektronik ini sah dan diakui secara hukum sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1 tanpa tanda tangan basah.
                </p>
                <p>
                  3. BNI Call 1500046 siap melayani 24 Jam apabila Anda membutuhkan konfirmasi atau penjelasan lebih lanjut.
                </p>
              </div>

              {/* Regulatory Footer */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400 gap-1">
                <span>
                  PT Bank Negara Indonesia (Persero) Tbk. berizin & diawasi oleh OJK serta peserta LPS.
                </span>
                <span>Halaman 1 dari 1 • Dokumen Rahasia Nasabah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Format Dokumen Standar Perbankan BNI (A4 PDF)</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-none py-2 px-5 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lembar Billing Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Lembar Billing (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
