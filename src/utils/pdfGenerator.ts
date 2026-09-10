import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { DebtorInfo, BillBreakdown } from '../types';
import { formatRupiah, formatTerbilang } from './formatters';
import { bniLogoBase64 } from './bniLogoBase64';

export interface BillingReceiptData {
  referenceNo: string;
  dateTime: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  debtor: DebtorInfo;
  vaNumber: string;
  breakdown?: BillBreakdown;
  billingNo?: string;
  isPaid?: boolean;
}

type RGB = [number, number, number];

const K = {
  navy:   [0,   56,  83] as RGB,
  orange: [241, 90,  36] as RGB,
  teal:   [0,   94, 122] as RGB,
  black:  [33,  37,  41] as RGB,
  dark:   [75,  85,  99] as RGB,
  mid:    [107, 114, 128] as RGB,
  light:  [156, 163, 175] as RGB,
  line:   [209, 213, 219] as RGB,
  faint:  [229, 231, 235] as RGB,
  white:  [255, 255, 255] as RGB,
  green:  [5,   150, 105] as RGB,
  red:    [220, 38,   38] as RGB,
  amber:  [217, 119,   6] as RGB,
};

const setF = (d: jsPDF, c: RGB) => d.setFillColor(c[0], c[1], c[2]);
const setD = (d: jsPDF, c: RGB) => d.setDrawColor(c[0], c[1], c[2]);
const setC = (d: jsPDF, c: RGB) => d.setTextColor(c[0], c[1], c[2]);

/** Dashed line — ticket perforation style */
function dash(d: jsPDF, x1: number, x2: number, y: number, c: RGB = K.line, segLen = 1.4, gapLen = 1.2) {
  setD(d, c);
  d.setLineWidth(0.2);
  let x = x1;
  while (x < x2) {
    const end = Math.min(x + segLen, x2);
    d.line(x, y, end, y);
    x = end + gapLen;
  }
}

function fmtDate(dt: string): string {
  const m = dt.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) return '10/09/2026';
  const mo: Record<string, string> = {
    januari:'01',january:'01',februari:'02',february:'02',maret:'03',march:'03',
    april:'04',mei:'05',may:'05',juni:'06',june:'06',juli:'07',july:'07',
    agustus:'08',august:'08',september:'09',oktober:'10',october:'10',
    november:'11',desember:'12',december:'12',
  };
  return `${m[1].padStart(2,'0')}/${mo[m[2].toLowerCase()] || '09'}/${m[3]}`;
}

const fmtRp = (amount: number) => formatRupiah(amount).replace(/\s+/g, ' ');

