import React from 'react';
import { ScreenType } from '../types';

interface ScreenSwitcherProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const screens: { id: ScreenType; num: number; label: string }[] = [
    { id: 'landing', num: 1, label: '1. Informasi Tagihan' },
    { id: 'nominal', num: 2, label: '2. Pilih Nominal' },
    { id: 'method', num: 3, label: '3. Pilih Metode' },
    { id: 'va', num: 4, label: '4. Virtual Account' },
    { id: 'waiting', num: 5, label: '5. Menunggu Bayar' },
    { id: 'success', num: 6, label: '6. Berhasil' },
  ];

  return (
    <div className="bg-slate-900 text-white py-2.5 px-4 shadow-md sticky top-16 z-30 border-b border-slate-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0 hidden sm:inline">
          Layar Mockup:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#F15A24] text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
