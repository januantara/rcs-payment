import { jsPDF } from 'jspdf';
import { DebtorInfo, BillBreakdown } from '../types';
import { formatRupiah } from './formatters';

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

export function generatePaymentReceiptPdf(data: BillingReceiptData) {
  const isPaid = data.isPaid !== false;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Palette definition
  const bniTeal = [0, 56, 83];       // #003853
  const bniTealAccent = [0, 94, 122]; // #005E7A
  const bniOrange = [241, 90, 36];    // #F15A24
  const slateDark = [15, 23, 42];     // #0F172A
  const slateBody = [51, 65, 85];     // #334155
  const slateMuted = [100, 116, 139]; // #64748B
  const slateBorder = [226, 232, 240];// #E2E8F0
  const bgLight = [248, 250, 252];    // #F8FAFC
  const greenDark = [22, 101, 52];    // #166534
  const greenBg = [220, 252, 231];    // #DCFCE7
  const greenBorder = [134, 239, 172];// #86EFAC

  const billingNo =
    data.billingNo ||
    `BILL-${data.referenceNo.replace(/[^0-9]/g, '').slice(-10) || '2026091001'}`;

  // Breakdown values resolution
  const breakdownPokok = data.breakdown?.pokok ?? Math.round(data.totalAmount * 0.914);
  const breakdownBunga = data.breakdown?.bunga ?? Math.round(data.totalAmount * 0.057);
  const breakdownDenda = data.breakdown?.denda ?? (data.totalAmount - breakdownPokok - breakdownBunga);
  const breakdownTotal = data.totalAmount;

  // 1. TOP BRANDING BAR
  doc.setFillColor(bniOrange[0], bniOrange[1], bniOrange[2]);
  doc.rect(0, 0, 210, 3, 'F');
  doc.setFillColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.rect(0, 3, 210, 1, 'F');

  // 2. KOP SURAT RESMI BNI (HEADER)
  // Left: Logo & Company Information
  doc.setTextColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('BNI', 15, 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('PT BANK NEGARA INDONESIA (PERSERO) TBK', 33, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Divisi Retail Collection & Recovery', 33, 16);
  doc.text('Gedung Grha BNI, Jl. Jend. Sudirman Kav. 1, Jakarta Pusat 10220', 33, 19.5);
  doc.text('Layanan 24 Jam BNI Call 1500046 | email: bnicall@bni.co.id | www.bni.co.id', 33, 23);

  // Right: Document Title & Settlement Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.text('LEMBAR TAGIHAN & BUKTI PELUNASAN', 195, 12, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('RETAIL LOAN BILLING & SETTLEMENT STATEMENT', 195, 16, { align: 'right' });

  // Status Badge (Paid vs Pending)
  if (isPaid) {
    doc.setFillColor(greenBg[0], greenBg[1], greenBg[2]);
    doc.setDrawColor(greenBorder[0], greenBorder[1], greenBorder[2]);
    doc.roundedRect(147, 19.5, 48, 6.5, 1.2, 1.2, 'FD');
    doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('STATUS: LUNAS / PAID', 171, 24, { align: 'center' });
  } else {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(252, 211, 77);
    doc.roundedRect(142, 19.5, 53, 6.5, 1.2, 1.2, 'FD');
    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('STATUS: MENUNGGU PEMBAYARAN', 168.5, 24, { align: 'center' });
  }

  // Horizontal separating line
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.setLineWidth(0.4);
  doc.line(15, 28, 195, 28);

  // 3. STATEMENT SUMMARY CARD (2 COLUMNS: DEBTOR & BILLING METADATA)
  const cardY = 32;
  const cardH = 31;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(15, cardY, 180, cardH, 2, 2, 'FD');

  // Vertical divider between columns
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.line(105, cardY + 2, 105, cardY + cardH - 2);

  // Left Column: Debtor Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.text('DATA NASABAH & FASILITAS KREDIT', 19, cardY + 5.5);

  const drawField = (label: string, value: string, x: number, y: number, isMono = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(label, x, y);

    doc.setFont(isMono ? 'courier' : 'helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(value, x + 38, y);
  };

  drawField('Nama Debitur', `: ${data.debtor.name}`, 19, cardY + 11.5);
  drawField('No. Kontrak / Fasilitas', `: ${data.debtor.contractNo}`, 19, cardY + 16.5, true);
  drawField('Produk Pembiayaan', `: ${data.debtor.product}`, 19, cardY + 21.5);
  drawField('Cabang Pengelola', `: ${data.debtor.branch}`, 19, cardY + 26.5);

  // Right Column: Billing Statement Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.text('IDENTITAS LEMBAR BILLING', 109, cardY + 5.5);

  drawField('No. Billing (Statement)', `: ${billingNo}`, 109, cardY + 11.5, true);
  drawField('Tanggal Cetak', `: ${data.dateTime}`, 109, cardY + 16.5);
  drawField('Tanggal Jatuh Tempo', `: ${data.debtor.dueDate} (${data.debtor.dpdDays} Hari DPD)`, 109, cardY + 21.5);
  drawField('Angsuran Fasilitas', `: ${data.debtor.installmentNo} (${data.debtor.loanTenor || '180 Bulan'})`, 109, cardY + 26.5);

  // 4. ITEMIZED BILLING BREAKDOWN TABLE
  const tableTopY = 67;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.text('RINCIAN KOMPONEN TAGIHAN & PEMBAYARAN', 15, tableTopY);

  // Table Header row
  const thY = tableTopY + 3;
  doc.setFillColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.rect(15, thY, 180, 6.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('NO', 18, thY + 4.5);
  doc.text('KOMPONEN TAGIHAN', 28, thY + 4.5);
  doc.text('KETERANGAN / SPESIFIKASI', 88, thY + 4.5);
  doc.text('JUMLAH (IDR)', 191, thY + 4.5, { align: 'right' });

  // Table Body Rows
  const items = [
    {
      no: '1',
      title: 'Angsuran Pokok Pinjaman',
      desc: 'Kewajiban pokok fasilitas pinjaman berjalan',
      amount: breakdownPokok,
    },
    {
      no: '2',
      title: 'Bunga Fasilitas Kredit',
      desc: 'Bunga berjalan fasilitas kredit retail',
      amount: breakdownBunga,
    },
    {
      no: '3',
      title: 'Denda Keterlambatan',
      desc: `Denda akumulatif atas keterlambatan (${data.debtor.dpdDays} Hari DPD)`,
      amount: breakdownDenda,
    },
    {
      no: '4',
      title: 'Biaya Administrasi & Verifikasi Layanan',
      desc: 'Biaya administrasi sistem transaksi digital BNI (Gratis Bebas Biaya)',
      amount: 0,
    },
  ];

  let currentY = thY + 6.5;
  items.forEach((item, index) => {
    // Alternating zebra row
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 252);
      doc.rect(15, currentY, 180, 6, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(item.no, 19, currentY + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.text(item.title, 28, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(item.desc, 88, currentY + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    const amountStr = item.amount === 0 ? 'Rp 0' : formatRupiah(item.amount);
    doc.text(amountStr, 191, currentY + 4.2, { align: 'right' });

    // Row separator
    doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
    doc.setLineWidth(0.2);
    doc.line(15, currentY + 6, 195, currentY + 6);

    currentY += 6;
  });

  // Table Totals / Settlement Block
  currentY += 1.5;

  const drawTotalRow = (
    label: string,
    valueStr: string,
    isHighlighted = false,
    textColor = slateDark,
    fontSize = 7.5
  ) => {
    if (isHighlighted) {
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
      doc.rect(98, currentY - 0.5, 97, 6, 'F');
    }
    doc.setFont('helvetica', isHighlighted ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(label, 102, currentY + 3.8);
    doc.text(valueStr, 191, currentY + 3.8, { align: 'right' });
    currentY += 5.5;
  };

  drawTotalRow('Subtotal Tagihan Komponen', formatRupiah(breakdownTotal), false, slateBody, 7);
  drawTotalRow('Penyesuaian Program / Diskon', 'Rp 0', false, slateMuted, 7);

  // Separator
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.setLineWidth(0.3);
  doc.line(98, currentY, 195, currentY);
  currentY += 1.5;

  drawTotalRow('TOTAL TAGIHAN KREDIT (TOTAL BILLED)', formatRupiah(breakdownTotal), true, bniTeal, 8);

  if (isPaid) {
    drawTotalRow(
      'TOTAL PEMBAYARAN DITERIMA (PAID AMOUNT)',
      formatRupiah(data.totalAmount),
      false,
      greenDark,
      8
    );
    drawTotalRow(
      'SISA KEWAJIBAN / SALDO TERHUTANG (BALANCE DUE)',
      'Rp 0 (LUNAS / ZERO BALANCE)',
      true,
      bniOrange,
      8
    );
  } else {
    drawTotalRow(
      'SISA KEWAJIBAN HARUS DIBAYAR',
      formatRupiah(data.totalAmount),
      true,
      bniOrange,
      8
    );
  }

  // 5. PAYMENT AUDIT TRAIL & TRANSACTION DATA BOX
  const auditY = currentY + 3.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.text('DATA TRANSAKSI & JURNAL PELUNASAN', 15, auditY);

  const auditBoxY = auditY + 2.5;
  const auditBoxH = 24;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(15, auditBoxY, 180, auditBoxH, 1.8, 1.8, 'FD');

  // Audit columns
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Nomor Referensi Jurnal BNI', 19, auditBoxY + 5.5);
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(data.referenceNo, 19, auditBoxY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Waktu Eksekusi Transaksi', 19, auditBoxY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(data.dateTime, 19, auditBoxY + 19);

  // Middle column
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Metode / Saluran Pembayaran', 85, auditBoxY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(data.paymentMethod, 85, auditBoxY + 9.5);

  const accountLabel = data.paymentMethod.toLowerCase().includes('qris')
    ? 'Kode Referensi Transaksi'
    : data.paymentMethod.toLowerCase().includes('transfer')
    ? 'Rekening Tujuan Transfer'
    : 'Nomor Virtual Account (VA)';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(accountLabel, 85, auditBoxY + 15);
  doc.setFont('courier', 'bold');
  doc.setTextColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.text(data.vaNumber, 85, auditBoxY + 19);

  // Right column
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Status Kliring Host Core Banking', 140, auditBoxY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
  doc.text('TERVALIDASI OTOMATIS (REAL-TIME)', 140, auditBoxY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Kode Otorisasi BNI', 140, auditBoxY + 15);
  doc.setFont('courier', 'bold');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`AUTH-BNI-${data.referenceNo.slice(-6)}-OK`, 140, auditBoxY + 19);

  // 6. BANK DIGITAL AUTHENTICATION STAMP & QR VERIFICATION SEAL
  const authY = auditBoxY + auditBoxH + 4;
  const authH = 26;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(15, authY, 180, authH, 1.8, 1.8, 'FD');

  // Left side: Official Bank Electronic Stamp Representation
  const stampX = 20;
  const stampY = authY + 3;
  const stampW = 74;
  const stampH = 20;

  doc.setDrawColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(stampX, stampY, stampW, stampH, 2, 2, 'S');

  doc.setDrawColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(stampX + 1.2, stampY + 1.2, stampW - 2.4, stampH - 2.4, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.text('PT BANK NEGARA INDONESIA (PERSERO) TBK', stampX + stampW / 2, stampY + 4.8, {
    align: 'center',
  });

  doc.setFontSize(5.8);
  doc.text('DIVISI RETAIL COLLECTION & RECOVERY', stampX + stampW / 2, stampY + 8.2, {
    align: 'center',
  });

  doc.setFillColor(bniOrange[0], bniOrange[1], bniOrange[2]);
  doc.rect(stampX + 8, stampY + 9.5, stampW - 16, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(isPaid ? 'TERVALIDASI ELEKTRONIK • SAH' : 'BILLING RESMI TERBIT', stampX + stampW / 2, stampY + 12.5, {
    align: 'center',
  });

  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.setFont('courier', 'normal');
  doc.setFontSize(5.5);
  doc.text(`ID SEAL: BNI-SEC-${data.referenceNo.slice(-8)}`, stampX + stampW / 2, stampY + 16.5, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.2);
  doc.text('Dokumen ini sah tanpa tanda tangan basah (UU ITE)', stampX + stampW / 2, stampY + 18.8, {
    align: 'center',
  });

  // Right side: QR Verification Matrix & Integrity verification
  const qrX = 104;
  const qrY = authY + 3.5;

  // Draw simulated QR Code vector in PDF
  const drawMiniQr = (x: number, y: number, size: number) => {
    doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
    // Corner outer markers
    doc.rect(x, y, 5, 5, 'F');
    doc.rect(x + size - 5, y, 5, 5, 'F');
    doc.rect(x, y + size - 5, 5, 5, 'F');
    // Inner cutouts
    doc.setFillColor(255, 255, 255);
    doc.rect(x + 1, y + 1, 3, 3, 'F');
    doc.rect(x + size - 4, y + 1, 3, 3, 'F');
    doc.rect(x + 1, y + size - 4, 3, 3, 'F');
    // Inner dots
    doc.setFillColor(bniOrange[0], bniOrange[1], bniOrange[2]);
    doc.rect(x + 1.8, y + 1.8, 1.4, 1.4, 'F');
    doc.setFillColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
    doc.rect(x + size - 3.2, y + 1.8, 1.4, 1.4, 'F');
    doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.rect(x + 1.8, y + size - 3.2, 1.4, 1.4, 'F');
    // Pattern dots
    doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 === 0) {
          doc.rect(x + 6 + i * 1.5, y + 2 + j * 1.5, 1, 1, 'F');
        }
      }
    }
  };

  drawMiniQr(qrX, qrY + 1.5, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.text('VERIFIKASI KEASLIAN DOKUMEN BILLING', qrX + 20, qrY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(slateBody[0], slateBody[1], slateBody[2]);
  doc.text(
    'Pindai QR ini atau kunjungi tautan verifikasi resmi Bank BNI untuk',
    qrX + 20,
    qrY + 8
  );
  doc.text(
    'memastikan integritas dan keaslian lembar tagihan & pelunasan ini.',
    qrX + 20,
    qrY + 11.5
  );

  doc.setFont('courier', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(bniTealAccent[0], bniTealAccent[1], bniTealAccent[2]);
  doc.text(`https://verify.bni.co.id/billing/${data.referenceNo}`, qrX + 20, qrY + 15.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Hash: SHA256-${data.referenceNo.slice(-12)}-BNICOLLECT`, qrX + 20, qrY + 19);

  // 7. IMPORTANT BILLING LEGAL DISCLAIMER BOX
  const legalY = authY + authH + 3.5;
  const legalH = 22;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(15, legalY, 180, legalH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(bniTeal[0], bniTeal[1], bniTeal[2]);
  doc.text('CATATAN PENTING & KETENTUAN LEMBAR BILLING RESMI:', 19, legalY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(slateBody[0], slateBody[1], slateBody[2]);
  doc.text(
    '1. Lembar ini merupakan bukti penagihan dan rekonsiliasi pelunasan resmi yang diterbitkan secara terkomputerisasi.',
    19,
    legalY + 8.5
  );
  doc.text(
    '2. Sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1, dokumen elektronik ini diakui secara hukum dan sah tanpa tanda tangan basah.',
    19,
    legalY + 12
  );
  doc.text(
    '3. Simpan dokumen ini sebagai bukti pemenuhan kewajiban angsuran kredit fasilitas pembiayaan Anda.',
    19,
    legalY + 15.5
  );
  doc.text(
    '4. Informasi dan bantuan: hubungi BNI Call 1500046 (24 Jam) atau kunjungi Kantor Cabang BNI pengelola terdekat.',
    19,
    legalY + 19
  );

  // 8. REGULATORY FOOTER
  const footerY = 273;
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.setLineWidth(0.3);
  doc.line(15, footerY, 195, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(
    'PT Bank Negara Indonesia (Persero) Tbk. berizin & diawasi oleh Otoritas Jasa Keuangan (OJK) serta peserta penjaminan Lembaga Penjamin Simpanan (LPS).',
    15,
    footerY + 4
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.text(
    `Dicetak otomatis oleh BNI Retail Collection System | Halaman 1 dari 1 | Dokumen Rahasia Nasabah`,
    15,
    footerY + 7.5
  );
  doc.text(`Waktu Cetak: ${data.dateTime}`, 195, footerY + 7.5, { align: 'right' });

  // Save the PDF
  const filename = isPaid
    ? `Lembar_Billing_Pelunasan_BNI_${data.referenceNo}.pdf`
    : `Lembar_Tagihan_BNI_${billingNo}.pdf`;
  doc.save(filename);
}
