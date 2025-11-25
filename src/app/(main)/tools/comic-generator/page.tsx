'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ComicOnboarding } from './sections/ComicOnboarding';
import { ComicOverview } from './sections/ComicOverview';
import { CharacterSetup } from './sections/CharacterSetup';
import { SceneVisualization } from './sections/SceneVisualization';
import { ComicEditor } from './sections/ComicEditor';
import { ComicReview } from './sections/ComicReview';
import TopBar from '@/components/layout/TopBar';
import { LoadingModal } from '@/components/ui/LoadingModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { Project, FormData, Character } from '@/app/(main)/tools/comic-generator/types/comic';
import { SceneVisualization as SceneVisualizationType } from '@/app/(main)/tools/comic-generator/types/scene';
import { 
  ART_STYLES, 
  TIMELINE_STEPS, 
  DUMMY_CHARACTERS 
} from '@/app/(main)/tools/comic-generator/lib/comic';
import { useComicProject } from '@/hooks/comic/useComic';
import { useComicProjectRestore } from '@/hooks/useComicProjectRestore';
import { getPageSize, getArtStyle } from '@/app/(main)/tools/comic-generator/lib/comicUtils';
import { useVisualDirtyState } from '@/hooks/comic/useVisualDirtyState';

const ONBOARDING_KEY = 'comic_generator_onboarding_completed';

