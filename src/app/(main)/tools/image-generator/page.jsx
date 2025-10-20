'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import ProfileDropdown from './components/ProfileDropdown';
import StepIndicator from './components/StepIndicator';
import ProjectSetup from './sections/ProjectSetup';
import { useProjectSetup } from './hooks/useProjectSetup';

const STEPS = [
  { id: 'project-setup', label: 'Project Setup', description: 'Configure your project' },
  { id: 'story-modification', label: 'Story Modification', description: 'Edit your story' },
  { id: 'generate-image', label: 'Generate Image', description: 'Create images' },
];

export default function ImageGeneratorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, errors, updateField, validateForm } = useProjectSetup();

  const handleNextStep = () => {
    if (currentStep === 0 && !validateForm()) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectSetup
            formData={formData}
            errors={errors}
            onUpdate={updateField}
          />
        );
      case 1:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Story Modification</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 2:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Image</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f5f5f5] border-b border-gray-200">
        <div className="px-8 py-4">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap">
                  Image Generator
                </h1>
                <div className="h-8 w-px bg-gray-400"></div>
                <p className="text-sm text-gray-700">
                  Turn your ideas into visuals. From lifelike scenes to <br />
                  creative comic art, make anything you imagine.
                </p>
              </div>
              <div className="flex items-center gap-3 ml-6">
                <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <ProfileDropdown />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Image Generator
              </h1>
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <ProfileDropdown />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Turn your ideas into visuals. From lifelike scenes to creative comic art, make anything you imagine.
            </p>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Step Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className={`
              px-10 py-3 rounded-lg font-medium transition-all
              ${currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400'
              }
            `}
          >
            Previous
          </button>

          <div className="text-sm text-gray-600 font-medium">
            Step {currentStep + 1} of {STEPS.length}
          </div>

          <button
            onClick={handleNextStep}
            disabled={currentStep === STEPS.length - 1}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all
              ${currentStep === STEPS.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
}