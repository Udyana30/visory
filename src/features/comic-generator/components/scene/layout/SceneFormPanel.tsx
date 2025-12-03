import React from 'react';
import { Wand2, Trash2, Settings2, Type } from 'lucide-react';
import { SceneVisualization } from '../../../types/domain/scene';
import { Reference } from '../../../types/domain/reference';
import { ReferenceSelector } from '../form/ReferenceSelector';
import { ScenePrompt } from '../form/ScenePrompt';
import { SceneSettings } from '../form/SceneSettings';

interface SceneFormPanelProps {
  scene: SceneVisualization | undefined;
  references: Reference[];
  isGenerating: boolean;
  onChange: (field: keyof SceneVisualization, value: any) => void;
  onGenerate: () => void;
  onDelete: () => void;
}

export const SceneFormPanel: React.FC<SceneFormPanelProps> = ({
  scene,
  references,
  isGenerating,
  onChange,
  onGenerate,
  onDelete
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
    <div className="h-full bg-white flex flex-col border-t border-gray-200">
      <div className="flex flex-1 min-h-0 divide-x divide-gray-200">
        
        <div className="w-1/2 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-xs uppercase tracking-wide">
            <Settings2 className="w-3.5 h-3.5" />
            Configuration
          </div>
          <SceneSettings 
            scene={scene} 
            onChange={onChange} 
            disabled={isGenerating}
          />
          <div className="mt-6 pt-6 border-t border-gray-100">
             <button 
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 transition-colors px-3 py-2 hover:bg-red-50 rounded-lg w-fit"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Scene
              </button>
          </div>
        </div>

        <div className="w-1/2 p-6 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-xs uppercase tracking-wide">
              <Type className="w-3.5 h-3.5" />
              Description & Context
            </div>
            
            <ScenePrompt
              prompt={scene.prompt}
              references={references}
              onChange={(val) => onChange('prompt', val)}
              onMention={(id) => !scene.characters.includes(id) && handleReferenceToggle(id)}
              disabled={isGenerating}
            />

            <div className="mt-4">
              <ReferenceSelector 
                references={references} 
                selectedIds={scene.characters} 
                onToggle={handleReferenceToggle} 
              />
            </div>
          </div>

          <div className="pt-4 mt-auto border-t border-gray-100">
            <button
              onClick={onGenerate}
              disabled={!canGenerate}
              className="w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none active:scale-[0.98]"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? 'Generating...' : scene.imageUrl ? 'Regenerate Scene' : 'Generate Scene'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};