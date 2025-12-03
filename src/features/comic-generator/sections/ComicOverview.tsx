import React from 'react';
import { ProjectBasicInputs } from '../components/project/ProjectBasicInputs';
import { ProjectDescriptionInput } from '../components/project/ProjectDescriptionInput';
import { ArtStyleSelector } from '../components/project/ArtStyleSelector';
import { PageSizeSelector } from '../components/project/PageSizeSelector';
import { TimelineProgress } from '../components/TimelineProgress';
import { ProjectFormData, Project } from '../types/domain/project';

interface ComicOverviewProps {
  formData: ProjectFormData;
  onInputChange: (field: keyof ProjectFormData, value: any) => void;
  onCreateOrUpdate: () => void;
  currentProgress: number;
  currentTimelineStep: number;
  onStepClick: (stepIndex: number) => void;
  existingProject?: Project | null;
  isLoading?: boolean;
}

export const ComicOverview: React.FC<ComicOverviewProps> = ({
  formData,
  onInputChange,
  onCreateOrUpdate,
  currentProgress,
  currentTimelineStep,
  onStepClick,
  existingProject,
  isLoading
}) => {
  const isFormValid = Boolean(
    formData.name.trim() && 
    formData.genre && 
    formData.language &&
    formData.pageSizeLabel && 
    formData.artStyleIndex !== null
  );

  return (
    <div className="w-full mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 pt-6 px-10 pb-10">
          <div className="mb-6 pb-5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Comic Overview</h2>
            <p className="text-gray-500 text-base">
              Define your comic's theme, style, and layout details.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="w-full">
                <ProjectBasicInputs 
                  data={formData} 
                  onChange={onInputChange}
                  disabled={isLoading} 
                />
              </div>
              
              <div className="w-full h-full min-h-[240px]">
                <ArtStyleSelector 
                  selectedIndex={formData.artStyleIndex} 
                  onSelect={(idx) => onInputChange('artStyleIndex', idx)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="w-full">
                <ProjectDescriptionInput
                  data={formData}
                  onChange={onInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="w-full">
                <PageSizeSelector
                  selectedLabel={formData.pageSizeLabel}
                  onSelect={(label) => onInputChange('pageSizeLabel', label)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sticky top-6 self-start">
          <TimelineProgress
            currentProgress={currentProgress}
            currentTimelineStep={currentTimelineStep}
            onStepClick={onStepClick}
            isComicOverviewComplete={!!existingProject} 
          />
          
          <button
            onClick={onCreateOrUpdate}
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 text-sm ${
              isFormValid && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading 
              ? (existingProject ? 'Saving Changes...' : 'Creating Project...') 
              : (existingProject ? 'Continue Project' : 'Create Comic')
            }
          </button>
        </div>
      </div>
    </div>
  );
};