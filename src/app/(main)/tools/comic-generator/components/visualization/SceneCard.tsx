import React, { useState } from 'react';
import { MoreVertical, ChevronDown, Trash2 } from 'lucide-react';
import { Character } from '@/types/comic';
import { SceneVisualization } from '@/types/scene';
import {
  ASPECT_RATIOS,
  SHOT_TYPES,
  SHOT_SIZES,
  SHOT_ANGLES,
  LIGHTING_OPTIONS,
  MOOD_OPTIONS,
  COMPOSITION_OPTIONS
} from '@/lib/scene';

interface SceneCardProps {
  scene: SceneVisualization;
  index: number;
  characters: Character[];
  onChange: (field: keyof SceneVisualization, value: string | string[]) => void;
  onDelete: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  characters,
  onChange,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const toggleCharacter = (charId: string) => {
    const updated = scene.characters.includes(charId)
      ? scene.characters.filter(id => id !== charId)
      : scene.characters.length < 2
      ? [...scene.characters, charId]
      : scene.characters;
    onChange('characters', updated);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-400 to-teal-500">
        <h3 className="text-white font-semibold text-lg">Scene {index + 1}</h3>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-white hover:bg-white/20 p-1 rounded transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Scene
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {scene.imageUrl && (
          <div className="mb-6">
            <img
              src={scene.imageUrl}
              alt={`Scene ${index + 1}`}
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}

        {characters.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Characters (up to 2, optional)
            </label>
            <div className="flex flex-wrap gap-3">
              {characters.map(char => {
                const isSelected = scene.characters.includes(char.id);
                return (
                  <button
                    key={char.id}
                    onClick={() => toggleCharacter(char.id)}
                    disabled={!isSelected && scene.characters.length >= 2}
                    className={`relative ${
                      isSelected
                        ? 'ring-2 ring-teal-500'
                        : 'opacity-60 hover:opacity-100'
                    } rounded-lg overflow-hidden transition disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                      <p className="text-white text-xs font-medium">{char.name}</p>
                      {isSelected && (
                        <span className="text-[10px] bg-teal-500 text-white px-1.5 py-0.5 rounded">
                          Character {scene.characters.indexOf(char.id) + 1}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-800">
              Scene Description
            </label>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {isExpanded && (
            <textarea
              value={scene.prompt}
              onChange={(e) => onChange('prompt', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-700 resize-none"
              placeholder="Describe your scene in detail..."
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Aspect Ratio</label>
            <select
              value={scene.aspectRatio}
              onChange={(e) => onChange('aspectRatio', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {ASPECT_RATIOS.map(ratio => (
                <option key={ratio} value={ratio}>{ratio}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Shot Type</label>
            <select
              value={scene.shotType}
              onChange={(e) => onChange('shotType', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {SHOT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Shot Size</label>
            <select
              value={scene.shotSize}
              onChange={(e) => onChange('shotSize', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {SHOT_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Shot Angle</label>
            <select
              value={scene.shotAngle}
              onChange={(e) => onChange('shotAngle', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {SHOT_ANGLES.map(angle => (
                <option key={angle} value={angle}>{angle}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Lighting</label>
            <select
              value={scene.lighting}
              onChange={(e) => onChange('lighting', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {LIGHTING_OPTIONS.map(light => (
                <option key={light} value={light}>{light}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Mood</label>
            <select
              value={scene.mood}
              onChange={(e) => onChange('mood', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {MOOD_OPTIONS.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Composition</label>
            <select
              value={scene.composition}
              onChange={(e) => onChange('composition', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm text-gray-800"
            >
              {COMPOSITION_OPTIONS.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};