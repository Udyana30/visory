import React from 'react';
import { Type, Wand2 } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';
import { Reference } from '../../../types/domain/reference';
import { ScenePrompt } from '../form/ScenePrompt';
import { ReferenceSelector } from '../form/ReferenceSelector';

interface SceneContextProps {
  scene: SceneVisualization | undefined;
  references: Reference[];
  onChange: (field: keyof SceneVisualization, value: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const SceneContext: React.FC<SceneContextProps> = ({
  scene,
  references,
  onChange,
  onGenerate,
  isGenerating
}) => {
  if (!scene) return null;

  const canGenerate = scene.prompt.trim() && !isGenerating;

  const handleReferenceToggle = (id: string) => {
    const updated = scene.characters.includes(id)
      ? scene.characters.filter(cid => cid !== id)
      : [...scene.characters, id];
    onChange('characters', updated);
  };

  return (
    <div className="h-full flex flex-col p-5 bg-white">
      <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-xs uppercase tracking-wide shrink-0">
        <Type className="w-3.5 h-3.5" />
        Description & Context
      </div>

      <div className="shrink-0 mb-3">
         <ReferenceSelector 
          references={references} 
          selectedIds={scene.characters} 
          onToggle={handleReferenceToggle} 
        />
      </div>

      <div className="flex-1 min-h-0 mb-4 relative">
        <ScenePrompt
          prompt={scene.prompt}
          references={references}
          onChange={(val) => onChange('prompt', val)}
          onMention={(id) => !scene.characters.includes(id) && handleReferenceToggle(id)}
          disabled={isGenerating}
          className="h-full"
        />
      </div>

      <div className="shrink-0 pt-3 border-t border-gray-100">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none active:scale-[0.98]"
        >
          <Wand2 className="w-4 h-4" />
          {isGenerating ? 'Generating...' : scene.imageUrl ? 'Regenerate Scene' : 'Generate Scene'}
        </button>
      </div>
    </div>
  );
};