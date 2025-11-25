import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/app/(main)/tools/comic-generator/lib/comic';

interface ComicOnboardingProps {
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onStepChange?: (step: number) => void;
}

export const ComicOnboarding: React.FC<ComicOnboardingProps> = ({ currentStep, onNext, onSkip, onStepChange }) => {
  const stepData = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleDotClick = (index: number) => {
    if (index <= currentStep && onStepChange) {
      onStepChange(index);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-8">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    disabled={index > currentStep}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-12 bg-gray-900'
                        : index < currentStep
                        ? 'w-8 bg-gray-400 hover:bg-gray-500 cursor-pointer'
                        : 'w-8 bg-gray-200 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {stepData.title}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {stepData.description}
              </p>

              <div className="flex items-center gap-4">
                
                <button
                  onClick={onNext}
                  className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onSkip}
                  className="px-5 py-3 text-gray-500 hover:text-gray-700 font-medium transition"
                >
                  Skip
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={stepData.imageUrl}
                alt={stepData.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}