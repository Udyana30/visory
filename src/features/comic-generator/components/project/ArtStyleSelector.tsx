import React from 'react';
import { Check } from 'lucide-react';
import { ART_STYLES } from '../../constants/project';

interface ArtStyleSelectorProps {
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export const ArtStyleSelector: React.FC<ArtStyleSelectorProps> = ({ 
  selectedIndex, 
  onSelect,
  disabled 
}) => {
  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        Art Style
      </label>
      
      <div className="relative flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden min-h-[200px]">
        <div className="absolute inset-0 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-3 gap-4">
            {ART_STYLES.map((style, index) => (
              <button
                key={style.id}
                onClick={() => !disabled && onSelect(index)}
                disabled={disabled}
                className={`relative group w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  selectedIndex === index
                    ? 'border-blue-600 shadow-md ring-1 ring-blue-600'
                    : 'border-transparent hover:border-gray-300'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <img
                  src={style.imageUrl}
                  alt={style.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent transition-opacity duration-300 ${
                  selectedIndex === index ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                }`} />
                
                {selectedIndex === index && (
                  <div className="absolute top-2 right-2 z-20 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                  <span className="text-xs font-bold block text-center text-white tracking-wide drop-shadow-sm truncate">
                    {style.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};