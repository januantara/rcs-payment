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
  channel = 'va',
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

  const getStep3Label = () => {
    if (channel === 'qris') return t.stepper.step3Qris;
    if (channel === 'transfer') return t.stepper.step3Transfer;
    return t.stepper.step3;
  };

  const steps = [
    { num: 1, label: t.stepper.step1, screen: 'nominal' as ScreenType },
    { num: 2, label: t.stepper.step2, screen: 'method' as ScreenType },
    { num: 3, label: getStep3Label(), screen: 'va' as ScreenType },
    { num: 4, label: t.stepper.step4, screen: 'success' as ScreenType },
  ];

  return (
    <div className={`w-full ${compact ? 'py-2 px-1' : 'py-3 px-2 sm:px-4'}`}>
      <div className="flex items-center justify-between relative max-w-xl mx-auto">
        {/* Continuous background line */}
        <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-[1px] bg-slate-200 -z-0" />

        {steps.map((step) => {
          const isCompleted = activeStep > step.num;
          const isActive = activeStep === step.num;
          const isClickable = isCompleted && onStepClick;

          return (
            <div
              key={step.num}
              onClick={() => {
                if (isClickable) onStepClick(step.screen);
              }}
              className={`flex items-center gap-1.5 bg-white px-1 py-0.5 rounded-full z-10 select-none ${
                isClickable ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-full font-bold transition-all ${
                  compact ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'
                } ${
                  isActive
                    ? 'bg-[#005E7A] text-white'
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
              <span
                className={`font-medium tracking-tight whitespace-nowrap ${
                  compact ? 'text-[9px]' : 'text-[11px] sm:text-xs'
                } ${
                  isActive
                    ? 'text-slate-900 font-bold'
                    : isCompleted
                    ? 'text-slate-600'
                    : 'text-slate-400'
                } ${compact && !isActive ? 'hidden sm:inline' : 'inline'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
