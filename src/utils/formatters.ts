export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('Rp', 'Rp ');
}

export function formatNumberOnly(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function parseRupiahInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export function generateVaNumber(bank: string): string {
  switch (bank) {
    case 'bni':
      return '9888 1234 5678 9012';
    case 'bca':
      return '3901 0812 3456 7890';
    case 'mandiri':
      return '8890 8123 4567 8901';
    case 'bri':
      return '1280 0812 3456 7890';
    default:
      return '9888 1234 5678 9012';
  }
}

export function generateRefNo(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `BNI${dateStr}1032${randNum.toString().slice(0, 3)}`;
}
