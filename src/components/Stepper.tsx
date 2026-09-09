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
  onStepClick,
  compact = false,
}) => {
  const { t } = useLanguage();

  let activeStep = forcedStep || 1;
  if (!forcedStep && currentScreen) {
    if (currentScreen === 'nominal') activeStep = 1;
    else if (currentScreen === 'method') activeStep = 2;
    else if (currentScreen === 'va' || currentScreen === 'waiting') activeStep = 3;
    else if (currentScreen === 'success') activeStep = 4;
  }

  const steps = [
    { num: 1, label: t.stepper.step1, screen: 'nominal' as ScreenType },
    { num: 2, label: t.stepper.step2, screen: 'method' as ScreenType },
    { num: 3, label: t.stepper.step3, screen: 'va' as ScreenType },
    { num: 4, label: t.stepper.step4, screen: 'success' as ScreenType },
  ];

  return (
    <div className={`w-full ${compact ? 'py-3 px-2' : 'py-4.5 sm:py-5 px-3 sm:px-6'}`}>
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = activeStep > step.num;
          const isActive = activeStep === step.num;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.num}>
              {/* Step Item (no pill wrapper, clean layout with static pulse ring on active indicator) */}
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
                  } ${compact && !isActive ? 'hidden sm:inline' : 'inline'}`}
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
