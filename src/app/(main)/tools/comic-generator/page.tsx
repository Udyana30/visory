'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { ComicOnboarding } from './components/ComicOnboarding';
import { ComicOverview } from './sections/ComicOverview';
import { CharacterSetup } from './sections/CharacterSetup';
import { SceneVisualization } from './sections/SceneVisualization';
import { ComicEditor } from './sections/ComicEditor';
import { LoadingModal } from '@/components/ui/LoadingModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { Project, FormData, Character } from '@/types/comic';
import { SceneVisualization as SceneVisualizationType } from '@/types/scene';
import { 
  ART_STYLES, 
  TIMELINE_STEPS, 
  DUMMY_CHARACTERS 
} from '@/lib/comic';
import { useComicProject } from '@/hooks/useComic';
import { getPageSize, getArtStyle } from '@/lib/comicUtils';

export default function ComicGeneratorPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
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
  
  const [characters, setCharacters] = useState<Character[]>(DUMMY_CHARACTERS);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [scenes, setScenes] = useState<SceneVisualizationType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    comicName: '',
    genre: '',
    pageSize: '',
  });

  useEffect(() => {
    const hasSeenOnboarding = typeof window !== 'undefined' 
      ? localStorage.getItem('comic_onboarding_seen')
      : null;
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error.message}`);
    }
  }, [error]);

  const handleOnboardingNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowOnboarding(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('comic_onboarding_seen', 'true');
      }
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('comic_onboarding_seen', 'true');
    }
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
    if (!isFormValid()) return;
    
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

  if (showOnboarding) {
    return (
      <ComicOnboarding
        currentStep={currentStep}
        onNext={handleOnboardingNext}
        onSkip={handleOnboardingSkip}
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
            visualizations={scenes.map(scene => ({ ...scene, sceneId: scene.id }))}
            projectId={currentProjectId}
            onBack={() => setCurrentTimelineStep(2)}
            onNext={handleNextStep}
          />
        );
      default:
        return <p>Section not implemented yet.</p>;
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="hidden md:block mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap">
                Comic Generator
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
              <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <User size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:hidden mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Comic Generator
            </h1>
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="p-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <User size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Turn your ideas into visuals. From lifelike scenes to creative comic art, make anything you imagine.
          </p>
        </div>

        {renderCurrentSection()}
      </div>
    </div>
  );
}