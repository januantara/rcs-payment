import React from 'react';
import bniLogo from '../assets/icons/bni.png';
import bcaLogo from '../assets/icons/bca.png';
import mandiriLogo from '../assets/icons/mandiri.png';
import briLogo from '../assets/icons/bri.png';

export { bniLogo, bcaLogo, mandiriLogo, briLogo };

export const bankLogos: Record<string, string> = {
  bni: bniLogo,
  bca: bcaLogo,
  mandiri: mandiriLogo,
  bri: briLogo,
};

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
      <img
        src={bniLogo}
        alt="BNI"
        className="h-full w-auto object-contain"
      />
      {withTagline && (
        <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 whitespace-nowrap">
          Melayani Negeri, Kebanggaan Bangsa
        </span>
      )}
    </div>
  );
};

export const BankBadge: React.FC<BankLogoProps> = ({ bankId, className = 'h-6' }) => {
  const id = bankId.toLowerCase();
  const logo = bankLogos[id];
  if (logo) {
    // Optical scale adjustment: BCA and Mandiri have finer strokes/typography
    const scaleClass =
      id === 'bca'
        ? 'scale-115'
        : id === 'mandiri'
        ? 'scale-120'
        : '';

    return (
      <img
        src={logo}
        alt={`Logo ${bankId.toUpperCase()}`}
        className={`object-contain transition-transform ${scaleClass} ${className}`}
      />
    );
  }

  return (
    <span className={`font-semibold text-slate-700 ${className}`}>
      {bankId.toUpperCase()}
    </span>
  );
};

