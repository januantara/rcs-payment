import React from 'react';
import { Check, ChevronRight, FileText, Calculator, CreditCard, QrCode, Clock, CheckCircle2 } from 'lucide-react';
import { ScreenType } from '../types';

interface StageNavigatorProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export interface StageItem {
  id: ScreenType;
  number: number;
  label: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STAGES: StageItem[] = [
  {
    id: 'landing',
    number: 1,
    label: 'Tagihan',
    title: 'Informasi Tagihan',
    desc: 'Rincian kewajiban & debitur',
    icon: FileText,
  },
  {
    id: 'nominal',
    number: 2,
    label: 'Nominal',
    title: 'Pilih Nominal',
    desc: 'Opsi bayar pokok/lunas/lainnya',
    icon: Calculator,
  },
  {
    id: 'method',
    number: 3,
    label: 'Metode',
    title: 'Metode Pembayaran',
    desc: 'VA, QRIS, Transfer, Auto Debit',
    icon: CreditCard,
  },
  {
    id: 'va',
    number: 4,
    label: 'Kode Bayar',
    title: 'Virtual Account / QR',
    desc: 'Nomor VA & panduan transfer',
    icon: QrCode,
  },
  {
    id: 'waiting',
    number: 5,
    label: 'Menunggu',
    title: 'Status Verifikasi',
    desc: 'Pengecekan transaksi real-time',
    icon: Clock,
  },
  {
    id: 'success',
    number: 6,
    label: 'Selesai',
    title: 'Bukti Pembayaran',
    desc: 'Lunas & unduh resi resmi',
    icon: CheckCircle2,
  },
];

export const StageNavigator: React.FC<StageNavigatorProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentScreen);

  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs py-2.5">
      {/* 6 Stages Stepper Bar */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[560px] relative px-2">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-200 -z-0" />

          {STAGES.map((stage, idx) => {
            const isPassed = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => onSelectScreen(stage.id)}
                className={`flex flex-col items-center group cursor-pointer relative z-10 px-1.5 transition-all text-center focus:outline-hidden`}
              >
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                    isCurrent
                      ? 'bg-[#F15A24] text-white ring-4 ring-orange-100 scale-105'
                      : isPassed
                      ? 'bg-[#005E7A] text-white hover:bg-[#004a60]'
                      : 'bg-white border-2 border-slate-300 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {isPassed ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{stage.number}</span>
                  )}
                </div>

                {/* Stage Title */}
                <span
                  className={`text-[11px] mt-1.5 font-bold tracking-tight transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#F15A24]'
                      : isPassed
                      ? 'text-[#005E7A] group-hover:text-slate-900'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {stage.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
