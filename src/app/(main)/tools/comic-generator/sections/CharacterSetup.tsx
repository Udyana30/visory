import React, { useState } from 'react';
import { TimelineProgress } from '../components/TimelineProgress';
import { CharacterCard } from '../components/character/CharacterCard';
import { CreateCharacterModal } from '../components/character/CreateCharacterModal';
import { Character } from '@/types/comic';

interface CharacterSetupProps {
  characters: Character[];
  selectedCharacterIds: string[];
  selectedCharacters: Character[];
  currentTimelineStep: number;
  isFormValid: boolean;
  onSelectCharacter: (id: string) => void;
  onCreateCharacter: (
    characterData: Omit<Character, 'id' | 'imageUrl'>,
    files: File[]
  ) => void;
  onNext: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const CharacterSetup: React.FC<CharacterSetupProps> = ({
  characters,
  selectedCharacterIds,
  selectedCharacters,
  currentTimelineStep,
  isFormValid,
  onSelectCharacter,
  onCreateCharacter,
  onNext,
  onStepClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentProgress = (currentTimelineStep / 5) * 100;

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
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              + Create Character
            </button>
          </div>

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
                Anda telah memilih:{' '}
                <span className="font-semibold text-gray-900">
                  {selectedCharacters.map(c => c.name).join(' dan ')}
                </span>
              </p>
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
        onClose={() => setIsModalOpen(false)}
        onCreate={onCreateCharacter}
      />
    </>
  );
};