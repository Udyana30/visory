import React, { useEffect } from 'react';
import { Plus, Wand2, RefreshCw } from 'lucide-react';
import { TimelineProgress } from '../components/TimelineProgress';
import { SceneCard } from '../components/scene/SceneCard';
import { SceneStats } from '../components/scene/SceneStats';
import { useScenes } from '../hooks/useScenes';
import { useReferences } from '../hooks/useReferences';

interface SceneVisualizationProps {
  projectId: number | null;
  selectedReferenceIds: string[];
  currentTimelineStep: number;
  currentProgress: number;
  onNext: () => void;
  onStepClick: (step: number) => void;
}

export const SceneVisualization: React.FC<SceneVisualizationProps> = ({
  projectId,
  selectedReferenceIds,
  currentTimelineStep,
  currentProgress,
  onNext,
  onStepClick
}) => {
  const { 
    scenes, 
    generatingIds, 
    error, 
    fetchScenes, 
    addScene, 
    updateLocalScene, 
    removeScene, 
    generateScene 
  } = useScenes(projectId);

  const { references, fetchReferences } = useReferences();

  useEffect(() => {
    if (projectId) {
      fetchScenes();
      fetchReferences(projectId);
    }
  }, [projectId, fetchScenes, fetchReferences]);

  const activeReferences = references.filter(r => selectedReferenceIds.includes(r.id));
  const isGlobalGenerating = generatingIds.size > 0;
  const hasGeneratedScenes = scenes.some(s => s.imageUrl);

  const handleGenerateAll = async () => {
    for (let i = 0; i < scenes.length; i++) {
      await generateScene(i, activeReferences);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scene Visualization</h2>
            <p className="text-gray-500 text-sm mt-1">Craft your story panels one by one.</p>
          </div>
          <button
            onClick={addScene}
            disabled={isGlobalGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:opacity-50 shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add Scene
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {scenes.map((scene, index) => (
            <SceneCard
              key={scene.id}
              index={index}
              scene={scene}
              references={activeReferences}
              isGenerating={generatingIds.has(scene.id)}
              onChange={(field, value) => updateLocalScene(index, field, value)}
              onDelete={() => removeScene(index)}
              onGenerate={() => generateScene(index, activeReferences)}
            />
          ))}
        </div>

        {scenes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">No scenes yet. Click "Add Scene" to start.</p>
          </div>
        )}
      </div>

      <div className="space-y-6 sticky top-8 self-start">
        <TimelineProgress
          currentProgress={currentProgress}
          currentTimelineStep={currentTimelineStep}
          onStepClick={onStepClick}
          isComicOverviewComplete={true}
        />

        <SceneStats 
          scenes={scenes} 
          activeReferences={activeReferences} 
        />

        <div className="space-y-3">
          <button
            onClick={handleGenerateAll}
            disabled={isGlobalGenerating || scenes.length === 0}
            className="w-full py-3 rounded-lg font-semibold transition bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isGlobalGenerating ? <RefreshCw className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
            Generate All
          </button>

          {hasGeneratedScenes && (
            <button
              onClick={onNext}
              className="w-full py-3 rounded-lg font-bold transition bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              Open Comic Editor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};