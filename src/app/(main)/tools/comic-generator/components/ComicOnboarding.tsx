import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/lib/comic';

interface ComicOnboardingProps {
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
}

export const ComicOnboarding: React.FC<ComicOnboardingProps> = ({
  currentStep,
  onNext,
  onSkip
}) => {
  const stepData = ONBOARDING_STEPS[currentStep];
  const StepIcon = stepData.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <StepIcon className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-2">
              {stepData.title}
            </h1>
            <div className="flex justify-center gap-2 mt-6">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-12">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">{stepData.image}</div>
              <p className="text-xl text-gray-600 leading-relaxed">
                {stepData.description}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Skip
              </button>
              <button
                onClick={onNext}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};