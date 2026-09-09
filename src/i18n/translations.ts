import { Language } from '../types';

export interface TranslationSchema {
  common: {
    back: string;
    continue: string;
    close: string;
    copy: string;
    copied: string;
    loading: string;
    officialChannel: string;
    secureTransaction: string;
    home: string;
  };
  navbar: {
    systemName: string;
    selectLanguage: string;
    indonesian: string;
    english: string;
    backToHome: string;
  };
  stepper: {
    step1: string;
    step2: string;
    step3: string;
    step3Qris: string;
    step3Transfer: string;
    step4: string;
  };
  landing: {
    greeting: string;
    obligationNotice: string;
    secureBadge: string;
    protectsData: string;
    debtorTitle: string;
    debtorName: string;
    contractNo: string;
    product: string;
    branch: string;
    totalObligation: string;
    dueDate: string;
    viewDetails: string;
    chooseMethodTitle: string;
    vaName: string;
    vaDesc: string;
    qrisName: string;
    qrisDesc: string;
    transferName: string;
    transferDesc: string;
    autodebitName: string;
    autodebitDesc: string;
    channelBadge?: string;
    channelSubtitle?: string;
    badgePopular?: string;
    badgeInstant?: string;
    badgeAllBanks?: string;
    badgeAuto?: string;
    speedRealtime?: string;
    speedInstant?: string;
    speedNetwork?: string;
    speedAutomatic?: string;
    selectBtn?: string;
    securityGuarantee?: string;
    securityGuaranteeDesc?: string;
    callCenter?: string;
  };
  nominal: {
    title: string;
    subtitle: string;
    summaryTitle: string;
    totalObligation: string;
    dueDate: string;
    viewDetails: string;
    chooseNominal: string;
    fullPaymentTitle: string;
    fullPaymentDesc: string;
    recommendedBadge: string;
    oneMonthTitle: string;
    oneMonthDesc: string;
    minPaymentTitle: string;
    minPaymentDesc: string;
    customTitle: string;
    customDesc: string;
    customInputPlaceholder: string;
    customInputHint: string;
    minError: string;
    maxError: string;
    continueBtn: string;
  };
  method: {
    title: string;
    securityTitle: string;
    securityDesc: string;
    securityWarning: string;
    safeTitle: string;
    safeDesc: string;
    safeWarning: string;
    vaTitle: string;
    vaDesc: string;
    vaSubtitle: string;
    selectBank: string;
    qrisTitle: string;
    qrisDesc: string;
    qrisSubtitle: string;
    qrisBadge: string;
    transferTitle: string;
    transferDesc: string;
    transferSubtitle: string;
    autodebitTitle: string;
    autodebitDesc: string;
    registeredOnly: string;
    continueBtn: string;
    backBtn: string;
    supportedQrisApps: string;
    qrisFeeZero: string;
    qrisInstantVerify: string;
  };
  va: {
    titleVa: string;
    titleQris: string;
    titleTransfer: string;
    qrisTitle: string;
    transferTitle: string;
    vaTitle: string;
    subtitleVa: string;
    subtitleQris: string;
    subtitleTransfer: string;
    qrisSubtitle: string;
    transferSubtitle: string;
    vaSubtitle: string;
    labelVa: string;
    labelTransfer: string;
    labelQrisRef: string;
    targetAcc: string;
    vaNumberLabel: string;
    totalPayment: string;
    validUntil: string;
    scanToPay: string;
    optional: string;
    qrisNational: string;
    qrisScanAnyApp: string;
    referenceCode: string;
    refCode: string;
    qrisBadge: string;
    qrisStandard: string;
    scanQrDesc: string;
    copy: string;
    copied: string;
    downloadQr: string;
    downloadingQr: string;
    downloadedQr: string;
    instructionsTitleVa: string;
    instructionsTitleQris: string;
    instructionsTitleTransfer: string;
    vaGuideTitle: string;
    qrisGuideTitle: string;
    transferGuideTitle: string;
    accordionHint: string;
    toggleHint: string;
    viewFullGuide: string;
    autoUpdateNotice: string;
    checkStatusBtn: string;
    iHavePaidBtn: string;
    backBtn: string;
    bniMobileTitle: string;
    bniMobileTransferTitle: string;
    bniMobileSub: string;
    bniMobileTransferSub: string;
    otherBanksTitle: string;
    otherBanksSub: string;
    bankCodeBadge: string;
    destBankInfo: string;
    atmTitle: string;
    atmSub: string;
    qrisEwalletTitle: string;
    qrisEwalletSub: string;
    qrisMbankingTitle: string;
    qrisMbankingSub: string;
  };
  instructions: {
    qrisEwallet: string[];
    qrisMbanking: string[];
    bniMobileVa: string[];
    bniMobileTransfer: string[];
    otherBanks: string[];
    atm: string[];
  };
  waiting: {
    title: string;
    desc: string;
    subtitle: string;
    countdownLabel: string;
    hours: string;
    minutes: string;
    seconds: string;
    refVa: string;
    refTransfer: string;
    refQris: string;
    targetAcc: string;
    vaNumber: string;
    totalBill: string;
    totalPayment: string;
    validUntil: string;
    copy: string;
    copied: string;
    nodeVaCreated: string;
    nodeQrisCreated: string;
    nodeTransferCreated: string;
    nodePaymentReceived: string;
    nodeSystemProcessing: string;
    nodeObligationUpdated: string;
    step1Va: string;
    step1Qris: string;
    step1Transfer: string;
    step2: string;
    step3: string;
    step4: string;
    autoCheckLabel: string;
    checkingLabel: string;
    processing: string;
    simulateBtn: string;
    simulateSuccessBtn: string;
    backHome: string;
    backToHomeBtn: string;
    showQrAgain: string;
    hideQrAgain: string;
  };
  success: {
    title: string;
    desc: string;
    subtitle: string;
    receiptHeader: string;
    refNo: string;
    refNumber: string;
    dateTime: string;
    transactionTime: string;
    paymentMethod: string;
    channelTransfer: string;
    channelQris: string;
    channelVa: (bank: string) => string;
    debtorName: string;
    contractNo: string;
    totalPaid: string;
    totalPayment: string;
    status: string;
    statusPaid: string;
    obligationStatus: string;
    updatedAutomatically: string;
    securityNote: string;
    securityNotice: string;
    securityWarning: string;
    downloadPdfBtn: string;
    downloadBtn: string;
    downloadBillingBtn: string;
    previewBillingBtn: string;
    billingStatementTitle: string;
    billingStatementSub: string;
    downloading: string;
    downloadSuccess: string;
    downloaded: string;
    backToHomeBtn: string;
    backToBilling: string;
  };
  billModal: {
    title: string;
    contractNoLabel: string;
    dpdAlertTitle: string;
    dpdAlertDesc: string;
    debtorDataTitle: string;
    debtorName: string;
    product: string;
    branch: string;
    tenor: string;
    installment: string;
    breakdownTitle: string;
    principal: string;
    interest: string;
    penalty: string;
    total: string;
    downloadBillPdf: string;
    closeBtn: string;
  };
  guideModal: {
    titleVa: string;
    titleQris: string;
    titleTransfer: string;
    vaRefLabel: string;
    qrisRefLabel: string;
    transferRefLabel: string;
    tabBniMobile: string;
    tabBniAtm: string;
    tabOtherBanks: string;
    tabQris: string;
    closeBtn: string;
  };
  footer: {
    tagline: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    copyright: string;
    securityNotice: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  ID: {
    common: {
      back: 'Kembali',
      continue: 'Lanjutkan',
      close: 'Tutup',
      copy: 'Salin',
      copied: 'Tersalin',
      loading: 'Memuat...',
      officialChannel: 'Kanal Resmi BNI',
      secureTransaction: 'Transaksi Aman',
      home: 'Beranda',
    },
    navbar: {
      systemName: 'Retail Collection System',
      selectLanguage: 'Pilih Bahasa',
      indonesian: 'Bahasa Indonesia',
      english: 'English',
      backToHome: 'Kembali ke Beranda',
    },
    stepper: {
      step1: 'Pilih Nominal',
      step2: 'Pilih Metode',
      step3: 'Bayar VA',
      step3Qris: 'Bayar QRIS',
      step3Transfer: 'Transfer Bank',
      step4: 'Selesai',
    },
    landing: {
      greeting: 'Halo, Bapak/Ibu',
      obligationNotice: 'Kami informasikan bahwa terdapat kewajiban pembayaran yang perlu diselesaikan.',
      secureBadge: 'Transaksi Aman',
      protectsData: 'BNI selalu melindungi data Anda',
      debtorTitle: 'Informasi Debitur',
      debtorName: 'Nama',
      contractNo: 'No. Kontrak',
      product: 'Produk',
      branch: 'Cabang',
      totalObligation: 'Total Kewajiban',
      dueDate: 'Jatuh tempo',
      viewDetails: 'Lihat detail tagihan',
      chooseMethodTitle: 'Pilih cara pembayaran yang paling nyaman untuk Anda',
      vaName: 'Virtual Account',
      vaDesc: 'Bayar melalui VA BNI atau Bank lainnya',
      qrisName: 'QRIS',
      qrisDesc: 'Scan QR Code dari aplikasi mobile banking & e-wallet',
      transferName: 'Transfer Bank',
      transferDesc: 'Langsung dari bank atau e-wallet',
      autodebitName: 'Auto Debit',
      autodebitDesc: 'Bagi yang sudah daftar autodebit',
      channelBadge: 'Kanal Pembayaran Resmi',
      channelSubtitle: 'Pilih metode yang Anda inginkan. Seluruh transaksi dijamin aman, terenkripsi, dan langsung diverifikasi otomatis oleh Core Banking BNI.',
      badgePopular: 'Paling Populer',
      badgeInstant: 'Instan & Praktis',
      badgeAllBanks: 'Semua Bank',
      badgeAuto: 'Otomatis Bulanan',
      speedRealtime: 'Verifikasi Real-Time',
      speedInstant: 'Langsung Terverifikasi',
      speedNetwork: 'Jaringan Antar Bank',
      speedAutomatic: 'Debet Otomatis',
      selectBtn: 'Pilih Metode',
      securityGuarantee: 'Jaminan Keamanan Transaksi BNI',
      securityGuaranteeDesc: 'Sistem terhubung langsung ke Core Banking BNI 24/7 tanpa perantara. Bebas biaya admin tambahan.',
      callCenter: 'BNI Call 24 Jam:',
    },
    nominal: {
      title: 'Pilih Nominal Pembayaran',
      subtitle: 'Pilih jumlah pembayaran sesuai dengan kemampuan atau rencana Anda hari ini.',
      summaryTitle: 'Ringkasan Kewajiban',
      totalObligation: 'Total Kewajiban',
      dueDate: 'Jatuh Tempo',
      viewDetails: 'Lihat Detail Tagihan',
      chooseNominal: 'Pilihan Pembayaran',
      fullPaymentTitle: 'Bayar Penuh (Lunas)',
      fullPaymentDesc: 'Menyelesaikan seluruh sisa tagihan pinjaman',
      recommendedBadge: 'Rekomendasi',
      oneMonthTitle: 'Bayar Angsuran 1 Bulan',
      oneMonthDesc: '1 kali angsuran bulanan pokok + bunga',
      minPaymentTitle: 'Nominal Minimal',
      minPaymentDesc: 'Nominal minimum yang dapat dibayarkan',
      customTitle: 'Nominal Lainnya',
      customDesc: 'Tentukan sendiri nominal yang ingin Anda bayarkan',
      customInputPlaceholder: 'Masukkan nominal',
      customInputHint: 'Min. Rp 100.000 — Maks. sesuai total kewajiban',
      minError: 'Nominal minimal adalah Rp 100.000',
      maxError: 'Nominal melebihi total kewajiban',
      continueBtn: 'Lanjutkan ke Metode Pembayaran',
    },
    method: {
      title: 'Pilih Metode Pembayaran',
      securityTitle: 'Pembayaran Aman',
      securityDesc: 'Lakukan pembayaran hanya melalui Virtual Account atau kanal resmi yang tertera pada halaman ini.',
      securityWarning: 'BNI tidak pernah meminta pembayaran ke rekening pribadi petugas/collector.',
      safeTitle: 'Pembayaran Aman',
      safeDesc: 'Lakukan pembayaran hanya melalui Virtual Account atau kanal resmi yang tertera pada halaman ini.',
      safeWarning: 'BNI tidak pernah meminta pembayaran ke rekening pribadi petugas/collector.',
      vaTitle: 'Virtual Account',
      vaDesc: 'Transfer via ATM, Mobile Banking, atau Internet Banking',
      vaSubtitle: 'BNI, Mandiri, BCA, BRI',
      selectBank: 'Pilih Bank untuk Virtual Account:',
      qrisTitle: 'QRIS (Standar Pembayaran Nasional)',
      qrisDesc: 'Bayar instan dengan scan kode QR melalui GoPay, OVO, Dana, ShopeePay, atau mobile banking',
      qrisSubtitle: 'GoPay, OVO, DANA, ShopeePay, BCA, Mandiri, BRI, BNI dll',
      qrisBadge: 'Scan QRIS',
      transferTitle: 'Transfer Bank',
      transferDesc: 'Transfer manual ke rekening resmi penampungan BNI',
      transferSubtitle: 'Rekening resmi penampungan BNI Retail Collection',
      autodebitTitle: 'Auto Debit',
      autodebitDesc: 'Debit otomatis dari rekening tabungan BNI terdaftar',
      registeredOnly: 'Hanya Rekening Terdaftar',
      continueBtn: 'Lanjutkan Pembayaran',
      backBtn: 'Kembali',
      supportedQrisApps: 'Didukung semua aplikasi e-wallet & mobile banking dengan scanner QRIS',
      qrisFeeZero: 'Biaya Transaksi Rp 0',
      qrisInstantVerify: 'Verifikasi Otomatis Real-time',
    },
    va: {
      titleVa: 'Nomor Virtual Account Anda',
      titleQris: 'Pembayaran QRIS',
      titleTransfer: 'Transfer Bank',
      qrisTitle: 'Pembayaran QRIS',
      transferTitle: 'Transfer Bank',
      vaTitle: 'Nomor Virtual Account Anda',
      subtitleVa: 'Silakan lakukan pembayaran melalui nomor VA berikut.',
      subtitleQris: 'Scan kode QRIS di bawah menggunakan aplikasi mobile banking atau e-wallet pilihan Anda.',
      subtitleTransfer: 'Silakan lakukan transfer ke nomor rekening tujuan berikut.',
      qrisSubtitle: 'Scan kode QRIS di bawah menggunakan aplikasi mobile banking atau e-wallet pilihan Anda.',
      transferSubtitle: 'Silakan lakukan transfer ke nomor rekening tujuan berikut.',
      vaSubtitle: 'Silakan lakukan pembayaran melalui nomor VA berikut.',
      labelVa: 'Nomor Virtual Account',
      labelTransfer: 'Nomor Rekening Tujuan',
      labelQrisRef: 'Referensi Transaksi QRIS',
      targetAcc: 'Nomor Rekening Tujuan',
      vaNumberLabel: 'Nomor Virtual Account',
      totalPayment: 'Total Pembayaran',
      validUntil: 'Berlaku sampai',
      scanToPay: 'Scan untuk bayar',
      optional: '(opsional)',
      qrisNational: 'Standar Pembayaran Nasional',
      qrisScanAnyApp: 'Pindai QR ini dari aplikasi mobile banking atau dompet digital',
      referenceCode: 'Kode Referensi',
      refCode: 'Kode Referensi',
      qrisBadge: 'QRIS',
      qrisStandard: 'Standar Pembayaran Nasional',
      scanQrDesc: 'Arahkan kamera e-wallet / m-banking Anda ke QR code ini',
      copy: 'Salin',
      copied: 'Tersalin',
      downloadQr: 'Unduh QR Code',
      downloadingQr: 'Mengunduh...',
      downloadedQr: 'QR Tersimpan!',
      instructionsTitleVa: 'Cara Pembayaran & Petunjuk Transfer',
      instructionsTitleQris: 'Petunjuk Pembayaran QRIS',
      instructionsTitleTransfer: 'Petunjuk Transfer Bank',
      vaGuideTitle: 'Petunjuk Pembayaran Virtual Account',
      qrisGuideTitle: 'Petunjuk Pembayaran QRIS',
      transferGuideTitle: 'Petunjuk Transfer Bank',
      accordionHint: 'Klik untuk membuka / menutup',
      toggleHint: 'Klik untuk melihat petunjuk',
      viewFullGuide: 'Lihat Panduan Lengkap',
      autoUpdateNotice: 'Status pembayaran akan diperbarui secara otomatis dalam beberapa detik setelah Anda menyelesaikan pembayaran.',
      checkStatusBtn: 'Cek Status Pembayaran',
      iHavePaidBtn: 'Saya Sudah Bayar',
      backBtn: 'Kembali',
      bniMobileTitle: 'Transfer dari BNI (Wondr / Mobile Banking)',
      bniMobileTransferTitle: 'Transfer dari Rekening BNI (Wondr / Mobile Banking)',
      bniMobileSub: 'Virtual Account Billing BNI',
      bniMobileTransferSub: 'Transfer Antar Rekening BNI',
      otherBanksTitle: 'Transfer Antar Bank (BCA, Mandiri, BRI, dll)',
      otherBanksSub: 'Transfer Antar Bank / BI-FAST / Online Transfer',
      bankCodeBadge: 'Kode Bank: 009',
      destBankInfo: 'Bank BNI (Kode 009)',
      atmTitle: 'Transfer via ATM (ATM BNI, ATM Bersama, Prima)',
      atmSub: 'Melalui mesin ATM bank apapun',
      qrisEwalletTitle: 'Bayar via Dompet Digital / E-Wallet',
      qrisEwalletSub: 'GoPay, OVO, DANA, ShopeePay, LinkAja, AstraPay, dll',
      qrisMbankingTitle: 'Bayar via Mobile Banking (QRIS Nasional)',
      qrisMbankingSub: 'Wondr by BNI, BCA mobile, Livin\' by Mandiri, BRImo, dll',
    },
    instructions: {
      qrisEwallet: [
        'Buka aplikasi dompet digital favorit Anda (GoPay, OVO, DANA, ShopeePay, atau LinkAja).',
        'Pilih menu "Bayar" atau "Scan QR" pada aplikasi.',
        'Arahkan kamera ponsel Anda ke kode QRIS di layar hingga terdeteksi.',
        'Periksa nama penerima BNI REC - ANDI PRATAMA dan nominal tagihan sudah sesuai.',
        'Konfirmasi pembayaran dan masukkan PIN Anda untuk menyelesaikan transaksi.',
      ],
      qrisMbanking: [
        'Buka aplikasi Mobile Banking bank Anda (Wondr by BNI, BCA mobile, Livin\' Mandiri, BRImo, dll).',
        'Tekan ikon "QRIS" / "QR Pay" pada layar beranda aplikasi.',
        'Arahkan kamera ke kode QR di layar atau unggah screenshot QR code jika disimpan di galeri.',
        'Pastikan nama merchant tertera BNI REC - ANDI PRATAMA dengan nominal yang tepat.',
        'Masukkan PIN / Password Transaksi dan simpan bukti resi transaksi Anda.',
      ],
      bniMobileVa: [
        'Buka aplikasi Wondr by BNI atau BNI Mobile Banking dan login dengan MPIN / biometrik Anda.',
        'Pilih menu "Transfer", kemudian pilih "Virtual Account Billing".',
        'Pilih tab "Input Baru" dan masukkan nomor Virtual Account yang tertera di layar.',
        'Periksa nama tagihan dan nominal pembayaran, lalu masukkan Password Transaksi.',
        'Transaksi selesai dan simpan bukti transfer Anda sebagai tanda terima resmi.',
      ],
      bniMobileTransfer: [
        'Buka aplikasi Wondr by BNI atau BNI Mobile Banking dan login dengan akun Anda.',
        'Pilih menu "Transfer" > pilih "Antar Rekening BNI".',
        'Pilih tab "Input Baru" dan masukkan nomor rekening tujuan yang tertera.',
        'Masukkan nominal sesuai jumlah tagihan, lalu masukkan Password Transaksi Anda.',
        'Transaksi berhasil, sistem akan memverifikasi pembayaran secara otomatis.',
      ],
      otherBanks: [
        'Buka aplikasi Mobile Banking atau ATM bank Anda (BCA, Mandiri, BRI, Permata, dll).',
        'Pilih menu Transfer Antar Bank / BI-FAST / Online Transfer.',
        'Pilih Bank Tujuan: Bank BNI (Kode 009) dan masukkan nomor rekening/VA tujuan.',
        'Masukkan nominal pembayaran persis sesuai total tagihan.',
        'Pastikan nama penerima tertera BNI REC - ANDI PRATAMA, lalu selesaikan dengan PIN Anda.',
      ],
      atm: [
        'Masukkan kartu ATM dan PIN Anda di mesin ATM (BNI, ATM Bersama, Prima, Link).',
        'Pilih menu Transfer > Antar Bank atau ke Rekening BNI.',
        'Masukkan kode bank 009 diikuti nomor tujuan yang tertera.',
        'Masukkan nominal tagihan secara tepat dan konfirmasi transaksi Anda.',
        'Simpan struk transaksi ATM sebagai bukti pembayaran resmi Anda.',
      ],
    },
    waiting: {
      title: 'Menunggu Pembayaran',
      desc: 'Selesaikan pembayaran Anda sebelum batas waktu berakhir.',
      subtitle: 'Selesaikan pembayaran Anda sebelum batas waktu berakhir.',
      countdownLabel: 'Batas Waktu Pembayaran',
      hours: 'Jam',
      minutes: 'Menit',
      seconds: 'Detik',
      refVa: 'Nomor VA',
      refTransfer: 'Nomor Rekening Tujuan',
      refQris: 'Referensi Transaksi QRIS',
      targetAcc: 'Nomor Rekening Tujuan',
      vaNumber: 'Nomor Virtual Account',
      totalBill: 'Total Tagihan',
      totalPayment: 'Total Pembayaran',
      validUntil: 'Berlaku sampai',
      copy: 'Salin',
      copied: 'Tersalin',
      nodeVaCreated: 'VA Dibuat',
      nodeQrisCreated: 'QRIS Dibuat',
      nodeTransferCreated: 'Instruksi Dibuat',
      nodePaymentReceived: 'Pembayaran Diterima',
      nodeSystemProcessing: 'Diproses Sistem',
      nodeObligationUpdated: 'Kewajiban Diperbarui',
      step1Va: 'Tagihan VA Dibuat',
      step1Qris: 'Kode QRIS Dibuat',
      step1Transfer: 'Instruksi Transfer Dibuat',
      step2: 'Pembayaran Diterima',
      step3: 'Diproses Sistem',
      step4: 'Kewajiban Diperbarui',
      autoCheckLabel: 'Pengecekan otomatis setiap 15 detik...',
      checkingLabel: 'Memverifikasi status transaksi...',
      processing: 'Memverifikasi status pembayaran...',
      simulateBtn: 'Simulasikan Pembayaran Berhasil',
      simulateSuccessBtn: 'Simulasikan Pembayaran Berhasil',
      backHome: 'Kembali ke Beranda',
      backToHomeBtn: 'Kembali ke Beranda',
      showQrAgain: 'Tampilkan QR Code',
      hideQrAgain: 'Sembunyikan QR Code',
    },
    success: {
      title: 'Pembayaran Berhasil Diterima!',
      desc: 'Terima kasih, pembayaran kewajiban Anda telah berhasil diproses oleh sistem BNI Retail Collection.',
      subtitle: 'Terima kasih, pembayaran kewajiban Anda telah berhasil diproses oleh sistem BNI Retail Collection.',
      receiptHeader: 'Bukti Pembayaran Resmi',
      refNo: 'Nomor Referensi',
      refNumber: 'Nomor Referensi',
      dateTime: 'Waktu Transaksi',
      transactionTime: 'Waktu Transaksi',
      paymentMethod: 'Metode Pembayaran',
      channelTransfer: 'Transfer Bank (Rekening Penampungan BNI)',
      channelQris: 'QRIS (Standar Pembayaran Nasional)',
      channelVa: (bank: string) => `Virtual Account (${bank})`,
      debtorName: 'Nama Debitur',
      contractNo: 'No. Kontrak',
      totalPaid: 'Total Dibayar',
      totalPayment: 'Total Pembayaran',
      status: 'Status',
      statusPaid: 'LUNAS (DITERIMA)',
      obligationStatus: 'Status Kewajiban',
      updatedAutomatically: 'Telah Diperbarui Otomatis',
      securityNote: 'Resi ini merupakan bukti transaksi elektronik resmi yang diterbitkan oleh PT Bank Negara Indonesia (Persero) Tbk. Harap simpan nomor referensi ini.',
      securityNotice: 'Resi ini merupakan bukti transaksi elektronik resmi yang diterbitkan oleh PT Bank Negara Indonesia (Persero) Tbk. Harap simpan nomor referensi ini.',
      securityWarning: 'Pembayaran telah tercatat di core banking BNI dan riwayat kolektibilitas Anda diperbarui seketika.',
      downloadPdfBtn: 'Unduh Lembar Billing & Pelunasan (PDF)',
      downloadBtn: 'Unduh Lembar Billing & Pelunasan (PDF)',
      downloadBillingBtn: 'Unduh Lembar Tagihan Resmi (PDF)',
      previewBillingBtn: 'Pratinjau Lembar Billing',
      billingStatementTitle: 'Lembar Tagihan & Bukti Pelunasan Resmi',
      billingStatementSub: 'Retail Loan Billing & Settlement Statement',
      downloading: 'Menyiapkan Dokumen PDF...',
      downloadSuccess: 'Lembar Billing Berhasil Diunduh!',
      downloaded: 'Lembar Billing Berhasil Diunduh!',
      backToHomeBtn: 'Kembali ke Beranda',
      backToBilling: 'Kembali ke Beranda',
    },
    billModal: {
      title: 'Rincian Lengkap Tagihan',
      contractNoLabel: 'No. Kontrak',
      dpdAlertTitle: 'Keterlambatan {days} Hari (DPD)',
      dpdAlertDesc: 'Jatuh tempo pada {date}. Segera selesaikan pembayaran untuk menghindari penambahan denda harian.',
      debtorDataTitle: 'Data Debitur',
      debtorName: 'Nama Debitur',
      product: 'Produk Pinjaman',
      branch: 'Kantor Cabang Pengelola',
      tenor: 'Tenor Pinjaman',
      installment: 'Angsuran Berjalan',
      breakdownTitle: 'Rincian Biaya Kewajiban',
      principal: 'Pokok Pinjaman',
      interest: 'Bunga Berjalan',
      penalty: 'Denda Keterlambatan',
      total: 'Total Kewajiban',
      downloadBillPdf: 'Unduh Lembar Tagihan (PDF)',
      closeBtn: 'Tutup',
    },
    guideModal: {
      titleVa: 'Panduan Pembayaran Virtual Account',
      titleQris: 'Panduan Pembayaran QRIS',
      titleTransfer: 'Panduan Transfer Bank',
      vaRefLabel: 'Nomor Virtual Account',
      qrisRefLabel: 'Referensi Transaksi',
      transferRefLabel: 'Nomor Rekening Tujuan',
      tabBniMobile: 'Wondr / BNI Mobile',
      tabBniAtm: 'ATM BNI',
      tabOtherBanks: 'Bank Lain',
      tabQris: 'QRIS',
      closeBtn: 'Tutup',
    },
    footer: {
      tagline: 'Melayani Negeri, Kebanggaan Bangsa',
      pillar1Title: 'Aman',
      pillar1Desc: 'Dengan sistem keamanan bertaraf bank',
      pillar2Title: 'Mudah',
      pillar2Desc: 'Banyak pilihan metode pembayaran',
      pillar3Title: 'Cepat',
      pillar3Desc: 'Status pembayaran terupdate otomatis',
      copyright: '© 2026 PT Bank Negara Indonesia (Persero) Tbk. Hak Cipta Dilindungi.',
      securityNotice: 'Kanal resmi penyelesaian kewajiban debitur retail BNI.',
    },
  },

  EN: {
    common: {
      back: 'Back',
      continue: 'Continue',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied',
      loading: 'Loading...',
      officialChannel: 'Official BNI Channel',
      secureTransaction: 'Secure Transaction',
      home: 'Home',
    },
    navbar: {
      systemName: 'Retail Collection System',
      selectLanguage: 'Select Language',
      indonesian: 'Bahasa Indonesia',
      english: 'English',
      backToHome: 'Back to Home',
    },
    stepper: {
      step1: 'Select Amount',
      step2: 'Payment Method',
      step3: 'Pay VA',
      step3Qris: 'Scan QRIS',
      step3Transfer: 'Bank Transfer',
      step4: 'Done',
    },
    landing: {
      greeting: 'Hello, Sir/Madam',
      obligationNotice: 'We inform you that there is an outstanding payment obligation that needs to be settled.',
      secureBadge: 'Secure Transaction',
      protectsData: 'BNI always protects your personal data',
      debtorTitle: 'Debtor Information',
      debtorName: 'Name',
      contractNo: 'Contract No.',
      product: 'Product',
      branch: 'Branch',
      totalObligation: 'Total Obligation',
      dueDate: 'Due date',
      viewDetails: 'View bill details',
      chooseMethodTitle: 'Choose the payment method that is most convenient for you',
      vaName: 'Virtual Account',
      vaDesc: 'Pay via BNI VA or other banks',
      qrisName: 'QRIS',
      qrisDesc: 'Scan QR Code from mobile banking & e-wallets',
      transferName: 'Bank Transfer',
      transferDesc: 'Direct transfer from bank or e-wallet',
      autodebitName: 'Auto Debit',
      autodebitDesc: 'For registered autodebit customers',
      channelBadge: 'Official Payment Channels',
      channelSubtitle: 'Select your preferred method. All transactions are secure, encrypted, and instantly verified by BNI Core Banking.',
      badgePopular: 'Most Popular',
      badgeInstant: 'Instant & Easy',
      badgeAllBanks: 'All Banks',
      badgeAuto: 'Monthly Auto',
      speedRealtime: 'Real-Time Verified',
      speedInstant: 'Instantly Verified',
      speedNetwork: 'Interbank Network',
      speedAutomatic: 'Auto Debit',
      selectBtn: 'Select Method',
      securityGuarantee: 'BNI Transaction Security Guarantee',
      securityGuaranteeDesc: 'Directly connected to BNI Core Banking 24/7 with zero extra admin fees.',
      callCenter: 'BNI Call 24/7:',
    },
    nominal: {
      title: 'Select Payment Amount',
      subtitle: 'Choose your payment amount based on your plan or capability today.',
      summaryTitle: 'Obligation Summary',
      totalObligation: 'Total Obligation',
      dueDate: 'Due Date',
      viewDetails: 'View Bill Details',
      chooseNominal: 'Payment Options',
      fullPaymentTitle: 'Pay in Full (Settled)',
      fullPaymentDesc: 'Settles the entire remaining loan obligation',
      recommendedBadge: 'Recommended',
      oneMonthTitle: 'Pay 1 Month Installment',
      oneMonthDesc: '1 monthly installment of principal + interest',
      minPaymentTitle: 'Minimum Amount',
      minPaymentDesc: 'Minimum acceptable payment amount',
      customTitle: 'Other Amount',
      customDesc: 'Enter a custom amount you wish to pay',
      customInputPlaceholder: 'Enter amount',
      customInputHint: 'Min. IDR 100,000 — Max. equal to total obligation',
      minError: 'Minimum payment amount is IDR 100,000',
      maxError: 'Amount exceeds total obligation',
      continueBtn: 'Continue to Payment Method',
    },
    method: {
      title: 'Choose Payment Method',
      securityTitle: 'Secure Payment',
      securityDesc: 'Make payments only through official Virtual Accounts or channels shown on this page.',
      securityWarning: 'BNI never requests payments into personal accounts of staff/collectors.',
      safeTitle: 'Secure Payment',
      safeDesc: 'Make payments only through official Virtual Accounts or channels shown on this page.',
      safeWarning: 'BNI never requests payments into personal accounts of staff/collectors.',
      vaTitle: 'Virtual Account',
      vaDesc: 'Transfer via ATM, Mobile Banking, or Internet Banking',
      vaSubtitle: 'BNI, Mandiri, BCA, BRI',
      selectBank: 'Select Bank for Virtual Account:',
      qrisTitle: 'QRIS (National Payment Standard)',
      qrisDesc: 'Instant payment by scanning QR code via GoPay, OVO, Dana, ShopeePay, or mobile banking',
      qrisSubtitle: 'GoPay, OVO, DANA, ShopeePay, BCA, Mandiri, BRI, BNI etc',
      qrisBadge: 'Scan QRIS',
      transferTitle: 'Bank Transfer',
      transferDesc: 'Manual transfer to official BNI collection account',
      transferSubtitle: 'Official BNI Retail Collection clearing account',
      autodebitTitle: 'Auto Debit',
      autodebitDesc: 'Automatic debit from registered BNI savings account',
      registeredOnly: 'Registered Accounts Only',
      continueBtn: 'Proceed to Payment',
      backBtn: 'Back',
      supportedQrisApps: 'Supported by all e-wallet & mobile banking apps with QRIS scanner',
      qrisFeeZero: 'Admin Fee IDR 0',
      qrisInstantVerify: 'Real-time Automatic Verification',
    },
    va: {
      titleVa: 'Your Virtual Account Number',
      titleQris: 'QRIS Payment',
      titleTransfer: 'Bank Transfer',
      qrisTitle: 'QRIS Payment',
      transferTitle: 'Bank Transfer',
      vaTitle: 'Your Virtual Account Number',
      subtitleVa: 'Please complete your payment using the following VA number.',
      subtitleQris: 'Scan the QRIS code below using your mobile banking or e-wallet application.',
      subtitleTransfer: 'Please transfer to the following destination account number.',
      qrisSubtitle: 'Scan the QRIS code below using your mobile banking or e-wallet application.',
      transferSubtitle: 'Please transfer to the following destination account number.',
      vaSubtitle: 'Please complete your payment using the following VA number.',
      labelVa: 'Virtual Account Number',
      labelTransfer: 'Destination Account Number',
      labelQrisRef: 'QRIS Transaction Reference',
      targetAcc: 'Destination Account Number',
      vaNumberLabel: 'Virtual Account Number',
      totalPayment: 'Total Payment',
      validUntil: 'Valid until',
      scanToPay: 'Scan to pay',
      optional: '(optional)',
      qrisNational: 'National Payment Standard',
      qrisScanAnyApp: 'Scan this QR code with any mobile banking or digital wallet app',
      referenceCode: 'Reference Code',
      refCode: 'Reference Code',
      qrisBadge: 'QRIS',
      qrisStandard: 'National Payment Standard',
      scanQrDesc: 'Point your e-wallet / m-banking camera at this QR code',
      copy: 'Copy',
      copied: 'Copied',
      downloadQr: 'Download QR Code',
      downloadingQr: 'Downloading...',
      downloadedQr: 'QR Saved!',
      instructionsTitleVa: 'Payment & Transfer Instructions',
      instructionsTitleQris: 'QRIS Payment Instructions',
      instructionsTitleTransfer: 'Bank Transfer Instructions',
      vaGuideTitle: 'Virtual Account Payment Guide',
      qrisGuideTitle: 'QRIS Payment Guide',
      transferGuideTitle: 'Bank Transfer Guide',
      accordionHint: 'Click to expand / collapse',
      toggleHint: 'Click to view instructions',
      viewFullGuide: 'View Complete Guide',
      autoUpdateNotice: 'Payment status will automatically update within seconds after you complete the transaction.',
      checkStatusBtn: 'Check Payment Status',
      iHavePaidBtn: 'I Have Paid',
      backBtn: 'Back',
      bniMobileTitle: 'Transfer from BNI (Wondr / Mobile Banking)',
      bniMobileTransferTitle: 'Transfer from BNI Account (Wondr / Mobile Banking)',
      bniMobileSub: 'BNI Virtual Account Billing',
      bniMobileTransferSub: 'BNI Inter-Account Transfer',
      otherBanksTitle: 'Inter-Bank Transfer (BCA, Mandiri, BRI, etc.)',
      otherBanksSub: 'Inter-Bank Transfer / BI-FAST / Online Transfer',
      bankCodeBadge: 'Bank Code: 009',
      destBankInfo: 'Bank BNI (Code 009)',
      atmTitle: 'Transfer via ATM (BNI ATM, ATM Bersama, Prima)',
      atmSub: 'Available at any ATM machine nationwide',
      qrisEwalletTitle: 'Pay via Digital Wallet / E-Wallet',
      qrisEwalletSub: 'GoPay, OVO, DANA, ShopeePay, LinkAja, AstraPay, etc.',
      qrisMbankingTitle: 'Pay via Mobile Banking (National QRIS)',
      qrisMbankingSub: 'Wondr by BNI, BCA mobile, Livin\' by Mandiri, BRImo, etc.',
    },
    instructions: {
      qrisEwallet: [
        'Open your preferred digital wallet app (GoPay, OVO, DANA, ShopeePay, or LinkAja).',
        'Tap the "Pay" or "Scan QR" menu in the app.',
        'Point your phone camera towards the QRIS code above until detected.',
        'Verify that recipient name BNI REC - ANDI PRATAMA and amount match correctly.',
        'Confirm payment and enter your PIN to complete the transaction.',
      ],
      qrisMbanking: [
        'Open your mobile banking app (Wondr by BNI, BCA mobile, Livin\' Mandiri, BRImo, etc.).',
        'Tap the "QRIS" / "QR Pay" icon on the home screen.',
        'Point camera at the QR code on screen (or upload QR screenshot from gallery).',
        'Ensure the merchant name displays BNI REC - ANDI PRATAMA with exact amount.',
        'Enter your PIN / Transaction Password and save your transaction receipt.',
      ],
      bniMobileVa: [
        'Open Wondr by BNI or BNI Mobile Banking and log in with your MPIN / biometrics.',
        'Select "Transfer" menu, then choose "Virtual Account Billing".',
        'Select "Input Baru" tab and enter the Virtual Account number displayed.',
        'Verify recipient name BNI REC - ANDI PRATAMA and payment amount.',
        'Enter your Transaction Password to complete payment and save the proof.',
      ],
      bniMobileTransfer: [
        'Open Wondr by BNI or BNI Mobile Banking and log in with your account.',
        'Select "Transfer" > choose "Antar Rekening BNI".',
        'Select "Input Baru" tab and enter the destination account number.',
        'Enter amount matching your bill, then enter your Transaction Password.',
        'Transaction complete, system will automatically verify your payment.',
      ],
      otherBanks: [
        'Open your mobile banking or ATM (BCA, Mandiri, BRI, Permata, Danamon, etc.).',
        'Choose "Interbank Transfer" or "Transfer to Other Bank" (BI-FAST or Online Transfer).',
        'Select Destination Bank: Bank Negara Indonesia (BNI) / Bank Code 009.',
        'Enter destination account or Virtual Account number.',
        'Enter exact payment amount corresponding to your selected bill.',
        'Ensure recipient name displays BNI REC - ANDI PRATAMA, then confirm with PIN.',
      ],
      atm: [
        'Insert your debit card and enter your PIN at any ATM (BNI / ATM Bersama / Prima / Link).',
        'Select "Transfer" > choose "Inter-Account Transfer" or "Online Inter-Bank Transfer".',
        'Enter bank code 009 + the destination account/VA number.',
        'Enter exact bill amount and confirm transaction on screen.',
        'Save the ATM receipt as your official proof of payment.',
      ],
    },
    waiting: {
      title: 'Waiting for Payment',
      desc: 'Please complete your payment before the time limit expires.',
      subtitle: 'Please complete your payment before the time limit expires.',
      countdownLabel: 'Payment Time Remaining',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      refVa: 'VA Number',
      refTransfer: 'Destination Account Number',
      refQris: 'QRIS Transaction Reference',
      targetAcc: 'Destination Account Number',
      vaNumber: 'Virtual Account Number',
      totalBill: 'Total Bill',
      totalPayment: 'Total Payment',
      validUntil: 'Valid until',
      copy: 'Copy',
      copied: 'Copied',
      nodeVaCreated: 'VA Created',
      nodeQrisCreated: 'QRIS Created',
      nodeTransferCreated: 'Instruction Created',
      nodePaymentReceived: 'Payment Received',
      nodeSystemProcessing: 'System Processing',
      nodeObligationUpdated: 'Obligation Updated',
      step1Va: 'VA Billing Created',
      step1Qris: 'QRIS Code Generated',
      step1Transfer: 'Transfer Instruction Created',
      step2: 'Payment Received',
      step3: 'System Processing',
      step4: 'Obligation Updated',
      autoCheckLabel: 'Automatic status check every 15 seconds...',
      checkingLabel: 'Verifying transaction status...',
      processing: 'Verifying payment status...',
      simulateBtn: 'Simulate Successful Payment',
      simulateSuccessBtn: 'Simulate Successful Payment',
      backHome: 'Back to Home',
      backToHomeBtn: 'Back to Home',
      showQrAgain: 'Show QR Code',
      hideQrAgain: 'Hide QR Code',
    },
    success: {
      title: 'Payment Successfully Received!',
      desc: 'Thank you, your obligation payment has been successfully processed by the BNI Retail Collection system.',
      subtitle: 'Thank you, your obligation payment has been successfully processed by the BNI Retail Collection system.',
      receiptHeader: 'Official Payment Receipt',
      refNo: 'Reference Number',
      refNumber: 'Reference Number',
      dateTime: 'Transaction Time',
      transactionTime: 'Transaction Time',
      paymentMethod: 'Payment Method',
      channelTransfer: 'Bank Transfer (BNI Collection Account)',
      channelQris: 'QRIS (National Payment Standard)',
      channelVa: (bank: string) => `Virtual Account (${bank})`,
      debtorName: 'Debtor Name',
      contractNo: 'Contract No.',
      totalPaid: 'Total Paid',
      totalPayment: 'Total Payment',
      status: 'Status',
      statusPaid: 'PAID (CONFIRMED)',
      obligationStatus: 'Obligation Status',
      updatedAutomatically: 'Automatically Updated',
      securityNote: 'This receipt is official proof of electronic transaction issued by PT Bank Negara Indonesia (Persero) Tbk. Please retain this reference number.',
      securityNotice: 'This receipt is official proof of electronic transaction issued by PT Bank Negara Indonesia (Persero) Tbk. Please retain this reference number.',
      securityWarning: 'Payment has been processed directly into BNI core banking, and your credit record has been refreshed immediately.',
      downloadPdfBtn: 'Download Official Billing Statement (PDF)',
      downloadBtn: 'Download Official Billing Statement (PDF)',
      downloadBillingBtn: 'Download Billing Statement (PDF)',
      previewBillingBtn: 'Preview Billing Statement',
      billingStatementTitle: 'Official Billing & Settlement Statement',
      billingStatementSub: 'Retail Loan Billing & Settlement Statement',
      downloading: 'Preparing PDF Document...',
      downloadSuccess: 'Billing Statement Downloaded Successfully!',
      downloaded: 'Billing Statement Downloaded Successfully!',
      backToHomeBtn: 'Back to Home',
      backToBilling: 'Back to Home',
    },
    billModal: {
      title: 'Detailed Bill Breakdown',
      contractNoLabel: 'Contract No.',
      dpdAlertTitle: '{days} Days Overdue (DPD)',
      dpdAlertDesc: 'Due on {date}. Please settle promptly to avoid additional daily penalty charges.',
      debtorDataTitle: 'Debtor Information',
      debtorName: 'Debtor Name',
      product: 'Loan Product',
      branch: 'Managing Branch Office',
      tenor: 'Loan Tenor',
      installment: 'Current Installment',
      breakdownTitle: 'Obligation Cost Breakdown',
      principal: 'Loan Principal',
      interest: 'Accrued Interest',
      penalty: 'Late Penalty Fee',
      total: 'Total Obligation',
      downloadBillPdf: 'Download Billing Statement (PDF)',
      closeBtn: 'Close',
    },
    guideModal: {
      titleVa: 'Virtual Account Payment Guide',
      titleQris: 'QRIS Payment Guide',
      titleTransfer: 'Bank Transfer Guide',
      vaRefLabel: 'Virtual Account Number',
      qrisRefLabel: 'Transaction Reference',
      transferRefLabel: 'Destination Account Number',
      tabBniMobile: 'Wondr / BNI Mobile',
      tabBniAtm: 'BNI ATM',
      tabOtherBanks: 'Other Banks',
      tabQris: 'QRIS',
      closeBtn: 'Close',
    },
    footer: {
      tagline: 'Serving the Nation, Pride of Indonesia',
      pillar1Title: 'Secure',
      pillar1Desc: 'Backed by bank-grade security systems',
      pillar2Title: 'Easy',
      pillar2Desc: 'Comprehensive choice of payment channels',
      pillar3Title: 'Fast',
      pillar3Desc: 'Payment status updated automatically',
      copyright: '© 2026 PT Bank Negara Indonesia (Persero) Tbk. All Rights Reserved.',
      securityNotice: 'Official channel for BNI retail debtor obligation settlement.',
    },
  },
};