export default function ComicGeneratorPage() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedArtStyle, setSelectedArtStyle] = useState<number | null>(null);
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProjectName, setCreatedProjectName] = useState('');
  const [projectCreated, setProjectCreated] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  
  const { createProject, loading, error } = useComicProject();
  const { restoredData, isRestoring, error: restoreError, hasProjectId } = useComicProjectRestore();
  
  const [characters, setCharacters] = useState<Character[]>(DUMMY_CHARACTERS);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [scenes, setScenes] = useState<SceneVisualizationType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    comicName: '',
    genre: '',
    pageSize: '',
  });

  const { dirtyPageIds, markPageAsDirty, markPageAsClean } = useVisualDirtyState();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    setShowOnboarding(!hasCompletedOnboarding);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Comic project error:', error);
      alert(`Error: ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    if (restoreError) {
      console.error('Restore error:', restoreError);
      alert(`Restore Error: ${restoreError}`);
    }
  }, [restoreError]);

  useEffect(() => {
    if (hasProjectId && restoredData.project && !isRestoring) {
      const { project, characters: restoredChars, scenes: restoredScenes } = restoredData;

      setFormData({
        comicName: project.name,
        genre: '',
        pageSize: `${project.page_size.width}x${project.page_size.height}`,
      });

      const artStyleIndex = ART_STYLES.findIndex(
        style => style.name.toLowerCase() === project.art_style.toLowerCase()
      );
      setSelectedArtStyle(artStyleIndex !== -1 ? artStyleIndex : null);

      if (restoredChars.length > 0) {
        const transformedChars: Character[] = restoredChars.map(char => ({
          id: char.id,
          name: char.name,
          gender: char.type,
          age: 'Adult',
          style: project.art_style,
          imageUrl: char.preview_url,
          appearancePrompt: char.prompt,
          clothingPrompt: char.clothing_prompt,
          negativePrompt: char.negative_prompt,
        }));
        
        setCharacters(transformedChars);
        setSelectedCharacterIds(restoredChars.map(c => c.id));
      }

      if (restoredScenes.length > 0) {
        const transformedScenes: SceneVisualizationType[] = restoredScenes.map(scene => ({
          id: scene.id,
          prompt: scene.prompt,
          aspectRatio: scene.aspect_ratio,
          shotType: scene.shot_type,
          shotSize: scene.shot_size,
          shotAngle: scene.shot_angle,
          lighting: scene.lighting,
          mood: scene.mood,
          composition: scene.composition,
          characters: scene.character_ids,
          imageUrl: scene.image_url,
          negativePrompt: scene.negative_prompt,
        }));
        
        setScenes(transformedScenes);
      }

      setCurrentProjectId(project.id);
      setProjectCreated(true);
      setCurrentTimelineStep(0);
    }
  }, [hasProjectId, restoredData, isRestoring]);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleOnboardingSkip = () => {
    completeOnboarding();
  };

  const handleOnboardingStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStyleSelect = (index: number) => {
    setSelectedArtStyle(index);
  };
  
  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterIds(prev => {
      const isSelected = prev.includes(characterId);
      if (isSelected) {
        return prev.filter(id => id !== characterId);
      }
      if (prev.length < 2) {
        return [...prev, characterId];
      }
      return prev;
    });
  };

  const handleCharacterCreated = (character: Character) => {
    setCharacters(prev => [character, ...prev]);
    
    setSelectedCharacterIds(prev => {
      if (prev.length < 2) {
        return [character.id, ...prev];
      }
      return [character.id, prev[0]];
    });
  };

  const handleScenesChange = (updatedScenes: SceneVisualizationType[]) => {
    setScenes(updatedScenes);
  };

  const isComicOverviewComplete = () => {
    return !!(formData.comicName && formData.pageSize && selectedArtStyle !== null);
  };

  const isFormValid = () => {
    switch(currentTimelineStep) {
      case 0:
        return isComicOverviewComplete();
      case 1:
        return selectedCharacterIds.length > 0;
      case 2:
        return scenes.length > 0;
      default:
        return false;
    }
  };

  const handleCreateComic = async () => {
    if (!isFormValid()) return;
    
    setIsCreatingProject(true);
    
    const pageSize = getPageSize(formData.pageSize);
    const artStyle = getArtStyle(ART_STYLES[selectedArtStyle!].name);
    
    const projectData = {
      name: formData.comicName,
      page_size: pageSize,
      art_style: artStyle,
    };
    
    const response = await createProject(projectData);
    
    if (response) {
      const newProject: Project = {
        id: response.id.toString(),
        name: response.name,
        genre: formData.genre,
        artStyle: ART_STYLES[selectedArtStyle!].name,
        pageSize: formData.pageSize,
        createdAt: new Date(response.created_at)
      };
      
      setProjects([...projects, newProject]);
      setCreatedProjectName(response.name);
      setCurrentProjectId(response.id);
      setIsCreatingProject(false);
      setProjectCreated(true);
      setShowSuccessModal(true);
    } else {
      setIsCreatingProject(false);
    }
  };

  const handleNextStep = () => {
    if (!isFormValid() && currentTimelineStep < 3) return;
    
    if (currentTimelineStep < TIMELINE_STEPS.length - 1) {
      setCurrentTimelineStep(prev => prev + 1);
    } else {
      setFormData({ comicName: '', genre: '', pageSize: '' });
      setSelectedArtStyle(null);
      setSelectedCharacterIds([]);
      setScenes([]);
      setCurrentTimelineStep(0);
      setProjectCreated(false);
      setCurrentProjectId(null);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCurrentTimelineStep(prev => prev + 1);
  };

  const handleTimelineStepClick = (stepIndex: number) => {
    if (stepIndex === 0 || projectCreated) {
      setCurrentTimelineStep(stepIndex);
    }
  };

  const mappedVisualizations = useMemo(() => {
    return scenes.map(scene => ({ ...scene, sceneId: scene.id }));
  }, [scenes]);

  if (showOnboarding === null || isRestoring) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          {isRestoring && <p className="text-gray-600">Loading project...</p>}
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <ComicOnboarding
        currentStep={currentStep}
        onNext={handleOnboardingNext}
        onSkip={handleOnboardingSkip}
        onStepChange={handleOnboardingStepChange}
      />
    );
  }

  const selectedCharacters = characters.filter(c => 
    selectedCharacterIds.includes(c.id)
  );
  
  const renderCurrentSection = () => {
    switch(currentTimelineStep) {
      case 0:
        return (
          <ComicOverview
            formData={formData}
            selectedArtStyle={selectedArtStyle}
            currentProgress={(currentTimelineStep / (TIMELINE_STEPS.length - 1)) * 100}
            currentTimelineStep={currentTimelineStep}
            projectCreated={projectCreated}
            onInputChange={handleInputChange}
            onStyleSelect={handleStyleSelect}
            onCreate={handleCreateComic}
            onStepClick={handleTimelineStepClick}
            isFormValid={isFormValid()}
            isLoading={loading || isCreatingProject}
          />
        );
      case 1:
        return (
          <CharacterSetup
            characters={characters}
            selectedCharacterIds={selectedCharacterIds}
            selectedCharacters={selectedCharacters}
            currentTimelineStep={currentTimelineStep}
            isFormValid={isFormValid()}
            projectId={currentProjectId}
            onSelectCharacter={handleSelectCharacter}
            onCharacterCreated={handleCharacterCreated}
            onNext={handleNextStep}
            onStepClick={handleTimelineStepClick}
          />
        );
      case 2:
        return (
          <SceneVisualization
            selectedCharacters={selectedCharacters}
            currentTimelineStep={currentTimelineStep}
            scenes={scenes}
            projectId={currentProjectId}
            onScenesChange={handleScenesChange}
            onNext={handleNextStep}
            onStepClick={handleTimelineStepClick}
          />
        );
      case 3:
        return (
          <ComicEditor
            visualizations={mappedVisualizations}
            projectId={currentProjectId}
            onBack={() => setCurrentTimelineStep(2)}
            onNext={handleNextStep}
            projectName={formData.comicName}
            onPageModified={markPageAsDirty}
          />
        );
      case 4:
        return (
          <ComicReview
            projectId={currentProjectId}
            projectName={formData.comicName}
            onBack={() => setCurrentTimelineStep(3)}
            currentTimelineStep={currentTimelineStep}
            onStepClick={handleTimelineStepClick}
            dirtyPageIds={dirtyPageIds}
            onPreviewGenerated={markPageAsClean}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingModal 
        isOpen={isCreatingProject} 
        message="Creating your comic..."
      />
      
      <SuccessModal
        isOpen={showSuccessModal}
        projectName={createdProjectName}
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
}