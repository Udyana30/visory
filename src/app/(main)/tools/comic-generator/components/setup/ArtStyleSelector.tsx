import React from 'react';
import { ART_STYLES } from '@/lib/comic';

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
      <div className="border-1 border-gray-700 rounded-xl p-4 bg-white h-[calc(100%-2rem)]">
        <div className="grid grid-cols-3 gap-3 h-full">
          {ART_STYLES.map((style, index) => (
            <button
              key={style.id}
              onClick={() => onSelectStyle(index)}
              className={`rounded-xl border-1 transition flex flex-col items-center justify-center p-3 ${
                selectedStyle === index
                  ? 'border-gray-900 bg-gray-400'
                  : 'border-transparent bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <span className="text-3xl mb-1">{style.preview}</span>
              <span className="text-xs font-medium text-gray-900">{style.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};