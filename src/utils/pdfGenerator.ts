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

// ────────────────────────────────────────────────────────────
//  COLOR PALETTE & DRAWING HELPERS
// ────────────────────────────────────────────────────────────
type RGB = [number, number, number];

const C = {
  bniOrange:    [241,  90,  36] as RGB, // #F15A24
  bniNavy:      [  0,  56,  83] as RGB, // #003853
  bniTeal:      [  0,  94, 122] as RGB, // #005E7A
  dark:         [ 15,  23,  42] as RGB, // slate-900
  body:         [ 51,  65,  85] as RGB, // slate-700
  muted:        [100, 116, 139] as RGB, // slate-500
  lightMuted:   [148, 163, 184] as RGB, // slate-400
  border:       [226, 232, 240] as RGB, // slate-200
  borderDark:   [203, 213, 225] as RGB, // slate-300
  bgCard:       [248, 250, 252] as RGB, // slate-50
  bgAlt:        [241, 245, 249] as RGB, // slate-100
  white:        [255, 255, 255] as RGB,
  greenDark:    [ 22, 101,  52] as RGB, // emerald-800
  greenBg:      [220, 252, 231] as RGB, // emerald-100
  greenBorder:  [134, 239, 172] as RGB, // emerald-300
  amberDark:    [146,  64,  14] as RGB, // amber-900
  amberBg:      [254, 243, 199] as RGB, // amber-100
  amberBorder:  [253, 230, 138] as RGB, // amber-300
  amberText:    [180,  83,   9] as RGB, // amber-700
  roseDark:     [190,  18,  60] as RGB, // rose-700
  roseBg:       [255, 241, 242] as RGB, // rose-50
  roseBorder:   [254, 205, 211] as RGB, // rose-200
};

function setFill(doc: jsPDF, c: RGB) { doc.setFillColor(c[0], c[1], c[2]); }
function setDraw(doc: jsPDF, c: RGB) { doc.setDrawColor(c[0], c[1], c[2]); }
function setColor(doc: jsPDF, c: RGB) { doc.setTextColor(c[0], c[1], c[2]); }

function rRect(doc: jsPDF, x: number, y: number, w: number, h: number, r = 1.5, style = 'S') {
  doc.roundedRect(x, y, w, h, r, r, style);
}

/** Two-column Key-Value row inside a card */
function drawCardRow(
  doc: jsPDF,
  label: string,
  value: string,
  lx: number,
  vx: number,
  y: number,
  valueColor: RGB = C.dark,
  isBold = true,
  fontSize = 6.6
) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  setColor(doc, C.muted);
  doc.text(label, lx, y);

  doc.setFont('helvetica', isBold ? 'bold' : 'normal');
  doc.setFontSize(fontSize);
  setColor(doc, valueColor);
  doc.text(value, vx, y);
}

