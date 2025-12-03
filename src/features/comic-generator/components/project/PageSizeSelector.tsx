import React, { useState, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { PAGE_SIZE_DETAILS } from '../../constants/project';

interface PageSizeSelectorProps {
  selectedLabel: string;
  onSelect: (label: string) => void;
  disabled?: boolean;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ 
  selectedLabel, 
  onSelect, 
  disabled 
}) => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        Page Size
      </label>
      
      <div className="relative flex-1 border border-gray-200 rounded-xl p-3 bg-white h-[140px] flex items-center overflow-hidden">
        <div 
          className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 w-full h-full items-center"
          onScroll={() => setShowScrollHint(false)}
        >
          {PAGE_SIZE_DETAILS.map((size) => {
            const isSelected = selectedLabel === size.label;
            const Icon = size.icon;
            
            return (
              <button
                key={size.label}
                onClick={() => !disabled && onSelect(size.label)}
                disabled={disabled}
                className={`group relative flex-shrink-0 w-[110px] h-[100px] rounded-lg border-2 transition-all overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 text-blue-600 z-10 transition-opacity duration-200 group-hover:opacity-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 transition-all duration-300 group-hover:opacity-0 scale-100 group-hover:scale-90">
                  <div className={`p-2 rounded-full mb-2 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 shadow-sm'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                    {size.label}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white font-bold text-sm tracking-wide">
                    {size.dimensions}
                  </span>
                  <span className="text-gray-300 text-[10px] mt-1">
                    Dimensions
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div 
          className={`absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none flex items-center justify-end pr-2 transition-opacity duration-1000 ${
            showScrollHint ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-white/80 p-1 rounded-full backdrop-blur-sm animate-pulse shadow-sm border border-gray-100">
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};