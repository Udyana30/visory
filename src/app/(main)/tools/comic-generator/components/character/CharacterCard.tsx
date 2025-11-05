import React from 'react';

interface CharacterCardProps {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  imageUrl,
  isSelected,
  onSelect
}) => {
  return (
    <button
      onClick={onSelect}
      className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
        isSelected ? 'border-blue-600' : 'border-transparent hover:border-blue-400'
      }`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div
        className={`absolute bottom-3 left-3 right-3 text-center py-1.5 px-2 rounded-lg transition-all duration-200 ${
          isSelected
            ? 'bg-blue-600 text-white'
            : 'bg-black/50 text-white/90 group-hover:bg-blue-500'
        }`}
      >
        <h4 className="font-semibold text-sm truncate">{name}</h4>
      </div>
    </button>
  );
};