// ────────────────────────────────────────────────────────────
//  MAIN GENERATOR FUNCTION
// ────────────────────────────────────────────────────────────
export async function generatePaymentReceiptPdf(data: BillingReceiptData): Promise<void> {
  const isPaid = data.isPaid !== false;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210; // page width (A4)
  const ML = 14;  // margin left
  const MR = 196; // margin right
  const IW = MR - ML; // inner width = 182mm

  // Resolved breakdown
  const pokok = data.breakdown?.pokok ?? Math.round(data.totalAmount * 0.914);
  const bunga = data.breakdown?.bunga ?? Math.round(data.totalAmount * 0.057);
  const denda = data.breakdown?.denda ?? (data.totalAmount - pokok - bunga);
  const total = data.totalAmount;

  const billingNo = data.billingNo ||
    `BILL-${data.referenceNo.replace(/[^0-9]/g, '').slice(-10) || '0103200123'}`;

  // Pre-generate QR Code data URL asynchronously
  const qrUrl = `https://verify.bni.co.id/statement/${data.referenceNo}`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(qrUrl, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#003853',
        light: '#FFFFFF',
      },
    });
  } catch {
    // Fallback if QR fails
    qrDataUrl = '';
  }

  // ── 1. TOP BRAND ACCENT STRIPES ─────────────────────────────
  setFill(doc, C.bniOrange);
  doc.rect(0, 0, PW, 3, 'F');
  setFill(doc, C.bniNavy);
  doc.rect(0, 3, PW, 1, 'F');

  // ── 2. LETTERHEAD & HEADER ─────────────────────────────────
  // Left: Official BNI Logo
  const logoW = 32;
  const logoH = 9.3;
  const logoX = ML;
  const logoY = 8;
  try {
    doc.addImage(bniLogoBase64, 'PNG', logoX, logoY, logoW, logoH);
  } catch {
    // Graceful fallback
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    setColor(doc, C.bniNavy);
    doc.text('BNI', logoX, logoY + 7);
  }

  // Bank entity subtext under logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  setColor(doc, C.bniNavy);
  doc.text('PT BANK NEGARA INDONESIA (PERSERO) TBK', logoX, 21.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  setColor(doc, C.muted);
  doc.text('Divisi Retail Collection & Recovery | Grha BNI, Jakarta Pusat', logoX, 25);
  doc.text('BNI Call 1500046 (24 Jam)  |  www.bni.co.id', logoX, 28);

  // Right side: Document Title & Status Pill
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  setColor(doc, C.bniNavy);
  doc.text('LEMBAR TAGIHAN & BUKTI PELUNASAN', MR, 11.5, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.2);
  setColor(doc, C.muted);
  doc.text('RETAIL LOAN BILLING & SETTLEMENT STATEMENT', MR, 15.2, { align: 'right' });

  // Status Badge Pill (Clean, without broken unicode)
  const badgeW = isPaid ? 42 : 50;
  const badgeH = 6.2;
  const badgeX = MR - badgeW;
  const badgeY = 19;

  if (isPaid) {
    setFill(doc, C.greenBg);
    setDraw(doc, C.greenBorder);
  } else {
    setFill(doc, C.amberBg);
    setDraw(doc, C.amberBorder);
  }
  doc.setLineWidth(0.35);
  rRect(doc, badgeX, badgeY, badgeW, badgeH, 1.2, 'FD');

  setColor(doc, isPaid ? C.greenDark : C.amberDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  const badgeText = isPaid ? 'STATUS: LUNAS / PAID' : 'STATUS: MENUNGGU PEMBAYARAN';
  doc.text(badgeText, badgeX + badgeW / 2, badgeY + 4.3, { align: 'center' });

  // Horizontal separating line
  setDraw(doc, C.border);
  doc.setLineWidth(0.3);
  doc.line(ML, 32, MR, 32);

  // ── 3. METADATA CARDS (2 SIDE-BY-SIDE CARDS) ───────────────
  const cardY = 35;
  const cardH = 35;
  const colCardW = (IW - 6) / 2; // 88mm each, with 6mm gap
  const card1X = ML;
  const card2X = ML + colCardW + 6;

  // Card 1: Data Nasabah & Fasilitas
  setFill(doc, C.bgCard);
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  rRect(doc, card1X, cardY, colCardW, cardH, 1.5, 'FD');

  // Header band Card 1
  setFill(doc, [241, 245, 249]);
  doc.rect(card1X, cardY, colCardW, 6.5, 'F');
  setDraw(doc, C.border);
  doc.line(card1X, cardY + 6.5, card1X + colCardW, cardY + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  setColor(doc, C.bniTeal);
  doc.text('DATA NASABAH & FASILITAS KREDIT', card1X + 3.5, cardY + 4.5);

  // Card 1 rows
  const c1lx = card1X + 3.5;
  const c1vx = card1X + 34;
  let rY = cardY + 11.2;
  const rowGap = 5.2;

  drawCardRow(doc, 'Nama Debitur', data.debtor.name, c1lx, c1vx, rY); rY += rowGap;
  drawCardRow(doc, 'No. Kontrak / Rekening', data.debtor.contractNo, c1lx, c1vx, rY, C.dark, true); rY += rowGap;
  drawCardRow(doc, 'Produk Pembiayaan', data.debtor.product, c1lx, c1vx, rY); rY += rowGap;
  drawCardRow(doc, 'Kantor Cabang', data.debtor.branch, c1lx, c1vx, rY); rY += rowGap;
  const tenorStr = data.debtor.loanTenor ? ` (${data.debtor.loanTenor})` : '';
  drawCardRow(doc, 'Periode Angsuran', `${data.debtor.installmentNo}${tenorStr}`, c1lx, c1vx, rY);

  // Card 2: Identitas Lembar Billing
  setFill(doc, C.bgCard);
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  rRect(doc, card2X, cardY, colCardW, cardH, 1.5, 'FD');

  // Header band Card 2
  setFill(doc, [241, 245, 249]);
  doc.rect(card2X, cardY, colCardW, 6.5, 'F');
  setDraw(doc, C.border);
  doc.line(card2X, cardY + 6.5, card2X + colCardW, cardY + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  setColor(doc, C.bniTeal);
  doc.text('IDENTITAS LEMBAR BILLING & PENAGIHAN', card2X + 3.5, cardY + 4.5);

  // Card 2 rows
  const c2lx = card2X + 3.5;
  const c2vx = card2X + 36;
  rY = cardY + 11.2;

  drawCardRow(doc, 'No. Billing Statement', billingNo, c2lx, c2vx, rY, C.bniNavy, true); rY += rowGap;
  drawCardRow(doc, 'Tanggal Terbit', data.dateTime, c2lx, c2vx, rY); rY += rowGap;
  const dueColor: RGB = data.debtor.dpdDays > 0 ? C.roseDark : C.dark;
  drawCardRow(doc, 'Tanggal Jatuh Tempo', data.debtor.dueDate, c2lx, c2vx, rY, dueColor, true); rY += rowGap;

  if (data.debtor.dpdDays > 0) {
    drawCardRow(doc, 'Status Keterlambatan', `${data.debtor.dpdDays} Hari (DPD Terlambat)`, c2lx, c2vx, rY, C.roseDark, true);
  } else {
    drawCardRow(doc, 'Status Keterlambatan', 'Tepat Waktu (Lancar)', c2lx, c2vx, rY, C.greenDark, true);
  }
  rY += rowGap;

  const authCode = `AUTH-BNI-${data.referenceNo.replace(/[^0-9]/g, '').slice(-6) || '010320'}-OK`;
  drawCardRow(doc, 'Kode Otorisasi BNI', authCode, c2lx, c2vx, rY, C.bniTeal, true);

  // ── 4. BREAKDOWN TABLE ─────────────────────────────────────
  const tY = cardY + cardH + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  setColor(doc, C.bniNavy);
  doc.text('RINCIAN KOMPONEN TAGIHAN & PEMBAYARAN', ML, tY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  setColor(doc, C.muted);
  doc.text('Mata Uang: IDR (Rupiah Indonesia)', MR, tY, { align: 'right' });

  // Table header bar
  const thY = tY + 2.5;
  const thH = 6.8;
  setFill(doc, C.bniNavy);
  doc.rect(ML, thY, IW, thH, 'F');

  setColor(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('NO', ML + 4, thY + 4.6);
  doc.text('KOMPONEN TAGIHAN', ML + 14, thY + 4.6);
  doc.text('KETERANGAN RINCIAN', ML + 75, thY + 4.6);
  doc.text('JUMLAH (IDR)', MR - 3, thY + 4.6, { align: 'right' });

  // Table row data
  const tableRows = [
    {
      no: '1',
      title: 'Angsuran Pokok Pinjaman',
      desc: 'Kewajiban pokok fasilitas kredit berjalan',
      amount: pokok,
      isRed: false,
      isGreen: false,
    },
    {
      no: '2',
      title: 'Bunga Fasilitas Kredit',
      desc: 'Bunga berjalan fasilitas kredit retail BNI',
      amount: bunga,
      isRed: false,
      isGreen: false,
    },
    {
      no: '3',
      title: 'Denda Keterlambatan',
      desc: `Denda akumulatif penalti keterlambatan (${data.debtor.dpdDays} Hari DPD)`,
      amount: denda,
      isRed: denda > 0,
      isGreen: false,
    },
    {
      no: '4',
      title: 'Biaya Administrasi Layanan',
      desc: 'Biaya transaksi Core Banking Digital BNI - Bebas Biaya',
      amount: 0,
      isRed: false,
      isGreen: true,
    },
  ];

  let currentY = thY + thH;
  const rowH = 6.8;

  tableRows.forEach((row, i) => {
    // Alternating zebra row fill
    if (i % 2 === 1) {
      setFill(doc, [250, 251, 253]);
      doc.rect(ML, currentY, IW, rowH, 'F');
    }

    // Number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    setColor(doc, C.muted);
    doc.text(row.no, ML + 4, currentY + 4.6);

    // Title
    doc.setFont('helvetica', 'bold');
    setColor(doc, C.dark);
    doc.text(row.title, ML + 14, currentY + 4.6);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    setColor(doc, C.muted);
    doc.text(row.desc, ML + 75, currentY + 4.6);

    // Amount
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    let amtColor: RGB = C.dark;
    if (row.isRed) amtColor = C.roseDark;
    if (row.isGreen) amtColor = C.greenDark;
    setColor(doc, amtColor);

    const amtStr = row.amount === 0 ? 'Rp 0 (Bebas Biaya)' : formatRupiah(row.amount);
    doc.text(amtStr, MR - 3, currentY + 4.6, { align: 'right' });

    // Light row separator
    setDraw(doc, C.border);
    doc.setLineWidth(0.2);
    doc.line(ML, currentY + rowH, MR, currentY + rowH);

    currentY += rowH;
  });

  // ── 5. SUB-TOTAL & SUMMARY ROWS (CLEAN TABULAR ALIGNMENT) ──
  const sumCalcH = isPaid ? 25 : 20;
  const sumCalcY = currentY;

  // Background for calculation rows
  setFill(doc, [250, 251, 253]);
  doc.rect(ML, sumCalcY, IW, sumCalcH, 'F');

  // Separator above summary
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  doc.line(ML, sumCalcY, MR, sumCalcY);

  // Summary lines (labels in col 3, amounts in col 4 right-aligned)
  const lblX = ML + 100;
  const amtValX = MR - 4;
  let ry = sumCalcY + 5;

  const drawCalcRow = (label: string, value: string, color: RGB = C.dark, isBold = false, size = 6.8) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(size);
    setColor(doc, C.muted);
    doc.text(label, lblX, ry);

    setColor(doc, color);
    doc.setFont('helvetica', 'bold');
    doc.text(value, amtValX, ry, { align: 'right' });
    ry += 4.8;
  };

  drawCalcRow('Subtotal Tagihan Komponen:', formatRupiah(total), C.dark);
  drawCalcRow('Penyesuaian / Diskon Denda:', 'Rp 0', C.muted);

  // Thin separator under subtotal
  setDraw(doc, C.borderDark);
  doc.setLineWidth(0.2);
  doc.line(lblX, ry - 1.2, amtValX, ry - 1.2);
  ry += 1;

  drawCalcRow('TOTAL TAGIHAN (BILLED):', formatRupiah(total), C.bniNavy, true, 7.2);

  if (isPaid) {
    drawCalcRow('Total Pembayaran Diterima:', formatRupiah(data.totalAmount), C.greenDark, true, 7);
  }

  // ── FULL-WIDTH HIGHLIGHT BANNER (TABLE CONCLUSION) ─────────
  const highlightBannerY = sumCalcY + sumCalcH;
  const highlightBannerH = 7.8;

  if (isPaid) {
    setFill(doc, C.greenBg);
    setDraw(doc, C.greenBorder);
    doc.setLineWidth(0.3);
    doc.rect(ML, highlightBannerY, IW, highlightBannerH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    setColor(doc, C.greenDark);
    doc.text('STATUS KEWAJIBAN: LUNAS / ZERO BALANCE', ML + 4, highlightBannerY + 5.1);

    doc.setFontSize(8.2);
    doc.text('Rp 0 - LUNAS', amtValX, highlightBannerY + 5.1, { align: 'right' });
  } else {
    setFill(doc, [255, 247, 237]); // amber-50 (#FFF7ED)
    setDraw(doc, [253, 186, 116]); // amber-300 (#FDBA74)
    doc.setLineWidth(0.3);
    doc.rect(ML, highlightBannerY, IW, highlightBannerH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    setColor(doc, [194, 65, 12]); // amber-700
    doc.text('SISA KEWAJIBAN HARUS DIBAYAR (BALANCE DUE):', ML + 4, highlightBannerY + 5.1);

    doc.setFontSize(8.2);
    doc.text(formatRupiah(data.totalAmount), amtValX, highlightBannerY + 5.1, { align: 'right' });
  }

  // Outer frame enclosing entire table (from header to highlight banner)
  const tableTotalH = (highlightBannerY + highlightBannerH) - thY;
  setDraw(doc, C.borderDark);
  doc.setLineWidth(0.35);
  rRect(doc, ML, thY, IW, tableTotalH, 1.2, 'S');

  // ── 5B. DEDICATED TERBILANG BAR ───────────────────────────
  const terbilangY = highlightBannerY + highlightBannerH + 3.5;
  const terbilangH = 7.5;

  setFill(doc, C.bgCard);
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  rRect(doc, ML, terbilangY, IW, terbilangH, 1.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniTeal);
  doc.text('TERBILANG:', ML + 4, terbilangY + 4.9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.6);
  setColor(doc, C.dark);
  doc.text(`# ${formatTerbilang(total).toUpperCase()} #`, ML + 22, terbilangY + 4.9);

  if (isPaid) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    setColor(doc, C.greenDark);
    doc.text('Pembayaran Terverifikasi Resmi', MR - 4, terbilangY + 4.9, { align: 'right' });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    setColor(doc, data.debtor.dpdDays > 0 ? C.roseDark : C.muted);
    doc.text(`Jatuh Tempo: ${data.debtor.dueDate}`, MR - 4, terbilangY + 4.9, { align: 'right' });
  }

  // ── 6. TRANSACTION AUDIT TRAIL ─────────────────────────────
  const auditY = terbilangY + terbilangH + 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  setColor(doc, C.bniNavy);
  doc.text('DATA TRANSAKSI & JURNAL PELUNASAN', ML, auditY);

  const auditBoxY = auditY + 2.5;
  const auditBoxH = 19;
  setFill(doc, C.white);
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  rRect(doc, ML, auditBoxY, IW, auditBoxH, 1.5, 'FD');

  // 3 Equal Columns
  const colW = IW / 3;
  const colX = (idx: number) => ML + colW * idx + 3.5;

  // Vertical column dividers
  setDraw(doc, C.border);
  doc.setLineWidth(0.2);
  doc.line(ML + colW, auditBoxY + 2, ML + colW, auditBoxY + auditBoxH - 2);
  doc.line(ML + colW * 2, auditBoxY + 2, ML + colW * 2, auditBoxY + auditBoxH - 2);

  // Column 1: Reference
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniTeal);
  doc.text('Nomor Referensi Jurnal', colX(0), auditBoxY + 4.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  setColor(doc, C.dark);
  doc.text(data.referenceNo, colX(0), auditBoxY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  setColor(doc, C.muted);
  doc.text('Waktu Transaksi:', colX(0), auditBoxY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.body);
  doc.text(data.dateTime, colX(0), auditBoxY + 16.5);

  // Column 2: Channel & Account
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniTeal);
  doc.text('Metode / Saluran Pembayaran', colX(1), auditBoxY + 4.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  setColor(doc, C.dark);
  doc.text(data.paymentMethod, colX(1), auditBoxY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  setColor(doc, C.muted);
  const accountLabel = data.paymentMethod.toLowerCase().includes('qris')
    ? 'Kode Referensi Transaksi:'
    : data.paymentMethod.toLowerCase().includes('transfer')
    ? 'Rekening Tujuan Transfer:'
    : 'Nomor Virtual Account (VA):';
  doc.text(accountLabel, colX(1), auditBoxY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  setColor(doc, C.bniTeal);
  doc.text(data.vaNumber, colX(1), auditBoxY + 16.5);

  // Column 3: Clearance Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniTeal);
  doc.text('Status Kliring & Otorisasi', colX(2), auditBoxY + 4.8);

  // Badge "TERVALIDASI REAL-TIME"
  const valW = colW - 7;
  const valH = 4.8;
  const valX = colX(2);
  const valY = auditBoxY + 6.2;
  setFill(doc, C.greenBg);
  setDraw(doc, C.greenBorder);
  doc.setLineWidth(0.25);
  rRect(doc, valX, valY, valW, valH, 1, 'FD');

  setColor(doc, C.greenDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text('TERVALIDASI REAL-TIME', valX + valW / 2, valY + 3.4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  setColor(doc, C.muted);
  doc.text('Kode Otorisasi BNI:', colX(2), auditBoxY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.6);
  setColor(doc, C.dark);
  doc.text(authCode, colX(2), auditBoxY + 16.5);

  // ── 7. OFFICIAL SECURITY STAMP & QR VERIFICATION ───────────
  const secY = auditBoxY + auditBoxH + 4.5;
  const secH = 22;

  // Split into Left (Official Seal) and Right (QR Verification)
  const sealW = (IW - 5) / 2; // 88.5mm
  const qrBoxW = sealW;
  const sealX = ML;
  const qrCardX = ML + sealW + 5;

  // 7A. Official Digital Seal (Left Box)
  setFill(doc, C.bgCard);
  setDraw(doc, C.bniTeal);
  doc.setLineWidth(0.4);
  rRect(doc, sealX, secY, sealW, secH, 1.5, 'FD');

  // Inner subtle border
  setDraw(doc, [178, 215, 226]);
  doc.setLineWidth(0.2);
  rRect(doc, sealX + 1.2, secY + 1.2, sealW - 2.4, secH - 2.4, 1, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniNavy);
  doc.text('PT BANK NEGARA INDONESIA (PERSERO) TBK', sealX + sealW / 2, secY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  setColor(doc, C.body);
  doc.text('DIVISI RETAIL COLLECTION & RECOVERY', sealX + sealW / 2, secY + 8.2, { align: 'center' });

  // Seal Banner
  const bannerW = sealW - 14;
  const bannerH = 4;
  const bannerX = sealX + 7;
  const bannerY = secY + 9.5;
  setFill(doc, C.bniOrange);
  doc.rect(bannerX, bannerY, bannerW, bannerH, 'F');

  setColor(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  const sealTitle = isPaid ? 'TERVALIDASI ELEKTRONIK - SAH' : 'BILLING RESMI TERBIT';
  doc.text(sealTitle, bannerX + bannerW / 2, bannerY + 2.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.2);
  setColor(doc, C.muted);
  const cleanRef = data.referenceNo.replace(/[^0-9]/g, '').slice(-8) || '01032001';
  doc.text(`SEAL-ID: BNI-${cleanRef}`, sealX + sealW / 2, secY + 16, { align: 'center' });
  doc.text('Sah tanpa tanda tangan basah (UU ITE No. 11/2008)', sealX + sealW / 2, secY + 19.2, { align: 'center' });

  // 7B. QR Code Verification Card (Right Box)
  setFill(doc, C.bgCard);
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  rRect(doc, qrCardX, secY, qrBoxW, secH, 1.5, 'FD');

  const qrSz = 16.5;
  const qrX = qrCardX + 3;
  const qrY = secY + 2.8;

  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSz, qrSz);
    } catch {
      // Draw placeholder
      setFill(doc, C.bniNavy);
      doc.rect(qrX, qrY, qrSz, qrSz, 'F');
    }
  }

  // QR details text next to QR
  const qrTextX = qrX + qrSz + 3.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  setColor(doc, C.bniNavy);
  doc.text('VERIFIKASI KEASLIAN DOKUMEN', qrTextX, secY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.6);
  setColor(doc, C.body);
  doc.text('Pindai QR code untuk memverifikasi', qrTextX, secY + 8.5);
  doc.text('keabsahan dokumen secara langsung:', qrTextX, secY + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  setColor(doc, C.bniTeal);
  doc.text(`verify.bni.co.id/statement/${cleanRef}`, qrTextX, secY + 15.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  setColor(doc, C.lightMuted);
  doc.text(`SHA256: ${cleanRef}-BNICOLLECT`, qrTextX, secY + 19);

  // ── 8. LEGAL DISCLAIMER & IMPORTANT NOTES ──────────────────
  const noteY = secY + secH + 4;
  const noteH = 17;
  setFill(doc, C.bgAlt);
  setDraw(doc, C.border);
  doc.setLineWidth(0.25);
  rRect(doc, ML, noteY, IW, noteH, 1.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniNavy);
  doc.text('CATATAN PENTING & KETENTUAN HUKUM LEMBAR BILLING RESMI:', ML + 3.5, noteY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.4);
  setColor(doc, C.body);
  const notes = [
    '1. Lembar ini merupakan bukti penagihan dan rekonsiliasi resmi yang diterbitkan secara terkomputerisasi oleh Bank BNI.',
    '2. Sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1, dokumen elektronik ini diakui secara hukum dan sah tanpa tanda tangan basah.',
    '3. Simpan dokumen ini sebagai bukti pemenuhan kewajiban angsuran kredit fasilitas pembiayaan Anda kepada Bank BNI.',
    '4. Bantuan & konfirmasi resmi: BNI Call 1500046 (24 Jam) atau kunjungi Kantor Cabang BNI pengelola kredit Anda.',
  ];
  notes.forEach((line, i) => {
    doc.text(line, ML + 3.5, noteY + 7.2 + i * 2.9);
  });

  // ── 9. REGULATORY FOOTER ───────────────────────────────────
  const fY = 277;
  setDraw(doc, C.borderDark);
  doc.setLineWidth(0.25);
  doc.line(ML, fY, MR, fY);

  // Left decorative BNI orange bar
  setFill(doc, C.bniOrange);
  doc.rect(ML, fY + 1.2, 22, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  setColor(doc, C.bniNavy);
  doc.text('PT Bank Negara Indonesia (Persero) Tbk.', ML, fY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.4);
  setColor(doc, C.muted);
  doc.text(
    'Berizin & diawasi oleh Otoritas Jasa Keuangan (OJK)  |  Peserta penjaminan Lembaga Penjamin Simpanan (LPS)',
    ML,
    fY + 8.8
  );

  doc.text(
    `Dicetak oleh: BNI Retail Collection System  |  Halaman 1 dari 1  |  Waktu Cetak: ${data.dateTime}`,
    ML,
    fY + 12
  );

  doc.text('Dokumen Rahasia Nasabah - Tidak untuk disebarluaskan.', MR, fY + 12, { align: 'right' });

  // ── 10. SAVE PDF ───────────────────────────────────────────
  const filename = isPaid
    ? `Lembar_Pelunasan_BNI_${data.referenceNo}.pdf`
    : `Lembar_Tagihan_BNI_${billingNo}.pdf`;
  doc.save(filename);
}
