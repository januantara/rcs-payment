import React from 'react';

interface BankLogoProps {
  bankId: string;
  className?: string;
}

export const BniLogo: React.FC<{ className?: string; withTagline?: boolean }> = ({
  className = 'h-8',
  withTagline = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official BNI 46 stylised mark */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-[#F15A24] text-white shadow-xs">
        <svg viewBox="0 0 40 40" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6h15a9 9 0 0 1 7 14.7A9.5 9.5 0 0 1 33 34H7V6zm9 6v6h5a3 3 0 0 0 0-6h-5zm0 10v6h6a3 3 0 0 0 0-6h-6z" fillOpacity="0.15" />
          {/* Stylized 46 ribbon */}
          <path d="M11 26l7-14h5l-7 14h-5zm7 0h12v-4h-8l3-6h-4l-3 10z" fill="#ffffff" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold tracking-tight text-2xl text-[#005E7A] leading-none">BNI</span>
        </div>
        {withTagline && (
          <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 whitespace-nowrap">
            Melayani Negeri, Kebanggaan Bangsa
          </span>
        )}
      </div>
    </div>
  );
};

export const BankBadge: React.FC<BankLogoProps> = ({ bankId, className = 'h-6' }) => {
  switch (bankId) {
    case 'bni':
      return (
        <div className={`flex items-center gap-1.5 font-bold ${className}`}>
          <div className="w-4 h-4 rounded-xs bg-[#F15A24] flex items-center justify-center text-[9px] text-white font-black">
            46
          </div>
          <span className="text-[#005E7A] font-extrabold tracking-tight text-base">BNI</span>
        </div>
      );
    case 'bca':
      return (
        <div className={`flex items-center gap-1 font-bold ${className}`}>
          <div className="w-4 h-4 rounded-full bg-[#0060AF] flex items-center justify-center text-[9px] text-white font-black">
            &bull;
          </div>
          <span className="text-[#0060AF] font-black tracking-wider text-base">BCA</span>
        </div>
      );
    case 'mandiri':
      return (
        <div className={`flex items-center gap-1 font-bold ${className}`}>
          <span className="text-[#003366] font-extrabold tracking-tight text-sm lowercase">mandirı</span>
          <span className="text-[#F5A623] text-sm -ml-0.5">&#10047;</span>
        </div>
      );
    case 'bri':
      return (
        <div className={`flex items-center gap-1 font-bold ${className}`}>
          <span className="text-[#00529C] font-black tracking-widest text-base">BRI</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#F37023]" />
        </div>
      );
    default:
      return (
        <span className={`font-semibold text-slate-700 ${className}`}>
          {bankId.toUpperCase()}
        </span>
      );
  }
};
