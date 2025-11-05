import React from 'react';
import { ComicOverviewForm } from '../components/setup/ComicOverviewForm';
import { TimelineProgress } from '../components/TimelineProgress';
import { FormData } from '@/types/comic';

interface ComicOverviewProps {
  formData: FormData;
  selectedArtStyle: number | null;
  currentProgress: number;
  currentTimelineStep: number;
  onInputChange: (field: string, value: string) => void;
  onStyleSelect: (index: number) => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
  isFormValid: boolean;
}

export const ComicOverview: React.FC<ComicOverviewProps> = ({
  formData,
  selectedArtStyle,
  currentProgress,
  currentTimelineStep,
  onInputChange,
  onStyleSelect,
  onNext,
  onStepClick,
  isFormValid
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ComicOverviewForm
          formData={formData}
          selectedArtStyle={selectedArtStyle}
          onInputChange={onInputChange}
          onStyleSelect={onStyleSelect}
        />
      </div>

      <div className="space-y-4 sticky top-8 self-start">
        <TimelineProgress
          currentProgress={currentProgress}
          currentTimelineStep={currentTimelineStep}
          onStepClick={onStepClick}
          isComicOverviewComplete={true}
        />
        
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full py-3 rounded-lg font-medium transition ${
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};