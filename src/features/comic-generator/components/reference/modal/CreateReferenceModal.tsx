import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, User, Mountain } from 'lucide-react';
import { ReferenceType } from '../../../types/api/reference';
import { CreateReferenceFormData } from '../../../types/domain/reference';
import { CharacterGeneratorForm } from './CharacterGeneratorForm';
import { BackgroundGeneratorForm } from './BackgroundGeneratorForm';
import { ReferenceUploadForm } from './ReferenceUploadForm';

interface CreateReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateReferenceFormData) => Promise<void>;
  onUpload: (file: File, type: ReferenceType) => Promise<void>;
  loading?: boolean;
}

type ModalMode = 'character-gen' | 'background-gen' | 'upload';

export const CreateReferenceModal: React.FC<CreateReferenceModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpload,
  loading = false
}) => {
  const [mode, setMode] = useState<ModalMode>('character-gen');

  if (!isOpen) return null;

  const handleClose = () => {
    if (!loading) onClose();
  };

  const renderContent = () => {
    switch (mode) {
      case 'character-gen':
        return (
          <CharacterGeneratorForm 
            onSubmit={onCreate} 
            loading={loading} 
            onCancel={handleClose} 
          />
        );
      case 'background-gen':
        return (
          <BackgroundGeneratorForm 
            onSubmit={onCreate} 
            loading={loading} 
            onCancel={handleClose} 
          />
        );
      case 'upload':
        return (
          <ReferenceUploadForm 
            onUpload={onUpload} 
            loading={loading} 
            onCancel={handleClose} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Add Reference</h2>
          <button onClick={handleClose} disabled={loading} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap gap-3">
          <button
            onClick={() => setMode('character-gen')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition ${
              mode === 'character-gen' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4" /> AI Character
          </button>
          
          <button
            onClick={() => setMode('background-gen')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition ${
              mode === 'background-gen' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Mountain className="w-4 h-4" /> AI Background
          </button>

          <button
            onClick={() => setMode('upload')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition ${
              mode === 'upload' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Custom / Nano Banana
          </button>
        </div>

        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};