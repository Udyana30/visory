import React from 'react';
import { Settings2 } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';
import { SceneSettings } from '../form/SceneSettings';

interface SceneConfigurationProps {
  scene: SceneVisualization | undefined;
  onChange: (field: keyof SceneVisualization, value: any) => void;
  isGenerating: boolean;
}

export const SceneConfiguration: React.FC<SceneConfigurationProps> = ({
  scene,
  onChange,
  isGenerating
}) => {
  if (!scene) return null;

  return (
    <div className="h-full p-5 bg-white flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-xs uppercase tracking-wide shrink-0">
        <Settings2 className="w-3.5 h-3.5" />
        Configuration
      </div>
      
      <div className="flex-1 min-h-0">
        <SceneSettings 
          scene={scene} 
          onChange={onChange} 
          disabled={isGenerating}
        />
      </div>
    </div>
  );
};