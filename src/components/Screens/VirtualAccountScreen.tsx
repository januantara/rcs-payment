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
  Globe,
} from 'lucide-react';
import { BankId, PaymentChannel } from '../../types';
import { BankBadge } from '../BankLogos';
import { useLanguage } from '../../i18n/LanguageContext';

interface GuideSection {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  badge?: string;
  destBankInfo?: string;
  steps: string[];
}

const getVaGuideSections = (
  bankId: string,
  channel: string,
  language: string,
  vaNumber: string,
  t: any
): GuideSection[] => {
  if (channel === 'transfer') {
    return [
      {
        id: 'transfer_bni',
        icon: Smartphone,
        title: language === 'EN' ? 'Transfer from BNI Account (Wondr / Mobile Banking)' : 'Transfer dari Rekening BNI (Wondr / Mobile Banking)',
        subtitle: language === 'EN' ? 'Intra-Bank Transfer (BNI to BNI)' : 'Transfer Antar Rekening BNI',
        steps: t.instructions.bniMobileTransfer,
      },
      {
        id: 'transfer_other',
        icon: Landmark,
        title: language === 'EN' ? 'Transfer from Other Banks (BCA, Mandiri, BRI, etc.)' : 'Transfer Antar Bank (BCA, Mandiri, BRI, dll)',
        subtitle: language === 'EN' ? 'BI-FAST / Online Interbank Transfer' : 'Transfer Antar Bank / BI-FAST / Online Transfer',
        badge: 'Kode Bank: 009',
        destBankInfo: language === 'EN' ? 'Destination Bank: Bank BNI (Code 009)' : 'Bank Tujuan: Bank BNI (Kode 009)',
        steps: t.instructions.otherBanks,
      },
      {
        id: 'transfer_atm',
        icon: CreditCard,
        title: language === 'EN' ? 'Transfer via ATM Machine (BNI, Prima, Bersama)' : 'Transfer via Mesin ATM (ATM BNI, Bersama, Prima)',
        subtitle: language === 'EN' ? 'Available at any ATM machine nationwide' : 'Melalui mesin ATM bank apapun',
        steps: t.instructions.atm,
      },
    ];
  }

  // Virtual Account Channel
  if (bankId === 'bca') {
    return [
      {
        id: 'mbanking',
        icon: Smartphone,
        title: 'BCA mobile / myBCA',
        subtitle: 'Menu m-Transfer > BCA Virtual Account',
        steps: language === 'EN' ? [
          'Open BCA mobile app and select "m-BCA".',
          'Enter your 6-character Access Code to log in.',
          'Select "m-Transfer" menu, then choose "BCA Virtual Account".',
          `Enter the BCA Virtual Account number: ${vaNumber}.`,
          'Verify billing details (recipient BNI REC - JANUANTARA & amount), then enter your m-BCA PIN.',
          'Payment completed successfully. Save the transaction receipt as proof.',
        ] : [
          'Buka aplikasi BCA mobile dan pilih menu "m-BCA".',
          'Masukkan Kode Akses Anda untuk login.',
          'Pilih menu "m-Transfer", kemudian pilih "BCA Virtual Account".',
          `Masukkan nomor BCA Virtual Account: ${vaNumber}.`,
          'Periksa rincian tagihan (nama BNI REC - JANUANTARA & total bayar), lalu masukkan PIN m-BCA.',
          'Pembayaran berhasil. Simpan bukti transaksi sebagai tanda terima resmi.',
        ],
      },
      {
        id: 'ibanking',
        icon: Globe,
        title: 'KlikBCA (Internet Banking)',
        subtitle: 'Menu Transfer Dana > Transfer ke BCA Virtual Account',
        steps: language === 'EN' ? [
          'Log in to KlikBCA Individual website (ibank.klikbca.com).',
          'Select "Transfer Dana" menu, then choose "Transfer ke BCA Virtual Account".',
          `Enter the BCA Virtual Account number: ${vaNumber}.`,
          'Review the billing information displayed on screen.',
          'Enter your KeyBCA Appli 1 response to confirm and complete payment.',
        ] : [
          'Login ke situs KlikBCA Individual (ibank.klikbca.com).',
          'Pilih menu "Transfer Dana", lalu pilih "Transfer ke BCA Virtual Account".',
          `Masukkan nomor BCA Virtual Account: ${vaNumber}.`,
          'Konfirmasi rincian tagihan pembayaran yang muncul di layar.',
          'Masukkan respon KeyBCA Appli 1 dan kirim untuk menyelesaikan pembayaran.',
        ],
      },
      {
        id: 'atm',
        icon: CreditCard,
        title: 'ATM BCA',
        subtitle: 'Menu Transaksi Lainnya > Transfer > Ke Rek BCA Virtual Account',
        steps: language === 'EN' ? [
          'Insert your BCA ATM card and enter your PIN at any BCA ATM.',
          'Select "Transaksi Lainnya" > "Transfer" > "Ke Rek BCA Virtual Account".',
          `Enter the BCA Virtual Account number: ${vaNumber}.`,
          'Confirm that the recipient name and amount match on screen.',
          'Press "Yes" / "Correct" to complete payment and take your printed receipt.',
        ] : [
          'Masukkan kartu Paspor BCA dan PIN Anda di mesin ATM BCA.',
          'Pilih menu "Transaksi Lainnya" > "Transfer" > "Ke Rek BCA Virtual Account".',
          `Masukkan nomor BCA Virtual Account: ${vaNumber}.`,
          'Periksa kecocokan nama tagihan dan total pembayaran pada layar konfirmasi.',
          'Tekan "Ya" / "Benar" untuk memproses pembayaran dan simpan struk transaksi.',
        ],
      },
    ];
  }

  if (bankId === 'mandiri') {
    return [
      {
        id: 'mbanking',
        icon: Smartphone,
        title: "Livin' by Mandiri",
        subtitle: 'Menu Bayar > Virtual Account',
        steps: language === 'EN' ? [
          'Open Livin\' by Mandiri app and log in to your account.',
          'Select "Bayar" (Pay) menu, then choose "Virtual Account".',
          `Enter the Mandiri Virtual Account number: ${vaNumber}.`,
          'Review recipient name (BNI REC - JANUANTARA) and billing amount.',
          'Tap "Lanjutkan Bayar" and enter your Livin\' PIN to complete payment.',
        ] : [
          'Buka aplikasi Livin\' by Mandiri dan login ke akun Anda.',
          'Pilih menu "Bayar", lalu pilih "Virtual Account".',
          `Masukkan nomor Mandiri Virtual Account: ${vaNumber}.`,
          'Periksa rincian nama tagihan (BNI REC - JANUANTARA) dan nominal pembayaran.',
          'Tekan "Lanjutkan Bayar" dan masukkan PIN Livin\' Anda untuk menyelesaikan pembayaran.',
        ],
      },
      {
        id: 'ibanking',
        icon: Globe,
        title: 'Mandiri Internet Banking',
        subtitle: 'Menu Bayar > Multi Payment',
        steps: language === 'EN' ? [
          'Log in to Mandiri Internet Banking website.',
          'Select "Bayar" > choose "Multi Payment".',
          `Enter the Mandiri Virtual Account number: ${vaNumber}.`,
          'Confirm payment details and amount on the screen.',
          'Enter your Mandiri Token PIN to confirm and finish payment.',
        ] : [
          'Akses situs Mandiri Internet Banking dan login ke akun Anda.',
          'Pilih menu "Bayar" > "Multi Payment".',
          `Masukkan nomor Mandiri Virtual Account: ${vaNumber}.`,
          'Konfirmasi rincian tagihan pembayaran pada layar.',
          'Masukkan PIN Mandiri Token untuk menyelesaikan pembayaran.',
        ],
      },
      {
        id: 'atm',
        icon: CreditCard,
        title: 'ATM Mandiri',
        subtitle: 'Menu Bayar/Beli > Multi Payment / Virtual Account',
        steps: language === 'EN' ? [
          'Insert your Mandiri debit card and enter your PIN at Mandiri ATM.',
          'Select "Bayar/Beli" > "Lainnya" > select "Multi Payment" or "Virtual Account".',
          `Enter the Mandiri Virtual Account number: ${vaNumber}.`,
          'Review recipient name and bill amount on the ATM screen.',
          'Press "Correct" to process payment and take the printed receipt.',
        ] : [
          'Masukkan kartu ATM Mandiri dan PIN Anda di mesin ATM Mandiri.',
          'Pilih menu "Bayar/Beli" > "Lainnya" > pilih "Multi Payment" atau "Virtual Account".',
          `Masukkan nomor Mandiri Virtual Account: ${vaNumber}.`,
          'Periksa konfirmasi data tagihan pada layar ATM.',
          'Tekan "Benar" untuk memproses pembayaran dan simpan struk transaksi Anda.',
        ],
      },
    ];
  }

  if (bankId === 'bri') {
    return [
      {
        id: 'mbanking',
        icon: Smartphone,
        title: 'BRImo (BRI Mobile Banking)',
        subtitle: 'Menu Tagihan / Bayar > BRIVA',
        steps: language === 'EN' ? [
          'Open BRImo app and log in with your credentials.',
          'Select "Tagihan" or "Bayar" menu, then choose "BRIVA".',
          `Select "Tambah Transaksi Baru" and enter Virtual Account number: ${vaNumber}.`,
          'Verify billing information (BNI REC - JANUANTARA) and amount.',
          'Enter your BRImo PIN to complete payment and save the receipt.',
        ] : [
          'Buka aplikasi BRImo dan login dengan akun Anda.',
          'Pilih menu "Tagihan" atau "Bayar", kemudian pilih "BRIVA".',
          `Pilih "Tambah Transaksi Baru" dan masukkan nomor Virtual Account: ${vaNumber}.`,
          'Periksa nama tagihan (BNI REC - JANUANTARA) dan nominal tagihan.',
          'Masukkan PIN BRImo Anda untuk memproses pembayaran dan simpan bukti transaksi.',
        ],
      },
      {
        id: 'ibanking',
        icon: Globe,
        title: 'Internet Banking BRI',
        subtitle: 'Menu Pembayaran > BRIVA',
        steps: language === 'EN' ? [
          'Access BRI Internet Banking portal (ib.bri.co.id) and log in.',
          'Select "Pembayaran" > choose "BRIVA".',
          `Enter the BRI Virtual Account number: ${vaNumber}.`,
          'Review payment confirmation on screen.',
          'Enter your password and BRI m-Token to authorize payment.',
        ] : [
          'Akses situs Internet Banking BRI (ib.bri.co.id) dan login ke akun Anda.',
          'Pilih menu "Pembayaran" > "BRIVA".',
          `Masukkan nomor BRI Virtual Account: ${vaNumber}.`,
          'Periksa rincian pembayaran pada layar konfirmasi.',
          'Masukkan password dan kode m-Token BRI untuk memproses pembayaran.',
        ],
      },
      {
        id: 'atm',
        icon: CreditCard,
        title: 'ATM BRI',
        subtitle: 'Menu Transaksi Lain > Pembayaran > BRIVA',
        steps: language === 'EN' ? [
          'Insert your BRI ATM card and PIN at a BRI ATM.',
          'Select "Transaksi Lain" > "Pembayaran" > "Lain-Lain" > "BRIVA".',
          `Enter the BRI Virtual Account number: ${vaNumber}.`,
          'Check billing details displayed on the ATM screen.',
          'Press "Yes" to complete payment and save the ATM receipt.',
        ] : [
          'Masukkan kartu ATM BRI dan PIN Anda di mesin ATM BRI.',
          'Pilih menu "Transaksi Lain" > "Pembayaran" > "Lain-Lain" > "BRIVA".',
          `Masukkan nomor BRI Virtual Account: ${vaNumber}.`,
          'Periksa kecocokan data pembayaran pada layar konfirmasi ATM.',
          'Tekan "Ya" untuk memproses pembayaran dan simpan struk transaksi Anda.',
        ],
      },
    ];
  }

  // Default: BNI Virtual Account
  return [
    {
      id: 'mbanking',
      icon: Smartphone,
      title: 'Wondr by BNI / BNI Mobile Banking',
      subtitle: 'Menu Transfer > Virtual Account Billing',
      steps: language === 'EN' ? [
        'Open Wondr by BNI or BNI Mobile Banking and log in with your credentials.',
        'Select "Transfer" menu, then choose "Virtual Account Billing".',
        `Select "Input Baru" tab and enter the Virtual Account number: ${vaNumber}.`,
        'Verify recipient name (BNI REC - JANUANTARA) and amount, then enter your Transaction Password.',
        'Payment successful. Save proof of transfer as official receipt.',
      ] : [
        'Buka aplikasi Wondr by BNI atau BNI Mobile Banking dan login dengan akun Anda.',
        'Pilih menu "Transfer", kemudian pilih "Virtual Account Billing".',
        `Pilih tab "Input Baru" dan masukkan nomor Virtual Account: ${vaNumber}.`,
        'Periksa nama tagihan (BNI REC - JANUANTARA) dan nominal tagihan, lalu masukkan Password Transaksi.',
        'Pembayaran berhasil. Simpan bukti transaksi sebagai tanda terima resmi.',
      ],
    },
    {
      id: 'ibanking',
      icon: Globe,
      title: 'BNI Internet Banking',
      subtitle: 'Menu Pembayaran Tagihan > Virtual Account Billing',
      steps: language === 'EN' ? [
        'Log in to BNI Internet Banking website (ib.bni.co.id).',
        'Select "Transaksi" > "Pembayaran Tagihan" > "Virtual Account Billing".',
        `Enter the Virtual Account number: ${vaNumber} and select debit account.`,
        'Confirm bill details displayed on the screen.',
        'Enter your BNI token authentication code to finalize payment.',
      ] : [
        'Login ke situs BNI Internet Banking (ib.bni.co.id).',
        'Pilih menu "Transaksi" > "Pembayaran Tagihan" > "Virtual Account Billing".',
        `Masukkan nomor Virtual Account: ${vaNumber} dan pilih rekening debet Anda.`,
        'Konfirmasi rincian tagihan yang muncul pada layar.',
        'Masukkan kode otentikasi token BNI Anda untuk menyelesaikan pembayaran.',
      ],
    },
    {
      id: 'atm',
      icon: CreditCard,
      title: 'ATM BNI',
      subtitle: 'Menu Lainnya > Transfer > Virtual Account Billing',
      steps: language === 'EN' ? [
        'Insert your BNI ATM card and enter your PIN at any BNI ATM.',
        'Select "Menu Lainnya" > "Transfer" > "Virtual Account Billing".',
        `Enter the Virtual Account number: ${vaNumber}.`,
        'Review billing confirmation details displayed on screen.',
        'Press "Yes" / "Correct" to complete payment and keep the printed receipt.',
      ] : [
        'Masukkan kartu ATM BNI dan PIN Anda di mesin ATM BNI.',
        'Pilih menu "Menu Lainnya" > "Transfer" > "Virtual Account Billing".',
        `Masukkan nomor Virtual Account: ${vaNumber}.`,
        'Periksa konfirmasi data tagihan yang muncul di layar ATM.',
        'Tekan "Ya" / "Benar" untuk memproses pembayaran dan simpan struk transaksi.',
      ],
    },
  ];
};

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
  const { t, language, formatMoney, formatDateLocalized } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // 24 Hours Countdown Timer for QRIS
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedExpiry = sessionStorage.getItem('rcs_qris_expiry_timestamp');
      if (savedExpiry) {
        const diff = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000);
        if (diff > 0 && diff <= 86400) return diff;
      }
      const newExpiry = Date.now() + 24 * 60 * 60 * 1000;
      sessionStorage.setItem('rcs_qris_expiry_timestamp', newExpiry.toString());
    }
    return 24 * 60 * 60;
  });

  useEffect(() => {
    if (channel !== 'qris') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [channel]);

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Active section for accordion
  const [activeSection, setActiveSection] = useState<string | null>(
    channel === 'qris' ? 'qris_ewallet' : channel === 'transfer' ? 'transfer_bni' : 'mbanking'
  );

  useEffect(() => {
    setActiveSection(
      channel === 'qris' ? 'qris_ewallet' : channel === 'transfer' ? 'transfer_bni' : 'mbanking'
    );
  }, [channel, bankId]);

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
    link.download = `QRIS-BNI-REC-JANUANTARA.png`;
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
        <div className="flex flex-col items-center text-center max-w-sm mx-auto py-2 sm:py-4 space-y-4">
          {/* QR Code Section (Clean, centered, no redundant borders) */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#ED1C24] text-white text-[10px] font-black tracking-wider uppercase">
                {t.va.qrisBadge}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {t.va.qrisStandard}
              </span>
            </div>

            {/* QR Code Display */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 p-2 bg-white rounded-2xl flex items-center justify-center">
              {renderQr('w-full h-full')}
            </div>

            <span className="text-xs font-semibold text-slate-500">
              BNI REC - JANUANTARA
            </span>

            {/* Button Download QRIS */}
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer mt-1"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{t.va.downloadedQr}</span>
                </>
              ) : isDownloading ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                  <span>{t.va.downloadingQr}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.va.downloadQr}</span>
                </>
              )}
            </button>
          </div>

          {/* Nominal yang dibayar (Clean & focused) */}
          <div className="space-y-0.5 pt-1">
            <div className="text-xs text-slate-500 font-medium">
              {t.va.totalPayment}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#003853] tracking-tight">
              {formatMoney(amount)}
            </div>
          </div>

          {/* Countdown & Expiry for QRIS (Clean, neutral styling) */}
          <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{language === 'EN' ? 'Time remaining:' : 'Sisa waktu:'}</span>
              <span className="font-mono font-bold text-slate-800 tracking-wider">
                {formatCountdown(timeLeft)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t.va.validUntil} {formatDateLocalized(expiryDateTime)}
            </p>
          </div>
        </div>
      ) : channel === 'transfer' ? (
        /* Dedicated Main Card for Bank Transfer (No QR, Destination Bank BNI, Code 009, Beneficiary) */
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          {/* Top: Destination Bank */}
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
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
                  className="text-[11px] text-[#005E7A] hover:underline font-semibold cursor-pointer"
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
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg mt-0.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{formatDateLocalized(expiryDateTime)}</span>
              </div>
            </div>
          </div>

          {/* Supported Interbank Transfer Methods Info Banner */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 flex items-start gap-2.5 text-xs text-slate-700">
            <Landmark className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800">{t.va.supportedTransferMethodsTitle} </span>
              <span className="text-slate-600">
                {t.va.supportedTransferMethodsDesc}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Default Main Card for Virtual Account */
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2">
            <BankBadge bankId={bankId} className="h-6" />
          </div>

          <div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mb-1">
              {t.va.vaNumberLabel}
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-100">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#003853] tracking-wide select-all">
                {vaNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? t.va.copied : t.va.copy}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.va.totalPayment}</div>
              <div className="text-xl sm:text-2xl font-black text-[#003853] mt-0.5 tracking-tight">
                {formatMoney(amount)}
              </div>
            </div>

            <div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">{t.va.validUntil}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg mt-0.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{formatDateLocalized(expiryDateTime)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cara Pembayaran (Expandable Accordion) */}
      <div className="space-y-2.5 pt-4 sm:pt-5 mb-6 sm:mb-8">
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
            <>
              {/* Opsi 1: E-Wallet / Dompet Digital */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('qris_ewallet')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {t.va.qrisEwalletTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {t.va.qrisEwalletSub}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'qris_ewallet' ? 'rotate-180 text-[#005E7A]' : ''
                      }`}
                  />
                </button>

                {activeSection === 'qris_ewallet' && (
                  <div className="px-3.5 pt-3.5 pb-3.5 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2.5">
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

              {/* Opsi 2: Mobile Banking (QRIS Nasional) */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection('qris_mbanking')}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {t.va.qrisMbankingTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {t.va.qrisMbankingSub}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeSection === 'qris_mbanking' ? 'rotate-180 text-[#005E7A]' : ''
                      }`}
                  />
                </button>

                {activeSection === 'qris_mbanking' && (
                  <div className="px-3.5 pt-3.5 pb-3.5 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2.5">
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
            getVaGuideSections(bankId, channel, language, vaNumber, t).map((item) => {
              const isOpen = activeSection === item.id;
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(item.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.subtitle}</div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#005E7A]' : ''
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pt-3.5 pb-3.5 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 space-y-2.5">
                      {item.destBankInfo && (
                        <div className="p-2.5 rounded-lg bg-slate-100/60 border border-slate-200/80 text-[11px] text-slate-700 flex items-center justify-between flex-wrap gap-1">
                          <span>{item.destBankInfo}</span>
                          <span>
                            {channel === 'transfer' ? t.va.targetAcc : 'No. Rekening / VA'}:{' '}
                            <strong className="font-mono text-slate-900">{vaNumber}</strong>
                          </span>
                        </div>
                      )}
                      {item.steps.map((step, idx) => (
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
              );
            })
          )}
        </div>
      </div>

      {/* Auto-update Info Box */}
      <div className="p-3 rounded-xl bg-[#eef7fc] border border-sky-200/80 flex items-start gap-2.5 text-xs">
        <div className="w-5 h-5 rounded-md bg-[#005E7A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11px] text-[#004d65] font-medium leading-snug">
          {t.va.autoUpdateNotice}
        </p>
      </div>

      {/* Action Buttons: Kembali (left) & Cek status pembayaran (right) - Consistent across all channels */}
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
