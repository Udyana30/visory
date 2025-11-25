import React, { useState } from 'react';
import { ProjectForm } from '../components/project/ProjectForm';
import { ArtStyleSelector } from '../components/project/ArtStyleSelector';
import { TimelineProgress } from '../components/TimelineProgress';
import { useCreateProject } from '../hooks/useCreateProject';
import { ProjectFormData, Project } from '../types/domain/project';

interface ComicOverviewProps {
  onProjectCreated: (project: Project) => void;
  currentProgress: number;
  currentTimelineStep: number;
  onStepClick: (stepIndex: number) => void;
  existingProject?: Project | null;
}

export const ComicOverview: React.FC<ComicOverviewProps> = ({
  onProjectCreated,
  currentProgress,
  currentTimelineStep,
  onStepClick,
  existingProject
}) => {
  const { createProject, loading, error } = useCreateProject();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: existingProject?.name || '',
    genre: existingProject?.genre || '',
    pageSizeLabel: '', 
    artStyleIndex: null
  });

  const isFormValid = Boolean(
    formData.name.trim() && 
    formData.genre && 
    formData.pageSizeLabel && 
    formData.artStyleIndex !== null
  );

  const handleCreate = async () => {
    if (!isFormValid) return;
    const project = await createProject(formData);
    if (project) {
      onProjectCreated(project);
    }
  };

  const updateField = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm py-10 px-10 sticky top-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Comic Overview</h2>
            <p className="text-gray-700">
              Define your comic's theme, style, and layout before bringing your characters to life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ProjectForm 
              data={formData} 
              onChange={updateField}
              disabled={!!existingProject || loading} 
            />
            <ArtStyleSelector 
              selectedIndex={formData.artStyleIndex} 
              onSelect={(idx) => updateField('artStyleIndex', idx)}
              disabled={!!existingProject || loading}
            />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 sticky top-8 self-start">
        <TimelineProgress
          currentProgress={currentProgress}
          currentTimelineStep={currentTimelineStep}
          onStepClick={onStepClick}
          isComicOverviewComplete={!!existingProject} 
        />
        
        {!existingProject && (
          <button
            onClick={handleCreate}
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              isFormValid && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Creating Project...' : 'Create Comic'}
          </button>
        )}
      </div>
    </div>
  );
};