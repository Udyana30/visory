import React, { useState, useMemo, useEffect } from 'react';
import { SceneVisualization as SceneType } from '../types/domain/scene';
import { Reference } from '../types/domain/reference';
import { useScenes } from '../hooks/scene/useScenes';
import { useSceneNavigation } from '../hooks/scene/useSceneNavigation';
import { useSceneFiltering } from '../hooks/scene/useSceneFiltering';
import { SceneEditorLayout } from '../components/scene/layout/SceneEditorLayout';
import { SceneControls } from '../components/scene/navigation/SceneControls';
import { SceneFilmstrip } from '../components/scene/layout/SceneFilmstrip';
import { SceneCanvas } from '../components/scene/layout/SceneCanvas';
import { SceneConfiguration } from '../components/scene/layout/SceneConfiguration';
import { SceneContext } from '../components/scene/layout/SceneContext';
import { SceneGridView } from '../components/scene/navigation/SceneGridView';
import { ViewMode } from '../components/scene/navigation/ViewModeToggle';
import { TimelineProgress } from '../components/TimelineProgress';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface SceneVisualizationProps {
  projectId: number | null;
  references: Reference[];
  selectedReferenceIds: string[];
  currentTimelineStep: number;
  currentProgress: number;
  onNext: () => void;
  onStepClick: (step: number) => void;
}

export const SceneVisualization: React.FC<SceneVisualizationProps> = ({
  projectId,
  references,
  selectedReferenceIds,
  currentTimelineStep,
  currentProgress,
  onNext,
  onStepClick
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('generate');
  const [sceneToDelete, setSceneToDelete] = useState<number | null>(null);

  const {
    scenes,
    generatingIds,
    fetchScenes,
    addScene,
    updateLocalScene,
    removeScene,
    generateScene
  } = useScenes(projectId);

  const {
    activeSceneId,
    activeIndex,
    navigateTo
  } = useSceneNavigation(scenes);

  const {
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    filteredScenes
  } = useSceneFiltering(scenes);

  useEffect(() => {
    if (projectId) {
      fetchScenes();
    }
  }, [projectId, fetchScenes]);

  const activeReferences = useMemo(() =>
    references.filter(r => selectedReferenceIds.includes(r.id)),
    [references, selectedReferenceIds]);

  const activeScene = scenes.find(s => s.id === activeSceneId);

  const handleAddScene = () => {
    addScene();
    setTimeout(() => {
      const newIndex = scenes.length;
      const newId = scenes[newIndex]?.id;
      if (newId) navigateTo(newId);
    }, 0);
  };

  const initiateDelete = (index: number) => {
    setSceneToDelete(index);
  };

  const handleConfirmDelete = async () => {
    if (sceneToDelete !== null) {
      await removeScene(sceneToDelete);
      setSceneToDelete(null);
    }
  };

  const handleGenerate = async () => {
    if (activeIndex !== -1) {
      await generateScene(activeIndex, activeReferences);
    }
  };

  const handleUpdateScene = (field: keyof SceneType, value: any) => {
    if (activeIndex !== -1) {
      updateLocalScene(activeIndex, field, value);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden">
      <ConfirmDialog
        isOpen={sceneToDelete !== null}
        title="Delete Scene"
        description="Are you sure you want to delete this scene? This action cannot be undone and you will lose any generated images associated with it."
        confirmLabel="Delete Scene"
        onConfirm={handleConfirmDelete}
        onClose={() => setSceneToDelete(null)}
        variant="danger"
      />

      <div className="grid grid-cols-2 lg:grid-cols-[1fr_320px] h-full bg-gray-50 gap-6">

        <div className="h-full min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <SceneEditorLayout
              controls={
                <SceneControls
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterMode={filterMode}
                  onFilterChange={setFilterMode}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalScenes={scenes.length}
                />
              }
              canvas={
                <SceneCanvas
                  scene={activeScene}
                  isGenerating={activeScene ? generatingIds.has(activeScene.id) : false}
                  isFirst={activeIndex === 0}
                />
              }
              configuration={
                <SceneConfiguration
                  scene={activeScene}
                  onChange={handleUpdateScene}
                  isGenerating={activeScene ? generatingIds.has(activeScene.id) : false}
                />
              }
              context={
                <SceneContext
                  scene={activeScene}
                  references={activeReferences}
                  onChange={handleUpdateScene}
                  onGenerate={handleGenerate}
                  isGenerating={activeScene ? generatingIds.has(activeScene.id) : false}
                />
              }
              filmstrip={
                <SceneFilmstrip
                  scenes={filteredScenes}
                  activeId={activeSceneId}
                  onSelect={navigateTo}
                  onAdd={handleAddScene}
                  onDelete={initiateDelete}
                />
              }
              gridView={
                <SceneGridView
                  isOpen={viewMode === 'grid'}
                  scenes={filteredScenes}
                  activeId={activeSceneId}
                  onSelect={(id) => {
                    navigateTo(id);
                    setViewMode('generate');
                  }}
                  onClose={() => setViewMode('generate')}
                  onDelete={initiateDelete}
                />
              }
            />
          </div>
        </div>

        <div className="space-y-4 sticky self-start">
          <TimelineProgress
            currentProgress={currentProgress}
            currentTimelineStep={currentTimelineStep}
            onStepClick={onStepClick}
            isComicOverviewComplete={true}
          />
          <button
            onClick={onNext}
            disabled={selectedReferenceIds.length === 0}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${selectedReferenceIds.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Start Editing Comic
          </button>
        </div>

      </div>
    </div>
  );
};