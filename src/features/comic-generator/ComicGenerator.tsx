'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/layout/TopBar';
import { LoadingModal } from '@/components/ui/LoadingModal';
import { SuccessModal } from '@/components/ui/SuccessModal';

import { ComicOverview } from './sections/ComicOverview';
import { ReferencesSetup } from './sections/ReferencesSetup';
import { SceneVisualization } from './sections/SceneVisualization';
import { ComicEditor } from './sections/ComicEditor';
import { ComicReview } from './sections/ComicReview';

import { useComicProjectRestore } from './hooks/useComicProjectRestore';
import { TIMELINE_STEPS } from './constants/comic';
import { Project } from './types/domain/project';
import { SceneVisualization as SceneType } from './types/domain/scene';
import { sceneService } from './services/sceneService';

export const ComicGenerator = () => {
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<string[]>([]);
  const [scenes, setScenes] = useState<SceneType[]>([]);
  
  const [dirtyPageIds, setDirtyPageIds] = useState<Set<number>>(new Set());

  const { restoredData, isRestoring, hasProjectId } = useComicProjectRestore();
  
  useEffect(() => {
    if (hasProjectId && restoredData.project && !isRestoring) {
      setCurrentProject(restoredData.project);

      if (restoredData.references.length > 0) {
        setSelectedReferenceIds(restoredData.references.map(r => r.id));
      }

      if (restoredData.scenes.length > 0) {
        setScenes(restoredData.scenes);
      }

      setCurrentTimelineStep(0);
    }
  }, [hasProjectId, restoredData, isRestoring]);

  const refreshScenes = useCallback(async () => {
    if (!currentProject) return;
    try {
      const scenesData = await sceneService.getAll(Number(currentProject.id));
      
      const mappedScenes: SceneType[] = scenesData.map((scene) => ({
        id: String(scene.id),
        prompt: scene.prompt,
        aspectRatio: scene.aspect_ratio,
        shotType: scene.shot_type,
        shotSize: scene.shot_size,
        shotAngle: scene.shot_angle,
        lighting: scene.lighting,
        mood: scene.mood,
        composition: scene.composition,
        characters: scene.character_ids ? scene.character_ids.map(String) : [],
        imageUrl: scene.image_url,
        negativePrompt: scene.negative_prompt,
      }));

      setScenes(mappedScenes);
    } catch (error) {
      console.error(error);
    }
  }, [currentProject]);

  const handleProjectCreated = (project: Project) => {
    setCurrentProject(project);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    handleNextStep();
  };

  const handleNextStep = () => {
    if (currentTimelineStep < TIMELINE_STEPS.length - 1) {
      const nextStep = currentTimelineStep + 1;
      setCurrentTimelineStep(nextStep);
      
      if (nextStep === 3) {
        refreshScenes();
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (currentProject || stepIndex < currentTimelineStep) {
      setCurrentTimelineStep(stepIndex);
      
      if (stepIndex === 3) {
        refreshScenes();
      }
    }
  };

  const handleReferenceSelect = (id: string) => {
    setSelectedReferenceIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePageModified = useCallback((pageId: number) => {
    setDirtyPageIds(prev => {
      if (prev.has(pageId)) return prev;
      const newSet = new Set(prev);
      newSet.add(pageId);
      return newSet;
    });
  }, []);

  const handlePreviewGenerated = useCallback((pageId: number) => {
    setDirtyPageIds(prev => {
      if (!prev.has(pageId)) return prev;
      const newSet = new Set(prev);
      newSet.delete(pageId);
      return newSet;
    });
  }, []);

  const currentProgress = (currentTimelineStep / (TIMELINE_STEPS.length - 1)) * 100;

  const renderCurrentSection = () => {
    switch(currentTimelineStep) {
      case 0:
        return (
          <ComicOverview
            onProjectCreated={handleProjectCreated}
            currentProgress={currentProgress}
            currentTimelineStep={currentTimelineStep}
            onStepClick={handleStepClick}
            existingProject={currentProject}
          />
        );
      case 1:
        return (
          <ReferencesSetup
            projectId={currentProject ? Number(currentProject.id) : null}
            selectedReferenceIds={selectedReferenceIds}
            currentTimelineStep={currentTimelineStep}
            currentProgress={currentProgress}
            onSelectReference={handleReferenceSelect}
            onNext={handleNextStep}
            onStepClick={handleStepClick}
          />
        );
      case 2:
        return (
          <SceneVisualization
            projectId={currentProject ? Number(currentProject.id) : null}
            selectedReferenceIds={selectedReferenceIds}
            currentTimelineStep={currentTimelineStep}
            currentProgress={currentProgress}
            onNext={handleNextStep}
            onStepClick={handleStepClick}
          />
        );
      case 3:
        return (
          <ComicEditor
            visualizations={scenes} 
            projectId={currentProject ? Number(currentProject.id) : null}
            projectName={currentProject?.name}
            onBack={() => setCurrentTimelineStep(2)}
            onNext={handleNextStep}
            onPageModified={handlePageModified}
          />
        );
      case 4:
        return (
          <ComicReview
            projectId={currentProject ? Number(currentProject.id) : null}
            projectName={currentProject?.name}
            onBack={() => setCurrentTimelineStep(3)}
            currentTimelineStep={currentTimelineStep}
            onStepClick={handleStepClick}
            dirtyPageIds={dirtyPageIds}
            onPreviewGenerated={handlePreviewGenerated}
          />
        );
      default:
        return null;
    }
  };

  if (isRestoring) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Restoring your masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto pb-20">
      <SuccessModal 
        isOpen={showSuccessModal} 
        projectName={currentProject?.name || ''} 
        onClose={handleSuccessModalClose} 
      />

      <TopBar 
        showSearch={false}
        showUpgrade={true}
        showNotifications={true}
        pageTitle="Comic Generator"
        pageSubtitle={
          <>
            Turn your ideas into visuals. From lifelike scenes to <br />
            creative comic art, make anything you imagine.
          </>
        }
      />

     <div className="px-15 mx-auto">
        {renderCurrentSection()}
      </div>
    </div>
  );
};