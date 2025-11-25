import React from 'react';
import { Check } from 'lucide-react';
import { ART_STYLES } from '@/app/(main)/tools/comic-generator/lib/comic';

interface ArtStyleSelectorProps {
  selectedStyle: number | null;
  onSelectStyle: (index: number) => void;
}

export const ArtStyleSelector: React.FC<ArtStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle
}) => {
  return (
    <div className="h-full">
      <label className="block text-base font-semibold text-gray-800 mb-3">
        Art Style
      </label>
      <div className="border border-gray-300 rounded-xl p-4 bg-white">
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {ART_STYLES.map((style, index) => (
            <button
              key={style.id}
              onClick={() => onSelectStyle(index)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all group ${
                selectedStyle === index
                  ? 'border-blue-600 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <div className="aspect-square relative">
                <img
                  src={style.imageUrl}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity ${
                  selectedStyle === index ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                }`} />
                
                {selectedStyle === index && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-sm font-semibold block text-center text-white">
                    {style.name}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};