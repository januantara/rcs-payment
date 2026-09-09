import { DebtorInfo, BillBreakdown, BankInfo } from '../types';

export const mockDebtor: DebtorInfo = {
  name: 'Andi Pratama',
  contractNo: 'CN123456789',
  product: 'Kredit Pemilikan Rumah (KPR)',
  branch: 'BNI KC Jakarta',
  dueDate: '10 September 2026',
  dpdDays: 12,
  loanTenor: '180 Bulan (15 Tahun)',
  installmentNo: 'Ke-36 dari 180',
};

export const mockBreakdown: BillBreakdown = {
  pokok: 8000000,
  bunga: 500000,
  denda: 250000,
  total: 8750000,
};

export const banksList: BankInfo[] = [
  {
    id: 'bni',
    name: 'Bank Negara Indonesia',
    shortName: 'BNI',
    code: '009',
    color: '#f15a24',
    vaPrefix: '9888',
  },
  {
    id: 'bca',
    name: 'Bank Central Asia',
    shortName: 'BCA',
    code: '014',
    color: '#0060af',
    vaPrefix: '3901',
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    shortName: 'mandiri',
    code: '008',
    color: '#003366',
    vaPrefix: '8890',
  },
  {
    id: 'bri',
    name: 'Bank Rakyat Indonesia',
    shortName: 'BRI',
    code: '002',
    color: '#00529c',
    vaPrefix: '1280',
  },
];

export const paymentGuideSteps: Record<string, string[]> = {
  bni_mobile: [
    'Buka aplikasi Wondr by BNI atau BNI Mobile Banking dan masukkan MPIN Anda.',
    'Pilih menu "Transfer", kemudian pilih "Virtual Account Billing".',
    'Pilih tab "Input Baru", lalu masukkan nomor Virtual Account: 9888 1234 5678 9012.',
    'Konfirmasi rincian pembayaran (Nama: Andi Pratama, Total Tagihan).',
    'Masukkan Password Transaksi Anda dan simpan bukti transaksi.',
  ],
  bni_atm: [
    'Masukkan Kartu Debit BNI dan PIN Anda di mesin ATM BNI.',
    'Pilih menu "Menu Lainnya" > "Transfer".',
    'Pilih jenis rekening asal dan pilih "Virtual Account Billing".',
    'Masukkan Nomor Virtual Account Anda: 9888 1234 5678 9012.',
    'Tagihan yang harus dibayarkan akan muncul di layar konfirmasi.',
    'Jika sudah sesuai, lanjutkan pembayaran dan simpan struk transaksi.',
  ],
  other_banks: [
    'Buka aplikasi Mobile Banking / Internet Banking bank Anda.',
    'Pilih menu "Transfer Antar Bank" atau "Transfer Online / BI-FAST".',
    'Pilih Bank Tujuan: Bank Negara Indonesia (BNI) / Kode Bank 009.',
    'Masukkan nomor rekening tujuan.',
    'Masukkan nominal pembayaran yang tepat sesuai tagihan.',
    'Konfirmasi nama penerima "BNI REC - ANDI PRATAMA" dan selesaikan transaksi.',
  ],
  qris: [
    'Buka aplikasi mobile banking atau e-wallet pilihan Anda (Wondr by BNI, BCA Mobile, Livin by Mandiri, GoPay, OVO, Dana).',
    'Pilih fitur "Scan QRIS" atau "Bayar".',
    'Arahkan kamera ke QR Code yang tertera di layar.',
    'Periksa kesesuaian merchant: "BNI RETAIL COLLECTION".',
    'Konfirmasi nominal pembayaran dan selesaikan otentikasi PIN/biometrik.',
  ],
};
