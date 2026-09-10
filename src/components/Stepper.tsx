import React from 'react';
import { Check } from 'lucide-react';
import { ScreenType, PaymentChannel } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface StepperProps {
  currentScreen?: ScreenType;
  currentStep?: 1 | 2 | 3 | 4;
  channel?: PaymentChannel;
  onStepClick?: (targetScreen: ScreenType) => void;
  compact?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  currentScreen,
  currentStep: forcedStep,
  channel,
  onStepClick,
  compact = false,
}) => {
  const { t, language } = useLanguage();

  let activeStep = forcedStep || 1;
  if (!forcedStep && currentScreen) {
    if (currentScreen === 'nominal') activeStep = 1;
    else if (currentScreen === 'method') activeStep = 2;
    else if (currentScreen === 'va' || currentScreen === 'waiting') activeStep = 3;
    else if (currentScreen === 'success') activeStep = 4;
  }

  // Dynamic step 3 label based on channel
  const getStep3Label = () => {
    if (channel === 'qris') return t.stepper.step3Qris;
    if (channel === 'transfer') return t.stepper.step3Transfer;
    return t.stepper.step3;
  };

  const getStep3ShortLabel = () => {
    if (channel === 'qris') return 'QRIS';
    if (channel === 'transfer') return 'Transfer';
    return language === 'EN' ? 'Pay' : 'Bayar';
  };

  const steps = [
    {
      num: 1,
      label: t.stepper.step1,
      shortLabel: language === 'EN' ? 'Amount' : 'Nominal',
      screen: 'nominal' as ScreenType,
    },
    {
      num: 2,
      label: t.stepper.step2,
      shortLabel: language === 'EN' ? 'Method' : 'Metode',
      screen: 'method' as ScreenType,
    },
    {
      num: 3,
      label: getStep3Label(),
      shortLabel: getStep3ShortLabel(),
      screen: 'va' as ScreenType,
    },
    {
      num: 4,
      label: t.stepper.step4,
      shortLabel: language === 'EN' ? 'Receipt' : 'Selesai',
      screen: 'success' as ScreenType,
    },
  ];

  return (
    <div className={`w-full ${compact ? 'py-2 px-2' : 'py-3 sm:py-4 px-1 sm:px-4'}`}>
      {/* Mobile Stepper View (< sm): Each step is a centered column so circle and label are 100% aligned */}
      <div className="sm:hidden flex items-start justify-between w-full px-0.5">
        {steps.map((step, idx) => {
          const isCompleted = activeStep > step.num;
          const isActive = activeStep === step.num;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.num}>
              {/* Step Column: Circle on top, Text on bottom - perfectly centered */}
              <div
                onClick={() => {
                  if (isClickable) onStepClick(step.screen);
                }}
                className={`flex flex-col items-center w-14 select-none shrink-0 ${
                  isClickable ? 'cursor-pointer' : ''
                } ${!isActive && !isCompleted ? 'opacity-45' : 'opacity-100'}`}
                title={isClickable ? `${language === 'EN' ? 'Back to' : 'Kembali ke'} ${step.label}` : undefined}
              >
                {/* Circle Icon */}
                <div className="relative flex items-center justify-center shrink-0">
                  {isActive && (
                    <span className="absolute -inset-1 rounded-full bg-[#005E7A]/20 pointer-events-none animate-pulse" />
                  )}
                  <div
                    className={`relative flex items-center justify-center rounded-full font-bold transition-all w-6 h-6 text-[11px] ${
                      isActive
                        ? 'bg-[#005E7A] text-white shadow-xs ring-2 ring-[#005E7A]/20'
                        : isCompleted
                        ? 'bg-[#005E7A] text-white'
                        : 'border border-slate-300 text-slate-400 bg-white'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                  </div>
                </div>

                {/* Label Centered Perfectly Under Circle */}
                <span
                  className={`text-[10px] font-semibold tracking-tight text-center leading-tight whitespace-nowrap mt-1.5 ${
                    isActive
                      ? 'text-[#005E7A] font-bold'
                      : isCompleted
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Connecting Line Centered at Circle's vertical midpoint (12px) */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mt-[11px] mx-1 bg-slate-200/90 relative overflow-hidden rounded-full">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      activeStep > step.num ? 'bg-[#005E7A]' : 'bg-transparent'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Desktop / Tablet Stepper View (sm:flex): Classic horizontal layout with full labels */}
      <div className="hidden sm:flex items-center justify-between max-w-xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = activeStep > step.num;
          const isActive = activeStep === step.num;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.num}>
              {/* Step Item */}
              <div
                onClick={() => {
                  if (isClickable) onStepClick(step.screen);
                }}
                className={`flex items-center gap-2.5 sm:gap-3 transition-all duration-200 select-none ${
                  isClickable ? 'cursor-pointer hover:opacity-80' : ''
                } ${!isActive && !isCompleted ? 'opacity-40' : 'opacity-100'}`}
              >
                {/* Circle Icon with Static Pulse Halo Overlay */}
                <div className="relative flex items-center justify-center shrink-0">
                  {isActive && (
                    <span className="absolute -inset-1 sm:-inset-1.5 rounded-full bg-[#005E7A]/20 pointer-events-none" />
                  )}
                  <div
                    className={`relative flex items-center justify-center rounded-full font-bold transition-all ${
                      compact ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 sm:w-6.5 sm:h-6.5 text-[11px] sm:text-xs'
                    } ${
                      isActive
                        ? 'bg-[#005E7A] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-[#005E7A] text-white'
                        : 'border border-slate-300 text-slate-400 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className={compact ? 'w-3 h-3 stroke-[3]' : 'w-3.5 h-3.5 stroke-[3]'} />
                    ) : (
                      step.num
                    )}
                  </div>
                </div>

                {/* Step Label */}
                <span
                  className={`font-semibold tracking-tight whitespace-nowrap ${
                    compact ? 'text-[9px]' : 'text-xs sm:text-[13px]'
                  } ${
                    isActive
                      ? 'text-[#005E7A] font-bold'
                      : isCompleted
                      ? 'text-slate-700 font-semibold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div className="flex-1 min-w-3 sm:min-w-6 h-[1.5px] mx-2 sm:mx-3 bg-slate-200/90 relative overflow-hidden rounded-full">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      activeStep > step.num ? 'bg-[#005E7A]' : 'bg-transparent'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
