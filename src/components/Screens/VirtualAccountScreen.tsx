import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  Shield,
  ChevronDown,
  Smartphone,
  Landmark,
  CreditCard,
  QrCode,
  Download,
  Wallet,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { BankId, PaymentChannel } from '../../types';
import { BankBadge } from '../BankLogos';
import { useLanguage } from '../../i18n/LanguageContext';

interface VirtualAccountScreenProps {
  bankId: BankId;
  channel: PaymentChannel;
  vaNumber: string;
  amount: number;
  expiryDateTime: string;
  onContinueToWaiting: () => void;
  onOpenGuideModal: () => void;
  onBack: () => void;
  compact?: boolean;
}

export const VirtualAccountScreen: React.FC<VirtualAccountScreenProps> = ({
  bankId,
  channel = 'va',
  vaNumber,
  amount,
  expiryDateTime,
  onContinueToWaiting,
  onOpenGuideModal,
  onBack,
  compact = false,
}) => {
  const { t, formatMoney, formatDateLocalized } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Active section for accordion
  const [activeSection, setActiveSection] = useState<string | null>(
    channel === 'qris' ? 'qris_ewallet' : 'bni'
  );

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    setIsDownloading(true);
    // Create an offscreen canvas to generate a downloadable QR image
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 460;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 460);

        // Header
        ctx.fillStyle = '#003853';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('QRIS STANDAR PEMBAYARAN NASIONAL', 200, 36);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px monospace';
        ctx.fillText('BNI REC - ANDI PRATAMA | NMID: ID1020023819472', 200, 56);

        // Amount Box
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, 70, 320, 50);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(40, 70, 320, 50);

        ctx.fillStyle = '#003853';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(formatMoney(amount), 200, 102);

        // QR Code visual representation (mock blocks on canvas)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(90, 140, 220, 220);

        // QR cutouts
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(100, 150, 200, 200);

        // Corners
        const drawMarker = (x: number, y: number, color: string) => {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x, y, 46, 46);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 8, y + 8, 30, 30);
          ctx.fillStyle = color;
          ctx.fillRect(x + 14, y + 14, 18, 18);
        };
        drawMarker(110, 160, '#F15A24');
        drawMarker(244, 160, '#005E7A');
        drawMarker(110, 294, '#0f172a');

        // Pattern filler
        ctx.fillStyle = '#1e293b';
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(175 + i * 10, 210 + j * 10, 8, 8);
            }
          }
        }

        // Expiry notice
        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Berlaku s/d: ${formatDateLocalized(expiryDateTime)}`, 200, 390);
        ctx.fillText(`Ref: ${vaNumber}`, 200, 410);

        // Trigger download
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `QRIS-BNI-${vaNumber}.png`;
        link.href = url;
        link.click();
      }
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 400);
  };

  // Dedicated QR SVG component used across QRIS and VA
  const renderQrSvg = (sizeClass: string) => (
    <svg viewBox="0 0 100 100" className={`${sizeClass} fill-slate-900 select-none`}>
      <rect x="0" y="0" width="28" height="28" rx="3" fill="#0f172a" />
      <rect x="5" y="5" width="18" height="18" rx="2" fill="white" />
      <rect x="9" y="9" width="10" height="10" rx="1" fill="#F15A24" />

      <rect x="72" y="0" width="28" height="28" rx="3" fill="#0f172a" />
      <rect x="77" y="5" width="18" height="18" rx="2" fill="white" />
      <rect x="81" y="9" width="10" height="10" rx="1" fill="#005E7A" />

      <rect x="0" y="72" width="28" height="28" rx="3" fill="#0f172a" />
      <rect x="5" y="77" width="18" height="18" rx="2" fill="white" />
      <rect x="9" y="81" width="10" height="10" rx="1" fill="#0f172a" />

      <rect x="36" y="6" width="6" height="6" />
      <rect x="48" y="10" width="8" height="6" />
      <rect x="60" y="6" width="6" height="6" />
      <rect x="36" y="24" width="6" height="6" />
      <rect x="48" y="22" width="6" height="6" />

      <rect x="12" y="36" width="8" height="6" />
      <rect x="24" y="42" width="6" height="6" />
      <rect x="36" y="36" width="6" height="8" />
      <rect x="46" y="46" width="8" height="8" fill="#F15A24" />
      <rect x="58" y="36" width="6" height="8" />
      <rect x="70" y="42" width="6" height="6" />
      <rect x="84" y="36" width="8" height="6" />

      <rect x="36" y="64" width="6" height="6" />
      <rect x="48" y="58" width="6" height="6" />
      <rect x="60" y="64" width="6" height="6" />

      <rect x="36" y="76" width="8" height="6" />
      <rect x="50" y="76" width="6" height="6" />
      <rect x="62" y="72" width="6" height="8" />
      <rect x="76" y="76" width="6" height="6" />
      <rect x="88" y="76" width="6" height="6" />
    </svg>
  );

  return (
    <div className={`space-y-4 animate-in fade-in duration-300 ${compact ? 'text-xs' : ''}`}>
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-[#003853] tracking-tight">
          {channel === 'qris'
            ? t.va.qrisTitle
            : channel === 'transfer'
            ? t.va.transferTitle
            : t.va.vaTitle}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          {channel === 'qris'
            ? t.va.qrisSubtitle
            : channel === 'transfer'
            ? t.va.transferSubtitle
            : t.va.vaSubtitle}
        </p>
      </div>

      {/* Main Card */}
      {channel === 'qris' ? (
        /* Dedicated Main Card for QRIS Channel */
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col items-center text-center">
            {/* QRIS & Merchant Header */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-xs font-black tracking-wider uppercase shadow-xs">
                {t.va.qrisBadge}
              </span>
              <span className="text-xs font-bold text-slate-800">
                {t.va.qrisStandard}
              </span>
            </div>

            <div className="text-sm sm:text-base font-extrabold text-[#003853] mt-0.5">
              BNI REC - ANDI PRATAMA
            </div>
            <div className="text-[11px] text-slate-500 font-mono tracking-wide">
              NMID: ID1020023819472
            </div>

            {/* Total Pembayaran Banner */}
            <div className="mt-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 w-full max-w-sm">
              <div className="text-[11px] text-slate-500 font-medium">{t.va.totalPayment}</div>
              <div className="text-2xl sm:text-3xl font-black text-[#003853] tracking-tight mt-0.5">
                {formatMoney(amount)}
              </div>
            </div>

            {/* QR Code Container with Frame */}
            <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center relative group">
              <div className="w-52 h-52 sm:w-60 sm:h-60 bg-white flex items-center justify-center p-2">
                {renderQrSvg('w-full h-full')}
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#005E7A]" />
                <span>{t.va.scanQrDesc}</span>
              </div>
            </div>

            {/* QR Actions: Unduh QR Code & Salin Kode Ref */}
            <div className="mt-3.5 flex items-center justify-center gap-2 flex-wrap w-full max-w-sm">
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={isDownloading}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                  downloaded
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                {downloaded ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>{downloaded ? t.va.downloadedQr : isDownloading ? t.va.downloadingQr : t.va.downloadQr}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? t.va.copied : t.va.copy} Ref</span>
              </button>
            </div>

            {/* Expiry and actions */}
            <div className="mt-3.5 flex flex-col items-center gap-1 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {t.va.validUntil}: <strong className="text-slate-900 font-bold">{formatDateLocalized(expiryDateTime)}</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {t.va.refCode}: <span className="font-mono text-slate-600 font-semibold">{vaNumber}</span>
              </div>
            </div>

            {/* Supported App Badges Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 w-full">
              <div className="text-[11px] font-medium text-slate-500 mb-2">
                Dapat dipindai melalui aplikasi:
              </div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja', 'BCA Mobile', 'Livin\' Mandiri', 'BRImo', 'Wondr BNI'].map((app) => (
                  <span
                    key={app}
                    className="px-2 py-0.5 bg-slate-100/90 text-slate-700 rounded-md text-[10px] font-semibold border border-slate-200/80"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default Main Card for VA / Transfer Bank */
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Bank logo & Number & Total & Expiry */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <BankBadge bankId={bankId} className="h-6" />
                {channel === 'transfer' && (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {t.va.targetAcc}
                  </span>
                )}
              </div>

              <div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mb-1">
                  {channel === 'transfer' ? t.va.targetAcc : t.va.vaNumberLabel}
                </div>
                <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-slate-100">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#003853] tracking-wide select-all">
                    {vaNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? t.va.copied : t.va.copy}</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.va.totalPayment}</div>
                <div className="text-lg sm:text-xl font-black text-[#003853] mt-0.5">
                  {formatMoney(amount)}
                </div>
              </div>

              <div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.va.validUntil}</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  {formatDateLocalized(expiryDateTime)}
                </div>
              </div>
            </div>

            {/* Right: QR Code for scan */}
            <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-lg border border-slate-200 self-center sm:self-auto shrink-0 shadow-2xs">
              <span className="text-[10px] font-medium text-slate-500 mb-1">
                {t.va.scanToPay}
              </span>
              <div className="w-24 h-24 p-1 bg-white flex items-center justify-center">
                {renderQrSvg('w-full h-full')}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5">{t.va.optional}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cara Pembayaran (Expandable Accordion) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900">
            {channel === 'qris'
              ? t.va.qrisGuideTitle
              : channel === 'transfer'
              ? t.va.transferGuideTitle
              : t.va.vaGuideTitle}
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">{t.va.toggleHint}</span>
        </div>

        <div className="space-y-2">
          {channel === 'qris' ? (
            /* QRIS ACCORDION SECTIONS */
            <>
              {/* Opsi 1: QRIS via E-Wallet */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('qris_ewallet')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {t.va.qrisEwalletTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">{t.va.qrisEwalletSub}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      activeSection === 'qris_ewallet' ? 'rotate-180 text-[#005E7A]' : ''
                    }`}
                  />
                </button>

                {activeSection === 'qris_ewallet' && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2">
                    {t.instructions.qrisEwallet.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#005E7A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opsi 2: QRIS via Mobile Banking */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('qris_mbanking')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#005E7A]/10 text-[#005E7A] flex items-center justify-center shrink-0">
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {t.va.qrisMbankingTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">{t.va.qrisMbankingSub}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      activeSection === 'qris_mbanking' ? 'rotate-180 text-[#005E7A]' : ''
                    }`}
                  />
                </button>

                {activeSection === 'qris_mbanking' && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2">
                    {t.instructions.qrisMbanking.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#005E7A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* VA & TRANSFER ACCORDION SECTIONS */
            <>
              {/* Opsi 1: Transfer dari BNI */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('bni')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#005E7A]/10 text-[#005E7A] flex items-center justify-center shrink-0">
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {channel === 'transfer' ? t.va.bniMobileTransferTitle : t.va.bniMobileTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {channel === 'transfer' ? t.va.bniMobileTransferSub : t.va.bniMobileSub}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      activeSection === 'bni' ? 'rotate-180 text-[#005E7A]' : ''
                    }`}
                  />
                </button>

                {activeSection === 'bni' && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2">
                    {(channel === 'transfer'
                      ? t.instructions.bniMobileTransfer
                      : t.instructions.bniMobileVa
                    ).map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#005E7A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opsi 2: Transfer dari Bank Lain */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('other_banks')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#F15A24] flex items-center justify-center shrink-0">
                      <Landmark className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                        <span>{t.va.otherBanksTitle}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                          {t.va.bankCodeBadge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">{t.va.otherBanksSub}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      activeSection === 'other_banks' ? 'rotate-180 text-[#005E7A]' : ''
                    }`}
                  />
                </button>

                {activeSection === 'other_banks' && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2">
                    <div className="p-2 rounded-lg bg-sky-50 border border-sky-200/70 text-[11px] text-sky-900 flex items-center justify-between flex-wrap gap-1">
                      <span>{t.va.destBankInfo}</span>
                      <span>No. Rekening / VA: <strong className="font-mono text-[#005E7A]">{vaNumber}</strong></span>
                    </div>
                    {t.instructions.otherBanks.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#005E7A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opsi 3: Transfer melalui Mesin ATM */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('atm')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {t.va.atmTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">{t.va.atmSub}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      activeSection === 'atm' ? 'rotate-180 text-[#005E7A]' : ''
                    }`}
                  />
                </button>

                {activeSection === 'atm' && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2">
                    {t.instructions.atm.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#005E7A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Auto-update Info Box */}
      <div className="p-3 rounded-xl bg-[#eef7fc] border border-sky-200/80 flex items-start gap-2.5 text-xs text-slate-700">
        <div className="w-5 h-5 rounded-md bg-[#005E7A] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          {t.va.autoUpdateNotice}
        </p>
      </div>

      {/* Action Buttons: Kembali (left) & Cek status pembayaran (right) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          {t.common.back}
        </button>

        {onContinueToWaiting && (
          <button
            onClick={onContinueToWaiting}
            className="py-2.5 px-6 rounded-xl bg-[#F15A24] hover:bg-[#d94b1a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <span>{t.va.checkStatusBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
