import React, { useState, useEffect } from 'react';
import { User, Mountain } from 'lucide-react';
import { CreateReferenceFormData, Reference } from '../../../../types/domain/reference';
import { CharacterGeneratorForm } from '../forms/CharacterGeneratorForm';
import { BackgroundGeneratorForm } from '../forms/BackgroundGeneratorForm';

interface Props {
  initialData?: Reference;
  onCreate: (data: CreateReferenceFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export const GenerateTab: React.FC<Props> = ({ 
  initialData, 
  onCreate, 
  onCancel, 
  loading 
}) => {
  const [type, setType] = useState<'character' | 'background'>('character');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type === 'character' ? 'character' : 'background');
    }
  }, [initialData]);

  const isEditing = !!initialData;

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-gray-100/80 rounded-xl w-fit">
        <button
          onClick={() => !isEditing && setType('character')}
          disabled={isEditing}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            type === 'character' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed'
          }`}
        >
          <User className="w-4 h-4" /> Character
        </button>
        <button
          onClick={() => !isEditing && setType('background')}
          disabled={isEditing}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            type === 'background' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed'
          }`}
        >
          <Mountain className="w-4 h-4" /> Background
        </button>
      </div>

      <div className="bg-white">
        {type === 'character' ? (
          <CharacterGeneratorForm 
            initialData={initialData}
            onSubmit={onCreate} 
            onCancel={onCancel} 
            loading={loading} 
          />
        ) : (
          <BackgroundGeneratorForm 
            initialData={initialData}
            onSubmit={onCreate} 
            onCancel={onCancel} 
            loading={loading} 
          />
        )}
      </div>
    </div>
  );
};