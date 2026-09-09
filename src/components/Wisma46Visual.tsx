import React from 'react';

interface Wisma46VisualProps {
  className?: string;
  variant?: 'hero' | 'footer';
}

export const Wisma46Visual: React.FC<Wisma46VisualProps> = ({
  className = 'h-36 w-full',
  variant = 'footer',
}) => {
  if (variant === 'hero') {
    return (
      <div className={`relative overflow-hidden pointer-events-none ${className}`}>
        {/* Soft atmospheric glow */}
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-sky-400/20 to-transparent" />
        
        {/* Wisma 46 Architectural Skyline Vector */}
        <svg
          viewBox="0 0 280 200"
          className="absolute right-0 bottom-0 h-full w-auto object-contain opacity-85"
          preserveAspectRatio="xMaxYMax meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="towerGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="towerShaft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="spireGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Background smaller skyline */}
          <path d="M40 200 V140 H60 V200 M65 200 V125 H90 V200 M95 200 V155 H115 V200 M120 200 V110 H145 V200" stroke="#bae6fd" strokeWidth="1" fill="#e0f2fe" opacity="0.5" />

          {/* Wisma 46 (BNI 46 Tower) Main Tower */}
          {/* Main shaft */}
          <rect x="180" y="55" width="46" height="145" rx="3" fill="url(#towerShaft)" />
          {/* Central blue glass curved curtain */}
          <rect x="186" y="60" width="34" height="140" fill="url(#towerGlass)" />
          
          {/* Glass window grid lines */}
          <line x1="186" y1="80" x2="220" y2="80" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
          <line x1="186" y1="100" x2="220" y2="100" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
          <line x1="186" y1="120" x2="220" y2="120" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
          <line x1="186" y1="140" x2="220" y2="140" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
          <line x1="186" y1="160" x2="220" y2="160" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
          <line x1="186" y1="180" x2="220" y2="180" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />
          <line x1="203" y1="60" x2="203" y2="200" stroke="#bae6fd" strokeWidth="0.8" opacity="0.6" />

          {/* Iconic Curved Sail / Fountain-pen Top of Wisma 46 */}
          <path
            d="M180 55 C180 25, 203 10, 203 5 C203 10, 226 25, 226 55 Z"
            fill="url(#towerShaft)"
          />
          <path
            d="M186 55 C186 32, 203 18, 203 10 C203 18, 220 32, 220 55 Z"
            fill="url(#towerGlass)"
          />

          {/* Spire */}
          <line x1="203" y1="5" x2="203" y2="-5" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="203" cy="-5" r="1.5" fill="#f59e0b" />

          {/* Neighboring Skyscrapers */}
          {/* Left tower */}
          <rect x="150" y="90" width="25" height="110" fill="#cbd5e1" />
          <polygon points="150,90 162.5,75 175,90" fill="#94a3b8" />
          <line x1="162.5" y1="75" x2="162.5" y2="65" stroke="#64748b" strokeWidth="1.5" />

          {/* Right tower */}
          <rect x="232" y="105" width="28" height="95" fill="#cbd5e1" />
          <rect x="235" y="110" width="22" height="90" fill="#93c5fd" opacity="0.7" />
          <polygon points="232,105 246,88 260,105" fill="#94a3b8" />

          {/* Fluffy clouds */}
          <ellipse cx="140" cy="45" rx="35" ry="12" fill="#ffffff" opacity="0.6" />
          <ellipse cx="160" cy="40" rx="25" ry="14" fill="#ffffff" opacity="0.7" />
          <ellipse cx="250" cy="55" rx="25" ry="10" fill="#ffffff" opacity="0.5" />
        </svg>
      </div>
    );
  }

  // Footer variant: warm sunset/dusk Jakarta skyline with Wisma 46 on the right
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Sky backdrop with warm sunset gradient matching the mockup */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-sky-200/50" />

      <svg
        viewBox="0 0 340 120"
        className="absolute right-0 bottom-0 h-full w-auto object-contain"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#fed7aa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="bniTowerBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="sunsetBldg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Soft dusk sun glow */}
        <circle cx="240" cy="70" r="35" fill="#fde047" opacity="0.4" filter="blur(8px)" />

        {/* Distant skyline buildings */}
        <rect x="20" y="70" width="18" height="50" fill="#94a3b8" opacity="0.5" />
        <rect x="42" y="55" width="22" height="65" fill="#64748b" opacity="0.6" />
        <polygon points="42,55 53,42 64,55" fill="#475569" opacity="0.6" />

        <rect x="70" y="65" width="24" height="55" fill="#94a3b8" opacity="0.6" />
        <rect x="100" y="48" width="26" height="72" fill="#64748b" opacity="0.7" />
        <polygon points="100,48 113,32 126,48" fill="#475569" opacity="0.7" />
        <line x1="113" y1="32" x2="113" y2="20" stroke="#475569" strokeWidth="1.5" />

        <rect x="135" y="60" width="28" height="60" fill="#94a3b8" opacity="0.7" />
        <rect x="170" y="45" width="30" height="75" fill="#475569" opacity="0.8" />
        <line x1="185" y1="45" x2="185" y2="30" stroke="#334155" strokeWidth="2" />

        <rect x="208" y="62" width="26" height="58" fill="#64748b" opacity="0.8" />

        {/* Centerpiece: Wisma 46 (BNI Skyscraper) */}
        {/* White outer frame */}
        <rect x="245" y="30" width="32" height="90" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Cyan/teal reflective glass middle */}
        <rect x="249" y="34" width="24" height="86" fill="url(#bniTowerBody)" />
        {/* Distinctive sail curve on top */}
        <path
          d="M245 30 C245 12, 261 4, 261 0 C261 4, 277 12, 277 30 Z"
          fill="#ffffff"
        />
        <path
          d="M249 30 C249 16, 261 8, 261 4 C261 8, 273 16, 273 30 Z"
          fill="url(#bniTowerBody)"
        />
        {/* Antennas / Spire */}
        <line x1="261" y1="0" x2="261" y2="-8" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
        <circle cx="261" cy="-8" r="1.5" fill="#f97316" />

        {/* Right neighbor building */}
        <rect x="282" y="50" width="26" height="70" fill="#334155" />
        <polygon points="282,50 295,35 308,50" fill="#1e293b" />
        <line x1="295" y1="35" x2="295" y2="24" stroke="#1e293b" strokeWidth="1.5" />

        <rect x="312" y="65" width="25" height="55" fill="#475569" />
      </svg>
    </div>
  );
};