// ────────────────────────────────────────────────────────────
export async function generatePaymentReceiptPdf(data: BillingReceiptData): Promise<void> {
  const isPaid = data.isPaid !== false;

  const pokok = data.breakdown?.pokok ?? Math.round(data.totalAmount * 0.914);
  const bunga = data.breakdown?.bunga ?? Math.round(data.totalAmount * 0.057);
  const denda = data.breakdown?.denda ?? 0;
  const total = data.breakdown?.total ?? (pokok + bunga + denda);
  const paid = data.totalAmount;
  const balance = Math.max(0, total - paid);
  const fullyPaid = isPaid && balance === 0;

  const billNo = data.billingNo || `BILL-${data.referenceNo.replace(/[^0-9]/g, '').slice(-10) || '2026091001'}`;
  const ref = data.referenceNo.replace(/[^0-9]/g, '').slice(-8) || '01032001';
  const dateLong = data.dateTime.split('|')[0]?.trim() || '10 September 2026';
  const dateShort = fmtDate(data.dateTime);
  const timeStr = data.dateTime.split('|')[1]?.trim() || '11:17 WIB';

  const cleanInst = data.debtor.installmentNo.replace(/^ke-?/i, '');
  const tenorPart = (data.debtor.loanTenor && !cleanInst.includes(data.debtor.loanTenor))
    ? ` (${data.debtor.loanTenor})` : '';

  let qr = '';
  try {
    qr = await QRCode.toDataURL(`https://verify.bni.co.id/billing/${data.referenceNo}`, {
      margin: 1, width: 220, errorCorrectionLevel: 'M',
      color: { dark: '#111827', light: '#ffffff' },
    });
  } catch { /* */ }

  // ═══════════════════════════════════════════════════════════
  // EXACT TICKET GEOMETRY & TRIMMED CANVAS SIZING
  // ═══════════════════════════════════════════════════════════
  const MARGIN_X = 7;
  const MARGIN_Y = 7;
  const TW = 136; // Ticket card width in mm
  const TX = MARGIN_X;
  const TR = TX + TW;
  const CX = TX + TW / 2;
  const cardTop = MARGIN_Y;

  // Custom canvas height trimmed directly to content height
  const pageH = isPaid ? 221 : 217;
  const cardH = pageH - MARGIN_Y * 2;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [TW + MARGIN_X * 2, pageH],
  });

  // 1. TICKET CARD OUTER BORDER
  setD(doc, K.line);
  doc.setLineWidth(0.35);
  doc.roundedRect(TX, cardTop, TW, cardH, 2.5, 2.5, 'S');

  // 2. TOP BRAND ACCENT (Orange Bar with matching top radius)
  setF(doc, K.orange);
  doc.roundedRect(TX, cardTop, TW, 3.2, 2.5, 2.5, 'F');
  doc.rect(TX, cardTop + 1.5, TW, 1.7, 'F');

  // 3. HEADER: BNI Logo & Title
  let y = cardTop + 8;
  const logoW = 26;
  const logoH = 7.6;
  try {
    doc.addImage(bniLogoBase64, 'PNG', CX - logoW / 2, y, logoW, logoH);
  } catch { /* */ }

  y += logoH + 5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); setC(doc, K.navy);
  doc.text('PT BANK NEGARA INDONESIA (PERSERO) TBK', CX, y, { align: 'center' });

  y += 4.5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setC(doc, K.navy);
  doc.text('BILLING STATEMENT', CX, y, { align: 'center' });

  y += 4.0;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setC(doc, K.mid);
  doc.text(isPaid ? 'Lembar Tagihan & Bukti Pelunasan' : 'Lembar Tagihan Rekening Pinjaman', CX, y, { align: 'center' });

  // 4. SEPARATOR
  y += 5.0;
  dash(doc, TX + 4, TR - 4, y, K.line);

  // 5. TOTAL AMOUNT & STATUS BADGE
  y += 5.2;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setC(doc, K.mid);
  doc.text(isPaid ? 'TOTAL PEMBAYARAN' : 'TOTAL TAGIHAN', CX, y, { align: 'center' });

  y += 6.5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(17); setC(doc, K.navy);
  doc.text(fmtRp(isPaid ? paid : total), CX, y, { align: 'center' });

  y += 5.0;
  const statusTxt = fullyPaid ? 'LUNAS' : (isPaid && balance > 0) ? 'SEBAGIAN DIBAYAR' : 'BELUM DIBAYAR';
  const statusClr: RGB = fullyPaid ? K.green : (isPaid && balance > 0) ? K.amber : K.red;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.8); setC(doc, statusClr);
  const sw = doc.getTextWidth(statusTxt);
  const pillW = sw + 7;
  const pillH = 4.8;
  setF(doc, K.white); setD(doc, statusClr);
  doc.setLineWidth(0.3);
  doc.roundedRect(CX - pillW / 2, y - 3.4, pillW, pillH, 1.2, 1.2, 'FD');
  doc.text(statusTxt, CX, y, { align: 'center' });

  // 6. SEPARATOR
  y += 5.5;
  dash(doc, TX + 4, TR - 4, y, K.line);

  // 7. CUSTOMER & BILLING INFO ROWS
  const infoL = TX + 8;
  const infoR = TR - 8;

  const row = (label: string, value: string, yy: number, vc: RGB = K.black, bold = true) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setC(doc, K.mid);
    doc.text(label, infoL, yy);
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(6.8); setC(doc, vc);
    doc.text(value, infoR, yy, { align: 'right' });
  };

  y += 4.8;
  const rGap = 4.2;
  row('Nama Debitur', data.debtor.name, y); y += rGap;
  row('No. Rekening', data.debtor.contractNo, y); y += rGap;
  row('Jenis Fasilitas', data.debtor.product, y, K.dark, false); y += rGap;
  row('Periode Angsuran', `Ke-${cleanInst}${tenorPart}`, y, K.dark, false); y += rGap;
  row('Jatuh Tempo', data.debtor.dueDate, y, data.debtor.dpdDays > 0 ? K.red : K.black); y += rGap;
  row('No. Billing', billNo, y, K.navy); y += rGap;
  row('No. Referensi', data.referenceNo, y); y += rGap;
  row('Metode Bayar', data.paymentMethod, y, K.dark, false); y += rGap;
  row('Rekening VA', data.vaNumber, y, K.teal);

  // 8. SEPARATOR
  y += 5.2;
  dash(doc, TX + 4, TR - 4, y, K.line);

  // 9. RINCIAN TAGIHAN TABLE
  y += 4.8;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); setC(doc, K.navy);
  doc.text('RINCIAN TAGIHAN', infoL, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); setC(doc, K.light);
  doc.text(dateShort, infoR, y, { align: 'right' });

  y += 4.0;
  const items = [
    { t: 'Angsuran Pokok Pinjaman', a: fmtRp(pokok), c: K.black },
    { t: 'Bunga Fasilitas Kredit',   a: fmtRp(bunga), c: K.black },
    { t: 'Denda Keterlambatan',     a: denda > 0 ? fmtRp(denda) : 'Rp 0', c: denda > 0 ? K.red : K.black },
    { t: 'Biaya Administrasi',      a: 'Rp 0 (Bebas Biaya)', c: K.green },
  ];

  items.forEach(item => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.6); setC(doc, K.dark);
    doc.text(item.t, infoL, y);
    doc.setFont('helvetica', 'bold'); setC(doc, item.c);
    doc.text(item.a, infoR, y, { align: 'right' });
    y += 3.9;
  });

  // Thin line
  y += 0.5;
  setD(doc, K.faint); doc.setLineWidth(0.2);
  doc.line(infoL, y, infoR, y);

  // Subtotal
  y += 3.8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setC(doc, K.mid);
  doc.text('Subtotal Tagihan', infoL, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.8); setC(doc, K.black);
  doc.text(fmtRp(total), infoR, y, { align: 'right' });

  if (isPaid) {
    y += 3.8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setC(doc, K.mid);
    doc.text('Pembayaran Diterima', infoL, y);
    doc.setFont('helvetica', 'bold'); setC(doc, K.green);
    doc.text(`(${fmtRp(paid)})`, infoR, y, { align: 'right' });
  }

  // Bold line
  y += 2.4;
  setD(doc, K.navy); doc.setLineWidth(0.35);
  doc.line(infoL, y, infoR, y);

  // Total / Balance Due
  y += 4.4;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7.8); setC(doc, K.navy);
  doc.text(isPaid ? 'SISA SALDO TAGIHAN' : 'TOTAL TAGIHAN', infoL, y);

  if (fullyPaid) {
    setC(doc, K.green);
    doc.text('LUNAS (Rp 0)', infoR, y, { align: 'right' });
  } else if (isPaid && balance > 0) {
    setC(doc, K.amber);
    doc.text(fmtRp(balance), infoR, y, { align: 'right' });
  } else {
    setC(doc, K.navy);
    doc.text(fmtRp(total), infoR, y, { align: 'right' });
  }

  // Terbilang
  y += 4.6;
  doc.setFont('helvetica', 'italic'); doc.setFontSize(5.4); setC(doc, K.light);
  doc.text(`# ${formatTerbilang(isPaid ? paid : total).toUpperCase()} #`, CX, y, { align: 'center' });

  // 10. PERFORATION WITH CLEAN SIDE NOTCH INDENTS
  y += 5.4;
  const notchY = y;
  const notchR = 3.2;

  // Punch white semicircles into card edges
  setF(doc, K.white);
  doc.circle(TX, notchY, notchR, 'F');
  doc.circle(TR, notchY, notchR, 'F');

  // Draw inner arc border for the notches
  setD(doc, K.line);
  doc.setLineWidth(0.35);
  // Left notch inner arc
  doc.lines([
    [notchR * 0.552, 0, notchR, notchR * (1 - 0.448), notchR, notchR],
    [0, notchR * 0.448, -notchR * (1 - 0.552), notchR, -notchR, notchR],
  ], TX, notchY - notchR);

  // Right notch inner arc
  doc.lines([
    [-notchR * 0.552, 0, -notchR, notchR * (1 - 0.448), -notchR, notchR],
    [0, notchR * 0.448, notchR * (1 - 0.552), notchR, notchR, notchR],
  ], TR, notchY - notchR);

  // Dashed tear line across the ticket
  dash(doc, TX + notchR + 1.2, TR - notchR - 1.2, notchY, K.line, 1.2, 1.4);

  // 11. TICKET STUB: QR & VERIFICATION
  y += 5.4;
  const qrSize = 21;
  if (qr) {
    try {
      doc.addImage(qr, 'PNG', CX - qrSize / 2, y, qrSize, qrSize);
    } catch { /* */ }
  }

  y += qrSize + 3.8;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(6.2); setC(doc, K.navy);
  doc.text('VERIFIKASI KEASLIAN DOKUMEN', CX, y, { align: 'center' });

  y += 3.4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(5.5); setC(doc, K.mid);
  doc.text(`Kode Otorisasi: AUTH-BNI-${ref}`, CX, y, { align: 'center' });

  y += 3.2;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(5.2); setC(doc, K.teal);
  doc.text(`verify.bni.co.id/billing/${ref}`, CX, y, { align: 'center' });

  y += 3.4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(4.8); setC(doc, K.light);
  doc.text('Dokumen elektronik sah tanpa tanda tangan basah', CX, y, { align: 'center' });

  y += 2.8;
  doc.text('sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1', CX, y, { align: 'center' });

  // 12. FOOTER
  y += 4.5;
  dash(doc, TX + 4, TR - 4, y, K.faint, 1, 2);

  y += 3.8;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(5.2); setC(doc, K.navy);
  doc.text('PT Bank Negara Indonesia (Persero) Tbk.', CX, y, { align: 'center' });

  y += 3.0;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(4.8); setC(doc, K.light);
  doc.text('Berizin & diawasi OJK  |  Peserta LPS  |  BNI Call 1500046', CX, y, { align: 'center' });

  y += 3.0;
  doc.text(`${dateLong}  |  ${timeStr}  |  Dokumen Resmi RCS`, CX, y, { align: 'center' });

  // SAVE
  doc.save(isPaid
    ? `Billing_Pelunasan_BNI_${billNo}.pdf`
    : `Billing_Tagihan_BNI_${billNo}.pdf`
  );
}
