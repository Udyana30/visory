import React, { useState } from 'react';
import { User, Mountain } from 'lucide-react';
import { ReferenceType } from '../../../../types/api/reference';
import { ReferenceUploadForm } from '../forms/ReferenceUploadForm';

interface Props {
  onUpload: (file: File, type: ReferenceType) => void;
  onCancel: () => void;
  loading: boolean;
}

export const UploadTab: React.FC<Props> = ({ onUpload, onCancel, loading }) => {
  const [type, setType] = useState<ReferenceType>('character');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => setType('character')}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
            type === 'character' 
              ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
              : 'border-gray-200 hover:border-blue-200 text-gray-500'
          }`}
        >
          <div className={`p-2 rounded-full ${type === 'character' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">Character</span>
        </div>
        
        <div 
          onClick={() => setType('background')}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
            type === 'background' 
              ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
              : 'border-gray-200 hover:border-blue-200 text-gray-500'
          }`}
        >
          <div className={`p-2 rounded-full ${type === 'background' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Mountain className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">Background</span>
        </div>
      </div>

      <ReferenceUploadForm 
        onUpload={(file) => onUpload(file, type)} 
        onCancel={onCancel} 
        loading={loading}
      />
    </div>
  );
};