import React, { useState } from 'react';
import { TimelineProgress } from '../components/TimelineProgress';
import { CharacterCard } from '../components/character/CharacterCard';
import { CreateCharacterModal } from '../components/character/CreateCharacterModal';
import { Character } from '@/types/comic';
import { useComicProject } from '@/hooks/useComic';

interface CharacterSetupProps {
  characters: Character[];
  selectedCharacterIds: string[];
  selectedCharacters: Character[];
  currentTimelineStep: number;
  isFormValid: boolean;
  projectId: number | null;
  onSelectCharacter: (id: string) => void;
  onCharacterCreated: (character: Character) => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const CharacterSetup: React.FC<CharacterSetupProps> = ({
  characters,
  selectedCharacterIds,
  selectedCharacters,
  currentTimelineStep,
  isFormValid,
  projectId,
  onSelectCharacter,
  onCharacterCreated,
  onNext,
  onStepClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createCharacter, loading, error } = useComicProject();
  
  const currentProgress = (currentTimelineStep / 5) * 100;

  const handleCreateCharacter = async (characterData: {
    name: string;
    prompt: string;
    clothingPrompt: string;
    negativePrompt: string;
  }) => {
    if (!projectId) {
      alert('Project ID is required to create character');
      return;
    }

    const response = await createCharacter({
      name: characterData.name,
      type: 'character',
      project_id: projectId,
      prompt: characterData.prompt,
      clothing_prompt: characterData.clothingPrompt,
      negative_prompt: characterData.negativePrompt
    });

    if (response) {
      const newCharacter: Character = {
        id: response.id.toString(),
        name: response.name,
        gender: '',
        age: '',
        style: '',
        imageUrl: response.preview_url,
        appearancePrompt: response.prompt,
        clothingPrompt: response.clothing_prompt,
        negativePrompt: response.negative_prompt,
        llmDescription: response.llm_description
      };
      
      onCharacterCreated(newCharacter);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Character Setup</h2>
              <p className="text-gray-600 mt-1">Choose your character or define your own (Max 2).</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!projectId || loading}
            >
              + Create Character
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {characters.map(character => (
              <CharacterCard
                key={character.id}
                name={character.name}
                imageUrl={character.imageUrl}
                isSelected={selectedCharacterIds.includes(character.id)}
                onSelect={() => onSelectCharacter(character.id)}
              />
            ))}
          </div>

          {selectedCharacters.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                You have selected:{' '}
                <span className="font-semibold text-gray-900">
                  {selectedCharacters.map(c => c.name).join(' and ')}
                </span>
              </p>
              
              {selectedCharacters.some(c => c.llmDescription) && (
                <div className="mt-4 space-y-3">
                  {selectedCharacters.filter(c => c.llmDescription).map(character => (
                    <div key={character.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{character.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{character.llmDescription}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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

      <CreateCharacterModal
        isOpen={isModalOpen}
        projectId={projectId}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCharacter}
        loading={loading}
      />
    </>
  );
};