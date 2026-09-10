import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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

  const [copiedBankCode, setCopiedBankCode] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBankCode = () => {
    navigator.clipboard.writeText('009');
    setCopiedBankCode(true);
    setTimeout(() => setCopiedBankCode(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Generate real, high-resolution QR code
    const rawVa = vaNumber.replace(/\s+/g, '');
    const qrisPayload = `00020101021226600014ID.LINKAJA.WWW011893600998${rawVa}0215ID10200238194720303UME51440014ID.CO.BNI.WWW0215${rawVa}520458125303360540${amount}.005802ID5919BNI REC - JANUANTARA6007JAKARTA62190115${rawVa}6304`;
    QRCode.toDataURL(qrisPayload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#002840',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [vaNumber, amount]);

  const handleDownloadQr = () => {
    if (!qrCodeUrl) return;
    setIsDownloading(true);
    const link = document.createElement('a');
    link.download = `QRIS-BNI-REC-ANDI-PRATAMA.png`;
    link.href = qrCodeUrl;
    link.click();
    setIsDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  // Dedicated QR component used across QRIS and VA
  const renderQr = (sizeClass: string) => (
    qrCodeUrl ? (
      <img src={qrCodeUrl} alt="Kode QRIS" className={`${sizeClass} object-contain select-none`} />
    ) : (
      <div className={`${sizeClass} flex items-center justify-center text-slate-400 text-xs`}>
        Memuat QR...
      </div>
    )
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

      {/* Main Card: QRIS or VA/Transfer */}
      {channel === 'qris' ? (
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Left: Merchant Info, Total, Expiry */}
            <div className="space-y-4 flex-1">
              {/* QRIS Emblem & Merchant */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#ED1C24] text-white text-[10px] font-black tracking-wider uppercase shadow-2xs">
                    {t.va.qrisBadge}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {t.va.qrisStandard}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#003853] tracking-tight">
                  BNI REC - JANUANTARA
                </h2>
              </div>

              {/* Total Payment */}
              <div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.va.totalPayment}</div>
                <div className="text-2xl sm:text-3xl font-black text-[#003853] mt-0.5 tracking-tight">
                  {formatMoney(amount)}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-amber-50/80 border border-amber-200/80 px-3 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    {t.va.validUntil}: <strong className="text-slate-900 font-bold">{formatDateLocalized(expiryDateTime)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Real QR Code with scan prompt and download button */}
            <div className="flex flex-col items-center justify-center p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/90 self-center sm:self-auto shrink-0 shadow-2xs space-y-2.5">
              <span className="text-xs font-bold text-slate-700">
                {t.va.scanToPay}
              </span>
              <div className="w-40 h-40 sm:w-44 sm:h-44 p-1.5 bg-white rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-center">
                {renderQr('w-full h-full')}
              </div>
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={isDownloading || !qrCodeUrl}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs ${downloaded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
              >
                {downloaded ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>{downloaded ? t.va.downloadedQr : isDownloading ? t.va.downloadingQr : t.va.downloadQr}</span>
              </button>
            </div>
          </div>
        </div>
      ) : channel === 'transfer' ? (
        /* Dedicated Main Card for Bank Transfer (No QR, Destination Bank BNI, Code 009, Beneficiary) */
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          {/* Top: Destination Bank & Verified Official Badge */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <BankBadge bankId="bni" className="h-7" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800">
                  PT Bank Negara Indonesia (Persero) Tbk
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  {t.va.destBankTransferDesc}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-bold border border-emerald-200/80 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.va.officialTransferBadge}</span>
            </span>
          </div>

          {/* Account Number Box (Primary Focus for Transfer) */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {t.va.targetAcc}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold bg-slate-200/60 px-2 py-0.5 rounded">
                BNI Escrow / Collection
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap pt-0.5">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#003853] tracking-wider select-all">
                {vaNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs ${copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50/60'
                  }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.va.copied : t.va.copy}</span>
              </button>
            </div>
          </div>

          {/* Beneficiary Name & Bank Code Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Box: Nama Penerima (Beneficiary Name) */}
            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
              <div className="text-[11px] text-slate-500 font-medium">
                {t.va.beneficiaryLabel}
              </div>
              <div className="text-sm sm:text-base font-black text-[#003853] tracking-tight">
                BNI REC - JANUANTARA
              </div>
              <p className="text-[10px] text-slate-400">
                {t.va.beneficiaryNotice}
              </p>
            </div>

            {/* Box: Kode Bank (untuk transfer dari bank lain) */}
            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-medium">
                  {t.va.bankCodeLabel}
                </div>
                <button
                  type="button"
                  onClick={handleCopyBankCode}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                >
                  {copiedBankCode ? t.va.copied : t.va.copy}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-[#003853] bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  009
                </span>
                <span className="text-[10px] text-slate-500">
                  {t.va.bankCodeDesc}
                </span>
              </div>
            </div>
          </div>

          {/* Total Amount & Expiry Row */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">{t.va.totalPayment}</div>
              <div className="flex items-center gap-2.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#003853]">
                  {formatMoney(amount)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${copiedAmount
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {copiedAmount ? t.va.copied : t.va.copyAmount}
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium">{t.va.validUntil}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{formatDateLocalized(expiryDateTime)}</span>
              </div>
            </div>
          </div>

          {/* Supported Interbank Transfer Methods Info Banner */}
          <div className="p-3 rounded-lg bg-sky-50/80 border border-sky-200/80 flex items-start gap-2.5 text-xs text-sky-950">
            <Landmark className="w-4 h-4 text-[#005E7A] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">{t.va.supportedTransferMethodsTitle} </span>
              <span className="text-slate-700">
                {t.va.supportedTransferMethodsDesc}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Default Main Card for Virtual Account */
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Bank logo & Number & Total & Expiry */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <BankBadge bankId={bankId} className="h-6" />
              </div>

              <div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mb-1">
                  {t.va.vaNumberLabel}
                </div>
                <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-slate-100">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#003853] tracking-wide select-all">
                    {vaNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${copied
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
                {renderQr('w-full h-full')}
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
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'qris_ewallet' ? 'rotate-180 text-[#005E7A]' : ''
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
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'qris_mbanking' ? 'rotate-180 text-[#005E7A]' : ''
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
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'bni' ? 'rotate-180 text-[#005E7A]' : ''
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
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'other_banks' ? 'rotate-180 text-[#005E7A]' : ''
                      }`}
                  />
                </button>

                {activeSection === 'other_banks' && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2">
                    <div className="p-2 rounded-lg bg-sky-50 border border-sky-200/70 text-[11px] text-sky-900 flex items-center justify-between flex-wrap gap-1">
                      <span>{t.va.destBankInfo}</span>
                      <span>
                        {channel === 'transfer' ? t.va.targetAcc : 'No. Rekening / VA'}:{' '}
                        <strong className="font-mono text-[#005E7A]">{vaNumber}</strong>
                      </span>
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
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'atm' ? 'rotate-180 text-[#005E7A]' : ''
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
