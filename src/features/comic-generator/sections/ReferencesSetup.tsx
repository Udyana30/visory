import React, { useState, useEffect, useMemo } from 'react';
import { TimelineProgress } from '../components/TimelineProgress';
import { CreateReferenceModal } from '../components/reference/modal/CreateReferenceModal';
import { ReferenceGrid } from '../components/reference/ReferenceGrid';
import { useReferences } from '../hooks/useReferences';
import { CreateReferenceFormData } from '../types/domain/reference';
import { ReferenceType } from '../types/api/reference';

interface ReferencesSetupProps {
  projectId: number | null;
  selectedReferenceIds: string[];
  currentTimelineStep: number;
  currentProgress: number;
  onSelectReference: (id: string) => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const ReferencesSetup: React.FC<ReferencesSetupProps> = ({
  projectId,
  selectedReferenceIds,
  currentTimelineStep,
  currentProgress,
  onSelectReference,
  onNext,
  onStepClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    references, 
    loading, 
    error, 
    fetchReferences, 
    createReference, 
    uploadReference 
  } = useReferences();

  useEffect(() => {
    if (projectId) {
      fetchReferences(projectId);
    }
  }, [projectId, fetchReferences]);

  const handleCreate = async (data: CreateReferenceFormData) => {
    if (!projectId) return;
    const result = await createReference(projectId, data);
    if (result) {
      setIsModalOpen(false);
      onSelectReference(result.id);
    }
  };

  const handleUpload = async (file: File, type: ReferenceType) => {
    if (!projectId) return;
    const result = await uploadReference(projectId, file, type);
    if (result) {
      setIsModalOpen(false);
      onSelectReference(result.id);
    }
  };

  const characters = useMemo(() => 
    references.filter(r => r.type === 'character'), 
  [references]);

  const backgrounds = useMemo(() => 
    references.filter(r => r.type === 'background'), 
  [references]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8 space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">References Setup</h2>
            <p className="text-gray-600 mt-1">
              Define your visual assets. These references will be used by the AI to maintain consistency across your comic scenes.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <ReferenceGrid
            title="Characters"
            description="Cast members for your story (AI Generated or Custom Uploads)."
            items={characters}
            selectedIds={selectedReferenceIds}
            onSelect={onSelectReference}
            onAdd={() => setIsModalOpen(true)}
            isLoading={loading}
            emptyMessage="No characters added yet. Create one to start!"
          />

          <div className="border-t border-gray-100" />

          <ReferenceGrid
            title="Backgrounds"
            description="Locations and environments where your story takes place."
            items={backgrounds}
            selectedIds={selectedReferenceIds}
            onSelect={onSelectReference}
            onAdd={() => setIsModalOpen(true)}
            isLoading={loading}
            emptyMessage="No backgrounds added yet. Define your world!"
          />
        </div>

        <div className="space-y-4 sticky top-8 self-start">
          <TimelineProgress
            currentProgress={currentProgress}
            currentTimelineStep={currentTimelineStep}
            onStepClick={onStepClick}
            isComicOverviewComplete={true}
          />
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Selection Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Characters</span>
                <span className="font-medium text-blue-600">
                  {selectedReferenceIds.filter(id => characters.some(c => c.id === id)).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Backgrounds</span>
                <span className="font-medium text-green-600">
                  {selectedReferenceIds.filter(id => backgrounds.some(b => b.id === id)).length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={selectedReferenceIds.length === 0}
            className={`w-full py-3 rounded-lg font-medium transition ${
              selectedReferenceIds.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next Step
          </button>
        </div>
      </div>

      <CreateReferenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        onUpload={handleUpload}
        loading={loading}
      />
    </>
  );
};