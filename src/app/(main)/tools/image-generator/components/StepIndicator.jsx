'use client';

import { Check } from 'lucide-react';

export default function StepIndicator({ 
  steps = [], 
  currentStep = 0,
  onStepClick = null 
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const canClick = onStepClick && index < currentStep;

          return (
            <div key={step.id} className="flex-1">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => canClick && onStepClick(index)}
                  disabled={!canClick}
                  className={`
                    relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-200
                    ${isCompleted 
                      ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700' 
                      : isActive 
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2' 
                      : 'bg-gray-200 text-gray-600'
                    }
                    ${canClick ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                <div className="hidden md:block">
                  <p className={`
                    text-sm font-medium transition-colors
                    ${isActive ? 'text-gray-900' : 'text-gray-600'}
                  `}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block mt-4">
                  <div className={`
                    h-1 rounded-full transition-colors duration-200
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}