import React, { useMemo } from 'react';
import { Zap, Gauge } from 'lucide-react';
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
  const activePresetIndex = useMemo(() => {
    return QUALITY_PRESETS.findIndex(preset => 
      preset.params.sampleSteps === currentParams.sampleSteps &&
      preset.params.sampleShift === currentParams.sampleShift
    );
  }, [currentParams]);

  return (
    <div className="flex flex-col h-full gap-2 overflow-y-auto custom-scrollbar pr-1">
      {QUALITY_PRESETS.map((preset, index) => {
        const isActive = activePresetIndex === index;
        return (
          <button
            key={preset.badge}
            onClick={() => onSelect(preset.params)}
            disabled={disabled}
            className={`flex items-center w-full p-3 rounded-lg border text-left transition-all duration-200 ${
              isActive
                ? 'border-blue-500 bg-blue-50/80 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`shrink-0 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
              {index >= 2 ? <Zap className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                  {preset.label}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                {preset.description}
              </p>
            </div>
            
            <span className={`ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded border ${
              isActive ? 'bg-white border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
              {preset.badge}
            </span>
          </button>
        );
      })}
      
      {activePresetIndex === -1 && (
        <div className="text-center py-2 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <span className="text-[10px] font-medium text-gray-500">Custom Configuration Active</span>
        </div>
      )}
    </div>
  );
};