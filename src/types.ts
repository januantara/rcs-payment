export type ScreenType = 'landing' | 'nominal' | 'method' | 'va' | 'waiting' | 'success';

export type Language = 'ID' | 'EN';

export interface DebtorInfo {
  name: string;
  contractNo: string;
  product: string;
  branch: string;
  dueDate: string;
  dpdDays: number;
  loanTenor: string;
  installmentNo: string;
}

export interface BillBreakdown {
  pokok: number;
  bunga: number;
  denda: number;
  total: number;
}

export type NominalSelectionType = 'minimum' | 'angsuran' | 'lunas' | 'custom';

export interface NominalOption {
  id: NominalSelectionType;
  label: string;
  sublabel?: string;
  amount: number;
  badge?: string;
  description?: string;
}

export type PaymentChannel = 'va' | 'qris' | 'transfer' | 'autodebit';

export type BankId = 'bni' | 'bca' | 'mandiri' | 'bri';

export interface BankInfo {
  id: BankId;
  name: string;
  shortName: string;
  code: string;
  color: string;
  vaPrefix: string;
}

export interface PaymentState {
  screen: ScreenType;
  selectedNominalType: NominalSelectionType;
  customNominalAmount: number;
  selectedAmount: number;
  selectedChannel: PaymentChannel;
  selectedBank: BankId;
  vaNumber: string;
  expiryDateTime: string;
  transactionRef: string;
  transactionTime: string;
  isPaid: boolean;
  waitingStep: number; // 1: VA Dibuat, 2: Pembayaran Diterima, 3: Diproses, 4: Kewajiban Diperbarui
}
