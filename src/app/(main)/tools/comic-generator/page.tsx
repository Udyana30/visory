'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { ComicOnboarding } from './components/ComicOnboarding';
import { ComicOverview } from './sections/ComicOverview';
import { CharacterSetup } from './sections/CharacterSetup';
import { SceneVisualization } from './sections/SceneVisualization';
import { ComicEditor } from './sections/ComicEditor';
import { Project, FormData, Character } from '@/types/comic';
import { SceneVisualization as SceneVisualizationType } from '@/types/scene';
import { 
  ART_STYLES, 
  TIMELINE_STEPS, 
  DUMMY_CHARACTERS 
} from '@/lib/comic';

export default function ComicGeneratorPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedArtStyle, setSelectedArtStyle] = useState<number | null>(null);
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  
  const [characters, setCharacters] = useState<Character[]>(DUMMY_CHARACTERS);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [scenes, setScenes] = useState<SceneVisualizationType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    comicName: '',
    genre: '',
    pageSize: '',
  });

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('comic_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('comic_onboarding_seen', 'true');
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('comic_onboarding_seen', 'true');
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

  const handleCreateCharacter = (
    characterData: Omit<Character, 'id' | 'imageUrl'>,
    files: File[]
  ) => {
    const imageUrl = files.length > 0
      ? URL.createObjectURL(files[0])
      : 'https://i.imgur.com/8pXRl5j.jpeg';

    const newCharacter: Character = {
      ...characterData,
      id: Date.now().toString(),
      imageUrl: imageUrl,
    };
    
    setCharacters(prev => [newCharacter, ...prev]);
    
    setSelectedCharacterIds(prev => {
      if (prev.length < 2) {
        return [newCharacter.id, ...prev];
      }
      return [newCharacter.id, prev[0]];
    });
  };

  const handleScenesChange = (updatedScenes: SceneVisualizationType[]) => {
    setScenes(updatedScenes);
  };

  const handleGenerateScenes = () => {
    const updatedScenes = scenes.map((scene, index) => ({
      ...scene,
      imageUrl: `/images/sample-${index + 1}.png`
    }));
    setScenes(updatedScenes);
  };

  const isComicOverviewComplete = () => {
    return !!(formData.comicName && formData.genre && formData.pageSize && selectedArtStyle !== null);
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

  const handleNextStep = () => {
    if (!isFormValid()) return;
    
    if (currentTimelineStep < TIMELINE_STEPS.length - 1) {
      setCurrentTimelineStep(prev => prev + 1);
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        name: formData.comicName,
        genre: formData.genre,
        artStyle: ART_STYLES[selectedArtStyle!].name,
        pageSize: formData.pageSize,
        createdAt: new Date()
      };
      
      setProjects([...projects, newProject]);
      setFormData({ comicName: '', genre: '', pageSize: '' });
      setSelectedArtStyle(null);
      setSelectedCharacterIds([]);
      setScenes([]);
      setCurrentTimelineStep(0);
    }
  };

  const handleTimelineStepClick = (stepIndex: number) => {
    if (stepIndex === 0 || isComicOverviewComplete()) {
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
            onInputChange={handleInputChange}
            onStyleSelect={handleStyleSelect}
            onNext={handleNextStep}
            onStepClick={handleTimelineStepClick}
            isFormValid={isFormValid()}
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
            onSelectCharacter={handleSelectCharacter}
            onCreateCharacter={handleCreateCharacter}
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
            onScenesChange={handleScenesChange}
            onGenerateScenes={handleGenerateScenes}
            onNext={handleNextStep}
            onStepClick={handleTimelineStepClick}
          />
        );
      case 3:
        return (
          <ComicEditor
            visualizations={scenes.map(scene => ({ ...scene, sceneId: scene.id }))}
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