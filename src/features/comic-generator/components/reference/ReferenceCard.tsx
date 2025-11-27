import React from 'react';
import { User, Mountain, Sparkles, UploadCloud } from 'lucide-react';
import { Reference } from '../../types/domain/reference';

interface ReferenceCardProps {
  data: Reference;
  isSelected: boolean;
  onSelect: () => void;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  data,
  isSelected,
  onSelect
}) => {
  const TypeIcon = data.type === 'character' ? User : Mountain;
  const SourceIcon = data.isCustom ? UploadCloud : Sparkles;

  return (
    <button
      onClick={onSelect}
      className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-square text-left w-full ${
        isSelected ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-transparent hover:border-blue-300'
      }`}
    >
      <img
        src={data.imageUrl}
        alt={data.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
      
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-md flex items-center gap-1 border border-white/10">
        <SourceIcon className="w-3 h-3 text-yellow-400" />
        <span className="text-[10px] font-medium text-white uppercase tracking-wider">
          {data.isCustom ? 'Custom' : 'AI'}
        </span>
      </div>

      <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-md flex items-center gap-1 border border-white/10">
        <TypeIcon className={`w-3 h-3 ${data.type === 'character' ? 'text-blue-300' : 'text-green-300'}`} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-200' : 'text-white'}`}>
          {data.name}
        </p>
        <p className="text-[10px] text-gray-300 truncate opacity-80">
          {data.isCustom ? 'Uploaded Reference' : data.prompt}
        </p>
      </div>
    </button>
  );
};