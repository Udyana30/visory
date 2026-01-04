import React, { useMemo, useState } from 'react';
import { AvatarParameters } from '../types/domain/project';
import { QUALITY_PRESETS } from '../constants/defaults';

interface QualityPresetSelectorProps {
  currentParams: AvatarParameters;
  onSelect: (params: Partial<AvatarParameters>) => void;
  disabled?: boolean;
}

export const QualityPresetSelector: React.FC<QualityPresetSelectorProps> = ({
  currentParams,
  onSelect,
  disabled
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activePresetIndex = useMemo(() => {
    return QUALITY_PRESETS.findIndex(preset =>
      preset.params.sampleSteps === currentParams.sampleSteps &&
      preset.params.sampleShift === currentParams.sampleShift
    );
  }, [currentParams]);

  const hasCustomConfig = activePresetIndex === -1;

  return (
    <div className="flex flex-col h-full">
      {/* Fixed height scrollable area with extra padding for ring */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 min-h-0">
        {QUALITY_PRESETS.map((preset, index) => {
          const isActive = activePresetIndex === index;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={preset.badge}
              onClick={() => onSelect(preset.params)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              disabled={disabled}
              className={`flex items-center w-full p-3 rounded-lg border text-left transition-all duration-200 ${isActive
                  ? 'border-blue-500 bg-blue-50/80 shadow-md ring-1 ring-blue-200/60'
                  : isHovered
                    ? 'border-blue-400 bg-blue-50/50 shadow-sm ring-1 ring-blue-200/40'
                    : 'border-gray-100 bg-white hover:border-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Resolution Badge (Left) - Smaller */}
              <div className={`shrink-0 mr-2.5 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold transition-all ${isActive || isHovered
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                {preset.badge}
              </div>

              {/* Label & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold transition-colors ${isActive || isHovered ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                    {preset.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Configuration Notice or Placeholder - Always present to maintain height */}
      <div className="mt-2">
        {hasCustomConfig ? (
          <div className="text-center py-2 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            <span className="text-[10px] font-medium text-gray-500">Custom Configuration Active</span>
          </div>
        ) : (
          <div className="py-2 h-[42px]"></div>
        )}
      </div>
    </div>
  );
};