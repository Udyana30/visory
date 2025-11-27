import React, { useState } from 'react';
import { MoreVertical, Trash2, Wand2 } from 'lucide-react';
import { SceneVisualization } from '../../types/domain/scene';
import { Reference } from '../../types/domain/reference';
import { ReferenceSelector } from './ReferenceSelector';
import { SceneSettings } from './SceneSettings';
import { ScenePrompt } from './ScenePrompt';

interface SceneCardProps {
  scene: SceneVisualization;
  index: number;
  references: Reference[];
  isGenerating: boolean;
  onChange: (field: keyof SceneVisualization, value: any) => void;
  onDelete: () => void;
  onGenerate: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  references,
  isGenerating,
  onChange,
  onDelete,
  onGenerate
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const canGenerate = scene.prompt.trim() && !isGenerating;

  const handleReferenceToggle = (id: string) => {
    const updated = scene.characters.includes(id)
      ? scene.characters.filter(cid => cid !== id)
      : [...scene.characters, id];
    onChange('characters', updated);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-500 to-teal-600">
        <h3 className="text-white font-bold text-lg tracking-wide">Scene {index + 1}</h3>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-white/90 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-1">
              <button
                onClick={onDelete}
                className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Scene
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {isGenerating ? (
          <div className="mb-6 aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-teal-200">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-teal-800 animate-pulse">Creating your masterpiece...</p>
          </div>
        ) : scene.imageUrl ? (
          <div className="mb-6 group relative">
            <img 
              src={scene.imageUrl} 
              alt={`Scene ${index + 1}`} 
              className="w-full rounded-xl shadow-sm object-cover aspect-video" 
            />
          </div>
        ) : null}

        <ReferenceSelector 
          references={references} 
          selectedIds={scene.characters} 
          onToggle={handleReferenceToggle} 
        />

        <ScenePrompt
          prompt={scene.prompt}
          references={references}
          onChange={(val) => onChange('prompt', val)}
          onMention={(id) => !scene.characters.includes(id) && handleReferenceToggle(id)}
          disabled={isGenerating}
        />

        <SceneSettings 
          scene={scene} 
          onChange={onChange} 
          disabled={isGenerating}
        />

        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-100 disabled:text-gray-400 shadow-sm disabled:shadow-none"
        >
          <Wand2 className="w-4 h-4" />
          {isGenerating ? 'Generating...' : scene.imageUrl ? 'Regenerate Scene' : 'Generate Scene'}
        </button>
      </div>
    </div>
  );
};