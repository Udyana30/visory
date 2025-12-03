import React from 'react';
import { Check } from 'lucide-react';
import { Reference } from '../../../../types/domain/reference';

interface ReferenceSelectorCardProps {
  data: Reference;
  isSelected: boolean;
  onToggle: () => void;
}

export const ReferenceSelectorCard: React.FC<ReferenceSelectorCardProps> = ({
  data,
  isSelected,
  onToggle
}) => {
  const isCharacter = data.type === 'character';
  
  return (
    <div 
      onClick={onToggle}
      className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all ${
        isSelected 
          ? 'border-blue-600 ring-1 ring-blue-600' 
          : 'border-gray-200 hover:border-gray-300'
      } ${isCharacter ? 'aspect-[3/4]' : 'aspect-video'}`}
    >
      <img
        src={data.imageUrl}
        alt={data.name}
        className="w-full h-full object-cover"
      />
      
      {isSelected && (
        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-sm">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-xs font-medium text-white truncate">{data.name}</p>
      </div>
    </div>
  );
};